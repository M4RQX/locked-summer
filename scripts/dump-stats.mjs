#!/usr/bin/env node
// READ-ONLY dump of workout/weight stats for analysis.
// Usage: NEON_URL="postgres://…" node scripts/dump-stats.mjs [--user "Tiago"]
// No writes. Safe to run anytime. Output goes to stdout (GH Actions log).

import { neon } from '@neondatabase/serverless';

function arg(flag) {
  const i = process.argv.indexOf(flag);
  if (i < 0 || i === process.argv.length - 1) return null;
  return process.argv[i + 1];
}

const url = process.env.NEON_URL || process.env.VITE_DATABASE_URL;
if (!url) { console.error('❌ NEON_URL não definido.'); process.exit(1); }
const onlyUser = arg('--user');
const sql = neon(url);

const users = await sql`select id, name, target_calories, target_protein, target_weight_kg, start_weight_kg, created_at from users order by name asc`;

for (const u of users) {
  if (onlyUser && u.name.toLowerCase() !== onlyUser.toLowerCase()) continue;
  console.log('\n========================================');
  console.log(`USER: ${u.name}`);
  console.log(`  alvo: ${u.target_calories}kcal / ${u.target_protein}g prot / peso-alvo ${u.target_weight_kg}kg / inicial ${u.start_weight_kg}kg`);
  console.log(`  criado: ${String(u.created_at).slice(0,10)}`);

  const wstats = await sql`
    select count(*)::int as total,
           count(completed_at)::int as completed,
           min(date)::text as first_date,
           max(date)::text as last_date,
           count(*) filter (where date >= current_date - 30)::int as last30
    from workouts where user_id = ${u.id}`;
  const ws = wstats[0];
  console.log(`\n  TREINOS: ${ws.total} total (${ws.completed} concluídos) | ${ws.first_date ?? '—'} → ${ws.last_date ?? '—'} | últimos 30d: ${ws.last30}`);

  const byDay = await sql`
    select day_type, count(*)::int as n
    from workouts where user_id = ${u.id} group by day_type order by day_type`;
  console.log(`  por dia: ${byDay.map(d => `${d.day_type}=${d.n}`).join(' ') || '—'}`);

  const recent = await sql`
    select w.date::text as date, w.day_type, w.duration_minutes,
           count(s.id)::int as sets
    from workouts w left join workout_sets s on s.workout_id = w.id
    where w.user_id = ${u.id}
    group by w.id, w.date, w.day_type, w.duration_minutes
    order by w.date desc limit 10`;
  console.log(`\n  ÚLTIMOS TREINOS:`);
  for (const r of recent) console.log(`    ${r.date} · Dia ${r.day_type} · ${r.sets} sets · ${r.duration_minutes ?? '—'}min`);

  const perEx = await sql`
    with sets as (
      select s.exercise_name, w.date, s.weight_kg::float as w, s.reps, s.is_pr
      from workout_sets s join workouts w on s.workout_id = w.id
      where w.user_id = ${u.id} and s.weight_kg is not null
    ),
    agg as (
      select exercise_name,
             count(distinct date)::int as sessions,
             count(*)::int as total_sets,
             max(w) as max_w,
             count(*) filter (where is_pr)::int as prs
      from sets group by exercise_name
    )
    select * from agg order by sessions desc, max_w desc`;
  console.log(`\n  EXERCÍCIOS (${perEx.length}):`);
  for (const e of perEx) {
    // first vs latest max-per-session to show progression
    const prog = await sql`
      select date::text as date, max(s.weight_kg)::float as mw
      from workout_sets s join workouts w on s.workout_id = w.id
      where w.user_id = ${u.id} and s.exercise_name = ${e.exercise_name} and s.weight_kg is not null
      group by date order by date`;
    const first = prog[0], last = prog[prog.length - 1];
    const delta = first && last ? (last.mw - first.mw) : 0;
    console.log(`    ${e.exercise_name} | ${e.sessions} sessões · ${e.total_sets} sets · max ${e.max_w}kg · ${e.prs} PRs · ${first?.mw ?? '—'}→${last?.mw ?? '—'}kg (Δ${delta>=0?'+':''}${delta.toFixed(1)})`);
  }

  const wl = await sql`
    select date::text as date, weight_kg::float as kg, body_fat_pct, muscle_pct
    from weight_logs where user_id = ${u.id} order by date`;
  if (wl.length) {
    const f = wl[0], l = wl[wl.length-1];
    console.log(`\n  PESO: ${wl.length} registos | ${f.date}: ${f.kg}kg → ${l.date}: ${l.kg}kg (Δ${(l.kg-f.kg)>=0?'+':''}${(l.kg-f.kg).toFixed(1)}kg)`);
    if (l.body_fat_pct != null) console.log(`    último: BF ${l.body_fat_pct}% · músculo ${l.muscle_pct ?? '—'}%`);
  } else {
    console.log(`\n  PESO: sem registos`);
  }

  const meals = await sql`select count(*)::int as n, count(distinct date)::int as days from meal_logs where user_id = ${u.id}`;
  console.log(`\n  NUTRIÇÃO: ${meals[0].n} refeições logadas em ${meals[0].days} dias`);
}
console.log('\n========================================\nFIM');

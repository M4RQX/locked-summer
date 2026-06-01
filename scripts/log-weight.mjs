#!/usr/bin/env node
// Log a body-weight entry for a user.
// Usage:
//   NEON_URL="…" node scripts/log-weight.mjs --user "Emanuel" --kg 63 [--date 2026-05-28] [--bf 15] [--muscle 40]
// Upserts on (user_id, date) — running twice for the same day overwrites.

import { neon } from '@neondatabase/serverless';

function arg(flag) {
  const i = process.argv.indexOf(flag);
  if (i < 0 || i === process.argv.length - 1) return null;
  return process.argv[i + 1];
}

const url = process.env.NEON_URL || process.env.VITE_DATABASE_URL;
if (!url) { console.error('❌ NEON_URL não definido.'); process.exit(1); }

const userName = arg('--user');
const kg = arg('--kg');
const date = arg('--date'); // optional → defaults to current_date
const bf = arg('--bf');
const muscle = arg('--muscle');

if (!userName || !kg) {
  console.error('Uso: node scripts/log-weight.mjs --user "<Nome>" --kg <peso> [--date YYYY-MM-DD] [--bf <%>] [--muscle <%>]');
  process.exit(1);
}

const sql = neon(url);

const users = await sql`select id, name, start_weight_kg, target_weight_kg from users where name = ${userName} limit 1`;
if (users.length === 0) { console.error(`❌ User "${userName}" não existe.`); process.exit(1); }
const u = users[0];

try {
  const rows = await sql`
    insert into weight_logs (user_id, date, weight_kg, body_fat_pct, muscle_pct)
    values (
      ${u.id},
      coalesce(${date ?? null}::date, current_date),
      ${kg},
      ${bf ?? null},
      ${muscle ?? null}
    )
    on conflict (user_id, date) do update
      set weight_kg = excluded.weight_kg,
          body_fat_pct = coalesce(excluded.body_fat_pct, weight_logs.body_fat_pct),
          muscle_pct = coalesce(excluded.muscle_pct, weight_logs.muscle_pct)
    returning date::text as date, weight_kg::float as kg
  `;
  const r = rows[0];
  console.log(`✓ Peso registado: ${u.name} · ${r.date} · ${r.kg}kg`);

  // Show progress vs goal
  const start = Number(u.start_weight_kg), target = Number(u.target_weight_kg), now = Number(r.kg);
  const doneTxt = `${(now - start).toFixed(1)}kg desde o início (${start}→${now}, alvo ${target})`;
  const remaining = (target - now).toFixed(1);
  console.log(`  progresso: ${doneTxt} · faltam ${remaining}kg para o alvo`);

  const all = await sql`select date::text as date, weight_kg::float as kg from weight_logs where user_id = ${u.id} order by date`;
  console.log(`\n  Histórico de peso (${all.length}):`);
  for (const w of all) console.log(`    ${w.date}: ${w.kg}kg`);
} catch (err) {
  console.error('✗ Falhou:', err.message);
  process.exit(1);
}

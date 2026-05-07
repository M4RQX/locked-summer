#!/usr/bin/env node
// One-shot food correction script (2026-05-07).
// Corrige valores nutricionais com base em fontes oficiais (McDonald's PT, KFC int).
// - Apaga 3 entries antigas (Menu Big Mac combinado, Wrap nome antigo, Visconde nome longo)
//   apenas se 0 meal_logs as referenciarem (safety guard).
// - UPSERT 6 entries com valores corrigidos.
// Usage: NEON_URL="…" node scripts/update-foods-2026-05-07.mjs

import { neon } from '@neondatabase/serverless';

const url = process.env.NEON_URL;
if (!url) { console.error('NEON_URL needed'); process.exit(1); }
const sql = neon(url);

async function safeRemove(name) {
  const refs = await sql`select count(*)::int as n from meal_logs ml join foods f on ml.food_id = f.id where f.name = ${name}`;
  if (refs[0].n === 0) {
    await sql`delete from foods where name = ${name}`;
    console.log('✓ removed:', name);
  } else {
    console.log('⚠ kept (has', refs[0].n, 'logs):', name);
  }
}

const FOODS = [
  // McDonald's PT — oficial (mcdonalds.pt 2026)
  { name: 'Big Mac (sanduíche)',                       cat: 'lunch', kcal: 544, p: 27, c: 42, g: 29, portion: '236g (1 sanduíche)' },
  { name: "Batatas fritas médias (McDonald's)",        cat: 'lunch', kcal: 295, p: 4,  c: 36, g: 15, portion: '117g (média)' },
  { name: "Coca-Cola 400ml (McDonald's)",              cat: 'lunch', kcal: 168, p: 0,  c: 42, g: 0,  portion: '400ml' },
  { name: "Snack Wrap Chicken Cheese (McDonald's)",    cat: 'lunch', kcal: 356, p: 30, c: 13, g: 18, portion: '136g (1 wrap)' },
  // KFC — base internacional Zinger ~425kcal + 1 slice cheddar ~55kcal
  { name: 'Cheddar Zinger Burger (KFC)',               cat: 'lunch', kcal: 480, p: 28, c: 44, g: 22, portion: '~210g (1 burger)' },
  // Burger gourmet — estimativa (sem dados oficiais)
  { name: 'Hamburger Visconde Chanceleiros (est.)',    cat: 'lunch', kcal: 850, p: 45, c: 50, g: 50, portion: '1 burger (~350g, est.)' },
];

async function main() {
  await safeRemove('Menu Big Mac (médio)');
  await safeRemove("Wrap Cheese (McDonald's)");
  await safeRemove('Hamburger Visconde Chanceleiros (Sal e Pimenta, est.)');

  for (const f of FOODS) {
    await sql`
      insert into foods (name, category, kcal, protein_g, carbs_g, fat_g, default_portion, is_default)
      values (${f.name}, ${f.cat}, ${f.kcal}, ${f.p}, ${f.c}, ${f.g}, ${f.portion}, true)
      on conflict (name) do update set
        kcal = excluded.kcal,
        protein_g = excluded.protein_g,
        carbs_g = excluded.carbs_g,
        fat_g = excluded.fat_g,
        default_portion = excluded.default_portion
    `;
    console.log('✓ upsert:', f.name, '-', f.kcal, 'kcal');
  }

  const { 0: { n } } = await sql`select count(*)::int as n from foods`;
  console.log(`\n🔥 Total foods: ${n}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

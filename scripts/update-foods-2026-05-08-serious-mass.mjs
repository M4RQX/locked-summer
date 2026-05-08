#!/usr/bin/env node
// Calibração específica para Serious Mass (Optimum Nutrition) — confirmado pelo
// user via link Zumub PT (2026-05-08).
//
// Source oficial Zumub: https://www.zumub.com/PT/gainer/serious-mass
//   1 scoop = 167g, dose recomendada = 2 scoops = 334g (com água):
//     1259 kcal · 53.1g P · 252.4g C (29.7 açúcar) · 4.4g G
//
// User toma 250g por shake (≈1.5 scoops). Valores escalados proporcionalmente:
//   factor = 250/334 = 0.7485
//   kcal = 1259 × 0.7485 = 942
//   P = 53.1 × 0.7485 = 39.7g
//   C = 252.4 × 0.7485 = 189g
//   G = 4.4 × 0.7485 = 3.3g
//
// Note: Serious Mass tem MUITO pouca gordura (4.4g por dose 334g) — o valor
// anterior de 8g/250g estava sobrestimado ~2.4×.
//
// Usage: NEON_URL="…" node scripts/update-foods-2026-05-08-serious-mass.mjs

import { neon } from '@neondatabase/serverless';

const url = process.env.NEON_URL;
if (!url) { console.error('NEON_URL needed'); process.exit(1); }
const sql = neon(url);

const OLD_NAME = 'Mass gainer (dose 250g)';
const NEW_NAME = 'Serious Mass (Optimum Nutrition) — 250g';

const VALUES = {
  cat: 'shake',
  kcal: 942,
  p: 39.7,
  c: 189,
  g: 3.3,
  portion: '250g (≈1.5 scoops oficiais)',
};

async function main() {
  const before = await sql`select id, name, kcal, protein_g, carbs_g, fat_g, default_portion from foods where name = ${OLD_NAME}`;
  if (before.length === 0) {
    console.error(`❌ Row "${OLD_NAME}" not found in DB`);
    process.exit(1);
  }
  const b = before[0];

  const collision = await sql`select id from foods where name = ${NEW_NAME}`;
  if (collision.length > 0 && collision[0].id !== b.id) {
    console.error(`❌ Target name "${NEW_NAME}" already exists in another row`);
    process.exit(1);
  }

  await sql`
    update foods
    set name = ${NEW_NAME},
        category = ${VALUES.cat},
        kcal = ${VALUES.kcal},
        protein_g = ${VALUES.p},
        carbs_g = ${VALUES.c},
        fat_g = ${VALUES.g},
        default_portion = ${VALUES.portion}
    where id = ${b.id}
  `;

  console.log(`✓ Atualizado: "${b.name}" → "${NEW_NAME}"`);
  console.log(`  kcal: ${b.kcal} → ${VALUES.kcal}`);
  console.log(`  P:    ${b.protein_g} → ${VALUES.p}`);
  console.log(`  C:    ${b.carbs_g} → ${VALUES.c}`);
  console.log(`  G:    ${b.fat_g} → ${VALUES.g}  (era sobrestimado ~2.4×)`);
  console.log(`  portion: "${b.default_portion}" → "${VALUES.portion}"`);

  console.log('\n📊 Total Shake LOCKED com novos valores:');
  const shakeFoods = await sql`
    select name, kcal, protein_g, carbs_g, fat_g
    from foods
    where name in (${NEW_NAME}, 'Aveia', 'Leite gordo', 'Banana', 'Morango', 'Mel')
    order by kcal desc
  `;
  let totK = 0, totP = 0, totC = 0, totG = 0;
  for (const f of shakeFoods) {
    console.log(`  ${f.name.padEnd(45)} ${String(f.kcal).padStart(6)}kcal · ${String(f.protein_g).padStart(5)}P · ${String(f.carbs_g).padStart(5)}C · ${String(f.fat_g).padStart(5)}G`);
    totK += Number(f.kcal); totP += Number(f.protein_g); totC += Number(f.carbs_g); totG += Number(f.fat_g);
  }
  console.log(`  ${'TOTAL'.padEnd(45)} ${String(Math.round(totK)).padStart(6)}kcal · ${String(totP.toFixed(1)).padStart(5)}P · ${String(totC.toFixed(1)).padStart(5)}C · ${String(totG.toFixed(1)).padStart(5)}G`);
}

main().catch((e) => { console.error('💥', e.message); process.exit(1); });

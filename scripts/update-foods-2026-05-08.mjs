#!/usr/bin/env node
// Calibration of seed foods to most reliable available sources (2026-05-08).
//
// Sources:
//   - Pastel de nata: Continente/Nutripédia + pastel-de-nata.pt nutrition (per 80g unit)
//   - Folhado de salsicha: FatSecret Pingo Doce 100g (scaled to ~85g unit)
//   - Compal de laranja 200ml: compal.pt Néctar Clássico oficial
//   - Bitoque: NiT + iguaria.com average of recipe variants
//   - Hambúrguer caseiro: USDA standard for 150g beef patty + bun
//   - Mass gainer: typical industry profile for 250g dose (was misleading
//     when called "1 scoop" — most brands have 50-100g scoops)
//
// Usage: NEON_URL="…" node scripts/update-foods-2026-05-08.mjs

import { neon } from '@neondatabase/serverless';

const url = process.env.NEON_URL;
if (!url) { console.error('NEON_URL needed'); process.exit(1); }
const sql = neon(url);

// Updates by current name. UPDATE preserves id and meal_logs FK.
const FIELD_UPDATES = [
  { name: 'Pastel de nata',
    kcal: 240, p: 2.3, c: 38.8, g: 8.2, portion: '1 unidade (~80g)' },
  { name: 'Folhado de salsicha',
    kcal: 306, p: 6.4, c: 18.3, g: 22.9, portion: '1 unidade (~85g)' },
  { name: 'Compal de laranja',
    kcal: 111, p: 0.4, c: 26, g: 0, portion: '200ml (1 copo)' },
  { name: 'Bitoque (carne+ovo+batata+arroz)',
    kcal: 720, p: 38, c: 70, g: 32, portion: '1 dose completa' },
];

// Renames + value updates. Atomic UPDATE (keeps id, doesn't break meal_logs FK).
const RENAMES = [
  { oldName: 'Hambúrguer médio',
    newName: 'Hambúrguer caseiro (carne 150g + pão)',
    cat: 'lunch',
    kcal: 480, p: 28, c: 35, g: 22, portion: '1 unidade' },
  { oldName: 'Mass gainer (1 scoop)',
    newName: 'Mass gainer (dose 250g)',
    cat: 'shake',
    kcal: 920, p: 45, c: 152, g: 8, portion: '250g (~3 scoops típicos)' },
];

async function main() {
  console.log('🔄 Calibrando valores nutricionais com fontes oficiais\n');

  for (const f of FIELD_UPDATES) {
    const before = await sql`select kcal, protein_g, carbs_g, fat_g, default_portion from foods where name = ${f.name}`;
    if (before.length === 0) {
      console.log(`⚠ skip ${f.name}: not found in DB`);
      continue;
    }
    const b = before[0];
    await sql`
      update foods
      set kcal = ${f.kcal},
          protein_g = ${f.p},
          carbs_g = ${f.c},
          fat_g = ${f.g},
          default_portion = ${f.portion}
      where name = ${f.name}
    `;
    console.log(`✓ ${f.name}`);
    console.log(`  kcal: ${b.kcal} → ${f.kcal}    P: ${b.protein_g} → ${f.p}    C: ${b.carbs_g} → ${f.c}    G: ${b.fat_g} → ${f.g}`);
    console.log(`  portion: "${b.default_portion}" → "${f.portion}"`);
  }

  console.log('');
  for (const r of RENAMES) {
    const before = await sql`select id, kcal, default_portion from foods where name = ${r.oldName}`;
    if (before.length === 0) {
      console.log(`⚠ skip rename ${r.oldName}: not found`);
      continue;
    }
    const collision = await sql`select id from foods where name = ${r.newName}`;
    if (collision.length > 0 && collision[0].id !== before[0].id) {
      console.log(`⚠ skip rename ${r.oldName} → ${r.newName}: target name already exists`);
      continue;
    }
    await sql`
      update foods
      set name = ${r.newName},
          category = ${r.cat},
          kcal = ${r.kcal},
          protein_g = ${r.p},
          carbs_g = ${r.c},
          fat_g = ${r.g},
          default_portion = ${r.portion}
      where id = ${before[0].id}
    `;
    console.log(`✓ rename "${r.oldName}" → "${r.newName}"`);
    console.log(`  kcal: ${before[0].kcal} → ${r.kcal}, portion: "${before[0].default_portion}" → "${r.portion}"`);
  }

  console.log('\n📊 Estado final dos alimentos modificados:');
  const allNames = [...FIELD_UPDATES.map((f) => f.name), ...RENAMES.map((r) => r.newName)];
  for (const name of allNames) {
    const rows = await sql`select name, kcal, protein_g, carbs_g, fat_g, default_portion from foods where name = ${name}`;
    if (rows.length === 0) continue;
    const r = rows[0];
    console.log(`  ${r.name}: ${r.kcal}kcal · ${r.protein_g}P · ${r.carbs_g}C · ${r.fat_g}G · ${r.default_portion}`);
  }

  const total = await sql`select count(*)::int as n from foods`;
  console.log(`\n✓ Total foods: ${total[0].n}`);
}

main().catch((e) => { console.error('💥', e.message); process.exit(1); });

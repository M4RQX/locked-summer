#!/usr/bin/env node
// Add a user to the locked-summer DB.
// Usage:
//   NEON_URL="postgres://…" node scripts/add-user.mjs --name "Salvador" --password "123"
//
// Defaults for nutrition/weight targets are the same as the original
// bootstrap (Emanuel/Tiago). User can change them later via /definicoes.

import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

function arg(flag) {
  const i = process.argv.indexOf(flag);
  if (i < 0 || i === process.argv.length - 1) return null;
  return process.argv[i + 1];
}

const name = arg('--name');
const password = arg('--password');
const url = process.env.NEON_URL || process.env.VITE_DATABASE_URL;

if (!name || !password) {
  console.error('Uso: node scripts/add-user.mjs --name "<Nome>" --password "<password>"');
  process.exit(1);
}
if (!url) {
  console.error('❌ NEON_URL ou VITE_DATABASE_URL não definido.');
  process.exit(1);
}

const sql = neon(url);
const hash = await bcrypt.hash(password, 10);

try {
  const rows = await sql`
    insert into users (name, password_hash, target_calories, target_protein, target_weight_kg, start_weight_kg)
    values (${name}, ${hash}, 3000, 150, 80, 72)
    on conflict (name) do update set password_hash = excluded.password_hash
    returning id, name
  `;
  console.log(`✓ User upserted: ${rows[0].name} (${rows[0].id})`);

  const all = await sql`select name from users order by name asc`;
  console.log('\nUsers actuais:');
  for (const u of all) console.log(`  - ${u.name}`);
} catch (err) {
  console.error('✗ INSERT failed:', err.message);
  process.exit(1);
}

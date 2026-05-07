#!/usr/bin/env node
// One-shot DB bootstrap. Reads NEON_URL from env, applies schema + seed + users.
// Usage: NEON_URL="postgres://…" node scripts/bootstrap-db.mjs
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon, neonConfig } from '@neondatabase/serverless';

neonConfig.fetchConnectionCache = true;

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const url = process.env.NEON_URL || process.env.VITE_DATABASE_URL;
if (!url) {
  console.error('❌ NEON_URL não definido. Usa: NEON_URL="postgres://…" node scripts/bootstrap-db.mjs');
  process.exit(1);
}

const sql = neon(url);

async function runFile(label, path) {
  console.log(`\n→ ${label}: ${path}`);
  const raw = await readFile(resolve(root, path), 'utf8');
  // Strip line-level comments first, then split on top-level semicolons.
  const content = raw
    .split('\n')
    .filter((l) => !l.trim().startsWith('--'))
    .join('\n');
  const statements = content
    .split(/;\s*\n/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const stmt of statements) {
    try {
      // neon HTTP driver: function-call form `sql(text, params?)` for raw SQL.
      await sql(stmt);
      const first = stmt.split('\n')[0].slice(0, 80);
      console.log(`  ✓ ${first}${stmt.length > 80 ? '…' : ''}`);
    } catch (err) {
      console.error(`  ✗ failed: ${stmt.split('\n')[0].slice(0, 100)}`);
      throw err;
    }
  }
}

async function bootstrapUsers() {
  const HASH_EMANUEL = process.env.HASH_EMANUEL;
  const HASH_TIAGO = process.env.HASH_TIAGO;
  if (!HASH_EMANUEL || !HASH_TIAGO) {
    console.error('\n⚠️  HASH_EMANUEL ou HASH_TIAGO não definido — skip users');
    return;
  }
  console.log('\n→ Inserting users (Emanuel, Tiago)');
  const before = await sql`select count(*)::int as n from users`;
  await sql`
    insert into users (name, password_hash, target_calories, target_protein, target_weight_kg, start_weight_kg)
    values
      ('Emanuel', ${HASH_EMANUEL}, 3000, 150, 80, 72),
      ('Tiago',   ${HASH_TIAGO},   3000, 130, 80, 72)
    on conflict (name) do update set password_hash = excluded.password_hash
  `;
  const after = await sql`select count(*)::int as n from users`;
  console.log(`  ✓ users table: ${before[0].n} → ${after[0].n}`);
}

async function main() {
  console.log('🔒☀️ LOCKED SUMMER — DB bootstrap');
  console.log(`   Neon endpoint: ${url.replace(/:[^@]+@/, ':***@')}`);

  await runFile('Schema', 'migrations/001_init.sql');
  await runFile('Seed (foods)', 'migrations/002_seed.sql');
  await bootstrapUsers();

  // Sanity check
  const t = await sql`select count(*)::int as n from foods`;
  const u = await sql`select name from users order by name`;
  console.log(`\n✓ Foods seeded: ${t[0].n}`);
  console.log(`✓ Users: ${u.map((x) => x.name).join(', ')}`);
  console.log('\n🔥 Bootstrap completo. Locked in.');
}

main().catch((err) => {
  console.error('\n💥', err.message || err);
  process.exit(1);
});

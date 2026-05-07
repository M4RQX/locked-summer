#!/usr/bin/env node
// Usage: node scripts/hash-password.mjs "minha password"
import bcrypt from 'bcryptjs';

const pw = process.argv.slice(2).join(' ');
if (!pw) {
  console.error('Uso: node scripts/hash-password.mjs "<password>"');
  process.exit(1);
}
const hash = await bcrypt.hash(pw, 10);
console.log(hash);

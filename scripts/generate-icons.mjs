// Generate PNG icons for PWA from public/favicon.svg.
// Runs as prebuild step. Requires `sharp`.
import { readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const svgPath = resolve(root, 'public/favicon.svg');
const outDir = resolve(root, 'public/icons');

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

async function main() {
  const svg = await readFile(svgPath);
  await mkdir(outDir, { recursive: true });
  for (const { name, size } of sizes) {
    const out = resolve(outDir, name);
    await sharp(svg).resize(size, size).png().toFile(out);
    console.log(`✓ ${name} (${size}×${size})`);
  }
  await sharp(svg).resize(180, 180).png().toFile(resolve(root, 'public/apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png');
}
main().catch((e) => { console.error(e); process.exit(1); });

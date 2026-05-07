import { neon, neonConfig } from '@neondatabase/serverless';

// Use HTTP fetch — works in browser. No persistent connections.
neonConfig.fetchConnectionCache = true;

const url = import.meta.env.VITE_DATABASE_URL;
if (!url) {
  // eslint-disable-next-line no-console
  console.error('[locked-summer] VITE_DATABASE_URL não está definido. Cria um .env local ou define o secret na build.');
}

// neon() returns a tagged template SQL function.
export const sql = neon(url ?? 'postgresql://invalid:invalid@localhost/invalid');

// Helper: run a parameterized query when you don't want template literal syntax
export async function query<T = unknown>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]> {
  return (await sql(strings, ...values)) as T[];
}

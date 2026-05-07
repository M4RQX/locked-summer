import bcrypt from 'bcryptjs';
import { sql } from './db';
import type { User } from '@/types';

const SESSION_KEY = 'locked-summer:session';

export interface Session {
  userId: string;
  userName: string;
  loggedAt: string;
}

export async function listUserNames(): Promise<string[]> {
  try {
    const rows = (await sql`select name from users order by name asc`) as { name: string }[];
    return rows.map((r) => r.name);
  } catch (err) {
    console.error('[auth] listUserNames failed', err);
    return ['Emanuel', 'Tiago']; // fallback if DB unreachable
  }
}

export async function login(name: string, password: string): Promise<User | null> {
  const rows = (await sql`select * from users where name = ${name} limit 1`) as Array<User & { password_hash: string }>;
  const u = rows[0];
  if (!u) return null;
  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return null;
  // strip hash before storing
  const { password_hash: _ph, ...safe } = u;
  saveSession({ userId: safe.id, userName: safe.name, loggedAt: new Date().toISOString() });
  return safe as User;
}

export function saveSession(s: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export async function getCurrentUser(): Promise<User | null> {
  const s = getSession();
  if (!s) return null;
  const rows = (await sql`select id, name, target_calories, target_protein, target_weight_kg, start_weight_kg, created_at from users where id = ${s.userId} limit 1`) as User[];
  return rows[0] ?? null;
}

export async function getUserByName(name: string): Promise<User | null> {
  const rows = (await sql`select id, name, target_calories, target_protein, target_weight_kg, start_weight_kg, created_at from users where name = ${name} limit 1`) as User[];
  return rows[0] ?? null;
}

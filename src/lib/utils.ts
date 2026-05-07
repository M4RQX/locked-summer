import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

export function fmtDate(d: string | Date, pattern = 'd MMM yyyy'): string {
  const date = typeof d === 'string' ? parseISO(d) : d;
  return format(date, pattern, { locale: pt });
}

export function fmtRelative(d: string | Date): string {
  const date = typeof d === 'string' ? parseISO(d) : d;
  return formatDistanceToNow(date, { addSuffix: true, locale: pt });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function classNames(...xs: Array<string | false | null | undefined>): string {
  return xs.filter(Boolean).join(' ');
}

export function pluralPT(n: number, singular: string, plural: string) {
  return n === 1 ? singular : plural;
}

// Frases motivacionais. O Tiago é o maior 😄 (easter egg).
export const QUOTES = [
  'No days off.',
  'Locked in for summer.',
  'Earn the summer.',
  'Disciplina > motivação.',
  'O verão está a chegar.',
  'Mais 1 série. Sempre.',
  'O Tiago é o maior.',
  'Bulk first. Cut later.',
  'Eat. Lift. Repeat.',
  'Pequenas decisões, grandes resultados.',
  'PR ou nada.',
  'Sem desculpas. Locked.',
  'Hoje começa o resto.',
  'O ginásio não mente.',
  'Trust the process.',
];

export function randomQuote(seed?: number): string {
  const i = seed != null ? seed % QUOTES.length : Math.floor(Math.random() * QUOTES.length);
  return QUOTES[i];
}

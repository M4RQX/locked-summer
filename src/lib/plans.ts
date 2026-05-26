import type { DayPlan } from '@/types';

export const PLANS: DayPlan[] = [
  {
    type: 'A',
    title: 'Dia A',
    subtitle: 'Peito + Tríceps',
    exercises: [
      { name: 'Supino plano (barra ou halteres)', sets: 4, reps: '6-10' },
      { name: 'Supino inclinado com halteres', sets: 3, reps: '8-12' },
      { name: 'Supino plano (máquina)', sets: 3, reps: '8-12' },
      { name: 'Aberturas (peck deck ou cabos cruzados)', sets: 3, reps: '10-15' },
      { name: 'Aberturas (peck deck)', sets: 3, reps: '10-15' },
      { name: 'Tríceps na polia (corda/barra)', sets: 3, reps: '10-12' },
      { name: 'Tríceps testa ou fundos', sets: 3, reps: '8-12' },
    ],
  },
  {
    type: 'B',
    title: 'Dia B',
    subtitle: 'Costas + Bíceps + Antebraço',
    exercises: [
      { name: 'Puxada na polia alta (lat pull-down)', sets: 4, reps: '8-12' },
      { name: 'Remada com barra ou máquina', sets: 3, reps: '8-12' },
      { name: 'Remada unilateral com haltere', sets: 3, reps: '10-12' },
      { name: 'Rosca direta com barra', sets: 3, reps: '8-12' },
      { name: 'Rosca martelo', sets: 3, reps: '10-12' },
      { name: 'Rosca inversa com barra', sets: 3, reps: '10-12' },
      { name: 'Rosca de punho (flexores)', sets: 3, reps: '12-15' },
    ],
  },
  {
    type: 'C',
    title: 'Dia C',
    subtitle: 'Pernas + Ombros + Antebraço',
    exercises: [
      { name: 'Agachamento ou prensa', sets: 4, reps: '8-12' },
      { name: 'Peso morto romeno (stiff)', sets: 3, reps: '8-12' },
      { name: 'Extensão de pernas', sets: 3, reps: '12-15' },
      { name: 'Desenvolvimento de ombros (halteres)', sets: 3, reps: '8-12' },
      { name: 'Elevações laterais', sets: 3, reps: '12-15' },
      { name: 'Superset: rosca scott + tríceps polia', sets: 3, reps: '10-12' },
      { name: 'Rosca de punho inversa (extensores)', sets: 3, reps: '12-15' },
      { name: "Farmer's walk (opcional)", sets: 3, reps: '~30s' },
    ],
  },
];

export function getPlan(dayType: 'A' | 'B' | 'C'): DayPlan {
  return PLANS.find((p) => p.type === dayType)!;
}

export function nextDayType(last: 'A' | 'B' | 'C' | null): 'A' | 'B' | 'C' {
  if (!last) return 'A';
  return last === 'A' ? 'B' : last === 'B' ? 'C' : 'A';
}

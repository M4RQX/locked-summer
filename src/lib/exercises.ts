// Catálogo de exercícios para autocomplete no picker de treinos.
// Não persistido em DB — é uma lista de referência local.
// Adicionar / editar nomes só requer push (zero migrations).

export type MuscleGroup =
  | 'peito' | 'costas' | 'pernas' | 'gluteos' | 'ombros'
  | 'biceps' | 'triceps' | 'antebraco' | 'core' | 'cardio' | 'funcional';

export interface Exercise {
  name: string;
  group: MuscleGroup;
}

export const EXERCISES: Exercise[] = [
  // ---------- PEITO ----------
  { name: 'Supino plano (barra)',                   group: 'peito' },
  { name: 'Supino plano (halteres)',                group: 'peito' },
  { name: 'Supino plano (máquina)',                 group: 'peito' },
  { name: 'Supino inclinado (barra)',               group: 'peito' },
  { name: 'Supino inclinado (halteres)',            group: 'peito' },
  { name: 'Supino inclinado (máquina)',             group: 'peito' },
  { name: 'Supino declinado (barra)',               group: 'peito' },
  { name: 'Supino declinado (halteres)',            group: 'peito' },
  { name: 'Aberturas (peck deck)',                  group: 'peito' },
  { name: 'Aberturas (halteres)',                   group: 'peito' },
  { name: 'Crucifixo cabos cruzados',               group: 'peito' },
  { name: 'Crucifixo banco inclinado',              group: 'peito' },
  { name: 'Crucifixo banco declinado',              group: 'peito' },
  { name: 'Pullover (haltere)',                     group: 'peito' },
  { name: 'Pullover (cabo)',                        group: 'peito' },
  { name: 'Flexões (push-up)',                      group: 'peito' },
  { name: 'Flexões diamante',                       group: 'peito' },
  { name: 'Flexões inclinadas',                     group: 'peito' },
  { name: 'Flexões declinadas',                     group: 'peito' },
  { name: 'Flexões pliométricas',                   group: 'peito' },
  { name: 'Smith machine bench press',              group: 'peito' },
  { name: 'Cable fly low to high',                  group: 'peito' },
  { name: 'Cable fly high to low',                  group: 'peito' },

  // ---------- COSTAS ----------
  { name: 'Puxada na polia alta (frente)',          group: 'costas' },
  { name: 'Puxada na polia alta (atrás)',           group: 'costas' },
  { name: 'Puxada com pega aberta',                 group: 'costas' },
  { name: 'Puxada com pega fechada',                group: 'costas' },
  { name: 'Puxada com pega neutra',                 group: 'costas' },
  { name: 'Lat pulldown unilateral',                group: 'costas' },
  { name: 'Pull-ups',                               group: 'costas' },
  { name: 'Chin-ups',                               group: 'costas' },
  { name: 'Pull-ups assistidos',                    group: 'costas' },
  { name: 'Remada com barra (pronada)',             group: 'costas' },
  { name: 'Remada com barra (supinada)',            group: 'costas' },
  { name: 'Remada T-bar',                           group: 'costas' },
  { name: 'Remada cavalinho',                       group: 'costas' },
  { name: 'Remada unilateral haltere',              group: 'costas' },
  { name: 'Remada baixa (polia)',                   group: 'costas' },
  { name: 'Remada na máquina',                      group: 'costas' },
  { name: 'Remada Pendlay',                         group: 'costas' },
  { name: 'Levantamento terra (deadlift)',          group: 'costas' },
  { name: 'Peso morto romeno (RDL)',                group: 'costas' },
  { name: 'Stiff leg deadlift',                     group: 'costas' },
  { name: 'Hiperextensão lombar',                   group: 'costas' },
  { name: 'Reverse hyperextension',                 group: 'costas' },
  { name: 'Good morning',                           group: 'costas' },
  { name: 'Pulldown corda (face pull baixo)',       group: 'costas' },
  { name: 'Straight-arm pulldown',                  group: 'costas' },
  { name: 'Encolhimentos (shrugs barra)',           group: 'costas' },
  { name: 'Encolhimentos (shrugs halteres)',        group: 'costas' },
  { name: 'Encolhimentos (máquina)',                group: 'costas' },

  // ---------- PERNAS ----------
  { name: 'Agachamento livre',                      group: 'pernas' },
  { name: 'Agachamento smith',                      group: 'pernas' },
  { name: 'Agachamento frontal',                    group: 'pernas' },
  { name: 'Agachamento búlgaro',                    group: 'pernas' },
  { name: 'Agachamento sumô',                       group: 'pernas' },
  { name: 'Agachamento goblet',                     group: 'pernas' },
  { name: 'Agachamento na parede (wall sit)',       group: 'pernas' },
  { name: 'Pistol squat',                           group: 'pernas' },
  { name: 'Box squat',                              group: 'pernas' },
  { name: 'Hack squat',                             group: 'pernas' },
  { name: 'Prensa 45º',                             group: 'pernas' },
  { name: 'Prensa horizontal',                      group: 'pernas' },
  { name: 'Prensa unilateral',                      group: 'pernas' },
  { name: 'Extensão de pernas',                     group: 'pernas' },
  { name: 'Cadeira flexora deitada',                group: 'pernas' },
  { name: 'Cadeira flexora sentada',                group: 'pernas' },
  { name: 'Cadeira flexora unilateral',             group: 'pernas' },
  { name: 'Adutora',                                group: 'pernas' },
  { name: 'Abdutora',                               group: 'pernas' },
  { name: 'Lunges (estático)',                      group: 'pernas' },
  { name: 'Lunges andando',                         group: 'pernas' },
  { name: 'Lunges reverso',                         group: 'pernas' },
  { name: 'Step-up',                                group: 'pernas' },
  { name: 'Curtsy lunge',                           group: 'pernas' },
  { name: 'Sissy squat',                            group: 'pernas' },
  { name: 'Gémeos em pé (máquina)',                 group: 'pernas' },
  { name: 'Gémeos sentado',                         group: 'pernas' },
  { name: 'Gémeos na prensa',                       group: 'pernas' },
  { name: 'Gémeos burro',                           group: 'pernas' },
  { name: 'Single-leg calf raise',                  group: 'pernas' },
  { name: 'Tibialis raise',                         group: 'pernas' },

  // ---------- GLÚTEOS ----------
  { name: 'Hip thrust (barra)',                     group: 'gluteos' },
  { name: 'Hip thrust (máquina)',                   group: 'gluteos' },
  { name: 'Glute bridge',                           group: 'gluteos' },
  { name: 'Single-leg hip thrust',                  group: 'gluteos' },
  { name: 'Glute kickback (cabo)',                  group: 'gluteos' },
  { name: 'Glute kickback (máquina)',               group: 'gluteos' },
  { name: 'Glute ham raise',                        group: 'gluteos' },
  { name: 'Cable pull-through',                     group: 'gluteos' },
  { name: 'Frog pump',                              group: 'gluteos' },
  { name: 'Banded clamshell',                       group: 'gluteos' },
  { name: 'Lateral band walk',                      group: 'gluteos' },

  // ---------- OMBROS ----------
  { name: 'Desenvolvimento militar (barra)',        group: 'ombros' },
  { name: 'Desenvolvimento militar (halteres)',     group: 'ombros' },
  { name: 'Desenvolvimento Arnold',                 group: 'ombros' },
  { name: 'Desenvolvimento (máquina)',              group: 'ombros' },
  { name: 'Push press',                             group: 'ombros' },
  { name: 'Elevações laterais (halteres)',          group: 'ombros' },
  { name: 'Elevações laterais (cabo)',              group: 'ombros' },
  { name: 'Elevações laterais (máquina)',           group: 'ombros' },
  { name: 'Elevações laterais inclinadas',          group: 'ombros' },
  { name: 'Elevações frontais (halteres)',          group: 'ombros' },
  { name: 'Elevações frontais (barra)',             group: 'ombros' },
  { name: 'Elevações frontais (cabo)',              group: 'ombros' },
  { name: 'Elevações posteriores (pássaro)',        group: 'ombros' },
  { name: 'Reverse pec deck',                       group: 'ombros' },
  { name: 'Face pull',                              group: 'ombros' },
  { name: 'Remada alta (barra)',                    group: 'ombros' },
  { name: 'Remada alta (cabo)',                     group: 'ombros' },
  { name: 'Cuban press',                            group: 'ombros' },
  { name: 'Y-raise',                                group: 'ombros' },
  { name: 'Handstand push-up',                      group: 'ombros' },
  { name: 'Pike push-up',                           group: 'ombros' },

  // ---------- BÍCEPS ----------
  { name: 'Rosca direta (barra)',                   group: 'biceps' },
  { name: 'Rosca direta (barra W/EZ)',              group: 'biceps' },
  { name: 'Rosca direta (halteres)',                group: 'biceps' },
  { name: 'Rosca alternada',                        group: 'biceps' },
  { name: 'Rosca martelo',                          group: 'biceps' },
  { name: 'Rosca inversa',                          group: 'biceps' },
  { name: 'Rosca scott (barra)',                    group: 'biceps' },
  { name: 'Rosca scott (halteres)',                 group: 'biceps' },
  { name: 'Rosca scott (máquina)',                  group: 'biceps' },
  { name: 'Rosca concentrada',                      group: 'biceps' },
  { name: 'Rosca 21',                               group: 'biceps' },
  { name: 'Rosca cabo (barra)',                     group: 'biceps' },
  { name: 'Rosca cabo (corda)',                     group: 'biceps' },
  { name: 'Spider curl',                            group: 'biceps' },
  { name: 'Drag curl',                              group: 'biceps' },
  { name: 'Cable hammer curl',                      group: 'biceps' },
  { name: 'Incline dumbbell curl',                  group: 'biceps' },
  { name: 'Zottman curl',                           group: 'biceps' },

  // ---------- TRÍCEPS ----------
  { name: 'Tríceps polia (corda)',                  group: 'triceps' },
  { name: 'Tríceps polia (barra)',                  group: 'triceps' },
  { name: 'Tríceps polia (pega V)',                 group: 'triceps' },
  { name: 'Tríceps testa (barra)',                  group: 'triceps' },
  { name: 'Tríceps testa (halteres)',               group: 'triceps' },
  { name: 'Tríceps francês',                        group: 'triceps' },
  { name: 'Tríceps banco',                          group: 'triceps' },
  { name: 'Tríceps fundos paralelas',               group: 'triceps' },
  { name: 'Tríceps fundos máquina',                 group: 'triceps' },
  { name: 'Skull crusher',                          group: 'triceps' },
  { name: 'Pulldown tríceps',                       group: 'triceps' },
  { name: 'Kickback (haltere)',                     group: 'triceps' },
  { name: 'Kickback (cabo)',                        group: 'triceps' },
  { name: 'Overhead extension (corda)',             group: 'triceps' },
  { name: 'Overhead extension (barra)',             group: 'triceps' },
  { name: 'Close-grip bench press',                 group: 'triceps' },
  { name: 'JM press',                               group: 'triceps' },

  // ---------- ANTEBRAÇO ----------
  { name: 'Rosca de punho (flexores)',              group: 'antebraco' },
  { name: 'Rosca de punho inversa (extensores)',    group: 'antebraco' },
  { name: "Farmer's walk",                          group: 'antebraco' },
  { name: 'Wrist roller',                           group: 'antebraco' },
  { name: 'Plate pinch',                            group: 'antebraco' },
  { name: 'Behind-the-back wrist curl',             group: 'antebraco' },
  { name: 'Hand gripper',                           group: 'antebraco' },

  // ---------- CORE / ABS ----------
  { name: 'Prancha frontal',                        group: 'core' },
  { name: 'Prancha lateral',                        group: 'core' },
  { name: 'Prancha com elevação',                   group: 'core' },
  { name: 'Russian twist',                          group: 'core' },
  { name: 'Russian twist (com peso)',               group: 'core' },
  { name: 'Crunch',                                 group: 'core' },
  { name: 'Crunch declinado',                       group: 'core' },
  { name: 'Bicycle crunch',                         group: 'core' },
  { name: 'Reverse crunch',                         group: 'core' },
  { name: 'Cable crunch',                           group: 'core' },
  { name: 'Hanging leg raise',                      group: 'core' },
  { name: 'Lying leg raise',                        group: 'core' },
  { name: 'Knee raise (paralelas)',                 group: 'core' },
  { name: 'Toes to bar',                            group: 'core' },
  { name: 'Hollow body hold',                       group: 'core' },
  { name: 'Mountain climber',                       group: 'core' },
  { name: 'Ab wheel rollout',                       group: 'core' },
  { name: 'V-up',                                   group: 'core' },
  { name: 'Sit-up',                                 group: 'core' },
  { name: 'Decline sit-up',                         group: 'core' },
  { name: 'Wood chopper',                           group: 'core' },
  { name: 'Pallof press',                           group: 'core' },
  { name: 'Dead bug',                               group: 'core' },
  { name: 'Bird dog',                               group: 'core' },
  { name: 'Plank up-down',                          group: 'core' },
  { name: 'Hollow rock',                            group: 'core' },
  { name: 'L-sit',                                  group: 'core' },
  { name: 'Dragon flag',                            group: 'core' },

  // ---------- CARDIO ----------
  { name: 'Corrida (passadeira)',                   group: 'cardio' },
  { name: 'Corrida (rua)',                          group: 'cardio' },
  { name: 'Sprint',                                 group: 'cardio' },
  { name: 'Bicicleta estática',                     group: 'cardio' },
  { name: 'Spinning',                               group: 'cardio' },
  { name: 'Elíptica',                               group: 'cardio' },
  { name: 'Stairmaster',                            group: 'cardio' },
  { name: 'Remo (máquina)',                         group: 'cardio' },
  { name: 'Saltar à corda',                         group: 'cardio' },
  { name: 'Burpees',                                group: 'cardio' },
  { name: 'Jumping jacks',                          group: 'cardio' },
  { name: 'High knees',                             group: 'cardio' },
  { name: 'HIIT (intervalado)',                     group: 'cardio' },
  { name: 'Box jump',                               group: 'cardio' },
  { name: 'Sled push',                              group: 'cardio' },
  { name: 'Sled pull',                              group: 'cardio' },
  { name: 'Bike ass (assault bike)',                group: 'cardio' },
  { name: 'Caminhada inclinada',                    group: 'cardio' },

  // ---------- FUNCIONAL / OLÍMPICOS ----------
  { name: 'Kettlebell swing',                       group: 'funcional' },
  { name: 'Kettlebell snatch',                      group: 'funcional' },
  { name: 'Kettlebell clean',                       group: 'funcional' },
  { name: 'Kettlebell goblet squat',                group: 'funcional' },
  { name: 'Turkish get-up',                         group: 'funcional' },
  { name: 'Battle ropes',                           group: 'funcional' },
  { name: 'Power clean',                            group: 'funcional' },
  { name: 'Hang clean',                             group: 'funcional' },
  { name: 'Snatch',                                 group: 'funcional' },
  { name: 'Hang snatch',                            group: 'funcional' },
  { name: 'Clean and jerk',                         group: 'funcional' },
  { name: 'Thruster',                               group: 'funcional' },
  { name: 'Wall ball',                              group: 'funcional' },
  { name: 'Medicine ball slam',                     group: 'funcional' },
  { name: 'Tire flip',                              group: 'funcional' },
  { name: 'Yoke walk',                              group: 'funcional' },
  { name: 'Atlas stone',                            group: 'funcional' },
];

export const GROUP_LABELS: Record<MuscleGroup, string> = {
  peito:      'Peito',
  costas:     'Costas',
  pernas:     'Pernas',
  gluteos:    'Glúteos',
  ombros:     'Ombros',
  biceps:     'Bíceps',
  triceps:    'Tríceps',
  antebraco:  'Antebraço',
  core:       'Core',
  cardio:     'Cardio',
  funcional:  'Funcional',
};

export function searchExercises(query: string, limit = 30): Exercise[] {
  const q = query.trim().toLowerCase();
  if (!q) return EXERCISES.slice(0, limit);
  const scored = EXERCISES.map((e) => {
    const n = e.name.toLowerCase();
    const g = GROUP_LABELS[e.group].toLowerCase();
    let score = 0;
    if (n.startsWith(q)) score += 100;
    else if (n.includes(` ${q}`)) score += 50;
    else if (n.includes(q)) score += 20;
    if (g === q) score += 10;
    else if (g.includes(q)) score += 5;
    return { e, score };
  }).filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.e);
}

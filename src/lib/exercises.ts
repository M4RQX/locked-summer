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

// ---------- Demonstrations ----------
// Mapeamento dos nomes PT do nosso catálogo para os IDs do free-exercise-db
// (Apache 2.0, github.com/yuhonas/free-exercise-db). Cada ID tem 2 imagens
// (start/end posture) que servimos directamente do raw.githubusercontent.
//
// Nem todos os exercícios PT têm match exacto. Para os que não têm,
// getExerciseDemo() devolve null e o UI mostra fallback.

const DEMO_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

const DEMO_MAP: Record<string, string> = {
  // PEITO
  'Supino plano (barra)':                  'Barbell_Bench_Press_-_Medium_Grip',
  'Supino plano (halteres)':               'Dumbbell_Bench_Press',
  'Supino inclinado (barra)':              'Barbell_Incline_Bench_Press_-_Medium-Grip',
  'Supino inclinado (halteres)':           'Incline_Dumbbell_Press',
  'Supino declinado (barra)':              'Decline_Barbell_Bench_Press',
  'Supino declinado (halteres)':           'Decline_Dumbbell_Bench_Press',
  'Aberturas (peck deck)':                 'Butterfly',
  'Aberturas (halteres)':                  'Dumbbell_Flyes',
  'Crucifixo cabos cruzados':              'Cable_Crossover',
  'Crucifixo banco inclinado':             'Incline_Dumbbell_Flyes',
  'Crucifixo banco declinado':             'Decline_Dumbbell_Flyes',
  'Pullover (haltere)':                    'Dumbbell_Pullover',
  'Pullover (cabo)':                       'Cable_Rope_Overhead_Triceps_Extension',
  'Flexões (push-up)':                     'Pushups',
  'Flexões diamante':                      'Close-Grip_Push-Up_off_of_a_Dumbbell',
  'Flexões inclinadas':                    'Incline_Push-Up',
  'Flexões declinadas':                    'Decline_Push-Up',
  'Smith machine bench press':             'Smith_Machine_Bench_Press',

  // COSTAS
  'Puxada na polia alta (frente)':         'Wide-Grip_Lat_Pulldown',
  'Puxada na polia alta (atrás)':          'Wide-Grip_Pulldown_Behind_The_Neck',
  'Puxada com pega aberta':                'Wide-Grip_Lat_Pulldown',
  'Puxada com pega fechada':               'Close-Grip_Front_Lat_Pulldown',
  'Puxada com pega neutra':                'V-Bar_Pulldown',
  'Pull-ups':                              'Pullups',
  'Chin-ups':                              'Chin-Up',
  'Pull-ups assistidos':                   'Machine-Assisted_Pull-Up',
  'Remada com barra (pronada)':            'Bent_Over_Barbell_Row',
  'Remada com barra (supinada)':           'Underhand_Cable_Pulldowns',
  'Remada T-bar':                          'T-Bar_Row_with_Handle',
  'Remada cavalinho':                      'Seated_Cable_Rows',
  'Remada unilateral haltere':             'One-Arm_Dumbbell_Row',
  'Remada baixa (polia)':                  'Seated_Cable_Rows',
  'Remada Pendlay':                        'Pendlay_Row',
  'Levantamento terra (deadlift)':         'Barbell_Deadlift',
  'Peso morto romeno (RDL)':               'Romanian_Deadlift',
  'Stiff leg deadlift':                    'Stiff-Legged_Barbell_Deadlift',
  'Hiperextensão lombar':                  'Hyperextensions',
  'Good morning':                          'Good_Morning',
  'Pulldown corda (face pull baixo)':      'Face_Pull',
  'Straight-arm pulldown':                 'Cable_Straight-Arm_Pulldown',
  'Encolhimentos (shrugs barra)':          'Barbell_Shrug',
  'Encolhimentos (shrugs halteres)':       'Dumbbell_Shrug',

  // PERNAS
  'Agachamento livre':                     'Barbell_Squat',
  'Agachamento smith':                     'Smith_Machine_Squat',
  'Agachamento frontal':                   'Front_Barbell_Squat',
  'Agachamento búlgaro':                   'Single-Leg_Squat',
  'Agachamento sumô':                      'Sumo_Deadlift',
  'Agachamento goblet':                    'Goblet_Squat',
  'Pistol squat':                          'Single-Leg_Squat',
  'Hack squat':                            'Hack_Squat',
  'Prensa 45º':                            'Leg_Press',
  'Prensa horizontal':                     'Wide_Stance_Hack_Squats',
  'Extensão de pernas':                    'Leg_Extensions',
  'Cadeira flexora deitada':               'Lying_Leg_Curls',
  'Cadeira flexora sentada':               'Seated_Leg_Curl',
  'Adutora':                               'Thigh_Adductor',
  'Abdutora':                               'Thigh_Abductor',
  'Lunges (estático)':                     'Dumbbell_Lunges',
  'Lunges andando':                        'Bodyweight_Walking_Lunge',
  'Lunges reverso':                        'Reverse_Dumbbell_Lunge',
  'Step-up':                               'Dumbbell_Step-Ups',
  'Sissy squat':                           'Sissy_Squat',
  'Gémeos em pé (máquina)':                'Standing_Calf_Raises',
  'Gémeos sentado':                        'Seated_Calf_Raise',
  'Gémeos burro':                          'Donkey_Calf_Raises',
  'Single-leg calf raise':                 'Standing_Dumbbell_Calf_Raise',

  // GLÚTEOS
  'Hip thrust (barra)':                    'Barbell_Hip_Thrust',
  'Glute bridge':                          'Glute_Bridge',
  'Cable pull-through':                    'Cable_Hip_Adduction',

  // OMBROS
  'Desenvolvimento militar (barra)':       'Barbell_Shoulder_Press',
  'Desenvolvimento militar (halteres)':    'Dumbbell_Shoulder_Press',
  'Desenvolvimento Arnold':                'Arnold_Dumbbell_Press',
  'Push press':                            'Push_Press',
  'Elevações laterais (halteres)':         'Side_Lateral_Raise',
  'Elevações laterais (cabo)':             'Side_Lateral_Raise', // closest match
  'Elevações frontais (halteres)':         'Front_Dumbbell_Raise',
  'Elevações frontais (barra)':            'Front_Barbell_Raise',
  'Elevações frontais (cabo)':             'Cable_Seated_Lateral_Raise',
  'Elevações posteriores (pássaro)':       'Bent-Knee_Hip_Raise',
  'Reverse pec deck':                      'Reverse_Machine_Flyes',
  'Face pull':                             'Face_Pull',
  'Remada alta (barra)':                   'Upright_Row',
  'Remada alta (cabo)':                    'Upright_Cable_Row',
  'Pike push-up':                          'Pike_Press',

  // BÍCEPS
  'Rosca direta (barra)':                  'Barbell_Curl',
  'Rosca direta (barra W/EZ)':             'EZ-Bar_Curl',
  'Rosca direta (halteres)':               'Dumbbell_Bicep_Curl',
  'Rosca alternada':                       'Alternate_Incline_Dumbbell_Curl',
  'Rosca martelo':                         'Hammer_Curls',
  'Rosca inversa':                         'Reverse_Barbell_Curl',
  'Rosca scott (barra)':                   'Preacher_Curl',
  'Rosca scott (halteres)':                'Dumbbell_Preacher_Curl',
  'Rosca concentrada':                     'Concentration_Curls',
  'Rosca 21':                              '21s',
  'Rosca cabo (barra)':                    'Cable_Hammer_Curls_-_Rope_Attachment',
  'Rosca cabo (corda)':                    'Cable_Hammer_Curls_-_Rope_Attachment',
  'Spider curl':                           'Spider_Curl',
  'Drag curl':                             'Drag_Curl',
  'Incline dumbbell curl':                 'Alternate_Incline_Dumbbell_Curl',
  'Zottman curl':                          'Zottman_Curl',

  // TRÍCEPS
  'Tríceps polia (corda)':                 'Triceps_Pushdown_-_Rope_Attachment',
  'Tríceps polia (barra)':                 'Triceps_Pushdown',
  'Tríceps polia (pega V)':                'Triceps_Pushdown_-_V-Bar_Attachment',
  'Tríceps testa (barra)':                 'EZ-Bar_Skullcrusher',
  'Tríceps testa (halteres)':              'Lying_Dumbbell_Tricep_Extension',
  'Tríceps francês':                       'Standing_Dumbbell_Triceps_Extension',
  'Tríceps banco':                         'Bench_Dips',
  'Tríceps fundos paralelas':              'Dips_-_Triceps_Version',
  'Tríceps fundos máquina':                'Machine_Triceps_Extension',
  'Skull crusher':                         'EZ-Bar_Skullcrusher',
  'Kickback (haltere)':                    'Tricep_Dumbbell_Kickback',
  'Kickback (cabo)':                       'Triceps_Pushdown',
  'Overhead extension (corda)':            'Cable_Rope_Overhead_Triceps_Extension',
  'Overhead extension (barra)':            'Standing_Triceps_Extension',
  'Close-grip bench press':                'Close-Grip_Barbell_Bench_Press',
  'JM press':                              'JM_Press',

  // ANTEBRAÇO
  'Rosca de punho (flexores)':             'Palms-Down_Wrist_Curl_Over_A_Bench',
  'Rosca de punho inversa (extensores)':   'Palms-Up_Barbell_Wrist_Curl',
  "Farmer's walk":                         'Farmers_Walk',
  'Wrist roller':                          'Wrist_Roller',

  // CORE
  'Prancha frontal':                       'Plank',
  'Prancha lateral':                       'Side_Bridge',
  'Russian twist':                         'Russian_Twist',
  'Russian twist (com peso)':              'Weighted_Russian_Twist',
  'Crunch':                                'Crunches',
  'Crunch declinado':                      'Decline_Crunch',
  'Bicycle crunch':                        'Air_Bike',
  'Reverse crunch':                        'Reverse_Crunch',
  'Cable crunch':                          'Kneeling_Cable_Crunch_With_Alternating_Oblique_Twists',
  'Hanging leg raise':                     'Hanging_Leg_Raise',
  'Lying leg raise':                       'Lying_Leg_Raises',
  'Toes to bar':                           'Hanging_Leg_Raise',
  'Mountain climber':                      'Mountain_Climbers',
  'Ab wheel rollout':                      'Ab_Roller',
  'V-up':                                  'V-Up',
  'Sit-up':                                'Full_Body_Sit-Up',
  'Decline sit-up':                        'Decline_Crunch',
  'Wood chopper':                          'Cable_Wood_Chop',
  'Pallof press':                          'Pallof_Press',
  'Dead bug':                              'Bird_Dog',
  'Bird dog':                              'Bird_Dog',
  'Hollow body hold':                      'Hollow_Hold',

  // CARDIO
  'Saltar à corda':                        'Rope_Jumping',
  'Burpees':                               'Burpees',
  'Jumping jacks':                         'Jumping_Jacks',
  'Box jump':                              'Box_Jump',
  'Sled push':                             'Sled_Push',

  // FUNCIONAL
  'Kettlebell swing':                      'Kettlebell_Swing',
  'Kettlebell snatch':                     'Kettlebell_Snatch',
  'Kettlebell clean':                      'Kettlebell_Clean',
  'Kettlebell goblet squat':               'Goblet_Squat',
  'Turkish get-up':                        'Turkish_Get-Up',
  'Power clean':                           'Power_Clean',
  'Hang clean':                            'Hang_Clean',
  'Snatch':                                'Snatch',
  'Hang snatch':                           'Hang_Snatch',
  'Clean and jerk':                        'Clean_And_Jerk',
  'Thruster':                              'Barbell_Thruster',
  'Wall ball':                             'Wall_Ball',
  'Medicine ball slam':                    'Medicine_Ball_Slam',

  // ---------- ALIASES DO PLANO ----------
  // Nomes compostos / supersets que aparecem nos planos (defaults e os
  // que ficaram em DB com nomes originais) mas não batem com os nomes
  // canónicos do catálogo. Cada alias aponta para a melhor demo
  // disponível no free-exercise-db.
  'Supino plano (barra ou halteres)':      'Barbell_Bench_Press_-_Medium_Grip',
  'Supino inclinado com halteres':         'Incline_Dumbbell_Press',
  'Supino plano (máquina)':                'Smith_Machine_Bench_Press',
  'Aberturas (peck deck ou cabos cruzados)': 'Cable_Crossover',
  'Puxada na polia alta (lat pull-down)':  'Wide-Grip_Lat_Pulldown',
  'Remada com barra ou máquina':           'Bent_Over_Barbell_Row',
  'Remada unilateral com haltere':         'One-Arm_Dumbbell_Row',
  'Rosca direta com barra':                'Barbell_Curl',
  'Rosca inversa com barra':               'Reverse_Barbell_Curl',
  'Tríceps na polia (corda/barra)':        'Triceps_Pushdown_-_Rope_Attachment',
  'Tríceps testa ou fundos':               'EZ-Bar_Skullcrusher',
  'Agachamento ou prensa':                 'Barbell_Squat',
  'Desenvolvimento de ombros (halteres)':  'Dumbbell_Shoulder_Press',
  'Elevações laterais':                    'Side_Lateral_Raise',
  'Superset: rosca scott + tríceps polia': 'Preacher_Curl',
  "Farmer's walk (opcional)":              'Farmers_Walk',
};

// Fuzzy fallback para nomes do plano legacy ou custom: tenta normalizar e procurar.
function normalize(s: string): string {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

const NORMALIZED_MAP: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const [k, v] of Object.entries(DEMO_MAP)) m[normalize(k)] = v;
  return m;
})();

export interface ExerciseDemo {
  start: string;
  end: string;
  source: string;
}

export function getExerciseDemo(name: string): ExerciseDemo | null {
  const direct = DEMO_MAP[name];
  const id = direct ?? NORMALIZED_MAP[normalize(name)];
  if (!id) return null;
  return {
    start: `${DEMO_BASE}/${id}/0.jpg`,
    end:   `${DEMO_BASE}/${id}/1.jpg`,
    source: 'free-exercise-db',
  };
}

// ---------- Full exercise metadata (lazy-loaded from free-exercise-db dist) ----------
export interface ExerciseDetails {
  id: string;
  name: string;
  force: 'push' | 'pull' | 'static' | null;
  level: 'beginner' | 'intermediate' | 'expert';
  mechanic: 'compound' | 'isolation' | null;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  category: string;
  images: string[];
  instructions: string[];
}

const DETAILS_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
let detailsCache: Map<string, ExerciseDetails> | null = null;
let inflightDetailsFetch: Promise<Map<string, ExerciseDetails>> | null = null;

async function loadDetailsIndex(): Promise<Map<string, ExerciseDetails>> {
  if (detailsCache) return detailsCache;
  if (inflightDetailsFetch) return inflightDetailsFetch;
  inflightDetailsFetch = (async () => {
    const res = await fetch(DETAILS_URL);
    if (!res.ok) throw new Error(`details fetch ${res.status}`);
    const arr = (await res.json()) as ExerciseDetails[];
    const map = new Map(arr.map((e) => [e.id, e]));
    detailsCache = map;
    inflightDetailsFetch = null;
    return map;
  })();
  return inflightDetailsFetch;
}

export async function getExerciseDetails(name: string): Promise<ExerciseDetails | null> {
  const id = DEMO_MAP[name] ?? NORMALIZED_MAP[normalize(name)];
  if (!id) return null;
  try {
    const idx = await loadDetailsIndex();
    return idx.get(id) ?? null;
  } catch {
    return null;
  }
}

// ---------- Portuguese labels for free-exercise-db enums ----------
export const MUSCLE_PT_LABELS: Record<string, string> = {
  chest: 'Peito',
  shoulders: 'Ombros',
  triceps: 'Tríceps',
  biceps: 'Bíceps',
  forearms: 'Antebraço',
  abdominals: 'Abdómen',
  quadriceps: 'Quadríceps',
  hamstrings: 'Posteriores',
  glutes: 'Glúteos',
  calves: 'Gémeos',
  lats: 'Dorsais',
  'middle back': 'Costas (meio)',
  'lower back': 'Lombares',
  traps: 'Trapézio',
  neck: 'Pescoço',
  adductors: 'Adutores',
  abductors: 'Abdutores',
};

export const EQUIPMENT_PT_LABELS: Record<string, string> = {
  barbell: 'Barra',
  dumbbell: 'Halteres',
  cable: 'Cabo',
  machine: 'Máquina',
  'body only': 'Peso corporal',
  'medicine ball': 'Medicine ball',
  'exercise ball': 'Bola suíça',
  'foam roll': 'Foam roller',
  kettlebells: 'Kettlebell',
  bands: 'Bandas elásticas',
  'e-z curl bar': 'Barra W (EZ)',
  other: 'Outro',
};

export const FORCE_PT_LABELS: Record<string, string> = {
  push: 'Empurrar',
  pull: 'Puxar',
  static: 'Estático',
};

export const LEVEL_PT_LABELS: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermédio',
  expert: 'Avançado',
};

export const MECHANIC_PT_LABELS: Record<string, string> = {
  compound: 'Composto',
  isolation: 'Isolamento',
};

// Build a name → group index once. Includes both DEMO_MAP aliases (for plan names
// like "Supino plano (barra ou halteres)") and catalog exercises. Plan aliases
// inherit the group of the catalog exercise they alias.
const NAME_TO_GROUP: Map<string, MuscleGroup> = (() => {
  const m = new Map<string, MuscleGroup>();
  for (const e of EXERCISES) m.set(e.name, e.group);
  // Normalized version too so plan-name variants fuzzy-match
  for (const e of EXERCISES) m.set(normalize(e.name), e.group);
  return m;
})();

export function getMuscleGroupForName(name: string): MuscleGroup | null {
  return NAME_TO_GROUP.get(name) ?? NAME_TO_GROUP.get(normalize(name)) ?? null;
}

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

export type DayType = 'A' | 'B' | 'C';
export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'shake';
export type PhotoAngle = 'front' | 'side' | 'back';

export interface User {
  id: string;
  name: string;
  target_calories: number;
  target_protein: number;
  target_weight_kg: number;
  start_weight_kg: number;
  created_at: string;
}

export interface ExercisePlan {
  name: string;
  sets: number;
  reps: string; // "6-10", "8-12"
  note?: string;
}

export interface DayPlan {
  type: DayType;
  title: string;
  subtitle: string;
  exercises: ExercisePlan[];
}

export interface Workout {
  id: string;
  user_id: string;
  day_type: DayType;
  date: string;
  duration_minutes: number | null;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface WorkoutSet {
  id: string;
  workout_id: string;
  exercise_name: string;
  set_number: number;
  weight_kg: number | null;
  reps: number | null;
  is_pr: boolean;
  created_at: string;
}

export interface Food {
  id: string;
  name: string;
  category: string | null;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  default_portion: string | null;
  is_default: boolean;
  created_at: string;
}

export interface MealLog {
  id: string;
  user_id: string;
  date: string;
  meal_type: MealType;
  food_id: string;
  portion_multiplier: number;
  food?: Food;
  created_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
  body_fat_pct: number | null;
  muscle_pct: number | null;
  created_at: string;
}

export interface ProgressPhoto {
  id: string;
  user_id: string;
  date: string;
  angle: PhotoAngle;
  photo_data: string;
  created_at: string;
}

export interface DailyTotals {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

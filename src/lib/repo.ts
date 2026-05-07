import { sql } from './db';
import type {
  Workout, WorkoutSet, Food, MealLog, WeightLog, ProgressPhoto, DailyTotals, DayType, MealType, PhotoAngle,
} from '@/types';

// ---------- Workouts ----------
export async function getRecentWorkouts(userId: string, limit = 30): Promise<Workout[]> {
  return (await sql`select * from workouts where user_id = ${userId} order by date desc, created_at desc limit ${limit}`) as Workout[];
}
export async function getLastWorkoutDayType(userId: string): Promise<DayType | null> {
  const rows = (await sql`select day_type from workouts where user_id = ${userId} order by date desc, created_at desc limit 1`) as { day_type: DayType }[];
  return rows[0]?.day_type ?? null;
}
export async function startWorkout(userId: string, dayType: DayType, date: string): Promise<Workout> {
  const rows = (await sql`insert into workouts (user_id, day_type, date) values (${userId}, ${dayType}, ${date}) returning *`) as Workout[];
  return rows[0];
}
export async function getWorkout(id: string): Promise<Workout | null> {
  const rows = (await sql`select * from workouts where id = ${id} limit 1`) as Workout[];
  return rows[0] ?? null;
}
export async function getWorkoutSets(workoutId: string): Promise<WorkoutSet[]> {
  return (await sql`select * from workout_sets where workout_id = ${workoutId} order by exercise_name, set_number`) as WorkoutSet[];
}
export async function logSet(workoutId: string, exercise: string, setNumber: number, weightKg: number, reps: number): Promise<WorkoutSet> {
  const userRows = (await sql`select user_id from workouts where id = ${workoutId} limit 1`) as { user_id: string }[];
  const userId = userRows[0]?.user_id;
  let isPr = false;
  if (userId) {
    const prevRows = (await sql`
      select coalesce(max(s.weight_kg), 0) as best
      from workout_sets s join workouts w on s.workout_id = w.id
      where w.user_id = ${userId} and s.exercise_name = ${exercise} and w.id <> ${workoutId}
    `) as { best: number }[];
    const best = Number(prevRows[0]?.best ?? 0);
    if (Number(weightKg) > best && Number(weightKg) > 0) isPr = true;
  }
  const rows = (await sql`
    insert into workout_sets (workout_id, exercise_name, set_number, weight_kg, reps, is_pr)
    values (${workoutId}, ${exercise}, ${setNumber}, ${weightKg}, ${reps}, ${isPr})
    returning *
  `) as WorkoutSet[];
  return rows[0];
}
export async function deleteSet(setId: string): Promise<void> {
  await sql`delete from workout_sets where id = ${setId}`;
}
export async function finishWorkout(workoutId: string, durationMin: number, notes: string): Promise<void> {
  await sql`update workouts set duration_minutes = ${durationMin}, notes = ${notes}, completed_at = now() where id = ${workoutId}`;
}
export async function getExerciseHistory(userId: string, exercise: string, limit = 8): Promise<Array<{ date: string; weight_kg: number; reps: number }>> {
  return (await sql`
    select w.date, s.weight_kg, s.reps
    from workout_sets s join workouts w on s.workout_id = w.id
    where w.user_id = ${userId} and s.exercise_name = ${exercise} and s.weight_kg is not null
    order by w.date desc, s.set_number desc
    limit ${limit}
  `) as Array<{ date: string; weight_kg: number; reps: number }>;
}

// ---------- Foods / Meals ----------
export async function listFoods(): Promise<Food[]> {
  return (await sql`select * from foods order by is_default desc, name asc`) as Food[];
}
export async function addFood(f: Omit<Food, 'id' | 'created_at' | 'is_default'>): Promise<Food> {
  const rows = (await sql`
    insert into foods (name, category, kcal, protein_g, carbs_g, fat_g, default_portion, is_default)
    values (${f.name}, ${f.category}, ${f.kcal}, ${f.protein_g}, ${f.carbs_g}, ${f.fat_g}, ${f.default_portion}, false)
    returning *
  `) as Food[];
  return rows[0];
}
export async function logMeal(userId: string, date: string, mealType: MealType, foodId: string, multiplier = 1): Promise<MealLog> {
  const rows = (await sql`
    insert into meal_logs (user_id, date, meal_type, food_id, portion_multiplier)
    values (${userId}, ${date}, ${mealType}, ${foodId}, ${multiplier})
    returning *
  `) as MealLog[];
  return rows[0];
}
export async function deleteMealLog(id: string): Promise<void> {
  await sql`delete from meal_logs where id = ${id}`;
}
export async function getMealsForDay(userId: string, date: string): Promise<MealLog[]> {
  const rows = (await sql`
    select m.*,
      json_build_object(
        'id', f.id, 'name', f.name, 'category', f.category,
        'kcal', f.kcal, 'protein_g', f.protein_g, 'carbs_g', f.carbs_g, 'fat_g', f.fat_g,
        'default_portion', f.default_portion, 'is_default', f.is_default, 'created_at', f.created_at
      ) as food
    from meal_logs m join foods f on m.food_id = f.id
    where m.user_id = ${userId} and m.date = ${date}
    order by m.created_at asc
  `) as Array<MealLog & { food: Food }>;
  return rows;
}
export function totalsFromMeals(meals: MealLog[]): DailyTotals {
  return meals.reduce<DailyTotals>(
    (acc, m) => {
      const f = m.food;
      const mult = Number(m.portion_multiplier);
      if (!f) return acc;
      acc.kcal += Number(f.kcal) * mult;
      acc.protein_g += Number(f.protein_g) * mult;
      acc.carbs_g += Number(f.carbs_g) * mult;
      acc.fat_g += Number(f.fat_g) * mult;
      return acc;
    },
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );
}
export async function getDailyTotalsRange(userId: string, days = 7): Promise<Array<{ date: string; totals: DailyTotals }>> {
  const rows = (await sql`
    select m.date,
      sum(f.kcal * m.portion_multiplier) as kcal,
      sum(f.protein_g * m.portion_multiplier) as protein_g,
      sum(f.carbs_g * m.portion_multiplier) as carbs_g,
      sum(f.fat_g * m.portion_multiplier) as fat_g
    from meal_logs m join foods f on m.food_id = f.id
    where m.user_id = ${userId} and m.date >= current_date - ${days}::int
    group by m.date order by m.date desc
  `) as Array<{ date: string; kcal: number; protein_g: number; carbs_g: number; fat_g: number }>;
  return rows.map((r) => ({
    date: r.date,
    totals: { kcal: Number(r.kcal), protein_g: Number(r.protein_g), carbs_g: Number(r.carbs_g), fat_g: Number(r.fat_g) },
  }));
}

export const SHAKE_LOCKED_FOODS = ['Mass gainer (1 scoop)', 'Aveia', 'Leite gordo', 'Banana', 'Morango', 'Mel'];
export async function logShakeLocked(userId: string, date: string): Promise<number> {
  const foods = (await sql`select id, name from foods where name = any(${SHAKE_LOCKED_FOODS as unknown as string})`) as { id: string; name: string }[];
  let count = 0;
  for (const f of foods) {
    await logMeal(userId, date, 'shake', f.id, 1);
    count++;
  }
  return count;
}

// ---------- Weight ----------
export async function listWeights(userId: string, limit = 200): Promise<WeightLog[]> {
  return (await sql`select * from weight_logs where user_id = ${userId} order by date asc limit ${limit}`) as WeightLog[];
}
export async function logWeight(userId: string, date: string, weightKg: number, bodyFat?: number, muscle?: number): Promise<WeightLog> {
  const rows = (await sql`
    insert into weight_logs (user_id, date, weight_kg, body_fat_pct, muscle_pct)
    values (${userId}, ${date}, ${weightKg}, ${bodyFat ?? null}, ${muscle ?? null})
    on conflict (user_id, date) do update set
      weight_kg = excluded.weight_kg,
      body_fat_pct = excluded.body_fat_pct,
      muscle_pct = excluded.muscle_pct
    returning *
  `) as WeightLog[];
  return rows[0];
}
export async function getLatestWeight(userId: string): Promise<WeightLog | null> {
  const rows = (await sql`select * from weight_logs where user_id = ${userId} order by date desc limit 1`) as WeightLog[];
  return rows[0] ?? null;
}

// ---------- Photos ----------
export async function listPhotos(userId: string): Promise<ProgressPhoto[]> {
  return (await sql`select * from progress_photos where user_id = ${userId} order by date desc, created_at desc`) as ProgressPhoto[];
}
export async function addPhoto(userId: string, date: string, angle: PhotoAngle, photoData: string): Promise<ProgressPhoto> {
  const rows = (await sql`
    insert into progress_photos (user_id, date, angle, photo_data)
    values (${userId}, ${date}, ${angle}, ${photoData}) returning *
  `) as ProgressPhoto[];
  return rows[0];
}
export async function deletePhoto(id: string): Promise<void> {
  await sql`delete from progress_photos where id = ${id}`;
}

// ---------- Streak ----------
export async function getStreakDays(userId: string): Promise<number> {
  const rows = (await sql`
    with d as (
      select date from meal_logs where user_id = ${userId}
      union
      select date from workouts where user_id = ${userId}
    ),
    ordered as (select distinct date from d order by date desc)
    select date from ordered limit 60
  `) as { date: string }[];
  if (rows.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < rows.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedISO = expected.toISOString().slice(0, 10);
    if (rows[i].date === expectedISO) streak++;
    else break;
  }
  return streak;
}

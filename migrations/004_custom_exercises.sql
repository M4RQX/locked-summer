-- LOCKED SUMMER — custom exercises per workout (added ad-hoc)
-- Idempotent. Aplicada no Neon a 2026-05-07.

create table if not exists workout_custom_exercises (
  id uuid primary key default uuid_generate_v4(),
  workout_id uuid not null references workouts(id) on delete cascade,
  exercise_name text not null,
  target_sets int not null default 3,
  target_reps text not null default '8-12',
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists wce_workout_idx on workout_custom_exercises(workout_id);

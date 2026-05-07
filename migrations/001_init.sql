-- LOCKED SUMMER — initial schema
-- Run this in Neon SQL editor once. Idempotent.

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  password_hash text not null,
  target_calories int not null default 3000,
  target_protein int not null default 150,
  target_weight_kg numeric(5,1) not null default 80,
  start_weight_kg numeric(5,1) not null default 70,
  created_at timestamptz not null default now()
);

create table if not exists workouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  day_type char(1) not null check (day_type in ('A','B','C')),
  date date not null,
  duration_minutes int,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists workouts_user_date_idx on workouts(user_id, date desc);

create table if not exists workout_sets (
  id uuid primary key default uuid_generate_v4(),
  workout_id uuid not null references workouts(id) on delete cascade,
  exercise_name text not null,
  set_number int not null,
  weight_kg numeric(5,2),
  reps int,
  is_pr boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists workout_sets_workout_idx on workout_sets(workout_id);
create index if not exists workout_sets_exercise_idx on workout_sets(exercise_name);

create table if not exists foods (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  category text,
  kcal numeric(7,2) not null,
  protein_g numeric(6,2) not null default 0,
  carbs_g numeric(6,2) not null default 0,
  fat_g numeric(6,2) not null default 0,
  default_portion text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists meal_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  meal_type text not null check (meal_type in ('breakfast','lunch','snack','dinner','shake')),
  food_id uuid not null references foods(id),
  portion_multiplier numeric(5,2) not null default 1,
  created_at timestamptz not null default now()
);
create index if not exists meal_logs_user_date_idx on meal_logs(user_id, date desc);

create table if not exists weight_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  weight_kg numeric(5,2) not null,
  body_fat_pct numeric(4,1),
  muscle_pct numeric(4,1),
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create table if not exists progress_photos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  angle text not null check (angle in ('front','side','back')),
  photo_data text not null, -- base64 data URL
  created_at timestamptz not null default now()
);
create index if not exists progress_photos_user_date_idx on progress_photos(user_id, date desc);

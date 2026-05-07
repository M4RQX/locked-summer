-- LOCKED SUMMER — per-user editable workout plans
-- Idempotent. Aplicada no Neon a 2026-05-07.
--
-- Substitui a constante hardcoded src/lib/plans.ts. Cada user pode agora ter
-- N dias (A, B, C, D, …) com qualquer subtítulo + N exercícios cada (séries
-- e reps editáveis no PlanEditor).

create table if not exists user_day_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  code text not null,
  title text not null,
  subtitle text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists udp_user_code_idx on user_day_plans(user_id, code);
create index if not exists udp_user_pos_idx on user_day_plans(user_id, position);

create table if not exists user_day_plan_exercises (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references user_day_plans(id) on delete cascade,
  exercise_name text not null,
  target_sets int not null default 3,
  target_reps text not null default '8-12',
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists udpe_plan_idx on user_day_plan_exercises(plan_id, position);

-- workouts.day_type era restrito a A/B/C; agora aceita qualquer code definido em user_day_plans.
alter table workouts drop constraint if exists workouts_day_type_check;

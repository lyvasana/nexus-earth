-- Migration 0003: Session telemetry
-- Added in iter 5. The quantitative spine of the self-improvement cycle.
-- See docs/SELF_IMPROVEMENT_CYCLE.md and docs/TELEMETRY_SCHEMA.md.
--
-- Privacy notes:
--   No raw GPS. Locations are recorded as the H3 cell (resolution 8) the
--   session began in, or NULL if the player declined location.
--   Free text never goes here. That belongs in player_feedback.
-- RLS (prototype): policies: players can read their own, insert their own.

create extension if not exists pgcrypto;

create table if not exists public.session_summary (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null references public.profiles(id) on delete cascade,
  app_version      text not null,
  started_at       timestamptz not null,
  ended_at         timestamptz not null,
  duration_seconds int generated always as
    (greatest(0, extract(epoch from (ended_at - started_at))::int)) stored,
  -- coarse location bucket; NULL means location declined this session
  h3_cell_res8     text,
  -- gameplay summary counters
  nodes_visited        int not null default 0,
  salvage_attempts     int not null default 0,
  loot_drops_common    int not null default 0,
  loot_drops_refined   int not null default 0,
  loot_drops_ornate    int not null default 0,
  loot_drops_legendary int not null default 0,
  loot_drops_mythic    int not null default 0,
  anomalies_engaged    int not null default 0,
  contracts_completed  int not null default 0,
  pocket_dim_visits    int not null default 0,
  -- emotional pulse (see PLAYER_FEEDBACK_MECHANICS.md)
  resonance_pulse  text check (
    resonance_pulse is null or
    resonance_pulse in ('aligned','content','seeking','strained','agitated')
  ),
  -- did this session crash, timeout, or end cleanly?
  end_reason       text not null check (
    end_reason in ('clean_exit','background_timeout','crash','force_quit','unknown')
  ) default 'unknown',
  created_at       timestamptz not null default now()
);

create index if not exists session_summary_profile_idx
  on public.session_summary (profile_id, started_at desc);
create index if not exists session_summary_started_idx
  on public.session_summary (started_at desc);
create index if not exists session_summary_h3_idx
  on public.session_summary (h3_cell_res8)
  where h3_cell_res8 is not null;

alter table public.session_summary enable row level security;

create policy session_summary_self_insert
  on public.session_summary for insert
  with check (auth.uid() = profile_id);

create policy session_summary_self_select
  on public.session_summary for select
  using (auth.uid() = profile_id);

comment on table public.session_summary is
  'Per-session implicit telemetry. Paired with player_feedback for the explicit channel. See docs/TELEMETRY_SCHEMA.md.';

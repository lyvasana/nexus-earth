-- Migration 0005: Contracts (daily/weekly/epic missions)
-- Added in iter 5. Implements IDEA-003 from DESIGN_INNOVATIONS.md.
--
-- Templates define the contract shapes. Instances are assigned to players
-- on a rotation. Completions record outcome for the self-improvement cycle.

create extension if not exists pgcrypto;

create table if not exists public.contract_templates (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique, -- stable string id, e.g. 'daily_scan_3'
  cadence          text not null check (cadence in ('daily','weekly','epic')),
  faction          text,                 -- which faction issues this; nullable for neutral
  display_name     text not null,
  briefing         text not null,        -- diegetic mission briefing
  objective_type   text not null check (objective_type in (
    'salvage_tier',     -- N items of tier X
    'visit_nodes',      -- N nodes
    'scan_anomalies',   -- N anomalies
    'visit_pocket_dim', -- N pocket dimensions
    'engage_event',     -- N world events
    'gift_cosmetic'     -- N gifts sent (community-building)
  )),
  objective_params jsonb not null,       -- e.g. {"tier": "refined", "count": 5}
  -- reward shape; cosmetic-only for now per MONETIZATION_PRINCIPLES.md
  reward_payload   jsonb not null,
  reputation_award int not null default 0,
  created_at       timestamptz not null default now(),
  active           boolean not null default true
);

create index if not exists contract_templates_cadence_idx
  on public.contract_templates (cadence, active);

create table if not exists public.contract_instances (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null references public.profiles(id) on delete cascade,
  template_id      uuid not null references public.contract_templates(id) on delete cascade,
  assigned_at      timestamptz not null default now(),
  expires_at       timestamptz not null,
  state            text not null check (state in (
    'offered','accepted','completed','expired','abandoned'
  )) default 'offered',
  progress         jsonb not null default '{}',
  completed_at     timestamptz,
  -- which player sessions contributed to completion (links telemetry)
  contributing_session_ids uuid[] not null default array[]::uuid[]
);

create index if not exists contract_instances_profile_idx
  on public.contract_instances (profile_id, state, expires_at);
create index if not exists contract_instances_template_idx
  on public.contract_instances (template_id);

alter table public.contract_templates  enable row level security;
alter table public.contract_instances  enable row level security;

create policy contract_templates_public_read
  on public.contract_templates for select using (active = true);

create policy contract_instances_self_select
  on public.contract_instances for select using (auth.uid() = profile_id);
create policy contract_instances_self_insert
  on public.contract_instances for insert with check (auth.uid() = profile_id);
create policy contract_instances_self_update
  on public.contract_instances for update using (auth.uid() = profile_id);

comment on table public.contract_templates is
  'Authored contract shapes. Add new ones here; do not edit shipped ones.';
comment on table public.contract_instances is
  'Player-assigned contracts. See IDEA-003 in docs/DESIGN_INNOVATIONS.md.';

-- Migration 0010: Field Contracts (compensated data marketplace)
-- Added in iter 8. Implements IDEA-034 Field Contracts and IDEA-035
-- Cross-Witnessing consensus.
-- Full spec: docs/specs/002_field_contracts.md
-- Sponsor-side ethics: docs/SPONSOR_PROGRAM_PRINCIPLES.md
-- Monetization amendment: docs/MONETIZATION_PRINCIPLES.md (Compensated player labor section).
--
-- CRITICAL NOTES (also in spec, repeated here for any agent reading just SQL):
--   This entire feature is OPT-IN. Default state for any player is NOT
--   opted in. The field_work_opt_in row's presence is the sole switch.
--   18+ verified is required. The age_verified_at column must be populated
--   (not null) before any field_commission_instance can be inserted for
--   that profile.
--   Cross-Witnessing is non-negotiable. Submissions cannot move to
--   'verified_paid' state without at least 3 cross_witnessing_consensus
--   rows averaging above the threshold defined in the template.
--   NO data ships to a Sponsor without 'verified' state.
--   The lattice_credit_ledger is APPEND-ONLY. Never UPDATE or DELETE.
--   payout_events have a 14-day hold for cashouts above $50 to allow
--   fraud reversal (enforced in service, audited via the ledger).

create extension if not exists pgcrypto;

-- Sponsors
create table if not exists public.sponsors (
  id                  uuid primary key default gen_random_uuid(),
  code                text not null unique,
  display_name        text not null,
  logo_storage_key    text,
  description         text not null,
  legal_entity_name   text not null,
  data_use_url        text not null,
  verified_at         timestamptz,
  verification_notes  text,
  is_active           boolean not null default false, -- DEFAULT INACTIVE; must be set true after vetting
  created_at          timestamptz not null default now()
);
create index if not exists sponsors_active_idx on public.sponsors (is_active) where is_active = true;
alter table public.sponsors enable row level security;
create policy sponsors_public_read on public.sponsors for select using (is_active = true);
comment on table public.sponsors is 'Vetted paying entities that fund Field Commissions. is_active is FALSE until vetting passes.';

-- Opt-in registry
create table if not exists public.field_work_opt_in (
  profile_id       uuid primary key references public.profiles(id) on delete cascade,
  opted_in_at      timestamptz not null default now(),
  consent_version  text not null,
  jurisdiction     text not null,
  age_verified_at  timestamptz not null,
  cashout_method   jsonb,
  opted_out_at     timestamptz
);
create index if not exists field_work_opt_in_active_idx on public.field_work_opt_in (profile_id) where opted_out_at is null;
alter table public.field_work_opt_in enable row level security;
create policy field_work_opt_in_self_select on public.field_work_opt_in for select using (auth.uid() = profile_id);
create policy field_work_opt_in_self_insert on public.field_work_opt_in for insert with check (auth.uid() = profile_id);
create policy field_work_opt_in_self_update on public.field_work_opt_in for update using (auth.uid() = profile_id);
comment on table public.field_work_opt_in is 'Players who have opted into compensated Field Contracts. ABSENCE of a row means NOT opted in.';

-- Field Commission templates
create table if not exists public.field_commission_templates (
  id                      uuid primary key default gen_random_uuid(),
  sponsor_id              uuid not null references public.sponsors(id) on delete restrict,
  code                    text not null unique,
  display_name            text not null,
  briefing                text not null,
  objective_spec          jsonb not null,
  target_submissions      int not null check (target_submissions > 0),
  submissions_committed   int not null default 0,
  per_submission_credits  int not null check (per_submission_credits > 0),
  witness_credit_pct      int not null default 25 check (witness_credit_pct between 0 and 100),
  consensus_threshold     numeric not null default 0.65 check (consensus_threshold between 0 and 1),
  min_witnesses           int not null default 3 check (min_witnesses >= 3),
  annotation_min_chars    int not null default 20,
  annotation_max_chars    int not null default 500 check (annotation_max_chars > annotation_min_chars),
  geographic_scope        jsonb not null,
  starts_at               timestamptz not null,
  expires_at              timestamptz not null check (expires_at > starts_at),
  data_use_summary        text not null,
  is_active               boolean not null default false,
  created_at              timestamptz not null default now()
);
create index if not exists field_commission_templates_active_idx on public.field_commission_templates (is_active, expires_at) where is_active = true;
create index if not exists field_commission_templates_sponsor_idx on public.field_commission_templates (sponsor_id);
alter table public.field_commission_templates enable row level security;
create policy field_commission_templates_opted_in_read on public.field_commission_templates for select using (
  is_active = true and exists (
    select 1 from public.field_work_opt_in foi
    where foi.profile_id = auth.uid() and foi.opted_out_at is null
  )
);

-- Field Commission instances
create table if not exists public.field_commission_instances (
  id                uuid primary key default gen_random_uuid(),
  template_id       uuid not null references public.field_commission_templates(id) on delete restrict,
  profile_id        uuid not null references public.profiles(id) on delete cascade,
  accepted_at       timestamptz not null default now(),
  state             text not null check (state in (
    'accepted','submitted_pending_consensus','verified_paid',
    'rejected_consensus','withdrawn','expired'
  )) default 'accepted',
  annotation_text   text,
  consensus_score   numeric check (consensus_score is null or consensus_score between 0 and 1),
  verified_at       timestamptz,
  credits_awarded   int not null default 0,
  payout_event_id   uuid,
  withdrawn_at      timestamptz,
  withdraw_reason   text,
  created_at        timestamptz not null default now()
);
create index if not exists field_commission_instances_profile_idx on public.field_commission_instances (profile_id, state);
create index if not exists field_commission_instances_state_idx   on public.field_commission_instances (state, accepted_at);
create index if not exists field_commission_instances_template_idx on public.field_commission_instances (template_id, state);
alter table public.field_commission_instances enable row level security;
create policy field_commission_instances_self_select on public.field_commission_instances for select using (auth.uid() = profile_id);
create policy field_commission_instances_self_insert on public.field_commission_instances for insert with check (
  auth.uid() = profile_id and exists (
    select 1 from public.field_work_opt_in foi
    where foi.profile_id = auth.uid() and foi.opted_out_at is null and foi.age_verified_at is not null
  )
);
create policy field_commission_instances_self_update on public.field_commission_instances for update using (auth.uid() = profile_id);

-- Cross-Witnessing consensus
create table if not exists public.cross_witnessing_consensus (
  field_commission_instance_id uuid not null references public.field_commission_instances(id) on delete cascade,
  witness_profile_id           uuid not null references public.profiles(id) on delete cascade,
  witnessed_at                 timestamptz not null default now(),
  witness_annotation           text not null,
  agreement_score              numeric not null check (agreement_score between 0 and 1),
  witness_credits_awarded      int not null default 0,
  primary key (field_commission_instance_id, witness_profile_id)
);
create index if not exists cross_witnessing_witness_idx on public.cross_witnessing_consensus (witness_profile_id, witnessed_at desc);
alter table public.cross_witnessing_consensus enable row level security;
create policy cross_witnessing_witness_self_select on public.cross_witnessing_consensus for select using (auth.uid() = witness_profile_id);
comment on table public.cross_witnessing_consensus is 'Each row is one witness''s independent rating of one submission. Anonymous to the submitter.';

-- Lattice Credits wallet
create table if not exists public.lattice_credit_balances (
  profile_id        uuid primary key references public.profiles(id) on delete cascade,
  balance           int not null default 0 check (balance >= 0),
  lifetime_earned   int not null default 0 check (lifetime_earned >= 0),
  lifetime_spent    int not null default 0 check (lifetime_spent >= 0),
  lifetime_cashed_out int not null default 0 check (lifetime_cashed_out >= 0),
  last_updated      timestamptz not null default now()
);
alter table public.lattice_credit_balances enable row level security;
create policy lattice_credit_balances_self_select on public.lattice_credit_balances for select using (auth.uid() = profile_id);

-- Lattice Credits ledger (APPEND-ONLY)
create table if not exists public.lattice_credit_ledger (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  delta        int not null,
  kind         text not null check (kind in (
    'earn_commission_submitter','earn_commission_witness','earn_commission_good_faith',
    'spend_cosmetic','cashout','admin_adjustment','refund'
  )),
  reference_id uuid,
  note         text,
  created_at   timestamptz not null default now()
);
create index if not exists lattice_credit_ledger_profile_idx on public.lattice_credit_ledger (profile_id, created_at desc);
create index if not exists lattice_credit_ledger_kind_idx    on public.lattice_credit_ledger (kind, created_at desc);
alter table public.lattice_credit_ledger enable row level security;
create policy lattice_credit_ledger_self_select on public.lattice_credit_ledger for select using (auth.uid() = profile_id);
comment on table public.lattice_credit_ledger is 'APPEND-ONLY audit log of every credit change. Never UPDATE or DELETE rows here.';

-- Payout events
create table if not exists public.payout_events (
  id                   uuid primary key default gen_random_uuid(),
  profile_id           uuid not null references public.profiles(id) on delete restrict,
  requested_at         timestamptz not null default now(),
  processed_at         timestamptz,
  credits_cashed_out   int not null check (credits_cashed_out > 0),
  cash_amount_minor    int not null check (cash_amount_minor > 0),
  cash_currency        text not null,
  provider             text not null check (provider in ('stripe_connect','paypal_masspay','manual')),
  provider_ref         text,
  state                text not null check (state in ('requested','hold','processing','completed','failed','reversed')) default 'requested',
  failure_reason       text,
  hold_expires_at      timestamptz
);
create index if not exists payout_events_profile_idx on public.payout_events (profile_id, requested_at desc);
create index if not exists payout_events_state_idx   on public.payout_events (state, hold_expires_at);
alter table public.payout_events enable row level security;
create policy payout_events_self_select  on public.payout_events for select using (auth.uid() = profile_id);
create policy payout_events_self_request on public.payout_events for insert with check (
  auth.uid() = profile_id and exists (
    select 1 from public.field_work_opt_in foi
    where foi.profile_id = auth.uid() and foi.opted_out_at is null
  )
);

-- Tax reporting view
create or replace view public.vw_annual_earnings_per_profile as
select
  l.profile_id,
  date_part('year', l.created_at) as tax_year,
  sum(case when l.delta > 0 and l.kind like 'earn%' then l.delta else 0 end) as gross_credits_earned,
  sum(case when l.kind = 'cashout' then abs(l.delta) else 0 end) as credits_cashed_out,
  foi.jurisdiction
from public.lattice_credit_ledger l
left join public.field_work_opt_in foi on foi.profile_id = l.profile_id
group by l.profile_id, date_part('year', l.created_at), foi.jurisdiction;
comment on view public.vw_annual_earnings_per_profile is 'Annual aggregation feeding tax-form generation. Read by admin tooling only.';

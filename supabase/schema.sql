create extension if not exists pgcrypto;

create table if not exists profiles (
  id              uuid primary key default gen_random_uuid(),
  codename        text not null unique,
  class_name      text not null,
  sync_percent    integer not null default 100 check (sync_percent between 0 and 100),
  cyber_cells_status text not null default 'OPTIMAL',
  home_latitude   numeric(9,6),
  home_longitude  numeric(9,6),
  created_at      timestamptz not null default now()
);

create table if not exists nodes (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  node_type       text not null check (node_type in ('vault','wilds','salvage','nexus','market','pocket_dimension')),
  latitude        numeric(9,6) not null,
  longitude       numeric(9,6) not null,
  resonance_level text not null check (resonance_level in ('low','medium','high')),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create table if not exists inventory (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references profiles(id) on delete cascade,
  node_id         uuid references nodes(id) on delete set null,
  item_name       text not null,
  rarity          text not null check (rarity in ('COMMON','REFINED','ORNATE','LEGENDARY','MYTHIC')),
  item_type       text,
  description     text,
  coordinates_text text,
  epoch           timestamptz,
  discoverer      uuid references profiles(id) on delete set null,
  metadata        jsonb not null default '{}',
  created_at      timestamptz not null default now()
);

create index if not exists idx_inventory_owner  on inventory(owner_id);
create index if not exists idx_inventory_rarity on inventory(rarity);
create index if not exists idx_nodes_location   on nodes(latitude, longitude);

alter table profiles  enable row level security;
alter table nodes     enable row level security;
alter table inventory enable row level security;

create policy if not exists profiles_select_all on profiles  for select using (true);
create policy if not exists nodes_select_all    on nodes     for select using (true);
create policy if not exists inventory_select_all on inventory for select using (true);

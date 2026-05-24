-- =============================================================
-- Nexus Earth Database Schema
-- Supabase / PostgreSQL
-- IP-Constrained Vocabulary:
--   Operators   (not Players)
--   Nexus Currents (not Ley Lines)
--   Resonance   (not PPE)
--   Anomalies   (not D-Bees)
--   Cyber-Cells  (not MDC)
--   Dimensional Tear (not Rift)
-- =============================================================

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ---------------------------------------------------------------
-- FACTIONS
-- ---------------------------------------------------------------
CREATE TABLE factions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url    TEXT,
  color_hex   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------
-- OPERATORS  (core user profiles)
-- ---------------------------------------------------------------
CREATE TABLE operators (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT NOT NULL UNIQUE,
  faction_id      UUID REFERENCES factions(id),
  resonance       INTEGER NOT NULL DEFAULT 0,   -- energy currency (Resonance)
  cyber_cells     INTEGER NOT NULL DEFAULT 100, -- hit points (Cyber-Cells)
  level           INTEGER NOT NULL DEFAULT 1,
  xp              INTEGER NOT NULL DEFAULT 0,
  avatar_url      TEXT,
  location        GEOGRAPHY(POINT, 4326),        -- last known geolocation
  is_online       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_operators_location ON operators USING GIST (location);
CREATE INDEX idx_operators_faction  ON operators (faction_id);

-- ---------------------------------------------------------------
-- NEXUS NODES  (map landmarks / control points)
-- ---------------------------------------------------------------
CREATE TABLE nexus_nodes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  node_type       TEXT NOT NULL CHECK (node_type IN ('current_hub', 'anomaly_site', 'tear_gate', 'outpost', 'ruin')),
  location        GEOGRAPHY(POINT, 4326) NOT NULL,
  controlling_faction_id UUID REFERENCES factions(id),
  resonance_output INTEGER DEFAULT 10,           -- Resonance yield per cycle
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_nexus_nodes_location ON nexus_nodes USING GIST (location);
CREATE INDEX idx_nexus_nodes_faction  ON nexus_nodes (controlling_faction_id);

-- ---------------------------------------------------------------
-- NEXUS CURRENTS  (energy lines connecting nodes)
-- ---------------------------------------------------------------
CREATE TABLE nexus_currents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_a_id   UUID NOT NULL REFERENCES nexus_nodes(id) ON DELETE CASCADE,
  node_b_id   UUID NOT NULL REFERENCES nexus_nodes(id) ON DELETE CASCADE,
  strength    INTEGER DEFAULT 50,  -- 0-100 current intensity
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (node_a_id, node_b_id)
);

-- ---------------------------------------------------------------
-- DIMENSIONAL TEARS  (world events / portal encounters)
-- ---------------------------------------------------------------
CREATE TABLE dimensional_tears (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location    GEOGRAPHY(POINT, 4326) NOT NULL,
  severity    INTEGER DEFAULT 1 CHECK (severity BETWEEN 1 AND 5),
  description TEXT,
  is_sealed   BOOLEAN DEFAULT FALSE,
  opened_at   TIMESTAMPTZ DEFAULT now(),
  sealed_at   TIMESTAMPTZ,
  sealed_by   UUID REFERENCES operators(id)
);

CREATE INDEX idx_tears_location ON dimensional_tears USING GIST (location);

-- ---------------------------------------------------------------
-- ANOMALIES  (hostile entities in the world)
-- ---------------------------------------------------------------
CREATE TABLE anomalies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  anomaly_type  TEXT NOT NULL,
  cyber_cells   INTEGER NOT NULL DEFAULT 50,
  resonance_drop INTEGER DEFAULT 5,
  location      GEOGRAPHY(POINT, 4326),
  tear_id       UUID REFERENCES dimensional_tears(id),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_anomalies_location ON anomalies USING GIST (location);

-- ---------------------------------------------------------------
-- INVENTORY ITEMS (item definitions / catalog)
-- ---------------------------------------------------------------
CREATE TABLE item_definitions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  item_type   TEXT NOT NULL CHECK (item_type IN ('weapon', 'armor', 'consumable', 'blueprint', 'resource', 'relic')),
  rarity      TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  resonance_cost INTEGER DEFAULT 0,
  icon_url    TEXT,
  metadata    JSONB DEFAULT '{}'
);

-- ---------------------------------------------------------------
-- OPERATOR INVENTORY
-- ---------------------------------------------------------------
CREATE TABLE operator_inventory (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id   UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  item_id       UUID NOT NULL REFERENCES item_definitions(id),
  quantity      INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  is_equipped   BOOLEAN DEFAULT FALSE,
  acquired_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (operator_id, item_id)
);

CREATE INDEX idx_inventory_operator ON operator_inventory (operator_id);

-- ---------------------------------------------------------------
-- COMMS (in-game messaging)
-- ---------------------------------------------------------------
CREATE TABLE comms_channels (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('global', 'faction', 'direct', 'region')),
  faction_id  UUID REFERENCES factions(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE comms_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id  UUID NOT NULL REFERENCES comms_channels(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES operators(id),
  content     TEXT NOT NULL,
  sent_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_channel ON comms_messages (channel_id, sent_at DESC);

-- ---------------------------------------------------------------
-- NODE CAPTURE LOG
-- ---------------------------------------------------------------
CREATE TABLE node_capture_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id       UUID NOT NULL REFERENCES nexus_nodes(id),
  captured_by   UUID NOT NULL REFERENCES operators(id),
  faction_id    UUID NOT NULL REFERENCES factions(id),
  captured_at   TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------
ALTER TABLE operators          ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE comms_messages     ENABLE ROW LEVEL SECURITY;

-- Operators can read all profiles but only update their own
CREATE POLICY operators_select ON operators FOR SELECT USING (true);
CREATE POLICY operators_update ON operators FOR UPDATE USING (auth.uid() = id);

-- Inventory: operators access only their own rows
CREATE POLICY inventory_select ON operator_inventory FOR SELECT USING (auth.uid() = operator_id);
CREATE POLICY inventory_insert ON operator_inventory FOR INSERT WITH CHECK (auth.uid() = operator_id);
CREATE POLICY inventory_update ON operator_inventory FOR UPDATE USING (auth.uid() = operator_id);
CREATE POLICY inventory_delete ON operator_inventory FOR DELETE USING (auth.uid() = operator_id);

-- Comms: operators can read messages in channels they belong to (simplified)
CREATE POLICY comms_select ON comms_messages FOR SELECT USING (true);
CREATE POLICY comms_insert ON comms_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ---------------------------------------------------------------
-- UPDATED_AT TRIGGER
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_operators_updated
  BEFORE UPDATE ON operators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_nodes_updated
  BEFORE UPDATE ON nexus_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

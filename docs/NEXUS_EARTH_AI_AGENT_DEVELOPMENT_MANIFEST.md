# 🌍 NEXUS EARTH: AI Agent Development Manifest

> **Self-Improving Document** — Every agent iteration MUST update this file with completed work, new decisions, outstanding tasks, and risks before committing. This is the single source of truth for all agents working on this project.

---

## 1. PROJECT OVERVIEW & ORIGINAL IP

**Project Name:** Nexus Earth Mobile 
**Repo:** `lyvasana/nexus-earth` 
**Tech Stack:** React Native, Expo ~52, TypeScript, React Navigation v6, Supabase, React-Three-Fiber 
**Genre:** Post-Apocalyptic Geospatial MMORPG (AR + Base Building + UGC) 
**Current Version:** 0.3.0 
**Last Updated:** 2026-05-23 
**Last Agent:** Comet (Perplexity)

### Original IP Constraints — DO NOT use Palladium/Rifts terminology

| Nexus Earth Term | Replaced Term | Notes |
|---|---|---|
| Nexus Currents | Ley Lines | Energy grid intersecting real-world locations |
| Resonance | PPE/Magic | Harvestable energy resource |
| Anomalies | D-Bees | Extradimensional entities/mutants |
| Operators | Players/Characters | Cyber-augmented specialists |
| Cyber-Cells | MDC/Hit Points | Operator health/energy resource |
| Dimensional Tear | Rift | Portal/anomaly zone on map |
| High-Resonance | High-PPE | Node energy descriptor |
| Collapse | The Rifts | The world-ending event |

---

## 2. CORE GAMEPLAY PILLARS

1. **Geospatial Scavenging (AR Layer):** Walk real world, collect 5 rarity tiers, harvest Resonance at Nexus Nodes.
2. **Voxel Base Building (Minecraft Layer):** Use scavenged materials to build 3D outposts block-by-block.
3. **Pocket Dimensions (Roblox/UGC Layer):** High-level players build custom dungeons anchored to GPS coordinates.

### Rarity Tiers
| Tier | Color | Resonance Value |
|---|---|---|
| Common | `#b9cacb` | 10-50 |
| Refined | `#10B981` | 51-200 |
| Ornate | `#00E0FF` | 201-500 |
| Legendary | `#A855F7` | 501-900 |
| Mythic | `#F59E0B` | 901-1000 |

### Node Types
| Type | Color | Real-World Mapping |
|---|---|---|
| nexus | `#00E0FF` | Parks, landmarks, monuments |
| salvage | `#A45C40` | Auto shops, junkyards, depots |
| wilderness | `#10B981` | Trails, reserves, green space |
| anomaly | `#FF3B3B` | Dimensional tears, unstable zones |
| vault | `#F59E0B` | Banks, government buildings, vaults |

---

## 3. REPOSITORY STRUCTURE

```
nexus-earth/
├── .env.example
├── app.json
├── package.json
├── tsconfig.json
├── babel.config.js
├── App.tsx
├── docs/
│   ├── NEXUS_EARTH_AI_AGENT_DEVELOPMENT_MANIFEST.md  ← THIS FILE
│   └── ITERATION_STATUS.md
├── src/
│   ├── theme/theme.ts
│   ├── types/index.ts
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── useInventory.ts
│   │   ├── useProfile.ts
│   │   └── useNodes.ts
│   ├── data/mockData.ts
│   ├── navigation/AppNavigator.tsx
│   ├── components/
│   │   ├── HUDHeader.tsx
│   │   ├── SurvivorPanel.tsx
│   │   ├── LootFilters.tsx
│   │   ├── LootCard.tsx
│   │   ├── LootCardList.tsx
│   │   ├── MobileTabBar.tsx
│   │   ├── NodeMarker.tsx
│   │   └── VoxelCanvas.tsx
│   └── screens/
│       ├── WorldScreen.tsx
│       ├── BaseScreen.tsx
│       ├── CompanionScreen.tsx
│       ├── StoresScreen.tsx
│       ├── LogsScreen.tsx
│       └── ProfileScreen.tsx
└── supabase/
    └── schema.sql
```

---

## 4. AGENT TASK BACKLOG

### Phase 1: IP Scrub & Theme Centralization ✅ COMPLETE
- [x] Created `src/theme/theme.ts` with full color palette, rarity colors, node colors
- [x] Updated `mockData.ts` — replaced all Rifts/PPE terminology with Nexus Earth IP
- [x] Refactored all components to import from `theme.ts`
- [x] Added `RarityTier` and `NodeType` as exported types

### Phase 2: Navigation Integration ✅ COMPLETE
- [x] Installed `@react-navigation/native` and `@react-navigation/bottom-tabs`
- [x] Refactored `App.tsx` to use `NavigationContainer`
- [x] Created `AppNavigator.tsx` with 5-tab bottom navigation
- [x] Created placeholder screens: `WorldScreen`, `BaseScreen`, `CompanionScreen`, `StoresScreen`
- [x] Moved inventory HUD into `LogsScreen`

### Phase 3: Backend & Provenance Setup ✅ COMPLETE (Schema + Client — Awaiting Keys)
- [x] Created `src/services/supabase.ts` client initialization
- [x] Wrote `supabase/schema.sql` with `profiles`, `inventory`, `nodes` tables
- [x] `inventory` table supports `epoch` timestamp + `discoverer` for Mythic Provenance
- [x] Created `useInventory.ts`, `useProfile.ts`, `useNodes.ts` data hooks
- [ ] **BLOCKED:** Requires user to add Supabase project URL + anon key to `.env`
- [ ] Row Level Security (RLS) policies not yet written
- [ ] Auth flow (sign up / sign in) not yet built

### Phase 4: Voxel Base Building POC ✅ COMPLETE (POC)
- [x] `BaseScreen.tsx` created with React Three Fiber canvas
- [x] 10x10 grid rendered in 3D
- [x] Tap-to-place `Scrap Polymer` block with raycasting
- [ ] Multiple block types not yet selectable
- [ ] Block persistence (save/load from Supabase) not yet implemented
- [ ] Block destruction / Anomaly raid mechanic not yet built

### Phase 5: World Map Screen 🔴 NOT STARTED
- [ ] Install and configure `react-native-maps`
- [ ] Request `expo-location` GPS permission on mount
- [ ] Center map on player's real GPS coordinates
- [ ] Render `NexusNode` markers from `mockData` / Supabase
- [ ] Node tap → detail modal (name, type, resonance level, threat)
- [ ] Scan radius overlay (adaptive circle around player position)
- [ ] Animate Nexus Current energy pulse on node markers

### Phase 6: Operator Profile Screen 🔴 NOT STARTED
- [ ] Display class icon, level, Resonance balance, Cyber-Cells
- [ ] Faction badge and allegiance display
- [ ] XP bar with level-up thresholds
- [ ] Loadout slots (equipped gear from inventory)
- [ ] Sync % gauge (Fixer class mechanic)

### Phase 7: Companion Screen 🔴 NOT STARTED
- [ ] Display bonded Anomaly companion with stat card
- [ ] Bond percentage gauge
- [ ] Ability list with unlock thresholds
- [ ] Companion leveling and feeding mechanic

### Phase 8: Stores Screen 🔴 NOT STARTED
- [ ] Faction marketplace — buy/sell loot items
- [ ] Resonance balance displayed prominently
- [ ] Filter by rarity, type, faction
- [ ] Listing cards matching LootCard aesthetic

### Phase 9: Auth & Onboarding 🔴 NOT STARTED
- [ ] Supabase email/password auth
- [ ] Operator name + class selection on first launch
- [ ] Origin Town GPS coordinate capture (sets home base)
- [ ] Tutorial flow (first scan, first loot drop, first base block)

### Phase 10: Real Geospatial Node Generation 🔴 NOT STARTED
- [ ] Integrate OpenStreetMap Overpass API or Google Places
- [ ] Convert real POIs (parks, landmarks, depots) into typed NexusNodes
- [ ] Adaptive scan radius logic (urban vs suburban density)
- [ ] Cache node data locally for offline use

---

## 5. TECHNICAL DECISIONS LOG

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-23 | Expo ~52 as base | Easiest managed workflow, OTA updates, EAS Build |
| 2026-05-23 | Supabase for backend | Postgres + Auth + Realtime + free tier; fits solo/small team |
| 2026-05-23 | React Three Fiber for voxels | Best React-native 3D lib; expo-gl integration available |
| 2026-05-23 | NativeWind deferred | Tailwind classes don't translate 1:1 to RN StyleSheet; using theme.ts instead |
| 2026-05-23 | mockData.ts as content layer | Allows spreadsheet-driven iteration before Supabase is live |
| 2026-05-23 | Bottom tab nav (5 tabs) | World / Base / Companion / Stores / Logs — matches original HTML HUD nav |

---

## 6. KNOWN RISKS & CONSIDERATIONS

### 🔴 Critical
- **React Three Fiber on iOS/Android:** `expo-gl` + `@react-three/fiber` mobile support can be unstable. Test on real device early. May need `expo-three` or a native alternative.
- **GPS Battery Drain:** Continuous location polling will drain battery. Implement background location throttling and scan-on-demand rather than always-on.
- **Supabase RLS:** Without Row Level Security policies, all player data is readable by anyone with the anon key. Must implement before any public testing.

### 🟡 Important
- **react-native-maps on Expo Go:** Requires custom dev build (`eas build`) — does not work in standard Expo Go. Plan for this early.
- **Geospatial Node Generation:** Current nodes are hardcoded mock data. Real OSM/Google Places integration requires API key management and rate limiting.
- **Voxel Performance:** React Three Fiber renders well for small grids. At scale (large outposts), instanced meshes and level-of-detail will be required.
- **Class Balance:** 4 operator classes (Vanguard, Enforcer, Fixer, Shifter) have no stat differentiation yet. Balance work deferred to Phase 6.

### 🟢 Low Priority
- Font loading (JetBrains Mono, Space Grotesk) needs `expo-font` or Google Fonts setup in Expo
- Dark mode is hardcoded — no light mode planned but worth noting
- No push notifications yet (needed for Anomaly raid alerts)

---

## 7. ENVIRONMENT SETUP

### Required `.env` variables
```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

### Supabase Setup Steps
1. Go to https://supabase.com and create a new project
2. Copy Project URL and anon key from Settings > API
3. Paste into `.env` (copy from `.env.example`)
4. Run `supabase/schema.sql` in the Supabase SQL editor
5. Enable Row Level Security on all tables (policies TBD in Phase 9)

### Run the app
```bash
npm install
npx expo start
```
> Note: World Map screen requires a custom Expo dev build — `npx eas build --profile development`

---

## 8. ITERATION LOG

### Iteration 1 — 2026-05-23 — Agent: Comet (Perplexity)
**Completed:**
- Created GitHub repo `lyvasana/nexus-earth`
- Built full project scaffold: all 4 phases delivered
- Phase 1: theme.ts, IP scrub, mockData updated
- Phase 2: React Navigation, 5-screen app shell
- Phase 3: Supabase client, schema.sql, 3 data hooks
- Phase 4: React Three Fiber voxel POC in BaseScreen
- All 19 files committed to main branch

**Decisions Made:**
- Used `theme.ts` instead of NativeWind for RN compatibility
- Deferred Auth to Phase 9 to keep MVP scope tight
- mockData.ts drives all UI until Supabase keys are added

**Outstanding / Next Agent Should:**
1. Build `WorldScreen.tsx` with live GPS + react-native-maps node markers
2. Write Supabase RLS policies
3. Build `ProfileScreen.tsx` with real operator stats
4. Add `expo-font` for JetBrains Mono + Space Grotesk
5. Test React Three Fiber on a real iOS/Android device
6. Wire `useInventory`, `useNodes`, `useProfile` hooks to real Supabase data

---

*This document is maintained by AI agents and the project owner. Update before every commit.*

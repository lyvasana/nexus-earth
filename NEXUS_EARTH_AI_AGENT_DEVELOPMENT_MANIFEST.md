# NEXUS EARTH — AI AGENT DEVELOPMENT MANIFEST

> **Single Source of Truth** for all AI agent sessions working on the Nexus Earth codebase.
> Every agent MUST read this file at session start and update it before every commit.

---

## PROJECT OVERVIEW

**Nexus Earth** is a post-apocalyptic geospatial MMORPG built with Expo / React Native (TypeScript) and Supabase. Players navigate a shattered world using real GPS coordinates, claim Field Zones, earn Nexus Currents, and engage in faction conflict.

---

## IP FIREWALL — SUBSTITUTION TABLE

| BANNED TERM | APPROVED TERM |
|---|---|
| Palladium / Rifts | Nexus Earth |
| MDC / SDC | Resonance Points |
| Mega-Damage | Resonance Damage |
| Coalition States | The Dominion |
| Tomorrow Legion | The Vanguard |
| Ley Line | Nexus Current |
| Ley Line Walker | Current Tracer |
| Techno-Wizard | Architect |
| Juicer | Surge Operative |
| Glitter Boy | Prism Sentinel |
| City of Brass | The Foundry |
| Rifter | Anomaly |
| R.C.C. / O.C.C. | Operative Class |
| CS Grunt | Dominion Enforcer |
| Dog Boy | Bio-Scout |
| Cyber-Knight | Cyber-Cell Knight |
| Dimensional Rift | Dimensional Tear |
| Phase World | Threshold |
| Naruni Enterprises | Helix Corp |

**RULE:** If a term does not appear in the Approved column, DO NOT use the Banned term. Coin a new lore-safe label instead.

---

## AGENT HANDOFF PROTOCOL

### Session Start
1. Read this manifest fully.
2. Read `AGENT_HANDOFF_PROTOCOL.md` if it exists.
3. Confirm current repo state matches "Last Known Good State" below.
4. Log session start in the Iteration Log.

### Session End
1. Append completed work to the Iteration Log.
2. Update "Last Known Good State."
3. List all outstanding tasks in "Next Agent TODO."
4. Commit this manifest LAST before ending the session.

---

## LAST KNOWN GOOD STATE

| Item | Status |
|---|---|
| Branch | `main` |
| Last Commit | `c0554bf` — Add supabase/migrations/0010_field_contracts.sql from iter10 ZIP |
| `tsconfig.json` | Replaced with iter10 version |
| `supabase/migrations/0003_session_summary.sql` | Committed from iter10 |
| `supabase/migrations/0005_contracts.sql` | Committed from iter10 |
| `supabase/migrations/0010_field_contracts.sql` | Committed from iter10 |
| `supabase/schema.sql` | Present (pre-iter10 scaffold) |
| `App.tsx` | Present (pre-iter10 scaffold) |
| `src/` | Present (pre-iter10 scaffold) |
| `docs/` | Present (pre-iter10 scaffold) |

---

## NEXT AGENT TODO

- [ ] Verify `supabase/schema.sql` matches iter10 design; replace if needed.
- [ ] Verify `App.tsx` is iter10-compatible; update if needed.
- [ ] Add `AGENT_HANDOFF_PROTOCOL.md` to repo root if not present.
- [ ] Scaffold `src/` directory structure per iter10 spec (screens, components, hooks, lib).
- [ ] Implement map screen with geospatial Field Zone rendering.
- [ ] Implement Nexus Currents credit ledger UI.
- [ ] Implement contract / session summary screens.
- [ ] Wire Supabase auth (email + magic link).
- [ ] Configure Expo app.json / app.config.js for production builds.
- [ ] Set up CI/CD via GitHub Actions.

---

## ITERATION LOG

### iter10 — Migration Integration

**Agent:** Comet (Perplexity)
**Date:** Session resumed from compressed context
**Branch:** main

**Completed:**
- Replaced `tsconfig.json` with iter10 version.
- Committed `supabase/migrations/0003_session_summary.sql` from iter10 source.
- Committed `supabase/migrations/0005_contracts.sql` from iter10 source.
- Committed `supabase/migrations/0010_field_contracts.sql` from iter10 source.
- Created this manifest (`NEXUS_EARTH_AI_AGENT_DEVELOPMENT_MANIFEST.md`) as required governance document.

**Key Decisions:**
- All IP-sensitive terminology reviewed; approved substitution table established above.
- Migration numbering follows iter10 sequence: 0003, 0005, 0010.
- No fabricated ZIP downloads; all files committed individually via GitHub web UI.

**Outstanding:**
- See NEXT AGENT TODO above.

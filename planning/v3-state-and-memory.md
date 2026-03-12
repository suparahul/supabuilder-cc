# V3 State & Memory — Working Doc

## Problem Statements (from user)

### P1: Mission Detection on Session Start
Multiple missions can be active simultaneously. On session start, the orchestrator needs to:
- Auto-detect from user's message which mission they're referring to
- Detect that no existing mission matches → create new one
- Recognize user might want general discussion (no mission)
- Quick fixes might not need a mission at all

**Current behavior**: Orchestrator reads state.json + journal.md, but detection logic is loosely defined.

### P2: state.json Bloat — Finished Missions in active_missions
The `active_missions` array currently holds finished missions too. Options:
- Split into `active_missions` + `completed_missions` (or `past_missions`)
- Remove completed missions entirely from state.json to keep it light

### P3: Journal Becomes Too Long
journal.md grows indefinitely → too many tokens on session start. Need to split memory into:
- **Mission-level**: detailed daily log inside the mission (actions, changes, decisions)
- **Mission-level recent**: most recent status/context in mission.json itself — **replace, not append** (always current snapshot, not growing list)
- **Global-level**: curated memory.md with thought process behind curation (not a raw log)

### P4: Structural Review of state.json and mission.json
Questions about current schema:
- Are `decisions` in mission.json the right approach? (key-value of decision name → choice)
- Mood records in state — are they needed?
- What fields actually get read vs just accumulate?

### P5: Frequent State Updates (Session Resilience)
Sessions can end abruptly (user clears context, crashes, etc.). State updates need to be frequent enough that progress isn't lost. Current approach of "update at natural pause points" may be too infrequent.

---

## Design Goals

1. **Fast session start**: Orchestrator reads minimal state to orient — which mission, what phase, what's the latest context
2. **Layered depth**: Quick summary available immediately, detailed history available if needed (read on demand)
3. **Session resilience**: Frequent writes so abrupt endings don't lose much
4. **Clean separation**: Project-level progress history vs mission-level working state
5. **No unbounded growth** in files that are read on every session start

*Note: Complete solution depends on coordination and lifecycle orchestration decisions (still to be discussed).*

---

## Current State Architecture (v2)

```
supabuilder/
├── state.json              # System-wide: missions list, settings, cost mode
├── journal.md              # Global narrative log (unbounded growth!)
└── missions/{id}/
    ├── mission.json        # Structured: phase, decisions, progress, artifacts
    └── _overview.md        # Narrative discussion doc
```

**What gets read on session start (current)**: state.json + journal.md + active mission.json files

---

## V3 State Architecture

### Two Layers of State

**Layer 1: Project-level (read every session start)**
- `state.json` — settings, active/past mission refs, **`latest` snapshot** (replaced each write)
- `memory.md` — curated project history, **demand-loaded only** (not read on session start)

**Layer 2: Mission-level (read when mission is active/referenced)**
- `mission.json` — structured state with `current_context` snapshot (always replaced)
- `journal.md` (per-mission) — detailed log of actions, changes, decisions. Read on demand for depth.

### Proposed state.json Schema (v3)

```json
{
  "orchestrator_active": true,
  "supabuilder_version": "0.3.0",
  "latest": "Working on auth module. Architect designing system. Open question: JWT vs server-side sessions.",
  "active_missions": [
    { "id": "2026-03-01_new-module_auth", "type": "new-module", "phase": "specifying" },
    { "id": "2026-03-05_enhancement_feed-filters", "type": "enhancement", "phase": "shaping" }
  ],
  "past_missions": [
    { "id": "2026-02-15_new-product_catapp", "type": "new-product", "status": "done", "completed": "2026-02-28" }
  ],
  "cost_mode": "smart",
  "user_control": "hands-on",
  "debate_visibility": "key_decisions"
}
```

Changes from v2: removed `last_module_touched` (redundant with `latest`). Added `latest` field (project-level orientation, replaced each write). Active missions stay lightweight {id, type, phase} — orchestrator loads mission.json files for detail. Added `past_missions` array (lightweight refs).

**Field responsibilities:**
- `latest` (state.json) = project-level. "Which mission, what's happening." Read before any mission.json. Orchestrator's perspective.
- `last_update` (mission.json) = mission-level. "What's the latest within this mission." More detailed, mission-specific. Read after loading mission.json.

### Proposed mission.json Schema (v3)

```json
{
  "id": "2026-03-01_new-module_auth",
  "type": "new-module",
  "name": "Authentication System",
  "description": "Email/password + OAuth authentication with role-based access",
  "status": "in_progress",
  "started": "2026-03-01",
  "completed": null,
  "phase": "specifying",
  "last_update": "Architect designing auth system. Flagged concern about session management — JWT vs server-side sessions. Waiting for user input.",
  "decisions": {
    "1": "Using Supabase Auth as the auth provider for native integration",
    "2": "Supporting Google and GitHub as OAuth providers for v1",
    "3": "JWT-based sessions over server-side — simpler with Supabase"
  },
  "progress": {
    "strategist": "done",
    "pm_brief": "done",
    "designer": "done",
    "pm_requirements": "done",
    "architect": "in_progress",
    "techpm": "pending",
    "build": "pending",
    "qa": "pending"
  },
  "agent_handoff_notes": [
    { "from": "pm", "type": "architect-needed", "item": "Need feasibility check on real-time sync — affects notification design" },
    { "from": "designer", "type": "concern", "item": "Settings screen has 12+ toggles — may need grouping or progressive disclosure" }
  ],
  "modules": ["auth"],
  "ticket_tracker": "linear"
}
```

`ticket_tracker` values: `"linear"`, `"jira"`, `"tickets.md"`, etc. — tells agents where tickets live for this mission.

`agent_handoff_notes` — curated notes from agent handoffs. Anything beyond ordinary: unresolved questions, cross-domain concerns, pull-in requests, insights worth preserving. Orchestrator curates this list — adds items from agent returns, removes items when resolved. Survives session clearing.

Changes from v2: removed `current_context` object (progress already shows pipeline position). Added `last_update` as top-level field (replaced each write — captures current nuance). Decisions use numeric keys with fully descriptive values. Renamed `tracker` → `ticket_tracker` (simple tool name string). Removed `artifacts` (folder is self-documenting).

### Proposed memory.md Structure (v3)

```markdown
# Project Memory
(Demand-loaded — not read on session start. Curated history only.)

### 2026-02-28 — Cat App MVP (new-product)
Built initial MVP with profile, health tracking, and feeding modules.
Tech stack: Next.js, Supabase, Tailwind. Shipped v1 with core flows.
Strategy docs established in product-wiki.

### 2026-03-10 — Auth Module (new-module)
Added email/password + OAuth auth with Supabase Auth. JWT-based sessions.
New module: auth. Integrated with existing profile module.
```

### File Layout (v3)

```
supabuilder/
├── state.json              # System-wide: active + past missions, settings
├── memory.md               # Curated project memory (replaces journal.md)
├── product-wiki/           # (unchanged)
├── code-wiki/              # (unchanged)
└── missions/{id}/
    ├── mission.json        # Structured state + current_context snapshot
    ├── journal.md          # Per-mission detailed log (NEW — replaces global journal)
    ├── _overview.md        # Narrative discussion doc
    └── ...                 # Agent outputs, diagrams, etc.
```

### All Resolved Decisions

| # | Decision | Resolution |
|---|----------|------------|
| 1 | Finished missions in state.json | **Lightweight refs** — split into `active_missions` + `past_missions`. Past entries: `{id, type, status, completed_date}`. Bounded growth. Enables quick "has this been done?" lookups. |
| 2 | Global journal.md | **Replace with memory.md** — curated project-level memory, not a raw log. journal.md killed entirely at global level. Per-mission journals remain for detailed logging. |
| 3 | Write frequency | **After every agent completes + after orchestrator's own meaningful actions** (discussions, direct changes, decisions). Rule: after every meaningful state change, regardless of who made it. |
| 4 | current_context in mission.json | **Structured + narrative, always replaced.** Structured fields (`current_step`, `pipeline_position`, `phase`) for programmatic routing + brief narrative note for nuance/edge cases. Fixed-size snapshot, never appended. |
| 5 | Decisions in mission.json | **Keep as simple key-value.** Quick facts for agent context packets. Rationale lives in agent output files (architecture.md, product-brief.md, etc.) and per-mission journal. |
| 6 | Progress tracking | **Keep explicit, align with pipeline steps.** Progress mirrors the fixed pipeline: `{strategist: "done", pm_brief: "done", designer: "in_progress", ...}`. No ambiguity. |
| 7 | memory.md curation | **History-only, demand-loaded.** "Current" snapshot lives in state.json instead (already loaded on session start). memory.md is curated history appended at mission milestones. Only read when orchestrator needs past context. |
| 8 | Current snapshot location | **state.json `latest` field** — brief narrative of what's actively happening. Replaced on every state write. Comes for free since state.json is always loaded on session start. |

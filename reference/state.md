# State Management — Reference

Read this when updating state.json, settings.json, mission.json, or managing mission progression.

---

## State Files

| File | Scope | What it tracks |
|------|-------|---------------|
| `supabuilder/state.json` | System-wide | Product context, active/past missions, `latest` snapshot |
| `supabuilder/settings.json` | System-wide | User preferences: orchestrator toggle, version, cost mode, user control |
| `supabuilder/memory.md` | System-wide | Curated project history (demand-loaded, NOT read on session start) |
| `missions/{id}/mission.json` | Per-mission | Phase, decisions, progress, handoff notes |
| `missions/{id}/journal.md` | Per-mission | Detailed action/decision log |

---

## When State Updates Happen

Update **after every agent completes + after orchestrator's own meaningful actions** (discussions, direct changes, decisions). Rule: after every meaningful state change, regardless of who made it.

**state.json updates:**
- When a new mission starts (add to `active_missions`)
- When a mission completes (move from `active_missions` to `past_missions`)
- When product name or description change
- `latest` field replaced on every write

**settings.json updates:**
- When user changes `cost_mode` or `user_control`
- When user toggles `orchestrator_active`
- When `supabuilder_version` auto-updates on startup

**mission.json updates:**
- When a key decision is made (add to `decisions`)
- When pipeline progress changes (update `progress`)
- When the mission phase advances (update `phase`)
- `last_update` field replaced on every write
- `agent_handoff_notes` curated: add from agent returns, remove when resolved

---

## Background State Clerk

Routine state updates are offloaded to a **background Haiku agent** — cheaper tokens, non-blocking orchestrator. The orchestrator composes the full payload (all thinking, all content), then spawns the clerk to persist it.

### When to use

| Situation | Method | Why |
|-----------|--------|-----|
| After agent completes | Background clerk | Most common case, speed matters |
| After user decision | Background clerk | Non-blocking |
| Mission start/complete | **Inline** | Correctness critical, infrequent |
| Wiki sync (G3 gate) | **Inline** | Must verify before marking done |
| Settings change (settings.json) | **Inline** | Rare, immediate confirmation expected |

### Spawn pattern

```
Agent tool call:
  subagent_type: "general-purpose"
  model: "haiku"
  run_in_background: true
  prompt: <state update payload — see below>
```

No `mode: "plan"` — the clerk is a mechanical writer, not a thinking agent.

### Payload format

The orchestrator's prompt to the clerk must include **everything needed to write** — the clerk does not decide what to write, only persists what it's told.

```
You are a state clerk. Write the following updates to disk exactly as specified.

## state.json
Path: supabuilder/state.json
Update these fields (merge into existing JSON, preserve all other fields):
- latest: "{orchestrator-composed sentence}"
- active_missions[0].phase: "building"
(Note: settings fields live in settings.json, not here)

## mission.json
Path: supabuilder/missions/{id}/mission.json
Update these fields:
- last_update: "{orchestrator-composed sentence}"
- progress.architect: "done"
- decisions.4: "Chose JWT tokens for session management"

## journal.md
Path: supabuilder/missions/{id}/journal.md
Append this entry:

### 2026-03-10 — Architect completed auth system design
Produced architecture.md with auth flow, data model, and API contracts.
Key decision: JWT over server-side sessions for Supabase compatibility.
Flagged: settings screen complexity — routing to Designer.

## memory.md (OPTIONAL — only if included)
Path: supabuilder/memory.md
Append this entry:

### 2026-03-10 — Auth Module architecture (new-module)
Chose JWT-based sessions over server-side for Supabase compatibility.
Architecture: Supabase Auth + RLS policies + middleware token validation.
```

### Crash safety

State discipline exists to survive session boundaries. Background writes introduce a small window where state is uncommitted. Acceptable because:
- Session crashes are rare
- The orchestrator holds state in memory and passes it to downstream agents via context packets (not file reads)
- Mission-critical writes (start/complete/wiki sync) stay inline

---

## journal.md (Per-Mission)

The mission journal at `missions/{id}/journal.md` is the detailed log of everything that happens during a mission.

**When to update:**
- After every agent completes (what they produced, key decisions, flags raised)
- After user decisions that affect direction
- After build checkpoints (what was built, QA results)
- After orchestrator's own meaningful actions (direct changes, scope discussions)
- When routing findings or resolving flags

**Format:** Timestamped entries, newest at bottom. Concise but complete enough to reconstruct what happened without reading agent output files.

    ### {date} — {event}
    {What happened. Decisions made. Files produced. Flags raised or resolved.}

---

## memory.md (Project-Wide)

`supabuilder/memory.md` tracks the product's evolution — decisions, direction, and outcomes that shape the product across missions. It is NOT a log and NOT for patterns/gotchas (use the napkin for those). Demand-loaded — not read on session start.

**Two sections:**

### Product Decisions
Cross-cutting decisions that affect the whole product. Add these **as they happen** — don't wait for mission completion. A strategic pivot, a tech stack choice, a scope cut — anything that constrains or redirects future work.

What belongs:
- Strategic decisions that set long-term direction
- Key technical choices that constrain future missions (e.g., "chose Supabase Auth — all future auth work builds on this")
- Scope decisions ("agreed on X, Y, Z — only X built in this mission, Y and Z are future work")
- User type definitions or changes
- Product pivots or direction shifts

**Format:**

    ### 2026-03-10 — Chose JWT sessions over server-side
    For Supabase compatibility. All future auth work builds on this.
    Decision made during auth module mission (new-module).

### Completed Missions
Brief summary added **at mission completion only**. Date, type, what was built, key outcomes.

**Format:**

    ### 2026-02-28 — Cat App MVP (new-product)
    Built initial MVP with profile, health tracking, and feeding modules.
    Tech stack: Next.js, Supabase, Tailwind. Shipped v1 with core flows.
    Strategy docs established in product-wiki.

    ### 2026-03-10 — Auth Module (new-module)
    Added email/password + OAuth auth with Supabase Auth. JWT-based sessions.
    New module: auth. Integrated with existing profile module.

---

## state.json Schema

```json
{
  "product_name": "My App",
  "product_description": "Short one-liner about what this product does",
  "latest": "Working on auth module. Architect designing system. Open question: JWT vs server-side sessions.",
  "active_missions": [
    { "id": "2026-03-01_new-module_auth", "type": "new-module", "phase": "specifying" }
  ],
  "past_missions": [
    { "id": "2026-02-15_new-product_catapp", "type": "new-product", "status": "done", "completed": "2026-02-28" }
  ]
}
```

| Field | Values | Description |
|-------|--------|-------------|
| `product_name` | `string` / `null` | Short product name — set during init interview or first mission |
| `product_description` | `string` / `null` | One-liner describing what the product does |
| `latest` | `string` / `null` | Project-level orientation snapshot — replaced on every write |
| `active_missions` | array | Currently active missions: `{id, type, phase}` |
| `past_missions` | array | Completed missions: `{id, type, status, completed}` |

---

## settings.json Schema

```json
{
  "orchestrator_active": true,
  "supabuilder_version": "0.3.0",
  "cost_mode": "smart",
  "user_control": "hands-on"
}
```

| Field | Values | Description |
|-------|--------|-------------|
| `orchestrator_active` | `true` / `false` | Master on/off toggle |
| `supabuilder_version` | `string` | Version of supabuilder-cc that last wrote CLAUDE.md. Compared to branding.md on startup. |
| `cost_mode` | `quality` / `smart` / `budget` | Model selection for agents |
| `user_control` | `hands-on` / `guided` / `autonomous` | How much user sees and approves |

---

## mission.json Schema

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
  "last_update": "Architect designing auth system. Flagged concern about session management.",
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
    { "from": "pm", "type": "architect-needed", "item": "Need feasibility check on real-time sync" },
    { "from": "designer", "type": "concern", "item": "Settings screen has 12+ toggles — may need grouping" }
  ],
  "modules": ["auth"],
  "ticket_tracker": null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Matches folder name: `YYYY-MM-DD_type_name` |
| `type` | string | `new-product` / `new-module` / `new-feature` / `enhancement` / `revamp` / `quick-fix` / `integrate` / `migrate` / `scale` / `pivot` |
| `status` | string | `planned` / `in_progress` / `paused` / `done` / `abandoned` |
| `phase` | string | `strategy` / `shaping` / `specifying` / `building` / `finishing` |
| `last_update` | string | Mission-level snapshot — replaced on every write |
| `decisions` | object | Numeric keys, fully descriptive values |
| `progress` | object | Pipeline-aligned: all 8 steps always present. Values: `pending` / `in_progress` / `done` / `not_needed` |
| `agent_handoff_notes` | array | Curated notes from agent handoffs — orchestrator adds/removes |
| `modules` | array | Which product modules this mission touches |
| `ticket_tracker` | string/null | Where tickets live: `"linear"`, `"jira"`, `"tickets.md"`, etc. |

---

## Mission Phase Progression

```
strategy → shaping → specifying → building → finishing → done

strategy:   Big picture — vision, direction, scope
shaping:    Exploration — options, tradeoffs, approaches
specifying: Formal specs — requirements, architecture, design
building:   Implementation — code, test, ship
finishing:  User-driven refinement — polish, adjust, verify
```

Phase advances when the orchestrator judges the mission has moved past that kind of thinking. Individual agents may still loop back. Phases describe the MISSION state; moods (discuss, research, explore, write) describe what an AGENT is doing.

### Completion transition

When G3 (Complete Gate) passes:
1. Set `phase` to `"finishing"` (if not already)
2. Set `status` to `"done"`
3. Set `completed` date
4. Move from `active_missions` to `past_missions` in state.json

The `phase` field tracks what kind of work is happening. The `status` field tracks whether the mission is alive or closed. A mission in `phase: "finishing"` with `status: "in_progress"` is being refined. Once G3 passes, `status` flips to `"done"` — the mission is closed.

---

## Wiki Sync (Complete Gate)

The enforced step at mission completion:

1. **Read mission output** — all spec files, agent summaries, decisions
2. **Identify wiki-relevant changes:**
   - New capabilities/behavior → product-wiki/
   - New architecture/patterns/data models → code-wiki/
   - New module → create module folders in both wikis
3. **Update wiki files** — module READMEs, diagrams, root overviews
4. **Add History entries** to affected module READMEs:
   ```markdown
   ## History
   - 2026-03-01 — `new-module_auth` — Initial auth system with email/password + OAuth
   ```
5. **Mark mission complete** — only after wiki updates are done

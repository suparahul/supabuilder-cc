# V3 Mission Initiation — Working Doc

## Changes from v2

### 1. Folder Scaffolding — Create Upfront

v2: Subfolders created "on demand" by agents → inconsistencies.

v3: All subfolders created at mission initiation:

```
missions/{id}/
├── mission.json        ← v3 schema
├── journal.md          ← per-mission detailed log
├── _overview.md        ← problem statement from user
├── specs/              ← agent spec outputs (requirements.md, architecture.md, etc.)
├── prototypes/         ← Designer prototypes
├── diagrams/           ← All Excalidraw diagrams
```

### 2. missions.md Reference — Rewrite for Fixed Pipelines

v2: 10 independent mission types with fluid agent lineups. Orchestrator reasons about which agents to spawn and can skip/reorder/parallel.

v3: 5 mission type groups with fixed pipelines. Orchestrator follows the pipeline — doesn't reason about lineup.

**Classification signals** remain similar but map to groups:

| User signal | Mission type | Group |
|-------------|-------------|-------|
| "I have an idea for a product..." | `new-product` | Group 1 |
| "We need [module]..." | `new-module` | Group 2 |
| "Can we add [feature]..." | `new-feature` | Group 2 |
| "Redesign/rethink..." | `revamp` | Group 2 |
| "We're changing direction..." | `pivot` | Group 2 |
| "Add [service] integration..." | `integrate` | Group 3 |
| "Move from X to Y..." | `migrate` | Group 3 |
| "Performance issue..." | `scale` | Group 3 |
| "Improve/enhance..." | `enhancement` | Group 4 |
| "Fix the bug where..." | `quick-fix` | Group 5 |

**Fixed pipelines per group** (from v3-lifecycle-changes.md):

| Group | Pipeline |
|-------|----------|
| 1: New Product | Strategist → PM → Designer → PM (2nd) → Architect → TechPM → Build → QA → Refinement |
| 2: New Module/Feature/Revamp/Pivot | Strategist → PM → Designer → PM (2nd) → Architect → TechPM → Build → QA → Refinement |
| 3: Integrate/Migrate/Scale | PM → *Decision: pull in Designer/Strategist?* → Architect → TechPM → Build → QA → Refinement |
| 4: Enhancement | PM → Designer → PM (2nd) → Architect → TechPM → Build → QA → Refinement |
| 5: Quick Fix | PM → *Decision: needs full mission?* → If yes: full pipeline with reduced moods. If no: direct change in chat. |

Group 2 pre-condition: If no strategy folder exists in product-wiki, Strategist does a strategy research run first.

### 3. mission.json — v3 Schema

Already defined in `planning/v3-state-and-memory.md`. Key fields: `last_update`, `agent_handoff_notes`, `ticket_tracker`, pipeline-aligned `progress`, numeric decision keys.

The `progress` field always has the same shape — all pipeline steps present. Steps not needed for this mission type are set to `"not_needed"` at creation.

```json
"progress": {
  "strategist": "pending",
  "pm_brief": "pending",
  "designer": "pending",
  "pm_requirements": "pending",
  "architect": "pending",
  "techpm": "pending",
  "build": "pending",
  "qa": "pending"
}
```

Valid values: `"pending"`, `"in_progress"`, `"done"`, `"not_needed"`.

**Per-group `not_needed` defaults:**
- Group 1 (New Product): all pending
- Group 2 (New Module/Feature/Revamp/Pivot): all pending
- Group 3 (Integrate/Migrate/Scale): `strategist`, `designer`, `pm_requirements` → `not_needed` (Designer/Strategist changed to `pending` if pulled in)
- Group 4 (Enhancement): `strategist` → `not_needed`
- Group 5 (Quick Fix): `strategist`, `designer`, `pm_requirements` → `not_needed`

---

## Open Questions

None currently.

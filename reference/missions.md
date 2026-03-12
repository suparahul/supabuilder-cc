# Mission Lifecycle — Reference

Read this when detecting/classifying a mission, determining the pipeline, or managing mission flow.

---

## Mission Detection

Classify user intent into a mission type from conversation context or explicit `/supabuilder:mission` command.

**Classification signals:**


| User signal                                       | Mission type  | Group   |
| ------------------------------------------------- | ------------- | ------- |
| "I have an idea for a product..."                 | `new-product` | Group 1 |
| "We need [module]..." / "Let's build [system]..." | `new-module`  | Group 2 |
| "Can we add [feature] to [module]..."             | `new-feature` | Group 2 |
| "Redesign/rethink [existing thing]..."            | `revamp`      | Group 2 |
| "We're changing direction on..."                  | `pivot`       | Group 2 |
| "Add [external service] integration..."           | `integrate`   | Group 3 |
| "Move from X to Y..." / "Upgrade [tech]..."       | `migrate`     | Group 3 |
| "Too slow at..." / "Performance issue..."         | `scale`       | Group 3 |
| "Improve/enhance [existing thing]..."             | `enhancement` | Group 4 |
| "Fix the bug where..." / "X is broken"            | `quick-fix`   | Group 5 |


When ambiguous, use AskUserQuestion to confirm the mission type.

---

## Fixed Pipelines

Each mission type group has a fixed pipeline. The orchestrator follows the pipeline — does not reason about agent lineup.


| Group                                  | Pipeline                                                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **1: New Product**                     | Strategist → PM → Designer → PM (2nd) → Architect → TechPM → Build → QA → Refinement                           |
| **2: New Module/Feature/Revamp/Pivot** | Strategist → PM → Designer → PM (2nd) → Architect → TechPM → Build → QA → Refinement                           |
| **3: Integrate/Migrate/Scale**         | PM → *Decision: pull in Designer/Strategist?* → Architect → TechPM → Build → QA → Refinement                   |
| **4: Enhancement**                     | PM → Designer → PM (2nd) → Architect → TechPM → Build → QA → Refinement                                        |
| **5: Quick Fix**                       | PM → *Decision: needs full mission?* → If yes: full pipeline with reduced moods. If no: direct change in chat. |


**Group 2 pre-condition**: If no strategy folder exists in product-wiki, Strategist does a strategy research run first.

**Group 3 decision point**: PM recommends whether Designer/Strategist needed; user decides.

---

## Mission Flow

```
User input → Detect/classify mission type → Create mission folder

  → STRATEGY PHASE:
      Strategist sets vision, direction, scope
      For missions led by a problem/metric: strategy defines the approach
      Orchestrator role: provide context, let strategist work, collect output

  → SHAPING PHASE:
      PM creates product brief, Designer explores UX
      Orchestrator role: ferry context between PM and Designer

  → SPECIFYING PHASE:
      PM writes full requirements, Architect designs technical solution
      Orchestrator role: ferry context, handle architect pull-in flags

  → BUILDING PHASE:
      TechPM creates tickets, dev agents build sequentially
      QA at checkpoints, user review at designated checkpoints
      Orchestrator role: manage build loop, route spec gaps to owning agents

  → FINISHING PHASE:
      User-driven refinement — can re-engage any agent
      Watch for scope deviation → recommend new mission if drifting

  → COMPLETION:
      Complete Gate (G3) — update wikis (non-negotiable)
      Update memory.md
      Suggest follow-up mission if natural continuation exists

  → mission.json status → done
```

For coordination mechanics (context packets, spawn protocol, plan mode), see `coordination.md`.

---

## Mission Folder Scaffolding

When a mission starts, create the full folder structure upfront:

```
missions/{id}/
├── mission.json        ← v3 schema (see state.md)
├── journal.md          ← per-mission detailed log
├── _overview.md        ← problem statement from user
├── strategy/           ← Strategist output for THIS mission
├── specs/              ← agent spec outputs (requirements.md, architecture.md, etc.)
├── prototypes/         ← Designer prototypes
├── diagrams/           ← All Excalidraw diagrams
```

All subfolders created at mission initiation — not on demand by agents.

---

## mission.json Progress Field

All pipeline steps are always present. Steps not needed for the mission type are set to `"not_needed"` at creation.

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
- Group 3 (Integrate/Migrate/Scale): `strategist`, `designer`, `pm_requirements` → `not_needed` (changed to `pending` if pulled in)
- Group 4 (Enhancement): `strategist` → `not_needed`
- Group 5 (Quick Fix): `strategist`, `designer`, `pm_requirements` → `not_needed`

---

## Nomenclature

- **"user"** = person using Supabuilder (the developer/PM operating Claude Code)
- **"customer"** = the product's end user/customer
- Keep these distinct throughout all agent prompts, specs, and documentation.

---

## Architect Early Pull-In

Architect can be pulled in at any earlier stage when technical input is needed. Agents flag the need in their handoff — orchestrator spawns Architect with the specific question. The original agent's output stands with the flag noted; the original agent does not resume.
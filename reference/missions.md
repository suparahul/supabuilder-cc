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


**Only the orchestrator spawns agents.** Use the Agent tool with the exact `subagent_type` shown below. Agents never spawn other agents.

| Type | Strategy | Shaping | Specifying | Building | Finishing |
|------|----------|---------|------------|----------|-----------|
| new-product | `strategist` | `pm` → `designer` | `pm` → `architect` | `techpm` → dev → `qa` | user-driven |
| new-module, new-feature, revamp, pivot | `strategist`* | `pm` → `designer` | `pm` → `architect` | `techpm` → dev → `qa` | user-driven |
| integrate, migrate, scale | — | `pm`† | — | `architect` → `techpm` → dev → `qa` | user-driven |
| enhancement | — | `pm` → `designer` | `pm` → `architect` | `techpm` → dev → `qa` | user-driven |
| quick-fix | — | `pm`‡ | — | direct fix or reduced pipeline | — |

\* Pre-condition: if no `strategy/` folder in product-wiki, `strategist` does strategy research first.
† Ask user: pull in `designer`/`strategist`?
‡ Ask user: needs full mission? If no → direct fix in chat, skip pipeline.

**Dev agents** = `general-purpose` subagent_type, one per ticket. **QA** runs at checkpoints during build, not as a separate phase.

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

---

## Mission Folder Scaffolding

When a mission starts, create the full folder structure upfront:

```
missions/{id}/
├── mission.json        ← mission schema
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

Progress tracks mood-level granularity for each agent. All pipeline steps are always present. Steps not needed for the mission type are set to `"not_needed"` (the entire sub-object becomes the string `"not_needed"`).

```json
"progress": {
  "strategist":  { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
  "pm_first":    { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
  "designer":    { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
  "pm_second":   { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
  "architect":   { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
  "techpm":      { "discuss": "pending", "write": "pending" },
  "build":       "pending",
  "qa":          { "discuss": "pending", "write": "pending" }
}
```

Mood values: `"pending"` | `"in_progress"` | `"done"`.

- `build` stays a flat string (no mood cycle — it's ticket execution)
- `pm_second` always runs when PM is in the pipeline — agents skip individual mood phases themselves if not needed
- Full mood cycle scaffolded for every active agent — agents decide internally whether to skip a phase

**Deriving mood (mechanical — no judgment):** Orchestrator reads the agent's sub-object, finds the first mood that is not `"done"` → that's the `mood` field in the context packet.

**Per-type defaults:**

| Type | strategist | pm_first | designer | pm_second | architect | techpm | build | qa |
|------|-----------|----------|----------|-----------|-----------|--------|-------|-----|
| new-product | full cycle | full cycle | full cycle | full cycle | full cycle | discuss+write | pending | discuss+write |
| new-module, new-feature, revamp, pivot | full cycle* | full cycle | full cycle | full cycle | full cycle | discuss+write | pending | discuss+write |
| integrate, migrate, scale | not_needed | full cycle | not_needed† | not_needed | not_needed | discuss+write | pending | discuss+write |
| enhancement | not_needed | full cycle | full cycle | full cycle | full cycle | discuss+write | pending | discuss+write |
| quick-fix | not_needed | full cycle‡ | not_needed† | not_needed | not_needed† | discuss+write | pending | discuss+write |

\* If no `strategy/` folder in product-wiki, strategist does strategy research first.
† Ask user: pull in this agent? If yes → scaffold full cycle.
‡ Ask user: needs full mission? If no → direct fix.

---

## Nomenclature

- **"user"** = person using Supabuilder (the developer/PM operating Claude Code)
- **"customer"** = the product's end user/customer
- Keep these distinct throughout all agent prompts, specs, and documentation.

---

## Architect Early Pull-In

Architect can be pulled in at any earlier stage when technical input is needed. Agents flag the need in their handoff — orchestrator spawns Architect with the specific question. The original agent's output stands with the flag noted; the original agent does not resume.
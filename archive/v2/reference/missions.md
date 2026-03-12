# Mission Lifecycle — Reference

Read this when detecting/classifying a mission, checking agent lineups, or managing mission flow.

---

## Mission Detection

Classify user intent into a mission type from conversation context or explicit `/supabuilder:mission` command.

**Classification signals:**

| User signal | Likely mission type |
|-------------|-------------------|
| "I have an idea for a product..." | `new-product` |
| "We need [module]..." / "Let's build [system]..." | `new-module` |
| "Can we add [feature] to [module]..." | `new-feature` |
| "Improve/enhance [existing thing]..." | `enhancement` |
| "Redesign/rethink [existing thing]..." | `revamp` |
| "Fix the bug where..." / "X is broken" | `quick-fix` |
| "Add [external service] integration..." | `integrate` |
| "Move from X to Y..." / "Upgrade [tech]..." | `migrate` |
| "Too slow at..." / "Performance issue..." | `scale` |
| "We're changing direction on..." | `pivot` |

When ambiguous, use AskUserQuestion to confirm the mission type.

---

## Mission Types

Each type has a default agent lineup, a first agent, and mood depth guideline. These are defaults — the orchestrator adapts.

| Type | First agent | Default lineup | Mood depth |
|------|------------|----------------|------------|
| `new-product` | Strategist | All 6 | Full cycle |
| `new-module` | Strategist | All 6 | Full cycle |
| `new-feature` | PM | All 6 (Strategist optional) | Full or compressed |
| `enhancement` | PM | PM, Designer, Architect, TechPM, QA | Can compress discuss/research |
| `revamp` | PM | All 6 | Full cycle, research-heavy |
| `quick-fix` | PM | PM, Architect (if needed), TechPM, QA | Compressed |
| `integrate` | Architect | Architect, PM, TechPM, QA | Research-heavy |
| `migrate` | Architect | Architect, TechPM, QA | Research + explore heavy |
| `scale` | Architect | Architect, TechPM, QA | Research-heavy |
| `pivot` | Strategist | All 6 | Full cycle — product may need to be rebuilt |

**"First agent" = who the orchestrator spawns first.** Not who manages — the orchestrator always manages.

**Lineup is fluid.** Bring agents in and out as context demands.

---

## Mission Flow

```
User input → Detect/classify mission type
  → Create mission folder + mission.json + _overview.md
  → Spawn first agent (per mission type default)
  → AGENT LOOP:
      1. Prepare context packet
      2. Spawn agent in current mood
      3. Agent produces output (diagram + structured summary)
      4. Read output
      5. Decide: advance mood? loop back? next agent? done?
      Repeat until all needed agents have completed (through TechPM)
  → BUILD PHASE:
      Read build-phase.md. Execute tickets wave by wave.
      At QA checkpoints → spawn QA in build mood
      At user-test checkpoints → pause for manual testing
      Route findings back through TechPM to owning agents
  → Product sync — update wikis from mission output
  → mission.json status → done
```

---

## Agent Sequencing

General pipeline: `Strategist → PM (drafts product-brief) → Designer (enriches brief + explores) → PM (detailed requirements) → Architect → TechPM → build (with QA checkpoints) → Complete Gate`

QA is not a single step at the end — TechPM designates QA checkpoints during wave planning. The orchestrator enforces them during build. QA may run multiple times across the build phase.

This is a default, not rigid. The orchestrator reasons:
- **Skip agents** when the mission doesn't need them
- **Reorder agents** when context demands it (integrate → Architect first)
- **Re-engage agents** when findings surface (QA finds spec gap → bring PM back)
- **Run agents in parallel** when work is independent (rare)

Principle: **when findings surface that affect upstream work, re-engage the relevant agent with the finding as context.**

---

## Mission Folder Creation

When a mission starts, create:

```
missions/{id}/
├── mission.json    ← initialized with type, status, first mood
└── _overview.md    ← initialized with problem statement from user
```

Additional folders (`diagrams/`, `specs/`, `prototype/`, etc.) are created on demand as agents produce artifacts. See `~/.claude/supabuilder/reference/state.md` for mission.json schema.

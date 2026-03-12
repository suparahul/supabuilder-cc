# Current System — Comprehensive Understanding

## 1. What Supabuilder Is

An AI product team orchestrator for Claude Code. 6 specialized agents (PM, Designer, Strategist, Architect, TechPM, QA) coordinated by an orchestrator that lives in `.claude/CLAUDE.md`. No Dev agent — Claude Code handles dev natively.

## 2. Installation & File Layout

### Install (`npx supabuilder-cc@latest`)

Copies files from the npm package to `~/.claude/`:

- `~/.claude/agents/` — 6 agent `.md` files (pm, designer, strategist, architect, techpm, qa)
- `~/.claude/skills/` — 4 skill folders (supabuilder:init, supabuilder:mission, supabuilder:status, supabuilder:settings, napkin, sketch)
- `~/.claude/supabuilder/reference/` — 11 reference docs (missions, moods, state, coordination, gates, build-phase, init-*, visual-protocol, branding, linear, user-interaction)
- `~/.claude/supabuilder/templates/` — claude-md-template.md (the orchestrator brain)

### Per-Project Workspace (`/supabuilder:init`)

Creates `{project}/supabuilder/` with:

```
supabuilder/
├── product-wiki/        # What the product does (user perspective)
│   ├── overview.md
│   ├── product-overview.excalidraw
│   └── modules/{name}/README.md
├── code-wiki/           # How it's built (technical perspective)
│   ├── README.md, architecture-map.md, patterns.md, data-models.md
│   ├── system-overview.excalidraw
│   └── modules/{name}/README.md
├── missions/            # Per-mission folders
├── rules/               # coding-conventions.md, tech-stack.md
├── state.json           # System-wide state
├── journal.md           # Narrative log
└── .archive/            # Old specs
```

Also writes orchestrator brain to `.claude/CLAUDE.md` (from template).

## 3. Init Flow (`/supabuilder:init`)

1. **Brand + Scaffold** — ASCII art, create folder tree, write CLAUDE.md, optional MCP setup (Linear, Reddit)
2. **Interview** — Ask user for product overview, detect modules from directory structure
3. **Wave Scan** — For each detected area, one at a time:
  - Scan area files (Glob/Grep/Read)
  - Process through dual lens (product + code)
  - Create/update diagrams (product-overview + system-overview Excalidraw)
  - Confirm with user (AskUserQuestion)
  - Write both wiki READMEs
4. **Cross-Cutting** — Synthesize overview files from per-area READMEs
5. **Spec Migration** — If old `product_specs/` exists, merge into wikis and archive

## 4. The Orchestrator (CLAUDE.md Template)

The orchestrator is the "brain" — instructions injected into Claude Code via CLAUDE.md. It:

- Reads state.json + journal.md on session start
- Detects/classifies user intent into mission types
- Manages mission lifecycle (spawn agents, manage moods, enforce gates)
- NEVER produces domain artifacts itself — only coordinates
- References 10 reference files for rules (must read before acting)

## 5. Mission Lifecycle

### 5a. Mission Types (10 types)


| Type        | First Agent | Lineup                              |
| ----------- | ----------- | ----------------------------------- |
| new-product | Strategist  | All 6                               |
| new-module  | Strategist  | All 6                               |
| new-feature | PM          | All 6 (Strategist optional)         |
| enhancement | PM          | PM, Designer, Architect, TechPM, QA |
| revamp      | PM          | All 6                               |
| quick-fix   | PM          | PM, Architect(?), TechPM, QA        |
| integrate   | Architect   | Architect, PM, TechPM, QA           |
| migrate     | Architect   | Architect, TechPM, QA               |
| scale       | Architect   | Architect, TechPM, QA               |
| pivot       | Strategist  | All 6                               |


### 5b. Mission Folder

```
missions/{YYYY-MM-DD}_{type}_{slug}/
├── mission.json    # Structured state
└── _overview.md    # Narrative discussion doc
```

### 5c. Mission Phases (mission-level state)

```
strategy → shaping → specifying → building → done
```

### 5d. Agent Moods (agent-level state)

```
discuss → research → explore → write → build
```

Moods describe what an AGENT is doing. Phases describe the MISSION state. They're separate concepts that loosely correlate.

**Mood depth** varies by mission type:

- Full (complete plan→execute cycle)
- Compressed (lighter version)
- Skipped (not needed)

### 5e. Default Agent Pipeline

```
Strategist → PM (product-brief) → Designer (enriches brief + explores) → PM (detailed requirements) → Architect → TechPM → build (with QA checkpoints) → Complete Gate
```

## 6. Agent Coordination

### Context Packets (8 components)

Agents start fresh — no inherited conversation. The spawn prompt IS the handoff:

1. Agent identity (automatic from .md file)
2. Mission context (type, phase, decisions)
3. Upstream summaries (markdown, not raw Excalidraw)
4. Wiki context (summarized or file paths)
5. Rules (coding conventions)
6. Visual protocol directive
7. Operating instruction (fixed: "start in discuss mood and plan mode")
8. Specific file paths

### Key Constraint: Orchestrator Does NOT

- Give task directives
- Set mood or depth
- Define exit conditions
- Use mood names in mission context

### Spawn Protocol

All agents spawn in `mode: "plan"`. Plan phase = discuss phase:

- Agent reads, interviews user (AskUserQuestion)
- Writes plan with [REVIEW] checkpoints
- User approves → agent exits plan mode → executes

## 7. Gates (Quality Enforcement)


| Gate                      | When                  | What                                               |
| ------------------------- | --------------------- | -------------------------------------------------- |
| Gate 0: Entry (Plan Mode) | Every agent spawn     | Structural — agent can't write until plan approved |
| Gate 1: Write Gate        | Before write mood     | User has seen visual, confirmed direction          |
| Gate 2: Agent Gate        | Before next agent     | Upstream output complete                           |
| Gate 3: Build Gate        | Before TechPM tickets | PM/Designer/Architect specs aligned                |
| Gate 4: Complete Gate     | Before mission done   | NON-NEGOTIABLE — wikis updated                     |
| Gate 5: Mood Gate         | Between moods         | Current mood exit conditions met                   |
| Gate 6: Wave Gate         | Between build waves   | Current wave done, QA passed                       |


## 8. Build Phase

After TechPM creates tickets:

- Orchestrator spawns `general-purpose` agents per ticket
- Executes waves in order from TechPM's wave plan
- At QA checkpoints: spawn QA agent
- At user-test checkpoints: pause for user
- Spec gaps routed back to owning agent (PM/Architect/Designer)
- Orchestrator stays lean (ticket summaries only, no raw code)

## 9. State Management

### state.json (system-wide)

```json
{
  "orchestrator_active": true,
  "supabuilder_version": "0.2.7",
  "active_missions": [...],
  "cost_mode": "smart",
  "user_control": "hands-on",
  "debate_visibility": "key_decisions",
  "last_module_touched": null
}
```

### mission.json (per-mission)

```json
{
  "id": "...", "type": "...", "name": "...",
  "status": "in_progress", "phase": "specifying",
  "decisions": {}, "modules": [], "progress": {},
  "tracker": null, "artifacts": {}
}
```

### journal.md — narrative log, newest first, updated at mission completion

## 10. User Control Levels


| Level      | Behavior                                                  |
| ---------- | --------------------------------------------------------- |
| hands-on   | Every mood transition, every diagram, every agent handoff |
| guided     | Major transitions and key decisions                       |
| autonomous | Pipeline runs, user approves final output                 |


## 11. Cost Mode


| Mode    | Agent Models                                                    |
| ------- | --------------------------------------------------------------- |
| quality | Opus for all                                                    |
| smart   | Opus for PM/Designer/Strategist/Architect, Sonnet for TechPM/QA |
| budget  | Sonnet for all except critical                                  |


## 12. Agent Domains


| Agent      | Owns                                                                                        | Does NOT Own                         |
| ---------- | ------------------------------------------------------------------------------------------- | ------------------------------------ |
| PM         | Requirements, scope, business rules, acceptance criteria, product-brief.md, requirements.md | Technical design, UX, strategy       |
| Designer   | UX journeys, prototypes (HTML), flow diagrams, visual language                              | Requirements, architecture, strategy |
| Strategist | Vision, market positioning, scope governance, timing                                        | Feature-level design, architecture   |
| Architect  | System design, data models, API contracts, feasibility, architecture.md                     | Product requirements, UX             |
| TechPM     | Tickets, wave organization, progress tracking, findings routing, spec consistency           | Architecture, requirements, design   |
| QA         | Testing, finding classification, root cause analysis, findings routing                      | Fixing specs/code/design             |


Cross-domain rule: "Flag, don't fix" — each agent flags concerns for the owning agent.

## 13. Visual-First Protocol

Diagrams are primary output. Every agent creates Excalidraw diagrams as primary thinking tool.
Spec Gate: diagram MUST exist before writing specs.
All diagrams use `/sketch` tool, saved to `missions/{id}/diagrams/`.

## 14. Key Design Principles

1. **Agents start fresh** — no inherited context, context packet is everything
2. **Orchestrator never produces domain artifacts** — only coordinates
3. **Visual-first** — diagrams before prose
4. **Dual wiki** — product-wiki (what) + code-wiki (how)
5. **Living documents** — specs, wikis, diagrams evolve
6. **Gates always run** regardless of user control level
7. **Mode: plan enforced** — all agents spawn in plan mode
8. **Reference files must be read** — orchestrator reads reference before acting


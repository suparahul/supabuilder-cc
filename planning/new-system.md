# New System (v0.3.0) — Comprehensive Understanding

## 1. What Supabuilder Is

An AI product team orchestrator for Claude Code. 6 specialized agents (PM, Designer, Architect, Strategist, TechPM, QA) coordinated by an orchestrator that lives in `.claude/CLAUDE.md`. No Dev agent — Claude Code handles dev natively. The orchestrator is the user's "CPTO partner" — it coordinates, synthesizes, and arbitrates, but never produces domain artifacts itself.

## 2. Installation & File Layout

### Install (`npx supabuilder-cc@latest`)

Copies files from the npm package to `~/.claude/`:

- `~/.claude/agents/` — 6 agent `.md` files (pm, designer, strategist, architect, techpm, qa)
- `~/.claude/skills/` — 6 skill folders (supabuilder:init, supabuilder:mission, supabuilder:status, supabuilder:settings, napkin, sketch)
- `~/.claude/supabuilder/reference/` — 12 reference docs (missions, state, coordination, gates, build-phase, init-scaffold, init-product-wiki, init-code-wiki, prototyping, branding, linear, user-interaction)
- `~/.claude/supabuilder/templates/` — claude-md-template.md (the orchestrator brain)

**Upgrade cleanup:** install.js automatically removes orphaned files from previous versions:
- Old skill dirs: `start`, `sprint`, `develop`, `review`, `mode`, `init`, `status`, `_shared`
- Old agent files: `supabuilder-shared-context.md`
- Old reference files: `moods.md`, `visual-protocol.md`

### Per-Project Workspace (`/supabuilder:init`)

Creates `{project}/supabuilder/` with:

```
supabuilder/
├── product-wiki/
│   ├── overview.md
│   ├── product-overview.excalidraw
│   ├── strategy/                    ← NEW in v3
│   ├── modules/{name}/README.md
│   └── ui-kit/                      ← NEW in v3
│       └── README.md
├── code-wiki/
│   ├── README.md
│   ├── architecture-map.md
│   ├── patterns.md
│   ├── data-models.md
│   ├── system-overview.excalidraw
│   └── modules/{name}/README.md
├── missions/
│   └── {YYYY-MM-DD}_{type}_{slug}/
│       ├── mission.json
│       ├── journal.md               ← NEW in v3 (per-mission, not root)
│       ├── _overview.md
│       ├── strategy/                ← NEW in v3
│       ├── specs/                   ← NEW in v3
│       ├── prototypes/              ← NEW in v3
│       └── diagrams/                ← NEW in v3
├── rules/
│   ├── coding-conventions.md
│   └── tech-stack.md
├── state.json
├── settings.json                    ← NEW in v3 (settings split from state.json)
├── memory.md                        ← NEW in v3 (replaces root journal.md)
└── .archive/
```

Also writes orchestrator brain to `.claude/CLAUDE.md` (from template).

### Key Structural Changes from v0.2.x

| v0.2.x | v0.3.0 | Notes |
|--------|--------|-------|
| `supabuilder/journal.md` (root) | `missions/{id}/journal.md` (per-mission) | Journal is now per-mission |
| *(none)* | `supabuilder/memory.md` | Product evolution tracker (demand-loaded) |
| Settings in `state.json` | `supabuilder/settings.json` (separate file) | Settings split from state |
| *(none)* | `product_name` + `product_description` in `state.json` | Product context in state |
| *(none)* | `product-wiki/strategy/` | Product-wide strategy docs |
| *(none)* | `product-wiki/ui-kit/` | Design language for HTML/CSS prototypes |
| Mission folder: `mission.json`, `_overview.md` only | Mission folder: `mission.json`, `journal.md`, `_overview.md`, `strategy/`, `specs/`, `prototypes/`, `diagrams/` | Full subfolder structure at creation |
| `reference/moods.md` | *(removed)* | Moods are agent-internal now |
| `reference/visual-protocol.md` | `reference/prototyping.md` | Prototyping reference replaces visual protocol |

---

## 3. Init Flow (`/supabuilder:init`)

Idempotent — re-run picks up where it left off based on existing state.

| Condition | Starts at |
|-----------|-----------|
| No `supabuilder/` folder | Step 1 |
| `supabuilder/` exists but wikis are stubs | Step 2 |
| Wikis populated but old `product_specs/` exists | Step 5 |
| Everything populated | "Already initialized" |

### Step 1: Brand + Scaffold
- Display ASCII branding + version + random tagline
- Create full `supabuilder/` folder tree with stub files (from `init-scaffold.md`)
- Write `state.json` with defaults (includes `product_name: null`, `product_description: null`)
- Write `settings.json` with defaults (includes `supabuilder_version` from branding.md)
- Write `memory.md` with template
- Write CLAUDE.md (append, replace, or skip — user choice)
- Optional MCP setup (Linear, Reddit — only for unconfigured servers)

### Step 2: Interview
- Ask user for product overview (free text, file pointer, or skip)
- Extract **product name** and **one-liner description** from user context → write to `state.json` as `product_name` and `product_description` (leave null if user skips)
- Ask about user types (single, multiple, not sure yet)
- Quick project detection: scan config files + directory structure to detect areas
- Present areas for user confirmation → produces the **wave plan**
- Area names use user-facing language, not directory names

### Step 3: Wave Scan (unified scan, dual lens)
**CRITICAL: One area at a time.** Complete full cycle per area before moving on.

For each area in the wave plan:
1. **Progress bar** (for 4+ areas)
2. **Scan** — single exploration pass of the area's files
3. **Dual-lens extract** — same scan findings processed through:
   - Product lens: user-facing purpose, flows, business rules, constraints
   - Code lens: architecture, patterns, data models, dependencies
   - Design tokens: note token source paths if found
4. **Diagrams** — update both evolving diagrams via `/sketch`:
   - `product-wiki/product-overview.excalidraw` (growing incrementally)
   - `code-wiki/system-overview.excalidraw` (growing incrementally)
   - **HARD GATE**: diagrams must be created/updated before proceeding
5. **Confirm** — present findings (product lens leads, code follows), AskUserQuestion only if genuinely ambiguous
6. **Write** — populate both wiki module READMEs, update running overviews
7. **Progress update**

### Step 4: Cross-Cutting Pass
After all waves, synthesize from already-written wiki files (not re-scanning code):
- `product-wiki/overview.md` — full product story + user types
- `code-wiki/architecture-map.md` — cross-area connections
- `code-wiki/patterns.md` — cross-area patterns
- `code-wiki/data-models.md` — cross-area entities
- `product-wiki/ui-kit/README.md` — consolidated token sources
- Final versions of both overview diagrams

### Step 5: Spec Migration (conditional)
Only if old `product_specs/` detected. Enriches already-populated wikis:
1. Analyze old spec structure
2. Enrich product-wiki with additional context (merge, don't overwrite)
3. Handle non-standard files (copy as-is to appropriate wiki)
4. Extract technical content to code-wiki
5. Cross-reference for spec drift (wiki reflects code, not specs)
6. Archive to `supabuilder/.archive/product_specs_v1/`
7. Write migration log

### Step 6: Completion
Summary of what was created, commands available.

---

## 4. The Orchestrator (CLAUDE.md Template)

The orchestrator is the "brain" — instructions injected into Claude Code via CLAUDE.md.

### Session Startup

1. **Read settings** — `settings.json`. If `orchestrator_active` is false, STOP.
2. **Version check** — compare `settings.json` `supabuilder_version` to `branding.md` version. If different: silently re-read template, replace Supabuilder section in CLAUDE.md, update version in `settings.json`, inform user.
3. **Read state** — `state.json`. The `latest` field gives immediate orientation.
4. **Check active missions** — note them, but do NOT read mission.json files yet. Wait for conversation routing.
5. **Greet with context** — use `latest` field. Mention active missions by name.
6. Do NOT read `memory.md` on startup — demand-loaded only.

### Conversation Routing

| User intent | Orchestrator action |
|-------------|-------------------|
| **A) Continuing active mission** | Read that mission's `mission.json`, resume pipeline where it left off. If ambiguous which mission, ask. One mission at a time. |
| **B) Starting new work** | Read `missions.md`, classify type, confirm in one line, check for conflicts with active missions, create folder, follow pipeline. |
| **C) Just talking** | Talk. Offer mission if conversation evolves into something buildable. |
| **D) Explicit command** | Follow the skill (`/supabuilder:mission`, `/supabuilder:status`, `/supabuilder:settings`). |

### What the Orchestrator Does

- Reads state + active mission context
- Classifies user intent into mission types
- Manages mission lifecycle (spawn agents, enforce gates, manage phases)
- Prepares context packets for agent spawns
- Collects agent output, curates handoff notes
- Updates state via background clerk or inline writes
- Manages build loop (sequential ticket execution, checkpoints, spec gap routing)
- Watches for scope deviation in finishing phase
- References reference files before acting (must read, not guess)

### What the Orchestrator NEVER Does

- Produce domain artifacts (specs, prototypes, architecture, tickets, test plans)
- Give task directives to agents
- Set agent mood or depth
- Define exit conditions for agents
- Use mood names in mission context
- Rush or compress agent processes
- Resolve spec gaps (routes to owning agent instead)

---

## 5. Mission Lifecycle

### 5a. Mission Types (10 types, 5 groups)

| Group | Types | First Agent | Pipeline |
|-------|-------|-------------|----------|
| **1: New Product** | `new-product` | Strategist | Strategist → PM → Designer → PM (2nd) → Architect → TechPM → Build → QA → Refinement |
| **2: Module/Feature/Revamp/Pivot** | `new-module`, `new-feature`, `revamp`, `pivot` | Strategist | Strategist → PM → Designer → PM (2nd) → Architect → TechPM → Build → QA → Refinement |
| **3: Integrate/Migrate/Scale** | `integrate`, `migrate`, `scale` | PM | PM → *Decision: pull in Designer/Strategist?* → Architect → TechPM → Build → QA → Refinement |
| **4: Enhancement** | `enhancement` | PM | PM → Designer → PM (2nd) → Architect → TechPM → Build → QA → Refinement |
| **5: Quick Fix** | `quick-fix` | PM | PM → *Decision: needs full mission?* → If yes: full pipeline reduced. If no: direct change. |

**Group 2 pre-condition**: If no `product-wiki/strategy/` content exists, Strategist does a strategy research run first.

**Group 3 decision point**: PM recommends whether Designer/Strategist needed; user decides.

### 5b. Mission Folder Structure

```
missions/{YYYY-MM-DD}_{type}_{slug}/
├── mission.json        ← structured state (v3 schema)
├── journal.md          ← per-mission detailed log
├── _overview.md        ← problem statement / discussion doc
├── strategy/           ← Strategist output for THIS mission
├── specs/              ← agent spec outputs (requirements.md, architecture.md, etc.)
├── prototypes/         ← Designer prototypes (HTML/CSS)
└── diagrams/           ← All Excalidraw diagrams
```

All subfolders created at mission initiation — not on demand.

### 5c. Mission Phases

```
strategy → shaping → specifying → building → finishing → done

strategy:    Big picture — vision, direction, scope
shaping:     Exploration — options, tradeoffs, approaches
specifying:  Formal specs — requirements, architecture, design
building:    Implementation — code, test, ship
finishing:   User-driven refinement — polish, adjust, verify
```

Phase advances when the orchestrator judges the mission has moved past that kind of thinking. Phases describe MISSION state.

### 5d. Agent Moods (agent-level state)

```
discuss → research → explore → write
```

Moods describe what an AGENT is doing. 4 moods (v2 had 5 — `build` mood removed). Agents self-manage mood depth — the orchestrator does not set mood depth.

- Quick Fix / Enhancement: research and explore may be skipped (agent decides)
- All other missions: agents follow full cycle, adjusting depth based on scope
- Every mood transition: agent pauses, presents work, discusses with user, proposes next mood plan

### 5e. Mission Completion

When finishing is settled:
1. **G3 Complete Gate** — NON-NEGOTIABLE: update product-wiki/ and code-wiki/
2. **Update state** — move from `active_missions` to `past_missions`, set `status: "done"`
3. **Update memory.md** — add concise mission summary
4. **Suggest what's next** — follow-up mission if natural continuation exists

### 5f. Finishing Phase & Scope Deviation

During finishing, user refines what was built. Orchestrator can re-engage any agent or make direct small fixes.

**Scope deviation watch**: If refinement drifts beyond original scope, flag it: "This is moving beyond the original {mission_name} scope. Want to wrap this mission and start a new one for {new_scope}?" User decides.

---

## 6. Agent Coordination

### Context Packets (8 components)

Agents start fresh — no inherited conversation. The spawn prompt IS the handoff:

| Component | What it contains | Always? |
|-----------|-----------------|---------|
| **Agent identity** | Agent's `.md` file (automatic via Claude Code) | Yes |
| **Mission context** | Type, phase, decisions, which agents have run | Yes |
| **Upstream output** | Structured summaries from prior agents (markdown, not raw Excalidraw) | When upstream exists |
| **Wiki context** | File paths to relevant wiki modules (agent reads on demand) | Yes |
| **User types** | Summary of defined user types from product-wiki/overview.md | When defined |
| **Rules** | Coding conventions from `rules/` | For technical agents |
| **Tool connectors** | Which MCP tools are available (Linear, etc.) | When applicable |
| **File paths** | Explicit paths to specs, prototypes, code files | When applicable |

**Excluded:** full mission history (too many tokens), raw Excalidraw JSON, entire wiki, previous user conversation.

**Designer-specific:** Include path to `product-wiki/ui-kit/`. Summarize contents if populated; note if empty.

### What the Orchestrator Must NOT Do in Context Packets

- Give task directives (no "Your Task" heading, no "Produce X")
- Set mood or depth
- Define exit conditions
- Use mood names in mission context
- Rush agents

### Context Assembly

Orchestrator summarizes upstream output for downstream packets. Two modes for wiki context:
- **Mode A**: Orchestrator has wiki loaded → summarize inline with links
- **Mode B**: Orchestrator doesn't → point agent to module folders

### Spawn Protocol

1. Prepare context packet
2. Set max turns (safety net)
3. Spawn via Agent tool with `mode: "plan"` — **always**
4. Plan phase covers discuss — agent reads, interviews user, writes plan with `[REVIEW]` checkpoints
5. User approves → agent exits plan mode → executes
6. Agents iterate freely in plan mode (discussion depth is agent-driven)

### Architect Pull-In

Any agent at any phase can request an Architect pull-in when a decision depends on technical feasibility.

1. Requesting agent includes feasibility question in handoff flags
2. Orchestrator spawns Architect with the specific question
3. Architect answers concisely: feasible / feasible-with-tradeoffs / not-feasible
4. Orchestrator routes answer to requesting or next agent

### Collecting Agent Output

After agent completes:
1. Read handoff (decisions, deliverables, flags, downstream context)
2. Curate `agent_handoff_notes` in mission.json (add from flags, remove when resolved)
3. Summarize for downstream context packet

### State Clerk (Background)

Routine state updates offloaded to a background Haiku agent:
```
Agent tool: subagent_type: "general-purpose", model: "haiku", run_in_background: true
```
No `mode: "plan"`. Clerk writes exactly as instructed — no thinking.

| Situation | Method |
|-----------|--------|
| After agent completes | Background clerk |
| After user decision | Background clerk |
| Mission start/complete | **Inline** |
| Wiki sync (G3) | **Inline** |
| Settings change (settings.json) | **Inline** |

---

## 7. Gates (Quality Enforcement)

4 gates (reduced from v2's 7):

| Gate | When | What |
|------|------|------|
| **G0: Plan Gate** | Every agent spawn | Structural — enforced by Claude Code `mode: "plan"`. Agent cannot write until plan approved. Plan includes `[REVIEW]` checkpoints. |
| **G1: Pipeline Gate** | Before spawning next agent | Upstream output produced, deliverables from plan exist, no unresolved blocking flags, Architect pull-in resolved if flagged. Lightweight — not a deep content audit. |
| **G2: Wave Gate** | Between build checkpoint batches | Current batch tickets implemented and passing. QA run if checkpoint type requires. User tested if checkpoint type requires. mission.json progress updated. |
| **G3: Complete Gate** | Before marking mission done | **NON-NEGOTIABLE.** product-wiki/ updated. code-wiki/ updated. Both include History section entries. All deliverables done or explicitly skipped with reason. |

### Cross-Domain Boundary Enforcement

- Architect overriding Designer's layout → reject
- PM making technical decisions → flag to Architect
- Designer specifying implementation → flag to Architect
- Any agent resolving cross-domain concern → reject, enforce "flag, don't fix"

---

## 8. Build Phase

### Core Principle

Orchestrator does NOT write code. Spawns `general-purpose` agents per ticket. Manages sequential execution, enforces checkpoints, routes findings. Context stays lean.

### Vertical Slice Principle

Tickets structured around **functional requirements**, not technical layers.

**Wrong (horizontal):** schema → API → frontend → wiring
**Right (vertical):** Foundation → FR-1 (full stack) → FR-2 (full stack) → ...

- **Architect**: structures development plan as vertical slices, identifies foundation work, orders by dependency
- **TechPM**: creates tickets from plan, groups 1-3 FRs into checkpoint batches, annotates checkpoints

### Build Execution — Sequential Default

```
For each task in TechPM's ticket sequence:
  1. Prepare dev context packet
  2. Spawn general-purpose agent
  3. Agent reads specs, writes code, runs tests, returns results
  4. Read result summary
  5. If spec gap → route to owning agent (PM/Architect/Designer)
  6. Mark ticket done
  7. If checkpoint → run checkpoint protocol
  8. Next task
```

One task at a time unless user explicitly requests parallel.

### Dev Context Packet

| Component | Content |
|-----------|---------|
| **Ticket** | Description, functional requirement, definition of done |
| **Spec paths** | architecture.md §section, requirements.md §FR, prototype paths |
| **Code patterns** | code-wiki/patterns.md, rules/coding-conventions.md, rules/tech-stack.md |
| **Module paths** | Relevant codebase directories |
| **Instruction** | "Implement this ticket. Follow existing patterns. Run tests. Report spec ambiguity — don't guess." |

### Checkpoint Protocol

After every 1-3 related functional requirements (TechPM decides grouping):

1. QA agent spawned (if checkpoint type requires)
2. User review (if checkpoint type requires)
3. If findings → route to owning agent or fix directly
4. Continue

| Checkpoint type | What happens |
|----------------|-------------|
| `qa+user` | QA agent + user review (default) |
| `qa` | QA agent only (lower-risk) |
| `user` | User review only (UX-heavy) |

### Spec Gap Protocol

1. Orchestrator does NOT resolve
2. Route to owning agent: PM (requirements), Architect (technical), Designer (UX)
3. Block affected tasks until resolved

---

## 9. State Management

### State Files

| File | Scope | What it tracks |
|------|-------|---------------|
| `supabuilder/state.json` | System-wide | Product context, active/past missions, `latest` snapshot |
| `supabuilder/settings.json` | System-wide | User preferences: orchestrator toggle, version, cost mode, user control |
| `supabuilder/memory.md` | System-wide | Curated product history (demand-loaded, NOT read on session start) |
| `missions/{id}/mission.json` | Per-mission | Phase, decisions, progress, handoff notes |
| `missions/{id}/journal.md` | Per-mission | Detailed action/decision log |

### state.json Schema

```json
{
  "product_name": "My App",
  "product_description": "Short one-liner about what this product does",
  "latest": "Working on auth module. Architect designing system.",
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
| `product_name` | string/null | Short product name — set during init interview or first mission |
| `product_description` | string/null | One-liner describing what the product does |
| `latest` | string/null | Project-level orientation snapshot — replaced on every write |
| `active_missions` | array | Currently active: `{id, type, phase}` |
| `past_missions` | array | Completed: `{id, type, status, completed}` |

**Removed from v0.2.x:** `debate_visibility`, `last_module_touched`

**Removed from state.json (moved to settings.json):** `orchestrator_active`, `supabuilder_version`, `cost_mode`, `user_control`

**Added in v0.3.0:** `product_name`, `product_description`, `latest`, `past_missions`

**Changed:** `active_missions` entries: removed `status`, added `type`

### settings.json Schema

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
| `orchestrator_active` | true/false | Master on/off toggle |
| `supabuilder_version` | string | Version that last wrote CLAUDE.md. Compared to branding.md on startup. |
| `cost_mode` | `quality`/`smart`/`budget` | Model selection for agents |
| `user_control` | `hands-on`/`guided`/`autonomous` | How much user sees and approves |

### mission.json Schema

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
  "last_update": "Architect designing auth system. Flagged session management.",
  "decisions": {
    "1": "Using Supabase Auth as the auth provider",
    "2": "Supporting Google and GitHub as OAuth providers for v1",
    "3": "JWT-based sessions over server-side"
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
    { "from": "designer", "type": "concern", "item": "Settings screen has 12+ toggles" }
  ],
  "modules": ["auth"],
  "ticket_tracker": null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Matches folder name: `YYYY-MM-DD_type_name` |
| `type` | string | `new-product`/`new-module`/`new-feature`/`enhancement`/`revamp`/`quick-fix`/`integrate`/`migrate`/`scale`/`pivot` |
| `status` | string | `planned`/`in_progress`/`paused`/`done`/`abandoned` |
| `phase` | string | `strategy`/`shaping`/`specifying`/`building`/`finishing` |
| `last_update` | string | Mission-level snapshot — replaced on every write |
| `decisions` | object | Numeric string keys, fully descriptive values |
| `progress` | object | 8-step pipeline. All keys always present. Values: `pending`/`in_progress`/`done`/`not_needed` |
| `agent_handoff_notes` | array | Curated notes from agent handoffs — orchestrator adds/removes |
| `modules` | array | Which product modules this mission touches |
| `ticket_tracker` | string/null | `"linear"`, `"jira"`, `"tickets.md"`, etc. |

**Removed from v0.2.x:** `paused_reason`, `artifacts`, `tracker` (object)

**Added in v0.3.0:** `last_update`, `agent_handoff_notes`, `ticket_tracker` (flat string)

**Changed:** `progress` keys from agent names to 8-step pipeline, `decisions` keys from descriptive to numeric strings

#### Progress — per-group `not_needed` defaults:

| Group | `not_needed` defaults |
|-------|-----------------------|
| 1 (New Product) | All pending |
| 2 (Module/Feature/Revamp/Pivot) | All pending |
| 3 (Integrate/Migrate/Scale) | `strategist`, `designer`, `pm_requirements` |
| 4 (Enhancement) | `strategist` |
| 5 (Quick Fix) | `strategist`, `designer`, `pm_requirements` |

### memory.md

Two sections — demand-loaded only when past context is needed. NOT a log. NOT for patterns (use napkin for those).

```markdown
# Project Memory

## Product Decisions
<!-- Cross-cutting decisions that affect the whole product. Added as they happen. -->

### 2026-03-10 — Chose JWT sessions over server-side
For Supabase compatibility. All future auth work builds on this.

## Completed Missions
<!-- Brief summary at mission completion. Date, type, what was built, key outcomes. -->

### 2026-02-28 — Cat App MVP (new-product)
Built initial MVP with profile, health tracking, feeding modules.
Tech stack: Next.js, Supabase, Tailwind.
```

### journal.md (Per-Mission)

Detailed log at `missions/{id}/journal.md`. Timestamped entries, newest at bottom.

**When to update:** After every agent completes, after user decisions, after build checkpoints, after orchestrator actions, when routing findings.

```markdown
### {date} — {event}
{What happened. Decisions made. Files produced. Flags raised or resolved.}
```

### Update Rules

Update **after every meaningful state change** — every agent completion, every user decision, every orchestrator action. Don't batch.

| File | Key field | Rule |
|------|-----------|------|
| `state.json` | `latest` | Replaced on every write. Complete sentence. |
| `mission.json` | `last_update` | Replaced on every write. Mission-level orientation. |
| `journal.md` | entries | Append after every agent, decision, checkpoint. |
| `memory.md` | decisions + missions | Add decisions as they happen; add mission summaries at completion. |

---

## 10. User Control Levels

| Level | What the user sees | Best for |
|-------|-------------------|----------|
| **hands-on** (default) | Every sub-step, every diagram, every mood transition, every agent handoff. Maximum checkpoints. | New product, unfamiliar domain |
| **guided** | Major transitions and key decisions. Agent handoffs visible, not every intermediate artifact. | Standard feature work |
| **autonomous** | Pipeline runs, user sees final output. Minimal checkpoints — only when genuinely needed. | Quick-fix, well-understood domain |

Changeable mid-mission. Gates always run regardless of control level.

### Transparency Protocol

**hands-on:** Announce every mood transition, every agent handoff, every gate evaluation, show agent lineup at mission start.

**guided:** Announce agent handoffs, present key decisions, announce loop-backs, summarize mood transitions.

**autonomous:** Announce mission start + expected pipeline, surface only when genuine input needed, present final output for approval.

### AskUserQuestion Protocol

**Structured options** for: mission type classification, direction choices, gate confirmations, scope decisions — any bounded decision.

**Free text** for: brainstorming, follow-up clarification, complex tradeoffs, subjective feedback.

---

## 11. Cost Mode

| Mode | Agent models | Best for |
|------|-------------|----------|
| **quality** | Opus for all agents | Complex products, critical missions |
| **smart** (default) | Opus for PM, Designer, Strategist, Architect. Sonnet for TechPM, QA. | Standard work |
| **budget** | Sonnet for all except critical | Quick fixes, well-understood domains |

---

## 12. Agent Domains

### PM (model: opus)

**Owns:** Solution design (WHAT + WHY), success vision, user problems/personas/use cases, feature scope (in/out/deferred), acceptance criteria, business rules.

**Two-pass role:** First pass → `product-brief.md` (shaping). Second pass → `requirements.md` (specifying, after brief + Designer done).

**Deliverables:** `product-brief.md`, `requirements.md`, solution maps, scope trees, journey diagrams.

**Research tools:** WebSearch, Reddit MCP tools for competitive analysis and user pain points.

### Designer (model: opus)

**Owns:** Visual language & identity, user journeys, screen design, interaction patterns, visual states, design exploration, HTML/CSS prototypes, UI Kit.

**Primary deliverable:** HTML/CSS prototypes — self-contained (opens in browser), navigable (clickable flows), state-controlled (floating panel for toggling states).

**Prototyping structure:**
```
prototypes/
├── index.html              ← navigation hub
├── _styles.css             ← shared (imports UI Kit)
├── _controls.js            ← state toggle logic
├── login.html
├── dashboard.html
└── _explorations/          ← variations during explore mood
    ├── variation-a/
    ├── variation-b/
    └── comparison.html
```

**Hard limit:** 400-500 lines per HTML file. Split at UX boundaries.

**State controls (required):** default (realistic data), empty (zero items), loading, error. User-type toggle when multiple types exist.

**UI Kit** at `product-wiki/ui-kit/`:
```
product-wiki/ui-kit/
├── README.md
├── tokens.css              ← CSS custom properties
├── components.css          ← reusable classes
└── preview.html            ← live preview
```

**Design language extraction:** For existing codebases, extract visual language from code (Tailwind config, ThemeData, CSS custom properties, etc.) into CSS tokens. Goal is visual kinship, not pixel match.

### Architect (model: opus)

**Owns:** System architecture, data models/schema, technical feasibility, implementation sequence, technical tradeoffs, development plan (vertical slices).

**Deliverables:** `architecture.md`, `data_models.md`, `schema.sql`, `manifest.md`, `development-plan.md`, system/data-flow/ER/sequence diagrams.

**Early pull-in:** Can be spawned mid-pipeline to answer specific feasibility questions. Short, focused, no full mood cycle.

### Strategist (model: opus)

**Owns:** Big picture, product vision & direction, foundational product questions, market positioning, scope governance, timing decisions, user segment strategy.

**Strategy docs — two locations:**
- Per-mission: `missions/{id}/strategy/`
- Product-wide: `product-wiki/strategy/`

Write mission-scoped to mission folder. Promote to `product-wiki/strategy/` when product-wide relevant.

**Research tools:** WebSearch, Reddit MCP tools for community sentiment and competitive intel.

### TechPM (model: sonnet)

**Owns:** Spec consistency check (first task), ticket creation, checkpoint organization, progress tracking, findings routing, pattern detection.

**Ticket body format:**
```
Mission: [mission ID]
What: [1-2 sentence description]
Specs: [paths with section references]
Done when: [definition of done]
Depends on: [ticket IDs]
Unblocks: [ticket IDs]
```

**Checkpoint batching:** 1-3 related FRs per batch. Types: `qa+user` (default), `qa`, `user`.

**Tracker:** Linear by default (via MCP). Falls back to `tickets.md` if no tracker configured.

### QA (model: sonnet)

**Owns:** Testing (spec compliance, architecture compliance, user-perspective), finding classification, root cause analysis, findings routing.

**Runs at:** Checkpoints during build phase. May run multiple times per mission.

**Finding classification:** severity (critical/major/minor/improvement) AND type (spec-gap vs implementation-bug vs architecture-drift).

**Principle:** Spec as baseline, not ceiling. Test against AC first, then go beyond.

### Cross-Domain Rule

"Flag, don't fix." Every agent flags concerns outside their domain for the owning agent. No agent resolves cross-domain issues.

All agents can **request Architect pull-in** when their decisions depend on technical feasibility.

---

## 13. Diagrams

All agents use `/sketch` (Excalidraw) for diagrams. Diagrams are **primary output** — the default mode of communication for every agent.

Rules:
- Single diagram file per agent — do not create separate files
- Diagrams are discussion artifacts — present and discuss via AskUserQuestion BEFORE writing specs
- Every key idea gets a diagram

Agent-specific diagram types:
| Agent | Diagram types |
|-------|---------------|
| PM | Solution maps, scope trees, user journey maps |
| Designer | User flow diagrams, screen relationship maps, wireframes |
| Architect | System architecture, data flow, ER, sequence diagrams |
| Strategist | Positioning maps, priority quadrants, user segment diagrams, roadmaps |
| TechPM | Ticket dependency graphs, checkpoint visualizations, progress dashboards |
| QA | Bug flow diagrams (expected vs actual), test coverage maps, findings heatmaps |

---

## 14. Reference Files

All at `~/.claude/supabuilder/reference/`. 12 files total.

| Before you... | Read |
|---------------|------|
| Classify a mission or check pipelines | `missions.md` |
| Spawn an agent or prepare context packet | `coordination.md` |
| Evaluate any quality gate | `gates.md` |
| Update state.json, settings.json, or mission.json schemas | `state.md` |
| Calibrate interaction with user | `user-interaction.md` |
| Enter the build phase | `build-phase.md` |
| Have TechPM create/update tickets | `linear.md` |
| Run init scaffold | `init-scaffold.md` |
| Scan codebase for product wiki | `init-product-wiki.md` |
| Scan codebase for code wiki | `init-code-wiki.md` |
| Designer entering explore/write mood | `prototyping.md` |
| Display branded header | `branding.md` |

---

## 15. Skills (User-Invocable Commands)

| Skill | What it does |
|-------|-------------|
| `/supabuilder:init` | Initialize workspace, scan codebase, populate wikis |
| `/supabuilder:mission [description]` | Explicitly start a new mission |
| `/supabuilder:status` | Read-only status check — active missions, pipeline progress, settings |
| `/supabuilder:settings [value]` | Configure cost mode, user control, orchestrator on/off |
| `/sketch` | Create/manage Excalidraw diagrams |
| `/napkin` | Per-repo mistake tracking |

---

## 16. Tool Connectors

### Linear (MCP)

When configured in `.mcp.json`:
- `mcp__linear__create_issue` — create tickets
- `mcp__linear__update_issue` — update status/assignee/priority
- `mcp__linear__search_issues` — find existing
- `mcp__linear__list_projects` / `list_teams` — discover context

When NOT configured: tickets written to `tickets.md` in mission folder.

### Reddit (MCP)

Available for PM, Designer, Strategist research moods:
- `browse_subreddit` — browse specific subreddits
- `search_reddit` — search across Reddit
- `get_post_details` — deep dive into threads

---

## 17. Key Design Principles

1. **Agents start fresh** — no inherited context; context packet is everything
2. **Orchestrator never produces domain artifacts** — only coordinates
3. **Visual-first** — diagrams before prose, for every agent
4. **Dual wiki** — product-wiki (what) + code-wiki (how)
5. **Living documents** — specs, wikis, diagrams evolve
6. **Gates always run** regardless of user control level
7. **Mode: plan enforced** — all agents spawn in plan mode with `[REVIEW]` checkpoints
8. **Reference files must be read** — orchestrator reads before acting, never guesses
9. **Flag, don't fix** — agents stay in their domain, flag cross-domain concerns
10. **State survives sessions** — `latest` and `last_update` orient the next session
11. **Background state clerk** — routine updates via cheap background Haiku agent
12. **One mission at a time** — multiple can exist, only one actively worked per conversation
13. **Vertical slices** — build phase tickets follow functional requirements, not layers
14. **Demand-loaded memory** — memory.md not read on startup, only when needed

---

## 18. Nomenclature

- **"user"** = person using Supabuilder (the developer/PM operating Claude Code)
- **"customer"** = the product's end user/customer
- Keep these distinct throughout all agent prompts, specs, and documentation.

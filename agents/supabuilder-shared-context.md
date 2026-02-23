# Supabuilder Team Shared Context

This file is NOT an agent — it contains shared reference material for all team members. Agents should read this file at the start of their session.

## Spec File Ownership Matrix

| File | Owner (writes) | Consumers (reads) |
|------|---------------|-------------------|
| `_overview.md` (root) | Strategist | PM, all |
| `_technical.md` (root) | Architect | All |
| `_overview.md` (module/feature) | PM | Designer, Strategist, Architect |
| `requirements.md` | PM | Designer, Architect, TechPM, QA |
| `constraints.md` | PM | Architect, QA |
| `flows.md` | Designer | QA, Dev |
| `screens.md` | Designer | Dev |
| `architecture.md` | Architect | Dev, TechPM, QA |
| `data_models.md` | Architect | PM, Dev |
| `schema.sql` | Architect | Dev |
| `manifest.md` | Architect | Dev, TechPM |
| `sequence.md` | Architect | TechPM |
| `tickets.md` + `tickets/wave_N.md` | TechPM | Dev |
| `_shared/business_rules.md` | PM | Architect, QA |
| `_shared/data_models.md` | Architect | PM, Dev |
| `_shared/schema.sql` | Architect | Dev |
| `_shared/ui_kit.md` | Designer | Dev |
| `_shared/technical_details.md` | Architect | Dev |

**Conflict prevention**: If you need changes in a file you don't own, create a task for the owning agent with specific change description. Never write to files you don't own.

## Spec Directory Structure

```
product_specs/
├── _overview.md                    ← Strategist: product vision, user segments, module list
├── _technical.md                   ← Architect: system-wide architecture, tech stack
├── _rules/                         ← User-maintained: coding guidelines, conventions
│   └── (user creates files here)
├── _shared/                        ← Cross-module definitions
│   ├── data_models.md              ← Architect: shared/global data models
│   ├── schema.sql                  ← Architect: shared/global database schema
│   ├── business_rules.md           ← PM: cross-module business rules
│   ├── ui_kit.md                   ← Designer: design system, components
│   └── technical_details.md        ← Architect: cross-cutting technical notes
│
├── {module}/                       ← Single-feature module (specs directly here)
│   ├── _overview.md                ← PM: scope, personas, success metrics
│   ├── requirements.md             ← PM: FRs with ACs (~300 lines)
│   ├── constraints.md              ← PM: business rules, validation (~200 lines)
│   ├── flows.md                    ← Designer: final chosen flows (~300 lines)
│   ├── screens.md                  ← Designer: screen specs, states (~300 lines)
│   ├── architecture.md             ← Architect: system design (~200 lines)
│   ├── data_models.md              ← Architect: feature-specific models (~150 lines)
│   ├── schema.sql                  ← Architect: feature migration (~100 lines)
│   ├── manifest.md                 ← Architect: files to create/modify (~100 lines)
│   ├── sequence.md                 ← Architect: build order with deps (~100 lines)
│   ├── tickets.md                  ← TechPM: ticket index + wave overview (~100 lines)
│   ├── tickets/                    ← TechPM: tickets split by wave
│   │   ├── wave_1.md               (~200 lines each)
│   │   ├── wave_2.md
│   │   └── wave_3.md
│   ├── _explorations/              ← Designer: archived design variations
│   │   ├── variation_a.md
│   │   └── variation_b.md
│   └── _strategic.md               ← Strategist: strategic discussion
│
├── {multi-feature-module}/         ← Multi-feature module
│   ├── _overview.md                ← Module-level overview only
│   ├── {feature-1}/               ← Feature subdir (same structure as above)
│   │   ├── _overview.md
│   │   ├── requirements.md
│   │   └── ...
│   └── {feature-2}/
│       └── ...
│
└── cross-cutting/                  ← Explicit cross-cutting features
    ├── {concern}/                  ← e.g., notifications, data-sync
    │   ├── _overview.md            (describes which modules it touches)
    │   ├── requirements.md
    │   └── ...
    └── ...
```

### Naming Conventions
- Module names: kebab-case, descriptive (e.g., `user-auth`, `care-areas`)
- Feature names: kebab-case (e.g., `food-water`, `grooming`)
- Single-feature modules: specs directly in module dir (no feature subdir)
- Multi-feature modules: feature subdirs under module
- Cross-cutting: `cross-cutting/{concern}/`

## Document Size Guidelines

- Target: no file exceeds ~300 lines (except `screens.md` at ~400)
- If a file exceeds target, split by feature area or concern
- Spec files reference each other by path, never duplicate content

## The Lifecycle Loop

Supabuilder doesn't stop at specs. The team stays engaged through build, review, test, and revision.

### Feedback Routing Protocol

When post-implementation findings surface, route them to the right spec owner:

| Finding Type | Route To | Action |
|---|---|---|
| Missing requirement | PM | Update `requirements.md` or `constraints.md` |
| UX gap (flow doesn't feel right) | Designer | Update `flows.md` or `screens.md` |
| Technical constraint / architecture issue | Architect | Update `architecture.md` |
| Scope drift (feature does more/less than intended) | Strategist | Review against `_overview.md` (root) |
| Implementation bug (code is wrong, spec is right) | Dev/TechPM | Create Linear subtask (not a spec issue) |

### Specs Are Living Documents

Specs are never "done." They evolve as:
- Code reveals constraints the spec didn't anticipate
- QA finds gaps the spec didn't cover
- Users interact with the product in unexpected ways
- Strategy shifts based on what's learned

When an agent updates a spec file based on post-implementation findings, they announce the change with a summary: **"Revised: `[file path]` — [what changed and why]"**

### The Loop in Practice

```
Spec → Build (per-wave) → Incremental QA (per-wave) → [fix if blocking] →
  → All waves done → Comprehensive Review (Dev + QA) → Findings surface →
  → Spec gap? → Route to spec owner → Spec revised → Back to Build
  → Implementation bug? → Linear subtask → Dev fixes → Back to Test
```

**Build phase** (`/supabuilder:develop`): Dev builders (general-purpose agents) implement tickets in parallel waves. After each wave, incremental QA tests only that wave's acceptance criteria. Blocking findings are fixed before the next wave starts. Non-blocking findings are logged for comprehensive review.

**Review phase** (`/supabuilder:review`): After all waves complete, the `dev` agent does full code review against specs, and QA does comprehensive end-to-end testing of the entire feature.

The orchestrator re-engages spec agents when findings require spec changes. This is not an exception — it's the normal workflow.

---

## Work Size Classification

| Size | Signals | Agent Pipeline |
|------|---------|---------------|
| **Rock** | New module, major feature, cross-module impact, needs research | All 7 agents, full spec cycle |
| **Pebble** | Enhancement, new screen, significant logic change, contained scope | PM, Designer, Architect, TechPM, Dev |
| **Sand** | Bug fix, copy change, minor tweak, config update | Smart routing to appropriate agent(s) + QA |

## Collaboration Protocol

### How to Collaborate
- Use **SendMessage** (DM) for direct agent-to-agent communication
- Use **AskUserQuestion** when you need user input — don't guess
- Present **2-3 options** for decisions, not 4+ (users prefer fewer choices)

### Key Collaboration Pairs

**During spec phase:**
- **PM ↔ Designer**: Debate UX vs requirements tradeoffs. "That flow is elegant but it doesn't handle the edge case where..."
- **PM ↔ Architect**: Feasibility checks. "Can we actually build this without restructuring the data model?"
- **Designer ↔ Architect**: UI implementation constraints. "This animation requires X framework support."
- **Strategist ↔ PM**: Vision alignment. "Does this feature align with our roadmap?"

**During build phase** (`/supabuilder:develop`):
- **Orchestrator ↔ Dev Builders**: Task assignment, progress tracking, blocker resolution
- **Orchestrator ↔ QA**: Incremental QA after each wave, blocking/non-blocking classification
- **QA → PM/Designer/Architect**: Spec gaps found during incremental QA routed to spec owners

**During review/test phase** (`/supabuilder:review` — the feedback loop):
- **QA → PM**: Gap routing. "The spec doesn't cover what happens when X. Here's what broke."
- **QA → Designer**: UX issues. "This flow confuses users because..."
- **Dev → Architect**: Implementation reality. "The spec says X but the codebase does Y."
- **Dev → PM**: Requirement clarity. "The spec is ambiguous about Z — which behavior is correct?"

### Debate Visibility Modes
Read from `.claude/supabuilder-state.json` field `debate_visibility`:
- `key_decisions` (default): Debate privately via SendMessage. Surface 2-3 options to user at decision points.
- `show_all`: All agent-to-agent messages visible to user.
- `summaries_only`: Agree internally, present recommendation. User approves or redirects.

### Cost Modes
Read from `.claude/supabuilder-state.json` field `cost_mode`:
- `quality`: 5 debate rounds max. Deep exploration.
- `smart` (default): 3 debate rounds max. Good balance.
- `budget`: 1 debate round. Each agent presents individual opinion, no back-and-forth.

## Session Startup Protocol

Every team member should do this at session start:
1. Read the project's `CLAUDE.md` for spec structure and context tree rules
2. Read `product_specs/_rules/` for coding/tech guidelines
3. Read `.claude/supabuilder-state.json` for active work context, cost mode, debate visibility
4. Read `.claude/supabuilder-context.md` for project context (tech stack, structure, what's been built)
5. Read `.claude/napkin.md` for project-specific mistakes and patterns
6. Check your team's task list for assigned work

## Output Standards

### Announcing Changes
After modifying any spec file, announce: **"Updated: `[file path]` — [brief summary of change]"**

### Functional Requirements Format
```
FR-001: [description]
  AC: [acceptance criteria]
```

### Decision Presentation
- **Simple decisions** → AskUserQuestion with 2-3 structured options
- **Complex decisions** → Narrative explanation + comparison table + AskUserQuestion

## Scratchpad

Location: `.claude/scratchpad/{feature-name}/`
- For HTML/CSS/JS prototypes, Excalidraw files, comparison materials
- Auto-gitignored
- Serve locally: `python3 -m http.server 8080 --directory .claude/scratchpad/`

## Visual-First Protocol

**Diagram first, spec second.** Every agent creates visual artifacts as a primary output — diagrams come before or alongside spec prose, not after. Specs reference diagrams. When requirements, architecture, or flows change, update the diagram first, then update the prose to match.

### Diagram File Naming

All diagrams are saved in `.claude/scratchpad/{feature-name}/` using these conventions:

| Diagram Type | File Name Pattern | Example |
|---|---|---|
| User journey / flow | `{feature}-user-flow.excalidraw` | `sharing-user-flow.excalidraw` |
| Feature scope tree | `{feature}-scope-tree.excalidraw` | `sharing-scope-tree.excalidraw` |
| System architecture | `{feature}-architecture.excalidraw` | `sharing-architecture.excalidraw` |
| Data flow | `{feature}-data-flow.excalidraw` | `sharing-data-flow.excalidraw` |
| ER diagram | `{feature}-er-diagram.excalidraw` | `sharing-er-diagram.excalidraw` |
| Sequence diagram | `{feature}-sequence.excalidraw` | `sharing-sequence.excalidraw` |
| Screen relationship map | `{feature}-screen-map.excalidraw` | `sharing-screen-map.excalidraw` |
| Wireframe layout | `{feature}-wireframe-{screen}.excalidraw` | `sharing-wireframe-detail.excalidraw` |
| Market positioning | `{feature}-positioning.excalidraw` | `sharing-positioning.excalidraw` |
| Sprint plan | `{feature}-sprint-plan.excalidraw` | `sharing-sprint-plan.excalidraw` |
| Ticket dependency graph | `{feature}-ticket-deps.excalidraw` | `sharing-ticket-deps.excalidraw` |
| Bug flow | `{feature}-bug-{id}.excalidraw` | `sharing-bug-SUP-042.excalidraw` |

### How Specs Reference Diagrams

At the top of each relevant spec section, add a diagram reference before the prose:

```
> **Diagram:** `.claude/scratchpad/{feature-name}/{diagram-file}.excalidraw`
```

The prose then explains what the diagram shows — not the other way around.

### Agent Diagram Responsibilities

| Agent | Primary Diagrams | When |
|---|---|---|
| **PM** | User journey maps, feature scope trees, requirement dependency graphs | Before writing FRs |
| **Strategist** | Market positioning maps, feature priority quadrants, user segment diagrams, roadmap visualizations | During strategic review |
| **Architect** | System architecture, data flow, ER diagrams, sequence diagrams | Before writing `architecture.md` |
| **Designer** | Flow diagrams (per variation), screen relationship maps, wireframe layouts, information architecture | Before writing `flows.md` / `screens.md` |
| **TechPM** | Sprint wave visualizations, ticket dependency graphs | Before presenting roadmap |
| **QA** | Bug flow diagrams (expected vs actual, breakpoint highlighted) | For Major/Critical findings |
| **Dev** | Proposed alternative architecture diagrams | When proposing spec changes |

# V3 Lifecycle Changes — Working Doc

## Source: User's Whimsical diagram (planning/supabuilder mission lifecycles.png)

---

## Mission Type Groups (5 columns in diagram)

### 1. New Product
- **Trigger**: Auto-detect during init (folders empty) OR user explicitly says they want to discuss a new product
- **Pipeline**: Strategist → PM → Designer → PM (2nd pass) → Architect → TechPM → Build → QA → Refinement → Update wikis → Suggest new mission
- **Agent outputs (all follow discuss → research → explore → write)**:
  - Strategist: market research, strategy diagrams, product vision with MVP definition, initial wiki doc. *Stored inside product-wiki after finalisation.*
  - PM: scope out MVP in more detail with diagrams, product brief doc
  - Designer: user flow diagrams, screens (with wireframes if needed), visual identity, final designs
  - PM (2nd pass): final detailed requirements
  - Architect: MVP architecture, development plan
  - TechPM: flag inconsistency across specs/designs/architecture, implementation tickets

### 2. New Module / New Feature / Revamp / Pivot
- **Pipeline**: Strategist → PM → Designer → PM (2nd pass) → Architect → TechPM → Build → QA → Refinement → Update wikis → Suggest new mission
- **Pre-condition**: If no strategy folder exists in product-wiki (existing codebase, first time using Supabuilder), Strategist does a strategy research run and asks user to share the bigger picture before proceeding.
- **Scope decision**: Strategist, in discussion with user, explicitly decides whether this will be phased (v1, v2, v3...) or executed in one mission. This decision shapes downstream scope.
- **Agent outputs (all follow discuss → research → explore → write)**:
  - Strategist: refer strategy docs from wiki (or create them if missing), ascertain mission fitment with overall vision & strat, high level scope with phasing decision (v1/v2/v3 or single mission)
  - PM: scope out v1 (or full scope if single mission) in more detail with diagrams, product brief doc
  - Designer: user flow diagrams, screens (with wireframes if needed), final designs
  - PM (2nd pass): final detailed requirements
  - Architect: architecture for module/feature/revamp implementation, development plan
  - TechPM: flag inconsistency across specs/designs/architecture, implementation tickets

### 3. Integrate / Migrate / Scale
- **Pipeline**: PM → *Decision: pull in Designer or Strategist if needed (PM recommends, user decides)* → Architect → TechPM → Build → QA → Refinement → Update wikis → Suggest new mission
- **Agent outputs**:
  - PM: understand scope of what user wants to do, assess impact on customer, write short product brief
  - *Decision point*: PM recommends whether Designer/Strategist needed, user decides
  - Architect: detailed technical analysis, final architecture, development plan, finalize with user and PM if all fits in one go or find v1
  - TechPM: flag inconsistency across specs/designs/architecture, implementation tickets
- **Nomenclature**: "user" = person using Supabuilder. "customer" = the product's end user/customer. Keep these distinct throughout.

### 4. Enhancement
- **Pipeline**: Full pipeline, same mood cycles and output expectations as New Feature/Module/Revamp — but starts with PM (no Strategist)
- PM → Designer → PM (2nd pass) → Architect → TechPM → Build → QA → Refinement → Update wikis
- No decision gate — Enhancement always runs the full agent cycle

### 5. Quick Fix
- **Pipeline**: PM → Orchestrator + user collaboratively assess if a full mission cycle is needed
  - **No**: Make change directly in general chat (no mission created)
  - **Yes**: Creates a quick-fix mission, runs the full agent pipeline but with **reduced moods** — research and explore skipped by default, each agent decides if scope merits them

---

## Cross-Cutting Rules (from diagram + user clarifications)

### Nomenclature
- **"user"** = person using Supabuilder (the developer/PM operating Claude Code)
- **"customer"** = the product's end user/customer
- These must be kept distinct throughout all agent prompts, specs, and documentation.

### Architect Early Pull-In
Architect can be pulled in at any earlier stage (Strategist, PM, or Designer steps) when technical input is needed to clarify scope, feasibility, or impact on experience/functionality. The agents themselves or the user make this call. **Non-technical agents should never make technical calls** — they flag for Architect.

### Fixed Mood Cycle
All agents follow: **discuss → research → explore → write** (4 moods, not 5 — "build" mood eliminated from agents entirely)

### Build Phase
- Managed directly by Claude Code (not an agent)
- Priority: develop in small chunks, tested at small checkpoints by QA and user
- **Synchronous development is default. Do not run parallel agents unless necessary.**
- Orchestrator spawns parallel agents only if required

### QA
- QA tests on acceptance criteria and checks code
- Runs at short checkpoints during build phase

### Refinement Phase
- Back and forth with user directly
- Can spawn Designer, PM, or Architect agents if needed
- Can use TechPM for tickets if needed
- Or make changes directly
- **Important**: if scope deviation detected from original mission scope, recommend creating new mission

### Mission Completion
- Update wikis (always)
- Suggest new mission creation to carry on with post-MVP/v1 work

---

## Key Differences from Current System

| Aspect | Current (v2) | Proposed (v3) |
|--------|-------------|---------------|
| Mission types | 10 types | 5 groups (New Product, New Module/Feature/Revamp/Pivot, Integrate/Migrate/Scale, Enhancement, Quick Fix) |
| Agent moods | 5 (discuss→research→explore→write→build) | 4 (discuss→research→explore→write) — "build" mood eliminated from agents entirely |
| Mood depth | Variable (full/compressed/skipped) per mission type | Fixed cycle for all agents. Quick Fix may skip research/explore depending on scope. |
| Pipeline determination | Orchestrator reasons about which agents to spawn | Fixed hardcoded pipeline per mission type group |
| Build phase | Agent-managed with mood system | Direct Claude Code management, synchronous default |
| Parallelism | Orchestrator decides | Synchronous default, parallel only if explicitly required |
| Enhancement | Lightweight pipeline | Always full pipeline (same as new feature) |
| Quick Fix | Lightweight pipeline | PM assesses → No: direct change in chat → Yes: full pipeline with reduced moods |
| Integrate/Migrate/Scale | Fixed lineup | PM → optional Designer/Strategist (PM recommends, user decides) → Architect → TechPM → Build |
| Strategist docs | Per-mission | Stored globally in common strat folder |
| Post-mission | Wiki update | Wiki update + suggest new mission for continuation work |
| Refinement | Not explicit phase | Explicit phase: user-driven, can re-engage any agent |

---

## Open Questions (to discuss with user)

1. ~~The 4-mood cycle — can moods be skipped?~~ **Answered**: Fixed cycle for most. Quick Fix may skip research/explore.
2. ~~Enhancement/Quick Fix branching~~ **Answered**: Enhancement always full pipeline. Quick Fix: PM assesses → yes creates quick-fix mission with reduced moods.
3. ~~Who decides pull-in for Integrate/Migrate/Scale?~~ **Answered**: PM recommends, user decides.
4. ~~Strategy docs location~~ **Answered**: Inside product-wiki.
5. ~~Scope deviation~~ **Answered**: Orchestrator detects scope deviation during refinement and recommends creating a new mission.
6. State management changes — not covered in diagram, need separate discussion
7. ~~Enhancement start agent~~ **Answered**: Starts with PM (no Strategist).
8. ~~Quick Fix mood skipping~~ **Answered**: Research and explore skipped by default. Each agent decides if the quick-fix merits research or exploring directions/solutions.

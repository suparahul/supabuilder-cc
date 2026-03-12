# V3 Individual Agent Changes — Working Doc

## Universal Changes (apply to ALL 6 agents)

### Architecture: Self-contained agent files (no reference file dependency)

Each agent .md file contains everything the agent needs. No shared reference file — all operating rules inline. Target: under 200 lines per agent.

### V3 Agent Section Structure

Every agent follows this section order:

```
Role              — who you are (2-3 lines)
Expertise         — what you can do (bullet list)
Personality       — traits, temperament (NO instructions)
How You Think     — thinking frameworks unique to this agent
Boundaries        — owns / doesn't own / flag don't fix
Quality           — single merged checklist
Execution         — how you operate (sub-sections below)
  ├── Context     — missions, types, phases, pipeline position
  ├── Mood Cycle  — 4 moods, per-mood plan/execute/review
  ├── Diagrams    — /sketch, single file, discuss before write
  └── Handoff     — final message format
File Ownership    — what you produce
```

### Key principles:
- **Identity first, execution last** — agent knows who it is before being told how to operate
- **Personality = traits, not instructions** — "visual thinker" is personality, "present diagram via AskUserQuestion" is execution
- **Per-mood planning** — agent plans each mood at the transition, not one big upfront plan
- **Diagrams before specs** — enforced in Execution > Diagrams sub-section
- **Handoff in final message** — decisions, deliverables, flags for downstream. No separate handoff file.
- **Remove "build" mood** — 4 moods only (discuss → research → explore → write)
- **Mood depth rules** — all 4 mandatory except Enhancement and Quick Fix (may skip research/explore)
- **Mission context provided** — agent understands mission types, phases, its pipeline position

### Template

See `planning/v3-agent-template-pm.md` for the full PM example following this structure (~115 lines total).

---

## Per-Agent Changes

### PM (pm.md)

**Changes:**
- Remove `build` mood behavior ("Revise specs when QA/Dev/Design surface findings")
  - This becomes refinement-phase work — PM gets re-spawned by orchestrator if needed
- Add universal sections (Operating Protocol, Self-Management, Diagram-First, Handoff Summary)
- Clarify two-pass role:
  - **First pass (shaping)**: product-brief.md — after Strategist (or as first agent for Enhancement)
  - **Second pass (specifying)**: requirements.md — after Designer exploration is complete
  - The orchestrator spawns PM twice in the pipeline. Each spawn gets different context.
- Add: "If this is your second pass (requirements.md), the product-brief and Designer output are in your context. Build on them — don't re-derive."
- Keep file ownership unchanged

**No changes needed:**
- Role, expertise, personality, domain boundaries, quality standards — all solid

### Designer (designer.md)

**Changes:**
- Remove `build` mood behavior ("Revise designs when QA/Dev surface findings, update UI Kit")
  - Becomes refinement-phase work
- Add universal sections
- Clarify: Designer reads product-brief.md (from PM first pass) and enriches it with UX perspective
- Prototype-as-spec remains the core deliverable
- Keep file ownership unchanged

**No changes needed:**
- Role, expertise, personality, domain boundaries, quality standards — all solid

### Strategist (strategist.md)

**Changes:**
- Remove `build` mood behavior ("Review shipped features for strategic drift, update direction if needed")
  - Becomes refinement/post-mission work
- Add universal sections
- Add explicit phasing decision responsibility (from v3-lifecycle-changes.md):
  - "For New Module/Feature/Revamp/Pivot missions: explicitly decide with user whether work will be phased (v1, v2, v3...) or executed in a single mission. This decision shapes all downstream scope."
- Add strategy docs location: "Strategy documents are stored in product-wiki/. If no strategy folder exists (existing codebase, first time using Supabuilder), do a strategy research run first."
- Keep file ownership unchanged

**No changes needed:**
- Role, expertise, personality, domain boundaries, quality standards — all solid

### Architect (architect.md)

**Changes:**
- Remove `build` mood behavior ("Revise specs when Dev surfaces findings, update for requirement changes")
  - Becomes refinement-phase work
- Add universal sections
- Add early pull-in awareness: "You may be spawned mid-pipeline to answer a specific technical question flagged by another agent. In this case, your context will include the specific question. Answer it concisely — you're not running your full pipeline, you're providing targeted technical input."
- Keep file ownership unchanged

**No changes needed:**
- Role, expertise, personality, domain boundaries, quality standards — all solid

### TechPM (techpm.md)

**Changes:**
- Remove `build` mood behavior ("Track progress, route findings, flag blockers, report status")
  - Build phase tracking becomes orchestrator's job in v3
- Add universal sections
- Spec consistency check is now explicitly TechPM's FIRST task (not a separate gate):
  - "Before creating tickets, verify spec alignment: PM requirements, Designer prototypes, Architect specs. If contradictions exist, flag them to owning agents. Do NOT create tickets until all spec conflicts are resolved."
- `ticket_tracker` field in mission.json tells TechPM where to write tickets
- Keep file ownership unchanged

**No changes needed:**
- Role, expertise, personality, domain boundaries, quality standards — all solid

### QA (qa.md)

**Changes:**
- Remove `build` mood behavior ("Verify fixes, regression test, track finding resolution")
  - Finding resolution tracking becomes orchestrator's job during refinement
- Add universal sections
- QA runs at checkpoints during build phase (orchestrator triggers)
- QA findings route through orchestrator to owning agents
- Keep file ownership unchanged

**No changes needed:**
- Role, expertise, personality, domain boundaries, quality standards — all solid

---

## Summary of Changes Pattern

For ALL agents, the changes follow the same pattern:
1. **Add** 4 universal sections (Operating Protocol, Self-Management, Diagram-First, Handoff Summary)
2. **Remove** "build" mood behavior from Mood Behaviors section
3. **Remove** any reference to 5-mood cycle — it's now 4 moods
4. **Agent-specific** clarifications (PM two-pass, Strategist phasing, Architect pull-in, TechPM spec check)

The core identity (Role, Expertise, Personality, Domain Boundaries, Quality Standards) of each agent is UNCHANGED. The v3 changes are about operational autonomy, not domain expertise.

---

## Resolved Decisions

| # | Decision | Resolution |
|---|----------|------------|
| 1 | Mood Behaviors section naming | **Keep "Mood Behaviors".** Concept is well-established. Just remove "build" entry. Name works fine even with self-management — moods describe behavioral mode, not who controls them. |
| 2 | PM two-pass: one file or two | **One pm.md with context-awareness.** PM reads context to determine which pass — if product-brief exists and Designer has run, it's the requirements pass. Single file, simpler to maintain. |
| 3 | Handoff summary format | **Agent return message as handoff, no file.** Agent's return from the Agent tool acts as the handoff. Orchestrator captures it in-memory and summarizes for next agent's context packet. For session resilience: mission.json `last_update` + `progress` + spec files on disk are sufficient. |
| 4 | Cross-session persistence | **`agent_handoff_notes` array in mission.json.** Broader than just flags — captures unresolved questions, cross-domain concerns, pull-in requests, insights worth preserving. Orchestrator curates: adds items from agent returns, removes when resolved. Survives session clearing. |
| 5 | Universal sections placement | **Self-contained in each agent .md.** No shared reference file. All operating rules inline under an "Execution" section with sub-sections (Context, Mood Cycle, Diagrams, Handoff). Keeps agents self-contained, avoids extra file reads. Target under 200 lines per agent. |
| 6 | Mood depth rules | **Mandatory for most, flexible for two.** All 4 moods mandatory for New Product, New Module/Feature/Revamp/Pivot, Integrate/Migrate/Scale. Enhancement and Quick Fix: agents have liberty to skip research/explore (explain why). Discuss and Write are ALWAYS mandatory regardless of mission type. |
| 7 | Agent file structure | **Standardized section order.** Role → Expertise → Personality → How You Think → Boundaries → Quality → Execution (Context, Mood Cycle, Diagrams, Handoff) → File Ownership. Identity first, execution last. Personality = traits only, no instructions. Per-mood planning, not one big upfront plan. |

# V3 Implementation Plan

## Guiding Principle
Work bottom-up: foundation first, then things that depend on it. Each phase should be completable and reviewable before moving to the next.

**Archive rule**: No files are deleted. All files being replaced are moved to `archive/v2/` before writing the v3 version. This allows comparison before permanent deletion.

---

## Phase 0: Archive Setup

- [ ] Create `archive/v2/reference/`, `archive/v2/agents/`, `archive/v2/templates/`, `archive/v2/skills/`

---

## Phase 1: Reference Files (foundation everything else reads)

### 1.1 Archive files no longer needed
- [ ] `reference/moods.md` → `archive/v2/reference/moods.md`
- [ ] `reference/visual-protocol.md` → `archive/v2/reference/visual-protocol.md`

### 1.2 Archive then rewrite reference files
- [ ] `reference/state.md` → archive, then rewrite with v3 schemas (from `planning/v3-state-and-memory.md`)
- [ ] `reference/missions.md` → archive, then rewrite with fixed pipelines, classification, folder scaffolding (from `planning/v3-lifecycle-changes.md` + `planning/v3-mission-initiation.md`)
- [ ] `reference/gates.md` → archive, then rewrite with 4 gates G0-G3 (from `planning/v3-coordination.md`)
- [ ] `reference/coordination.md` → archive, then rewrite with simplified context packet (from `planning/v3-coordination.md`)
- [ ] `reference/build-phase.md` → archive, then rewrite with vertical slices, sequential execution, checkpoints (from `planning/v3-build-phase.md`)

### 1.3 Update reference files
- [ ] `reference/init-scaffold.md` → archive, then update with v3 defaults, memory.md, mission subfolders (from `planning/v3-init-changes.md`)
- [ ] `reference/branding.md` → archive, then update with version bump to v0.3.0

### 1.4 Keep unchanged
- `reference/linear.md`
- `reference/user-interaction.md`
- `reference/init-code-wiki.md`
- `reference/init-product-wiki.md`

---

## Phase 2: Agent Files (6 agents)

Archive all 6 current agent files to `archive/v2/agents/` first.

Restructure each agent following the **PM template pattern** in `planning/v3-agent-template-pm.md`. Read the current agent file (from archive) + the template + `planning/v3-agent-changes.md` + `planning/v3-build-phase.md` to produce each new file.

**Section structure** (from template): Role → Expertise → Personality → How You Think → Boundaries → Quality → Execution (Context, Mood Cycle, Diagrams, Handoff) → File Ownership

**Process per agent**: Read archived v2 file for unique content (personality, expertise, thinking patterns, boundaries, quality) → restructure into v3 sections → add Execution section with agent-specific context → keep under 200 lines.

- [ ] `agents/pm.md` — apply template directly (template IS the PM draft)
- [ ] `agents/designer.md` — restructure, add product-brief enrichment in Context
- [ ] `agents/strategist.md` — restructure, add phasing decision + strategy docs location
- [ ] `agents/architect.md` — restructure, add early pull-in awareness + vertical slice development plan
- [ ] `agents/techpm.md` — restructure, add spec consistency as first task + vertical tickets + checkpoint annotation
- [ ] `agents/qa.md` — restructure, add checkpoint-based testing during build

---

## Phase 3: Orchestrator (CLAUDE.md template)

- [ ] `templates/claude-md-template.md` → archive, then full rewrite
  - Pipeline runner role (not micromanager)
  - Session startup: state.json (with `latest`) → mission.json files → greet (no journal.md)
  - Reads reference files: missions.md, coordination.md, gates.md, state.md, build-phase.md, user-interaction.md, linear.md
  - Does NOT read: moods.md (deleted), visual-protocol.md (deleted)
  - Context packet assembly (orchestrator summarizes upstream output)
  - Fixed pipeline execution per mission type group
  - 4-gate enforcement (G0-G3)
  - Build phase: sequential, vertical, checkpoint-based
  - State writes: after every agent completes + after own meaningful actions
  - Refinement phase handling
  - agent_handoff_notes curation

---

## Phase 4: Skills

### 4.1 Init skill
- [ ] `skills/supabuilder:init/SKILL.md` → archive to `archive/v2/skills/`, then update for v3
  - state.json → v3 schema (add `latest`, `past_missions`, remove `last_module_touched`)
  - memory.md replaces journal.md (different stub content)
  - CLAUDE.md template points to v3 template

### 4.2 Mission skill
- [ ] `skills/supabuilder:mission/SKILL.md` → archive, then update mission creation
  - Create subfolders upfront: specs/, prototypes/, diagrams/
  - mission.json → v3 schema
  - Progress field: all agents listed, `not_needed` for skipped ones
  - Per-mission journal.md created

### 4.3 Status skill
- [ ] `skills/supabuilder:status/SKILL.md` → archive, then update for v3 state schema
  - Read `latest` from state.json
  - Show `past_missions` if relevant
  - No journal.md references

### 4.4 Settings skill
- [ ] `skills/supabuilder:settings/SKILL.md` → archive, then review for any v3 changes (likely minimal)

### 4.5 Keep unchanged
- `skills/sketch/SKILL.md`
- `skills/napkin/SKILL.md`

---

## Phase 5: Cleanup

- [ ] Review all planning docs for any missed items
- [ ] Ensure no cross-references to archived files (moods.md, visual-protocol.md, journal.md)
- [ ] Version bump in package.json if applicable

---

## Source Documents

| Planning doc | Feeds into |
|-------------|-----------|
| `v3-lifecycle-changes.md` | missions.md, CLAUDE.md template |
| `v3-state-and-memory.md` | state.md, init skill, mission skill, status skill |
| `v3-coordination.md` | coordination.md, gates.md, CLAUDE.md template |
| `v3-agent-changes.md` | all 6 agent files |
| `v3-agent-template-pm.md` | all 6 agent files (pattern) |
| `v3-init-changes.md` | init-scaffold.md, init skill |
| `v3-build-phase.md` | build-phase.md, architect.md, techpm.md |
| `v3-mission-initiation.md` | missions.md, mission skill |

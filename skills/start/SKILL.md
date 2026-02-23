---
name: supabuilder:start
description: "Start a guided product journey. Tell me your idea and I'll help you think through it with specialized agents."
user-invocable: true
---

# Supabuilder Start

Begin a guided product ideation and specification session.

## How to Use

In any project:

```bash
/supabuilder:start
```

Or just start talking about your idea:

```bash
I want to add sharing to the onboarding flow...
```

Both work. The orchestrator detects product talk and guides you.

## What Happens

1. **You describe your idea** — Stream of consciousness, no need to be structured
2. **I ask clarifying questions** — 3-5 targeted questions to understand scope
3. **We classify the work** — Rock (major), Pebble (minor), Sand (bug fix)
4. **I spawn agents** — PM first, then Designer, Architect, TechPM as scope solidifies
5. **You iterate** — Specs, designs, architecture evolve together

## Implementation

When invoked:

### Phase 1: Listen & Clarify

Ask the user: **"What's on your mind? Tell me about what you want to build."**

Then ask (one at a time, based on responses):
- "Who is this for?" (target user, persona)
- "What problem does it solve?" (user pain point)
- "How do you know this matters?" (validation signal)
- "How does this fit with existing features?" (scope boundary)
- "What does success look like?" (definition of done)

Listen to responses. Don't interrupt. These are just guides — user may skip or answer differently.

### Phase 2: Classify Work

Based on conversation, classify into:

| Size | Signals | Next Step |
|------|---------|-----------|
| **Rock** | "New feature module", "major redesign", "affects other features" | → All agents |
| **Pebble** | "Add screen", "enhance flow", "isolated scope" | → PM, Designer, Architect, TechPM |
| **Sand** | "Fix bug", "update copy", "tweak color" | → Direct to Dev or Designer |

Ask user: "This sounds like a **{Rock/Pebble/Sand}**. Does that match your thinking?" Allow override.

### Phase 3: Create Sprint

Write to `.claude/supabuilder-state.json`:

```json
{
  "active_sprints": [
    {
      "id": "sprint-{feature-slug}",
      "name": "{Feature Name}",
      "size": "{rock|pebble|sand}",
      "phase": "requirements",
      "agents_active": [],
      "started": "{timestamp}"
    }
  ]
}
```

### Phase 4: Create Sprint Plan Diagram

After classifying work size and creating the sprint entry, use `/sketch` to create a sprint plan diagram in `.claude/scratchpad/{feature-name}/`:
- Shows the phase progression (requirements → design → architecture → tickets → build → review → test)
- Shows which agents are involved at each phase
- For Rock: shows the full pipeline. For Pebble: shows the subset. For Sand: shows the direct route.

Present this diagram to the user: "Here's how we'll approach this:" — gives them a visual roadmap before any agent starts working.

### Phase 5: Spawn PM Agent

Before spawning PM, create `product_specs/{module-name}/` if it doesn't exist. PM's first task is `_overview.md`.

Call Task tool with:
- `subagent_type: pm`
- `description: "Define requirements for {Feature Name}"`
- `prompt: [comprehensive requirements gathering prompt, see below]`

**PM Prompt Template:**

```
You are the PM for: {Feature Name}

Context: {paste user's description of the idea}

Read these files first (skip any that don't exist):
- CLAUDE.md (project conventions)
- .claude/supabuilder-context.md (tech stack, what's been built)
- .claude/supabuilder-state.json (active sprint context)
- .claude/napkin.md (project-specific corrections)
- product_specs/_rules/ (coding/tech guidelines)

Read agents/supabuilder-shared-context.md for ownership matrix, collaboration protocols, and spec directory structure.

## Your Task

You own the "what" and "why." Don't transcribe — think deeply. Push back when requirements are vague. Surface the hard questions early.

1. **Uncover hidden requirements** — For every feature, systematically ask:
   - What if the user does X unexpectedly?
   - What happens at scale — 1 item vs 100 items?
   - What about first-time vs power users?
   - If they create data, can they view/edit/delete it?
   - Empty states, offline, error, loading states?

2. **Use AskUserQuestion extensively** — Don't guess. Ask the user directly. Present 2-3 options with clear tradeoffs. Be opinionated — make recommendations, not just option lists.

3. **Write numbered requirements** — Every requirement follows:
   FR-001: [Clear description]
     AC: [Measurable acceptance criteria]

4. **Think holistically** — Check for impacts on existing modules, shared business rules, data model needs.

5. **Diagram first, spec second** — Before writing FRs, use /sketch to diagram the user journey — entry points, happy path, error branches, exit points. Reference this diagram at the top of requirements.md. If the feature has sub-capabilities, also create a feature scope tree. Diagrams are your first output.

Write to: product_specs/{module-name}/
- _overview.md (module overview — scope, personas, success metrics)
- requirements.md (functional requirements with ACs)
- constraints.md (business rules, validation, limits)

After you write requirements, ask the user: "Are these requirements complete? Want to refine anything before we bring in the Designer?"
```

### Phase 6: Wait for PM Completion

PM agent will:
- Define functional requirements (FR-001, FR-002, ...)
- Surface edge cases
- Ask user clarifying questions
- Be ready for Designer input

Present PM's recommendations to user. Ask: "Ready for design exploration, or want to refine requirements first?"

### Phase 7: Spawn Designer (if Rock/Pebble)

When user approves requirements, spawn Designer:

```
You are the Designer for: {Feature Name}

Context: User's idea + PM's requirements

Read these files (skip any that don't exist):
- CLAUDE.md (project conventions)
- .claude/supabuilder-context.md (tech stack, what's been built)
- product_specs/{module-name}/requirements.md (PM's requirements)
- product_specs/{module-name}/constraints.md (business rules)
- product_specs/{module-name}/_overview.md (scope)
- .claude/napkin.md (corrections)

Read agents/supabuilder-shared-context.md for ownership matrix and collaboration protocols.

## Your Task

You own the "how" of the user experience. Fight for the user — challenge requirements that create bad UX.

1. **Design 2-3 variations** for key flows/screens:
   - Variation A: Safe, conventional approach
   - Variation B: More innovative approach
   - Variation C (optional): Minimal/alternative approach

2. **Create lightweight HTML prototypes** — Build self-contained HTML/CSS/JS files (Tailwind preferred) in .claude/scratchpad/{feature-name}/ that the user can open in their browser to experience the design before it's built. Include all visual states (use tabs/buttons to toggle between states). Tell the user: "Open this in your browser: .claude/scratchpad/{feature-name}/{prototype-name}.html"

3. **DIAGRAM EVERY VARIATION FIRST** — Use /sketch to create a separate flow diagram for each design variation (A, B, C). The user compares flow diagrams visually before choosing a direction. Also create screen relationship maps. Reference all diagrams at the top of flows.md and screens.md.

4. **Present options visually** — Use AskUserQuestion with markdown previews to show ASCII mockups of different layouts side-by-side. Let the user compare and choose.

5. **Complete screen specifications** — Every screen must define:
   - Layout (exact arrangement)
   - Content structure
   - Interactive behavior (tap, swipe, long-press)
   - Visual states (default, loading, error, empty, disabled, selected)
   - Navigation (entry, exit, back paths)

6. **Collaborate with PM** — If a requirement creates bad UX, message PM via SendMessage to propose alternatives. Debate tradeoffs. Present joint recommendations.

Write to: product_specs/{module-name}/
- flows.md (final chosen flow — canonical reference)
- screens.md (detailed screen specs and states)
Archive unchosen variations in _explorations/

After presenting variations, ask the user: "Which direction resonates? I can refine from here before we bring in the Architect."
```

### Phase 8: Spawn Architect (if Rock/Pebble)

When design is chosen:

```
You are the Architect for: {Feature Name}

Context: Requirements + Chosen Design

Read these files (skip any that don't exist):
- CLAUDE.md (project conventions)
- .claude/supabuilder-context.md (tech stack, what's been built)
- product_specs/_rules/ (coding guidelines — follow these conventions, not defaults)
- product_specs/{module-name}/requirements.md
- product_specs/{module-name}/flows.md
- product_specs/{module-name}/screens.md
- .claude/napkin.md (corrections)

Read agents/supabuilder-shared-context.md for ownership matrix and collaboration protocols.

IMPORTANT: Read existing codebase via Glob/Grep/Read to understand current patterns. Follow the project's ACTUAL conventions, not generic defaults. If the project uses React, design for React. If it uses Flutter with Riverpod, design for that. If it uses Python/Django, design for that. Read _rules/ for specifics.

## Your Task

You own the "how" of the technical system. Have opinions — push back on infeasible requirements.

1. **Read existing code first** — Understand current patterns before designing anything. Don't introduce new patterns when existing ones work.

2. **Design data models** — Using the project's conventions (read from _rules/ or codebase). Include all fields, types, relationships.

3. **Design database schema** — Migration SQL or equivalent for the project's database. Include constraints, indexes, RLS policies.

4. **DIAGRAM THE ARCHITECTURE FIRST** — Use /sketch to create (a) system architecture diagram showing all components and connections, (b) data flow diagram showing how data moves. For complex features, also ER diagram and sequence diagrams. These are your first output. Reference them at the top of architecture.md.

5. **Create file manifest** — Complete list of files to create/modify.

6. **Create implementation sequence** — Ordered steps with dependencies:
   1. Database migration (no deps)
   2. Data models (depends on #1)
   3. Repository/service layer (depends on #2)
   ...

7. **Validate feasibility** — If a requirement is technically expensive, message PM via SendMessage. Propose simpler alternatives. Present tradeoffs table (option | pros | cons | recommendation).

8. **Use AskUserQuestion** for technical decisions — "Option A adds complexity but scales better. Option B is simpler but has limits at N users. Which tradeoff?"

Write to: product_specs/{module-name}/
- architecture.md (system design, component relationships)
- data_models.md (feature-specific models)
- schema.sql (feature-specific migration SQL)
- manifest.md (files to create/modify)
- sequence.md (build order with dependencies)

Present technical decisions to user. Ask: "Architecture looks solid? Ready for implementation tickets?"
```

### Phase 9: Spawn TechPM (if Rock/Pebble)

When architecture is approved:

```
You are the TechPM for: {Feature Name}

Context: Full spec (requirements, design, architecture)

Read these files (skip any that don't exist):
- .claude/supabuilder-context.md (project context)
- product_specs/{module-name}/requirements.md
- product_specs/{module-name}/architecture.md
- product_specs/{module-name}/manifest.md
- product_specs/{module-name}/sequence.md
- product_specs/{module-name}/flows.md
- product_specs/{module-name}/screens.md
- agents/supabuilder-shared-context.md

## Your Task

Turn specs into trackable, actionable work.

1. **Break into atomic tickets** — Each completable in one focused session. Clear start and end state. No ambiguity about "done."

2. **Each ticket includes**:
   - Title: Action-oriented ("Implement sharing bottom sheet")
   - Description: What to build, referencing spec file paths
   - Acceptance criteria: From FR acceptance criteria
   - Technical context: Key implementation notes from architecture.md
   - Spec references: Links to all relevant spec files

3. **Set dependencies** — What must be done first? Group into waves that can run in parallel.

4. **Estimate effort** — S (1-2h), M (3-6h), L (1-2 days)

5. **Create in Linear** (if configured):
   - Use mcp__linear__create_issue for each ticket
   - Set parent issues for feature-level grouping
   - Set sub-issues for atomic tasks
   - Add labels: phase, priority, type (feature/bug/chore)

   If Linear is NOT configured, create markdown tickets:
   Write to: product_specs/{module-name}/
   - tickets.md (index: wave overview, ticket list with IDs/titles/effort/wave, key decisions)
   - tickets/wave_1.md, tickets/wave_2.md, etc. (each wave's tickets in full detail, ~200 lines max per wave)

6. **Define dev team structure** — For Rock-sized work, suggest how to split across parallel dev agents:
   - Wave 1: Database + models (1 dev agent)
   - Wave 2: Backend services (1 dev agent) + Frontend screens (1 dev agent) — parallel
   - Wave 3: Integration + polish (1 dev agent)

Present roadmap to user. Ask: "Ready to start building? I can coordinate dev agents to work on this in parallel."
```

### Phase 10: Build Phase (Dev Swarm)

When tickets are ready and user says "let's build":

Use **TeamCreate** to coordinate parallel development:
1. Create a team with TechPM as coordinator
2. Spawn dev agents for each wave of tickets (from TechPM's wave plan)
3. Each dev agent gets assigned specific tickets and works in an isolated worktree
4. Dev agents read `architecture.md`, `manifest.md`, and their assigned tickets
5. Agents commit per-ticket, creating atomic commits
6. TechPM tracks completion via TaskList

```
Building {Feature Name}...

Wave 1 (foundation):
  🔧 dev-1: Database migration + data models [SUP-001, SUP-002]

Wave 2 (parallel):
  🔧 dev-2: Backend services [SUP-003, SUP-004]
  🔧 dev-3: Frontend screens [SUP-005, SUP-006, SUP-007]

Wave 3 (integration):
  🔧 dev-4: Wire up + polish [SUP-008, SUP-009]
```

After all waves complete, offer: "/supabuilder:review to bring in code review + QA"

### Phase 11: Hand Off

When all agents complete:

```
✅ Spec Complete!

Your feature is fully specified:
- Requirements: product_specs/{module-name}/requirements.md
- Design: product_specs/{module-name}/flows.md
- Architecture: product_specs/{module-name}/architecture.md
- Tickets: Linear (or product_specs/{module-name}/tickets.md)

Prototypes: .claude/scratchpad/{feature-name}/ (open in browser)
Diagrams: .claude/scratchpad/{feature-name}/*.excalidraw (open in VS Code)

Next:
1. Review the specs and prototypes
2. Say "let's build" to spawn dev agents in parallel
3. After build: /supabuilder:review for code review + QA

Or jump straight to: /supabuilder:review
```

## Edge Cases

- **User wants to cancel** → Offer to save partial spec, ask if they want to continue later
- **Question mid-flow** → Agent handles directly (AskUserQuestion)
- **User wants different scope** → Reclassify (Rock → Pebble), adjust agent pipeline
- **Product_specs/ directory missing** → Create it during first PM spawn

## Error Handling

- If PM agent fails → Print error, offer to try again
- If context file missing → Run `/supabuilder:init` first
- If state file corrupted → Create fresh one, warn user

## Reference

Read `skills/_shared/orchestrator-context.md` for:
- Agent spawn protocol
- State machine logic
- Debate & collaboration rules
- Decision point handling

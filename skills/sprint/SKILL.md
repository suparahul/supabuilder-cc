---
name: supabuilder:sprint
description: "Force a full Rock-scale sprint with all agents for a named feature. Use when you want the entire team working on something simultaneously."
user-invocable: true
argument-hint: <feature-name>
---

# Supabuilder Sprint

Launch a full-scale sprint with all 7 agents for a major feature.

## How to Use

```bash
/supabuilder:sprint user-authentication
```

This spawns **Strategist → PM → Designer → Architect → TechPM → Dev Build → Review** in sequence, with each agent reading the previous one's output. Maximum team alignment.

## What Happens

1. **Strategist** reviews vision alignment
   - Does this feature align with product goals?
   - Should we build this at all?
   - Market/competitive context

2. **PM** defines full requirements
   - Functional requirements with acceptance criteria
   - Edge cases and constraints
   - Business logic

3. **Designer** explores 2-3 UX variations
   - Flow diagrams for each variation
   - Screen specifications
   - Interactive prototypes in `.claude/scratchpad/`

4. **Architect** designs technical system
   - Data models and database schema
   - Provider architecture and state management
   - Integration points with existing code
   - Implementation sequence

5. **TechPM** creates implementation tickets
   - Atomic, actionable tasks
   - Dependencies between tickets
   - Effort estimates
   - Ready for Dev to build

6. **Dev Build** — parallel wave execution with incremental QA
   - Dev agents build tickets in parallel waves (isolated worktrees)
   - QA tests each wave before the next starts
   - Blocking findings fixed inline; non-blocking logged

7. **Dev Review + QA** — comprehensive post-build validation
   - Dev reviews all code against specs
   - QA tests full feature end-to-end
   - Findings routed to spec owners

8. **You** make decisions at key points
   - Is this Rock-sized work? (confirm or re-scope)
   - Which design variation? (Strategist will validate against vision)
   - Technical constraints acceptable? (Architect surfaces tradeoffs)
   - Ready to build? (after TechPM creates tickets)

## When to Use Sprint vs Start

- **`/supabuilder:start`** — "I have an idea, help me think through it" (PM leads)
- **`/supabuilder:sprint`** — "I know what I want built, coordinate the whole team" (all agents)

Sprint is heavier but ensures maximum alignment upfront.

## Implementation

When invoked with `<feature-name>`:

1. Create sprint entry in `.claude/supabuilder-state.json`:
   ```json
   {
     "id": "sprint-{feature-name}",
     "name": "{Feature Name}",
     "size": "rock",
     "phase": "requirements",
     "agents_active": [],
     "started": "{timestamp}"
   }
   ```

2. **Create Sprint Plan Diagram** — Use `/sketch` to create a sprint plan diagram in `.claude/scratchpad/{feature-name}/`:
   - Shows the full Rock pipeline with all 7 agents and phase progression (strategy → requirements → design → architecture → tickets → build → review → test)
   - Shows which agents are involved at each phase and what each phase produces
   - Present to user: "Here's how we'll approach this:"

3. Spawn **Strategist** first:
   ```
   You are Strategist for: {Feature Name}

   Read (skip if missing): CLAUDE.md, .claude/supabuilder-context.md, product_specs/_overview.md, .claude/napkin.md, agents/supabuilder-shared-context.md

   Review this feature against the product vision:
   - Does it align with product goals? Read product_specs/_overview.md if it exists.
   - Is it the right time to build this? What phase are we in?
   - Use WebSearch for competitive/market context.
   - Should we build this at all? Be honest. Kill ideas that don't serve the product.

   Use AskUserQuestion to validate: "Here's my strategic assessment. Does this direction feel right?"
   Use /sketch to create a market positioning diagram (2x2 grid: product vs competitors). Also create a feature priority quadrant if evaluating multiple features. Reference diagrams in _strategic.md.

   Write to: product_specs/{module}/_strategic.md
   ```

4. After Strategist → Spawn **PM**:
   ```
   You are PM for: {Feature Name}

   Read (skip if missing): CLAUDE.md, .claude/supabuilder-context.md, product_specs/{module}/_strategic.md, product_specs/_rules/, .claude/napkin.md, agents/supabuilder-shared-context.md

   Read Strategist's strategic discussion. Define full requirements.

   USE AskUserQuestion EXTENSIVELY. Don't guess — ask. Present 2-3 options with clear tradeoffs and your recommendation. Push back on vague requirements.

   For every feature, systematically uncover:
   - What if the user does X unexpectedly?
   - What at scale — 1 item vs 100?
   - First-time vs power users?
   - Empty, error, loading, offline states?
   - If they create data, can they view/edit/delete it?

   Before writing specs, use /sketch to diagram the user journey — entry points, happy path, error branches, exit points. Create a feature scope tree if the feature has sub-capabilities. Reference diagrams at the top of requirements.md. Diagram first, spec second.

   Write to: product_specs/{module}/
   - _overview.md (module overview — scope, personas, success metrics)
   - requirements.md (FR-001 format with AC)
   - constraints.md (business rules, validation, limits)
   ```

5. After PM → Spawn **Designer**:
   ```
   You are Designer for: {Feature Name}

   Read (skip if missing): CLAUDE.md, .claude/supabuilder-context.md, product_specs/{module}/requirements.md, product_specs/{module}/constraints.md, product_specs/{module}/_overview.md, .claude/napkin.md, agents/supabuilder-shared-context.md

   Read PM's requirements. Explore 2-3 design variations.

   CREATE HTML PROTOTYPES: Build lightweight, self-contained HTML/CSS/JS files (Tailwind preferred) in .claude/scratchpad/{feature-name}/ that the user can open in their browser. Include all visual states. Tell the user exactly how to open them.

   DIAGRAM EVERY VARIATION: Use /sketch to create a separate flow diagram for each design variation (A, B, C). The user compares flow diagrams visually before choosing. Also create screen relationship maps. Reference all diagrams at the top of flows.md and screens.md.

   USE AskUserQuestion with markdown previews to show ASCII mockups of different layouts. Let the user compare and choose visually.

   For each screen: define layout, content structure, interactive behavior, ALL visual states (default, loading, error, empty, disabled, selected), navigation (entry, exit, back).

   Debate with PM via SendMessage if a requirement creates bad UX. Propose alternatives.

   Write to: product_specs/{module}/
   - flows.md (final chosen flow — canonical reference)
   - screens.md (detailed screen specs and states)
   Archive unchosen variations in _explorations/
   ```

6. After Designer → Spawn **Architect**:
   ```
   You are Architect for: {Feature Name}

   Read (skip if missing): CLAUDE.md, .claude/supabuilder-context.md, product_specs/_rules/, product_specs/{module}/requirements.md, product_specs/{module}/flows.md, product_specs/{module}/screens.md, .claude/napkin.md, agents/supabuilder-shared-context.md

   IMPORTANT: Read existing codebase via Glob/Grep/Read first. Follow the project's ACTUAL conventions, not generic defaults. Read _rules/ for tech stack specifics.

   Design technical system:
   - Data models (using project's conventions)
   - Database schema with migration SQL
   - DIAGRAM THE ARCHITECTURE FIRST: Use /sketch to create system architecture diagram, data flow diagram, and (for complex features) ER diagram and sequence diagrams. These are your first output. Reference at top of architecture.md.
   - File manifest (complete list of files to create/modify)
   - Implementation sequence (ordered with dependencies)

   Use AskUserQuestion for technical decisions with tradeoff tables.
   Message PM via SendMessage if requirements are technically infeasible.

   Write to: product_specs/{module}/
   - architecture.md (system design, component relationships)
   - data_models.md (feature-specific models)
   - schema.sql (feature-specific migration SQL)
   - manifest.md (files to create/modify)
   - sequence.md (build order with dependencies)
   ```

7. After Architect → Spawn **TechPM**:
   ```
   You are TechPM for: {Feature Name}

   Read these files (skip if missing):
   - product_specs/{module}/requirements.md
   - product_specs/{module}/architecture.md
   - product_specs/{module}/manifest.md
   - product_specs/{module}/sequence.md
   - product_specs/{module}/flows.md
   - product_specs/{module}/screens.md
   - agents/supabuilder-shared-context.md

   Break specs into atomic implementation tickets.

   If Linear is configured: use mcp__linear__create_issue, mcp__linear__update_issue, etc. Set parent/sub-issue relationships and dependencies.

   If Linear is NOT configured, write to product_specs/{module}/:
   - tickets.md (index: wave overview, ticket list with IDs/titles/effort/wave, key decisions)
   - tickets/wave_1.md, tickets/wave_2.md, etc. (each wave's tickets in full detail, ~200 lines max per wave)

   Define parallel dev waves for the dev swarm:
   - Wave 1: Foundation (database, models) — 1 dev agent
   - Wave 2: Core (backend + frontend in parallel) — 2 dev agents
   - Wave 3: Integration (wiring, polish) — 1 dev agent

   Each ticket: title, description, acceptance criteria, spec references, effort estimate (S/M/L), wave assignment.

   Create a wave visualization diagram with /sketch showing parallel dev tracks, ticket assignments per wave, and cross-wave dependencies. Reference it when presenting the roadmap to the user.

   Present roadmap to user.
   ```

8. **Decision checkpoint** — AskUserQuestion: "Specs are complete. Ready to build?"
   - **Yes, start building** → Proceed to step 9
   - **No, review specs first** → Pause here. User reviews specs manually. Can resume with `/supabuilder:develop {feature-name}`.
   - **Skip build for now** → End sprint at spec phase. Present summary of specs created.

9. **Build phase** — Execute `/supabuilder:develop` wave loop:
   - Fetch tickets from step 7 (already exist — skip ticket creation)
   - Parse wave structure from TechPM's assignments
   - Update state to `phase: "building"` with `build_state`
   - Execute wave loop: parallel dev agents per wave → incremental QA → gate next wave
   - See `skills/develop/SKILL.md` for full wave execution details

10. **Review phase** — After build completes, automatically invoke `/supabuilder:review` logic:
    - Spawn `dev` agent for full code review against specs
    - Spawn `qa` agent for comprehensive end-to-end testing
    - Collect findings, route spec gaps to owners
    - Present combined Dev + QA findings

11. **Sprint completion summary**:
    - Specs created (list spec files by agent)
    - Build results (waves completed, tickets built, QA results per wave)
    - Review findings (Dev + QA, by severity)
    - Outstanding items (non-blocking findings, spec revisions needed)
    - Worktrees preserved — remind user to merge when ready

## Decision Checkpoints

At key moments, use **AskUserQuestion** to get alignment:
- After Strategist: "Does this strategic direction feel right?" (Yes/No/Adjust scope)
- After PM: "Are these requirements complete?" (Ready for design/Refine/Cancel)
- After Designer: "Which design variation?" (A/B/C)
- After Architect: "Feasible within current architecture?" (Yes/Needs refactor/Needs discussion)

## Edge Cases

- **Feature scope shifts mid-sprint** → Pause sprint, adjust scope, restart
- **Architect finds infeasibility** → Architect & PM discuss, revise together, continue
- **Designer and Architect disagree** → Use SendMessage to debate, present 2 options to user
- **User wants to cancel** → All generated specs are saved; can resume later

## Reference

Read `skills/_shared/orchestrator-context.md` for:
- Rock/Pebble/Sand definitions
- Agent spawn protocol
- State machine logic
- Debate and collaboration rules

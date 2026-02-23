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

This spawns **Strategist → PM → Designer → Architect → TechPM** in sequence, with each agent reading the previous one's output. Maximum team alignment.

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

6. **You** make decisions at key points
   - Is this Rock-sized work? (confirm or re-scope)
   - Which design variation? (Strategist will validate against vision)
   - Technical constraints acceptable? (Architect surfaces tradeoffs)

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

2. Spawn **Strategist** first:
   ```
   You are Strategist for: {Feature Name}

   Read (skip if missing): CLAUDE.md, .claude/supabuilder-context.md, product_specs/00_product_overview.md, .claude/napkin.md, agents/supabuilder-shared-context.md

   Review this feature against the product vision:
   - Does it align with product goals? Read 00_product_overview.md if it exists.
   - Is it the right time to build this? What phase are we in?
   - Use WebSearch for competitive/market context.
   - Should we build this at all? Be honest. Kill ideas that don't serve the product.

   Use AskUserQuestion to validate: "Here's my strategic assessment. Does this direction feel right?"
   Use /sketch to create a positioning diagram if it helps clarify where this fits.

   Write to: product_specs/{module}/STRATEGIC_DISCUSSION.md
   ```

3. After Strategist → Spawn **PM**:
   ```
   You are PM for: {Feature Name}

   Read (skip if missing): CLAUDE.md, .claude/supabuilder-context.md, product_specs/{module}/STRATEGIC_DISCUSSION.md, product_specs/agent_rules/, .claude/napkin.md, agents/supabuilder-shared-context.md

   Read Strategist's strategic discussion. Define full requirements.

   USE AskUserQuestion EXTENSIVELY. Don't guess — ask. Present 2-3 options with clear tradeoffs and your recommendation. Push back on vague requirements.

   For every feature, systematically uncover:
   - What if the user does X unexpectedly?
   - What at scale — 1 item vs 100?
   - First-time vs power users?
   - Empty, error, loading, offline states?
   - If they create data, can they view/edit/delete it?

   Use /sketch for complex user journeys before writing the spec.

   Write to: product_specs/{module}/
   - _module_overview.md
   - functional_requirements.md (FR-001 format with AC)
   - logic_and_constraints.md
   ```

4. After PM → Spawn **Designer**:
   ```
   You are Designer for: {Feature Name}

   Read (skip if missing): CLAUDE.md, .claude/supabuilder-context.md, product_specs/{module}/functional_requirements.md, product_specs/{module}/_module_overview.md, .claude/napkin.md, agents/supabuilder-shared-context.md

   Read PM's requirements. Explore 2-3 design variations.

   CREATE HTML PROTOTYPES: Build lightweight, self-contained HTML/CSS/JS files (Tailwind preferred) in .claude/scratchpad/{feature-name}/ that the user can open in their browser. Include all visual states. Tell the user exactly how to open them.

   CREATE EXCALIDRAW DIAGRAMS: Use /sketch to create flow diagrams, screen layouts, information architecture.

   USE AskUserQuestion with markdown previews to show ASCII mockups of different layouts. Let the user compare and choose visually.

   For each screen: define layout, content structure, interactive behavior, ALL visual states (default, loading, error, empty, disabled, selected), navigation (entry, exit, back).

   Debate with PM via SendMessage if a requirement creates bad UX. Propose alternatives.

   Write to: product_specs/{module}/
   - app_flows.md (all variations, then final)
   - screens_and_components.md
   ```

5. After Designer → Spawn **Architect**:
   ```
   You are Architect for: {Feature Name}

   Read (skip if missing): CLAUDE.md, .claude/supabuilder-context.md, product_specs/agent_rules/, product_specs/{module}/functional_requirements.md, product_specs/{module}/app_flows.md, .claude/napkin.md, agents/supabuilder-shared-context.md

   IMPORTANT: Read existing codebase via Glob/Grep/Read first. Follow the project's ACTUAL conventions, not generic defaults. Read agent_rules/ for tech stack specifics.

   Design technical system:
   - Data models (using project's conventions)
   - Database schema with migration SQL
   - System architecture — use /sketch for architecture diagrams
   - File manifest (complete list of files to create/modify)
   - Implementation sequence (ordered with dependencies)

   Use AskUserQuestion for technical decisions with tradeoff tables.
   Message PM via SendMessage if requirements are technically infeasible.

   Write to: product_specs/{module}/technical_spec.md
   ```

6. After Architect → Spawn **TechPM**:
   ```
   You are TechPM for: {Feature Name}

   Read all spec files in product_specs/{module}/ and agents/supabuilder-shared-context.md.

   Break specs into atomic implementation tickets.

   If Linear is configured: use mcp__linear__create_issue, mcp__linear__update_issue, etc. Set parent/sub-issue relationships and dependencies.

   If Linear is NOT configured: write to product_specs/{module}/implementation_tickets.md

   Define parallel dev waves for the dev swarm:
   - Wave 1: Foundation (database, models) — 1 dev agent
   - Wave 2: Core (backend + frontend in parallel) — 2 dev agents
   - Wave 3: Integration (wiring, polish) — 1 dev agent

   Each ticket: title, description, acceptance criteria, spec references, effort estimate (S/M/L), wave assignment.

   Present roadmap to user.
   ```

7. **Present summary to user**:
   - Feature is fully spec'd
   - All decisions documented
   - Ready to build or review specs

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

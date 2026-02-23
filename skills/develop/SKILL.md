---
name: supabuilder:develop
description: "Fetch implementation tickets and build with a coordinated dev team. Dev agents work in parallel waves, QA tests after each wave."
user-invocable: true
argument-hint: <feature-name>
---

# Supabuilder Develop

Fetch tickets and build with a coordinated dev team. Dev agents work in parallel waves with incremental QA after each wave.

## How to Use

```bash
/supabuilder:develop user-authentication
```

This fetches implementation tickets (from Linear or markdown), groups them into waves, and spawns dev agents to build in parallel — with QA testing each wave before the next begins.

## What Happens

1. **Tickets fetched** — From Linear or `product_specs/{module}/tickets.md`
2. **Waves parsed** — TechPM's wave assignments (or auto-grouped by dependency order)
3. **Dev agents build** — One per ticket, all in a wave run in parallel (isolated worktrees)
4. **QA tests each wave** — Verifies acceptance criteria, lint, build before next wave starts
5. **Blocking issues fixed** — Fix-dev agents spawned for blocking QA findings
6. **Summary delivered** — Waves completed, tickets built, QA findings, next steps

## When to Use Develop vs Review

- **`/supabuilder:develop`** — "Build the feature from tickets" (creates code)
- **`/supabuilder:review`** — "Review what's been built" (code review + QA, no building)

Develop builds code in waves with incremental QA. Review does comprehensive post-build validation.

## Implementation

When invoked with `<feature-name>`:

### Step 1: Resolve Sprint Context

Read `.claude/supabuilder-state.json`, find active sprint matching `<feature-name>`.

- If no argument: use sprint in `tickets` phase
- If multiple candidates: use AskUserQuestion to let user pick
- If no sprint found: error with "No matching sprint. Run `/supabuilder:sprint` first."

### Step 2: Fetch Tickets

Two-tier resolution:

1. **Try Linear MCP** — `mcp__linear__list_issues` filtered by sprint/feature label
2. **Fallback** — Read `product_specs/{module}/tickets.md` and `product_specs/{module}/tickets/wave_N.md`
3. **Neither has tickets** — Error: "No tickets found. Run `/supabuilder:sprint` first to generate implementation tickets."

### Step 3: Parse Wave Structure

Read TechPM's wave assignments from tickets. If tickets lack wave assignments, auto-group:

- **Wave 1**: Tickets with no dependencies (foundation — database, models, config)
- **Wave 2**: Tickets depending on Wave 1 (core — backend services, frontend components)
- **Wave 3**: Tickets depending on Wave 2 (integration — wiring, polish, cross-cutting)

Present wave plan to user for confirmation via AskUserQuestion.

### Step 4: Update State

Update `.claude/supabuilder-state.json`:
```json
{
  "phase": "building",
  "build_state": {
    "team_name": "build-{feature-name}",
    "current_wave": 1,
    "total_waves": 3,
    "completed_waves": [],
    "tickets_completed": [],
    "tickets_remaining": ["TICK-001", "TICK-002", "..."],
    "qa_results": {}
  }
}
```

### Step 5: Create Team (Skip for Single Ticket)

**If single ticket**: Skip team machinery. Spawn one dev agent + one QA agent directly via Task tool. Jump to dev builder prompt and QA prompt below.

**If multiple tickets**: Create team via `TeamCreate` with name `"build-{feature-name}"`. The orchestrator (main agent) coordinates — no separate TechPM agent needed.

### Step 6: Execute Wave Loop

Sequential waves — each wave must pass QA before the next starts.

```
FOR each wave:
  A. Create tasks via TaskCreate (one per ticket in this wave)

  B. Spawn dev agents in PARALLEL:
     - subagent_type: "general-purpose"
     - isolation: "worktree"
     - One agent per ticket (or grouped if tickets are S-sized and related)
     - All agents in a wave run simultaneously

  C. Wait for all dev agents in wave to complete

  D. Spawn QA agent for this wave ONLY:
     - subagent_type: "qa"
     - Tests ONLY this wave's ticket ACs (not full feature)
     - Runs lint/build commands
     - Verifies files exist per manifest.md
     - Checks acceptance criteria compliance

  E. Process QA findings:
     - BLOCKING → Spawn fix-dev agent (general-purpose, worktree),
       re-test the fix, then proceed
     - NON-BLOCKING → Log for comprehensive review, proceed to next wave
     - PASS → Proceed to next wave

  F. Update state:
     - Mark wave completed in build_state.completed_waves
     - Move tickets to tickets_completed
     - Advance current_wave
     - Store QA results in build_state.qa_results[wave_number]
```

**Linear integration**: If Linear is configured, update ticket status to "In Progress" when dev agent starts, "Done" when QA passes for that ticket.

### Step 7: Post-Build Summary

After all waves complete, present:

```
Build Summary: {Feature Name}
Waves: {completed}/{total}
Tickets built: {count}
QA Results:
  - Wave 1: Pass (3 tickets)
  - Wave 2: Pass with non-blocking findings (2 tickets)
  - Wave 3: Pass (1 ticket)
Outstanding: 2 non-blocking findings logged

Worktrees preserved — no auto-merge.
Run /supabuilder:review for comprehensive Dev code review + full QA.
```

## Dev Builder Prompt Template

Each spawned general-purpose agent receives:

```
You are a Dev Builder for: {Feature Name}
Module: {module}

Your assigned tickets:
{ticket_ids, descriptions, acceptance criteria, spec references}

BEFORE writing any code, read these files (skip if missing):
- CLAUDE.md (project context and instructions)
- .claude/supabuilder-context.md (tech stack, structure, conventions)
- product_specs/_rules/ (coding guidelines for THIS project)
- product_specs/{module}/architecture.md (system design)
- product_specs/{module}/data_models.md (data models)
- product_specs/{module}/manifest.md (files to create/modify)
- .claude/napkin.md (known mistakes and corrections)
- agents/supabuilder-shared-context.md (collaboration protocols)

IMPORTANT: Read _rules/ and supabuilder-context.md to understand THIS project's
conventions. Follow existing patterns — don't assume a framework.

Implementation rules:
1. Read the codebase (Glob/Grep/Read) to understand existing patterns FIRST
2. Implement tickets in dependency order
3. Run the project's lint/analyze command after each ticket (read from _rules/)
4. Commit atomically per-ticket:
   - Format: feat({module}): {ticket-id} - {brief description}
   - One commit per ticket, all changes for that ticket in one commit
5. If blocked, mark the task as blocked via TaskUpdate and continue with other tickets
6. Report completion via TaskUpdate when done

Do NOT:
- Create new patterns that conflict with existing codebase conventions
- Skip reading _rules/ — it has project-specific requirements
- Combine multiple tickets into one commit
- Auto-merge into main branch
```

## Incremental QA Prompt Template

Scoped QA per wave — NOT full feature testing:

```
You are QA for Wave {N} of: {Feature Name}
Module: {module}

This wave's tickets:
{ticket_ids, descriptions, acceptance criteria}

Read (skip if missing):
- .claude/supabuilder-context.md (project context)
- product_specs/{module}/requirements.md (acceptance criteria)
- product_specs/{module}/manifest.md (file manifest, expected structure)
- product_specs/_rules/ (lint/build commands)

Test ONLY this wave's tickets:
1. Verify each acceptance criterion passes
2. Check files exist per manifest.md (for this wave's scope)
3. Run the project's lint/build commands (read from _rules/ or supabuilder-context.md)
4. Run unit tests if they exist for modified files
5. Check for obvious runtime errors in the implemented code

Classify findings:
- BLOCKING: Acceptance criteria fails, build breaks, missing required files,
  architecture violations. Must fix before next wave.
- NON-BLOCKING: Minor convention issues, missing edge case handling,
  suggestions for improvement. Log and proceed.

For spec gaps (not implementation bugs):
- Route to spec owner via SendMessage:
  - Missing requirement → PM
  - UX gap → Designer
  - Technical constraint → Architect

Report format:
- Wave {N} QA Result: PASS / PASS WITH FINDINGS / FAIL
- Blocking findings (if any): description, file, suggested fix
- Non-blocking findings (if any): description, severity
- Spec gaps routed (if any): description, routed to whom
```

## Edge Cases

- **Single ticket** — Skip TeamCreate. Spawn one dev agent + one QA agent directly. No wave machinery.
- **Dev agent fails** — Mark task as blocked in TaskCreate. Continue wave with remaining tickets. Report failure in summary. User can re-run `/supabuilder:develop` to retry failed tickets.
- **QA finds blocking issue** — Spawn fix-dev agent (general-purpose, worktree) with the specific finding. Re-run QA on the fix. If fix fails twice, pause and ask user.
- **User cancels mid-build** — Worktrees are preserved. State records progress (completed_waves, current_wave). Can resume by re-running `/supabuilder:develop {feature-name}` — it picks up from the current wave.
- **No wave assignments in tickets** — Auto-group by dependency: no deps = Wave 1, depends on Wave 1 = Wave 2, etc. Present plan to user before starting.
- **Linear configured** — Update ticket status: "In Progress" when dev starts, "Done" when QA passes. Use `mcp__linear__update_issue`.
- **Resuming a partial build** — Read `build_state` from state file. Skip completed waves. Resume from `current_wave`.

## Reference

Read `skills/_shared/orchestrator-context.md` for:
- Dev Swarm Protocol details
- Agent spawn protocol
- State machine logic
- Cost mode rules (dev builder agents follow same cost mode as Dev/QA)

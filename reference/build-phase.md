# Build Phase — Reference

Read this when the mission enters `build` phase (after TechPM creates tickets).

---

## Core Principle

The orchestrator does NOT write code. It stays a coordinator. Implementation is done by spawning `general-purpose` agents (Claude Code's native capability) — one per ticket or small batch of related tickets. The orchestrator manages the wave flow, enforces QA checkpoints, and routes findings. Its context stays lean.

---

## Build Loop (per wave)

```
For each wave in TechPM's wave plan:
  1. Read wave tickets from tickets.md (or Linear)
  2. For each ticket (or small batch of related tickets) in the wave:
     a. Prepare a dev context packet (see below)
     b. Spawn a general-purpose agent via Task tool
     c. Agent reads specs, writes code, runs tests, returns results
     d. Read the agent's result summary
     e. If the agent hit a spec gap → route to owning agent (PM/Architect/Designer)
     f. Mark ticket done in tickets.md (and Linear if configured)
  3. After wave completes → evaluate checkpoint (see Wave Checkpoint Protocol)
```

---

## Dev Context Packet

What each `general-purpose` agent receives when spawned for a ticket:

| Component | Content |
|-----------|---------|
| **Ticket** | Description from `tickets.md` — what to build, definition of done |
| **Spec paths** | File paths to read: `architecture.md` §section, `requirements.md`, prototype |
| **Code patterns** | `code-wiki/patterns.md`, `rules/coding-conventions.md`, `rules/tech-stack.md` |
| **Module paths** | Relevant directories in the codebase |
| **Instruction** | "Implement this ticket. Follow existing codebase patterns. Run tests. If you hit ambiguity in the spec, report it — don't guess." |

---

## Wave Checkpoint Protocol

TechPM's `tickets.md` includes a wave plan with checkpoint annotations. Each wave boundary is one of:

| Checkpoint type | What happens |
|----------------|-------------|
| `qa` | Orchestrator spawns QA agent in `build` mood to verify the wave |
| `user-test` | Orchestrator pauses for manual testing |
| `none` | Proceed to next wave |

### At a `qa` checkpoint:

1. Spawn QA agent with context packet pointing to the wave's tickets, spec files, and what was built
2. QA produces findings
3. Route findings through TechPM to owning agents if spec gaps are found
4. Fixes applied
5. QA re-verifies

### At a `user-test` checkpoint:

1. Orchestrator pauses: "Wave {N} complete. Here's what was built: {summary}. TechPM flagged this for manual testing."
2. AskUserQuestion: "Looks good, continue" / "Found issues" / "Need more time"

---

## Context Management — Orchestrator Stays Lean

- The orchestrator NEVER holds implementation code in context
- It reads ticket descriptions and agent result summaries only
- Each dev agent is self-contained — reads specs and code, implements, returns
- After each wave, update mission.json progress
- If implementation reveals patterns worth documenting → update code-wiki (orchestrator does this read-then-write, not the dev agent)

---

## Spec Gap Protocol

When a dev agent reports a spec gap:

1. The orchestrator does NOT attempt to resolve it
2. Route to the owning agent: PM for requirements, Architect for technical decisions, Designer for UX
3. Block the affected ticket(s) until the gap is resolved
4. Other non-blocked tickets in the wave can continue

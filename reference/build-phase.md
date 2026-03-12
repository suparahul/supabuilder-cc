# Build Phase — Reference

Read this when the mission enters `building` phase (after TechPM creates tickets).

---

## Core Principle

The orchestrator does NOT write code. It stays a coordinator. Implementation is done by spawning `general-purpose` agents — one per ticket. The orchestrator manages sequential execution, enforces checkpoints, and routes findings. Its context stays lean.

---

## Vertical Slice Principle

Tickets are structured around **functional requirements**, not technical layers.

**Wrong (horizontal):**
1. Set up database schema for auth
2. Build auth API endpoints
3. Create auth frontend components
4. Wire up auth flows

**Right (vertical):**
1. Foundation: shared schema, base config, common components needed across requirements
2. FR-1: Email/password registration (backend + frontend + wiring)
3. FR-2: Login flow (backend + frontend + wiring)
4. FR-3: OAuth — Google (backend + frontend + wiring)
5. FR-4: Password reset (backend + frontend + wiring)

Each functional requirement ticket is independently testable.

### Foundation (Wave 0)
Not every mission needs a foundation wave. It exists when there's genuinely shared work that multiple functional requirements depend on — database schemas, shared UI components, configuration. Architect identifies this in the development plan.

### Who Does What
- **Architect**: structures the development plan as vertical slices. Identifies foundation work. Orders requirements by dependency.
- **TechPM**: creates tickets from Architect's plan. Groups 1-3 related functional requirements into checkpoint batches. Annotates checkpoints.

---

## Build Execution — Sequential Default

```
For each task in TechPM's ticket sequence:
  1. Prepare dev context packet
  2. Spawn general-purpose agent for the task
  3. Agent reads specs, writes code, runs tests, returns results
  4. Read agent's result summary
  5. If spec gap → route to owning agent (PM/Architect/Designer)
  6. Mark ticket done
  7. If checkpoint reached → run checkpoint protocol
  8. Next task
```

One task at a time. No parallel agents unless user explicitly requests it.

---

## Dev Context Packet

What each `general-purpose` agent receives when spawned for a ticket:

| Component | Content |
|-----------|---------|
| **Ticket** | Description — what to build, which functional requirement, definition of done |
| **Spec paths** | File paths: architecture.md §section, requirements.md §requirement, prototype path(s) — prototypes include state controls showing all visual states |
| **Code patterns** | code-wiki/patterns.md, rules/coding-conventions.md, rules/tech-stack.md |
| **Module paths** | Relevant directories in the codebase |
| **Instruction** | "Implement this ticket. Follow existing codebase patterns. Run tests. If you hit ambiguity in the spec, report it — don't guess." |

---

## Checkpoint Protocol

Checkpoints implement **G2: Wave Gate** — see gates.md for full criteria.

Checkpoints happen after every 1-3 related functional requirements (TechPM decides grouping).

### At a checkpoint:

1. **QA agent** spawned with context: which functional requirements were just built, spec files, acceptance criteria
2. QA tests against acceptance criteria and checks code
3. **User review** — orchestrator presents what was built, asks user to test
4. If findings → route to owning agent or fix directly
5. Continue to next batch

### Checkpoint types (TechPM annotates):

| Type | What happens |
|------|-------------|
| `qa+user` | QA agent runs, then user reviews (default) |
| `qa` | QA agent only — for lower-risk requirements |
| `user` | User review only — for UX-heavy requirements |

---

## Spec Gap Protocol

When a dev agent reports a spec gap:
1. Orchestrator does NOT resolve it
2. Route to owning agent: PM for requirements, Architect for technical decisions, Designer for UX
3. Block affected task(s) until resolved
4. Other non-blocked tasks can continue (if running parallel)

---

## Context Management — Orchestrator Stays Lean

- The orchestrator NEVER holds implementation code in context
- Reads ticket descriptions and agent result summaries only
- Each dev agent is self-contained
- After each checkpoint, update mission.json progress
- If implementation reveals patterns worth documenting → update code-wiki

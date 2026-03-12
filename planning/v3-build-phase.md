# V3 Build Phase — Working Doc

## Key Changes from v2

| Aspect | v2 | v3 |
|--------|----|----|
| Ticket structure | Horizontal/technical slices (schema, API, frontend) | Vertical slices aligned with functional requirements |
| Execution | Wave-based, batch processing | Sequential, one task at a time |
| Parallelism | Orchestrator decides per wave | Sequential default. Parallel only if user explicitly asks. |
| Checkpoints | Per wave boundary | After every 1-3 related functional requirements |
| Testing | QA per wave | QA at checkpoints (not per task) |
| Ticket ownership | Architect creates development plan | Architect structures vertical plan, TechPM creates tickets from it |

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

Each functional requirement ticket is independently testable — you can verify "registration works" without waiting for login to be built.

### Foundation (Wave 0)
Not every mission needs a foundation wave. It exists when there's genuinely shared work that multiple functional requirements depend on — database schemas, shared UI components, configuration. Architect identifies this in the development plan.

### Who Does What
- **Architect**: structures the development plan as vertical slices. Identifies foundation work. Orders requirements by dependency (FR-2 login depends on FR-1 registration having the user model).
- **TechPM**: creates tickets from Architect's plan. Groups 1-3 related functional requirements into checkpoint batches. Annotates checkpoints.

---

## Build Execution

### Sequential Default

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

### Dev Context Packet (unchanged from v2)

| Component | Content |
|-----------|---------|
| **Ticket** | Description — what to build, which functional requirement, definition of done |
| **Spec paths** | File paths: architecture.md §section, requirements.md §requirement, prototype |
| **Code patterns** | code-wiki/patterns.md, rules/coding-conventions.md, rules/tech-stack.md |
| **Module paths** | Relevant directories in the codebase |
| **Instruction** | "Implement this ticket. Follow existing codebase patterns. Run tests. If you hit ambiguity in the spec, report it — don't guess." |

---

## Checkpoint Protocol

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

## Spec Gap Protocol (unchanged from v2)

When a dev agent reports a spec gap:
1. Orchestrator does NOT resolve it
2. Route to owning agent: PM for requirements, Architect for technical decisions, Designer for UX
3. Block affected task(s) until resolved
4. Other non-blocked tasks can continue (if running parallel)

---

## Context Management (unchanged from v2)

- Orchestrator NEVER holds implementation code in context
- Reads ticket descriptions and agent result summaries only
- Each dev agent is self-contained
- After each checkpoint, update mission.json progress
- If implementation reveals patterns worth documenting → update code-wiki

---

## Impact on Agent Files

### Architect
Add to Architect's .md: "Structure your development plan as **vertical slices** aligned with functional requirements. Each requirement = backend + frontend + wiring, independently testable. Identify foundation work (Wave 0) only when genuinely shared across multiple requirements. Order by dependency."

### TechPM
Add to TechPM's .md: "Create tickets from Architect's vertical development plan. Group 1-3 related functional requirements into checkpoint batches. Annotate each checkpoint type (qa+user, qa, user). Execution is sequential by default — do not create parallel work streams unless user explicitly requests it."

---

## Open Questions

None currently.

# Gates & Quality — Reference

Read this when evaluating quality gates. 4 gates total (G0-G3).

---

## G0: Plan Gate

**STRUCTURAL — enforced by Claude Code plan mode**

Every agent spawns in `mode: "plan"`. Before executing any work:

- Agent has explored context and relevant files
- Agent has asked clarifying questions (if any) via AskUserQuestion
- Agent has written a plan: understanding, approach, planned diagrams, deliverables
- Plan includes at least one `[REVIEW]` checkpoint — a labeled pause point where the agent will present work-in-progress (diagrams, findings, drafts) and get user feedback before continuing. This prevents agents from rushing through moods without discussion.
- User has approved the plan via ExitPlanMode

**Structurally enforced** — the agent cannot call Edit, Write, or Bash (non-read-only) until plan mode exits.

The plan IS the discuss phase output. By the time the user approves, they've aligned with the agent on scope, approach, and expected outputs.

---

## G1: Pipeline Gate

**Before spawning the next agent in the pipeline**

Orchestrator performs a lightweight review:

- Upstream agent produced its expected output (structured summary exists)
- Deliverables listed in the approved plan were produced
- No unresolved flags that block downstream work
- If Architect pull-in was flagged → Architect has been spawned and responded

**User review required.** After the orchestrator's checks pass, present the agent's deliverables (file paths + brief descriptions) to the user. The user must confirm before the next agent is spawned. This is the user's chance to catch issues before they propagate downstream.

**This is NOT a deep content audit.** Orchestrator reads the structured summary, checks flags, verifies deliverables exist. If checks fail, re-engage upstream agent or ask user for clarification.

---

## G2: Wave Gate

**Between build checkpoint batches (after every 1-3 functional requirements)**

- Current batch tickets implemented and passing
- If TechPM marked as `qa+user` or `qa` checkpoint: QA has run and critical/major findings resolved
- If TechPM marked as `user` or `qa+user` checkpoint: user has tested and confirmed
- mission.json progress updated

**If QA finds issues:** Route through TechPM to owning agent. Fix before proceeding. Minor findings can be tracked as follow-up tickets without blocking.

---

## G3: Complete Gate

**NON-NEGOTIABLE — before marking mission as done**

- product-wiki/ updated with product changes from this mission
- code-wiki/ updated with technical changes from this mission
- Both wiki updates include History section entries linking to this mission
- All deliverables done or explicitly skipped with reason

**This gate cannot be skipped, compressed, or deferred.** A mission is not done until wikis reflect its output.

---

## Cross-Domain Boundary Enforcement

Watch for boundary violations in agent output:

- **Architect overriding Designer's layout** → reject and re-scope
- **PM making technical decisions** → flag and route to Architect
- **Designer specifying implementation details** → flag and route to Architect
- **Any agent resolving a cross-domain concern instead of flagging it** → reject, enforce "flag, don't fix"

When a violation is detected:

1. Identify the violation specifically
2. Strip the overstepping content from the output
3. Re-engage the correct agent to handle the concern


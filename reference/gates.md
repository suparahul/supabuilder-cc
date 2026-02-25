# Gates & Quality — Reference

Read this when evaluating quality gates before transitions. Gates are LLM-enforced through this spec — the orchestrator reads these and checks conditions before proceeding.

---

## Gate 0: Entry Gate (Plan Mode)

**STRUCTURAL — enforced by Claude Code plan mode, not by instructions**

Every agent spawns in `mode: "plan"`. Before executing any work:

- [ ] Agent has explored context and relevant files
- [ ] Agent has asked clarifying questions (if any) via AskUserQuestion
- [ ] Agent has written a plan covering: understanding, approach, planned diagrams, deliverables
- [ ] User has approved the plan via ExitPlanMode

**This gate is structurally enforced** — the agent cannot call Edit, Write, or Bash
(non-read-only) until plan mode exits. No instruction-level workaround is possible.

The plan IS the discuss phase output. By the time the user approves, they've aligned with
the agent on scope, approach, and expected outputs.

**Review checkpoints:** The agent's plan must include at least one `[REVIEW]` step where it
will pause mid-execution, present work, and get user confirmation via AskUserQuestion before
continuing. Orchestrator should reject plans with zero review checkpoints.

---

## Gate 1: Write Gate

**CRITICAL — prevents "agents rush to write"**

Before any agent enters **write** mood, check:

- [ ] Has the agent been through **discuss** mood (or discuss was explicitly compressed/skipped)?
- [ ] Has the user seen and responded to at least one visual artifact from this agent?
- [ ] Has the user confirmed the direction (via AskUserQuestion or explicit approval)?
- [ ] If explore mood ran: has the user chosen from the presented options?

**If any check fails:** Do NOT advance to write. Loop the agent back to discuss or explore.

---

## Gate 2: Agent Gate

Before spawning the **next agent** in the pipeline, check:

- [ ] Has the upstream agent produced its expected output (structured summary)?
- [ ] Does the upstream output cover what the downstream agent needs as input?
- [ ] Are there any open flags from the upstream agent needing resolution?

**If checks fail:** Re-engage upstream agent or ask user for clarification.

**Example:** PM flags "unsure if real-time sync is feasible" → resolve this (spawn Architect for quick feasibility check) before spawning Designer.

---

## Gate 3: Build Gate (Spec Consistency)

**CRITICAL — prevents boundary violations**

Before **TechPM** creates implementation tickets, ensure:

- [ ] PM requirements, Designer prototype, and Architect specs are aligned
- [ ] No contradictions between specs
- [ ] All cross-agent flags have been resolved
- [ ] User has seen and approved the final spec set

This gate is owned by **TechPM** (spec consistency check is part of TechPM's identity). The orchestrator triggers it — TechPM executes it.

**If inconsistencies found:** TechPM flags specific conflicts. Route each to owning agent. Tickets NOT created until all resolved.

---

## Gate 4: Complete Gate

**NON-NEGOTIABLE — ensures wikis stay current**

Before marking a mission as `done`, check:

- [ ] product-wiki/ updated with product changes from this mission
- [ ] code-wiki/ updated with technical changes from this mission
- [ ] Both wiki updates include History section entries linking to this mission
- [ ] mission.json progress shows all deliverables as `done` or explicitly `skipped` with reason

**This gate cannot be skipped, compressed, or deferred.** A mission is not done until wikis reflect its output.

---

## Gate 5: Mood Gate

Before advancing from one mood to the next within an agent's cycle:

- [ ] Has the current mood's exit condition been met?
- [ ] Has the agent produced its expected output for this mood?

Lightest gate — quick check that the mood completed. For compressed moods, exit conditions are proportionally lighter.

---

## Gate 6: Wave Gate

Before starting the **next wave** in the build phase, check:

- [ ] All tickets in the current wave are implemented and passing
- [ ] If TechPM marked this wave boundary as a QA checkpoint: QA has run and all critical/major findings are resolved
- [ ] If TechPM marked this as a user-test checkpoint: user has tested and confirmed (or findings are routed)
- [ ] mission.json progress is updated for completed tickets

**If QA finds issues:** Route through TechPM to owning agent. Fix before proceeding. Minor findings can be tracked as follow-up tickets without blocking the next wave.

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
4. If the concern is legitimate, facilitate resolution through the correct agent

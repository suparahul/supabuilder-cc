# V3 System Audit

## Scorecard Against Stated Objectives

### 1. More Deterministic, Less Orchestrator Judgment

**Grade: Strong improvement, with gaps**

**What works well:**
- Fixed pipelines per mission group — orchestrator follows a lookup table, not reasoning. Single biggest determinism win.
- Context packet is "state + artifacts + pointers, zero directives" — removes orchestrator's ability to micromanage.
- 5 explicit "DOES NOT DO" rules in CLAUDE.md template and coordination.md.
- 4-gate system (down from 7) with clear triggers and owners.
- G0 structurally enforced by Claude Code's plan mode — can't be bypassed.
- G3 NON-NEGOTIABLE with explicit language.

**Gaps:**

1. **G1 (Pipeline Gate) underspecified for failure recovery.** Says "re-engage upstream agent" but never defines what that re-spawn looks like. Most likely place orchestrator will improvise.

2. **Refinement phase is a judgment free-for-all.** "Can re-engage any agent or make direct changes" — no criteria for which path. Scope deviation detection is good but the decision between "spawn Designer" vs "fix directly" is pure orchestrator judgment.

3. **Quick Fix assessment has no criteria.** PM assesses "needs full mission? yes/no" with no signals or heuristics.

4. **"When defined" trigger for user types in context packet** — not explicitly stated where/how orchestrator checks this.

### 2. Give Liberty to Agents

**Grade: Excellent**

Strongest dimension of the revamp.

- Agents self-manage mood depth.
- Per-mood planning with user approval at transitions.
- Self-contained agent files (~115-145 lines), identity first, execution last.
- "Personality = traits, not instructions" — clean separation.
- Agents can skip research/explore for Enhancement/Quick Fix (must explain why).
- Plan IS the contract.

**One tension:** Liberty is real during plan mode, but orchestrator still controls context assembly. Agent quality depends heavily on context packet quality — and that assembly is loosely specified.

### 3. Slow Down for Healthy Discussions

**Grade: Strong structural enforcement**

- 4 mandatory moods with explicit pause-and-present at each transition.
- "Do not rush. Every mood is a conversation, not a task." — in every agent file.
- Plan mode (G0) forces discuss phase to be a conversation.
- Diagrams as discussion artifacts — present and discuss BEFORE writing specs.

**Concerns:**

1. **No stopping criterion for discuss phase.** "Ask relentlessly" — when is enough? No minimum question count or dimension coverage.

2. **QA at checkpoints still goes through 4 moods.** For `qa`-only checkpoints, full discuss mood with AskUserQuestion seems heavyweight. Checkpoint type should modulate QA depth but no guidance exists.

3. **User control levels not in agent context packet.** Planning docs say agents adjust discuss depth by control level, but coordination.md context packet table doesn't list it.

### 4. World-Class Product and Tech Work Quality

**Grade: Strong foundations, some gaps**

**What works well:**
- PM's closed-loop thinking and hidden requirements checklist.
- Architect's vertical slice enforcement with explicit examples.
- Designer's journey-first thinking + closed loops at UX level.
- QA's "spec as baseline, not ceiling" + root cause discipline.
- TechPM's spec consistency check as first task.
- Cross-domain boundary enforcement ("flag, don't fix").
- User types propagated through the whole chain.

**Gaps:**

1. **No competitive quality benchmark** during specifying/building phases.
2. **Designer cross-writing PM files has no change control.** "Enrich" vs "flag, don't fix" tension.
3. **Architect early pull-in has fragile output model.** If Architect says "infeasible," original agent's output may be wrong — no recovery path for invalidated upstream assumptions.

---

## Structural Issues

### A. Vestigial V2 Concepts — Debate Visibility
`user-interaction.md` and settings skill describe "debate rounds" (up to 5/3/1) but agents don't debate in v3. Each runs independently. Mechanism doesn't exist. Should be removed or repurposed.

### B. Memory.md Timing Contradiction
- `init-scaffold.md` stub: "Updated at mission completion only"
- `reference/state.md`: "don't wait until mission completion for important decisions"
- `CLAUDE.md template`: "Add when a decision or outcome matters beyond this mission"

Three different rules will produce different behavior.

### C. Linear Reference Stale Field Name
`reference/linear.md` references `tracker` field, but v3 renamed to `ticket_tracker`.

### D. Phase/Status Transition Ambiguity
`finishing` as phase vs `done` as status — transition requires advancing both fields but instructions describe them separately.

### E. [REVIEW] Checkpoint Missing from Agent Files
Planning docs and coordination reference mention agents must include `[REVIEW]` checkpoints in plans. Actual agent files don't mention `[REVIEW]`. Enforcement mechanism didn't make it into implementation.

---

## What's Missing (Potential Additions)

1. **No agent-to-agent direct communication.** Cross-domain insights only flow through orchestrator summary relay.

2. **No explicit user types validation during wave scan.** Init asks about user types and cross-cutting pass writes them, but no wave scan step validates detected auth/permissions against user input.

3. **No rollback or undo model.** If user rejects agent output, only path is "re-engage upstream agent" — but re-engagement context is undefined.

---

## Recommendations

### Fixed (Structural) ✓
1. ✓ Resolved memory.md — two-section model: "Product Decisions" (add as they happen) + "Completed Missions" (at completion). Aligned init-scaffold.md, state.md, and CLAUDE.md template.
2. ✓ Added `[REVIEW]` checkpoint requirement to all 6 agent files + enriched G0 description in gates.md.
3. ✓ Removed debate visibility — from user-interaction.md, state.md schema, settings skill, status skill. Vestigial v2 concept with no v3 mechanism.
4. ✓ Fixed linear.md — `tracker` → `ticket_tracker`, removed stale `tracker.parent_ticket` reference.
5. ✓ Clarified phase/status transition in state.md — explicit completion transition section (G3 passes → status: done → move to past_missions).

### Fix Later (Edge Cases & Recovery)
1. Define G1 failure recovery path (re-spawn protocol)
2. Add recovery path for Architect pull-in invalidations
3. Add user control level to context packet table
4. Define QA depth modulation by checkpoint type
5. Add criteria for Quick Fix assessment
6. Define refinement phase decision criteria (spawn agent vs fix directly)
7. Add user types validation step to wave scan
8. Define agent re-engagement context for rejected output

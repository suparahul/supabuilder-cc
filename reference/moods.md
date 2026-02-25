# Mood Engine — Reference

Read this when managing mood transitions, deciding depth, or handling mood-related edge cases.

---

## The Five Moods

Every agent cycles through the same five moods. What each mood MEANS is colored by the agent's identity.

```
discuss → research → explore → write → build
```

| Mood | Purpose | Typical output |
|------|---------|---------------|
| **discuss** | Align with user on scope, intent, constraints | Confirmed understanding, scoped intent |
| **research** | Gather information — codebase, web, domain | Findings, patterns, options surfaced |
| **explore** | Generate options — divergent thinking | 2-3 approaches with tradeoffs, user picks |
| **write** | Produce formal documents | Spec files the agent owns |
| **build** | Execute — produce final output | Code, test results, review findings, tickets |

---

## Plan/Execute Mode (Internal to Agent)

Within each mood, agents operate in a natural plan → execute cycle:

- **Plan:** Create a visual artifact (diagram, prototype, flow). Present to user.
- **Execute:** Produce the actual output for that mood.

This is managed by the agent, not the orchestrator. The plan/execute cycle is baked into agent identity, not enforced externally.

---

## Mood Depth

Not every mission needs every mood at full depth.

**Depth levels:**
- **Full** — complete plan → execute cycle. Visual artifact, user discussion, then output.
- **Compressed** — lighter version. Quick alignment, minimal exploration, fast output.
- **Skipped** — mood not needed. Don't spawn the agent for this mood.

**Guidelines by mission type:**

| Type | discuss | research | explore | write | build |
|------|---------|----------|---------|-------|-------|
| `new-product` | Full | Full | Full | Full | Full |
| `new-module` | Full | Full | Full | Full | Full |
| `new-feature` | Full | Full/compressed | Full | Full | Full |
| `enhancement` | Full/compressed | Compressed | Compressed/skipped | Full | Full |
| `revamp` | Full | Full (expanded) | Full | Full | Full |
| `quick-fix` | Compressed | Skipped | Skipped | Skipped | Full |
| `integrate` | Full | Full (expanded) | Full | Full | Full |
| `migrate` | Full | Full (expanded) | Full | Full | Full |
| `scale` | Full | Full (expanded) | Full | Compressed | Full |
| `pivot` | Full | Full | Full (expanded) | Full | Full |

These are guidelines. The orchestrator reasons about actual context:
- User is crystal clear → compress discuss
- Domain is well-understood → compress or skip research
- Only one viable approach → skip explore
- Findings surface mid-build → loop back to earlier mood

---

## Mood Transitions

**Advance:** Current mood's exit conditions met. Agent produced output. User is aligned.

**Compress:** Full cycle isn't needed. Instruct agent to do lighter version.

**Skip:** Mood is unnecessary for this mission/context.

**Loop back:** Later mood reveals earlier work needs revision. Re-engage relevant agent in the appropriate mood with the finding as context.

**Example loop:** QA in build mood finds ambiguous requirement → re-engage PM in write mood with specific finding → PM revises → re-engage QA to verify.

---

## Announcing Transitions

Announce mood transitions proportional to user control level:

- **hands-on:** Announce every transition, present every gate evaluation
- **guided:** Announce agent handoffs, summarize mood transitions
- **autonomous:** Announce mission start and expected pipeline only

For routine transitions within a single agent's mood cycle, the agent communicates directly with the user.

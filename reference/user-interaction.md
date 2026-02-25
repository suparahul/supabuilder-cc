# User Interaction — Reference

Read this when calibrating user interaction level, managing transparency, or handling AskUserQuestion decisions.

---

## User Control Level

Setting in `state.json` controlling how much the user sees and approves.

| Level | What the user sees | Best for |
|-------|-------------------|----------|
| **hands-on** | Every sub-step gets discussion. Every diagram, every mood transition, every agent handoff. Maximum checkpoints. | New product, unfamiliar domain, full control |
| **guided** | Major transitions get discussion. Key decisions and agent handoffs visible, not every intermediate artifact. | Standard feature work, user trusts the process |
| **autonomous** | Orchestrator runs the pipeline. User sees final output for approval. Minimal checkpoints — only when genuinely needed. | Quick-fix, well-understood domain, user is busy |

**Default:** `hands-on` — new users experience the full process first.

**Changeable mid-mission:** User says "go autonomous" or "I want to see everything" — adjust immediately.

**Gates always run** regardless of control level. Control affects what the orchestrator shows, not whether it checks quality.

---

## Transparency Protocol

### At hands-on:
- Announce every mood transition ("PM is moving from discuss to explore")
- Announce every agent handoff ("PM confirmed scope. Bringing in Designer.")
- Present every gate evaluation ("Before writing specs, confirming you've approved the direction")
- Show agent lineup at mission start

### At guided:
- Announce agent handoffs ("Designer is done. Bringing in Architect.")
- Present key decisions needing user input
- Announce loop-backs ("QA found a gap. Bringing PM back.")
- Summarize mood transitions without every step

### At autonomous:
- Announce mission start and expected pipeline
- Surface only when genuine user input is needed
- Present final output for approval
- Announce issues or loop-backs affecting timeline

---

## AskUserQuestion Protocol

Primary tool for user interaction at decision points.

**Use structured options (AskUserQuestion) when:**
- Mission type classification (when ambiguous)
- Direction choices (which of 2-3 options)
- Gate confirmations (at hands-on level)
- Scope decisions (in/out/deferred)
- Any decision where options are known and bounded

**Use conversation (free text) when:**
- Initial brainstorming (user thinking out loud)
- Follow-up clarification (refining after a choice)
- Complex tradeoffs that don't reduce to simple options
- Emotional or subjective feedback ("this doesn't feel right")

Default to AskUserQuestion for decisions. Use free text for follow-ups.

---

## Cost Mode

Controls which models agents use:

| Mode | Agent models | Debate rounds |
|------|-------------|---------------|
| **quality** | Opus for all eligible agents | Up to 5 rounds |
| **smart** (default) | Opus for PM, Designer, Strategist, Architect. Sonnet for TechPM, QA. | Up to 3 rounds |
| **budget** | Sonnet for all except critical decisions | 1 round (no debate) |

---

## Debate Visibility

| Setting | What the user sees |
|---------|-------------------|
| **key_decisions** (default) | Agents reason privately. User sees 2-3 options at decision points. |
| **show_all** | All agent reasoning surfaced to user. |
| **summaries_only** | Final recommendation only. User approves or redirects. |

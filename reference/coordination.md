# Agent Coordination — Reference

Read this when spawning an agent, preparing context packets, or collecting agent output.

---

## The Core Constraint

Agents start fresh — no inherited conversation history. The spawn prompt IS the handoff. Everything the agent needs must be in the context packet or readable from files the packet points to.

---

## Context Packet

Every agent spawn includes a context packet. Pure **state + artifacts + pointers** — zero instructions about what to do, how deep to go, or what to produce.


| Component           | What it contains                                                                 | Always?              |
| ------------------- | -------------------------------------------------------------------------------- | -------------------- |
| **Agent identity**  | Agent's `.md` file (automatic via Claude Code)                                   | Yes                  |
| **Mission context** | Mission type, phase, decisions so far, which agents have run                     | Yes                  |
| **Upstream output** | Structured summaries from agents that already ran (markdown, not raw Excalidraw) | When upstream exists |
| **Wiki context**    | File paths to relevant wiki modules (agent reads on demand)                      | Yes                  |
| **User types**      | Summary of defined user types from product-wiki/overview.md (roles, permissions, journey differences) | When defined         |
| **Rules**           | Coding conventions from `rules/`                                                 | For technical agents |
| **Tool connectors** | Which MCP tools are available (Linear, etc.)                                     | When applicable      |
| **File paths**      | Explicit paths to specs, prototypes, code files                                  | When applicable      |

**Excluded:** full mission history (too many tokens), raw Excalidraw JSON (use structured summaries), the entire wiki (only relevant modules), previous user conversation (agents get distilled context).

**Designer-specific:** When spawning the Designer, include the path to `product-wiki/ui-kit/`. If populated, summarize its contents (framework source, token count). If empty, note that so the Designer knows to create it.

---

## What the Orchestrator Must NOT Do

- **Do NOT give task directives.** No "Your Task" heading. No "Produce X" or "Write Y". The agent's .md file defines what it owns and produces.
- **Do NOT set mood or depth.** Agents always start in discuss + plan mode and manage their own mood progression.
- **Do NOT define exit conditions.** The agent's approved plan is the contract.
- **Do NOT use mood names in mission context.** Use phase names: strategy, shaping, specifying, building.
- **Do NOT rush agents.** Do not compress their process, skip their moods, or nudge them to finish. Agents self-manage depth and know when their work is complete.

---

## Context Assembly

**Orchestrator summarizes upstream output.** Orchestrator reads upstream agent's output files and creates a concise summary for the downstream context packet. Controls what the next agent sees — keeps it token-efficient and relevant.

### Wiki Context — Two Modes

**Mode A: Orchestrator has wiki context loaded.** Summarize relevant portions inline with links to source files.

**Mode B: Orchestrator doesn't have wiki context.** Point the agent to module folders: "Read `product-wiki/modules/auth/README.md`."

Both modes include module name(s) so the agent knows which wiki folders are relevant.

---

## Spawn Protocol

1. **Prepare the context packet** — gather all components from the table above
2. **Set max turns** — safety net to prevent infinite loops
3. **Spawn via Task tool** — use the agent's name as `subagent_type`. **Always set `mode: "plan"`** (this enforces **G0: Plan Gate** — see gates.md).
4. **Plan phase covers discuss** — In plan mode, the agent reads context, interviews the user, writes a plan with [REVIEW] checkpoints. User approves → agent exits plan mode → executes the plan.
5. **Agents iterate freely in plan mode** — agents can loop with the user multiple times before plan approval. Discussion depth is agent-driven, not orchestrator-driven. The orchestrator does not intervene during plan mode.

---

## State Clerk (Background)

State updates use a special spawn pattern — **not** a full agent with plan mode. The orchestrator composes the complete state payload, then spawns a background Haiku agent to persist it to disk.

```
Agent tool:  subagent_type: "general-purpose", model: "haiku", run_in_background: true
```

No `mode: "plan"`. The clerk writes files exactly as instructed — no thinking, no decisions. See `reference/state.md` > Background State Clerk for the full payload format and inline-vs-clerk rules.

---

## Architect Pull-In

Any agent — at any phase, in any mission type — can request an Architect pull-in when a decision depends on technical feasibility. This is not an escalation; it's a normal part of shaping good product decisions.

**How it works:**

1. The requesting agent includes a specific feasibility question in their handoff flags (e.g., "Need Architect input: can we do real-time face replacement on mobile?")
2. The orchestrator spawns the Architect with the question as context — not a full pipeline run, just a targeted feasibility assessment
3. The Architect answers concisely: feasible / feasible-with-tradeoffs / not-feasible, with key constraints
4. The orchestrator routes the answer back to the requesting agent (or the next agent in the pipeline if the requester has already completed)

**When to pull in the Architect:**

- Strategy depends on what's technically possible (e.g., "Should we bet on real-time ML features?")
- Product shaping assumes a capability that hasn't been verified (e.g., "Users can swap faces live")
- Design direction requires knowing technical constraints (e.g., "Can we animate this at 60fps?")

The Architect's "Early pull-in" mode is designed for exactly this — short, focused, no full mood cycle.

---

## Tool Connectors

When spawning agents that use external tools:

1. Check `.mcp.json` for available MCP integrations
2. Tell the agent which connectors are available
3. Pass project/team context from state.json or mission.json `ticket_tracker` field
4. If no connector configured: tell the agent to write to local files instead

---

## Collecting Agent Output

This section implements **G1: Pipeline Gate** — see gates.md for full criteria.

After an agent completes, the orchestrator:

1. **Read the agent's handoff** — each agent's `.md` defines its handoff structure (decisions, deliverables, flags, downstream context)
2. **Curate `agent_handoff_notes`** in mission.json — add items from the Flags section, remove when resolved
3. **Present deliverables to user** — list each file path from the agent's handoff as a clickable reference. Briefly describe what each file contains. Ask the user to review before proceeding.
4. **Wait for user confirmation** — do not spawn the next agent until the user confirms the deliverables look good. If the user has feedback, re-engage the upstream agent.
5. **Summarize for downstream** — create a concise summary for the next agent's context packet (not raw output passthrough)
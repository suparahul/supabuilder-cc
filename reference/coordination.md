# Agent Coordination — Reference

Read this when spawning an agent, preparing context packets, or collecting agent output.

---

## The Core Constraint

Agents start fresh — no inherited conversation history. The spawn prompt IS the handoff. Everything the agent needs must be in the context packet or readable from files the packet points to.

---

## Context Packet

Every agent spawn includes a context packet with 8 components:

| Component | What it contains | Always included? |
|-----------|-----------------|------------------|
| **Agent identity** | The agent's `.md` file (loaded via Claude Code agent config) | Yes (automatic) |
| **Mission context** | Mission type, current phase (strategy/shaping/specifying/building), key decisions so far, what agents have already done. Describes state — NOT directives. Do NOT tell the agent what to produce or what mood to be in. | Yes |
| **Upstream summaries** | Structured markdown from agents that already ran — NOT raw Excalidraw JSON | When upstream agents have produced output |
| **Wiki context** | Summarized excerpts with file links OR file paths for agent to read on demand | Yes |
| **Rules** | Relevant coding conventions from `rules/` | For Architect, TechPM, QA |
| **Visual protocol** | Diagram-first directives: "Read `~/.claude/supabuilder/reference/visual-protocol.md` for diagram naming and enforcement rules." | Yes |
| **Operating instruction** | Fixed block (do not modify): "You are starting in discuss mood and plan mode. Interview the user relentlessly about every aspect of this work — walk down each branch of the thought tree, clarifying doubts and resolving dependencies one-by-one. Reach a shared understanding before producing anything." | Yes |
| **Specific file paths** | Explicit paths to read — specs, prototypes, code files | When applicable |

---

## Wiki Context — Two Modes

**Mode A: Orchestrator has wiki context loaded.** Summarize relevant portions inline with links to source files. Agent gets the gist, follows links for detail.

**Mode B: Orchestrator doesn't have wiki context.** Point the agent to relevant module folders: "Read `product-wiki/modules/auth/README.md` and `code-wiki/modules/auth/README.md`." Agent reads on demand.

Both modes include module name(s) so the agent knows which wiki folders are relevant.

---

## What's NOT in the Context Packet

- **Full mission history** — too many tokens. Only relevant decisions and current state.
- **Other agents' raw diagrams** — Excalidraw JSON is rendering metadata, not semantic content. Use structured summaries.
- **The entire wiki** — only relevant module(s) and root overviews.
- **Previous conversation with the user** — agents get the distilled context packet.

---

## What the Orchestrator Must NOT Do

- **Do NOT give task directives.** No "Your Task" heading. No "Produce X" or "Write Y". The agent's identity file defines what it owns and produces. The context packet provides what happened — the agent figures out what to do.
- **Do NOT set mood or depth.** The operating instruction is fixed. Agents always start in discuss + plan mode and manage their own mood progression.
- **Do NOT define exit conditions.** The agent's approved plan is the contract. The agent is done when it has delivered what the plan promised.
- **Do NOT use mood names in mission context.** Use phase names: strategy, shaping, specifying, building.

---

## Spawn Protocol

1. **Prepare the context packet** — gather all components from the table above
2. **Set max turns** — safety net to prevent infinite loops
3. **Spawn via Task tool** — use the agent's name as `subagent_type` (one of: `pm`, `designer`, `architect`, `strategist`, `techpm`, `qa`). **Always set `mode: "plan"`**. The operating instruction is already in the context packet — do not add extra directives.
4. **Plan phase covers discuss** — In plan mode, the agent:
   - Reads context, interviews the user (AskUserQuestion)
   - Writes a plan: understanding, approach, [REVIEW] checkpoints, deliverables
   - User approves → agent exits plan mode → executes the plan

---

## Tool Connectors

When spawning agents that use external tools (TechPM for tickets, future agents for docs), include connector context:

1. Check `.mcp.json` for available MCP integrations
2. Tell the agent which connectors are available: "Linear is configured — Read `~/.claude/supabuilder/reference/linear.md` for tool patterns."
3. Pass project/team context from state.json or mission.json `tracker` field
4. If no connector configured: tell the agent to write to local files instead

---

## Output Protocol

Every agent produces two artifacts:

1. **Excalidraw diagram** — for the user. Visual thinking, communication, alignment.
2. **Structured markdown summary** — for downstream agents. Token-efficient, explicit decisions and reasoning.

Plus any spec files the agent owns (requirements.md, architecture.md, etc.) when in write mood.

The orchestrator reads the structured summary to decide next steps. The user sees the diagram. The spec files are the formal record.

---

## What the Agent's Plan Should Include

When agents run in plan mode, their plan is the discuss + planning checkpoint. The plan should:

1. **Understanding** — what the agent understood from the context packet (in its own words, through its lens)
2. **Key questions** — anything ambiguous, surfaced via AskUserQuestion BEFORE the plan
3. **Proposed approach** — what the agent will do, in what order
4. **Diagrams** — which diagrams it will create (with names)
5. **Deliverables** — what files it will produce
6. **Open concerns** — anything it wants to flag for the user or other agents

The plan is a CONTRACT. After approval, the agent executes this plan. Deviating from the
approved plan (skipping diagrams, reordering steps, adding unplanned deliverables) is a violation.

### Review Checkpoints

Agents MUST mark steps in their plan where they will pause and present work to the user
before continuing. Mark these with `[REVIEW]`:

Example plan:
1. Research competitors — WebSearch for GameChanger, Hudl, Trace...
2. [REVIEW] Present research findings as a comparison diagram — pause for user discussion
3. Create strategic positioning diagram based on discussion
4. [REVIEW] Present positioning diagram — pause for user review
5. Write strategy brief incorporating confirmed positioning

At each [REVIEW] step, the agent:
- Creates the diagram or artifact
- Presents it to the user with a summary
- Uses AskUserQuestion to confirm direction or surface questions
- Only proceeds to the next step after user responds

Minimum one [REVIEW] checkpoint per agent spawn. The orchestrator should reject plans
that have no review checkpoints — it means the agent plans to blast through without pausing.

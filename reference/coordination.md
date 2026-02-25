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
| **Mission context** | Mission type, decisions so far, current mood, what's been done (from mission.json) | Yes |
| **Upstream summaries** | Structured markdown from agents that already ran — NOT raw Excalidraw JSON | When upstream agents have produced output |
| **Wiki context** | Summarized excerpts with file links OR file paths for agent to read on demand | Yes |
| **Rules** | Relevant coding conventions from `rules/` | For Architect, TechPM, QA |
| **Visual protocol** | Diagram-first directives: "Read `~/.claude/supabuilder/reference/visual-protocol.md` for diagram naming and enforcement rules." | Yes |
| **Mood instruction** | What mood, what's expected | Yes |
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

## Spawn Protocol

1. **Prepare the context packet** — gather all 8 components
2. **Define the mood instruction** — what mood, what's expected
3. **Define exit conditions** — what "done" looks like for this spawn
4. **Set max turns** — safety net to prevent infinite loops
5. **Spawn via Task tool** — use the agent's name as `subagent_type` (one of: `pm`, `designer`, `architect`, `strategist`, `techpm`, `qa`) and the context packet
   as prompt. **Always set `mode: "plan"`** — the agent must present its approach and get user
   approval before executing. These names match the agent identity files installed at `~/.claude/agents/`.
6. **Plan phase covers discuss mood** — In plan mode, the agent:
   - Reads context, explores relevant files
   - Uses AskUserQuestion to align with the user (this IS the discuss phase)
   - Writes a plan: what it understood, what it will produce, what diagrams it will create
   - Calls ExitPlanMode → user sees the plan and approves
   - Only then executes (creates diagrams, writes specs, etc.)

---

## Exit Conditions

| Mood | Done when... |
|------|-------------|
| **discuss** | Agent has presented understanding to user and gotten confirmation |
| **research** | Agent has gathered findings and presented them |
| **explore** | Agent has presented 2-3 options and user has chosen direction |
| **write** | Agent has written the spec file(s) it owns |
| **build** | Agent has produced its build output (code, test results, review findings) |

If output doesn't meet exit conditions, re-spawn with additional context or escalate to user.

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

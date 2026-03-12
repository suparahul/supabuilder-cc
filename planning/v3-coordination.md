# V3 Coordination & Agent Autonomy — Working Doc

## Problem Statement

The current orchestrator is overloaded with responsibilities:
1. **Pipeline management** — which agent next (this is correct, should stay)
2. **Mood depth management** — full/compressed/skipped per mission type per agent (this should go)
3. **Task/deliverable directives** — telling agents what to produce (this should go)
4. **Gate enforcement** — quality checks at transitions (needs rethinking)

The v3 principle: **Orchestrator moves the pipeline. Agents own their work.**

---

## V3 Orchestrator Role — "Pipeline Runner"

### What the Orchestrator DOES:
- **Knows the fixed pipeline** for the current mission type (from v3-lifecycle-changes.md)
- **Invokes the next agent** in the pipeline with a context packet
- **Shares context, not tasks** — the agent knows what it does from its own .md file
- **Checks agent gate** (Gate 2) — did the upstream agent produce what the downstream agent needs?
- **Updates state** — state.json and mission.json after each agent completes
- **Detects scope deviation** — during refinement, recommends new mission if scope drifts
- **Manages build phase** — direct Claude Code management, synchronous default

### What the Orchestrator DOES NOT DO:
- Set mood depth (full/compressed/skipped) — **agent decides**
- Give task directives ("Your task is to...", "Produce X") — **agent's .md defines its outputs**
- Define deliverables — **agent plans its own deliverables in discuss/plan phase**
- Manage mood transitions — **agent self-manages**
- Tell the agent what to explore or research — **agent decides based on context**

---

## V3 Context Packet (Simplified)

Every agent spawn includes:

| Component | What it contains | Always? |
|-----------|-----------------|---------|
| **Agent identity** | Agent's `.md` file (automatic via Claude Code) | Yes |
| **Mission context** | Mission type, phase, decisions so far, which agents have run | Yes |
| **Upstream output** | Structured summaries from agents that already ran (markdown, not raw Excalidraw) | When upstream exists |
| **Wiki context** | File paths to relevant wiki modules (agent reads on demand) | Yes |
| **Rules** | Coding conventions from `rules/` | For technical agents |
| **Tool connectors** | Which MCP tools are available (Linear, etc.) | When applicable |
| **File paths** | Explicit paths to specs, prototypes, code files | When applicable |

### Removed from context packet:
- ~~**Operating instruction**~~ — the fixed "start in discuss mood" block. This moves INTO each agent's .md file. The agent always knows how to start — it doesn't need the orchestrator to tell it.
- ~~**Visual protocol directive**~~ — moves into agent .md files. Each agent knows it's diagram-first.

### Key change: No directives, no mood instructions
The context packet is pure **state + artifacts + pointers**. Zero instructions about what to do, how deep to go, or what to produce.

---

## V3 Agent Autonomy — Self-Managed Mood Cycle

### The shift
Current: Orchestrator decides mood depth → tells agent → agent executes
V3: Agent reads context → agent decides what depth is needed → agent executes

### How agents self-manage moods (4 moods: discuss → research → explore → write)

Each agent's .md file gets enhanced with:

1. **Always start in discuss + plan mode** — interview the user, understand scope, surface questions. Write a plan with [REVIEW] checkpoints. User approves before execution.

2. **Research: agent decides depth** — based on what the agent learns in discuss:
   - Is this a well-understood domain? Maybe light research.
   - Is this greenfield? Deep research needed.
   - Quick fix mission? Agent can skip if scope is tiny.
   - Agent explains its research plan in the plan phase, user can push back.

3. **Explore: agent decides if needed** — based on discuss + research:
   - Multiple viable approaches? Explore 2-3 options.
   - Clear single path? Skip explore, explain why in plan.
   - Quick fix? Likely skip.

4. **Write: always happens** — the agent's core deliverables. Can be lighter for smaller scope.

### The plan as the contract
The plan phase (discuss mood + plan mode) is where this all comes together:
- Agent proposes WHAT it will research, WHAT it will explore, WHAT it will write
- Agent proposes [REVIEW] checkpoints
- User sees the plan and can say "you need more research here" or "skip the exploration, we know what we want"
- Once approved, the plan is the contract

This means the USER still has control — through the plan approval. But the ORCHESTRATOR doesn't need to micromanage.

---

## V3 Gate System (Proposed Final)

### V3 gates — 4 gates total (down from 7)

| Gate | Name | When | Who enforces | What it checks |
|------|------|------|-------------|----------------|
| **G0** | **Plan Gate** | Every agent spawn | Structural (Claude Code `mode: "plan"`) | Agent cannot write/execute until user approves plan. Plan must include [REVIEW] checkpoints. Unchanged from v2. |
| **G1** | **Pipeline Gate** | Before spawning next agent | Orchestrator | Upstream agent produced expected output (lightweight review of structured summary). Unresolved flags handled (Architect pull-in if flagged). No open blockers. |
| **G2** | **Wave Gate** | Between build waves | Orchestrator | Current wave tickets implemented and passing. QA checkpoint run if designated. User-test checkpoint if designated. mission.json updated. |
| **G3** | **Complete Gate** | Before mission marked done | Orchestrator | NON-NEGOTIABLE. product-wiki and code-wiki updated. All deliverables done or explicitly skipped with reason. |

### Eliminated gates:

| Old Gate | Why eliminated |
|----------|--------------|
| **Gate 1 (Write Gate)** | Absorbed into agent self-management. Each agent's .md file enforces: "Do not write specs until you've discussed with user, shown diagrams, and confirmed direction." The plan approval (G0) also covers this — user sees the agent's proposed sequence and can reject plans that rush to write. |
| **Gate 3 (Build/Spec Gate)** | Folded into TechPM's normal work. Spec consistency check is already TechPM's first task — making it a separate orchestrator-triggered gate adds unnecessary bureaucracy. TechPM's .md file is clear: check spec alignment before creating tickets. |
| **Gate 5 (Mood Gate)** | Eliminated entirely. The plan IS the mood gate — it defines what the agent will do in each mood. Agent self-manages transitions. If the agent skips a mood it said it would do, that's a plan violation visible to the user. |

### Key changes from v2:
1. **Renumbered** — clean G0-G3 sequence
2. **Fewer gates** — 4 instead of 7. Three gates absorbed into agent autonomy / agent instructions.
3. **Pipeline Gate is lightweight** — orchestrator reads structured summary, checks flags, verifies deliverables exist. Not a deep content audit.
4. **Spec consistency is TechPM's job** — not a separate gate. TechPM's .md file makes it the first thing it does.

---

## V3 Output Protocol

### What agents produce (unchanged):
1. **Diagrams** (Excalidraw) — for user communication and thinking
2. **Structured markdown summary** — for downstream agents
3. **Spec files** the agent owns (requirements.md, architecture.md, etc.)

### What changes:
- Agent decides WHAT diagrams to create based on scope (not told by orchestrator)
- Agent's plan lists planned diagrams — user can add/remove during plan approval
- Structured summary format stays the same (token-efficient for downstream context)

---

## V3 Agent .md File Changes

Each agent .md file absorbs what the orchestrator currently manages. This is done via the **Execution** section (with sub-sections), not as separate top-level sections.

See `planning/v3-agent-changes.md` for the standardized section structure and `planning/v3-agent-template-pm.md` for the full PM example.

### What moved into each agent's Execution section:

| Sub-section | What it covers | Replaces |
|-------------|---------------|----------|
| **Context** | Mission types, phases, pipeline position — agent knows where it sits | Orchestrator's operating instruction (mission context part) |
| **Mood Cycle** | 4 moods in sequence, per-mood planning with user pauses, skip rules for Enhancement/Quick Fix | Orchestrator's mood depth management + Self-Management Rules |
| **Diagrams** | /sketch for all diagrams, single file, discuss each via AskUserQuestion before writing specs | Visual-protocol reference file + Diagram-First Protocol |
| **Handoff** | Final message format: decisions, deliverables, flags, downstream context | New in v3 (was implicit before) |

### Key design decisions reflected in the template:
- **Identity first, execution last** — agent knows who it is (Role, Expertise, Personality, How You Think, Boundaries, Quality) before being told how to operate (Execution)
- **Per-mood planning** — agent plans each mood at the transition, not one big upfront plan. Plan mode (structural) covers discuss phase; AskUserQuestion pauses cover subsequent transitions.
- **Personality = traits only** — no instructions in Personality section
- **Self-contained** — no shared reference file. Everything the agent needs is in its .md file, under 200 lines.

---

## Resolved Decisions

| # | Decision | Resolution |
|---|----------|------------|
| 1 | Plan mode for all agents | **Always plan mode.** Every agent spawns in `mode: "plan"`. Consistency and user control — even QA on a quick fix discusses first. |
| 2 | Architect early pull-in mechanism | **Agent flags, orchestrator pulls in.** Agent pauses and flags the need. Orchestrator spawns Architect with the specific question. Original agent resumes after Architect responds. |
| 3 | Output validation | **Lightweight review.** Orchestrator reads the structured summary, checks for unresolved flags, verifies deliverables listed in the approved plan were produced. Not blind trust, but not deep audit either. |
| 4 | User control levels | **Passed to agents too.** Control level is included in the context packet. Agents adjust their discuss depth — hands-on = deep discussion, autonomous = lighter discuss. Orchestrator also adjusts its own announcement verbosity. |

| 5 | Context packet assembly | **Orchestrator summarizes.** Orchestrator reads upstream agent's output files and creates a concise summary for the downstream context packet. Orchestrator controls what the next agent sees — keeps it token-efficient and relevant. |
| 6 | Architect early pull-in mechanics | **Agent flags in output.** Agent completes its work with a flag: "Need Architect input on X before downstream proceeds." Orchestrator sees it at agent gate, spawns Architect with the specific question, then proceeds to next pipeline agent. Original agent doesn't resume — its output stands with the flag noted. |
| 7 | Refinement phase | **User-driven, orchestrator-assessed.** User asks for refinements after seeing the built product (not necessarily QA-related — specs may have been followed perfectly, but user needs change). Orchestrator assesses what the user wants and pulls in the correct agents. Orchestrator also detects scope deviation and recommends new mission if refinement drifts from original scope. |

| 8 | Agent flag format | **In structured summary.** Flags are a structured field within the agent's handoff summary (e.g., a JSON-like block at the top: `flags: [{type: "architect-needed", question: "Is real-time sync feasible?"}]`). Easy for orchestrator to parse during lightweight review. |
| 9 | Scope deviation in refinement | **Orchestrator recommends, user decides.** Orchestrator flags: "This refinement seems beyond original scope — recommend creating a new mission." User decides whether to continue within this mission or split into a new one. Never hard-blocked. |
| 10 | Gate system | **4 gates (G0-G3).** Plan Gate (structural), Pipeline Gate (orchestrator lightweight review), Wave Gate (build phase), Complete Gate (non-negotiable wiki update). Write Gate absorbed into agent self-management. Mood Gate eliminated (plan IS the gate). Spec Gate folded into TechPM's normal work. |
| 11 | Spec consistency check | **Part of TechPM's work, not a separate gate.** TechPM already does spec alignment as its first task. No need for orchestrator to trigger a separate gate — TechPM's .md file makes it mandatory. |
| 12 | Diagram-before-spec enforcement | **Strong instructions + plan as contract.** Agent operating protocol requires plan to separate diagram creation from spec writing with [REVIEW] checkpoint between them. User rejects plans that don't show this separation. After each diagram, agent presents via AskUserQuestion and waits for response. Behavioral enforcement with plan as visible, auditable contract. Two-phase spawning kept as escalation option if this fails in practice. |

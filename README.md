# Supabuilder

The layer between thinking and building.

Not a spec generator. Not a code assistant. A full product team — 7 specialized AI agents that think with you, push back, ask the questions you haven't thought of yet, and stay engaged through every stage of making a product real.

You talk. Supabuilder listens, structures, challenges, builds, reviews, tests, and iterates — until it's right.

## Install

```bash
npx supabuilder-cc@latest
```

Then in any project:

```bash
/supabuilder:init
/supabuilder:start
```

That's it. Start talking about what you want to build.

## Why This Exists

Most product development friction isn't coding. It's the thousands of decisions across product, design, architecture, and quality that most teams make slowly, inconsistently, or not at all.

One monolithic AI assistant trying to hold PM thinking, UX design, strategy, and architecture in its head simultaneously doesn't work. The thinking gets shallow. Edge cases slip. Nobody pushes back.

Supabuilder replaces that with a team where each role has deep expertise, strong opinions, clear ownership, and collaborative protocols — like a real product team that happens to work at the speed of thought.

## The Team

| Agent | What They Bring |
|-------|----------------|
| **PM** | The one who won't let you ship something vague. Surfaces edge cases you hadn't considered, writes requirements that leave no room for ambiguity, catches gaps before they become bugs. |
| **Designer** | The one who makes you experience your product before it's built. Creates 2-3 design variations with HTML prototypes you open in your browser. Fights for the user when everyone else is thinking about systems. |
| **Strategist** | The one who asks "should we build this at all?" Aligns features to vision, flags scope creep, kills ideas that don't serve the product — even when you're excited about them. |
| **Architect** | The one who makes sure it can actually be built — and won't collapse under its own weight. Designs data models, validates feasibility, pushes back on requirements that would create tech debt. |
| **TechPM** | The one who turns decisions into trackable work. Creates Linear tickets a developer can pick up without asking questions, coordinates dev waves. |
| **Dev** | Two modes: **Build** — parallel dev agents write code in wave-based sprints with incremental QA after each wave. **Review** — checks code against spec, enforces conventions, catches implementation drift before it compounds. |
| **QA** | The one who uses your product the way a real person would — and finds everything that breaks. Routes findings back to the right spec owner so the product evolves from real testing, not guesswork. |

### They Talk to Each Other

Agents have opinions and they use them. Key pairs:

- **PM + Designer** — Debate UX vs requirements tradeoffs. _"That flow is elegant but it doesn't handle the edge case where..."_
- **PM + Architect** — Feasibility checks. _"Can we build this without restructuring the data model?"_
- **Designer + Architect** — UI implementation constraints. _"This interaction would require a custom render — worth it?"_
- **Strategist + PM** — Vision alignment. _"This feature is interesting but it pulls us away from the core value prop."_
- **QA -> PM** — Gap routing. _"The spec doesn't say what happens when a user tries to X. Here's what broke."_
- **Dev -> Architect** — Implementation reality. _"The schema works on paper but this query pattern will be slow at scale."_

You control how much of their debate you see:

| Mode | What You See |
|------|-------------|
| `key_decisions` | Agents debate privately. You get 2-3 options at decision points. |
| `show_all` | All agent-to-agent messages visible. Jump in anytime. |
| `summaries_only` | Agents agree internally. You approve or redirect. |

## The Loop

This is what makes Supabuilder more than a planning tool. The team doesn't hand you a spec and walk away.

```
Think   →  You have an idea, a problem, a direction
Spec    →  PM, Designer, Architect shape it into something buildable
Build   →  Dev agents build in parallel waves (isolated worktrees)
  QA    →  Incremental QA after each wave — blocking issues fixed before next wave
Review  →  Dev reviews all code against spec and conventions
Test    →  QA tests full feature from a real user's perspective
Learn   →  Gaps surface. Assumptions break. New needs emerge.
Revise  →  PM updates specs. Designer adjusts flows. Back to Build.
          ↑_________________________________________________↩
```

Specs are living documents, not sign-off artifacts. When QA finds something the spec didn't cover, it routes back to PM. When Dev discovers a technical constraint during implementation, it routes to Architect. When real usage reveals a UX problem, it routes to Designer. The system is a loop, not a pipeline.

## How It Feels

You don't write structured commands. You think out loud.

```
You:  "I've been thinking about adding a way for people to share
       their progress with family members..."

→  Orchestrator detects product ideation
→  Asks structuring questions: "Who shares? What gets shared? Within app or external?"
→  Classifies scope, brings in PM
→  PM refines requirements, surfaces edge cases you missed
→  Designer creates 2-3 flow variations with HTML prototypes
→  You open them in your browser, pick a direction
→  Architect validates feasibility, flags data model implications
→  TechPM creates Linear tickets in prioritized waves
→  Dev swarm builds across parallel worktrees
→  Dev reviews implementation against spec
→  QA tests as a real user — finds a flow that breaks for edge case users
→  QA routes the gap back to PM
→  PM revises the spec
→  Designer adjusts the flow
→  The cycle continues until it's right
```

## Visual-First System

Supabuilder is diagramming-first. Every agent creates visual artifacts as a primary output — diagrams come before or alongside spec prose, not after.

- **PM** diagrams user journeys and feature scope trees before writing functional requirements
- **Designer** creates a separate flow diagram for each design variation — you compare visually before choosing
- **Architect** diagrams system architecture and data flow before writing the technical spec
- **Strategist** creates market positioning maps and feature priority quadrants during strategic review
- **TechPM** visualizes sprint waves and ticket dependencies before presenting the roadmap
- **Dev** references architecture diagrams during code review and creates visual diffs when proposing spec changes
- **QA** diagrams bug flows (expected vs actual) for Major and Critical findings

`/supabuilder:init` produces project overview diagrams — architecture, module relationships, and feature landscape — so anyone can visually understand the system from day one. Sprint kickoff (`/supabuilder:start`, `/supabuilder:sprint`) shows a visual plan before any agent starts working.

All diagrams are Excalidraw files inside the `supabuilder/` workspace — mission folders, wiki folders, or `supabuilder/diagrams/` for ad-hoc work. Open in VS Code or browser, co-edit, and agents read your changes.

- **HTML prototypes** in mission folders — open in your browser, compare design variations side by side
- **Inline comparisons** via AskUserQuestion — quick A/B decisions without leaving Claude Code

## Commands

| Command | What It Does |
|---------|-------------|
| `/supabuilder:init` | Scan your project — tech stack, structure, what's built. Creates context all agents share. |
| `/supabuilder:start` | Start talking about an idea. Orchestrator brings in the right agents progressively. |
| `/supabuilder:sprint <name>` | Full sprint — all 7 agents, end to end. Spec → Build → Review. |
| `/supabuilder:develop <name>` | Build from tickets — parallel dev waves with incremental QA after each wave. |
| `/supabuilder:review` | Bring in Dev + QA to review what's been built against the spec. |
| `/supabuilder:status` | Where things stand — active sprints, phases, blockers. |
| `/supabuilder:mode <mode>` | Cost mode and debate visibility. |
| `/sketch` | Excalidraw diagrams for visual thinking. |
| `/napkin` | Per-repo learning file — tracks mistakes, corrections, what works. |

## Work Classification

Not everything needs the full team. The orchestrator sizes work automatically:

| Size | What It Looks Like | Who Gets Involved |
|------|--------------------|-------------------|
| **Rock** | New module, major feature, cross-cutting changes | All 7 agents, full spec cycle |
| **Pebble** | Enhancement, new screen, contained scope | PM, Designer, Architect, TechPM |
| **Sand** | Bug fix, copy change, minor tweak | 1-2 agents, smart-routed |

## Works With Any Stack

Zero framework assumptions. Supabuilder discovers your project through `/supabuilder:init` and reads conventions from your project config. React, Flutter, Rails, Go, Python — it adapts to what you're building.

## Optional Integrations

During `/supabuilder:init`, you can optionally configure:
- **Linear** — Ticket tracking. TechPM creates and manages tickets via Linear MCP.
- **Reddit** — Community research. Strategist analyzes sentiment and validates ideas.

Both are optional. Everything works without them.

## Cost Modes

```bash
/supabuilder:mode quality    # All Opus, 5 debate rounds — deep thinking
/supabuilder:mode smart      # Opus for spec agents, Sonnet for Dev/QA — balanced
/supabuilder:mode budget     # Mostly Sonnet, 1 round — fast and cheap
```

## Uninstall

```bash
npx supabuilder-cc --uninstall
```

Cleanly removes all Supabuilder agents and skills from `~/.claude/`. Restores any files that existed before installation.

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- Node.js 14+

## License

MIT

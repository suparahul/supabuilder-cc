# Supabuilder

A product team in your terminal.

6 specialized AI agents — PM, Designer, Strategist, Architect, TechPM, QA — orchestrated
by an LLM-backed harness inside Claude Code. You think out loud. They structure, challenge,
design, and build.

## Install

```bash
npx supabuilder-cc@latest
```

Then in any project:
```
/supabuilder:init
```

## The Team

| Agent | Role |
|-------|------|
| **PM** | Requirements, edge cases, user flows. Won't let you ship something vague. |
| **Designer** | UX flows, HTML prototypes, visual variations. Fights for the user. |
| **Strategist** | Vision alignment, scope control. Asks "should we build this at all?" |
| **Architect** | System design, data models, feasibility. Makes sure it can be built. |
| **TechPM** | Tickets, coordination, delivery tracking. Turns decisions into work. |
| **QA** | Tests as a real user. Routes findings back to the right agent. |

No Dev agent — Claude Code handles development natively. The agents handle everything else.

## How It Works

**Missions, not sprints.** You describe what you want. The orchestrator classifies scope,
picks agents, and runs a mission through moods (debate → spec → build → review → complete).

**Init scans your codebase** — builds a product-wiki (what it does) and code-wiki
(how it's built) so every agent starts with shared context. Visual-first: diagrams
before prose at every step.

**Agents have opinions.** PM and Designer debate UX tradeoffs. Architect pushes back on
requirements that create tech debt. Strategist kills features that don't serve the vision.

## Visual-First

Every agent creates diagrams as primary output — Excalidraw canvases that evolve through
the mission. Diagrams come before prose, not after.

- Product overview diagrams during init
- Architecture diagrams for system design
- Flow diagrams for user journeys
- HTML prototypes for design variations

## Commands

| Command | What It Does |
|---------|-------------|
| `/supabuilder:init` | Scan codebase, build product-wiki + code-wiki, create workspace |
| `/supabuilder:mission` | Start a new mission explicitly |
| `/supabuilder:status` | Check current state — missions, phase, decisions |
| `/supabuilder:settings` | Configure cost mode, user control, debate visibility |
| `/sketch` | Excalidraw diagrams for visual thinking |
| `/napkin` | Per-repo mistake tracking |

## User Control

Configure how hands-on you want to be:

| Mode | You see |
|------|---------|
| **hands-on** | Approve every agent action. Full visibility. |
| **guided** | Agents work, surface decisions for your input. |
| **autonomous** | Agents run. You review results. |

## Optional Integrations

- **Linear** — TechPM creates and manages tickets
- **Reddit** — Strategist researches community sentiment

Both optional. Everything works without them.

## Uninstall

```bash
npx supabuilder-cc --uninstall
```

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- Node.js 14+

## License

MIT

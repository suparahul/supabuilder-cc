# Supabuilder

A full product team that lives in your terminal.

You describe what you want. Six AI agents — PM, Designer, Strategist, Architect, Tech PM, QA — figure out what to build, debate the tradeoffs, and ship it. You stay in control the whole time.

## Your Team

You talk to one person: the **Orchestrator** (your product lead). It manages the whole team.

| Agent | What they do |
|-------|-------------|
| **Strategist** | Big picture and direction. Asks "should we build this at all?" |
| **PM** | What to build and why. Won't let you ship something vague. |
| **Designer** | Look, feel, and experience. Creates HTML prototypes you can open in your browser. |
| **Architect** | How it fits together. Data models, APIs, technical blueprint. |
| **Tech PM** | Turns decisions into buildable tickets. Tracks delivery. |
| **QA** | Tests as a real user. Routes findings back to the right agent. |

No Dev agent — Claude Code handles development natively. The agents handle everything else.

## What You Can Use It For

Start anywhere. The team adapts to the size of what you need.

- **Fix a bug** — describe the issue, team diagnoses and fixes it
- **Add a feature** — a new screen, a button, a small enhancement
- **Build a module** — auth, payments, notifications — fully specced and built
- **Explore a problem** — start with a question, not a solution
- **Redesign something** — rethink how it works, new UX, new architecture
- **Ship a new product** — from zero to deployed MVP: strategy, specs, design, code

## How It Works

1. **Describe your idea** — just say what you want in plain English
2. **Team explores and discusses** — agents ask questions, research options, debate tradeoffs
3. **You review designs and specs** — see prototypes, approve requirements
4. **Architecture and plan** — technical blueprint + ordered tickets
5. **Code gets built** — piece by piece, with milestone check-ins
6. **Tested, documented, done** — QA verifies, wikis updated, mission complete

You talk naturally — no templates needed. Nothing gets built without your sign-off.

## What You Get

Every mission moves through clear phases. You always know where things stand.

**Strategy** — big picture, vision, direction, scope
- Strategy brief with market context and product direction

**Shaping** — exploration, options, tradeoffs, approaches
- Multiple design options as HTML prototypes you can open and compare

**Specifying** — formal specs, requirements, architecture, design
- Detailed product specs for every feature
- Architecture plan — data models, APIs, technical blueprint

**Building** — implementation, code, test, ship
- Ordered implementation tickets with clear steps
- Working code in your actual codebase, with milestone check-ins

**Finishing** — polish, adjust, verify
- QA reports and quality checks
- Living documentation — product wiki + code wiki, always current

Every deliverable is a real artifact in your project — not just a chat message. Phases can loop back — refinements are normal, not a sign something went wrong.

## Explore Before You Commit

The team thinks first, builds second. You start with a conversation — the orchestrator discusses your idea before any agent is called. Designer creates multiple options you can compare. You review screens, flows, and interactions before a single line of code is written.

Early exploration is cheap. Pivot, refine, or scrap before committing.

## You're Always in Control

| Mode | What it means |
|------|--------------|
| **Hands-on** (default) | See everything. Approve every agent's plan before they work. Review designs, specs, and code at every step. |
| **Guided** | Agents work more independently. Major decisions and transitions come to you. |
| **Autonomous** | Team runs the full pipeline. You review the final output. |

What control looks like in practice:
- Every agent shows you a plan before doing any work
- You approve prototypes before architecture starts
- You test code at milestones during the build

Switch anytime. Start hands-on, go autonomous when you trust the flow.

## Install

```bash
npx supabuilder-cc@latest
```

Then in any project:
```
/supabuilder:init
```

## Commands

| Command | What It Does |
|---------|-------------|
| `/supabuilder:init` | Scan codebase, build product-wiki + code-wiki, create workspace |
| `/supabuilder:mission` | Start a new mission explicitly |
| `/supabuilder:status` | Check current state — missions, phase, decisions |
| `/supabuilder:settings` | Configure cost mode, user control, debate visibility |
| `/sketch` | Excalidraw diagrams for visual thinking |
| `/napkin` | Per-repo mistake tracking |

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

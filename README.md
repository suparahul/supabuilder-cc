# Supabuilder

A full product team for Claude Code. 7 specialized AI agents that think with you through ideation, spec, build, review, and iteration.

Not a spec generator — a co-pilot for every stage of making a product real.

## Install

```bash
npx supabuilder-cc@latest
```

Then in any project:

```bash
/supabuilder:init
```

## What You Get

### 7 Agents

| Agent | What They Do |
|-------|-------------|
| **PM** | Requirements, edge cases, acceptance criteria. Won't let you ship something vague. |
| **Designer** | 2-3 design variations, HTML prototypes, Excalidraw flow diagrams. Makes you experience the product before it's built. |
| **Strategist** | Vision alignment, competitive analysis. Asks "should we build this at all?" |
| **Architect** | Data models, system architecture, technical specs. Makes sure it can actually be built. |
| **TechPM** | Linear tickets, implementation tracking, dev wave coordination. |
| **Dev** | Code review against spec, convention compliance. Routes spec mismatches back to Architect. |
| **QA** | Tests as a real user. Routes spec gaps back to PM, UX issues to Designer. |

### 8 Skills

| Command | What It Does |
|---------|-------------|
| `/supabuilder:init` | Scan your project, create context files |
| `/supabuilder:start` | Guided product ideation — "what's on your mind?" |
| `/supabuilder:sprint <name>` | Full team sprint with all agents |
| `/supabuilder:review` | Code review (Dev) + user testing (QA) |
| `/supabuilder:status` | Sprint progress and blockers |
| `/supabuilder:mode <mode>` | Cost mode (quality/smart/budget) and debate visibility |
| `/sketch` | Excalidraw diagrams for visual collaboration |
| `/napkin` | Per-repo learning file — tracks mistakes and patterns |

## How It Works

```
You have an idea
  → /supabuilder:start
  → PM asks deep questions, defines requirements
  → Designer creates 2-3 variations with HTML prototypes
  → You open prototypes in browser, choose direction
  → Architect designs technical system
  → TechPM creates Linear tickets in parallel waves
  → Dev agents build in swarm (parallel worktrees)
  → Dev reviews code against spec
  → QA tests as real user
  → Findings route back to spec owners
  → Specs evolve, code improves
  → Ship
```

Specs are living documents. The team stays engaged through build, review, test, and revision.

## Project Agnostic

Supabuilder works with any tech stack. It discovers your project via `/supabuilder:init` and reads your conventions from `product_specs/agent_rules/`. No framework assumptions.

## Optional Integrations

During `/supabuilder:init`, you can optionally configure:
- **Linear** — For ticket tracking (TechPM uses Linear API)
- **Reddit** — For community research (Strategist uses Reddit MCP)

Both are optional. System works 100% without them.

## Cost Modes

```bash
/supabuilder:mode quality    # All Opus, 5 debate rounds (best thinking)
/supabuilder:mode smart      # Balanced — Opus for spec agents, Sonnet for Dev/QA
/supabuilder:mode budget     # Mostly Sonnet, 1 round (fast & cheap)
```

## Uninstall

```bash
npx supabuilder-cc --uninstall
```

Removes all Supabuilder agents and skills from `~/.claude/`. If you had existing agent files before installing, they'll be restored from backups.

## Requirements

- Claude Code
- Node.js 14+

## License

MIT

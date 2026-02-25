---
name: supabuilder:settings
description: "Configure Supabuilder settings — cost mode, user control, debate visibility, orchestrator on/off."
user-invocable: true
argument-hint: [quality|smart|budget|hands-on|guided|autonomous|key_decisions|show_all|summaries_only|on|off|show]
---

# Supabuilder Settings

Configure how Supabuilder operates. All settings are stored in `supabuilder/state.json`.

---

## Settings

| Setting | Values | Default | What it controls |
|---------|--------|---------|-----------------|
| `cost_mode` | `quality` / `smart` / `budget` | `smart` | Which models agents use, debate rounds |
| `user_control` | `hands-on` / `guided` / `autonomous` | `hands-on` | How much the user sees and approves |
| `debate_visibility` | `key_decisions` / `show_all` / `summaries_only` | `key_decisions` | How much agent reasoning is visible |
| `orchestrator` | `on` / `off` | `on` | Master toggle for orchestrator |

---

## Implementation

0. **Read `~/.claude/supabuilder/reference/branding.md` and output the header** (ASCII art, version, random tagline).

---

## If $ARGUMENTS provided

### Single argument inference

All setting values are unique across settings, so a single word unambiguously identifies the setting:

| Argument | Setting | Value |
|----------|---------|-------|
| `quality` | `cost_mode` | `quality` |
| `smart` | `cost_mode` | `smart` |
| `budget` | `cost_mode` | `budget` |
| `hands-on` | `user_control` | `hands-on` |
| `guided` | `user_control` | `guided` |
| `autonomous` | `user_control` | `autonomous` |
| `key_decisions` | `debate_visibility` | `key_decisions` |
| `show_all` | `debate_visibility` | `show_all` |
| `summaries_only` | `debate_visibility` | `summaries_only` |
| `on` | `orchestrator` | `orchestrator_active: true` |
| `off` | `orchestrator` | `orchestrator_active: false` |
| `show` | (none) | Display current settings |

### Update and confirm

1. **Read** `supabuilder/state.json`
   - If doesn't exist: "Run `/supabuilder:init` first."
2. **Update** the identified setting
3. **Write** updated state.json
4. **Confirm** with implications:

**Cost mode changes:**
```
Cost mode: {old} → {new}

{new} mode:
  quality  — Opus for all agents, up to 5 debate rounds (~3-5x cost)
  smart    — Opus for PM/Designer/Strategist/Architect, Sonnet for TechPM/QA, 3 rounds
  budget   — Sonnet for all except critical, 1 round (~50% cost)
```

**User control changes:**
```
User control: {old} → {new}

{new} mode:
  hands-on   — Every mood transition, every diagram, every agent handoff. Full visibility.
  guided     — Major transitions and key decisions. Standard checkpoints.
  autonomous — Pipeline runs, you approve final output. Minimal interruptions.
```

**Debate visibility changes:**
```
Debate visibility: {old} → {new}

{new} mode:
  key_decisions    — See 2-3 options at decision points. Clean flow.
  show_all         — See all agent reasoning and debate. Maximum transparency.
  summaries_only   — See final recommendations only. Fastest flow.
```

**Orchestrator toggle:**
```
Orchestrator: {on/off}

{If turning off:} "I'll behave as normal Claude Code. Supabuilder workspace files remain. Turn back on anytime with `/supabuilder:settings on`."
{If turning on:} "Orchestrator active. Reading state... {brief current state summary}"
```

---

## If $ARGUMENTS is empty or "show"

Display current settings:

```
Supabuilder Settings

  Cost mode:          {value}  ({brief description})
  User control:       {value}  ({brief description})
  Debate visibility:  {value}  ({brief description})
  Orchestrator:       {on/off}

Change with: /supabuilder:settings <value>

Values:
  Cost:    quality | smart | budget
  Control: hands-on | guided | autonomous
  Debate:  key_decisions | show_all | summaries_only
  Toggle:  on | off
```

---

## Edge Cases

- **Invalid argument** — show help with valid values
- **Setting unchanged** (same value) — "Already set to {value}. No change."
- **Changed mid-mission** — applied to all future agent spawns. Already-spawned agents continue with previous settings.

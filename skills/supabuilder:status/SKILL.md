---
name: supabuilder:status
description: "Show current project state — active missions, phase, mood, decisions, settings, and recent journal entries."
user-invocable: true
---

# Supabuilder Status

Lightweight read-only status check. No orchestrator reasoning needed — just reads state and presents it.

---

## Implementation

0. **Read `~/.claude/supabuilder/reference/branding.md` and output the header** (ASCII art, version, random tagline).

1. **Read `supabuilder/state.json`** and **`supabuilder/settings.json`**
   - If state.json doesn't exist: "No Supabuilder workspace found. Run `/supabuilder:init` to get started."

2. **Read active mission files** — for each entry in `active_missions`, read `supabuilder/missions/{id}/mission.json`

3. **Present status:**

### If active missions exist:

```
Supabuilder Status

Latest: {latest field from state.json}

Mission: {name} ({type})
  Phase: {phase}
  Last update: {last_update from mission.json}
  Pipeline progress:
    {agent}: {mood₁} {✓|→|·} {mood₂} {✓|→|·} ... (for each in progress field)
    Example: Strategist: discuss ✓ → research ✓ → explore → write
    Use ✓ for done, → for in_progress, plain text for pending. For "not_needed" agents, show: {agent}: skipped
    For "build" (flat string): Build: {status}
  Decisions: {count} made
  {list key decisions, 3-4 max}
  Flags: {count of agent_handoff_notes, if any}

{If multiple active missions, show each}

{If past_missions exist:}
Past missions: {count}
  {list 3 most recent: id, type, completed date}

Settings: (from settings.json)
  Orchestrator: {on/off}
  Cost mode: {cost_mode}
  User control: {user_control}
```

### If no active missions:

```
Supabuilder Status

No active missions.

{If past_missions exist:}
Past missions: {count}
  {list 3 most recent: id, type, completed date}

Settings: (from settings.json)
  Orchestrator: {on/off}
  Cost mode: {cost_mode}
  User control: {user_control}

Start a new mission with /supabuilder:mission or just tell me what you want to build.
```

### If multiple missions:

Show each mission in a compact block, most recent first. Indicate which is most recently active.

---

## Edge Cases

- **No state file** — "Run `/supabuilder:init` first."
- **State file exists but no missions ever** — show settings only, suggest starting a mission
- **Mission.json missing for an active_missions entry** — warn "Mission {id} state file is missing. It may have been deleted."
- **Corrupted state** — try to show what's readable, warn about issues

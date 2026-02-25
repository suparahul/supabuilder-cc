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

1. **Read `supabuilder/state.json`**
   - If doesn't exist: "No Supabuilder workspace found. Run `/supabuilder:init` to get started."

2. **Read active mission files** — for each entry in `active_missions`, read `supabuilder/missions/{id}/mission.json`

3. **Read journal** — last 3-4 lines of `supabuilder/journal.md` for recent context

4. **Present status:**

### If active missions exist:

```
Supabuilder Status

Mission: {name} ({type})
  Phase: {phase}
  Mood history: {mood_sequence_with_status}
  Decisions: {count} made
  {list key decisions, 3-4 max}
  Deliverables:
    {deliverable}: {status}
    ...

{If multiple active missions, show each}

Settings:
  Orchestrator: {on/off}
  Cost mode: {cost_mode}
  User control: {user_control}
  Debate visibility: {debate_visibility}

Recent journal:
  {last entry, 3-4 lines}
```

### If no active missions:

```
Supabuilder Status

No active missions.

Settings:
  Orchestrator: {on/off}
  Cost mode: {cost_mode}
  User control: {user_control}
  Debate visibility: {debate_visibility}

{If journal has entries:}
Last activity:
  {last journal entry, 3-4 lines}

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

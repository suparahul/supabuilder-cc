---
name: supabuilder:status
description: "Show current project state and sprint progress. Check what's active, what's done, blockers and timeline."
user-invocable: true
---

# Supabuilder Status

Check project status and sprint progress.

## How to Use

```bash
/supabuilder:status
```

Shows:
- Active sprints (what's in progress, what phase)
- Sprint progress (estimated vs actual)
- Blockers (what's waiting on what)
- Cost mode and debate visibility settings

## What It Shows

### Active Sprints

For each sprint in `.claude/supabuilder-state.json`:
```
🏗️ sprint-authentication (Rock)
   Phase: architecture (PM → Designer → Architect)
   Started: 2 hours ago
   Linear tickets: SUP-001 through SUP-015 (10 complete, 5 in progress)
   Blocker: Waiting on Architect to finish architecture.md
```

### Progress Metrics

- **Phase completion** — Requirements: ✅ Design: 🔄 Architecture: ⏳
- **Ticket status** — "7 of 15 complete" (pie chart or text)
- **Velocity** — "Average 2 tickets/hour" (if Linear data available)
- **Timeline** — "Started 2h ago, estimated 4h remaining"

### Blockers

```
🚫 Blocked items:
   - SUP-018 (waiting for SUP-015 to complete)
   - Designer review waiting on PM requirements finalization
```

### Settings

```
⚙️  Configuration:
   Cost mode: smart (Opus for spec agents, Sonnet for Dev/QA)
   Debate visibility: key_decisions (2-3 options at decision points)
```

## Implementation

When invoked:

1. **Read `.claude/supabuilder-state.json`**
   - Extract active sprints
   - Current phase for each
   - Agents active

2. **For each active sprint**:
   - **Sprint info**: Name, size, phase, time elapsed
   - **Agents active**: Which are spawned/idle
   - **Phase progress**: What's complete
   - **Build progress** (if `phase` is `"building"` and `build_state` exists):
     - Current wave / total waves (e.g., "Wave 2/3 in progress")
     - Tickets completed / total (e.g., "4/9 tickets built")
     - Per-wave QA results (e.g., "Wave 1 QA: pass, Wave 2 QA: in progress")
     - Team name for reference
   - **Blockers**: What's waiting on what (if available)

3. **Query Linear** (if configured):
   - Fetch tickets for this sprint
   - Count by status: Todo, In Progress, Done, Blocked
   - Show progress bar or count

4. **Show settings**:
   - Cost mode (quality/smart/budget)
   - Debate visibility (key_decisions/show_all/summaries_only)

5. **Show summary**:
   ```
   🎯 Project Status

   Active Sprint: sprint-authentication (Rock)
   Phase: architecture
   Started: 2 hours ago
   Status: 🟡 In Progress

   Phase Progress:
   ✅ Requirements (PM, 45 min)
   🔄 Design (Designer, in progress)
   ⏳ Architecture (Architect, queued)

   Agents:
   - PM: idle (requirements complete)
   - Designer: active (flow exploration)
   - Architect: idle (waiting for design selection)

   Build Progress (if building):
   🔨 Wave 2/3 in progress
   Tickets: 4/9 built
   - Wave 1 QA: ✅ pass (3 tickets)
   - Wave 2 QA: 🔄 in progress (3 tickets)
   - Wave 3: ⏳ queued (3 tickets)
   Team: build-authentication

   Blockers: None

   ⚙️  Settings:
   - Cost mode: smart
   - Debate visibility: key_decisions
   ```

6. **Linear metrics** (if available):
   ```
   Tickets: 10/15 complete
   - Todo: 2
   - In Progress: 3
   - Done: 10
   ```

## Edge Cases

- **No active sprints** — "No active sprints. Run `/supabuilder:start` to begin."
- **Linear not configured** — Skip ticket metrics, show file-based progress only
- **Sprint state file corrupted** — Report error, offer to reset
- **Multiple active sprints** — Show all, with clear separation

## Reference

Read `.claude/supabuilder-state.json` structure:
```json
{
  "active_sprints": [
    {
      "id": "sprint-name",
      "name": "Feature Name",
      "size": "rock|pebble|sand",
      "phase": "requirements|design|architecture|tickets|building|review",
      "agents_active": ["pm", "designer"],
      "started": "2026-02-23T17:00:00Z",
      "build_state": {
        "team_name": "build-{feature-name}",
        "current_wave": 2,
        "total_waves": 3,
        "completed_waves": [1],
        "tickets_completed": ["TICK-001", "TICK-002"],
        "tickets_remaining": ["TICK-003", "TICK-004"],
        "qa_results": { "1": { "result": "pass", "blocking": 0, "non_blocking": 1 } }
      }
    }
  ],
  "cost_mode": "smart|quality|budget",
  "debate_visibility": "key_decisions|show_all|summaries_only"
}
```

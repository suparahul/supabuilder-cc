---
name: supabuilder:mode
description: "Change cost mode (quality/smart/budget) or debate visibility (key_decisions/show_all/summaries_only)."
user-invocable: true
argument-hint: <quality|smart|budget|key_decisions|show_all|summaries_only>
---

# Supabuilder Mode

Configure how Supabuilder agents think and collaborate.

## How to Use

```bash
/supabuilder:mode quality
/supabuilder:mode show_all
/supabuilder:mode budget
```

## Cost Modes

Control agent models and debate rounds.

### `quality` (Deep Thinking)

```
/supabuilder:mode quality
```

- **Models**: All agents use Opus (high intelligence, higher cost)
- **Debate**: Up to 5 rounds of agent-to-agent debate
- **Use when**: Important features, strategic decisions, need maximum quality

**Cost impact**: ~3-5x higher API cost

### `smart` (Default, Balanced)

```
/supabuilder:mode smart
```

- **Models**: Opus for PM/Designer/Strategist/Architect, Sonnet for TechPM/Dev/QA
- **Debate**: Up to 3 rounds of agent-to-agent debate
- **Use when**: Day-to-day work, good balance of quality and speed

**Cost impact**: Baseline

### `budget` (Fast & Cheap)

```
/supabuilder:mode budget
```

- **Models**: Sonnet for all (except critical: PM/Architect stay Opus)
- **Debate**: 1 round max (each agent gives opinion, no back-and-forth)
- **Use when**: Quick iterations, prototyping, cost-sensitive

**Cost impact**: ~50% of baseline

## Debate Visibility

Control how much of agent collaboration you see.

### `key_decisions` (Default, Clean)

```
/supabuilder:mode key_decisions
```

- **Agent debates happen privately** (via SendMessage)
- **You see 2-3 decision options** at key moments
- **Clean flow without message noise**
- **Use when**: Want clarity without distraction

Example:
```
Design Decision:
A) Single unified flow (faster)
B) Separate onboarding + main flows (clearer)

Designer recommends: B
PM agrees with A (simpler requirements)
Architect has no constraint

Which approach? [A] [B] [Other]
```

### `show_all` (Transparent)

```
/supabuilder:mode show_all
```

- **All agent-to-agent messages visible**
- **See every message, debate, change of mind**
- **Maximum transparency**
- **Use when**: Want to understand full agent reasoning, debugging, learning

Example:
```
❶ PM (to Designer): "These requirements need a 2-step flow. Is that UX-efficient?"
   ↳ Designer (to PM): "Actually, a single flow is better. Here's why..."
   ↳ PM (to Designer): "Hmm, but what about the edge case where..."
   ↳ Designer (to PM): "Good point. Let me redesign with that in mind."

[... more messages ...]

Result: Both agree on single-flow with error handling → Present to user
```

### `summaries_only` (Executive)

```
/supabuilder:mode summaries_only
```

- **Agents debate privately, agree internally**
- **You see final recommendation only**
- **Must approve or redirect**
- **Use when**: Want fast decisions without debate visibility

Example:
```
Design Decision (Resolved):
Agents recommend: Single unified flow
Confidence: High (PM, Designer, Architect all aligned)

Approve? [Yes] [No, redirect]
```

## Implementation

When invoked with argument:

1. **Validate argument**:
   - Cost modes: `quality`, `smart`, `budget`
   - Debate modes: `key_decisions`, `show_all`, `summaries_only`
   - If invalid: Show help, list valid options

2. **Update `.claude/supabuilder-state.json`**:
   ```json
   {
     "cost_mode": "smart",
     "debate_visibility": "key_decisions"
   }
   ```

3. **Confirm change**:
   ```
   ✅ Cost mode: quality

   What changes:
   - All agents use Opus (higher quality, higher cost)
   - Up to 5 rounds of debate
   - Best for important features

   Current setting: smart (was 3 rounds)
   ```

4. **Show implications** (if cost mode):
   - Which agents change models
   - Debate rounds before/after
   - Estimated cost impact
   - Example: "~30% higher cost, but maximum quality"

## Combinations

You can use both settings independently:

```bash
/supabuilder:mode quality
/supabuilder:mode show_all
```

Results in:
- High-quality agents (Opus)
- Full debate transparency
- Maximum thinking + visibility

Common combos:
- **`quality` + `show_all`** — Deep research sprint, want to see all thinking
- **`smart` + `key_decisions`** — Normal day-to-day work
- **`budget` + `summaries_only`** — Quick prototyping, cost-conscious

## If $ARGUMENTS is empty

Show help:
```
Supabuilder Mode

Usage: /supabuilder:mode <option>

Cost Modes (controls agent models + debate):
  quality   All Opus, 5 rounds (best quality, ~3-5x cost)
  smart     Opus for spec agents, Sonnet for Dev/QA, 3 rounds (balanced)
  budget    Mostly Sonnet, 1 round (fast & cheap, ~50% cost)

Debate Visibility (controls agent collaboration transparency):
  key_decisions   Show 2-3 options at decisions (default, clean)
  show_all        Show all agent messages (transparent, verbose)
  summaries_only  Agents agree, you approve (executive view, fast)

Current settings:
- Cost mode: [current]
- Debate visibility: [current]
```

## Edge Cases

- **Mode changed mid-sprint** → Applied to all future agent spawns in this sprint
- **Already-spawned agents** → Continue with previous mode (not retroactive)
- **User wants to revert** → Just run `/supabuilder:mode smart` to reset to default
- **Cost impact not clear** → Show concrete examples ("Baseline quality: ~$1.50 per sprint, quality mode: ~$4.50")

## Reference

These settings are stored in `.claude/supabuilder-state.json`:
```json
{
  "cost_mode": "quality|smart|budget",
  "debate_visibility": "key_decisions|show_all|summaries_only"
}
```

All spawned agents read these settings at startup and adjust their behavior accordingly.

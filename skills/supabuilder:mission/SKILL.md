---
name: supabuilder:mission
description: "Explicitly start a new mission. Classifies type, creates mission folder, and hands off to the orchestrator."
user-invocable: true
argument-hint: [description of what you want to build]
---

# Supabuilder Mission

Explicitly start a new mission. The orchestrator also detects missions conversationally — this command is for when you want to be explicit.

---

## If $ARGUMENTS provided

The user gave a mission description. Classify and confirm:

1. **Read state** — `supabuilder/state.json` for current state
   - If no state.json: "Run `/supabuilder:init` first to set up the workspace."
   - Read `supabuilder/settings.json`. If `orchestrator_active` is false: "Orchestrator is off. Run `/supabuilder:settings on` to enable."

2. **Classify** the description into a mission type.
   Read `~/.claude/supabuilder/reference/missions.md` for classification signals and mission types.

3. **Confirm in one line:**
   > "That sounds like a **{type}** mission — {brief why}. Starting with {first_agent}. Sound right?"

   If ambiguous, use AskUserQuestion with the top 2-3 likely types.

4. **Create mission folder with all subfolders upfront:**
   ```
   supabuilder/missions/{YYYY-MM-DD}_{type}_{slugified-name}/
   ├── mission.json
   ├── journal.md
   ├── _overview.md
   ├── strategy/
   ├── specs/
   ├── prototypes/
   └── diagrams/
   ```

   **mission.json** — initialize with full schema:
   ```json
   {
     "id": "{folder_name}",
     "type": "{classified_type}",
     "name": "{human_readable_name}",
     "description": "{user's description}",
     "status": "in_progress",
     "started": "{today}",
     "completed": null,
     "phase": "strategy",
     "last_update": "Mission created. Starting pipeline.",
     "decisions": {},
     "progress": {
       "strategist":  { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
       "pm_first":    { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
       "designer":    { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
       "pm_second":   { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
       "architect":   { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
       "techpm":      { "discuss": "pending", "write": "pending" },
       "build":       "pending",
       "qa":          { "discuss": "pending", "write": "pending" }
     },
     "agent_handoff_notes": [],
     "modules": [],
     "ticket_tracker": null
   }
   ```

   **Set `not_needed` defaults per mission type group** (read `~/.claude/supabuilder/reference/missions.md` for group rules).
   When an agent is not needed, set its entire sub-object to the string `"not_needed"`:
   - Group 1 (New Product): all agents get full mood cycles
   - Group 2 (New Module/Feature/Revamp/Pivot): all agents get full mood cycles
   - Group 3 (Integrate/Migrate/Scale): `strategist`, `designer`, `pm_second`, `architect` → `"not_needed"`
   - Group 4 (Enhancement): `strategist` → `"not_needed"`
   - Group 5 (Quick Fix): `strategist`, `designer`, `pm_second`, `architect` → `"not_needed"`

   **journal.md** — initialize with:
   ```markdown
   # Mission Journal
   <!-- Detailed log of actions, changes, decisions for this mission -->
   ```

   **_overview.md** — initialize with:
   ```markdown
   # {Mission Name}

   **Type:** {type}
   **Started:** {date}

   ## Problem Statement
   {user's description, expanded slightly}

   ## Decisions
   <!-- Updated as decisions are made -->

   ## Notes
   <!-- Living discussion log -->
   ```

5. **Update state.json** — add to `active_missions` and update `latest`:
   ```json
   { "id": "{folder_name}", "type": "{classified_type}", "phase": "strategy" }
   ```
   Update `latest` field: "New mission: {name} ({type}). Starting pipeline."

6. **Hand off** — the orchestrator (CLAUDE.md) takes over from here. Announce:
   > "Mission created: `{folder_name}`. Starting with {first_agent}."

   Then begin following the fixed pipeline for this mission type group.

---

## If $ARGUMENTS is empty

Present mission types via AskUserQuestion:

**"What kind of mission are you starting?"**

Options:
- **New Product** — "Building something from scratch"
- **New Module** — "Adding a major new system/module"
- **New Feature** — "Adding a feature to an existing module"
- **Enhancement** — "Improving something that already works"

Then ask: **"Describe what you want to build:"** (free text follow-up)

For less common types (revamp, quick-fix, integrate, migrate, scale, pivot), the user can type a description and the orchestrator will classify it.

---

## Naming Convention

Mission folder names: `YYYY-MM-DD_{type}_{slugified-name}`

Examples:
- `2026-03-01_new-module_auth`
- `2026-03-15_enhancement_search-filters`
- `2026-03-20_quick-fix_login-redirect`

Slugify: lowercase, hyphens, no special chars, max 30 chars.

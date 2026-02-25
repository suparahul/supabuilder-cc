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
   - If `orchestrator_active` is false: "Orchestrator is off. Run `/supabuilder:settings on` to enable."

2. **Classify** the description into a mission type.
   Read `~/.claude/supabuilder/reference/missions.md` for classification signals and mission types.

3. **Confirm in one line:**
   > "That sounds like a **{type}** mission — {brief why}. Starting with {first_agent}. Sound right?"

   If ambiguous, use AskUserQuestion with the top 2-3 likely types.

4. **Check for active missions** — if another mission is `in_progress` in state.json:
   > "You have an active mission: **{name}** ({phase} phase). Want to pause it and start this new one, or continue the active one?"

   Options via AskUserQuestion:
   - "Pause {active_mission} and start new mission"
   - "Continue working on {active_mission}"
   - "Start new mission alongside (multi-mission)"

5. **Create mission folder:**
   ```
   supabuilder/missions/{YYYY-MM-DD}_{type}_{slugified-name}/
   ├── mission.json
   └── _overview.md
   ```

   **mission.json** — initialize with:
   ```json
   {
     "id": "{folder_name}",
     "type": "{classified_type}",
     "name": "{human_readable_name}",
     "description": "{user's description}",
     "status": "in_progress",
     "started": "{today}",
     "completed": null,
     "paused_reason": null,
     "phase": "discuss",
     "mood_history": [],
     "decisions": {},
     "modules": [],
     "progress": {},
     "tracker": null,
     "artifacts": {
       "overview": "_overview.md",
       "diagrams": "diagrams/"
     }
   }
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

6. **Update state.json** — add to `active_missions`:
   ```json
   { "id": "{folder_name}", "status": "in_progress", "phase": "discuss" }
   ```

7. **Hand off** — the orchestrator (CLAUDE.md) takes over from here. Announce:
   > "Mission created: `{folder_name}`. Starting with {first_agent} in discuss mood."

   Then begin spawning the first agent per the mission type's default lineup.

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

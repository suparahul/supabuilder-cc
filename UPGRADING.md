# Upgrading to v0.3.0

Migration guide for existing v0.2.x projects. Three parts: re-install, per-project workspace migration, and CLAUDE.md regeneration.

---

## Part A: Re-install

```bash
npx supabuilder-cc@latest
```

This overwrites all agents, skills, reference files, and templates in `~/.claude/`. Orphaned files from previous versions are cleaned up automatically — this includes `moods.md`, `visual-protocol.md`, and six reference files that are now inlined into the orchestrator template (`soul.md`, `coordination.md`, `gates.md`, `build-phase.md`, `user-interaction.md`, `linear.md`).

---

## Part B: Per-project workspace migration

Run these steps for each project that has a `supabuilder/` folder.

### 1. Migrate `supabuilder/state.json`

Open the file and make these changes:

**Remove these fields:**
- `debate_visibility`
- `last_module_touched`

**Add these fields:**
```json
"latest": null,
"past_missions": []
```

**Update version:**
```json
"supabuilder_version": "0.3.0"
```

**Fix `active_missions` entries** — remove `status`, add `type`:
```jsonc
// Before (v0.2.x)
{ "id": "2026-03-01_new-module_auth", "status": "in_progress", "phase": "specifying" }

// After (v0.3.0)
{ "id": "2026-03-01_new-module_auth", "type": "new-module", "phase": "specifying" }
```

The `type` value is the second segment of the mission ID (between the first and second `_`).

**Move completed missions** from `active_missions` to `past_missions`:
```json
"past_missions": [
  { "id": "2026-02-15_new-product_catapp", "type": "new-product", "status": "done", "completed": "2026-02-28" }
]
```

### 2. Migrate root `journal.md`

The v3 orchestrator uses per-mission journals + a project-wide `memory.md` instead of a single root journal. Your existing journal content should be preserved across both.

**Step 1: Copy mission-specific entries into per-mission journals.**

Open `supabuilder/journal.md` and for each mission that has a folder in `supabuilder/missions/`, copy the relevant journal entries into that mission's `journal.md` (created in step 5 below). Keep the timestamped format.

**Step 2: Extract cross-cutting decisions into `memory.md`.**

Scan the journal for entries that represent product-wide decisions, tech stack choices, pivots, or scope cuts. These go into the "Product Decisions" section of `memory.md` (created in step 3 below). Also add a "Completed Missions" entry for any missions that finished during v2.

**Step 3: Archive the original.**

```bash
mkdir -p supabuilder/.archive
mv supabuilder/journal.md supabuilder/.archive/journal-v2.md
```

The archived copy is your safety net — the orchestrator ignores it but you can always reference it.

### 3. Create `supabuilder/memory.md`

Create a new file at `supabuilder/memory.md`:

```markdown
# Product Memory

## Product Decisions

<!-- Cross-cutting decisions that affect the whole product. Added as they happen. -->

## Completed Missions

<!-- Brief summary added at mission completion. Date, type, what was built, key outcomes. -->
```

If you have completed missions, backfill a brief entry for each.

### 4. Add missing product-wiki directories

```bash
mkdir -p supabuilder/product-wiki/ui-kit
mkdir -p supabuilder/product-wiki/strategy
```

Create a stub README in ui-kit:

```bash
echo "# UI Kit\n\nDesign tokens, component patterns, and visual guidelines." > supabuilder/product-wiki/ui-kit/README.md
```

### 5. Migrate per-mission folders

For each folder in `supabuilder/missions/*/`:

**Create missing files and directories:**

```bash
# For each mission folder, e.g. supabuilder/missions/2026-03-01_new-module_auth/
MISSION_DIR="supabuilder/missions/YOUR_MISSION_ID"

# Create journal stub
echo "# Mission Journal\n" > "$MISSION_DIR/journal.md"

# Create subdirs
mkdir -p "$MISSION_DIR/strategy"
mkdir -p "$MISSION_DIR/specs"
mkdir -p "$MISSION_DIR/prototypes"
mkdir -p "$MISSION_DIR/diagrams"
```

**Update `mission.json`** in each mission folder:

| Change | Before (v0.2.x) | After (v0.3.0) |
|--------|-----------------|-----------------|
| Remove `paused_reason` | `"paused_reason": null` | *(delete field)* |
| Remove `artifacts` | `"artifacts": [...]` | *(delete field)* |
| Rename `tracker` | `"tracker": { "type": "linear" }` | `"ticket_tracker": "linear"` |
| Add `last_update` | *(missing)* | `"last_update": "Migrated from v0.2.x"` |
| Add `agent_handoff_notes` | *(missing)* | `"agent_handoff_notes": []` |

**Remap `progress`** to the mood-aware pipeline:

```jsonc
// Before (v0.2.x) — agent-name keys
"progress": {
  "strategist": "done",
  "pm": "done",
  "designer": "in_progress",
  "architect": "pending",
  "developer": "pending",
  "qa": "pending"
}

// After (v0.3.0) — mood-level sub-objects
"progress": {
  "strategist":  { "discuss": "done", "research": "done", "explore": "done", "write": "done" },
  "pm_first":    { "discuss": "done", "research": "done", "explore": "done", "write": "done" },
  "designer":    { "discuss": "done", "research": "in_progress", "explore": "pending", "write": "pending" },
  "pm_second":   { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
  "architect":   { "discuss": "pending", "research": "pending", "explore": "pending", "write": "pending" },
  "techpm":      { "discuss": "pending", "write": "pending" },
  "build":       "pending",
  "qa":          { "discuss": "pending", "write": "pending" }
}
```

Use your judgment to map v2 progress to v3 mood sub-objects:
- If a v2 agent was `"done"`, set all its moods to `"done"`
- If `"in_progress"`, set `discuss` to `"done"` and `research` to `"in_progress"`, rest `"pending"` (or use best judgment)
- If `"pending"`, all moods stay `"pending"`
- If `"not_needed"`, set the entire sub-object to the string `"not_needed"`
- Map v2 `pm` → `pm_first`; add `pm_second` as `"pending"` (or `"not_needed"` per mission type)
- Map v2 `developer` → `build` (flat string, no mood sub-object)

**Renumber `decisions`** to numeric string keys:

```jsonc
// Before — may have non-numeric or sparse keys
"decisions": { "auth": "Using Supabase Auth", "sessions": "JWT-based" }

// After — sequential numeric keys
"decisions": { "1": "Using Supabase Auth", "2": "JWT-based sessions" }
```

**If `phase` is `"done"`** — split into phase + status:
```json
"phase": "finishing",
"status": "done"
```

### 6. Regenerate CLAUDE.md

Delete the old one and let the orchestrator regenerate it:

```bash
rm .claude/CLAUDE.md
```

Then either:
- Run `/supabuilder:init` in your next Claude Code session — it detects existing wikis and regenerates CLAUDE.md from the v3 template
- Or just start a session — the orchestrator's version-check will auto-rewrite CLAUDE.md when it detects the version mismatch

---

## Verification

After migrating, confirm:

- [ ] `supabuilder/state.json` has `latest`, `past_missions`, no `debate_visibility` or `last_module_touched`
- [ ] `supabuilder/memory.md` exists with two sections
- [ ] `supabuilder/journal.md` is gone (archived to `.archive/journal-v2.md`)
- [ ] `supabuilder/product-wiki/ui-kit/README.md` exists
- [ ] `supabuilder/product-wiki/strategy/` exists
- [ ] Each mission folder has `journal.md`, `strategy/`, `specs/`, `prototypes/`, `diagrams/`
- [ ] Each `mission.json` has mood-aware `progress` (sub-objects with discuss/research/explore/write), `ticket_tracker`, `last_update`, `agent_handoff_notes`
- [ ] Starting a Claude Code session works — orchestrator starts cleanly with no errors

# State Management — Reference

Read this when updating state.json, mission.json, performing wiki sync, or managing mission phase progression.

---

## State Files

| File | Scope | What it tracks |
|------|-------|---------------|
| `supabuilder/state.json` | System-wide | Active missions list, cost mode, settings |
| `missions/{id}/mission.json` | Per-mission | Phase, decisions, progress, artifacts |

---

## When State Updates Happen

Update at natural pause points — not after every micro-action.

**mission.json updates:**
- When a key decision is made (add to `decisions`)
- When a deliverable status changes (update `progress`)
- When the mission phase advances (update `phase`)

**state.json updates:**
- When a new mission starts (add to `active_missions`)
- When a mission completes or is paused (update entry in `active_missions`)
- When cost mode or settings change

---

## state.json Schema

```json
{
  "orchestrator_active": true,
  "supabuilder_version": "0.2.7",
  "active_missions": [
    { "id": "2026-03-01_new-module_auth", "status": "in_progress", "phase": "specifying" }
  ],
  "cost_mode": "smart",
  "user_control": "hands-on",
  "debate_visibility": "key_decisions",
  "last_module_touched": "auth"
}
```

| Field | Values | Description |
|-------|--------|-------------|
| `supabuilder_version` | `string` | Version of supabuilder-cc that last wrote CLAUDE.md. Compared to branding.md on startup. |
| `orchestrator_active` | `true` / `false` | Master on/off toggle |
| `active_missions` | array | Currently active missions with quick-reference status |
| `cost_mode` | `quality` / `smart` / `budget` | Model selection for agents |
| `user_control` | `hands-on` / `guided` / `autonomous` | How much user sees and approves |
| `debate_visibility` | `key_decisions` / `show_all` / `summaries_only` | How much agent debate user sees |
| `last_module_touched` | string / null | Most recently active module |

---

## mission.json Schema

```json
{
  "id": "2026-03-01_new-module_auth",
  "type": "new-module",
  "name": "Authentication System",
  "description": "Email/password + OAuth authentication with role-based access",
  "status": "in_progress",
  "started": "2026-03-01",
  "completed": null,
  "paused_reason": null,
  "phase": "specifying",
  "decisions": {
    "auth_approach": "JWT with Supabase Auth"
  },
  "modules": ["auth"],
  "progress": {
    "requirements": "done",
    "architecture": "in_progress",
    "prototype": "pending"
  },
  "tracker": null,
  "artifacts": { "overview": "_overview.md", "diagrams": "diagrams/" }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Matches folder name: `YYYY-MM-DD_type_name` |
| `type` | string | `new-product` / `new-module` / `new-feature` / `enhancement` / `revamp` / `quick-fix` / `integrate` / `migrate` / `scale` / `pivot` |
| `status` | string | `planned` / `in_progress` / `paused` / `done` / `abandoned` |
| `phase` | string | `strategy` / `shaping` / `specifying` / `building` |
| `decisions` | object | Key decisions keyed by decision name |
| `modules` | array | Which product modules this mission touches |
| `progress` | object | Deliverable status: `pending` / `in_progress` / `done` |
| `tracker` | object/null | External ticket tracker reference |

---

## Mission Phase Progression

```
strategy → shaping → specifying → building → done

strategy:   Big picture — vision, direction, scope
shaping:    Exploration — options, tradeoffs, approaches
specifying: Formal specs — requirements, architecture, design
building:   Implementation — code, test, ship
```

Phase advances when the orchestrator judges the mission as a whole has moved past that kind of thinking. Individual agents may still loop back to earlier moods within a later phase. Note: phases describe the MISSION state; moods (discuss, research, explore, write, build) describe what an AGENT is doing.

---

## Wiki Sync (Complete Gate)

The enforced step at mission completion:

1. **Read mission output** — all spec files, agent summaries, decisions
2. **Identify wiki-relevant changes:**
   - New capabilities/behavior → product-wiki/
   - New architecture/patterns/data models → code-wiki/
   - New module → create module folders in both wikis
3. **Update wiki files** — module READMEs, diagrams, root overviews
4. **Add History entries** to affected module READMEs:
   ```markdown
   ## History
   - 2026-03-01 — `new-module_auth` — Initial auth system with email/password + OAuth
   ```
5. **Mark mission complete** — only after wiki updates are done

---

## _overview.md Maintenance

The living discussion document in each mission folder. Update at:
- Key decisions made
- Mission direction changes
- Significant debates or findings
- Mission completion (final summary)

Narrative log — complements mission.json (structured data) with human-readable context.

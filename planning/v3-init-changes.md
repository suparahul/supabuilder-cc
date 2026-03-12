# V3 Init Flow Changes — Working Doc

## Summary

The init flow (6 steps: brand/scaffold → interview → wave scan → cross-cutting → spec migration → completion) is **mostly unchanged**. The wiki scanning, wave processing, and interview steps are about codebase understanding, not agent coordination.

Changes are in what gets scaffolded, which reference files exist, and session startup.

---

## Scaffold Changes (Step 1)

### state.json → v3 schema

```json
{
  "orchestrator_active": true,
  "supabuilder_version": "0.3.0",
  "latest": null,
  "active_missions": [],
  "past_missions": [],
  "cost_mode": "smart",
  "user_control": "hands-on",
  "debate_visibility": "key_decisions"
}
```

Changes: added `latest` (project-level snapshot, replaced each write), added `past_missions` (lightweight refs), removed `last_module_touched` (redundant with `latest`).

### journal.md → memory.md

Global journal.md is killed. Replaced by `memory.md` — curated project history, demand-loaded only (not read on session start).

Stub content:
```markdown
# Project Memory
(Curated history — appended at mission milestones. Not read on session start.)
```

Per-mission `journal.md` remains for detailed mission-level logging.

### mission.json → v3 schema (template for new missions)

```json
{
  "id": "",
  "type": "",
  "name": "",
  "description": "",
  "status": "in_progress",
  "started": "",
  "completed": null,
  "phase": "",
  "last_update": "",
  "decisions": {},
  "progress": {
    "strategist": "pending",
    "pm_brief": "pending",
    "designer": "pending",
    "pm_requirements": "pending",
    "architect": "pending",
    "techpm": "pending",
    "build": "pending",
    "qa": "pending"
  },
  "agent_handoff_notes": [],
  "modules": [],
  "ticket_tracker": null
}
```

Changes: added `last_update` (mission-level snapshot, replaced each write), `agent_handoff_notes` (curated notes from agent handoffs), `ticket_tracker` (where tickets live). Progress aligned with pipeline steps. Decisions use numeric keys. Removed `artifacts` (folder is self-documenting), `current_context` (redundant), `paused_reason`, `tracker` (renamed).

---

## Reference Files — Consolidation

| File | v3 Status | Reason |
|------|-----------|--------|
| `moods.md` | **Kill** | Agents self-manage moods — orchestrator doesn't set depth |
| `visual-protocol.md` | **Kill** | Moved into each agent's .md file (Execution > Diagrams) |
| `coordination.md` | **Rewrite** | Simplified: context packet assembly, no directives, no mood instructions |
| `gates.md` | **Rewrite** | 4 gates (G0-G3) instead of 7 |
| `missions.md` | **Rewrite** | Fixed pipelines per mission type group, simplified classification |
| `state.md` | **Rewrite** | V3 schemas for state.json and mission.json |
| `user-interaction.md` | **Keep** | Still relevant as-is |
| `build-phase.md` | **Keep** | Still relevant (may update after build phase discussion) |
| `linear.md` | **Keep** | Unchanged |
| `init-scaffold.md` | **Update** | New default schemas, memory.md instead of journal.md |
| `init-code-wiki.md` | **Keep** | Unchanged — wiki scanning logic unaffected |
| `init-product-wiki.md` | **Keep** | Unchanged — wiki scanning logic unaffected |

Net: 2 killed, 4 rewritten, 1 updated, 5 kept.

---

## Session Startup Sequence

### Current (v2)
1. Version check (state.json version vs branding.md)
2. Read state.json
3. Read journal.md (last 2-3 entries)
4. Read active mission.json files
5. Greet with context

### V3
1. Version check (state.json version vs branding.md)
2. Read state.json (includes `latest` field — immediate orientation)
3. Read active mission.json files (if any — for detail beyond `latest`)
4. Greet with context

Changes: No journal.md read. `latest` field in state.json provides immediate project-level context. memory.md is demand-loaded only when orchestrator needs past mission history.

---

## Init Steps Unchanged

Steps 2-6 (interview, wave scan, cross-cutting pass, spec migration, completion) are unchanged. They deal with codebase understanding and wiki population — orthogonal to agent/orchestrator coordination changes.

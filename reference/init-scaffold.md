# Init Scaffold — Reference

Read this during `/supabuilder:init` Step 1 when creating the workspace folder structure.

---

## Workspace Structure

Create this folder tree at `{project-root}/supabuilder/`:

```
supabuilder/
├── product-wiki/
│   ├── overview.md
│   ├── product-overview.excalidraw
│   └── modules/
├── code-wiki/
│   ├── README.md
│   ├── architecture-map.md
│   ├── patterns.md
│   ├── data-models.md
│   ├── system-overview.excalidraw
│   └── modules/
├── missions/
├── rules/
│   ├── coding-conventions.md
│   └── tech-stack.md
├── state.json
├── journal.md
└── .archive/
```

---

## Stub File Contents

### `product-wiki/overview.md`
```markdown
# Product Overview

<!-- What the product is, who it's for, main capabilities -->
<!-- Populated by the orchestrator during missions -->

## Capabilities

## User Types

## History
```

### `product-wiki/product-overview.excalidraw`
Empty Excalidraw canvas:
```json
{"type":"excalidraw","version":2,"source":"supabuilder-init","elements":[],"appState":{"gridSize":null,"viewBackgroundColor":"#ffffff"},"files":{}}
```

### `code-wiki/README.md`
```markdown
# Code Wiki

<!-- Codebase overview — project organization, key directories -->
<!-- Populated during init code-wiki scan or first mission -->

## Project Organization

## Key Directories

## History
```

### `code-wiki/architecture-map.md`
```markdown
# Architecture Map

<!-- System architecture — components, services, integrations -->

## Components

## Services

## Integrations

## History
```

### `code-wiki/patterns.md`
```markdown
# Coding Patterns

<!-- Coding conventions, framework patterns, established idioms -->
<!-- Descriptive (what exists), not prescriptive (what to do) — see rules/ for prescriptive -->

## History
```

### `code-wiki/data-models.md`
```markdown
# Data Models

<!-- All entities and relationships (cross-module ER view) -->

## Entities

## Relationships

## History
```

### `code-wiki/system-overview.excalidraw`
Empty Excalidraw canvas (same as product-overview).

### `rules/coding-conventions.md`
```markdown
# Coding Conventions

<!-- Prescriptive rules for how agents write code in this project -->
<!-- Add naming conventions, formatting rules, patterns to follow -->
```

### `rules/tech-stack.md`
```markdown
# Tech Stack

<!-- Framework choices, library preferences, version constraints -->
```

---

## state.json Default

```json
{
  "orchestrator_active": true,
  "active_missions": [],
  "cost_mode": "smart",
  "user_control": "hands-on",
  "debate_visibility": "key_decisions",
  "last_module_touched": null
}
```

---

## journal.md Default

```markdown
# Journal

<!-- Running narrative maintained by the orchestrator. Newest entries first. -->
<!-- Updated at mission completion. Read top 2-3 entries at session start. -->
```

---

## Module Detection (Existing Codebases)

When code already exists, detect module boundaries:

1. **Look for directory patterns:**
   - `src/features/*`, `lib/features/*`, `app/modules/*`
   - `pages/*`, `routes/*`, `api/*`
   - Top-level dirs suggesting modules: `auth/`, `settings/`, `dashboard/`

2. **For each detected module, create stubs in both wikis:**
   ```
   product-wiki/modules/{module-name}/
   └── README.md  → "# {Module Name}\nDetected from: {source path}"

   code-wiki/modules/{module-name}/
   └── README.md  → "# {Module Name} — Technical\nDetected from: {source path}"
   ```

3. **List detected modules** in `product-wiki/overview.md` and `code-wiki/README.md`.

4. **Wave plan** — Detected modules become the initial wave plan for the interactive scan (see `/supabuilder:init` Step 2). Order by likely importance: core features first (auth, main domain modules), utilities and infrastructure last (config, shared helpers, scripts).

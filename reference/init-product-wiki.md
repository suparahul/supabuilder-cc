# Init Product-Wiki — Reference

Read this during `/supabuilder:init` Step 2 when scanning the codebase and populating product-wiki.

---

## Core Principle

The codebase IS the primary source for the product-wiki. Reading the actual code tells you what the product does, what modules exist, what user flows exist, what capabilities are real. The product-wiki is always populated during init — it is NOT conditional on old specs existing.

If `product_specs/` also exists, that's bonus enrichment — merge it in. But the codebase comes first.

---

## What to Extract from the Codebase

Both wikis extract from the **same scan** — one exploration pass reads the area's files, then findings are processed through both product and code lenses. This file defines the product lens; init-code-wiki.md defines the code lens.

| Code-wiki extracts | Product-wiki extracts |
|---|---|
| How it's built (architecture, patterns) | What it does (capabilities, user value) |
| Technical dependencies | User-facing features |
| Data schemas | Business rules and constraints |
| API structure | User flows and journeys |
| Internal module architecture | Module purpose from user perspective |

### What to look for (product lens)

1. **Route/page definitions** → what screens/pages users see, navigation structure
2. **Form components, validation rules** → user inputs, business constraints
3. **API handlers** → what actions users can take, what data they access
4. **Auth/permissions** → user types, access levels, what each role can do
5. **Email/notification templates** → user communication touchpoints
6. **Error messages, toast messages** → edge cases the product handles
7. **Feature flags, config toggles** → capabilities that exist but may be toggled
8. **README, docs/ folder** → existing product documentation
9. **Test descriptions** → "it should..." statements reveal intended behavior

---

## Writing Product-Wiki

### `product-wiki/overview.md`

Synthesize from codebase exploration:
- What the product is (inferred from routes, UI, README)
- Who it's for (inferred from user types, auth roles, onboarding flows)
- Main capabilities (real, verified against code)
- Module list with one-line descriptions of what each does for users

### `product-wiki/modules/{name}/README.md`

The `{name}` should be a product-oriented slug — "ai-chat" not "chat-panel", "settings" not
"preferences-store". Name from the user's perspective, not directory structure.

For each detected module:
- What the module does (user-facing purpose, not technical architecture)
- Main user flows (inferred from routes, components, API calls)
- Edge cases and constraints (from validation rules, error handling)
- Business rules (from code logic, not guesses)

### `product-wiki/product-overview.excalidraw`

Create a product overview diagram:
- Module map showing all modules and how they relate from user perspective
- User journey overview (main paths through the product)
- User types (if detectable)

---

## Enrichment from product_specs/ (if detected)

If old `product_specs/` exists, AFTER the codebase-based product-wiki is written:

### Step 1: Analyze old structure

Read `product_specs/` to understand what exists:
- Root-level files (`_overview.md`, `_technical.md`, `_strategic.md`)
- Per-module folders with specs (`requirements.md`, `architecture.md`, etc.)
- Shared context files (`_shared/`, `_rules/`)
- Diagrams (`.excalidraw` files)
- **Non-standard files** — playbooks, config logic, process docs, anything that doesn't map to a module spec

### Step 2: Enrich product-wiki

For each module in old specs:
1. **Read requirements/overview** — merge additional context into the already-written product-wiki module README
2. **Read constraints** — add business rules that weren't visible in code
3. **Read flows** — add user journeys that code alone didn't reveal
4. **Cross-reference with codebase** — flag drift where specs say X but code does Y. Wiki reflects code (current state). Note the drift.

### Step 3: Handle non-standard files

Some files in `product_specs/` won't fit the module spec pattern — playbooks, config logic docs, process guides, etc.

For each non-standard file:
1. Read it. Understand what it is.
2. Decide placement:
   - **Product-wiki** — if it describes product behavior, business rules, user-facing logic (e.g., `config_logic.md` that explains how pricing tiers work)
   - **Code-wiki** — if it describes technical processes, deployment procedures, infrastructure (e.g., `deploy_playbook.md`)
3. Copy as-is into the appropriate wiki. Do NOT rewrite or reformat. Just place it.
4. Add a one-line reference in the wiki's README or overview linking to it.

### Step 4: Extract technical content to code-wiki

Old specs often contain architecture decisions mixed with product specs. Extract to code-wiki:
- Architecture decisions → `code-wiki/architecture-map.md`
- Data model decisions → `code-wiki/data-models.md`
- Technical patterns → `code-wiki/patterns.md`

### Step 5: Archive old specs

1. **Move old specs:** `product_specs/` → `supabuilder/.archive/product_specs_v1/`
2. **Write migration log:** `supabuilder/.archive/migration-log.md`
   ```markdown
   # Migration Log
   Date: {date}

   ## Enriched
   - {module}: requirements merged into product-wiki, architecture into code-wiki
   - ...

   ## Copied As-Is
   - {file}: playbook/config doc → {wiki}/path (not reformatted)
   - ...

   ## Skipped
   - {module}/screens.md — product is live, mockups are outdated
   - {module}/tickets.md — historical, not needed in wiki
   - ...

   ## Drift Detected
   - {module}: spec says X but code does Y — wiki reflects code (current state)
   - ...
   ```

---

## Mapping Old Structure to New

| Old file | New location | What to extract |
|----------|-------------|----------------|
| `_overview.md` | Enrich `product-wiki/overview.md` | Product description, capabilities |
| `_technical.md` | Enrich `code-wiki/architecture-map.md` | Architecture decisions |
| `_strategic.md` | Enrich `product-wiki/overview.md` (partially) | Vision, target users |
| `{module}/requirements.md` | Enrich `product-wiki/modules/{module}/README.md` | Features, user stories → prose |
| `{module}/constraints.md` | Enrich `product-wiki/modules/{module}/README.md` | Business rules, validation |
| `{module}/flows.md` | Enrich `product-wiki/modules/{module}/README.md` | User journeys |
| `{module}/architecture.md` | Enrich `code-wiki/modules/{module}/README.md` | Technical design |
| `{module}/data_models.md` | Enrich `code-wiki/data-models.md` | Entity definitions |
| `{module}/screens.md` | (not migrated — product is real now) | — |
| `{module}/tickets.md` | (not migrated — historical) | — |
| Non-standard files | `product-wiki/` or `code-wiki/` (decide per file) | Copy as-is |
| `_rules/` | `supabuilder/rules/` | Copy directly |
| `.excalidraw` files | `product-wiki/` or `code-wiki/` canvases | Merge onto wiki canvases |

---

## Product-Wiki Principles

When writing product-wiki content:
- **Prose, not specs.** Reads like explaining the product to a smart colleague.
- **Concise.** Just enough to understand what exists and how it works.
- **Code is truth.** When code and specs disagree, the wiki reflects what the code does.
- **One README per module.** Covers: what it does, main flows, edge cases, constraints.
- **History section.** Every module README ends with history linking to missions.

---

## Wave Mode

When init runs the interactive flow (see `/supabuilder:init`), the product-wiki is populated in waves — one area at a time. Each area is scanned once (unified scan), then findings are processed through both product and code lenses. This section defines the product-lens wave protocol.

### Per-Wave (runs for each area in the wave plan)

For each area:

1. **Extract** — From the unified area scan (see init SKILL.md Step 3b), extract product-lens findings: user-facing purpose, flows, business rules, constraints. The "What to Extract" section above defines what to look for — the scan itself is shared with the code-wiki.
2. **Diagram** — Create or evolve `product-wiki/product-overview.excalidraw`. Each wave adds this area to the existing diagram — module box, user flows, connections to previously scanned areas. The diagram is NOT created fresh each wave. It grows incrementally.
3. **Confirm** — Combined with code-lens confirmation in a single user review pass. Ask 2-3 questions only if genuinely ambiguous (e.g., naming, missing logic, unclear tiers). If nothing is ambiguous, show findings and proceed.
4. **Write** — Populate `product-wiki/modules/{area}/README.md` with confirmed product understanding. Update the running `product-wiki/overview.md` with this area's entry.

**Key principle:** The product diagram evolves wave by wave. Each wave adds to the existing diagram. By the end, the diagram IS the product overview — it wasn't created separately, it grew through the scan process.

### Cross-Cutting Pass (runs after all waves)

After all areas are scanned and confirmed:
- Finalize `product-wiki/overview.md` — full product story synthesized from all module READMEs
- Finalize `product-wiki/product-overview.excalidraw` — complete product map with all areas, flows, and user types

**Read already-written per-area files** rather than re-scanning code. The per-wave READMEs are the input for the cross-cutting pass.

# Init Code-Wiki — Reference

Read this during `/supabuilder:init` Step 2 when scanning the codebase and populating code-wiki.

**Note:** Both wikis extract from the **same scan** — one exploration pass reads the area's files, then findings are processed through both product and code lenses. This file defines the code (technical) lens. The product lens is defined in init-product-wiki.md.

---

## What to Scan

| Source | What to extract | Where it goes |
|--------|----------------|---------------|
| Project config files | Language, framework, dependencies, build tools | `code-wiki/README.md` |
| Directory structure | Module boundaries, key directories, organization pattern | `code-wiki/README.md` |
| Route/API definitions | Endpoints, handlers, middleware chain | `code-wiki/architecture-map.md` |
| Database schemas/models | Entities, fields, relationships, constraints | `code-wiki/data-models.md` |
| Repeated code patterns | Import style, error handling, state management, naming | `code-wiki/patterns.md` |
| External integrations | Third-party APIs, services, auth providers | `code-wiki/architecture-map.md` |
| Per-module internals | Module-specific architecture, key files, internal flows | `code-wiki/modules/{name}/README.md` |

---

## Scan Protocol

### Step 1: Project-level scan
Using Glob and Grep tools:

1. **Config files** — Read `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pubspec.yaml`, `Gemfile`, `.env.example`, etc.
2. **Directory tree** — Map `src/`, `lib/`, `app/`, `tests/`, `api/`, etc.
3. **Framework detection** — Identify from dependencies (Next.js, Django, Rails, Flutter, etc.)
4. **Build/deploy** — Check for `Dockerfile`, `docker-compose.yml`, CI configs, `vercel.json`, etc.

### Step 2: Architecture scan
1. **Entry points** — Find main files, route definitions, API handlers
2. **Database** — Find schema files, migration files, ORM models, SQL files
3. **External services** — Find API client files, SDK imports, webhook handlers
4. **Middleware/auth** — Find auth middleware, permission checks, session handling

### Step 3: Pattern detection
1. **Import style** — Relative vs absolute, barrel files, path aliases
2. **Error handling** — Try/catch patterns, error boundaries, error types
3. **State management** — Redux, Context, Zustand, signals, etc.
4. **Component patterns** — File naming, co-location, shared components location
5. **Testing patterns** — Test file location, naming, frameworks used

### Step 4: Module-level scan
For each detected module:
1. **Key files** — Entry point, main components, data layer
2. **Internal architecture** — How the module is organized
3. **Dependencies** — What other modules it imports from
4. **Public API** — What it exports for other modules to use

---

## Writing Results

### `code-wiki/README.md`
Fill in project organization, key directories, detected modules with brief descriptions.

### `code-wiki/architecture-map.md`
Fill in components (with brief descriptions), services (external integrations), how they connect.

### `code-wiki/patterns.md`
Fill in observed patterns — import style, error handling, naming conventions, framework idioms. **Descriptive, not prescriptive.** Document what exists, not what should be.

### `code-wiki/data-models.md`
Fill in entities with key fields and relationships. If schema files exist, reference them. Don't duplicate full schemas — summarize the ER view.

### `code-wiki/system-overview.excalidraw`
Create a diagram showing:
- Major components/modules as boxes
- External services as cloud shapes
- Database as cylinder
- Arrows showing data flow / dependencies
- Use standard sketch color palette (blue for UI, green for API, yellow for DB)

### Per-module `code-wiki/modules/{name}/README.md`
For each module with enough complexity:
- Internal file organization
- Key abstractions
- Dependencies on other modules
- Notable patterns specific to this module

---

## Progress Communication

For large codebases, show progress to the user:
- "Scanning project structure..."
- "Found {N} modules. Analyzing architecture..."
- "Populating code-wiki... ({current}/{total} modules)"
- "Creating system overview diagram..."

This scan can take time. Keep the user informed.

---

## Wave Mode

When init runs the interactive flow (see `/supabuilder:init`), the scan protocol above is executed in waves — one area at a time — rather than all at once. Each area is scanned once (unified scan), then findings are processed through both code and product lenses. The scan steps remain the source of truth for WHAT to scan. Wave mode defines WHEN and HOW to scope them.

### Pre-Scan (runs once during init Step 2b)

Steps 1-3 of the scan protocol (project-level, architecture, pattern detection) run once as a lightweight pass during the interview phase. This detects:
- Language, framework, dependencies
- Directory structure and module boundaries
- High-level architecture patterns

This produces the **wave plan** — the list of areas to scan in order.

### Per-Wave (runs for each area in the wave plan)

For each wave:

1. **Extract** — From the unified area scan (see init SKILL.md Step 3b), extract code-lens findings: architecture, key files, dependencies, patterns, data models. The scan protocol above defines WHAT to look for — the scan itself is shared with the product-wiki.
2. **Write** — Populate `code-wiki/modules/{area}/README.md`. Update the running `code-wiki/README.md` with this area's entry.
3. **Diagram** — Update `code-wiki/system-overview.excalidraw` with this area's technical architecture (boxes, connections, data flow). The diagram evolves wave by wave.

### Cross-Cutting Pass (runs after all waves)

After all areas are scanned, synthesize cross-area content:
- `code-wiki/architecture-map.md` — connections between areas, shared services, integration points
- `code-wiki/patterns.md` — patterns observed across multiple areas
- `code-wiki/data-models.md` — cross-area entities and relationships
- Final `code-wiki/system-overview.excalidraw` — complete system view

**Read already-written per-area files** rather than re-scanning code. The per-wave READMEs are the input for the cross-cutting pass.

### Context Management

Each wave is self-contained to prevent context overflow in large codebases:
- After writing wiki content for an area, reference the written files instead of holding raw scan data in context
- The cross-cutting pass reads wiki files, not raw code
- This allows arbitrarily large codebases to be scanned without hitting token limits

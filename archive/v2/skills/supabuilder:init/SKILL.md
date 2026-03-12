---

## name: supabuilder:init
description: "Initialize Supabuilder in a project. Creates workspace, writes orchestrator brain to CLAUDE.md, optionally scans codebase and migrates old specs."
user-invocable: true

# Supabuilder Init

Initialize or resume Supabuilder setup in the current project. Interactive, product-first onboarding with diagram-driven exploration. Idempotent — re-run picks up where you left off.

## Quick Overview

1. **Brand + Scaffold** — display branding, create `supabuilder/` workspace + `.claude/CLAUDE.md`
2. **Interview** — gather user context before scanning
3. **Wave Scan** — per-area: unified scan → dual-lens extract → diagrams → confirm → write wikis
4. **Cross-Cutting** — synthesize overview files and finalize diagrams
5. **Spec Migration** — if old `product_specs/` detected, enrich wikis (optional)

---

## Before Starting: Detect State

Check what already exists to determine where to begin:


| Condition                                       | Start at                                             |
| ----------------------------------------------- | ---------------------------------------------------- |
| No `supabuilder/` folder                        | Step 1                                               |
| `supabuilder/` exists but wikis have only stubs | Step 2                                               |
| Wikis populated but old `product_specs/` exists | Step 5                                               |
| Everything is populated                         | "Supabuilder is already initialized. Nothing to do." |


---

## Step 1: Brand + Scaffold

### 1a. Branding

Read `~/.claude/supabuilder/reference/branding.md` and output the header with version and a random tagline.

### 1b. Create workspace

Read `~/.claude/supabuilder/reference/init-scaffold.md` for the full folder structure and stub file contents.

Create the `supabuilder/` workspace with all folders:

- `product-wiki/` with overview stub + empty canvas
- `code-wiki/` with README, architecture-map, patterns, data-models stubs + empty canvas
- `missions/` (empty)
- `rules/` with coding-conventions and tech-stack stubs
- `.archive/` (empty)
- `state.json` with defaults — after creating, read the version from `~/.claude/supabuilder/reference/branding.md` and write it as the `supabuilder_version` field
- `journal.md` with template

**No codebase detection here.** Just create the empty structure.

### 1c. Write CLAUDE.md

Read the template from `~/.claude/supabuilder/templates/claude-md-template.md`.

Write to `.claude/CLAUDE.md`:

- **If no CLAUDE.md exists:** write the template directly
- **If CLAUDE.md exists:** ask the user via AskUserQuestion:
  - "Append Supabuilder orchestrator to existing CLAUDE.md" (Recommended)
  - "Replace CLAUDE.md with Supabuilder orchestrator"
  - "Skip — I'll add it manually"

### 1d. MCP Setup (optional)

First check `.mcp.json` (if it exists) for already-configured servers. Only ask about MCPs that aren't already present:

- If Linear is already configured → skip silently
- If Reddit is already configured → skip silently
- If both are already configured → skip this entire step

For any that are missing, ask the user via AskUserQuestion:

- "Configure Linear for ticket tracking?" — if yes, add Linear MCP config to `.mcp.json`
- "Add Reddit for community research?" — if yes, add Reddit MCP config

If user skips both, Supabuilder still works fully. If `.mcp.json` exists, merge entries — don't overwrite.

### 1e. Checkpoint

Show summary of what was created:

```
Workspace created at supabuilder/
Orchestrator brain written to .claude/CLAUDE.md

Next: A quick interview so I can scan your codebase smarter.
```

Proceed to Step 2.

---

## Step 2: Interview

Before scanning anything, gather user context.

### 2a. Ask for overview (free text)

AskUserQuestion:

- Header: "Context"
- Question: "Before I scan your codebase, a quick overview from you helps me scan smarter. What does this product do? Or point me to an existing doc (README, docs folder, wiki)."
- Options:
  - "I'll give you an overview" — user explains in free text
  - "Read this file" — user points to a doc (follow up to ask which file)
  - "Skip, just scan" — proceed cold

If user provides context → hold it for guiding the scan.

### 2b. Quick project detection

NOW scan config files and directory structure to detect modules/areas. This is lightweight — Glob + Read of:

- `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pubspec.yaml`, `Gemfile`
- Directory tree (`src/`, `lib/`, `app/`, `pages/`, `routes/`, `api/`, etc.)
- Language, framework, main dependencies

This is NOT deep code scanning. Just enough to identify areas.

### 2c. Present areas

Using detected structure + user's overview, present areas as an AskUserQuestion:

- Header: "Areas"
- Question: "I detected these main areas in your codebase: {area1}, {area2}, {area3}, ... Does this look right?"
- Options:
  - "Looks right" — proceed with this wave plan
  - "Let me adjust" — user modifies the list
  - "Not sure, just scan" — use detected areas as-is

Order areas by likely importance: core features first, utilities last.

Name areas from the user's perspective, not the codebase structure. "AI Chat" not "chat-panel",
"Settings" not "preferences-store", "Project Setup" not "scaffolder". Directory names inform
what exists — the area name reflects what it does for users. If the user provided an overview,
use their language.

This produces the **wave plan** — the ordered list of areas to scan one by one.

---

## Step 3: Wave Scan (unified scan, dual lens)

Read `~/.claude/supabuilder/reference/init-product-wiki.md` and `~/.claude/supabuilder/reference/init-code-wiki.md` for what each lens extracts. Both process the same scan findings — one exploration pass per area, two lenses applied to the results.

**CRITICAL: Process ONE area at a time.** Complete the full cycle (3a→3g) for each area
before moving to the next. Do NOT batch-scan all areas and present results together.
Each area gets its own scan, diagrams, user confirmation, and wiki write — then move on.

For each area in the wave plan:

### 3a. Progress (for 4+ areas only)

Show a progress bar:

```
[████████░░░░░░░░] 3/8 areas  |  Next: billing
```

For small projects (1-3 areas), skip the progress bar.

### 3b. Scan area

Single scan of the area's files — routes, components, models, API handlers, validation, config, tests. This is pure exploration (Glob, Grep, Read). Output: raw scan findings (what files exist, what they contain, key patterns).

### 3c. Process through both lenses

From the same scan findings, extract two summaries:

- **Product lens:** what this area does for users, flows, business rules, constraints (see init-product-wiki.md "What to Extract")
- **Code lens:** architecture, patterns, data models, dependencies, key abstractions (see init-code-wiki.md "Scan Protocol")

If dual-lens processing reveals gaps (e.g., product lens spots a flow but code lens needs to trace it deeper), targeted follow-up scans are fine. The point is: no redundant full-area scan.

### 3d. Diagrams

Use `/sketch` to create or update both evolving diagrams from the dual summaries:

**Product overview** (`product-wiki/product-overview.excalidraw`):

- Add this area as a module box with a one-line description
- Draw user flows through this area (arrows showing user journey)
- Connect to previously scanned areas where relevant
- Show user types if detected

**System overview** (`code-wiki/system-overview.excalidraw`):

- Add this area's main components/services
- Show data flow between components
- Draw connections to previously scanned areas (shared services, APIs, databases)
- Note key technologies/patterns

Both diagrams evolve wave by wave. Each wave adds to the existing diagrams. By the end,
they ARE the overview diagrams — they weren't created separately, they grew through the
scan process.

**HARD GATE: Do NOT proceed to Step 3e until both diagrams are created/updated using /sketch
and shown to the user.** If you skip this step, the user gets a text dump with no visual
context. Diagrams are the PRIMARY artifact — wiki prose elaborates on what the diagram shows.

### 3e. Confirm with user

Present this area's findings with clear hierarchy — product understanding leads, technical details follow:

#### Format:

**Area: {name}**

**What it does** (product lens — plain language, no class names or code patterns):
2-3 sentences explaining what this area does for the user. Flows, business rules,
constraints. Written like explaining to a product person.

**How it's built** (code lens — technical language OK here):
Key architecture, patterns, main files, dependencies. Brief.

**Diagrams:**
Show both updated diagrams inline (product overview + system overview).

Then AskUserQuestion with 2-3 questions only if genuinely ambiguous.
One confirmation covers both lenses. If nothing is ambiguous, show findings and proceed.

### 3f. Write both wikis

With confirmed understanding:

- `product-wiki/modules/{area}/README.md`
- `code-wiki/modules/{area}/README.md`
- Update running overviews (`product-wiki/overview.md`, `code-wiki/README.md`)

### 3g. Progress update

```
[████████████░░░░] 4/8 areas  |  billing: done
```

---

## Step 4: Cross-Cutting Pass

After all area waves are complete, synthesize cross-cutting content. Read already-written per-area wiki files rather than re-scanning code.

Finalize:

- `product-wiki/overview.md` — full product story synthesized from all module READMEs
- `code-wiki/architecture-map.md` — connections between areas, integrations
- `code-wiki/patterns.md` — patterns observed across areas
- `code-wiki/data-models.md` — cross-area entities and relationships
- Final versions of both overview diagrams

Present final diagrams to user for confirmation.

---

## Step 5: Spec Migration (conditional)

Only offered if old `product_specs/` or existing product knowledge docs are detected. This ENRICHES the already-populated product-wiki — the wave scan from Step 3 is the foundation.

Ask the user: **"I see existing specs in product_specs/. Want me to merge them into the product-wiki?"**

Options:

- "Yes, merge and archive old specs" (Recommended)
- "Skip — keep old specs as they are"

### If yes:

Read `~/.claude/supabuilder/reference/init-product-wiki.md` for the full enrichment + migration protocol.

1. **Analyze** old spec structure
2. **Enrich** product-wiki with additional context from specs (merge, don't overwrite codebase-derived content)
3. **Handle non-standard files** — playbooks, config logic, process docs → copy as-is into the appropriate wiki
4. **Extract technical content** to code-wiki (architecture decisions mixed into product specs)
5. **Cross-reference** with codebase to flag spec drift
6. **Archive** old specs to `supabuilder/.archive/product_specs_v1/`
7. **Write migration log** to `supabuilder/.archive/migration-log.md`

### If skipped:

Old specs remain untouched. Product-wiki still has codebase-derived content from the wave scan.

---

## Step 6: Completion

```
[████████████████] {N}/{N} areas  |  Complete!

Supabuilder initialized!

Workspace: supabuilder/
Orchestrator: .claude/CLAUDE.md
Product-wiki: populated with {N} modules
Code-wiki: populated with {N} modules

The orchestrator is now active. Start talking about what you want to build.
```

**Note:** If this is a fresh session, the orchestrator is active immediately. If you ran init mid-session, start a new conversation for the orchestrator brain in `.claude/CLAUDE.md` to fully load.

For small projects (1-3 areas), skip the progress bar line.

Show commands:

```
Commands:
  /supabuilder:mission    Explicitly start a mission
  /supabuilder:status     Check current state
  /supabuilder:settings   Configure cost mode, user control
```

---

## Edge Cases

- **Not a git repo** — works fine, skip git context
- **Empty project** — scaffold only, skip interview + wave scan (nothing to scan), ready for first mission
- **Context file `.claude/supabuilder-context.md` exists (old version)** — warn: "Found old supabuilder-context.md. The new version uses supabuilder/state.json and .claude/CLAUDE.md instead. You can safely delete the old file."
- **State file `.claude/supabuilder-state.json` exists (old version)** — same warning
- **Can't write files** — check permissions, print error
- `**.mcp.json` exists** — merge, don't overwrite
- **Very large codebase** — wave mode handles this naturally. Each wave is self-contained, preventing context overflow. After writing wiki content for an area, reference the files instead of holding raw scan data.


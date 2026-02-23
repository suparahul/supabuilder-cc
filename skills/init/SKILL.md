---
name: supabuilder:init
description: "Initialize Supabuilder in a project. Scans tech stack, creates context files, and optionally configures MCPs (Linear, Reddit)."
user-invocable: true
---

# Supabuilder Init

Initialize Supabuilder in the current project.

## What This Does

1. **Scans your project** — Detects tech stack, structure, existing work
2. **Creates context files** — `.claude/supabuilder-context.md` and `.claude/supabuilder-state.json`
3. **Creates project diagrams** — For existing codebases, generates architecture and module diagrams
4. **Offers MCP setup** — Optional Linear and Reddit integration (can skip)
5. **Says hello** — Confirms ready to go

## How to Use

In any project:

```bash
/supabuilder:init
```

You'll be asked 2 optional questions:
- "Configure Linear for ticket tracking?" (yes/no)
- "Add Reddit research for strategy?" (yes/no)

If you skip both, Supabuilder still works 100%.

## Implementation

When invoked, this skill:

1. **Project Scan** — Using Glob and Grep tools:
   - Find `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pubspec.yaml`, `Gemfile`, etc.
   - Detect language, framework, main dependencies
   - Map directory structure (find `src/`, `lib/`, `app/`, `tests/`, etc.)
   - Check for `CLAUDE.md`, `product_specs/`, existing specs
   - Read `.env.example` if exists
   - Check git status (current branch, recent commits)

2. **Create Product Specs Directory Scaffold:**

   **Case 1: No `product_specs/` exists (new project or first init):**
   ```
   Create:
     product_specs/
     product_specs/_overview.md (stub: "# Product Overview\nCreated by /supabuilder:init. Strategist populates during first sprint.")
     product_specs/_technical.md (stub: "# Technical Overview\nArchitect populates during first sprint.")
     product_specs/_rules/ (with README.md: "Add coding guidelines, conventions, and tech stack rules here. All agents read these.")
     product_specs/_shared/ (empty dir)
   ```

   **Case 2: Code exists but no `product_specs/` (existing codebase, first init):**
   ```
   1. Create base scaffold (same as Case 1)
   2. Scan codebase for feature/module boundaries:
      - Look for src/features/*, lib/features/*, app/modules/*, pages/*, routes/*
      - Look for directory patterns that suggest modules (auth/, settings/, dashboard/)
      - Read package.json/pubspec.yaml for feature-related dependencies
   3. For each detected module, create:
      product_specs/{module-name}/
      product_specs/{module-name}/_overview.md
        → "# {Module Name}\nDetected from: {source path}\nStatus: Existing code, needs spec."
   4. List all detected modules in product_specs/_overview.md under a "## Detected Modules" section
   ```

   **Case 3: `product_specs/` already exists:**
   - Check if it uses old structure (`functional_requirements.md`, `technical_spec.md`, `_module_overview.md`, etc.)
   - If old structure detected: warn user that Supabuilder now uses the new structure. List the file name changes:
     - `_module_overview.md` → `_overview.md`
     - `functional_requirements.md` → `requirements.md`
     - `logic_and_constraints.md` → `constraints.md`
     - `app_flows.md` → `flows.md`
     - `screens_and_components.md` → `screens.md`
     - `technical_spec.md` → split into `architecture.md`, `data_models.md`, `schema.sql`, `manifest.md`, `sequence.md`
     - `implementation_tickets.md` → `tickets.md` + `tickets/wave_N.md`
     - `STRATEGIC_DISCUSSION.md` → `_strategic.md`
     - `00_product_overview.md` → `_overview.md` (root)
     - `01_technical_overview.md` → `_technical.md` (root)
     - `agent_rules/` → `_rules/`
     - `shared/` → `_shared/`
   - Do NOT auto-migrate. The user restructures manually.
   - If new structure or empty: skip, don't overwrite

3. **Create Context File** — Write to `.claude/supabuilder-context.md`:
   ```markdown
   # Project Context — {detected project name}
   Generated: {timestamp}

   ## Tech Stack
   - Language: {detected}
   - Framework: {detected}
   - Package Manager: {detected}

   ## Project Structure
   {directory tree of key directories}

   ## Key Configuration
   - CLAUDE.md: {exists or not}
   - Agent Rules: {exists or not}

   ## Dependencies
   {top 5-10 dependencies with versions}

   ## What's Been Built
   {list of existing modules, if product_specs/ exists}

   ## Git Context
   - Branch: {current}
   - Recent commits: {last 3}
   ```

4. **Create State File** — Write to `.claude/supabuilder-state.json` (if doesn't exist):
   ```json
   {
     "active_sprints": [],
     "cost_mode": "smart",
     "debate_visibility": "key_decisions"
   }
   ```

5. **Optional MCP Setup** — Ask user via AskUserQuestion:
   - "Configure Linear for ticket tracking?"
   - "Add Reddit for community research?"

   If yes, create `.mcp.json` entries in `.claude/` with placeholder env var instructions.

6. **CRITICAL: Create Project Diagrams** — For existing projects with code, this step is MANDATORY. Do not proceed to the welcome message without completing diagram generation. After creating the context file, use `/sketch` to create visual artifacts in `.claude/scratchpad/project-overview/`:

   - **Project architecture diagram** — High-level view of the system: major modules/directories, how they connect, external services, database. Anyone new to the project should be able to look at this and understand the system structure.
   - **Module relationship map** — If `product_specs/` exists with multiple modules, diagram how modules relate to each other (dependencies, shared data, integration points).
   - **Feature landscape diagram** — What's built vs what's spec'd vs what's planned. A visual status map of the product.

   Reference these diagrams in `.claude/supabuilder-context.md` under a new section:
   ```markdown
   ## Visual Overview
   - Project architecture: `.claude/scratchpad/project-overview/project-architecture.excalidraw`
   - Module relationships: `.claude/scratchpad/project-overview/module-relationships.excalidraw`
   - Feature landscape: `.claude/scratchpad/project-overview/feature-landscape.excalidraw`
   ```

   Skip any diagram that doesn't apply (e.g., no module map if there's only one module or no `product_specs/`).

   **Before printing the welcome message:** If code was detected in Step 1, verify `.claude/scratchpad/project-overview/project-architecture.excalidraw` exists. If missing, go back and complete Step 6.

7. **Welcome Message** — Print (under 20 lines):
   ```
   ✅ Supabuilder initialized!

   Your project context is ready. You now have:
   - `.claude/supabuilder-context.md` — Project awareness for agents
   - `.claude/supabuilder-state.json` — Sprint tracking
   - `product_specs/` — Spec directory with structure scaffold
   - Diagrams: `.claude/scratchpad/project-overview/` (open in VS Code or browser)

   {If modules were detected: "Detected modules: {list}. Each has a placeholder _overview.md."}

   Next step:
   /supabuilder:start

   Tell me about a feature idea, and I'll guide you through spec.
   ```

## Edge Cases

- **Context file exists**: Ask "Update context or keep existing?" (User choice)
- **Project not a git repo**: Still works, skip git section
- **No dependencies detected**: Skip dependencies section
- **Empty project**: Still creates files, system is ready for day-1 planning

## Error Handling

- If project scan fails → Print friendly error, suggest `/supabuilder:start` anyway
- If can't write context file → Check permissions, print error
- If `.mcp.json` exists → Merge new entries, don't overwrite

## Reference

Read `skills/_shared/orchestrator-context.md` for shared logic:
- State file structure
- Context file template
- MCP integration details

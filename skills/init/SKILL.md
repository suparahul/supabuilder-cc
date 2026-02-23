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
3. **Offers MCP setup** — Optional Linear and Reddit integration (can skip)
4. **Says hello** — Confirms ready to go

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

2. **Create Context File** — Write to `.claude/supabuilder-context.md`:
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

3. **Create State File** — Write to `.claude/supabuilder-state.json` (if doesn't exist):
   ```json
   {
     "active_sprints": [],
     "cost_mode": "smart",
     "debate_visibility": "key_decisions"
   }
   ```

4. **Optional MCP Setup** — Ask user via AskUserQuestion:
   - "Configure Linear for ticket tracking?"
   - "Add Reddit for community research?"

   If yes, create `.mcp.json` entries in `.claude/` with placeholder env var instructions.

5. **Welcome Message** — Print (under 20 lines):
   ```
   ✅ Supabuilder initialized!

   Your project context is ready. You now have:
   - `.claude/supabuilder-context.md` — Project awareness for agents
   - `.claude/supabuilder-state.json` — Sprint tracking

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

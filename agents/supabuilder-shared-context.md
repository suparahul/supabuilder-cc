# Supabuilder Team Shared Context

This file is NOT an agent — it contains shared reference material for all team members. Agents should read this file at the start of their session.

## Spec File Ownership Matrix

| File | Owner (writes) | Consumers (reads) |
|------|---------------|-------------------|
| `_module_overview.md` | PM | Designer, Strategist, Architect |
| `functional_requirements.md` | PM | Designer, Architect, TechPM, QA |
| `logic_and_constraints.md` | PM | Architect, QA |
| `app_flows.md` | Designer | QA, Dev |
| `screens_and_components.md` | Designer | Dev |
| `technical_spec.md` | Architect | Dev, TechPM, QA |
| `shared/_business_rules.md` | PM | Architect, QA |
| `shared/_data_models.md` | Architect | PM, Dev |
| `shared/_database_schema.sql` | Architect | Dev |
| `shared/_ui_kit.md` | Designer | Dev |
| `shared/_technical_details.md` | Architect | Dev |
| `shared/_linear_config.md` | TechPM | — |
| `00_product_overview.md` | Strategist | PM |
| `01_technical_overview.md` | Architect | All |

**Conflict prevention**: If you need changes in a file you don't own, create a task for the owning agent with specific change description. Never write to files you don't own.

## The Lifecycle Loop

Supabuilder doesn't stop at specs. The team stays engaged through build, review, test, and revision.

### Feedback Routing Protocol

When post-implementation findings surface, route them to the right spec owner:

| Finding Type | Route To | Action |
|---|---|---|
| Missing requirement | PM | Update functional_requirements.md or logic_and_constraints.md |
| UX gap (flow doesn't feel right) | Designer | Update app_flows.md or screens_and_components.md |
| Technical constraint / architecture issue | Architect | Update technical_spec.md |
| Scope drift (feature does more/less than intended) | Strategist | Review against 00_product_overview.md |
| Implementation bug (code is wrong, spec is right) | Dev/TechPM | Create Linear subtask (not a spec issue) |

### Specs Are Living Documents

Specs are never "done." They evolve as:
- Code reveals constraints the spec didn't anticipate
- QA finds gaps the spec didn't cover
- Users interact with the product in unexpected ways
- Strategy shifts based on what's learned

When an agent updates a spec file based on post-implementation findings, they announce the change with a summary: **"Revised: `[file path]` — [what changed and why]"**

### The Loop in Practice

```
Spec → Build → Review (Dev) → Test (QA) → Findings surface →
  → Spec gap? → Route to spec owner → Spec revised → Back to Build
  → Implementation bug? → Linear subtask → Dev fixes → Back to Test
```

The orchestrator re-engages spec agents when findings require spec changes. This is not an exception — it's the normal workflow.

---

## Work Size Classification

| Size | Signals | Agent Pipeline |
|------|---------|---------------|
| **Rock** | New module, major feature, cross-module impact, needs research | All 7 agents, full spec cycle |
| **Pebble** | Enhancement, new screen, significant logic change, contained scope | PM, Designer, Architect, TechPM, Dev |
| **Sand** | Bug fix, copy change, minor tweak, config update | Smart routing to appropriate agent(s) + QA |

## Collaboration Protocol

### How to Collaborate
- Use **SendMessage** (DM) for direct agent-to-agent communication
- Use **AskUserQuestion** when you need user input — don't guess
- Present **2-3 options** for decisions, not 4+ (users prefer fewer choices)

### Key Collaboration Pairs

**During spec phase:**
- **PM ↔ Designer**: Debate UX vs requirements tradeoffs. "That flow is elegant but it doesn't handle the edge case where..."
- **PM ↔ Architect**: Feasibility checks. "Can we actually build this without restructuring the data model?"
- **Designer ↔ Architect**: UI implementation constraints. "This animation requires X framework support."
- **Strategist ↔ PM**: Vision alignment. "Does this feature align with our roadmap?"

**During build/review/test phase (the feedback loop):**
- **QA → PM**: Gap routing. "The spec doesn't cover what happens when X. Here's what broke."
- **QA → Designer**: UX issues. "This flow confuses users because..."
- **Dev → Architect**: Implementation reality. "The spec says X but the codebase does Y."
- **Dev → PM**: Requirement clarity. "The spec is ambiguous about Z — which behavior is correct?"

### Debate Visibility Modes
Read from `.claude/supabuilder-state.json` field `debate_visibility`:
- `key_decisions` (default): Debate privately via SendMessage. Surface 2-3 options to user at decision points.
- `show_all`: All agent-to-agent messages visible to user.
- `summaries_only`: Agree internally, present recommendation. User approves or redirects.

### Cost Modes
Read from `.claude/supabuilder-state.json` field `cost_mode`:
- `quality`: 5 debate rounds max. Deep exploration.
- `smart` (default): 3 debate rounds max. Good balance.
- `budget`: 1 debate round. Each agent presents individual opinion, no back-and-forth.

## Session Startup Protocol

Every team member should do this at session start:
1. Read the project's `CLAUDE.md` for spec structure and context tree rules
2. Read `product_specs/agent_rules/` for coding/tech guidelines
3. Read `.claude/supabuilder-state.json` for active work context, cost mode, debate visibility
4. Read `.claude/supabuilder-context.md` for project context (tech stack, structure, what's been built)
5. Read `.claude/napkin.md` for project-specific mistakes and patterns
6. Check your team's task list for assigned work

## Output Standards

### Announcing Changes
After modifying any spec file, announce: **"Updated: `[file path]` — [brief summary of change]"**

### Functional Requirements Format
```
FR-001: [description]
  AC: [acceptance criteria]
```

### Decision Presentation
- **Simple decisions** → AskUserQuestion with 2-3 structured options
- **Complex decisions** → Narrative explanation + comparison table + AskUserQuestion

## Scratchpad

Location: `.claude/scratchpad/{feature-name}/`
- For HTML/CSS/JS prototypes, Excalidraw files, comparison materials
- Auto-gitignored
- Serve locally: `python3 -m http.server 8080 --directory .claude/scratchpad/`

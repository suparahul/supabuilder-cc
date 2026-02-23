---
name: supabuilder:review
description: "Bring in Dev and QA to review what's been built. Dev checks code against spec, QA tests from user perspective."
user-invocable: true
---

# Supabuilder Review

Review implemented code with Dev and QA agents.

## How to Use

After you've built a feature:

```bash
/supabuilder:review
```

Or be specific:

```bash
/supabuilder:review user-authentication
```

This spawns **Dev** (code review) → **QA** (user perspective testing).

## What Happens

### Dev Review (First)

Dev reads the feature's `technical_spec.md` and reviews the code:
- Is implementation matching spec?
- Are conventions followed (Riverpod, Freezed, GoRouter, etc.)?
- Is error handling complete?
- Are there architecture violations?

Dev reports:
- ✅ **Approve** — Code matches spec, conventions followed
- ⚠️ **Approve with comments** — Works but needs minor fixes
- ❌ **Changes required** — Spec mismatch or major issues

If **spec mismatch** (not code bug), Dev messages **Architect** to revise spec.

### QA Testing (After Dev)

QA walks through the feature as a real user:
- Does it work end-to-end?
- Do flows from `app_flows.md` actually work?
- Do acceptance criteria from `functional_requirements.md` pass?
- What about edge cases, error states, empty states?
- How does it feel? (timing, clarity, UX intuitiveness)

QA reports findings:
- **Critical** — Broken, data loss, crashes
- **Major** — Feature works but incorrectly or bad UX
- **Minor** — Cosmetic, slightly off behavior
- **Improvement** — Not a bug, just a suggestion

QA routes findings:
- **Spec gap** → Message PM/Designer/Architect (not a code bug, spec needs updating)
- **Implementation bug** → Create Linear subtask (code is wrong, spec is right)
- **UX issue** → Message Designer for flow revision

### Summary to You

After both agents complete:
- Dev findings (by severity)
- QA findings (by severity, with routing)
- Recommendation: "Ready to ship" / "Needs fixes" / "Needs spec revision"

If spec revisions needed, offer: "Want me to bring in PM/Designer/Architect to update specs?"

## Implementation

When invoked:

1. **Check sprint context** — Read `.claude/supabuilder-state.json` for active sprint

2. **Spawn Dev** (code review):
   ```
   You are Dev reviewing: {feature name}

   Read (skip if missing):
   - CLAUDE.md (project conventions)
   - .claude/supabuilder-context.md (project context, tech stack)
   - product_specs/{module}/technical_spec.md (what was designed)
   - product_specs/agent_rules/ (coding guidelines for THIS project)
   - .claude/napkin.md (known patterns and corrections)
   - agents/supabuilder-shared-context.md (routing protocols)

   IMPORTANT: Read agent_rules/ to understand THIS project's conventions. Don't assume a specific framework — check what the project actually uses and review against those patterns.

   Review the code:
   - Check all files in technical_spec.md file manifest exist
   - Verify patterns match agent_rules/ conventions
   - Run the project's lint/analyze commands (read from agent_rules/ or supabuilder-context.md)
   - Verify state management is complete (loading, error, success states)
   - Check error handling at system boundaries

   For each finding, determine ROOT CAUSE:
   - Code is wrong, spec is right → Create Linear subtask (or markdown finding). Include file path, line ref, what's wrong, suggested fix.
   - Spec is wrong or ambiguous → Message Architect via SendMessage: "The spec says X but the codebase pattern is Y. Spec needs updating."
   - Requirement ambiguity → Message PM: "The spec is ambiguous about Z."

   Severity: Blocking / Non-blocking / Suggestion

   Overall assessment: Approve / Approve with comments / Changes required
   ```

3. **Wait for Dev completion**

4. **Spawn QA** (user perspective testing):
   ```
   You are QA testing: {feature name}

   Read (skip if missing):
   - .claude/supabuilder-context.md (project context)
   - product_specs/{module}/app_flows.md (all flows to walk through)
   - product_specs/{module}/screens_and_components.md (expected screens)
   - product_specs/{module}/functional_requirements.md (acceptance criteria)
   - product_specs/{module}/logic_and_constraints.md (business rules)
   - agents/supabuilder-shared-context.md (routing protocols)

   Test as a REAL USER:
   - Walk through EVERY flow from app_flows.md
   - First-time user perspective: Is it obvious what to do? Are empty states helpful?
   - Happy path: Does the core flow feel smooth?
   - Error recovery: When things go wrong, is it clear what happened and how to fix?
   - Edge cases: Long text, rapid actions, no network, extreme inputs
   - Feel: Does interaction timing feel right? Transitions smooth?
   - Verify EVERY acceptance criterion from functional_requirements.md

   For each finding, determine ROOT CAUSE and route:
   - Missing requirement (spec didn't cover this) → Message PM via SendMessage + label "spec-gap"
   - UX doesn't feel right → Message Designer via SendMessage + label "spec-gap"
   - Technical constraint → Message Architect via SendMessage + label "spec-gap"
   - Scope drift (does more/less than intended) → Message Strategist
   - Implementation bug (code wrong, spec right) → Create Linear subtask (or markdown finding)

   If multiple findings share one root cause, consolidate: "These 3 issues all stem from one spec gap..."

   Severity: Critical / Major / Minor / Improvement
   Summary: Count by severity, overall assessment, routing map
   ```

5. **Collect findings and present**:
   - Dev results (by severity)
   - QA results (by severity, categorized)
   - Combined recommendation
   - If spec revisions needed, list which agents should revise

6. **Offer next steps**:
   - "Ready to ship!"
   - "Fix these 3 bugs, then ready"
   - "Need PM to revise requirements based on QA findings"

## The Feedback Loop (Post-MVP Capabilities)

When findings route back to spec owners:
- **QA finds spec gap** → PM revises requirements
- **Dev finds architecture issue** → Architect revises technical spec
- **QA finds UX problem** → Designer revises flows
- **Strategist checks** (if scope drift detected)

After spec revisions, cycle back through build → review → test until solid.

## Edge Cases

- **Spec file doesn't exist** — QA/Dev error out with helpful message
- **No code to review** — Dev notes "No implementation found"
- **Multiple findings of same root cause** — QA consolidates into one routing message ("These 3 bugs all stem from the same spec gap...")
- **User wants to skip QA** — Just run Dev review, skip QA step

## Reference

Read `skills/_shared/orchestrator-context.md` for:
- Finding routing protocol
- Spec ownership matrix
- Lifecycle loop details

# Visual-First Protocol — Reference

Read this when spawning any agent. Include the diagram directives in every context packet.

---

## Core Principle

Diagrams are the primary language of Supabuilder agents. Agents diagram to THINK — not just to document. When an agent is reasoning through a problem, comparing options, explaining a finding, or presenting a plan, the first instinct is to draw it. A diagram that gets the idea across in 10 seconds beats a paragraph that takes 2 minutes to read.

Diagrams are not a pre-step before "real work." They ARE the work. They show up in every mood:

- **discuss** — diagram to show understanding ("here's what I think you're asking for")
- **research** — diagram to map findings ("here's what I found and how it connects")
- **explore** — diagram each option so the user can feel the difference visually
- **write** — diagram before prose. Spec files explain what the diagram shows.
- **build** — diagram to show what was built, what broke, what the dependency graph looks like

---

## When to Diagram

- When comparing options — one diagram per option, not a text table
- When explaining a flow — show it, don't describe it
- When presenting findings — map relationships visually
- When planning work — show waves, dependencies, critical path
- When reporting bugs — show expected vs actual flow with breakpoint highlighted
- When you're about to write a wall of text — stop, diagram instead

Agents should spin up quick throwaway diagrams freely. Not every diagram needs to be a polished deliverable. A rough sketch that communicates an idea is valuable.

---

## Spec Gate

Before any agent writes or updates a spec/deliverable markdown file, the corresponding diagram MUST exist. Create it with `/sketch` first. Prose without a diagram reference is incomplete.

This applies to formal deliverables (requirements, architecture, flows, etc.) — not to throwaway thinking diagrams.

---

## Diagram Save Locations

| Context | Save to |
|---------|---------|
| Active mission (all agent work) | `supabuilder/missions/{id}/diagrams/` |
| Wiki diagrams (product or system overviews) | `supabuilder/product-wiki/` or `supabuilder/code-wiki/` |
| No active mission (ad-hoc exploration) | `supabuilder/diagrams/` |

All diagrams stay inside mission or workspace folders. No diagrams in `.claude/scratchpad/`.

---

## Diagram Naming

All diagrams use `{feature}-{type}.excalidraw`:

| Type | File pattern | Example |
|------|-------------|---------|
| User journey / flow | `{feature}-user-flow.excalidraw` | `sharing-user-flow.excalidraw` |
| Feature scope tree | `{feature}-scope-tree.excalidraw` | `sharing-scope-tree.excalidraw` |
| System architecture | `{feature}-architecture.excalidraw` | `sharing-architecture.excalidraw` |
| Data flow | `{feature}-data-flow.excalidraw` | `sharing-data-flow.excalidraw` |
| ER diagram | `{feature}-er-diagram.excalidraw` | `sharing-er-diagram.excalidraw` |
| Sequence diagram | `{feature}-sequence.excalidraw` | `sharing-sequence.excalidraw` |
| Screen relationship map | `{feature}-screen-map.excalidraw` | `sharing-screen-map.excalidraw` |
| Wireframe layout | `{feature}-wireframe-{screen}.excalidraw` | `sharing-wireframe-detail.excalidraw` |
| Market positioning | `{feature}-positioning.excalidraw` | `sharing-positioning.excalidraw` |
| Sprint plan | `{feature}-sprint-plan.excalidraw` | `sharing-sprint-plan.excalidraw` |
| Ticket dependency graph | `{feature}-ticket-deps.excalidraw` | `sharing-ticket-deps.excalidraw` |
| Bug flow | `{feature}-bug-{id}.excalidraw` | `sharing-bug-SUP-042.excalidraw` |
| Quick thinking sketch | `{feature}-sketch-{topic}.excalidraw` | `sharing-sketch-auth-options.excalidraw` |

---

## Agent Diagram Responsibilities

| Agent | Primary diagrams | When |
|-------|-----------------|------|
| **PM** | User journey maps, feature scope trees, solution path comparisons, requirement dependency graphs | Thinking through scope, comparing approaches, before writing requirements |
| **Strategist** | Market positioning maps, priority quadrants, user segment diagrams, roadmap visualizations | During strategic reasoning, when presenting direction options |
| **Architect** | System architecture, data flow, ER diagrams, sequence diagrams | Thinking through technical approaches, before writing architecture specs |
| **Designer** | Flow diagrams (per variation), screen relationship maps, wireframe layouts, information architecture | Exploring design options, before writing flows/screens |
| **TechPM** | Sprint wave visualizations, ticket dependency graphs, progress dashboards | Planning waves, before presenting roadmap |
| **QA** | Bug flow diagrams (expected vs actual, breakpoint highlighted), test coverage maps | For Major/Critical findings, when mapping test coverage |

---

## How Specs Reference Diagrams

At the top of each relevant section, add a diagram reference before the prose:

```
> **Diagram:** `supabuilder/missions/{id}/diagrams/{diagram-file}.excalidraw`
```

The prose then explains what the diagram shows.

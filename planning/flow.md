After init completes, the next natural flow is:

  1. User starts a new session → orchestrator loads (.claude/CLAUDE.md)
    - Session Startup runs → reads state.json, greets with context
  2. User says something → Conversation Routing kicks in
    - Most likely Route B (new work) or Route C (just talking) since no missions exist
  yet
  3. User describes what they want to build → Route B triggers:
    - Orchestrator reads reference/missions.md to classify the mission type and
  determine the pipeline
    - Then follows the skills/supabuilder:mission/SKILL.md flow to create the mission
  folder
  4. First agent spawns → Orchestrator reads reference/coordination.md to prepare the
  context packet
  5. Agent runs in plan mode → gate check via reference/gates.md
  6. Pipeline continues agent by agent, with reference/state.md consulted on every state
   write
  7. Build phase → reference/build-phase.md
  8. User interaction calibration throughout → reference/user-interaction.md

  So the next document to review in natural order is reference/missions.md — that's the
  first reference file the orchestrator reaches for when the user describes work.
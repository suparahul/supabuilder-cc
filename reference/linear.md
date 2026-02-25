# Linear Integration — Reference

Read this when TechPM needs to create, update, or query tickets in Linear.

## MCP Tools Available

When Linear MCP is configured (check `.mcp.json`), these tool patterns are available:

- `mcp__linear__create_issue` — create a ticket
- `mcp__linear__update_issue` — update status, assignee, priority
- `mcp__linear__search_issues` — find existing tickets
- `mcp__linear__list_projects` — discover available projects
- `mcp__linear__list_teams` — discover teams

## Ticket Creation Pattern

1. Read mission.json `tracker` field for team/project context
2. Create parent issues as per TechPM's breakdown
3. Create subtasks under the parent
4. Set dependencies between tickets
5. Add mission id in the task tags
6. Update mission.json `tracker.parent_ticket` with the parent issue ID

## When Linear Is NOT Configured

Write tickets to `tickets.md` in the mission folder using the standard ticket body format from TechPM's identity. User can import later or configure Linear with `/supabuilder:init`.

## Future Connectors

This is the first connector reference. Future additions:
- Notion (doc syncing)
- Asana (ticket management)
- Google Sheets (tracking)

---
name: sketch
description: Create and manage Excalidraw diagrams for visual collaboration. Use for flow diagrams, architecture diagrams, wireframes, and any visual thinking.
user-invocable: true
argument-hint: [new <name> | open <name> | list]
---

# Sketch — Excalidraw Visual Collaboration

Create and manage Excalidraw diagrams for collaborative visual thinking. Claude writes the diagram, you edit in your browser or VS Code, Claude reads your changes and responds.

## Default Locations

- **Mission diagrams:** `supabuilder/missions/{id}/diagrams/` (when a mission is active)
- **Wiki diagrams:** `supabuilder/product-wiki/` or `supabuilder/code-wiki/`
- **Ad-hoc diagrams:** `supabuilder/diagrams/` (no active mission)

All diagrams stay inside the `supabuilder/` workspace.

## Commands

### `/sketch new <name>`

Create a new Excalidraw diagram.

1. Determine save location:
   - If a Supabuilder mission is active → `supabuilder/missions/{id}/diagrams/<name>.excalidraw`
   - If `supabuilder/` exists but no active mission → `supabuilder/diagrams/<name>.excalidraw`
   - Otherwise → current directory `<name>.excalidraw`
2. Create the `.excalidraw` file and initialize with a basic Excalidraw JSON structure based on context:
   - If the user described a flow → create a flow diagram template
   - If the user described architecture → create a system diagram template
   - If the user described a screen → create a wireframe template
   - Otherwise → create a blank canvas with a title
3. Tell the user how to open it:
   ```
   Diagram created: <path>/<name>.excalidraw

   To view/edit:
   - VS Code: Install "Excalidraw" extension, then open the file
   - Browser: Go to excalidraw.com, File → Open, select the file

   Edit the diagram, save the file, then tell me and I'll read your changes.
   ```

### `/sketch open <name>`

Open an existing diagram for review.

1. Look for `<name>.excalidraw` in mission diagrams, workspace diagrams, wiki folders, and current directory
2. If found, read the file and describe what's in the diagram:
   - List the elements (boxes, arrows, text)
   - Describe the overall structure
   - Ask what the user wants to change
3. If not found, list available diagrams and suggest creating a new one

### `/sketch list`

List all diagrams in the workspace.

1. Glob for `*.excalidraw` files in `supabuilder/` (missions, wikis, ad-hoc) and current directory
2. For each file, show:
   - Name
   - Last modified date
   - Brief description (from reading the file)
3. If no diagrams found: "No diagrams yet. Create one with `/sketch new <name>`"

## If $ARGUMENTS is empty

Show help:
```
Sketch — Excalidraw Visual Collaboration

Commands:
  /sketch new <name>    Create a new diagram
  /sketch open <name>   Open and review an existing diagram
  /sketch list          List all diagrams

How it works:
1. I create/update the .excalidraw file
2. You open it in VS Code (Excalidraw extension) or excalidraw.com
3. You edit it, save the file
4. Tell me you made changes and I'll read them
5. We iterate together!
```

## Excalidraw JSON Structure

When creating diagrams, use this basic structure:
```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "claude-supabuilder",
  "elements": [],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#ffffff"
  },
  "files": {}
}
```

### Element Types
- **rectangle**: Boxes for screens, components, services
- **ellipse**: Circles for states, decision points
- **arrow**: Connections between elements
- **text**: Labels, annotations, descriptions
- **line**: Simple lines for grouping or separation

### Color Palette for Diagrams
Use these colors for consistency:
- Screens/UI: `#a5d8ff` (light blue)
- Services/API: `#b2f2bb` (light green)
- Database: `#ffec99` (light yellow)
- User actions: `#ffc9c9` (light red)
- Arrows: `#495057` (dark gray)

## Co-editing Loop

The collaboration flow:
1. **Claude writes** → Creates/updates .excalidraw file with elements
2. **User opens** → Views in VS Code or browser
3. **User edits** → Moves elements, adds annotations, changes layout
4. **User saves** → File updated on disk
5. **User tells Claude** → "I updated the diagram" or "check my changes"
6. **Claude reads** → Reads the file, understands changes, responds
7. **Repeat** → Continue iterating until the diagram captures the idea

When reading user changes, look for:
- New elements they added (annotations, questions, alternative paths)
- Elements they moved (indicates different mental model of relationships)
- Elements they deleted (indicates disagreement or simplification)
- Text they changed (corrections, clarifications)

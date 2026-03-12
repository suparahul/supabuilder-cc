# Prototyping Reference

Designer reads this when entering **explore** or **write** mood.

---

## File Structure

**Hard limit: 400-500 lines per HTML file.** Split at UX boundaries:
- One file per screen or page (`login.html`, `dashboard.html`, `settings.html`)
- One file per flow step (`onboarding-1-profile.html`, `onboarding-2-prefs.html`)
- Shared styles in `_styles.css`, shared toggle logic in `_controls.js`

```
prototypes/
├── index.html              ← navigation hub linking all screens
├── _styles.css             ← shared styles (imports UI Kit)
├── _controls.js            ← shared state toggle logic
├── login.html
├── dashboard.html
├── settings.html
└── onboarding-1-profile.html
```

Naming: lowercase-kebab-case. Multi-step flows: `{flow}-{step}-{name}.html`.

## Navigation

Every prototype set has an `index.html` — the navigation hub:
- Lists all screens grouped by flow/area
- Links to each screen
- Indicates which screens have state variations

Every page includes a persistent nav bar with:
- Link back to index
- Links to previous/next screens in the flow
- Current screen highlighted

## State Controls

Build a floating control panel (fixed, bottom-right, collapsible) into each prototype for switching between states:

```
[State Controls]
  Data:    [Default] [Empty] [Full]
  Status:  [Normal] [Loading] [Error]
```

Toggle logic lives in `_controls.js` — shows/hides DOM sections via CSS classes. Active state visually indicated.

**Required states for every screen:** default (realistic data), empty (zero items), loading, error.
**Optional:** disabled elements, selected/active, different data volumes (1 vs 100 items).
**When product has multiple user types:** prototype each screen for each relevant user type. Add a user-type toggle to the control panel (e.g., [Admin] [Teacher] [Student]).

## Variations

During explore mood, decide per-variation:

| Variation scope | Where it lives | Navigation |
|---|---|---|
| **Small** — color, copy, placement tweaks | In-file toggle in control panel | Toggle button |
| **Medium** — different layout for one screen | In-file toggle if <100 extra lines, else separate file | Toggle or link |
| **Large** — different flow structure or screen set | Separate folder in `_explorations/` | comparison.html links to each |

Large variation structure:
```
_explorations/
├── variation-a/
│   ├── index.html
│   ├── _styles.css         ← imports from ../prototypes/_styles.css, overrides
│   └── {screens}.html
├── variation-b/
│   └── ...
└── comparison.html          ← side-by-side summary linking each variation
```

Present `comparison.html` to the user during explore mood. After selection, chosen variation becomes the prototype in `prototypes/`. Rejected variations stay in `_explorations/`.

## UI Kit

The UI Kit defines the product's visual language as reusable CSS — colors, typography, spacing, components. Lives at the product level (persists across missions).

**Location:** `product-wiki/ui-kit/`

```
product-wiki/ui-kit/
├── README.md               ← design language overview, source framework, decisions
├── tokens.css              ← CSS custom properties: colors, spacing, typography, radii
├── components.css          ← reusable classes: buttons, cards, inputs, modals
└── preview.html            ← live preview showing all tokens and components
```

**Prototypes import it:**
```css
/* _styles.css */
@import '../../product-wiki/ui-kit/tokens.css';
@import '../../product-wiki/ui-kit/components.css';
/* Mission-specific styles below */
```

**Creating the UI Kit:**
- **New product:** Create during first mission's explore mood. Start minimal — expand as more screens are designed.
- **Existing product:** Extract design tokens from codebase (see Design Language Extraction below). If no UI Kit exists when you're spawned, establish one in your discuss mood.

**Maintaining:** You own the UI Kit. Update during missions when new patterns emerge. Keep `preview.html` current.

## Design Language Extraction

For existing codebases, extract the visual language from code into the HTML/CSS UI Kit.

### When does this happen?

Init detects token source files and records their paths in `code-wiki/`. The Designer does the actual extraction during their first mission — this is NOT an init-time task.

- **Existing product with detected tokens:** During your first explore mood, extract tokens from the paths listed in code-wiki before prototyping screens. Validate the extracted UI Kit with the user.
- **New product (no codebase yet):** No extraction needed — you're creating the visual language from scratch (see Visual Language for New Products below).

### Where to find tokens

| Framework | Token sources |
|---|---|
| Flutter | `ThemeData`, `ColorScheme`, `TextTheme` |
| React + Tailwind | `tailwind.config.js`, CSS custom properties |
| React + CSS-in-JS | Theme objects, styled-components theme |
| SwiftUI | Asset catalogs, Color extensions |
| Any | Shared constants, design token files, style utilities |

### Process

Scan theme/config files → map to CSS custom properties (`Colors.blue[700]` → `--color-primary: #1976D2`) → build component classes matching existing patterns → create `preview.html` → present to user for validation.

HTML/CSS prototypes won't pixel-match native apps. The goal is **visual kinship** — same color temperature, density, typography character, spacing rhythm.

## Visual Language for New Products

Establishing a visual language for a new product is **significant creative work** — not something to rush through as a side task during prototyping. Treat it as a first-class deliverable.

During **explore mood** for a new product's first mission:
- Dedicate time to visual language exploration alongside screen variations
- Explore 2-3 visual directions (color palettes, type scales, spacing systems, component styles)
- Present visual directions to user before committing to one
- Build the UI Kit from the chosen direction
- Then prototype screens using the established kit

The visual language sets the tone for every future screen. Get it right early — changing it later means reworking everything.

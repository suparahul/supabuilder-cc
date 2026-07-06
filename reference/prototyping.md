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
│   ├── _styles.css         ← imports from ../../prototypes/_styles.css, overrides
│   └── {screens}.html
├── variation-b/
│   └── ...
└── comparison.html          ← side-by-side summary linking each variation
```

Present `comparison.html` to the user during explore mood. After selection, chosen variation becomes the prototype in `prototypes/`. Rejected variations stay in `_explorations/`.

## UI Kit

The UI Kit defines the product's visual language as reusable CSS, a browsable preview, and a screens library. It lives at `product-wiki/ui-kit/` (persists across missions). **The canonical spec — structure, README sections, theming, creation, currency check, kit sync — is `~/.claude/supabuilder/reference/ui-kit.md`.** Read it before any kit work. Summary of what matters while prototyping:

**Single import point.** Each mission's prototypes import the kit in exactly one file — `prototypes/_styles.css`. Everything else chains through it (prototype pages import `_styles.css`; exploration variants import `../../prototypes/_styles.css`). Never import the kit from any other file.

```css
/* missions/{id}/prototypes/_styles.css */
@import '../../../product-wiki/ui-kit/tokens.css';
@import '../../../product-wiki/ui-kit/components.css';
/* Mission-specific styles below */
```

**Only `tokens.css` and `components.css` are importable.** The kit's `.html` pages are documentation; `_preview.css` is preview chrome — prototypes never import either.

**Timing.** Init only records token sources in the kit README (`## Sources`). You build the kit in your first design mission's **explore mood Phase 1** (extraction for existing codebases, visual-language exploration for new products — both defined in ui-kit.md). In later missions you run the currency check (ui-kit.md) instead of rebuilding.

**Build on existing screens.** Before designing a screen, check the kit README's `## Screens` registry. If the screen exists, start from `ui-kit/screens/{slug}.html` and evolve it — don't reimagine a screen another mission already designed. New tokens/components you introduce get extracted into the kit at mission completion (kit sync), not left in mission CSS.

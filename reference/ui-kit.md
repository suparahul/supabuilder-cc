# UI Kit — Reference

The canonical spec for the product UI Kit. Read this when: creating the kit (Designer, first design mission), running the currency check (Designer, discuss/research of every design mission), prototyping against the kit (Designer, explore/write), or running the kit sync at mission completion (Designer, spawned by orchestrator).

The UI Kit is the product's visual language as reusable CSS + a browsable preview + a library of current-state screen designs. It lives at the product level and persists across missions. The Designer owns it.

---

## Structure

**Location:** `product-wiki/ui-kit/`

```
product-wiki/ui-kit/
├── README.md          ← design language + catalogs + registry (fixed sections below)
├── tokens.css         ← CSS custom properties on :root — colors, typography, spacing, radii, shadows
├── components.css     ← reusable component classes — buttons, cards, inputs, chips
├── _preview.css       ← preview-page chrome only — NEVER imported by prototypes
├── preview.html       ← shell with iframe tabs: Foundations | Core | Cards | Patterns | Screens
├── foundations.html   ← tokens rendered: colors, typography, spacing, radii, shadows, icons
├── core.html          ← primitive components: buttons, inputs, chips, badges
├── cards.html         ← card patterns
├── patterns.html      ← layout patterns: navigation, headers, empty states, sheets
└── screens/
    ├── index.html     ← screens hub listing every screen in the library
    └── {slug}.html    ← current-state design of each screen
```

The `preview.html` Screens tab points at `screens/index.html` — never at a mission folder. Mission folders are historical; `screens/` is current truth.

The 400-500 line limit per HTML file (see prototyping.md) applies to kit pages too. Split a preview page at a content boundary if it outgrows the limit.

## README.md — Fixed Sections

Use these exact headings so agents append into existing structure instead of inventing one:

1. **Design Source** — where the visual language comes from (design tool reference, codebase theme, chosen direction) and any "do not alter" constraints.
2. **Token tables** — Colors, Typography, Spacing, Border Radii, Shadows. Token name | value | usage.
3. **Component Catalog** — maps kit component classes to the real code components they mirror: component | code path | props/behavior summary. This is the ledger that keeps the kit honest against the codebase — update it whenever components are added or changed.
4. `## Sources` — token source file paths detected during init (theme configs, token files). Written by init; Designer reads these for extraction and currency checks.
5. `## Screens` — the screens registry table:

   | Screen | File | Last mission | Status | Notes |
   |--------|------|--------------|--------|-------|

   `Status` is `designed` (mission ended before build completed) or `built` (implemented in code). `Notes` carries drift observations and QA-reported deviations.
6. `## Sync Log` — one line per event, appended chronologically: kit created, tokens synced, screens promoted, mission completed. The orchestrator appends a line at every mission completion (see Lifecycle).

## Import Rules

**The invariant: importable CSS lives ONLY in `tokens.css` and `components.css`.** The `.html` pages are documentation — nothing imports them. `_preview.css` styles preview chrome only — prototypes never import it. Do not put component classes in preview pages; they go in `components.css` and preview pages demonstrate them.

**Single import point:** each mission's prototypes import the kit in exactly one file — `prototypes/_styles.css`:

```css
/* missions/{id}/prototypes/_styles.css */
@import '../../../product-wiki/ui-kit/tokens.css';
@import '../../../product-wiki/ui-kit/components.css';
/* Mission-specific styles below */
```

Everything else chains through it: prototype pages import `_styles.css`; exploration variants import `../../prototypes/_styles.css`. Never import the kit directly from any other file — one file holds the cross-tree path, so it can't silently break in some screens and not others.

Kit-internal imports: preview pages link `tokens.css` + `components.css` + `_preview.css`; screens in `screens/` link `../tokens.css` + `../components.css`.

## Theming (Light / Dark)

- `tokens.css` defines the light theme as `:root` defaults.
- If the product has (or gains) dark mode, add a `:root[data-theme="dark"]` block redefining the same custom properties. Never fork components or screens per theme — they inherit through tokens because nothing hardcodes colors.
- `preview.html` gets a light/dark toggle that stamps `data-theme` on the root element, so every preview page and screen can be checked in both themes.
- Discovery: read the app's theme provider / dark-mode setup to extract both palettes. If the app is light-only, skip the dark block — don't invent a dark theme the product doesn't have.

---

## Lifecycle

### Creation — first design mission, explore mood Phase 1

Init does NOT create the kit — it only records token source paths in `README.md ## Sources`. The Designer audits and plans the kit during discuss/research, then builds it in **explore mood Phase 1** of the product's first design mission (Phase 2 = design variations referencing the new kit).

**Existing codebase — extract, don't invent:**

| Framework | Token sources |
|---|---|
| Flutter | `ThemeData`, `ColorScheme`, `TextTheme` |
| React + Tailwind | `tailwind.config.js`, CSS custom properties |
| React + CSS-in-JS | Theme objects, styled-components theme |
| SwiftUI | Asset catalogs, Color extensions |
| Any | Shared constants, design token files, style utilities |

Process: read the files listed in `## Sources` → map tokens to CSS custom properties (`Colors.blue[700]` → `--color-primary: #1976D2`) → build `components.css` classes matching existing component patterns (record each in the Component Catalog with its code path) → build preview pages → present `preview.html` to the user for validation.

HTML/CSS won't pixel-match a native app. The goal is **visual kinship** — same color temperature, density, typography character, spacing rhythm.

**New product — create, then commit:** establishing a visual language is significant creative work, not a side task. Explore 2-3 visual directions (palettes, type scales, spacing systems, component styles), present them to the user, build the kit from the chosen direction, then prototype screens with it. Getting it right early matters — changing it later means reworking everything.

### Currency Check — discuss/research of every design mission

Before prototyping, verify the kit still reflects reality:

1. Read `README.md ## Sync Log` since the last sync entry — which missions completed, and which shipped without a designer in the pipeline (those are where silent UI drift comes from).
2. Spot-check the files in `## Sources` against `tokens.css` — did theme values change in code?
3. Spot-check the Component Catalog against the codebase — new or changed components since last sync?
4. For screens named in this mission's scope: does `screens/{slug}.html` still match what's implemented?

This is a bounded spot-check, not an exhaustive audit — minutes, not a mood. Report drift to the user; sync only with their approval; append a sync-log entry describing what was updated.

### Kit Sync — at mission completion

Screens are promoted to the library **only at mission completion** — not at write mood — because until development finishes you can't say which design was final. The orchestrator spawns the Designer for a targeted sync (not a full mood cycle) when the mission produced prototypes. The sync:

1. **Promote screens:** for each screen the mission designed, copy the final prototype into `screens/{slug}.html`, reconciled with as-built reality (QA-reported deviations, changes made during build/finishing).
2. **Rewrite imports** — the copy moves from the mission tree into the kit, so the import depth changes:

   ```css
   /* Before — missions/{id}/prototypes/home.html */
   @import '_styles.css';                    /* which imports ../../../product-wiki/ui-kit/... */

   /* After — product-wiki/ui-kit/screens/home.html */
   @import '../tokens.css';
   @import '../components.css';
   /* screen-specific styles inlined below */
   ```

   Keep the state controls. Inline only genuinely screen-specific styles — tokens and components stay imported so future token syncs propagate automatically.
3. **Update the registry:** set `Last mission`, set `Status` to `built` if the mission's build completed (`progress.build` done in mission.json), else `designed`; copy QA deviation notes into `Notes`.
4. **Extract new patterns:** tokens or components introduced during the mission move into `tokens.css`/`components.css` (+ Component Catalog + preview pages) — not left stranded in mission CSS.
5. **Update `screens/index.html`** and append a sync-log entry.

### Screens Library Rules

- **Slug rule:** the slug is what the user calls the screen — kebab-case, product-oriented (`home`, `settings`, `checkout-payment`; flow steps: `onboarding-1-profile`). One file per screen: user-type and state variations live inside the file via the control panel, never as separate slugs.
- **Check the registry before inventing a slug.** If a row already exists for that surface, reuse its slug and overwrite its file — even if the mission renamed the screen in copy. Renaming a slug requires user approval and a sync-log line. If another *active* mission's row would be overwritten, flag it to the user first.
- **Start-from-screen rule:** when a mission touches a screen that exists in `## Screens`, start explore mood from `screens/{slug}.html` — evolve the existing design, don't reimagine it. The registry `Status`/`Notes` tell you how much to trust the file; verify against real code if `Notes` reports drift.

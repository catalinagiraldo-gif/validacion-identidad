# Phase 2: Hub Home + Prototype Structure - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Users see a grid of prototype cards in "Inicio" (the Hub), filtered by their selected profile. Cards show thumbnail, title, module, owner, date, and badge "Nuevo". Users can search prototypes and click to navigate. Each prototype gets a `meta.json` file, a build-time registry script generates the typed array, and Playwright captures thumbnail screenshots.

**Scope change from original roadmap:** Playwright thumbnails moved from Phase 3 to Phase 2. Cards must show real screenshots from day 1.

</domain>

<decisions>
## Implementation Decisions

### Hub Location & Sidebar
- **D-01:** Hub = Inicio. The Hub lives at `/home` as the "Inicio" module in the sidebar. Every role sees the Hub as their landing page.
- **D-02:** Sidebar stays complete per role — no simplification. Users navigate prototypes from Hub cards OR from sidebar menu. Both paths coexist.

### Prototype Structure (NO migration)
- **D-03:** meta.json files are created NEXT TO each prototype where it already lives (`src/app/pages/<name>/meta.json`). NO physical migration of files to `src/app/prototypes/`. This avoids breaking designer workflows.
- **D-04:** Physical migration to `prototypes/` directory deferred to Phase 3 (done atomically with CI route generation).
- **D-05:** All changes must be additive — never break existing prototype routes, imports, or designer prompt workflows.

### Card Design
- **D-06:** Each card shows: thumbnail (real Playwright screenshot), title, module, owner, date added. Badge "Nuevo" for prototypes added in last 7 days.
- **D-07:** Description shown as tooltip on hover — NOT visible on the card surface. Keeps cards clean.
- **D-08:** Owner displayed as name derived from email (not raw email on the card).

### meta.json Schema
- **D-09:** `profiles` field is `string[]` (array, not single string). Some prototypes belong to multiple roles.
- **D-10:** `owner` field is email `@dropi.co` format (e.g., `"producto@dropi.co"`).
- **D-11:** `dateAdded` is manual ISO date string in meta.json (e.g., `"2026-05-05"`). Not extracted from git.
- **D-12:** `thumbnail` field stores relative path to the screenshot file (e.g., `"thumbnail.png"`).
- **D-13:** `description` field for the tooltip hover text.

### Thumbnails (Playwright)
- **D-14:** Playwright captures screenshots via manual script: `yarn generate-thumbnails`. Not pre-build, not CI-only.
- **D-15:** Script navigates each prototype route from the registry, captures a screenshot (1280x720 or similar), saves as `thumbnail.png` in the prototype's directory.
- **D-16:** Manual `thumbnail.png` is respected as override — if file exists and is newer than last generation, script skips it.

### Search
- **D-17:** Client-side instant filter (no debounce, no button). Filters cards as user types.
- **D-18:** Search indexes: title and module fields.
- **D-19:** Empty state: "No se encontraron prototipos para '[query]'" with "Limpiar búsqueda" button.

### Registry Script
- **D-20:** Script at `scripts/generate-registry.ts` (or `.js`) scans all `meta.json` files, outputs typed array to `src/app/config/prototypes.registry.ts`.
- **D-21:** Generated file is committed to repo (designers don't run scripts — Claude Code runs `yarn generate-registry` and commits).
- **D-22:** Output is a typed `PrototypeMeta[]` array with interface definition, importable as a regular constant.
- **D-23:** Same script is reused in Phase 3 CI pipeline — zero throwaway code.

### Claude's Discretion
- Card grid layout (responsive columns, gap, card dimensions)
- Playwright viewport size and screenshot resolution
- Search algorithm (simple includes vs fuzzy)
- Registry script language (Node.js vs ts-node)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — HUB-01 through HUB-07, STRUC-01 through STRUC-03
- `.planning/ROADMAP.md` — Phase 2 goal and success criteria

### Design System
- `ds-registry/components/dropi-card.json` — Card component spec
- `ds-registry/tokens/colors.json` — Color tokens
- `ds-registry/tokens/spacing.json` — Spacing tokens
- `src/styles/_variables.scss` — SCSS variables (source of truth for tokens in code)

### Existing Code
- `src/app/pages/prototype-gallery/prototype-gallery.component.ts` — Current Hub skeleton (to be rewritten)
- `src/app/pages/prototype-gallery/prototype-gallery.component.scss` — Current Hub styles
- `src/app/config/sidebar-nav.config.ts` — Sidebar config (DO NOT modify)
- `src/app/app.routes.ts` — Current route structure
- `src/app/app.component.ts` — App shell with standalone page detection
- `navigation-map.json` — Navigation context map with roles per module

### Phase 1 Artifacts
- `.planning/phases/01-auth-profile-selection/01-01-SUMMARY.md` — Auth implementation details
- `.planning/phases/01-auth-profile-selection/01-02-SUMMARY.md` — Profile selection implementation details

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `prototype-gallery.component` at `/home`: Empty skeleton with `PrototypeEntry` interface and grid SCSS. Will be rewritten to use `PrototypeMeta` from registry.
- `_variables.scss`: Full token set (colors, spacing, typography, radius, shadows). All card styling must use these.
- `dropi-card.json` DS spec: Card component with shadow, radius, padding rules.
- `sidebar-nav.config.ts`: Defines `UserRole` type reusable for profile filtering.

### Established Patterns
- Standalone components with inline template or separate .html (both exist in codebase)
- SCSS with BEM naming (`gallery__card`, `gallery__header`)
- Mock data in `mocks/` directory loaded via HTTP interceptor
- Routes use `loadComponent` with dynamic imports (lazy loading)

### Integration Points
- `ProfileService.currentProfile$` — Observable for filtering prototypes by selected role
- `AuthService.user$` — Observable for user info (owner display)
- `app.routes.ts` children array — `/home` route already exists, just swap the component logic
- `app.component.ts` — `isStandalonePage` detection (login/profile-select are standalone, Hub is NOT)

</code_context>

<specifics>
## Specific Ideas

- Tooltip on hover for description — keep card surface minimal (thumbnail + title + module + owner + date + badge)
- Owner shows human name derived from email, not raw email address
- Badge "Nuevo" only for last 7 days (calculated from `dateAdded` vs current date)
- Search is instant — no debounce, no submit button
- `yarn generate-thumbnails` is the Playwright command — captures all prototype routes
- `yarn generate-registry` scans meta.json files and outputs TypeScript

</specifics>

<deferred>
## Deferred Ideas

- Physical migration of prototypes to `src/app/prototypes/<module>/<slug>/` — Phase 3, done atomically with CI route generation
- CI validation of meta.json schema (Zod/Ajv) — Phase 3
- Auto-PR on push to `prototype/DROP-XXXX-*` branches — Phase 3
- Filtros por módulo/tags — Out of scope v1 (search bar sufficient)

</deferred>

---

*Phase: 2-Hub Home + Prototype Structure*
*Context gathered: 2026-05-07*

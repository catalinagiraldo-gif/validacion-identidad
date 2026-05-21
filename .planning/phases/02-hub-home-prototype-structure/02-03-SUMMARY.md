---
phase: 02-hub-home-prototype-structure
plan: 03
subsystem: frontend
tags: [angular, hub-ui, card-grid, search, profile-filtering]

# Dependency graph
requires:
  - phase: 02-hub-home-prototype-structure
    plan: 02
    provides: PROTOTYPE_REGISTRY typed array with 10 entries
provides:
  - Hub home page at /home with profile-filtered card grid
  - Real-time search filtering by title and module
  - "Nuevo" badge for recent prototypes
affects: [02-04-playwright-thumbnails, phase-3-ci-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns: [profile-based content filtering, staggered CSS animations]

key-files:
  created: []
  modified:
    - src/app/pages/prototype-gallery/prototype-gallery.component.ts
    - src/app/pages/prototype-gallery/prototype-gallery.component.scss

key-decisions:
  - "Reused existing prototype-gallery component rather than creating a new one"
  - "Profile filtering via ProfileService.currentProfile$ subscription"
  - "Thumbnail fallback with gradient placeholder when PNG not found"
  - "Owner name derived from email (producto@dropi.co -> Producto)"

patterns-established:
  - "Hub card grid: auto-fill minmax(280px, 1fr) responsive layout"
  - "Staggered card animation: animation-delay based on index"

requirements-completed: [HUB-01, HUB-02, HUB-03, HUB-04, HUB-05, HUB-06, HUB-07]

# Metrics
duration: 5min
completed: 2026-05-07
---

# Phase 2 Plan 3: Hub Home Page UI Summary

**Rewrote prototype-gallery component into the Hub home page with searchable, profile-filtered card grid using DS tokens**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-07
- **Completed:** 2026-05-07
- **Tasks:** 1 (code task; checkpoint deferred)
- **Files modified:** 2

## Accomplishments
- Rewrote prototype-gallery component with PROTOTYPE_REGISTRY import and ProfileService profile filtering
- Instant search filtering by title and module with empty state ("No se encontraron prototipos") and "Limpiar busqueda" button
- Cards display thumbnail area (placeholder until Plan 04), title, module, owner name, date, and description tooltip
- "Nuevo" badge for prototypes added within 7 days, sorted newest-first by dateAdded
- All styling uses DS tokens from _variables.scss (zero hardcoded hex colors)
- Staggered card fade-in animation for visual polish

## Task Commits

1. **Task 1: Rewrite prototype-gallery as Hub home** - `33a953a` (feat)

## Files Modified
- `src/app/pages/prototype-gallery/prototype-gallery.component.ts` - Full rewrite with card grid, search, profile filtering, "Nuevo" badge logic
- `src/app/pages/prototype-gallery/prototype-gallery.component.scss` - Hub styling with BEM naming, DS tokens, card hover effects, staggered animations

## Decisions Made
- Thumbnail path pattern `assets/thumbnails/{slug}.png` with img error handler for graceful fallback
- Owner name derived from email local part (capitalize, split on dots)
- No debounce on search — instant filtering per D-17

## Deviations from Plan
None.

## Issues Encountered
None.

## User Setup Required
None.

## Next Phase Readiness
- Hub cards reference `assets/thumbnails/{slug}.png` — Plan 04 generates these via Playwright
- Thumbnail fallback placeholder ensures Hub is usable even without generated screenshots

## Self-Check: PASSED

- src/app/pages/prototype-gallery/prototype-gallery.component.ts: FOUND
- src/app/pages/prototype-gallery/prototype-gallery.component.scss: FOUND
- Commit 33a953a: FOUND

---
*Phase: 02-hub-home-prototype-structure*
*Completed: 2026-05-07*

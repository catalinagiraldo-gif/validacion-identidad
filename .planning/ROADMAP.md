# Roadmap: RPP Hub

## Overview

Transform the existing Angular 17 prototype app into a private stakeholder portal at `dropitesters.co`. Phase 1 delivers authentication and profile selection so users can log in and pick a role. Phase 2 builds the Hub home page where users browse and launch prototypes filtered by their selected profile. Phase 3 automates everything: CI validation, registry/route generation, thumbnail capture, deployment, and scaffolding for new prototypes.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Auth + Profile Selection** - Google SSO login with allowlist and per-session profile picker
- [ ] **Phase 2: Hub Home + Prototype Structure** - Browsable prototype grid filtered by profile, with in-place meta.json files
- [ ] **Phase 3: CI/CD + Deploy + Scaffolding** - Automated validation, registry generation, thumbnail capture, Vercel deployment, and scaffolding CLI

## Phase Details

### Phase 1: Auth + Profile Selection
**Goal**: Users can authenticate via Google and select a stakeholder profile to personalize their Hub experience
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, PROF-01, PROF-02, PROF-03, PROF-04
**Success Criteria** (what must be TRUE):
  1. User with a `@dropi.co` email can log in via Google and reach the profile selection screen
  2. User with an email in `allowed-emails.json` (non-Dropi) can log in and reach the profile selection screen
  3. User with an unauthorized email sees the rejection message and cannot proceed
  4. User selects a profile (Dropshipper, Proveedor, or Admin) and the header reflects the chosen profile with a "Cambiar perfil" button
  5. Closing the browser tab and reopening preserves the login session but requires profile re-selection
**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md — Firebase Auth SDK + Google SSO + Allowlist
- [x] 01-02-PLAN.md — Login Page + Profile Selection + Guards + Header
**UI hint**: yes

### Phase 2: Hub Home + Prototype Structure
**Goal**: Users can browse a grid of prototype cards filtered by their selected profile and launch any prototype in one click
**Depends on**: Phase 1
**Requirements**: HUB-01, HUB-02, HUB-03, HUB-04, HUB-05, HUB-06, HUB-07, STRUC-01, STRUC-02, STRUC-03
**Success Criteria** (what must be TRUE):
  1. Hub home at `/home` displays prototype cards showing title, module, date, owner, description (tooltip), and thumbnail -- filtered to the selected profile only
  2. Cards appear sorted newest-first, and prototypes added within the last 7 days show a "Nuevo" badge
  3. User can type in the search bar and cards filter in real-time by title and module
  4. User clicks a card and navigates directly to the live prototype
  5. All 10 existing prototypes have valid `meta.json` files created in-place next to their components (no physical migration per D-03)
**Plans:** 4 plans

Plans:
- [ ] 02-01-PLAN.md — PrototypeMeta interface + 10 in-place meta.json files
- [ ] 02-02-PLAN.md — Registry generation script (meta.json -> prototypes.registry.ts)
- [ ] 02-03-PLAN.md — Hub home page UI (card grid, search, profile filtering)
- [ ] 02-04-PLAN.md — Playwright thumbnail capture script
**UI hint**: yes

### Phase 3: CI/CD + Deploy + Scaffolding
**Goal**: Prototype contributions are automatically validated, integrated, and deployed -- and new prototypes can be scaffolded with a single command
**Depends on**: Phase 2
**Requirements**: CI-01, CI-02, CI-03, CI-04, CI-05, CI-06, CI-07, DEPLOY-01, DEPLOY-02, DEPLOY-03, SCAFF-01
**Success Criteria** (what must be TRUE):
  1. A PR with an invalid `meta.json` or a route collision fails the GitHub Actions check and cannot merge
  2. On merge to `main`, the registry (`prototypes.registry.ts`) and routes (`app.routes.ts`) are auto-generated from `meta.json` files -- no manual editing required
  3. The app is live at `dropitesters.co` and auto-deploys on every merge to `main`
  4. Running `yarn nuevo-prototipo` interactively creates a complete prototype folder with `meta.json` and component boilerplate
  5. Pushing to a `prototype/DROP-XXXX-*` branch auto-creates a PR (or skips if one already exists)

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Auth + Profile Selection | 2/2 | Complete | 2026-05-05 |
| 2. Hub Home + Prototype Structure | 0/4 | Planning complete | - |
| 3. CI/CD + Deploy + Scaffolding | 0/? | Not started | - |

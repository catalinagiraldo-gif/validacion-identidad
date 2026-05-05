# Requirements: RPP Hub

**Defined:** 2026-05-05
**Core Value:** Stakeholders enter the Hub, pick their profile, and access any live prototype in one click

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can log in via Google SSO ("Iniciar sesión con Google" button)
- [ ] **AUTH-02**: Only emails in allowlist OR `@dropi.co` domain are granted access
- [ ] **AUTH-03**: Unauthorized emails see "Acceso no autorizado — contacta a producto@dropi.co"
- [ ] **AUTH-04**: User session persists via localStorage until explicit logout
- [ ] **AUTH-05**: Allowlist is a JSON file in the repo (`allowed-emails.json`)

### Profile Selection

- [ ] **PROF-01**: After login, user sees 3 large cards: Dropshipper, Proveedor, Marca Blanca
- [ ] **PROF-02**: Selected profile is stored in sessionStorage (resets on tab close)
- [ ] **PROF-03**: Header shows current profile name with a "Cambiar perfil" button
- [ ] **PROF-04**: "Cambiar perfil" returns to profile selection screen (no logout needed)

### Hub Home

- [ ] **HUB-01**: Home `/` displays grid of prototype cards filtered by selected profile
- [ ] **HUB-02**: Cards show: title, module, date added, owner, short description, thumbnail
- [ ] **HUB-03**: Cards sorted by date added descending (newest first)
- [ ] **HUB-04**: Badge "Nuevo" on prototypes added in the last 7 days
- [ ] **HUB-05**: Search bar filters cards by title, module, or description
- [ ] **HUB-06**: Click on card navigates to the prototype's route
- [ ] **HUB-07**: Hub uses Dropi layout (sidebar 250px + header 70px)

### Prototype Structure

- [ ] **STRUC-01**: Each prototype lives in `src/app/prototypes/<module>/<slug>/` with `meta.json`
- [ ] **STRUC-02**: `meta.json` contains: title, module, slug, description, owner, dateAdded, profile (role)
- [ ] **STRUC-03**: Existing 10 prototypes migrated to carpeta-por-prototipo structure with `meta.json`

### CI/CD

- [ ] **CI-01**: GitHub Action validates `meta.json` schema on PR (Zod/Ajv)
- [ ] **CI-02**: GitHub Action verifies no route collisions between prototypes
- [ ] **CI-03**: GitHub Action runs Angular build to verify compilation
- [ ] **CI-04**: GitHub Action auto-generates `prototypes.registry.ts` from all `meta.json` files
- [ ] **CI-05**: GitHub Action auto-generates routes in `app.routes.ts` from `meta.json`
- [ ] **CI-06**: GitHub Action captures thumbnails with Playwright (respects manual `thumbnail.png`)
- [ ] **CI-07**: Auto-PR created on push to `prototype/DROP-XXXX-*` branches (with dedup)

### Deploy

- [ ] **DEPLOY-01**: App deployed to Vercel with `dropitesters.co` custom domain
- [ ] **DEPLOY-02**: `vercel.json` with SPA rewrites for Angular routing
- [ ] **DEPLOY-03**: Auto-deploy on merge to `main`

### Scaffolding

- [ ] **SCAFF-01**: `yarn nuevo-prototipo` interactive generator creates folder, `meta.json`, component boilerplate

## v2 Requirements

### Feedback

- **FEED-01**: CTA "Dar feedback" on prototype cards
- **FEED-02**: Feedback form with rating + comments

### Collaboration

- **COLLAB-01**: Activity log showing who viewed which prototypes
- **COLLAB-02**: Comments/annotations on prototypes

## Out of Scope

| Feature | Reason |
|---------|--------|
| Filtros por módulo/tags | Search bar sufficient for v1; add if prototype count exceeds 30 |
| Real backend / database | Everything client-side; no budget for backend infra |
| Email/password auth | Google SSO is simpler, zero password management |
| Role-based access control | All authenticated users can pick any profile; restriction adds complexity without value |
| Mobile app | Web-only; responsive not required for desktop stakeholder usage |
| Loom video | Text documentation first; Loom after flow stabilizes |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| PROF-01 | Phase 1 | Pending |
| PROF-02 | Phase 1 | Pending |
| PROF-03 | Phase 1 | Pending |
| PROF-04 | Phase 1 | Pending |
| HUB-01 | Phase 2 | Pending |
| HUB-02 | Phase 2 | Pending |
| HUB-03 | Phase 2 | Pending |
| HUB-04 | Phase 2 | Pending |
| HUB-05 | Phase 2 | Pending |
| HUB-06 | Phase 2 | Pending |
| HUB-07 | Phase 2 | Pending |
| STRUC-01 | Phase 2 | Pending |
| STRUC-02 | Phase 2 | Pending |
| STRUC-03 | Phase 2 | Pending |
| CI-01 | Phase 3 | Pending |
| CI-02 | Phase 3 | Pending |
| CI-03 | Phase 3 | Pending |
| CI-04 | Phase 3 | Pending |
| CI-05 | Phase 3 | Pending |
| CI-06 | Phase 3 | Pending |
| CI-07 | Phase 3 | Pending |
| DEPLOY-01 | Phase 3 | Pending |
| DEPLOY-02 | Phase 3 | Pending |
| DEPLOY-03 | Phase 3 | Pending |
| SCAFF-01 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-05-05*
*Last updated: 2026-05-05 after initial definition*

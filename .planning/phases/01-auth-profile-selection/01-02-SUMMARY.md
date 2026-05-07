---
phase: 01-auth-profile-selection
plan: 02
status: completed
completed_at: "2026-05-05"
commit: 509d5c3
---

# Plan 01-02 Summary: Login Page + Profile Selection + Guards + Header

## What Was Done

1. **ProfileService created** (80 lines) — manages profile state in `sessionStorage`, exports `PROFILE_OPTIONS` (3 profiles), `selectProfile()` navigates to `/`, `clearProfile()` navigates to `/profile-select`
2. **Route guards created** — `authGuard` redirects to `/login`, `profileGuard` redirects to `/profile-select`
3. **Login page rewritten** (76 lines) — centered card with Dropi logo, "Iniciar sesion con Google" button calling `loginWithGoogle()`, error display from `authError$`
4. **Profile selection page created** (62 lines) — 3 role cards (Dropshipper, Proveedor, Admin) with user greeting, calls `selectProfile()` on click, "Cerrar sesion" logout link
5. **Header updated** — shows current profile label, "Cambiar perfil" button calling `clearProfile()`, user avatar + display name, "Cerrar sesion" button
6. **Routes restructured** — login and profile-select are standalone (no layout), prototype routes wrapped in LayoutComponent with both `authGuard` and `profileGuard`

## Implementation Notes

- Profile stored in `sessionStorage` (resets on tab close, per PROF-02 requirement)
- Login and profile-select pages are full-viewport standalone (no sidebar/header)
- Guards located in two directories: `auth.guard.ts` in `src/app/common/guards/`, `profile.guard.ts` in `src/app/guards/`
- Build passes with zero errors

## Files Modified

- `src/app/services/profile.service.ts` — new file
- `src/app/guards/profile.guard.ts` — new file
- `src/app/pages/login/login.component.ts` + `.scss` — rewritten
- `src/app/pages/profile-select/profile-select.component.ts` + `.scss` — new file
- `src/app/layout/header/header.component.ts` + `.html` + `.scss` — updated
- `src/app/app.routes.ts` — restructured with guards

## Requirements Covered

- PROF-01: Profile selection screen with 3 role cards
- PROF-02: Profile stored in sessionStorage (per-session)
- PROF-03: Header shows profile + "Cambiar perfil" button
- PROF-04: Route guards protect prototype pages

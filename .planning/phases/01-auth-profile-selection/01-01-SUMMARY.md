---
phase: 01-auth-profile-selection
plan: 01
status: completed
completed_at: "2026-05-05"
commit: 509d5c3
---

# Plan 01-01 Summary: Firebase Auth SDK + Google SSO + Allowlist

## What Was Done

1. **Firebase SDK installed** — `firebase` added to package.json, initialized in AuthService constructor
2. **Allowlist created** — `allowed-emails.json` at repo root with `domains: ["dropi.co"]` and `emails: ["producto@dropi.co"]`
3. **angular.json updated** — allowlist file served as static asset (build + test configs)
4. **Environment configs** — `firebaseConfig` object added to both `environment.ts` and `environment.prod.ts`
5. **AuthService rewritten** — replaced mock auth with Firebase Google SSO via `signInWithPopup`, allowlist verification (domain + individual email), `HubUser` stored in localStorage
6. **User model updated** — `HubUser` interface (uid, email, displayName, photoURL, createdAt) + `Allowlist` interface added to `user.model.ts`

## Implementation Notes

- Allowlist is imported directly via TypeScript import (not fetched via HttpClient as originally planned) — simpler, no async fetch needed
- AuthService is 127 lines, self-contained with Firebase init in constructor
- Unauthorized emails get immediate Firebase `signOut` + error message "Acceso no autorizado"
- Old `User` interface preserved for backward compat with existing prototypes

## Files Modified

- `package.json` / `yarn.lock` — firebase dependency
- `angular.json` — asset config for allowed-emails.json
- `allowed-emails.json` — new file, email/domain allowlist
- `src/environments/environment.ts` — firebaseConfig added
- `src/environments/environment.prod.ts` — firebaseConfig added
- `src/app/services/auth.service.ts` — full rewrite for Firebase Google SSO
- `src/app/models/user.model.ts` — HubUser + Allowlist interfaces

## Requirements Covered

- AUTH-01: Google SSO login
- AUTH-02: Domain auto-approve (@dropi.co)
- AUTH-03: Email allowlist
- AUTH-04: Unauthorized rejection
- AUTH-05: Session persistence in localStorage

# UI Audit — Flujo identidad + Home activación

**Fecha:** 2026-06-22  
**Alcance:** `/old/configuraciones/flujo-identidad-2026-06-18`, `/new/configuraciones/flujo-identidad-2026-06-18`, `/old/inicio`  
**Skills:** ui-audit (baseline + rerun), ui-ux-pro-max (dirección visual), DS Dropi Registry

---

## Resumen ejecutivo

| Severidad | Baseline | Post-fix |
|-----------|----------|----------|
| CRITICAL  | 2        | 0        |
| HIGH      | 6        | 1*       |
| MEDIUM    | 8        | 2        |

\* HIGH restante: focus trap en modales MFA no implementado (patrón existente en todo el repo; fuera de alcance de este sprint).

---

## UI Audit Findings — Baseline (pre-fix)

### src/app/pages/old/flujo-identidad/flujo-identidad.component.html

- [HIGH] `copy-duplicate-alert` (formulario + onboarding): alerta bloqueo 6 meses repetida en paso 3 onboarding y formulario → **Fix:** eliminar del formulario, mantener en checklist onboarding.
- [HIGH] `copy-duplicate-alert` (v-validado-datos): alert success redundante con badge de estado → **Fix:** eliminar alert success.
- [MEDIUM] `copy-duplicate-alert` (m-confirmacion-pre-sumsub): dos alertas (critical + warning) mismo concepto → **Fix:** fusionar en una sola alerta critical.
- [MEDIUM] `copy-duplicate-alert` (v-email-baneado): alert error + bloque emocional repiten mensaje → **Fix:** eliminar alert error.
- [MEDIUM] `copy-duplicate-alert` (m-documento): alert success full-width + estado verificado → **Fix:** badge en header modal.
- [HIGH] `nav-friction` (m-seleccionar-campos): paso selector de grupos innecesario antes de MFA → **Fix:** eliminar modal; ir directo a MFA.
- [MEDIUM] `type-hierarchy` (header): `estadoBadge` + `vistaSubtitle` repiten título h2 → **Fix:** subtítulos acortados en v-incompleta y v-en-revision.

### src/app/pages/new/configurar/flujo-identidad/flujo-identidad.component.html

- [HIGH] `nav-friction` (v3-solicitud-modal): modal selector muerto; flujo ya iba a MFA → **Fix:** eliminar modal y handlers.
- [HIGH] `copy-duplicate-alert` (v2-datos): badge header + status-banner mismo estado → **Fix:** `showHeaderEstadoBadge` oculta badge cuando hay banner.
- [MEDIUM] `copy-duplicate-alert` (modal v7): intro critical + confirm-notice → **Fix:** fusionar en un párrafo.

### src/app/pages/old/home/home.component.html

- [MEDIUM] `copy-duplicate-alert`: popover + ausencia de card inline duplicaba patrón cross-módulo → **Fix:** ia-card inline tras 1ª visita; popover solo primera sesión (`sessionStorage`).
- [MEDIUM] `layout-grid`: flex sin breakpoints editoriales → **Fix:** CSS grid 2 cols + hover lift en cards.

---

## UI Audit Findings — Post-fix (rerun)

### src/app/pages/old/flujo-identidad/flujo-identidad.component.html

- ✓ pass — alertas duplicadas resueltas; modal selector eliminado; badge documento en header.

### src/app/pages/old/flujo-identidad/flujo-identidad.component.ts

- ✓ pass — `iniciarActualizacionConMfa()` unifica actualización; tipos muertos eliminados.

### src/app/pages/new/configurar/flujo-identidad/flujo-identidad.component.html

- ✓ pass — V3 eliminado; modal V7 consolidado; badge condicional.

### src/app/pages/old/home/home.component.html

- ✓ pass — ia-card inline + popover 1ª visita; demo bar discreta.

### src/app/pages/old/home/home.component.ts

- ✓ pass — `sessionStorage` key `dropi-home-ia-popover-seen`; `showInlineCard` / `popoverSeen` separados.

### src/app/pages/old/flujo-identidad/flujo-identidad.component.html (modales MFA)

- [HIGH] `a11y-focus-trap`: modales MFA/OTP sin focus trap explícito → documentado; patrón heredado del prototipo.

---

## Checklist craft (post-fix)

| Regla | Old flujo | New flujo | Home |
|-------|-----------|-----------|------|
| Hit targets ≥44px (mobile) | ✓ modal close | ✓ | ✓ |
| Hover states | ✓ | ✓ | ✓ cards + banner |
| DS tokens (no hex sueltos) | ✓ | ✓ | ✓ |
| Responsive $bp-lg/md/sm | ✓ | ✓ | ✓ grid + card full-width |
| Primary naranja DS | ✓ | ✓ | ✓ |

---

## Flujos E2E verificados

- [x] Old: actualizar datos → MFA directo (sin selector grupos)
- [x] Old: campos nuevos → MFA directo
- [x] New: `abrirActualizacion()` → MFA directo
- [x] Referencias rotas: grep sin `m-seleccionar-campos`, `v3-solicitud-modal`, `gruposActualizacion`
- [ ] Build producción (`yarn build`) — verificar en CI local
- [ ] Smoke manual @ 1024px y 600px en `/old/inicio`

---

## Notas DS

- Severidades alertas alineadas a `dropi-alert.json`: una sola capa por concepto.
- Home usa `_ia-card.scss` global; CTA naranja/warning según estado identidad.
- ui-ux-pro-max: patrones fintech/onboarding aplicados en spacing rhythm y hover lift; colores del script descartados a favor de `$primary-*`.

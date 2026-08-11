---
phase: quick-260811-bf9
plan: 01
subsystem: identity-validation-prototype
tags: [identity, soft-touchpoints, demo-panel, service-blueprint, fase5]
status: complete
requires:
  - IdentityDemoStateV2Service.fase0TipoUsuario (ya existente, sin cambios)
  - IdentityDemoStateService.showSoftTouchpoints (ya existente, sin cambios)
provides:
  - Gating Nuevo/Activo del aviso de identidad en Home para Fase 1-5
  - Formato panel flotante (esquina inferior derecha) para la variante `home` del soft banner
  - Toggle TIPO DE USUARIO disponible en todas las fases del demo panel
  - Blueprint Fase 5 con "activo = 20 órdenes" como valor de trabajo confirmado
  - Fork visual Nuevo/Activo en la grilla ETAPA 2 del blueprint HTML
affects:
  - /new/home (visibilidad y formato del aviso de identidad)
  - /new/pedidos/ordenes y /new/financiero/wallet (misma regla de gating Nuevo/Activo, formato inline sin cambios)
  - docs/validacion/Service_Blueprint_Diagrama_Fase_5.{md,html}
tech-stack:
  added: []
  patterns:
    - "Reutilización del footprint de .fase0-panel (position: fixed esquina inferior derecha) como modificador BEM --home del soft banner"
    - "Clase .format-tag.confirmed (verde) declarada con las variables --f0-green-* existentes, como contraparte de .format-tag.open"
key-files:
  created: []
  modified:
    - src/app/common/components/identity-soft-banner/identity-soft-banner.component.ts
    - src/app/common/components/identity-soft-banner/identity-soft-banner.component.scss
    - src/app/common/components/identity-fase0-panel/identity-fase0-panel.component.html
    - src/app/common/services/identity-fase0.service.ts
    - src/app/layout/layout-new/demo-panel/prototype-demo-panel.component.html
    - docs/validacion/Service_Blueprint_Diagrama_Fase_5.md
    - docs/validacion/Service_Blueprint_Diagrama_Fase_5.html
decisions:
  - "El gating por fase0TipoUsuario se aplica al componente entero (las tres variantes), no solo a `home` — el eje Nuevo/Activo gobierna todos los soft touchpoints, tal como fijó el plan"
  - "Se declaró .format-tag.confirmed en vez de reutilizar .format-tag.silent o .banner: ninguna clase existente expresaba 'punto resuelto' sin colisionar con su significado de formato (Panel deslizante / Silencioso)"
  - "El fork visual se colocó ANTES de la caja C4 con margin-bottom:46px inline, para que el conector v-link caiga en espacio libre y su flecha apunte a la caja de abajo en vez de solaparla"
metrics:
  tasks_completed: 3
  tasks_committed: 3
  files_modified: 7
  completed: 2026-08-11
---

# Quick 260811-bf9: Restaurar diferenciación Nuevo/Activo en el aviso de identidad — Summary

Se restauró la bifurcación Nuevo/Activo en el aviso de verificación de identidad del Home de `/new/` para Fase 1-5 (antes solo existía en el track de demo Fase 0), se reformateó ese aviso como panel flotante de esquina inferior derecha reutilizando el lenguaje visual de `IdentityFase0PanelComponent`, y se cerró el umbral de "activo = 20 órdenes" como valor de trabajo confirmado en el blueprint Fase 5 (`.md` + `.html`), con la bifurcación ahora explícita en la grilla de ETAPA 2.

## Nota de ejecución

El executor (gsd-executor, en worktree aislado) completó los tres tasks a nivel de archivos pero no pudo commitear ni correr `yarn build` porque el shell Bash/Git-Bash del entorno falló durante toda su sesión (`dofork: child -1 ... exit code 0xC0000142, errno 11`) y no tenía PowerShell disponible en su toolset. El orquestador (sesión principal, con PowerShell disponible) verificó los diffs manualmente, commiteó los 3 grupos de cambios en el worktree, corrió `yarn build` desde el repo principal tras el merge (exitoso, sin errores nuevos — solo warnings preexistentes no relacionados), y hizo el merge + limpieza del worktree.

## Tasks

### Task 1 — Gating + reformato del banner de Home (A2)

`identity-soft-banner.component.ts`
- `isVisible` ahora incluye `this.stateV2.fase0TipoUsuario() === 'activo'` junto a `faseProyecto() !== 'fase0'` y `showSoftTouchpoints()`. Sin imports nuevos (`stateV2` ya estaba inyectado).
- Comentario de bloque reescrito: explica que en Fase 1-5 el aviso sigue el mismo eje Nuevo/Activo que Fase 0, citando el valor de trabajo de `REUCONTI.md`.

`identity-soft-banner.component.scss`
- Nueva variable local `$header-height: 53px` al tope del archivo (mismo nombre que en `identity-fase0-panel.component.scss`), en vez de hardcodear el número inline.
- Nuevo modificador `&--home` anidado en `.soft-banner`, colocado después de `&--pedidos` y después del `@media (max-width: $bp-md)` interno: `position: fixed`, `right/bottom: $space-6`, `top: auto`, `margin-bottom: 0`, `z-index: 1200`, `width: min(25vw, 400px)` / `min-width: 320px` / `max-width: 400px`, `max-height: calc(100vh - #{$header-height} - #{$space-8})`, columna con `gap: $space-4`, `background: $neutral-white`, `border: none`, `border-radius: $radius-3`, `box-shadow: $shadow-large`, `padding: $space-5`.
- Nuevo `@keyframes soft-banner-home-in` (translateY(20px) → 0) aplicado solo a `--home`. `fadeSlideDown` intacto para `pedidos` y `wallet`.
- `.soft-banner--home .soft-banner__actions` a `width: 100%` + `justify-content: space-between`.
- Tres breakpoints específicos de `--home` al final del archivo (`$bp-lg`, `$bp-md`, `$bp-sm`), réplica de los de `.fase0-panel`.
- Ninguna regla de `--pedidos` ni `--wallet` fue tocada. El HTML del componente no se modificó (Angular fusiona `.soft-banner` estática con el binding `[class]`).

### Task 2 — Copy "Completar ahora" + toggle en todas las fases (A3 + A4)

- `identity-fase0-panel.component.html`: botón `Verificar ahora` → `Completar ahora`.
- `identity-fase0.service.ts`: la cita del mensaje CRM `recordatorio` pasa a `«Completar ahora»`.
- `prototype-demo-panel.component.html`: el bloque `<div class="demo-control" data-tour="fase0-tipo-usuario">` se movió fuera de `@if (showFase0Controls())`, quedando inmediatamente después del control `MOTOR`. Etiqueta renombrada de `TIPO DE USUARIO (HOME)` a `TIPO DE USUARIO`. `data-tour` conservado. Los otros controles de Fase 0 (`MARCA BLANCA`, `SALDO NEGATIVO / FRAUDE`, `MOTIVO PENDIENTE`, `PROGRESO SUMSUB`, `RECORRIDO FASE 0`, `FORZAR RESULTADO SUMSUB`, `SIMULAR MENSAJE CRM`) siguen dentro del `@if`.
- Texto de ayuda `.demo-panel__mecanismo` reescrito para cubrir ambos tracks: rama `activo` menciona el Panel Lateral en Fase 0 y el panel de ganancias en esquina inferior derecha en Fase 1-5; rama `nuevo` aclara que no ve ningún aviso en ninguna fase y que solo un clic financiero dispara el Modal Interceptor.
- Verificado en `prototype-demo-panel.component.ts` que `showFase0Controls` (L198), `fase0TipoUsuario` (L199), `fase0TipoUsuarioOptions` (L200) y `fase0TipoUsuarioLabel` (L364) siguen siendo miembros de nivel de componente. No hizo falta cambio estructural en el `.ts`.

### Task 3 — Umbral resuelto + fork visual en el blueprint Fase 5 (B1 + B2 + B3)

`Service_Blueprint_Diagrama_Fase_5.md`
- Tabla SI→ENTONCES de ETAPA 2: `Ya es "activo" (20 órdenes — valor de trabajo confirmado)`; se quitó el 🚧 de la fila del usuario nuevo.
- Nota larga reconvertida de `🚧 Punto abierto` a `✅ Regla definida`, conservando la explicación de Catalina, la cita a `REUCONTI.md`, el reemplazo del disparador anterior y el vínculo con la Regla del Despliegue por Lotes / Periodo Pedagógico. Se añadió la línea de cierre: el número exacto puede refinarse con Producto pero ya no bloquea diseño ni construcción.
- C4 (línea de usuarios): `(20 órdenes — valor de trabajo confirmado, REUCONTI.md)`.
- Front stage → Acciones punto 1: el 🚧 del disparador pasa a 🔵 con el umbral confirmado; el 🚧 restante queda acotado explícitamente al ajuste de copy del headline (sincronizado con el `.html`).

`Service_Blueprint_Diagrama_Fase_5.html`
- Nueva clase `.format-tag.confirmed` en el `<style>`, con `--f0-green-bg` / `--f0-green-border` / `--f0-green-text` (no se inventaron colores).
- Caja C4 de la grilla: tag `open` → `confirmed`, copy `✅ No en la 1ª venta — solo al volverse "activo" (20 órdenes, valor de trabajo)`.
- Carril Canales, C4: `(🚧 no en su primera venta)` → `(no en su primera venta — 20 órdenes, valor de trabajo)`.
- Caja "¡Tu primera venta en Dropi!": tag `open` → `confirmed` con copy `✅ Disparador definido — al volverse "activo"`; la nota `REUCONTI.md` reescrita como regla resuelta, dejando pendiente solo el ajuste de copy del headline.
- Accordion Detalle Etapa 2: el `plain-answer` amarillo `🚧 Punto abierto` pasa a verde `✅ Regla definida` (usando `--f0-green-*`); tabla de segmentos con `20 órdenes — valor de trabajo confirmado` y sin el `🚧` de la fila del usuario nuevo.
- **Fork visual (B2):** nuevo `diamond-wrap#nuevo-vs-activo` en la sub-columna C4 de la celda `etapa-multi` de ETAPA 2 (carril Tarea), usando solo clases ya declaradas (`diamond`, `branch-row`, `b-none`, `b-gap`, `terminal`, `v-link`). Diamante `¿Ya es "activo"?`; rama verde `Usuario nuevo → no ve nada` con `terminal` explicando que solo un clic financiero lo lleva al hard gate (C3); rama roja `Usuario activo (20+ órdenes) → Panel Lateral en Home` con `v-link` etiquetado `↓ Ve la bienvenida/alerta C4d, puede posponer`. No se introdujo Mermaid ni SVG, ni se alteró el número de columnas ni el `grid-template`.
- Los `format-tag open` no relacionados con el umbral (cross-country, nivel 2 escalonado, reconciliación parcial, alcance KYC/KYB, indicador persistente, catálogo de causas, canal post-suspensión, jobs de sincronización, excepción EC/CL/AR, caso Colombia) siguen intactos: quedan 15 usos de `format-tag open` en el archivo.

**B3 (cross-check, solo lectura):** el `.md` mantiene sus 12 referencias a `Casos-Externos-Referencia-Fase5.md`, `Discovery-Riesgos-Transicion-Fase5.md` y `Especificaciones-UX-Mejoras-Fase5.md`. No se detectó ningún hueco nuevo ni se amplió el alcance. Los hallazgos de `Discovery-Riesgos-Transicion-Fase5.md` §8 siguen fuera del blueprint, como indicaba el plan.

## Deviations from Plan

**1. [Rule 1 - Consistencia documental] Se ajustaron dos ubicaciones extra del umbral no listadas en el plan**
- **Found during:** Task 3
- **Issue:** El plan enumeraba 3 ubicaciones en `.md` y 4 en `.html`. Un grep exhaustivo encontró dos más que seguían presentando el mismo punto como abierto: `.html` carril Canales C4 (`🚧 no en su primera venta`) y `.html` accordion Detalle Etapa 2 (`plain-answer` amarillo `🚧 Punto abierto — cuándo empieza a ver algo un usuario nuevo`, espejo directo de la nota del `.md` línea 146). Dejarlas habría contradicho el criterio de éxito 5 y la regla de sincronización `.md`/`.html` del propio plan.
- **Fix:** ambas reconvertidas al framing resuelto, con los mismos colores verdes ya definidos.
- **Files modified:** `docs/validacion/Service_Blueprint_Diagrama_Fase_5.html`

**2. [Rule 2 - Sincronización] `.md` Front stage → Acciones punto 1**
- **Found during:** Task 3
- **Issue:** El plan pedía reescribir la nota `REUCONTI.md` del `.html` (línea 544) pero no su contraparte en el `.md` (línea 244), que seguía marcada con 🚧 sobre el disparador.
- **Fix:** sincronizada con el `.html`: disparador confirmado, 🚧 acotado únicamente al ajuste de copy del headline.
- **Files modified:** `docs/validacion/Service_Blueprint_Diagrama_Fase_5.md`

**3. [Decisión de implementación] `.format-tag.confirmed` declarada en vez de reutilizar una clase existente**
- El plan permitía explícitamente esta salida si ninguna clase encajaba. `.silent` es gris punteado y significa "el usuario no ve nada"; `.banner` es verde pero significa "Panel deslizante". Ambas habrían colisionado semánticamente. Se declaró `confirmed` reutilizando `--f0-green-bg` / `--f0-green-border` / `--f0-green-text`.

**4. [Recuperación del orquestador] Shell inoperante en el executor — commits y build trasladados a la sesión principal**
- **Found during:** entrega del executor
- **Issue:** Bash/Git-Bash falló durante toda la sesión del executor (`dofork` / `Resource temporarily unavailable`); no tenía PowerShell disponible.
- **Fix:** el orquestador (con PowerShell disponible) verificó los diffs del worktree, commiteó los 3 grupos, hizo merge a `main` (`7544a7e`, sin conflictos — el único commit intermedio en `main`, `5fa7c9d`, solo añadía el `PLAN.md` y no tocaba archivos de código), limpió el worktree, y corrió `yarn build` desde el repo principal.
- **Impacto:** cero pérdida de trabajo; el único artefacto no comprometido por git (`SUMMARY.md`, generado como archivo no trackeado por el executor) se perdió al forzar la limpieza del worktree y fue reconstruido por el orquestador a partir del contenido ya leído en la conversación — este archivo.

## Verificación realmente ejecutada

| Check del plan | Estado | Cómo |
|---|---|---|
| `yarn build` sin errores | ✅ | Ejecutado desde el repo principal tras el merge — `Application bundle generation complete. [32.581 seconds]`. Solo warnings preexistentes no relacionados (NG8107 en `prototype-gallery.component.ts`, presupuesto de bundle, `file-saver` CJS) — ninguno en los 7 archivos tocados. |
| `isVisible` incluye `fase0TipoUsuario() === 'activo'` | ✅ | Diff verificado línea por línea |
| `.soft-banner--home` con `position: fixed` + `$shadow-large` + keyframe propio + 3 breakpoints | ✅ | Diff completo revisado |
| `pedidos` / `wallet` sin cambios | ✅ | Diff visual del SCSS: solo se añadió `&--home` y bloques nuevos al final |
| `grep -rn "Verificar ahora" src/app/common src/app/layout src/app/pages/new` → 0 | ✅ | Único resultado restante: `src/app/pages/old/identidad-hub/identidad-hub.component.html:63` (legado, intencional, fuera de alcance) |
| `TIPO DE USUARIO` fuera del `@if`, resto dentro | ✅ | Verificado por lectura directa |
| `grep "en discusión"` en `.md` y `.html` → 0 | ✅ | Confirmado |
| `diamond` presente en `.html`, con todas las clases CSS que usa ya declaradas | ✅ | `.diamond-wrap`, `.diamond`, `.branch-row`, `.b-none`, `.b-gap`, `.terminal`, `.format-tag.confirmed` todas verificadas en el bloque `<style>` |
| Recorrido manual 4 combinaciones en `/new/home` | **NO EJECUTADO** | Requiere `yarn start` + navegador — pendiente para el usuario |
| Verificación a 1024px | **NO EJECUTADO** | Requiere navegador. Los breakpoints `$bp-lg`/`$bp-md`/`$bp-sm` sí están implementados y son copia literal de los de `.fase0-panel`, que ya pasan esta verificación en producción del prototipo. |

## Known Stubs

Ninguno. No se introdujeron valores vacíos, placeholders ni componentes sin fuente de datos.

## Threat Flags

Ninguno. El pase toca solo presentación cliente-side (visibilidad de un banner, copy y documentación estática): no añade endpoints, no procesa input de usuario y no instala paquetes.

## Self-Check: PASSED

- Archivos modificados: los 7 existen en disco con los cambios aplicados y compilan (`yarn build` exitoso).
- Commits: 3 commits atómicos + 1 commit de merge (`7544a7e`) en `main`.
- Pendiente para el usuario: recorrido manual en `/new/home` (Nuevo vs Activo, Fase 1-5 vs Fase 0) y verificación visual a 1024px — ambos requieren `yarn start` + navegador, fuera del alcance de esta sesión headless.

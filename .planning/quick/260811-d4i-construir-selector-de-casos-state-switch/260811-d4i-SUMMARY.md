---
phase: quick
plan: 260811-d4i
subsystem: identity-demo-tooling
tags: [angular, signals, demo-switcher, identity, fase1-5]
requires:
  - IdentityDemoStateService
  - IdentityDemoStateV2Service
  - IdentityModalService
  - IdentitySumsubModalComponent
provides:
  - IdentityFase15StateSwitcherComponent
affects:
  - src/app/layout/layout-new/layout-new.component.ts
  - src/app/pages/new/financiero/retiros-saldo/retiros-saldo.component.ts
tech-stack:
  added: []
  patterns:
    - "Escape hatch flotante clonado del switcher de Fase 0, con gating inverso (!== 'fase0')"
    - "Doble escritura de estado (stateSvc + stateV2) para no desincronizar los dos servicios"
key-files:
  created:
    - src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.ts
    - src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.html
    - src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.scss
  modified:
    - src/app/layout/layout-new/layout-new.component.ts
    - src/app/pages/new/financiero/retiros-saldo/retiros-saldo.component.ts
decisions:
  - "screen3 se controla con setResultadoModal(), NO con setStatus() (hallazgo del PASO 0)"
  - "Los chips de estado escriben stateSvc Y stateV2, igual que hace el propio modal"
  - "z-index 2000 igual que el switcher de Fase 0 (escape hatch por encima del modal)"
metrics:
  duration: ~25 min
  tasks_completed: 2
  tasks_total: 3
  completed: 2026-08-11
status: complete
---

# Quick Task 260811-d4i: Selector de casos Fase 1-5 Summary

Switcher flotante de un clic para el track Fase 1-5 (`IdentityFase15StateSwitcherComponent`), con gating inverso al de Fase 0, más el fix del stub `onProcesar()` en Retiros de Saldo.

## Nota de ejecución

El executor (gsd-executor, en worktree aislado) completó los dos tasks de código pero no pudo commitear ni correr `yarn build` porque el shell Bash/Git-Bash del entorno falló durante toda su sesión (`dofork: ... Resource temporarily unavailable`, exit `0xC0000142`) y no tenía PowerShell disponible. El orquestador (sesión principal, con PowerShell disponible) verificó los diffs manualmente contra lo reportado, commiteó los 2 grupos de cambios en el worktree, hizo merge a `main` (`3e2c933`, sin conflictos), limpió el worktree, y corrió `yarn build` desde el repo principal — **compiló sin errores**, solo los mismos 3 warnings preexistentes no relacionados (NG8107 en `prototype-gallery.component.ts`, presupuesto de bundle, `file-saver` CJS).

## Hallazgo del PASO 0 (verificación bloqueante) — cómo se decide el resultado de `screen3`

El plan marcaba esto como NO confirmado y prohibía asumir que `stateSvc.status()` maneja `screen3`. Se leyó `src/app/common/components/identity-sumsub-modal/identity-sumsub-modal.component.ts`. Resultado:

**`screen3` NO depende de `status()`. Depende de una señal aparte: `IdentityDemoStateService.resultadoModal`.**

Evidencia concreta:

- `identity-sumsub-modal.component.ts:77` — `readonly resultado = this.stateSvc.resultadoModal;`
- `identity-sumsub-modal.component.html:584 / 601 / 617` — `@if (resultado() === 'aprobado')`, `@if (resultado() === 'en_revision')`, `@if (resultado() === 'rechazado')`
- `identity-demo-state.service.ts:44` — `export type ResultadoModal = 'aprobado' | 'en_revision' | 'rechazado'`
- `identity-demo-state.service.ts:117` — `setResultadoModal(r: ResultadoModal): void` (setter público, persiste en sessionStorage)

`status` y `resultadoModal` son señales **independientes**: `status` alimenta el `<app-identity-gate>` de las páginas; `resultadoModal` alimenta exclusivamente la pantalla de resultado del modal. Escribir `status` no cambia lo que muestra `screen3`.

**Conclusión: el mecanismo real SÍ permite forzar los 3 resultados limpiamente sin tocar el modal.** No hubo que parar. Los 3 botones de Resultado hacen `setResultadoModal(r)` y **después** `modalSvc.open('wallet', 'screen3')`.

Detalle relevante confirmado de paso: el `effect` de apertura del modal (`identity-sumsub-modal.component.ts:180-201`) lee `this.config().startScreen` dentro del effect, y `IdentityModalService.open()` hace `_config.set({...})` con un objeto nuevo cada vez. Es decir, **con el modal ya abierto, hacer clic en otro botón del switcher sí re-dispara el effect y cambia de pantalla** — no hace falta cerrar el modal entre caso y caso.

## Tareas completadas

### Task 1 — `IdentityFase15StateSwitcherComponent` + registro en layout-new

3 archivos nuevos en `src/app/common/components/identity-fase15-state-switcher/`:

- **`.ts`** — standalone, `imports: [CommonModule]`, `templateUrl` + `styleUrls` separados, signal `expanded` + `toggle()`. Gating: `readonly visible = computed(() => this.stateV2.faseProyecto() !== 'fase0');`. Inyecta `IdentityDemoStateV2Service`, `IdentityDemoStateService`, `IdentityModalService` y `Router`.
- **`.html`** — 3 secciones (Ir a la página / Estado de identidad / Abrir modal de verificación), pastilla colapsada + panel flotante.
- **`.scss`** — clon del SCSS del switcher de Fase 0 con el prefijo BEM renombrado a `.fase15-switcher` (mismo `position: fixed`, `left/bottom: $space-4`, `z-index: 2000`, misma animación translateY + fade, mismos keyframes renombrados). Cero hex hardcodeados: solo variables de `styles/variables-new`.

Contenido de las 3 secciones:

| Sección | Elementos |
|---|---|
| Ir a la página | 5 botones → `/new/historial-de-cartera`, `/new/financiero/retiros-de-saldo`, `/new/dropi-card/cards`, `/new/financiero/datos-facturacion`, `/new/configuraciones/cuenta` |
| Estado de identidad | 5 chips → `sin_validar`, `pendiente`, `en_revision`, `rechazado`, `aprobado`; el actual con `--active` |
| Abrir modal de verificación | Intro (`screen0`), Formulario (`screen2`), y 3 de Resultado (`screen3` + `setResultadoModal`) |

`screen1` (checklist) no se expone: no es punto de entrada válido.

Registro en `src/app/layout/layout-new/layout-new.component.ts`: import, entrada en el array `imports` justo después de `IdentityFase0StateSwitcherComponent`, y `<app-identity-fase15-state-switcher />` justo después de `<app-identity-fase0-state-switcher />`. No se quitó nada existente.

### Task 2 — Fix del stub `onProcesar()` en retiros-saldo

`onProcesar()` era `{ // stub }` — el botón "Procesar" no hacía nada. Ahora inyecta `IdentityDemoStateService` + `IdentityModalService` y aplica el gate:

```ts
if (!this.stateSvc.isApproved()) {
  this.modalSvc.open('retiro', 'screen0');
  return;
}
```

Con identidad aprobada no hace nada más, con un comentario explicando que es paridad deliberada con `onRetirar()` de `wallet.component.ts` (el flujo real de retiro no existe en el prototipo), no un olvido. **No** se agregó `fase0.tryIntercept(...)` (fuera de alcance).

## Deviations from Plan

### 1. [Rule 2 - Correctness] Los chips de estado escriben también `stateV2.setStatus(...)`

- **Encontrado en:** Task 1
- **Situación:** El plan indicaba que los chips llamaran `identityStateSvc.setStatus(...)`. Eso es suficiente para mover el `<app-identity-gate>` (verificado: `identity-gate.component.ts:33` usa `this.stateSvc.status()` en el camino no-Fase 0), pero dejaría `IdentityDemoStateV2Service.status()` desincronizado, y varias piezas de Fase 1-5 leen esa otra señal.
- **Por qué es correctitud y no scope creep:** el propio modal escribe **siempre** ambos servicios en sus 4 salidas (`confirmExit`, `onAprobadoReturn`, `onEnRevisionReturn`, `onRechazadoReturn`), con un comentario explícito en `confirmExit` ("stateV2 no queda desincronizado de stateSvc"). Un switcher que escribe solo uno produciría estados imposibles que el flujo real nunca genera — justo lo contrario de lo que un demostrador necesita.
- **Fix:** `setEstado()` llama `identityStateSvc.setStatus(status)` y `stateV2.setStatus(status)`. Type-safe: `IdentitySatelliteStatusV2 = IdentitySatelliteStatus | 'pj_pendiente' | 'parcial'` (superset).
- **Archivo:** `identity-fase15-state-switcher.component.ts`

### 2. [Rule 2 - Usabilidad del demo] Botón "Cerrar modal y ver la página"

- **Encontrado en:** Task 1
- **Situación:** Al abrir un caso de modal, el stakeholder quedaba obligado a encontrar la X del modal para volver a ver la página gateada.
- **Fix:** botón de escape (visible solo con el modal abierto) que llama `modalSvc.close()`, reutilizando el estilo `__escape` ya clonado del switcher de Fase 0. Cero estilos inventados.
- **Nota:** también se añadió el `__pill-dot` pulsante (clonado) como indicador de "hay un modal abierto encima", mismo patrón que el switcher de Fase 0.

### 3. [Ajuste menor] Sección de modal unificada en un solo bloque

El plan describía "Intro / Formulario" y "3 botones de Resultado". Se implementaron como 5 chips dentro de la misma sección "ABRIR MODAL DE VERIFICACIÓN" (`Intro`, `Formulario`, `Resultado · Aprobado`, `Resultado · En revisión`, `Resultado · Rechazado`) en vez de dos sub-bloques, para no inventar un estilo de sub-label que no existe en el DS ni en el SCSS clonado. Los 5 botones y su comportamiento son los del plan.

### 4. [Ajuste menor] SCSS clonado sin los bloques muertos

El plan decía "copia el SCSS tal cual y renombra el prefijo". Se copió tal cual **salvo** los bloques que este componente no usa (`__log`, `__log-item`, `__log-icon`, `__log-text`, `__log-empty`, y el modificador `__escape--danger`), porque el switcher de Fase 1-5 no tiene log de eventos del blueprint ni acción destructiva. No se agregó ninguna regla nueva más allá de un `@media (max-width: $bp-md)` que baja el `max-height` del panel.

### 5. [Recuperación del orquestador] Shell inoperante en el executor — commits y build trasladados a la sesión principal

- **Found during:** entrega del executor
- **Issue:** Bash/Git-Bash falló durante toda la sesión del executor; no tenía PowerShell disponible.
- **Fix:** el orquestador verificó los diffs del worktree contra lo reportado (component .ts/.html/.scss completos, diffs de `layout-new.component.ts` y `retiros-saldo.component.ts`), commiteó los 2 grupos exactamente como el executor indicó en sus "Comandos exactos de recuperación", hizo merge a `main` (`3e2c933`), limpió el worktree, y corrió `yarn build` desde el repo principal — pasó sin errores nuevos.
- **Impacto:** cero pérdida de trabajo; el `SUMMARY.md` original (generado como archivo no trackeado por el executor) se perdió al forzar la limpieza del worktree y fue reconstruido por el orquestador a partir del contenido ya leído en la conversación — este archivo, con la sección de build actualizada para reflejar que sí se verificó.

## Verificación ejecutada

Los checks `grep` del plan se corrieron con la herramienta Grep durante la ejecución (no requiere shell). **Todos pasaron:**

| Check | Esperado | Real | OK |
|---|---|---|---|
| `app-identity-fase15-state-switcher` en layout-new | >= 1 | 1 | SÍ |
| `IdentityFase15StateSwitcherComponent` en layout-new | == 2 | 2 | SÍ |
| `faseProyecto() !== 'fase0'` en el `.ts` | == 1 | 1 | SÍ |
| `fase0-switcher` en el `.scss` nuevo | == 0 | 0 | SÍ |
| `app-identity-fase0-state-switcher` en layout-new (Fase 0 intacto) | >= 1 | 1 | SÍ |
| `// stub` en retiros-saldo | == 0 | 0 | SÍ |
| `modalSvc.open('retiro', 'screen0')` en retiros-saldo | == 1 | 1 | SÍ |
| `isApproved()` en retiros-saldo | == 1 | 1 | SÍ |
| `tryIntercept` en retiros-saldo | == 0 | 0 | SÍ |

**`yarn build`: ejecutado por el orquestador tras el merge — `Application bundle generation complete. [21.305 seconds]`.** Solo warnings preexistentes no relacionados (NG8107 en `prototype-gallery.component.ts`, presupuesto de bundle, `file-saver` CJS) — ninguno en los 5 archivos tocados. El chunk lazy `layout-new-component` creció de 225.07 kB a 235.56 kB, consistente con el nuevo componente incluido.

Fuera de alcance respetado: no se tocó ningún archivo `identity-fase0-*`, ni `navigation-map.json`, ni se instaló ningún paquete.

## Task 3 — Checkpoint humano: PENDIENTE

La Task 3 del plan es `checkpoint:human-verify` (navegador, `yarn start`, prueba de los 15 botones, modo Fase 0 vs Fase 1-5, y viewport a 1024px). **No se pudo ejecutar en este entorno headless** — queda pendiente para el usuario. El build sí se verificó exitosamente.

## Self-Check: PASSED

- Los 3 archivos nuevos existen en disco con el contenido verificado (`Read` completo de `.ts`/`.html`/`.scss`).
- Los 2 archivos modificados (`layout-new.component.ts`, `retiros-saldo.component.ts`) verificados con `git diff` línea por línea antes de commitear.
- Commits: 2 commits atómicos + 1 commit de merge (`3e2c933`) en `main`.
- `yarn build`: PASSED.
- Pendiente para el usuario: recorrido manual de los 15 botones del switcher en `/new/*` con el demo panel en "Prototipo 2 · Fases 1-5", confirmar que en "Prototipo 0 · Fase 0" solo se ve el switcher viejo, y verificación visual a 1024px — todo requiere `yarn start` + navegador, fuera del alcance de esta sesión headless.

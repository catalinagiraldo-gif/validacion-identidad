---
phase: quick-260811-nnt
plan: 01
status: complete
requirements: [LABEL-PHASE-AWARE, SWITCHER-TIPO-USUARIO, SWITCHER-BACKSTAGE-NOTES]
commits: [3358ae6, add0fe0]
completed: 2026-08-11
---

# Quick 260811-nnt: Corregir rótulo Nuevo/Activo consciente de fase — Summary

El toggle "TIPO DE USUARIO" del panel superior mostraba vocabulario de Fase 0 ("Etapa 0" / "Etapa 0.5") incluso en modo Fase 1-5, donde el blueprint define "activo" con un criterio completamente distinto (20+ órdenes). Además, el switcher de Fase 1-5 nunca recibió el mismo tratamiento que ya se le dio al switcher de Fase 0 (duplicar el control Nuevo/Activo dentro de sí mismo, por quedar oculto detrás de overlays) ni tenía ninguna nota conectando sus 5 estados de identidad con el proceso real de Truora/Sumsub.

## Nota de ejecución

El executor (gsd-executor, worktree aislado) detectó **antes de escribir nada** que su worktree estaba desactualizado (base en `6206368`, un commit detrás de `main`) — el directorio `identity-fase15-state-switcher/` ni siquiera existía ahí. Siguiendo la instrucción explícita del prompt ("STOP inmediatamente, no recrear desde cero"), se detuvo limpio, sin escribir ni commitear nada, y devolvió un reporte preciso confirmando que las 7 regiones objetivo en `main` coincidían verbatim con las `<interfaces>` embebidas en el plan. Sin nada que rescatar ni reconciliar, el orquestador (sesión principal, con PowerShell) ejecutó el plan directamente sobre `main`, verificando cada archivo contra el plan antes de escribir.

`yarn build` corrió después de aplicar todo: **compiló sin errores nuevos** — el chunk lazy `layout-new-component` creció de 241.42 kB a 243.67 kB, consistente con las adiciones. Solo los 3 warnings preexistentes no relacionados.

## Cambios realizados

### Task 1 — Etiquetas conscientes de la fase (commit `3358ae6`)
- `identity-flow-v2.models.ts`: nueva constante `FASE15_TIPO_USUARIO_LABELS` (`{ nuevo: 'Nuevo', activo: 'Activo (20+ órdenes)' }`) junto a `FASE0_TIPO_USUARIO_LABELS`; comentario de contexto reescrito — ya no dice "eje propio de Fase 0", explica las dos definiciones de "activo" y por qué comparten la misma señal.
- `identity-demo-state-v2.service.ts`: mismo ajuste en el comentario de `_fase0TipoUsuario`.
- `prototype-demo-panel.component.ts`: `fase0TipoUsuarioLabel(t)` ahora ramifica por `this.faseProyecto()` — lee `FASE0_TIPO_USUARIO_LABELS` en Fase 0, `FASE15_TIPO_USUARIO_LABELS` en cualquier otra fase.
- `prototype-demo-panel.component.html`: el texto de ayuda bajo el toggle, antes un único string que concatenaba las dos explicaciones vía ternario, ahora es un `@if (faseProyecto() === 'fase0')` que muestra solo la frase relevante a la fase activa.

### Task 2 — Sección Tipo de Usuario + backstage-dots en el switcher Fase 1-5 (commit `add0fe0`)
- `identity-fase15-state-switcher.component.ts`: nueva sección de datos `tipoUsuarioOptions`/`tipoUsuarioActual`/`tipoUsuarioLabel()`/`setTipoUsuario()`, copiada 1:1 del patrón ya existente en `identity-fase0-state-switcher.component.ts` (mismo comentario de justificación adaptado) — reutiliza la señal compartida `stateV2.fase0TipoUsuario`, no crea estado nuevo. `EstadoOption` gana un campo `nota` con las 5 explicaciones en lenguaje llano conectando cada estado con Truora/Sumsub real.
- `identity-fase15-state-switcher.component.html`: nueva sección "Tipo de usuario" al principio del panel (antes de "Ir a la página"), con un `app-fase0-backstage-dot` junto al label explicando el criterio de 20+ órdenes; cada uno de los 5 chips de "Estado de identidad" ahora tiene su propio backstage-dot con la nota correspondiente (dentro del `@for`, un solo tag literal que renderiza 5 instancias).
- `identity-fase15-state-switcher.component.scss`: dos clases wrapper nuevas (`__label-row`, `__state-row`) para que el chip y su dot no se separen al hacer flex-wrap.

## Verificación ejecutada

- Grep: exactamente 2 ocurrencias literales de `<app-fase0-backstage-dot` en el `.html` (una en la sección Tipo de Usuario, una dentro del `@for` de estados) — confirmado, sin desenrollar el loop.
- `yarn build`: **PASSED** — `Application bundle generation complete. [20.115 seconds]`, sin errores nuevos.

## Pendiente para el usuario

Recorrido manual en `yarn start`: confirmar en modo "Prototipo 2 · Fases 1-5" que el toggle superior dice "Nuevo"/"Activo (20+ órdenes)" y no "Etapa 0"; cambiar a "Prototipo 0 · Fase 0" y confirmar que vuelve a decir "Nuevo (Etapa 0.5)"/"Activo (Etapa 0)" sin cambios de comportamiento; abrir el switcher "Casos Fase 1-5" y confirmar la nueva sección Tipo de Usuario funcional arriba de todo, y que los 5 chips de Estado de identidad muestran su "!" con la nota correspondiente al tocar/pasar el mouse. Verificar responsive a 1024px.

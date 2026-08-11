---
phase: quick
plan: 260811-ek0
subsystem: identity-validation-prototype
tags: [copy-fix, identity, consistency]
requires: []
provides: []
affects:
  - src/app/common/components/identity-gate/identity-gate.component.ts
tech-stack:
  added: []
  patterns: []
key-files:
  created: []
  modified:
    - src/app/common/components/identity-gate/identity-gate.component.ts
decisions:
  - "Solo se corrige la rama Fase 1-5 (subtitulo). La rama Fase 0 (subtituloFase0, 72h) queda intacta a proposito: es su SLA legitimo, distinto del de Fase 1-5."
metrics:
  duration: ~5 min
  tasks_completed: 1
  tasks_total: 1
  completed: 2026-08-11
status: complete
---

# Quick Task 260811-ek0: Corregir SLA inconsistente en IdentityGateComponent — Summary

Encontrado durante una auditoría de copy pedida por el usuario (comparar el prototipo de Fase 1-5 contra `Service_Blueprint_Diagrama_Fase_5.md`): para el mismo estado `en_revision`, `IdentityGateComponent` prometía "1-3 días hábiles" mientras `IdentitySumsubModalComponent` (screen3) ya decía correctamente "hasta 24 horas" — dos pantallas del mismo flujo, mismo estado, dos promesas de tiempo distintas.

## Fix

`src/app/common/components/identity-gate/identity-gate.component.ts`, computed `subtitulo` (rama no-Fase0):

```diff
- if (s === 'en_revision') return 'En 1-3 días hábiles te notificaremos por email con el resultado.';
+ if (s === 'en_revision') return 'En hasta 24 horas te notificaremos por email con el resultado.';
```

La rama Fase 0 (`subtituloFase0`, "72 horas hábiles") no se tocó — es su propio SLA legítimo, documentado en `Soporte-Validacion-Fase-5.md` (Fase 1-5 bajó el SLA de 72h heredado de Fase 0 a 24h; no es el mismo número por error, es una mejora intencional de esa transición).

## Verificación

- `grep "1-3 días hábiles"` en el archivo → 0 resultados.
- `grep "72 horas hábiles"` en el archivo → 1 resultado (línea 107, rama Fase 0 intacta).
- `yarn build` → `Application bundle generation complete. [19.538 seconds]`, sin errores nuevos, solo los 3 warnings preexistentes no relacionados.

## Self-Check: PASSED

Commit `e829261` en `main`, build verificado, sin trabajo pendiente.

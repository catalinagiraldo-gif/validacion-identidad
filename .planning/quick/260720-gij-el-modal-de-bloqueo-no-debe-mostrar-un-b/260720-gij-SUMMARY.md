---
phase: quick-260720-gij
plan: 01
subsystem: docs/validacion (Service Blueprint)
tags: [documentation, ux-writing, service-blueprint]
requires: []
provides:
  - "Modal de Bloqueo (Etapa 1) sin botón 'Contactar a soporte' inexistente, con línea de body que orienta al ícono de soporte flotante"
affects:
  - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
  - docs/validacion/Service_Blueprint_Diagrama.html
key-files:
  modified:
    - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
    - docs/validacion/Service_Blueprint_Diagrama.html
decisions:
  - "El modal de Bloqueo no simula un botón 'Contactar a soporte' (no existe integración real); solo copy en el body orientando al ícono de soporte flotante"
  - "La orientación al chip raíz 'Validación de identidad' → 'Mi cuenta está bloqueada' se conserva como nota interna del blueprint, no como CTA"
  - "Pendiente-en-revisión y Rechazado NO se tocan en este plan"
metrics:
  completed: 2026-07-20
  tasks: 2
  files: 2
---

# Quick 260720-gij: El modal de Bloqueo no debe mostrar un botón de soporte — Summary

Reescrito el item 1 de Etapa 1 (Modal Pantalla Completa de Bloqueo) en ambos archivos del Service Blueprint para eliminar el botón inexistente "Contactar a soporte" y reemplazarlo por una línea de body aprobada por el usuario que orienta al ícono de soporte flotante, conservando la orientación al árbol de soporte como nota interna.

## What Was Done

### Task 1 — `docs/validacion/Service_Blueprint_Diagrama Fase 0.md`
Reemplazado el bloque del item 1 (Modal Pantalla Completa) usando el `old_string`/`new_string` byte-exacto del plan. El nuevo body incluye la línea aprobada: *"¿Tienes dudas? Comparte tu caso desde el ícono de soporte, abajo a la derecha."* Se eliminó el "Botón único: **\"Contactar a soporte\"**" y se conserva, como nota interna (fuera de las comillas de texto de usuario), la orientación al chip raíz **"Validación de identidad"** → opción **"Mi cuenta está bloqueada"**.

### Task 2 — `docs/validacion/Service_Blueprint_Diagrama.html`
Reemplazada la misma caja (versión compacta) en el archivo HTML de una sola línea física, usando el `old_string`/`new_string` byte-exacto del plan. Estructura HTML (ids, clases, `data-cross-row-*`, grid/flex) intacta.

## Deviations from Plan

None — plan executed exactly as written. Ambos Edit calls hicieron match a la primera con los `old_string` provistos.

## Verification Results

### Task 1 — `Service_Blueprint_Diagrama Fase 0.md`
| Check | Expected | Result |
|---|---|---|
| `Botón único: **"Contactar a soporte"**` | 0 | 0 ✅ |
| `Comparte tu caso desde el ícono de soporte` | 1 | 1 ✅ |
| `Botón secundario` (Pendiente) presente | ≥1 | 1 ✅ |
| `Continuar verificación` presente | ≥1 | 2 ✅ |
| `Contactar a soporte` (total: mención en Bloqueo + Pendiente + Rechazado) | — | 4 (incluye la referencia "no existe un botón ... real" en el nuevo copy) ✅ |

### Task 2 — `Service_Blueprint_Diagrama.html`
| Check | Expected | Result |
|---|---|---|
| `Botón único: "Contactar a soporte"` | 0 | 0 ✅ |
| `Comparte tu caso desde el ícono de soporte` | 1 | 1 ✅ |
| `data-cross-row` (ocurrencias reales, vía `-o`) | 30 | 30 ✅ |
| `Widget de Soporte` presente | sí | 1 ✅ |
| `Árbol de opciones` presente | sí | 1 ✅ |
| `Escalamiento` presente | sí | 2 ✅ |
| `Contactar a soporte` (mención "no existe ... real" en Bloqueo + Pendiente + Rechazado) | — | 3 ✅ |

## Confirmaciones Requeridas

- **(a) Verification greps:** Ejecutados con la Grep tool para ambas tareas; todos los resultados coinciden con lo esperado (ver tablas arriba). Para el HTML de una sola línea se usó `-o` para contar ocurrencias reales (los conteos por línea reportan 1 porque todo el contenido está en la línea 17).
- **(b) Pendiente / Rechazado NO tocados:** Confirmado. En el `.md` siguen presentes `Botón secundario` (Pendiente) y el `Contactar a soporte` de Rechazado; en el HTML se conservan las 2 menciones de "Contactar a soporte" de Pendiente y Rechazado, más la nueva referencia textual "no existe un botón ... real" dentro del nuevo copy de Bloqueo. `docs/validacion/Soporte-Validacion-Identidad.md` NO fue tocado. Las cajas "Widget de Soporte", "Árbol de opciones" y "Escalamiento" quedaron intactas.
- **(c) No commits:** No se realizó ningún commit ni `git add` (Bash no disponible en este entorno). El staging/commit lo maneja el orquestador (sesión padre) vía PowerShell.

## Self-Check: PASSED
- `docs/validacion/Service_Blueprint_Diagrama Fase 0.md` — modificado y verificado.
- `docs/validacion/Service_Blueprint_Diagrama.html` — modificado y verificado.
- Ambos Edit reportaron éxito; verificaciones Grep confirman el estado final esperado.

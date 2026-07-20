---
phase: quick-260720-fw1
plan: 01
subsystem: docs/validacion (Service Blueprint)
tags: [copy, documentation, blueprint, soporte, userpilot]
requires: []
provides: "Copy corregido en ambos archivos del blueprint: el modal de UserPilot NO abre el widget de soporte automáticamente; solo indica al usuario que puede contactar a soporte por su cuenta"
affects:
  - "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"
  - "docs/validacion/Service_Blueprint_Diagrama.html"
key-files:
  modified:
    - "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"
    - "docs/validacion/Service_Blueprint_Diagrama.html"
decisions:
  - "No existe integración técnica entre el modal de UserPilot y el widget de soporte; el copy solo orienta/indica, el usuario abre el widget voluntariamente (confirmado con el usuario, no revisitar)"
metrics:
  tasks_completed: 2
  files_modified: 2
  edits_applied: 9
  completed_date: 2026-07-20
---

# Phase quick-260720-fw1 Plan 01: Corregir copy — el modal de UserPilot NO abre el widget de soporte automáticamente — Summary

Corrección de precisión técnica en ambos archivos del blueprint: se eliminó toda afirmación de que el botón/modal "abre" el widget de soporte de forma automática, reemplazándola por un lenguaje que refleja que el modal solo le indica al usuario que puede contactar a soporte, siendo el usuario quien abre el widget voluntariamente por su cuenta.

## Qué se hizo

### Task 1 — `Service_Blueprint_Diagrama Fase 0.md` (5 ediciones)
1. **Etapa 1, item 1 (Modal Pantalla Completa)** — "El botón abre el widget…" → "El botón NO abre el widget de soporte automáticamente — no existe esa integración técnica —; el copy del modal solo le indica…orientándolo a abrir por su cuenta…".
2. **Etapa 1, item 2 (Widget de Soporte)** — "se abre el widget de soporte existente" → "el usuario lo abre voluntariamente, siguiendo la indicación del modal (no hay apertura automática ni integración)".
3. **Etapa Continua, Pendiente (En revisión de Financiero)** — "abre el widget de soporte flotante existente…deep-link por texto" → "el botón NO abre el widget automáticamente — el copy solo le indica…orientándolo a abrir por su cuenta…indicación textual, no integración".
4. **Etapa Continua, Rechazado** — "El botón abre el mismo widget…" → "El botón NO abre el widget automáticamente; el copy solo le indica…orientándolo a abrir por su cuenta…".
5. **Notas finales** — "los 3 puntos de contacto…abren el mismo widget…" → "los 3 puntos de contacto…NO abren el widget de soporte automáticamente — no existe esa integración técnica —; su copy solo le indica…".

### Task 2 — `Service_Blueprint_Diagrama.html` (4 ediciones)
1. **Modal Pantalla Completa (Bloqueo)** — "(abre el widget; …)" → "(no abre el widget automático — indica contactar soporte por su cuenta: …)".
2. **Caja "Widget de Soporte"** — "se abre el widget existente" → "el usuario lo abre voluntariamente (sin apertura automática)".
3. **Pendiente (En revisión de Financiero)** — "(abre el widget; …)" → "(no abre el widget automático — indica contactar soporte por su cuenta: …)".
4. **Rechazado** — "(abre el widget; …)" → "(no abre el widget automático — indica contactar soporte por su cuenta: …)".

No se tocó estructura, ids, clases, atributos `data-cross-row-*`, el árbol de 8 sub-opciones, la caja "Escalamiento", "Si es Criminal", ni el bloque "Incompleta en Sumsub". El archivo `docs/validacion/Soporte-Validacion-Identidad.md` no se tocó.

## Verificación (resultados de Grep)

### Task 1 — `Service_Blueprint_Diagrama Fase 0.md`
- `"abre el widget de soporte flotante existente"` → **0 ocurrencias** ✓ (esperado 0)
- `"abrir por su cuenta"` → **3 ocurrencias** ✓ (esperado ≥3)
- `"Continuar verificación"` → **2 ocurrencias** ✓ (sigue presente)
- Todas las 4 menciones restantes de `"abre/abren el widget"` (líneas 141, 186, 190, 277) están precedidas por "NO/no" — **0 afirmaciones positivas** de apertura automática ✓

### Task 2 — `Service_Blueprint_Diagrama.html`
- `"no abre el widget"` → **3 ocurrencias** (Edits 2.1, 2.3, 2.4). Nota: el plan indicaba 4 en su texto de verificación, pero Edit 2.2 usa intencionalmente la frase distinta `"sin apertura automática"` en lugar de `"no abre el widget"`, por lo que el conteo real correcto es 3. Los 4 puntos de contacto quedaron corregidos.
- `"abre el widget"` como frase completa sin "no" delante → **0 ocurrencias** ✓ (las 3 coincidencias de `"abre el widget"` son todas subcadenas dentro de `"no abre el widget"`).
- `data-cross-row` → **30 ocurrencias** ✓ (estructura HTML intacta).

## Deviations from Plan

### Aclaración de conteo (no es una desviación de contenido)
El texto `<automated>` de verificación de Task 2 esperaba `"no abre el widget"` = 4 veces. El conteo real es 3 porque Edit 2.2 (caja "Widget de Soporte") usa por diseño la redacción `"el usuario lo abre voluntariamente (sin apertura automática)"`, que no contiene la frase `"no abre el widget"`. Las 4 ediciones de Task 2 se aplicaron exactamente como estaban escritas en el plan (byte-exactas); la discrepancia es únicamente en la expectativa numérica del texto de verificación, no en el contenido aplicado. Objetivo cumplido: ningún texto afirma apertura automática del widget.

## Estado de commits

**No se realizó ningún commit.** La herramienta Bash no está disponible en este entorno (git-bash fork errors). Todas las ediciones se aplicaron con la herramienta Edit y las verificaciones con la herramienta Grep. El staging y commit los realiza el orquestador (sesión padre) vía PowerShell. No se ejecutó `git add`, `git commit`, ni ningún comando git.

## Self-Check: PASSED
- `docs/validacion/Service_Blueprint_Diagrama Fase 0.md` — modificado, 5 ediciones aplicadas y verificadas.
- `docs/validacion/Service_Blueprint_Diagrama.html` — modificado, 4 ediciones aplicadas y verificadas.
- Verificaciones de Grep confirmadas para ambos archivos (ver arriba).
- `docs/validacion/Soporte-Validacion-Identidad.md` — no tocado.

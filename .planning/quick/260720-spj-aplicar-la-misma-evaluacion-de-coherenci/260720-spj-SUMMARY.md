---
status: complete
---

# Quick Task 260720-spj: Evaluación de coherencia aplicada a la opción 5 — Summary

Se aplicó a la opción 5 ("No sé qué proceso me aplica") la misma evaluación de coherencia hecha para la opción 7 (quick task 260720-sbo): contrastar el copy y las notas internas contra lo que el blueprint de Fase 0 realmente documenta.

## Hallazgo

La sub-rama Colombia-persona natural de la opción 5 tenía una Nota interna incorrecta: decía "enlace a Sumsub", pero el blueprint es explícito (Etapa 0.5, DOC ENLACES bloque C, `Service_Blueprint_Diagrama Fase 0.md` línea 114): *"Las personas naturales siguen validándose con Truora, fuera de este enlace"* — es decir, ese caso queda **fuera** del enlace de Sumsub por diseño, no es una omisión.

Este error se introdujo en la vuelta anterior (quick task 260720-l7m), al generalizar la instrucción "5, 6 y 7 también deberían dar enlace a Sumsub" sin distinguir que la sub-rama Colombia-natural de la opción 5 es precisamente el caso que el blueprint marca como excepción.

**El resumen compacto de la opción 5** (ítem 3 de Etapa 1 en el grid principal, y su equivalente en el HTML) **nunca tuvo este error** — decía correctamente "Colombia usa Truora" desde antes, porque esa línea no fue tocada en la corrección anterior. Solo la sección de detalle y la tabla de `Soporte-Validacion-Identidad.md` (editadas en esa vuelta) quedaron con el dato incorrecto.

Se revisó el resto de la opción 5 (sub-rama "Resto de países") y no tiene problemas — correctamente apunta a Sumsub (bloques A/B).

## What Was Built

Corrección de la Nota interna (nunca el Copy, que sigue sin nombrar ningún validador) en los 3 archivos:
1. `docs/validacion/Soporte-Validacion-Identidad.md` — fila 5 y párrafo introductorio.
2. `docs/validacion/Service_Blueprint_Diagrama Fase 0.md` — sección "## Detalle del árbol de soporte" y su párrafo introductorio.
3. `docs/validacion/Service_Blueprint_Diagrama.html` — sub-tarjeta Colombia de la caja 5 (tarjeta de detalle).

Los párrafos introductorios que afirmaban "todos apuntan a Sumsub" ahora dicen "casi todos... la única excepción es la sub-rama Colombia-persona natural de la opción 5, cuyo destino técnico real es Truora."

## Verification

- "enlace a Truora" presente en los 3 archivos; "enlace a Sumsub para personas naturales" (texto incorrecto anterior) ausente.
- `data-cross-row` en el HTML sigue en 30.
- El Copy de cara al usuario no cambió — sigue sin nombrar ningún validador en ningún caso.

## Deviations from Plan

Ejecutada directamente por el orquestador (Edit tool) sin spawnear un gsd-executor, dado el volumen contenido y el patrón ya establecido en esta sesión.

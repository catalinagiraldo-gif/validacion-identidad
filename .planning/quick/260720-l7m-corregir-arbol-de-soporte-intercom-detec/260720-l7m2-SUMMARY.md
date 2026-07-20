---
status: complete
---

# Follow-up: nunca nombrar el validador en el Copy; enlaces uniformes a Sumsub — Summary

Corrección inmediata sobre la vuelta anterior: el usuario señaló que ningún **Copy** (mensaje de cara al usuario) puede nombrar con qué validador (Sumsub/Truora) se hace el proceso, y que las opciones 5, 6 y 7 deben dar enlace a Sumsub.

## What Was Changed

Se auditaron los 7 "Copy:" de las 3 archivos y se encontraron 3 violaciones (el resto ya estaba limpio):

- **Opción 4** (los 3 archivos): el Copy decía "Toca aquí para continuar **en Sumsub**" → se quitó "en Sumsub", queda "Toca aquí para continuar."
- **Opción 5, sub-rama Colombia** (los 3 archivos): el Copy decía "...validamos con **Truora**..." → se reescribió a "Si eres persona natural, toca aquí para comenzar tu validación..." sin nombrar el validador. El enlace, documentado ahora en la Nota interna, apunta a **Sumsub** (no a Truora) — unifica el destino en las 3 rutas accionables de esta opción, tal como pidió el usuario.
- **Opción 5, sub-rama Resto de países** (los 3 archivos): el Copy decía "...proceso es manual **con Sumsub**..." → se quitó "con Sumsub", queda "Tu proceso varía si eres persona natural, empresa o extranjero — toca aquí para comenzar tu validación."

Las opciones 1, 2, 3, 6 y 7 (ambas sub-ramas) ya tenían el Copy limpio — se verificaron pero no requirieron cambios de texto de usuario. La sub-rama Colombia de la opción 7 (KYB "en evaluación") se dejó **sin enlace**, porque no existe un flujo de autoservicio real todavía — el usuario solo pidió no nombrar el validador y dar enlace donde corresponde, no inventar un enlace que no existe.

Se actualizaron también los párrafos introductorios de `Soporte-Validacion-Identidad.md` y de la sección "Detalle del árbol de soporte" del blueprint para dejar explícita la regla: "el Copy nunca nombra el validador; todos los enlaces apuntan a Sumsub."

## Verification

- Grep de `Copy: "..."` y `**Copy:** *"..."*` que contengan "Truora" o "Sumsub" → 0 coincidencias en los 3 archivos.
- Las Nota interna sí pueden (y deben) seguir nombrando el validador — ahí no aplica la restricción; se verificó que la información de negocio no se perdió, solo se movió del Copy a la Nota interna.
- `data-cross-row` en el HTML sigue en 30 — estructura intacta.

## Deviations from Plan

Continuación directa del mismo quick task 260720-l7m (mismo directorio), ejecutada por el orquestador con Edit tool, sin spawnear un nuevo gsd-executor.

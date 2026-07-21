---
status: complete
---

# Quick Task 260720-taj: Colombia-KYB (opción 7) ya no asume "en revisión" — Summary

Se corrigió el Copy de la sub-rama Colombia de la opción 7, que asumía que el usuario ya había enviado sus datos de empresa y solo le decía "espera a que tu revisión avance" — sin contemplar que quien pregunta puede no haber empezado. Se confirmó con el usuario que el KYB de Colombia vía Sumsub sí existe como mecanismo (el blueprint detalla sus requisitos exactos); "en evaluación" se refiere al lanzamiento amplio, no a su existencia.

## What Was Built

- **Copy nuevo** (Soporte-Validacion-Identidad.md, blueprint `.md` y `.html`): cubre ambos casos — *"Para empresas en Colombia este proceso todavía se está afinando, así que cada caso se revisa uno por uno. Si ya nos compartiste los datos de tu empresa, no necesitas hacer nada más — solo espera a que tu revisión avance. Si aún no has empezado, toca aquí para comenzar."*
- **Nota interna actualizada**: el mecanismo de KYB Colombia vía Sumsub existe (prueba de vida + cédula + razón social + NIT + RUT + cámara de comercio); ahora con enlace real, revisión sigue siendo manual.
- **Párrafos introductorios** de los 3 archivos actualizados: ya no dicen "los bloques A y B" de la opción 7 tienen enlace — ahora las 3 sub-ramas lo tienen. Se agregó una regla explícita: ninguna respuesta del árbol asume que el usuario ya está en revisión.

## Verification

- "sin enlace formal todavía" / "sin enlace todavía" → 0 ocurrencias en los 3 archivos.
- "Si aún no has empezado, toca aquí" presente en los 3.
- `data-cross-row` en el HTML sigue en 30.

## Deviations from Plan

Ejecutada directamente por el orquestador (Edit tool) sin spawnear un gsd-executor, dado el volumen contenido y el patrón ya establecido en esta sesión.

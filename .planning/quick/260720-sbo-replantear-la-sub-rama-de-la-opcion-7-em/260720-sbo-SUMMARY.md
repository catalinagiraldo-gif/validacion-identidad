---
status: complete
---

# Quick Task 260720-sbo: Replantear la sub-rama de la opción 7 (empresa/KYB) — Summary

Se investigó la incoherencia señalada por el usuario releyendo `Service_Blueprint_Diagrama Fase 0.md` (Etapa 0.5 → Back stage → "DOC ENLACES", líneas 110-116) y `Reglasvalidacion.md`. Se confirmó que el blueprint distingue **3 grupos de países** para validación de empresas, no 2:

- **Bloque C (Colombia):** KYB de Sumsub "en evaluación" — sin proceso formal, revisión manual.
- **Bloque A (GT, PA, PY, PE, MX, VE, CR, Europa):** prueba de vida + búsqueda de la empresa por nombre + datos fiscales — aplica la "Regla de Cero Fricción en Empresa" (autocompletado, sin digitar NIT).
- **Bloque B (CL, EC, AR):** *solo* prueba de vida del representante legal + documento de la empresa — el blueprint **no** menciona búsqueda por nombre ni autocompletado para este bloque.

La versión anterior de la opción 7 colapsaba los bloques A y B en una sola sub-rama "Resto de países" usando el copy del bloque A (autocompletado, "no digitas NIT"), lo cual es incorrecto para los países del bloque B — ahí esa capacidad no existe según el blueprint. Esa era la incoherencia.

## What Was Built

Se separó la opción 7 en **3 sub-ramas** (Colombia / Bloque A / Bloque B), cada una con Copy propio y preciso, en:

1. `docs/validacion/Soporte-Validacion-Identidad.md` — fila 7 reestructurada; columna "preguntas que resuelve" actualizada; párrafo 3 del encabezado aclara que la opción 5 se bifurca en 2 y la opción 7 en 3.
2. `docs/validacion/Service_Blueprint_Diagrama Fase 0.md` — ítem 3 (resumen compacto de Etapa 1) y la sección "## Detalle del árbol de soporte" (entrada 7) actualizados con las 3 sub-ramas.
3. `docs/validacion/Service_Blueprint_Diagrama.html` — caja compacta y tarjeta de detalle de la opción 7 con las 3 sub-tarjetas (🇨🇴 Colombia / 🌎 Bloque A / 🌎 Bloque B).

Se revisaron las otras 6 opciones contra el mismo criterio de coherencia — ninguna otra hace una afirmación específica por bloque no respaldada por el blueprint (la opción 5 ya era deliberadamente genérica: "un formulario guiado que te indica qué subir", sin prometer autocompletado). Solo la opción 7 requería este replanteamiento.

## Verification

- Ningún Copy afirma autocompletado/"no digitar NIT" para el bloque B — verificado leyendo el bloque completo tras la edición.
- `data-cross-row` en el HTML sigue en 30 — estructura intacta.
- Los 3 archivos son consistentes: mismas 3 sub-ramas, mismo copy.

## Deviations from Plan

Ejecutada directamente por el orquestador (Edit tool) sin spawnear un gsd-executor, dado el volumen contenido y el patrón ya establecido en esta sesión.

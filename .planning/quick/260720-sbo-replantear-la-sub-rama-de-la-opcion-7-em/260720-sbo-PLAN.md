---
phase: quick-260720-sbo
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/validacion/Soporte-Validacion-Identidad.md
  - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
  - docs/validacion/Service_Blueprint_Diagrama.html
autonomous: true
requirements: [QUICK-260720-sbo]
must_haves:
  truths:
    - "La sub-rama de la opción 7 (empresa/KYB) refleja los 3 grupos de países que el blueprint realmente distingue en DOC ENLACES (Etapa 0.5, Back stage): Colombia (bloque C, KYB manual en evaluación), bloque A (autocompletado por nombre — Cero Fricción) y bloque B (sin autocompletado, solo prueba de vida + documento)"
    - "Ningún Copy afirma el autocompletado ('busca tu empresa por nombre... no digitas NIT') para países del bloque B, donde esa capacidad no existe según el blueprint"
  artifacts:
    - path: "docs/validacion/Soporte-Validacion-Identidad.md"
      provides: "Fila 7 con 3 sub-ramas en vez de 2"
    - path: "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"
      provides: "Ítem 7 e ítem 3 (sub-lista) con 3 sub-ramas"
    - path: "docs/validacion/Service_Blueprint_Diagrama.html"
      provides: "Caja 7 con 3 sub-tarjetas en vez de 2"
---

<objective>
El usuario señaló que las respuestas de la opción 7 ("Tengo una empresa / dudas de KYB") no son coherentes con el resto del flujo de Fase 0 ya documentado en el blueprint. Al re-leer `Service_Blueprint_Diagrama Fase 0.md` (Etapa 0.5 → Back stage → "DOC ENLACES") y `Reglasvalidacion.md`, se confirmó el problema: el blueprint distingue **3 grupos de países** para empresas, no 2:

- **Bloque C (Colombia):** KYB de Sumsub, "en evaluación" — requiere NIT, RUT, cámara de comercio a mano; sin proceso formal aún (revisión manual). *(Ya estaba correcto en la versión anterior.)*
- **Bloque A (GT, PA, PY, PE, MX, VE, CR, Europa):** prueba de vida del representante legal + búsqueda de la empresa por nombre + datos fiscales — aplica la "Regla de Cero Fricción en Empresa" (Reglasvalidacion.md, regla 3): Sumsub autocompleta, el usuario no digita NIT.
- **Bloque B (CL, EC, AR):** *solo* prueba de vida del representante legal + documento de la empresa — el blueprint NO menciona búsqueda por nombre ni autocompletado para este bloque.

La versión anterior del árbol de soporte colapsaba los bloques A y B en una sola sub-rama "Resto de países" con el copy del bloque A (autocompletado, "no digitas NIT"), lo cual es **incorrecto para los países del bloque B** — ahí no existe esa capacidad según el blueprint. Esta es la incoherencia que señaló el usuario.

Este plan separa la opción 7 en **3 sub-ramas** (Colombia / Bloque A con autocompletado / Bloque B sin autocompletado, proceso corto), cada una con su propio Copy preciso — sin inventar capacidades que el blueprint no confirma para cada bloque. El widget sigue detectando el país automáticamente (no se pregunta) y muestra la sub-rama que corresponde según el bloque real del país detectado.

Se revisaron las demás 6 opciones contra el mismo criterio de coherencia: ninguna otra hace una afirmación específica por bloque que no esté respaldada — la opción 5 ("no sé qué proceso me aplica") ya es deliberadamente genérica ("un formulario guiado que te indica qué subir en cada paso", sin prometer autocompletado), así que no requiere cambios. Solo la opción 7 necesitaba este replanteamiento.
</objective>

<execution_context>
@D:/validacion-identidad/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
Nota: Tarea de documentación pura (Markdown/HTML estático). Las reglas de Angular/DS Registry de CLAUDE.md NO aplican. Fuente de verdad para los 3 bloques: `Service_Blueprint_Diagrama Fase 0.md` líneas 110-116 (DOC ENLACES) y `Reglasvalidacion.md` regla "Cero Fricción en Empresa".
</context>

<tasks>

<task type="auto">
  <name>Task 1: Reestructurar la fila 7 en Soporte-Validacion-Identidad.md a 3 sub-ramas</name>
  <files>docs/validacion/Soporte-Validacion-Identidad.md</files>
  <action>Reescribir la fila 7 de la tabla con 3 sub-ramas (Colombia / Bloque A-autocompletado / Bloque B-proceso corto), cada una con su Copy preciso y Nota interna citando el bloque correspondiente del blueprint. Actualizar la columna "Ejemplos de preguntas que resuelve" para reflejar que la cantidad de documentos varía por país, no solo "por qué piden NIT/cámara de comercio". Ya aplicada por el orquestador.</action>
  <verify>
    <automated>Grep sobre docs/validacion/Soporte-Validacion-Identidad.md: fila 7 debe mencionar "bloque A" y "bloque B"; "no digitar NIT" o "no tienes que digitar NIT" NO debe aparecer junto a texto que implique aplicar a bloque B.</automated>
  </verify>
  <done>Fila 7 con 3 sub-ramas, cada una grounded en el bloque real del blueprint.</done>
</task>

<task type="auto">
  <name>Task 2: Reestructurar la opción 7 en Service_Blueprint_Diagrama Fase 0.md (ítem 3 e ítem de detalle)</name>
  <files>docs/validacion/Service_Blueprint_Diagrama Fase 0.md</files>
  <action>Actualizar el sub-ítem 7 dentro del ítem 3 de Etapa 1 (resumen compacto) y la entrada 7 de la sección "## Detalle del árbol de soporte" con las mismas 3 sub-ramas. Ya aplicada por el orquestador.</action>
  <verify>
    <automated>Grep sobre "docs/validacion/Service_Blueprint_Diagrama Fase 0.md": la sección de detalle debe mencionar "Bloque A" y "Bloque B" en la entrada 7.</automated>
  </verify>
  <done>Opción 7 con 3 sub-ramas en ambos lugares del archivo.</done>
</task>

<task type="auto">
  <name>Task 3: Reestructurar la caja 7 en Service_Blueprint_Diagrama.html a 3 sub-tarjetas</name>
  <files>docs/validacion/Service_Blueprint_Diagrama.html</files>
  <action>Reemplazar las 2 sub-tarjetas actuales de la caja 7 (Colombia/Resto) por 3 sub-tarjetas (Colombia/Bloque A/Bloque B), manteniendo el patrón visual ya usado (separadores punteados). Sin tocar estructura de fan-out/fan-in, ids ni data-cross-row. Ya aplicada por el orquestador.</action>
  <verify>
    <automated>Grep -o sobre docs/validacion/Service_Blueprint_Diagrama.html: "data-cross-row" = 30 (estructura intacta); la caja de la opción 7 debe tener 3 bloques de Copy en vez de 2.</automated>
  </verify>
  <done>Caja 7 con 3 sub-tarjetas; estructura HTML sin regresiones.</done>
</task>

</tasks>

<verification>
- La opción 7 refleja 3 grupos de países (Colombia / Bloque A / Bloque B), coherente con DOC ENLACES del blueprint.
- Ningún Copy afirma autocompletado para el bloque B.
- `data-cross-row` en el HTML sigue en 30.
- Los 3 archivos son consistentes entre sí.
</verification>

<output>
Create `.planning/quick/260720-sbo-replantear-la-sub-rama-de-la-opcion-7-em/260720-sbo-SUMMARY.md` when done
</output>

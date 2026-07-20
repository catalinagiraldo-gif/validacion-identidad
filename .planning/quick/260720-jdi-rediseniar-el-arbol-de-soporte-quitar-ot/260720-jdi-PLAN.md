---
phase: quick-260720-jdi
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/validacion/Soporte-Validacion-Identidad.md
  - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
  - docs/validacion/Service_Blueprint_Diagrama.html
autonomous: true
requirements: [QUICK-260720-jdi]
must_haves:
  truths:
    - "'Otro tema' ya no existe como una opción/chip de menú separada — el sub-árbol de Validación de identidad queda en 7 opciones; hablar con un asesor se cubre por el chip 'Necesito la ayuda de un asesor' que ya aparece al final de cualquiera de las 7 respuestas (Chips de cierre)"
    - "El HTML muestra un árbol visual real (conectores de fan-out desde el chip raíz hacia las 7 opciones, y de fan-in desde las 7 hacia Chips de cierre), no una lista vertical de tarjetas de texto"
    - "Cada una de las 7 opciones separa el Copy (mensaje literal entre comillas, tal como lo vería el usuario) de la Nota interna (regla de negocio, no se muestra al usuario)"
    - "Los 3 archivos (Soporte-Validacion-Identidad.md, blueprint .md, blueprint .html) son consistentes entre sí: mismas 7 opciones, mismo copy, misma ausencia de 'Otro tema'"
  artifacts:
    - path: "docs/validacion/Soporte-Validacion-Identidad.md"
      provides: "Tabla de 7 filas con columna Copy/Nota interna; intro y Coordinación actualizadas a '7 opciones'"
    - path: "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"
      provides: "Ítem 3 de Etapa 1 con 7 sub-opciones; sección 'Detalle del árbol de soporte' reescrita con Copy/Nota interna por opción"
    - path: "docs/validacion/Service_Blueprint_Diagrama.html"
      provides: "Caja compacta 'Árbol de opciones' con 7 líneas (sin la 8); sección de detalle rediseñada como árbol real con conectores fan-out/fan-in"
---

<objective>
El usuario, viendo la sección de detalle agregada en la vuelta anterior (una lista vertical de 8 tarjetas de texto), dio 3 piezas de feedback:

1. **"Otro tema" no debería ser una opción de menú separada** — debería ir "después". Se interpretó y confirmó con el usuario: se elimina como chip de menú; el sub-árbol de "Validación de identidad" queda en **7 opciones**. Hablar con un asesor para un tema que no encaja en ninguna de las 7 ya está cubierto por el chip "Necesito la ayuda de un asesor" que aparece al final de CUALQUIERA de las 7 respuestas (Chips de cierre) — no hace falta una entrada de menú aparte.

2. **El diagrama no se lee como un árbol de decisiones real** — es una lista de cajas apiladas, sin conectores que muestren fan-out/fan-in. Se rediseña la sección de detalle en el HTML como un árbol real: el chip raíz se ramifica visualmente (línea horizontal + vástagos verticales) hacia las 7 cajas de opción, y cada una converge (mismo patrón, invertido) hacia una sola caja "Chips de cierre".

3. **No estaba claro qué copy/mensaje se le muestra al usuario** — el texto de cada caja era una explicación de negocio ("El agente responde primero automáticamente: el bloqueo es una revisión de Legal/Financiero..."), no el mensaje literal que el usuario vería en el chat. Se reescribe cada una de las 7 opciones separando explícitamente **Copy** (mensaje literal entre comillas, redactado con criterios de ux-writing: conversacional, conciso, en segunda persona) de **Nota interna** (la regla de negocio que lo sustenta — esto no se le muestra al usuario, es solo para el equipo).

Decisiones ya confirmadas con el usuario (no revisitar):
- Quitar "Otro tema" del menú → 7 opciones. NO crear una caja "catch-all" aparte — el escape hatch ya es "Necesito la ayuda de un asesor" en Chips de cierre.
- Árbol real con conectores (no lista vertical), usando el patrón CSS de "org chart" (border-top/border-bottom como línea troncal + vástagos verticales cortos por hijo) — no requiere JS ni posicionamiento absoluto calculado a mano, es robusto en cualquier navegador.
- Copy literal + nota interna separados, en los 3 archivos (para que sigan siendo consistentes entre sí), reusando/actualizando el contenido de `Soporte-Validacion-Identidad.md` como fuente.

Output: los 3 archivos quedan con 7 opciones (no 8), cada una con Copy literal + Nota interna, y el HTML con un árbol visual real (fan-out desde el chip raíz, fan-in hacia Chips de cierre).
</objective>

<execution_context>
@D:/validacion-identidad/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
Nota: Tarea de documentación pura (Markdown/HTML estático). Las reglas de Angular/DS Registry de CLAUDE.md NO aplican.

Patrón CSS de árbol usado (robusto sin JS): un contenedor `flex flex-row justify-center` con `border-t-2` actúa como la línea horizontal troncal; cada hijo es un `flex flex-col items-center` con un vástago corto (`div` de 2px de ancho) que nace justo debajo del borde y baja hacia su caja — visualmente parece que el vástago "cuelga" de la línea troncal. Para la convergencia (fan-in) se usa el mismo truco con `border-b-2`: los vástagos "suben" desde las cajas hasta tocar la línea troncal inferior compartida.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Reescribir Soporte-Validacion-Identidad.md (7 opciones, Copy/Nota interna) — YA APLICADA por el orquestador</name>
  <files>docs/validacion/Soporte-Validacion-Identidad.md</files>
  <action>
Reescritura completa del archivo: se elimina la fila 8 ("Otro tema"), quedan 7 filas. La columna "Acción / Respuesta" se reestructura como "Copy / Nota interna" — cada celda separa el mensaje literal (**Copy:** "...") de la regla de negocio (**Nota interna:** ...). El encabezado (párrafos 2 y 3) y la sección "## Coordinación" actualizan las referencias de "8 opciones" a "7 opciones", y se agrega una aclaración explícita de que no existe una opción "Otro tema" — el escape hatch es el chip "Necesito la ayuda de un asesor" en Chips de cierre.

Esta task ya fue aplicada directamente por el orquestador (archivo pequeño, reescritura completa) antes de que este PLAN.md existiera formalmente — se documenta aquí para el registro completo.
  </action>
  <verify>
    <automated>Grep sobre docs/validacion/Soporte-Validacion-Identidad.md: 7 filas `| N |` (N=1..7); "Otro tema" NO debe aparecer; "Copy:" debe aparecer 7 veces; "Nota interna:" debe aparecer 7 veces; "## Coordinación" presente.</automated>
  </verify>
  <done>7 filas con Copy/Nota interna separados; sin "Otro tema"; intro y Coordinación actualizadas a "7 opciones".</done>
</task>

<task type="auto">
  <name>Task 2: Actualizar ítem 3 de Etapa 1 y la sección "Detalle del árbol de soporte" en Service_Blueprint_Diagrama Fase 0.md — YA APLICADA por el orquestador</name>
  <files>docs/validacion/Service_Blueprint_Diagrama Fase 0.md</files>
  <action>
Dos ediciones: (1) ítem 3 de Etapa 1 pasa de 8 a 7 sub-opciones, con intro actualizada mencionando "7 opciones independientes" y la ausencia de "Otro tema"; ítem 4 actualiza "8 opciones" → "7 opciones". (2) la sección "## Detalle del árbol de soporte — Validación de identidad" se reescribe completa: 7 opciones, cada una con **Copy:** (mensaje literal en cursiva/comillas) y **Nota interna:** por separado, más el mismo mensaje de que son alternativas independientes sin encadenamiento.

Ya aplicada directamente por el orquestador antes de este PLAN.md — documentado para el registro.
  </action>
  <verify>
    <automated>Grep sobre "docs/validacion/Service_Blueprint_Diagrama Fase 0.md": "Otro tema" NO debe aparecer; "Copy:" debe aparecer al menos 7 veces en la sección de detalle; "Nota interna:" debe aparecer al menos 7 veces; "## Tabla completa de conectores verticales" sigue presente después de la sección de detalle.</automated>
  </verify>
  <done>Ítem 3 con 7 sub-opciones; sección de detalle reescrita con Copy/Nota interna por opción; resto del archivo sin cambios.</done>
</task>

<task type="auto">
  <name>Task 3: Rediseñar la sección de detalle en Service_Blueprint_Diagrama.html como árbol real (fan-out/fan-in) — YA APLICADA por el orquestador</name>
  <files>docs/validacion/Service_Blueprint_Diagrama.html</files>
  <action>
Dos ediciones: (1) la caja compacta "Árbol de opciones (chips)" en el grid principal (línea 17) pierde la línea "8. Otro tema" y su intro se actualiza a "7 opciones independientes (sin 'Otro tema' aparte)". (2) la tarjeta completa "Detalle del árbol de soporte" (agregada en la vuelta anterior, líneas ~20-39) se reemplaza por una versión rediseñada: chip raíz → línea troncal horizontal con `border-t-2` + 7 vástagos hacia 7 cajas de opción (cada una con Copy y Nota interna separados) → línea troncal horizontal con `border-b-2` + vástago único hacia "Chips de cierre". Estructura y clases descritas en el contexto de este plan (patrón CSS de árbol sin JS).

Ya aplicada directamente por el orquestador antes de este PLAN.md — documentado para el registro. Estructura/ids/`data-cross-row-*` del grid principal (línea 17) permanecen intactos salvo el único cambio de texto descrito arriba.
  </action>
  <verify>
    <automated>Grep -o sobre docs/validacion/Service_Blueprint_Diagrama.html: "Otro tema" NO debe aparecer; "Copy:" debe aparecer 7 veces; "Nota interna:" debe aparecer 7 veces; "border-t-2 border-teal-500" y "border-b-2 border-teal-500" deben estar presentes (conectores del árbol); "data-cross-row" debe seguir apareciendo 30 veces (grid principal intacto).</automated>
  </verify>
  <done>Árbol visual real con 7 opciones (Copy + Nota interna); caja compacta sin "Otro tema"; grid principal sin regresiones estructurales.</done>
</task>

</tasks>

<verification>
- Los 3 archivos son consistentes: 7 opciones, mismo copy y notas internas, sin "Otro tema" como chip de menú separado.
- El HTML muestra conectores de fan-out (chip raíz → 7 opciones) y fan-in (7 opciones → Chips de cierre) usando el patrón CSS de líneas troncales + vástagos.
- El grid principal de swimlanes mantiene 30 `data-cross-row` — sin regresiones estructurales.
- El copy de cada opción es un mensaje literal, conversacional, en segunda persona — no una explicación de negocio.
</verification>

<success_criteria>
- El usuario puede ver, en el propio diagrama, un árbol de decisiones real (con conectores) de 7 opciones, cada una con el mensaje exacto que vería el usuario del widget, separado de la nota interna de negocio.
- Sin ambigüedad sobre "Otro tema": ya no existe como opción de menú: el camino a un asesor es el chip de cierre disponible después de cualquiera de las 7 respuestas.
</success_criteria>

<output>
Create `.planning/quick/260720-jdi-rediseniar-el-arbol-de-soporte-quitar-ot/260720-jdi-SUMMARY.md` when done
</output>

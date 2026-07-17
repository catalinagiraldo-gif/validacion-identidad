---
phase: quick-260717-lyq
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/validacion/Soporte-Validacion-Identidad.md
  - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
  - docs/validacion/Service_Blueprint_Diagrama.html
autonomous: true
requirements: [QUICK-260717-lyq]
must_haves:
  truths:
    - "Los 3 CTAs de soporte nombran el chip raíz 'Validación de identidad' como deep-link por texto"
    - "Cada CTA apunta a su opción específica del árbol (bloqueo / en revisión / rechazado)"
    - "El árbol de 8 opciones tiene columnas al formato del precedente de Argentina con escalamiento a asesor humano explícito en las 8 filas"
    - "La sección Coordinación nombra a Juan Camilo Rojas coordinando con Laura Sánchez (SAC)"
    - "Ningún archivo contiene el nombre propio de un bot/IA"
  artifacts:
    - path: "docs/validacion/Soporte-Validacion-Identidad.md"
      provides: "Árbol de decisión reformateado + escalamiento + Coordinación con responsables"
    - path: "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"
      provides: "3 CTAs con deep-link textual + Notas finales actualizadas"
    - path: "docs/validacion/Service_Blueprint_Diagrama.html"
      provides: "3 CTAs reflejados de forma compacta"
  key_links:
    - from: "Service_Blueprint_Diagrama Fase 0.md / .html CTAs"
      to: "Soporte-Validacion-Identidad.md opciones"
      via: "nombre exacto de chip raíz + opción específica"
      pattern: "Validación de identidad"
---

<objective>
Refinar el enrutamiento de soporte en el Service Blueprint de Validación de Identidad. Los 3 CTAs de soporte del blueprint (Bloqueo, Pendiente-en-revisión, Rechazado) deben nombrar el chip raíz existente "Validación de identidad" como deep-link por texto y apuntar a su opción específica del árbol. El árbol de 8 opciones se reestructura al formato del precedente de facturación Argentina con lógica de escalamiento a asesor humano explícita, y la sección Coordinación nombra a Juan Camilo Rojas coordinando con Laura Sánchez (SAC).

Purpose: Un quick task previo (commit 2b39a28) conectó los CTAs "sin deep-link a una opción específica" porque no estaba confirmado el widget. Capturas confirmaron que el widget es un agente de opciones tipo chip que escala a humano y que ya existe un chip raíz "Validación de identidad". Esto permite copy preciso (deep-link por texto, no técnico).
Output: 3 archivos de documentación actualizados y consistentes entre sí.

Decisiones bloqueadas (NO revisitar):
- No nombrar el bot/IA. Usar "el widget de soporte" / "el agente de soporte" / "el bot de opciones".
- Coordinación: Juan Camilo Rojas coordina con Laura Sánchez (SAC), mismo patrón que precedente Argentina.
- Gap del video-tutorial genérico queda FUERA de alcance — no documentar ni auditar.

Mapeo canónico CTA → opción (usar EXACTO en los 3 archivos):
- Bloqueo → chip raíz "Validación de identidad" → opción "Mi cuenta está bloqueada"
- Pendiente-en-revisión → chip raíz "Validación de identidad" → opción "Mi verificación sigue en revisión"
- Rechazado → chip raíz "Validación de identidad" → opción "Me rechazaron la verificación"
</objective>

<execution_context>
@D:/validacion-identidad/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@docs/validacion/Soporte-Validacion-Identidad.md
@docs/validacion/Service_Blueprint_Diagrama Fase 0.md
@docs/validacion/Service_Blueprint_Diagrama.html

Nota: Tarea de documentación pura (Markdown/HTML). Las reglas de Angular/DS Registry de CLAUDE.md NO aplican.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Reestructurar el árbol de soporte y nombrar responsables en Soporte-Validacion-Identidad.md</name>
  <files>docs/validacion/Soporte-Validacion-Identidad.md</files>
  <action>
Editar el documento del árbol de decisión con estos cambios:

1. Encabezado (bloque `>` líneas 3-5): aclarar que el widget de soporte es un agente que presenta opciones tipo chip (no chat libre) que primero responde automáticamente y, si el usuario no queda resuelto, escala a un asesor humano — SIN nombrar el bot. Aclarar que YA existe un chip raíz llamado "Validación de identidad" en el menú principal de ese widget, y que este documento define el sub-árbol de opciones que debe vivir DENTRO de ese chip raíz. Reemplazar la formulación "sin deep-link técnico a una opción específica" por la aclaración de que el copy de cada modal nombra el chip raíz "Validación de identidad" como punto de entrada textual (deep-link por texto, no por integración). Mantener las referencias existentes (StartUser.md línea 75, precedente Argentina, Intercom).

2. Cabecera de la tabla (línea 9): renombrar las columnas al formato del precedente de Argentina — `# | Opción visible (chip) | Ejemplos de preguntas que resuelve | Acción / Respuesta`.

3. Las 8 filas: conservar el contenido de negocio ya definido (NO reinventar textos ni cambiar el mapeo de opciones). En la columna "Acción / Respuesta" de CADA una de las 8 filas, hacer EXPLÍCITA y CONSISTENTE la lógica de escalamiento: el agente responde primero con la info automática y, si el usuario indica que no se resolvió, aparece un chip de seguimiento tipo "Necesito la ayuda de un asesor" que escala a un agente humano. Donde ya estaba implícito ("escalar a agente"), reformularlo a esta lógica consistente. Las filas 1 (Mi cuenta está bloqueada), 2 (Me rechazaron la verificación) y 3 (Mi verificación sigue en revisión) deben conservar esos nombres de opción exactos (son los destinos de los 3 CTAs del blueprint).

4. Agregar una nota corta (después de la tabla) que diferencie este árbol del precedente de Argentina: Colombia solo tiene validación de identidad (Truora para personas naturales; KYB sin confirmar aún para empresas — bloque C "en evaluación"); el resto de países sigue proceso manual vía Sumsub (no automático); y no existe video-tutorial para este flujo.

5. Sección `## Coordinación`: reemplazar la línea "El responsable de validar y construir este árbol... está por definir" por: Juan Camilo Rojas coordina con Laura Sánchez (SAC) para montar/configurar este sub-árbol dentro del chip raíz "Validación de identidad" ya existente en el widget. Mantener la distinción entre lo que YA existe (el widget y el chip raíz "Validación de identidad") y lo que FALTA configurar (el sub-árbol de 8 opciones).

En NINGÚN punto usar el nombre propio del bot.
  </action>
  <verify>
    <automated>Confirmar cabecera nueva de tabla, presencia de nombres de responsables, chip raíz nombrado, y las 3 opciones destino: grep -n "Opción visible (chip)" y grep -n "Juan Camilo Rojas" y grep -n "Laura Sánchez" y grep -c "Validación de identidad" sobre docs/validacion/Soporte-Validacion-Identidad.md</automated>
  </verify>
  <done>El documento tiene columnas al formato Argentina, las 8 filas conservan su contenido con escalamiento a asesor humano explícito, la nota de diferenciación por país está presente, y la sección Coordinación nombra a Juan Camilo Rojas y Laura Sánchez (SAC). Sin nombre propio de bot.</done>
</task>

<task type="auto">
  <name>Task 2: Deep-link textual en los 3 CTAs y Notas finales de Service_Blueprint_Diagrama Fase 0.md</name>
  <files>docs/validacion/Service_Blueprint_Diagrama Fase 0.md</files>
  <action>
Editar solo los 3 puntos de contacto de soporte y la viñeta de enrutamiento en Notas finales. NO tocar el bloque "Incompleta en Sumsub".

1. Etapa 1 → Front stage → Acciones, punto 1 "Modal Pantalla Completa" (línea ~141): reemplazar la aclaración de destino actual ("El botón abre el widget de soporte flotante existente en su menú raíz — sin deep-link a una opción específica; el copy del modal orienta al usuario hacia la opción de bloqueo/validación de identidad dentro de ese menú...") para que indique explícitamente que el copy del modal instruye al usuario a tocar el chip raíz "Validación de identidad" del widget y luego elegir la opción "Mi cuenta está bloqueada" del árbol. Mantener la referencia a `Soporte-Validacion-Identidad.md`.

2. Etapa Continua → Front stage → Acciones, punto 2 PENDIENTE → sub-bullet "En revisión de Financiero" (línea ~175): mismo ajuste — el copy orienta a tocar el chip raíz "Validación de identidad" y elegir la opción "Mi verificación sigue en revisión". Mantener el botón secundario "Contactar a soporte" junto a "Entendido" y la referencia al árbol.

3. Etapa Continua → Front stage → Acciones, bloque RECHAZADO (línea ~179): mismo ajuste — el copy orienta a tocar el chip raíz "Validación de identidad" y elegir la opción "Me rechazaron la verificación". Mantener la referencia al árbol.

4. Sección "## Notas finales", viñeta "Enrutamiento de soporte (Bloqueo, Pendiente-en-revisión, Rechazado)" (línea ~266): actualizar para reflejar que el copy ahora nombra el chip raíz existente "Validación de identidad" como punto de entrada textual, y que cada modal orienta a la opción específica del árbol (Bloqueo → "Mi cuenta está bloqueada", Pendiente → "Mi verificación sigue en revisión", Rechazado → "Me rechazaron la verificación"). Reemplazar la formulación "sin deep-link técnico a una opción específica" por "deep-link por texto (no por integración)".

NO nombrar el bot. NO modificar el bloque "Incompleta en Sumsub" (botón "Continuar verificación").
  </action>
  <verify>
    <automated>Confirmar que los 3 CTAs nombran chip raíz + opción y que Incompleta sigue intacto: grep -n "Mi cuenta está bloqueada" y grep -n "Mi verificación sigue en revisión" y grep -n "Me rechazaron la verificación" y grep -c "Continuar verificación" sobre "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"</automated>
  </verify>
  <done>Los 3 CTAs nombran el chip raíz "Validación de identidad" y su opción específica; la viñeta de Notas finales refleja el deep-link por texto; el bloque "Incompleta en Sumsub" con "Continuar verificación" queda idéntico. Sin nombre propio de bot.</done>
</task>

<task type="auto">
  <name>Task 3: Reflejar los 3 CTAs de forma compacta en Service_Blueprint_Diagrama.html</name>
  <files>docs/validacion/Service_Blueprint_Diagrama.html</files>
  <action>
El archivo es de una sola línea (línea 17). Localizar cada cadena por búsqueda de texto exacto y editar SOLO el texto visible; NO tocar ids, clases, atributos `data-cross-row-*`, ni estructura de grid/flechas. Usar Edit con anclas exactas:

1. Bloqueo (Etapa 1) — anclar en:
   `"Contactar a soporte" (abre el widget de soporte flotante en su menú raíz, sin deep-link; el copy orienta hacia la opción de bloqueo/validación de identidad — ver Soporte-Validacion-Identidad.md).`
   Reemplazar por copy compacto que nombre el chip raíz "Validación de identidad" y la opción "Mi cuenta está bloqueada" (ej.: `"Contactar a soporte" (abre el widget; toca el chip raíz "Validación de identidad" → opción "Mi cuenta está bloqueada" — ver Soporte-Validacion-Identidad.md).`).

2. Pendiente-en-revisión — anclar en:
   `Botón secundario: "Contactar a soporte" (widget en menú raíz — ver Soporte-Validacion-Identidad.md).`
   Reemplazar por copy compacto que nombre el chip raíz "Validación de identidad" y la opción "Mi verificación sigue en revisión".

3. Rechazado — anclar en:
   `Botón: "Contactar a soporte" (abre el mismo widget de soporte en su menú raíz, orientando hacia la opción de apelación/rechazo — ver Soporte-Validacion-Identidad.md) — luego expulsión (ver Etapa 1).`
   Reemplazar por copy compacto que nombre el chip raíz "Validación de identidad" y la opción "Me rechazaron la verificación", conservando el sufijo "— luego expulsión (ver Etapa 1)".

Mantener el copy breve (apto para caja de diagrama). NO nombrar el bot. NO tocar el texto del bloque "Incompleta en Sumsub" (opción "Continuar verificación").
  </action>
  <verify>
    <automated>Confirmar las 3 opciones presentes y estructura intacta: grep -o "Mi cuenta está bloqueada" y grep -o "Mi verificación sigue en revisión" y grep -o "Me rechazaron la verificación" sobre docs/validacion/Service_Blueprint_Diagrama.html; y grep -c "data-cross-row" para confirmar que el conteo de atributos no cambió respecto al original.</automated>
  </verify>
  <done>Los 3 CTAs del HTML nombran el chip raíz "Validación de identidad" y su opción específica de forma compacta; ids/clases/data-cross-row/estructura de grid intactos; bloque "Incompleta en Sumsub" sin cambios. Sin nombre propio de bot.</done>
</task>

</tasks>

<verification>
- Los 3 archivos mencionan el mismo chip raíz "Validación de identidad" y coinciden en la opción por cada CTA (Bloqueo → "Mi cuenta está bloqueada", Pendiente → "Mi verificación sigue en revisión", Rechazado → "Me rechazaron la verificación").
- `Soporte-Validacion-Identidad.md` conserva las 8 filas; columna "Acción / Respuesta" incluye escalamiento a asesor humano; cierra con `## Coordinación` nombrando a Juan Camilo Rojas y Laura Sánchez (SAC).
- Ningún archivo contiene el nombre propio del bot (verificar ausencia por grep).
- El bloque "Incompleta en Sumsub" queda idéntico en `.md` y `.html` (opción "Continuar verificación" intacta).
</verification>

<success_criteria>
- Los 3 CTAs enrutan por texto al chip raíz "Validación de identidad" + opción específica, consistentes entre los 3 archivos.
- Árbol reformateado al patrón Argentina con escalamiento humano explícito en las 8 filas.
- Coordinación nombra a Juan Camilo Rojas coordinando con Laura Sánchez (SAC).
- Sin nombre propio de bot en ningún archivo. HTML sin cambios estructurales.
</success_criteria>

<output>
Create `.planning/quick/260717-lyq-refinar-enrutamiento-de-soporte-en-servi/260717-lyq-SUMMARY.md` when done
</output>

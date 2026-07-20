---
phase: quick-260720-ivq
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/validacion/Service_Blueprint_Diagrama.html
  - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
autonomous: true
requirements: [QUICK-260720-ivq]
must_haves:
  truths:
    - "Existe una sección nueva y separada del grid principal de swimlanes, en ambos archivos, con un mini-flowchart: chip raíz 'Validación de identidad' → 8 opciones (copy completo) → 'Chips de cierre'"
    - "El copy de cada una de las 8 opciones es el mismo texto ya validado en Soporte-Validacion-Identidad.md, sin reescribir"
    - "El grid principal de swimlanes (ids, clases, 30 data-cross-row, estructura) queda exactamente igual, salvo una frase de puente agregada al texto de la caja 'Árbol de opciones'"
    - "Soporte-Validacion-Identidad.md no se modifica"
  artifacts:
    - path: "docs/validacion/Service_Blueprint_Diagrama.html"
      provides: "Nueva tarjeta blanca debajo del grid principal con el mini-flowchart de detalle"
    - path: "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"
      provides: "Nueva sección '## Detalle del árbol de soporte — Validación de identidad'"
---

<objective>
El usuario, viendo el diagrama renderizado, señaló que la caja compacta "Árbol de opciones (chips)" de Etapa 1 no muestra suficiente detalle: solo una frase por opción, sin el copy completo ni confirmación clara de que no hay sub-decisiones. Se agrega una sección nueva y separada (debajo del grid principal, en el mismo HTML, y como nueva sección en el .md) con el detalle completo: chip raíz → 8 opciones con su copy completo (reusado tal cual de `Soporte-Validacion-Identidad.md`) → convergen en "Chips de cierre". El grid principal de swimlanes NO se toca en su estructura — solo se le agrega una frase de puente hacia la sección nueva.

Decisiones ya confirmadas con el usuario (no revisitar):
- Sección nueva y separada, no expandir la caja dentro de Etapa 1.
- Layout vertical (una opción debajo de otra), no grid 2×4.
- Copy reusado tal cual de `Soporte-Validacion-Identidad.md`, sin reescribir con ux-writing en esta vuelta.

Output: 1 sección nueva en el HTML (tarjeta blanca aparte) + 1 sección nueva en el .md, ambas con el mismo contenido consistente; 1 frase de puente agregada en cada archivo dentro de la caja/ítem "Árbol de opciones" existente.
</objective>

<execution_context>
@D:/validacion-identidad/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
Nota: Tarea de documentación pura (Markdown/HTML estático). Las reglas de Angular/DS Registry de CLAUDE.md NO aplican.

El HTML es un archivo de 20 líneas: la línea 17 tiene el grid principal completo (una sola línea física muy larga); la línea 18 es `  </div>` (cierra la tarjeta blanca del grid); línea 19 es `</body>`; línea 20 es `</html>`. La sección nueva se inserta como contenido nuevo entre el cierre de línea 18 y `</body>` — es decir, reemplazando el string `</div>\n</body>` (con el salto de línea) por `</div>\n\n[NUEVA TARJETA]\n</body>`, o de forma más simple: usar como old_string el string exacto `  </div>\n</body>\n</html>` (las 3 últimas líneas) y como new_string esas mismas 3 líneas con la tarjeta nueva insertada entre la primera y la segunda.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Agregar la sección de detalle nueva en Service_Blueprint_Diagrama.html + frase de puente en la caja existente</name>
  <files>docs/validacion/Service_Blueprint_Diagrama.html</files>
  <action>
Dos ediciones con Edit tool.

### Edit 1.1 — Agregar la tarjeta nueva antes de `</body>`

old_string (las últimas 3 líneas del archivo, líneas 18-20 — confirmar con Read antes de aplicar, ya que son líneas cortas normales, no la línea 17 larga):
```
  </div>
</body>
</html>
```

new_string:
```
  </div>

  <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); margin-top: 24px;">
    <h2 class="text-xl font-bold text-slate-900 mb-2">Detalle del árbol de soporte — Validación de identidad</h2>
    <p class="text-slate-500 mb-6 text-sm">Sub-árbol de 8 opciones dentro del chip raíz "Validación de identidad" del widget de soporte (ver Etapa 1 → Front stage → Acciones arriba). Ninguna de las 8 opciones se ramifica en una sub-decisión adicional — todas son respuestas terminales (texto, o texto con enlace/redirección solo en la opción 4). El copy es el mismo ya validado en Soporte-Validacion-Identidad.md.</p>
    <div class="flex flex-col items-center gap-2">
      <div class="w-[280px] border-2 rounded-md p-2 text-[11px] font-bold text-center bg-[#C3F4D4] border-[#70D998] text-[#136631]">Chip raíz: "Validación de identidad" (menú principal del widget)</div>
      <div class="flex flex-col items-center"><div class="w-[2px] h-4 bg-teal-500"></div><div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-teal-500"></div></div>
      <span class="text-[10px] text-slate-500 italic">el usuario elige un chip (una sola opción)</span>
      <div class="flex flex-col items-center"><div class="w-[2px] h-4 bg-teal-500"></div><div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-teal-500"></div></div>
      <div class="w-[640px] border-2 rounded-md p-3 text-[11px] leading-relaxed bg-[#D1E8FF] border-[#73B8FF] text-[#004799]"><span class="font-bold block mb-1">1. Mi cuenta está bloqueada</span>El agente responde primero automáticamente: el bloqueo es una revisión de Legal/Financiero (Etapa 1 del blueprint), no un error de código ni una sanción automática, y no tiene ETA fijo porque depende de que Legal/Financiero resuelvan el caso a mano. Al final de esa respuesta, ofrece los chips de cierre "Es todo por hoy" / "Necesito la ayuda de un asesor para mi validación de identidad" — este último escala a un asesor humano si el usuario lo elige.</div>
      <div class="w-[640px] border-2 rounded-md p-3 text-[11px] leading-relaxed bg-[#D1E8FF] border-[#73B8FF] text-[#004799]"><span class="font-bold block mb-1">2. Me rechazaron la verificación</span>El agente responde primero automáticamente: "Rechazado" (falla del proceso) es distinto de "Bloqueado por fraude" (falla del usuario), y existe la vía de apelación ya contemplada en el blueprint ("Soporte desbanea cuenta si es falso positivo", Etapa Continua, Back stage punto 3) para reenviar el caso a revisión. Al final de esa respuesta, ofrece los chips de cierre "Es todo por hoy" / "Necesito la ayuda de un asesor para mi validación de identidad" — este último escala a un asesor humano para gestionar la apelación.</div>
      <div class="w-[640px] border-2 rounded-md p-3 text-[11px] leading-relaxed bg-[#D1E8FF] border-[#73B8FF] text-[#004799]"><span class="font-bold block mb-1">3. Mi verificación sigue en revisión</span>El agente responde primero automáticamente: el SLA real es de 48–72 horas hábiles (ya documentado en el blueprint, Etapa Continua Back stage punto 2, y en UX-Writing-Modales-UserPilot.md sección 4b), y no necesita repetir el proceso ni reenviar documentos. Al final de esa respuesta, ofrece los chips de cierre "Es todo por hoy" / "Necesito la ayuda de un asesor para mi validación de identidad" — este último escala a un asesor humano.</div>
      <div class="w-[640px] border-2 rounded-md p-3 text-[11px] leading-relaxed bg-[#C3F4D4] border-[#70D998] text-[#136631]"><span class="font-bold block mb-1">4. Empecé la verificación pero no la terminé</span>El agente responde primero automáticamente y guía al usuario para retomar el proceso en Sumsub — redirige al flujo (mismo destino que el botón "Continuar verificación" del modal "incompleto en Sumsub"; único caso del árbol con enlace/redirección real, no solo texto). Al final de esa respuesta, ofrece los chips de cierre "Es todo por hoy" / "Necesito la ayuda de un asesor para mi validación de identidad" — este último escala a un asesor humano.</div>
      <div class="w-[640px] border-2 rounded-md p-3 text-[11px] leading-relaxed bg-[#C3F4D4] border-[#70D998] text-[#136631]"><span class="font-bold block mb-1">5. No sé qué proceso me aplica / qué documentos necesito</span>El agente responde primero automáticamente, diferenciando por país: Colombia usa Truora (solo personas naturales; las empresas usan KYB de Sumsub, bloque C, en evaluación). El resto de países usa proceso manual vía Sumsub con variantes por persona natural/jurídica/extranjero (bloques A/B/D/E ya definidos en el blueprint). No hay video-tutorial disponible — da guía en texto paso a paso según el bloque que le aplica. Al final de esa respuesta, ofrece los chips de cierre "Es todo por hoy" / "Necesito la ayuda de un asesor para mi validación de identidad" — este último escala a un asesor humano.</div>
      <div class="w-[640px] border-2 rounded-md p-3 text-[11px] leading-relaxed bg-[#EAD9FF] border-[#C495FF] text-[#4B1A99]"><span class="font-bold block mb-1">6. Soy extranjero, no sé qué documento cargar</span>El agente responde primero automáticamente: puede cargar pasaporte o identificación extranjera — Sumsub parametriza automáticamente el formato local del documento (Reglasvalidacion.md, regla 3 "Parametrización Automática Cross-Border"). Como este caso requiere revisión manual, junto con esa respuesta se ofrecen de inmediato los chips de cierre "Es todo por hoy" / "Necesito la ayuda de un asesor para mi validación de identidad", con el asesor humano como vía recomendada.</div>
      <div class="w-[640px] border-2 rounded-md p-3 text-[11px] leading-relaxed bg-[#EAD9FF] border-[#C495FF] text-[#4B1A99]"><span class="font-bold block mb-1">7. Tengo una empresa / dudas de KYB</span>El agente responde primero automáticamente: en Colombia, el KYB está "en evaluación" (bloque C del blueprint) — la vía formal aún se está definiendo. En el resto de países, sigue las reglas de persona jurídica ya definidas: prueba de vida del representante legal + búsqueda de la empresa + datos fiscales; Sumsub autocompleta por nombre (Reglasvalidacion.md, regla 3 "Regla de Cero Fricción en Empresa") — el usuario no digita NIT. Al final de esa respuesta, ofrece los chips de cierre "Es todo por hoy" / "Necesito la ayuda de un asesor para mi validación de identidad" — este último escala a un asesor humano.</div>
      <div class="w-[640px] border-2 rounded-md p-3 text-[11px] leading-relaxed bg-[#E5E7EB] border-[#9CA3AF] text-[#374151]"><span class="font-bold block mb-1">8. Otro tema</span>El agente ofrece directamente los chips de cierre "Es todo por hoy" / "Necesito la ayuda de un asesor para mi validación de identidad", sin respuesta automática previa — este caso escala de inmediato a un asesor humano si el usuario lo elige.</div>
      <div class="flex flex-col items-center"><div class="w-[2px] h-4 bg-teal-500"></div><div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-teal-500"></div></div>
      <div class="w-[420px] border-2 rounded-md p-2 text-[11px] font-medium text-center bg-[#E5E7EB] border-[#9CA3AF] text-[#374151]">Chips de cierre — al final de la respuesta de la opción elegida (no antes, no desde el menú): "Es todo por hoy" (cierra) y "Necesito la ayuda de un asesor para mi validación de identidad" (escala a un asesor humano).</div>
    </div>
  </div>
</body>
</html>
```

### Edit 1.2 — Frase de puente en la caja compacta "Árbol de opciones" existente (dentro de la línea 17 larga)

old_string:
```
🌳 Árbol de opciones (chips) — dentro del chip raíz "Validación de identidad". El agente responde primero automático (ninguna opción tiene sub-decisión — respuesta terminal, con enlace solo en la opción 4); al final de esa respuesta ver caja "Chips de cierre".
```

new_string:
```
🌳 Árbol de opciones (chips) — dentro del chip raíz "Validación de identidad". El agente responde primero automático (ninguna opción tiene sub-decisión — respuesta terminal, con enlace solo en la opción 4); al final de esa respuesta ver caja "Chips de cierre" (detalle completo con el copy exacto de cada opción: ver sección "Detalle del árbol de soporte" más abajo).
```

No tocar ningún otro texto, id, clase, atributo `data-cross-row-*`, ni la estructura de grid/flex existente. Antes de aplicar Edit 1.1, usar Read (offset cerca del final del archivo) para confirmar que las líneas 18-20 son exactamente `  </div>`, `</body>`, `</html>` — si difieren ligeramente en espacios, ajustar el old_string a lo que realmente hay, sin alterar el criterio de dónde insertar (justo antes de `</body>`).
  </action>
  <verify>
    <automated>Grep sobre docs/validacion/Service_Blueprint_Diagrama.html: "Detalle del árbol de soporte" debe aparecer al menos 2 veces (título de la sección nueva + frase de puente); las 8 opciones deben aparecer con su título completo ("1. Mi cuenta está bloqueada", "2. Me rechazaron la verificación", ..., "8. Otro tema"); "data-cross-row" debe seguir apareciendo 30 veces (estructura del grid principal intacta); el archivo debe seguir terminando en `</html>`.</automated>
  </verify>
  <done>Nueva tarjeta con las 8 opciones (copy completo) + chip raíz + Chips de cierre agregada antes de `</body>`; frase de puente agregada en la caja existente; grid principal sin cambios estructurales.</done>
</task>

<task type="auto">
  <name>Task 2: Agregar la sección de detalle nueva en Service_Blueprint_Diagrama Fase 0.md + frase de puente</name>
  <files>docs/validacion/Service_Blueprint_Diagrama Fase 0.md</files>
  <action>
Dos ediciones con Edit tool.

### Edit 2.1 — Frase de puente en el ítem 3 de Etapa 1

old_string:
```
3. 🟣 Árbol de opciones (chips) — dentro del chip raíz "Validación de identidad". El agente responde primero automáticamente según la opción elegida. Ninguna de las 8 opciones se ramifica en una sub-decisión adicional — todas son respuestas terminales (texto, o texto con enlace/redirección solo en la opción 4). Solo al final de esa respuesta — nunca antes, ni desde el menú — aparecen los chips de cierre del ítem 4:
```

new_string:
```
3. 🟣 Árbol de opciones (chips) — dentro del chip raíz "Validación de identidad". El agente responde primero automáticamente según la opción elegida. Ninguna de las 8 opciones se ramifica en una sub-decisión adicional — todas son respuestas terminales (texto, o texto con enlace/redirección solo en la opción 4). Solo al final de esa respuesta — nunca antes, ni desde el menú — aparecen los chips de cierre del ítem 4 (detalle completo con el copy exacto de cada opción: ver sección "Detalle del árbol de soporte — Validación de identidad" más abajo):
```

### Edit 2.2 — Agregar la sección nueva después de "## ETAPA CONTINUA: Operación Semanal" y antes de "## Tabla completa de conectores verticales (entre filas)"

old_string:
```
## Tabla completa de conectores verticales (entre filas)
```

new_string:
```
## Detalle del árbol de soporte — Validación de identidad

Sub-árbol de 8 opciones dentro del chip raíz "Validación de identidad" del widget de soporte (ver Etapa 1 → Front stage → Acciones arriba). Ninguna de las 8 opciones se ramifica en una sub-decisión adicional — todas son respuestas terminales (texto, o texto con enlace/redirección solo en la opción 4). El copy es el mismo ya validado en `Soporte-Validacion-Identidad.md`.

**Chip raíz:** "Validación de identidad" (menú principal del widget) → el usuario elige un chip (una sola opción):

1. **Mi cuenta está bloqueada** — El agente responde primero automáticamente: el bloqueo es una revisión de Legal/Financiero (Etapa 1 del blueprint), no un error de código ni una sanción automática, y no tiene ETA fijo porque depende de que Legal/Financiero resuelvan el caso a mano. Al final de esa respuesta, ofrece los chips de cierre **"Es todo por hoy"** / **"Necesito la ayuda de un asesor para mi validación de identidad"** — este último escala a un asesor humano si el usuario lo elige.

2. **Me rechazaron la verificación** — El agente responde primero automáticamente: "Rechazado" (falla del proceso) es distinto de "Bloqueado por fraude" (falla del usuario), y existe la vía de apelación ya contemplada en el blueprint ("Soporte desbanea cuenta si es falso positivo", Etapa Continua, Back stage punto 3) para reenviar el caso a revisión. Al final de esa respuesta, ofrece los chips de cierre **"Es todo por hoy"** / **"Necesito la ayuda de un asesor para mi validación de identidad"** — este último escala a un asesor humano para gestionar la apelación.

3. **Mi verificación sigue en revisión** — El agente responde primero automáticamente: el SLA real es de 48–72 horas hábiles (ya documentado en el blueprint, Etapa Continua Back stage punto 2, y en `UX-Writing-Modales-UserPilot.md` sección 4b), y no necesita repetir el proceso ni reenviar documentos. Al final de esa respuesta, ofrece los chips de cierre **"Es todo por hoy"** / **"Necesito la ayuda de un asesor para mi validación de identidad"** — este último escala a un asesor humano.

4. **Empecé la verificación pero no la terminé** — El agente responde primero automáticamente y guía al usuario para retomar el proceso en Sumsub — redirige al flujo (mismo destino que el botón "Continuar verificación" del modal "incompleto en Sumsub"; único caso del árbol con enlace/redirección real, no solo texto). Al final de esa respuesta, ofrece los chips de cierre **"Es todo por hoy"** / **"Necesito la ayuda de un asesor para mi validación de identidad"** — este último escala a un asesor humano.

5. **No sé qué proceso me aplica / qué documentos necesito** — El agente responde primero automáticamente, diferenciando por país: Colombia usa Truora (solo personas naturales; las empresas usan KYB de Sumsub, bloque C, en evaluación). El resto de países usa proceso manual vía Sumsub con variantes por persona natural/jurídica/extranjero (bloques A/B/D/E ya definidos en el blueprint). No hay video-tutorial disponible — da guía en texto paso a paso según el bloque que le aplica. Al final de esa respuesta, ofrece los chips de cierre **"Es todo por hoy"** / **"Necesito la ayuda de un asesor para mi validación de identidad"** — este último escala a un asesor humano.

6. **Soy extranjero, no sé qué documento cargar** — El agente responde primero automáticamente: puede cargar pasaporte o identificación extranjera — Sumsub parametriza automáticamente el formato local del documento (Reglasvalidacion.md, regla 3 "Parametrización Automática Cross-Border"). Como este caso requiere revisión manual, junto con esa respuesta se ofrecen de inmediato los chips de cierre **"Es todo por hoy"** / **"Necesito la ayuda de un asesor para mi validación de identidad"**, con el asesor humano como vía recomendada.

7. **Tengo una empresa / dudas de KYB** — El agente responde primero automáticamente: en Colombia, el KYB está "en evaluación" (bloque C del blueprint) — la vía formal aún se está definiendo. En el resto de países, sigue las reglas de persona jurídica ya definidas: prueba de vida del representante legal + búsqueda de la empresa + datos fiscales; Sumsub autocompleta por nombre (Reglasvalidacion.md, regla 3 "Regla de Cero Fricción en Empresa") — el usuario no digita NIT. Al final de esa respuesta, ofrece los chips de cierre **"Es todo por hoy"** / **"Necesito la ayuda de un asesor para mi validación de identidad"** — este último escala a un asesor humano.

8. **Otro tema** — El agente ofrece directamente los chips de cierre **"Es todo por hoy"** / **"Necesito la ayuda de un asesor para mi validación de identidad"**, sin respuesta automática previa — este caso escala de inmediato a un asesor humano si el usuario lo elige.

**Chips de cierre** (al final de la respuesta de la opción elegida — no antes, no desde el menú): **"Es todo por hoy"** (cierra) y **"Necesito la ayuda de un asesor para mi validación de identidad"** (escala a un asesor humano).

---

## Tabla completa de conectores verticales (entre filas)
```

No tocar ninguna otra parte del archivo (el resto de las etapas, las tablas de conectores existentes, y "Notas finales" quedan exactamente igual).
  </action>
  <verify>
    <automated>Grep sobre "docs/validacion/Service_Blueprint_Diagrama Fase 0.md": "## Detalle del árbol de soporte" debe aparecer 1 vez como encabezado nuevo; la frase de puente debe aparecer en el ítem 3; las 8 opciones deben aparecer con su nombre completo en la nueva sección; "## Tabla completa de conectores verticales" debe seguir presente después de la nueva sección.</automated>
  </verify>
  <done>Nueva sección "## Detalle del árbol de soporte — Validación de identidad" agregada con las 8 opciones (copy completo), chip raíz y Chips de cierre; frase de puente agregada en ítem 3 de Etapa 1; resto del archivo sin cambios.</done>
</task>

</tasks>

<verification>
- Ambos archivos tienen una sección/tarjeta nueva con el mismo contenido (chip raíz → 8 opciones con copy completo → Chips de cierre), consistente entre sí y con `Soporte-Validacion-Identidad.md` (sin inventar texto).
- El grid principal de swimlanes del HTML mantiene 30 ocurrencias de `data-cross-row` — sin regresiones estructurales.
- `docs/validacion/Soporte-Validacion-Identidad.md` no se modifica.
- La caja/ítem "Árbol de opciones" existente en Etapa 1 solo gana una frase de puente, sin perder ni alterar su contenido anterior.
</verification>

<success_criteria>
- El usuario puede ver, en el propio diagrama (HTML) y en su transcripción (.md), el copy completo de cada una de las 8 opciones y la confirmación de que ninguna se ramifica — sin tener que abrir un archivo aparte.
- Sin regresiones en el grid principal existente.
</success_criteria>

<output>
Create `.planning/quick/260720-ivq-agregar-seccion-nueva-de-detalle-al-blue/260720-ivq-SUMMARY.md` when done
</output>

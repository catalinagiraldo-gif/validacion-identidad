---
phase: quick-260720-gij
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
  - docs/validacion/Service_Blueprint_Diagrama.html
autonomous: true
requirements: [QUICK-260720-gij]
must_haves:
  truths:
    - "El modal de Bloqueo (Etapa 1) ya NO tiene un 'Botón único: Contactar a soporte' — no existe ese botón en la realidad"
    - "El body del modal (texto real que ve el usuario, entre comillas) incluye una línea nueva que lo orienta al ícono de soporte flotante en la esquina inferior derecha para compartir su caso"
    - "Se conserva, como nota interna (no como texto de usuario), que ese ícono es la vía real de contacto y hacia dónde orienta dentro del árbol (chip raíz 'Validación de identidad' → opción 'Mi cuenta está bloqueada')"
    - "Pendiente-en-revisión y Rechazado NO se tocan en este plan (quedan como están, con sus botones 'Entendido'/'Contactar a soporte')"
  artifacts:
    - path: "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"
      provides: "Item 1 de Etapa 1 (Modal Pantalla Completa) reescrito sin botón de soporte"
    - path: "docs/validacion/Service_Blueprint_Diagrama.html"
      provides: "Misma caja reescrita de forma compacta"
---

<objective>
El usuario señaló que el modal de Bloqueo (full-screen, Etapa 1) no debería mostrar un "botón" de Contactar a soporte, porque ese botón no existe realmente (ya se documentó en un quick task anterior que no hay integración técnica entre el modal y el widget de soporte). En vez de simular un botón que no existe, el modal debe simplemente incluir una línea de copy (texto normal del body, no un CTA) que oriente al usuario a usar el ícono de soporte flotante que YA existe en la esquina inferior derecha de la pantalla, para compartir su caso.

Se usó el skill de UX writing para redactar la nueva línea, evaluada en los 4 estándares (purposeful, concise, conversational, clear). El usuario aprobó esta línea exacta:

**"¿Tienes dudas? Comparte tu caso desde el ícono de soporte, abajo a la derecha."**

Decisión ya confirmada (no revisitar):
- Este cambio aplica SOLO al modal de Bloqueo (Etapa 1). Pendiente-en-revisión y Rechazado (Etapa Continua) NO se tocan en este plan — se decidió explícitamente no tocarlos ahora.
- La orientación hacia el chip raíz "Validación de identidad" → opción "Mi cuenta está bloqueada" se mantiene, pero ahora como nota interna del blueprint (fuera de las comillas de texto de usuario), no como parte de un botón inexistente.

Output: el item 1 de Etapa 1 → Front stage → Acciones (Modal Pantalla Completa) reescrito en ambos archivos, sin "Botón único: Contactar a soporte", con la nueva línea de body y la nota interna de orientación al ícono de soporte.
</objective>

<execution_context>
@D:/validacion-identidad/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
Nota: Tarea de documentación pura (Markdown/HTML estático). Las reglas de Angular/DS Registry de CLAUDE.md NO aplican.

El HTML tiene su contenido principal en una sola línea física larga (línea 17). Los `old_string`/`new_string` de este plan ya fueron extraídos y verificados con encoding UTF-8 correcto directamente del archivo — úsalos EXACTAMENTE como están, no los retipees.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Reescribir el modal de Bloqueo en Service_Blueprint_Diagrama Fase 0.md</name>
  <files>docs/validacion/Service_Blueprint_Diagrama Fase 0.md</files>
  <action>
Editar con Edit tool. old_string:
```
1. 🔵 Modal Pantalla Completa — Headline: **"Bloqueamos esta operación por seguridad"**. Body: *"Estamos revisando tu cuenta para proteger tus fondos. No podrás hacer retiros ni envíos mientras dure la revisión."* Botón único: **"Contactar a soporte"** (evita dejar al usuario sin ninguna acción disponible). El botón NO abre el widget de soporte automáticamente — no existe esa integración técnica —; el copy del modal solo le indica al usuario que puede contactar a soporte, orientándolo a abrir por su cuenta el widget de soporte flotante existente, tocar el chip raíz **"Validación de identidad"** y elegir la opción **"Mi cuenta está bloqueada"** del árbol (indicación textual, no deep-link técnico; ver ítems 2-4 a continuación). Sin botón de cierre — permanece hasta que Legal/Financiero resuelvan el caso. (Bloqueo Visual: no congela el saldo por código, es UserPilot interceptando la pantalla. Copy y justificación de tono: ver `UX-Writing-Modales-UserPilot.md`) — *(conector vertical hacia Back stage, etiqueta "Reglas")*
```

new_string:
```
1. 🔵 Modal Pantalla Completa — Headline: **"Bloqueamos esta operación por seguridad"**. Body: *"Estamos revisando tu cuenta para proteger tus fondos. No podrás hacer retiros ni envíos mientras dure la revisión. ¿Tienes dudas? Comparte tu caso desde el ícono de soporte, abajo a la derecha."* Sin botón de cierre ni de contacto dentro del modal — no existe un botón "Contactar a soporte" real; permanece hasta que Legal/Financiero resuelvan el caso. La única vía de contacto es el ícono de soporte flotante que ya existe en la esquina inferior derecha de la pantalla (fuera del modal), donde el usuario puede tocar el chip raíz **"Validación de identidad"** y elegir la opción **"Mi cuenta está bloqueada"** del árbol (ver ítems 2-4 a continuación). (Bloqueo Visual: no congela el saldo por código, es UserPilot interceptando la pantalla. Copy y justificación de tono: ver `UX-Writing-Modales-UserPilot.md`) — *(conector vertical hacia Back stage, etiqueta "Reglas")*
```

No tocar ninguna otra parte del archivo (items 2-5 de Etapa 1, Pendiente, Rechazado, Notas finales quedan exactamente igual).
  </action>
  <verify>
    <automated>Grep sobre "docs/validacion/Service_Blueprint_Diagrama Fase 0.md": el texto "Botón único: **\"Contactar a soporte\"**" ya no debe aparecer; "Comparte tu caso desde el ícono de soporte" debe aparecer 1 vez; "Botón secundario" (Pendiente) y el "Botón: **\"Contactar a soporte\"**" de Rechazado deben seguir presentes sin cambios; "Continuar verificación" sigue presente.</automated>
  </verify>
  <done>El item 1 de Etapa 1 ya no tiene "Botón único: Contactar a soporte"; el body entre comillas incluye la nueva línea sobre el ícono de soporte; se conserva como nota interna la orientación al chip raíz/opción; Pendiente y Rechazado quedan sin cambios.</done>
</task>

<task type="auto">
  <name>Task 2: Reescribir la misma caja en Service_Blueprint_Diagrama.html</name>
  <files>docs/validacion/Service_Blueprint_Diagrama.html</files>
  <action>
Editar con Edit tool (archivo de una sola línea física larga; el old_string es un substring único ya verificado). old_string:
```
Modal Pantalla Completa — Headline: "Bloqueamos esta operación por seguridad". Body: "Estamos revisando tu cuenta para proteger tus fondos. No podrás hacer retiros ni envíos mientras dure la revisión." Botón único: "Contactar a soporte" (no abre el widget automático — indica contactar soporte por su cuenta: chip raíz "Validación de identidad" → opción "Mi cuenta está bloqueada" — ver cajas siguientes). Sin botón de cierre — permanece hasta que Legal/Financiero resuelvan el caso. (Bloqueo Visual: no congela el saldo por código, es UserPilot interceptando la pantalla.)
```

new_string:
```
Modal Pantalla Completa — Headline: "Bloqueamos esta operación por seguridad". Body: "Estamos revisando tu cuenta para proteger tus fondos. No podrás hacer retiros ni envíos mientras dure la revisión. ¿Tienes dudas? Comparte tu caso desde el ícono de soporte, abajo a la derecha." Sin botón de cierre ni de contacto — no existe un botón "Contactar a soporte" real; permanece hasta que Legal/Financiero resuelvan el caso. La única vía de contacto es el ícono de soporte flotante ya existente (fuera del modal), donde toca el chip raíz "Validación de identidad" → opción "Mi cuenta está bloqueada" — ver cajas siguientes. (Bloqueo Visual: no congela el saldo por código, es UserPilot interceptando la pantalla.)
```

No tocar ningún otro texto, id, clase, atributo `data-cross-row-*`, ni la estructura de grid/flex del resto del archivo. Las cajas "Widget de Soporte", "Árbol de opciones (chips)" y "Escalamiento" quedan exactamente igual. Los bloques Pendiente y Rechazado (con sus menciones a "Contactar a soporte") quedan sin cambios.
  </action>
  <verify>
    <automated>Grep -o sobre docs/validacion/Service_Blueprint_Diagrama.html: "Botón único: \"Contactar a soporte\"" debe aparecer 0 veces; "Comparte tu caso desde el ícono de soporte" debe aparecer 1 vez; "data-cross-row" debe seguir apareciendo 30 veces; "Widget de Soporte" y "Árbol de opciones" y "Escalamiento" siguen presentes; los 2 "Contactar a soporte" restantes (Pendiente y Rechazado) siguen presentes.</automated>
  </verify>
  <done>La caja de Bloqueo ya no tiene "Botón único: Contactar a soporte"; incluye la nueva línea de body sobre el ícono de soporte; estructura HTML (ids/clases/data-cross-row) intacta; Pendiente y Rechazado sin cambios.</done>
</task>

</tasks>

<verification>
- El modal de Bloqueo, en ambos archivos, ya no presenta un "botón" de contacto a soporte que no existe — solo copy dentro del body que orienta al ícono de soporte flotante en la esquina inferior derecha.
- La orientación hacia el chip raíz "Validación de identidad" → opción "Mi cuenta está bloqueada" se conserva como nota interna del blueprint, coherente con las cajas "Widget de Soporte" / "Árbol de opciones" / "Escalamiento" ya existentes en Etapa 1.
- Pendiente-en-revisión y Rechazado quedan exactamente iguales en ambos archivos (sin tocar).
- El HTML mantiene 30 ocurrencias de `data-cross-row`.
</verification>

<success_criteria>
- Modal de Bloqueo reescrito sin botón inexistente, con copy aprobado por el usuario, en ambos archivos.
- Sin regresiones en Pendiente, Rechazado, ni en la estructura del HTML.
</success_criteria>

<output>
Create `.planning/quick/260720-gij-el-modal-de-bloqueo-no-debe-mostrar-un-b/260720-gij-SUMMARY.md` when done
</output>

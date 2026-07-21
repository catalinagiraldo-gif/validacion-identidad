---
phase: quick-260720-spj
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/validacion/Soporte-Validacion-Identidad.md
  - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
  - docs/validacion/Service_Blueprint_Diagrama.html
autonomous: true
requirements: [QUICK-260720-spj]
must_haves:
  truths:
    - "La Nota interna de la sub-rama Colombia-persona natural de la opción 5 indica que el destino técnico real es Truora, no Sumsub"
    - "Los párrafos introductorios de los 3 archivos ya no afirman que 'todos' los enlaces de las opciones 5/6/7 apuntan a Sumsub sin excepción"
  artifacts:
    - path: "docs/validacion/Soporte-Validacion-Identidad.md"
      provides: "Fila 5 e intro corregidas"
    - path: "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"
      provides: "Sección de detalle e intro corregidas"
    - path: "docs/validacion/Service_Blueprint_Diagrama.html"
      provides: "Caja 5 corregida"
---

<objective>
El usuario pidió aplicar a la opción 5 la misma evaluación de coherencia que se aplicó a la opción 7 (quick task 260720-sbo): verificar que el copy y las notas internas coincidan con lo que el blueprint de Fase 0 realmente documenta.

Se encontró **un problema real**: en la vuelta anterior (quick task 260720-l7m), al aplicar la instrucción "5, 6 y 7 también deberían dar enlace a Sumsub", se sobreescribió el destino de la sub-rama Colombia-persona natural de la opción 5 de "Truora" a "Sumsub" — pero el blueprint es explícito en esto (Etapa 0.5, DOC ENLACES bloque C): *"Las personas naturales siguen validándose con Truora, fuera de este enlace"* (el enlace de Sumsub). Es decir, ese caso específico **queda fuera del enlace de Sumsub por diseño** — no es un descuido del blueprint, es una regla explícita. La corrección anterior generalizó de más y volvió esta fila técnicamente incorrecta.

Se revisó el resto de la opción 5 contra el mismo criterio: la sub-rama "Resto de países" sí va correctamente a Sumsub (bloques A/B), sin problema. El resumen compacto de la opción 5 en el ítem 3 de Etapa 1 (grid principal) **nunca tuvo este error** — ya decía correctamente "Colombia usa Truora" desde antes de la corrección de la vuelta anterior, porque esa línea compacta no fue tocada en esa vuelta.

Este plan corrige la Nota interna (nunca el Copy, que sigue sin nombrar ningún validador) para que refleje Truora como destino real de esa sub-rama específica, y ajusta los párrafos introductorios de los 3 archivos que afirmaban "todos apuntan a Sumsub" sin excepción.
</objective>

<execution_context>
@D:/validacion-identidad/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
Nota: Tarea de documentación pura (Markdown/HTML estático). Las reglas de Angular/DS Registry de CLAUDE.md NO aplican. Fuente de verdad: `Service_Blueprint_Diagrama Fase 0.md` línea 114 (DOC ENLACES bloque C) — cita textual: "Las personas naturales siguen validándose con Truora, fuera de este enlace."

Regla que NO cambia: el Copy de cara al usuario nunca nombra el validador (ni Sumsub ni Truora) — esto solo corrige la Nota interna (documentación de negocio, no texto de usuario).
</context>

<tasks>

<task type="auto">
  <name>Task 1: Corregir la Nota interna de la sub-rama Colombia (opción 5) en Soporte-Validacion-Identidad.md</name>
  <files>docs/validacion/Soporte-Validacion-Identidad.md</files>
  <action>Cambiar "enlace a Sumsub para personas naturales" por "enlace a Truora para personas naturales (DOC ENLACES bloque C: este caso queda 'fuera del enlace' de Sumsub)" en la fila 5. Ajustar el párrafo introductorio (párrafo 3) para reflejar la excepción en vez de "todos apuntan a Sumsub". Ya aplicada por el orquestador.</action>
  <verify>
    <automated>Grep sobre docs/validacion/Soporte-Validacion-Identidad.md: "enlace a Truora" debe aparecer al menos 1 vez; "enlace a Sumsub para personas naturales" NO debe aparecer.</automated>
  </verify>
  <done>Nota interna corregida; intro sin la afirmación absoluta incorrecta.</done>
</task>

<task type="auto">
  <name>Task 2: Corregir la misma Nota interna en Service_Blueprint_Diagrama Fase 0.md</name>
  <files>docs/validacion/Service_Blueprint_Diagrama Fase 0.md</files>
  <action>Mismo criterio aplicado a la sección "## Detalle del árbol de soporte" y su párrafo introductorio. Ya aplicada por el orquestador.</action>
  <verify>
    <automated>Grep sobre "docs/validacion/Service_Blueprint_Diagrama Fase 0.md": "enlace a Truora" presente; el ítem 3 (resumen compacto) ya decía "Colombia usa Truora" y no requirió cambios.</automated>
  </verify>
  <done>Nota interna e intro corregidas.</done>
</task>

<task type="auto">
  <name>Task 3: Corregir la caja 5 en Service_Blueprint_Diagrama.html</name>
  <files>docs/validacion/Service_Blueprint_Diagrama.html</files>
  <action>Mismo criterio aplicado a la sub-tarjeta Colombia de la caja 5 en la tarjeta de detalle. La caja compacta del grid principal ya decía correctamente "Colombia = Truora" y no requirió cambios. Sin tocar estructura de fan-out/fan-in ni data-cross-row. Ya aplicada por el orquestador.</action>
  <verify>
    <automated>Grep -o sobre docs/validacion/Service_Blueprint_Diagrama.html: "enlace a Truora" presente; "data-cross-row" = 30 (estructura intacta).</automated>
  </verify>
  <done>Caja 5 corregida; sin regresiones estructurales.</done>
</task>

</tasks>

<verification>
- Los 3 archivos indican correctamente que la sub-rama Colombia-persona natural de la opción 5 apunta a Truora, no a Sumsub.
- El Copy de cara al usuario sigue sin nombrar ningún validador en ningún caso.
- `data-cross-row` en el HTML sigue en 30.
</verification>

<output>
Create `.planning/quick/260720-spj-aplicar-la-misma-evaluacion-de-coherenci/260720-spj-SUMMARY.md` when done
</output>

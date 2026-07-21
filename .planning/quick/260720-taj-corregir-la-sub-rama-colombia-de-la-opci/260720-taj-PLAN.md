---
phase: quick-260720-taj
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/validacion/Soporte-Validacion-Identidad.md
  - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
  - docs/validacion/Service_Blueprint_Diagrama.html
autonomous: true
requirements: [QUICK-260720-taj]
must_haves:
  truths:
    - "El Copy de la sub-rama Colombia de la opción 7 cubre ambos casos: usuario que ya envió sus datos (espera) y usuario que aún no ha empezado (enlace real para comenzar)"
    - "Ninguna respuesta del árbol de soporte asume que el usuario ya está en revisión sin dar una vía para quien no ha empezado"
---

<objective>
El usuario señaló que el Copy de la sub-rama Colombia de la opción 7 asumía que el usuario ya había enviado sus datos y estaba "en revisión" ("espera a que tu revisión avance"), sin contemplar que quien pregunta puede no haber empezado su KYB todavía. Se confirmó con el usuario que el mecanismo de KYB de Colombia vía Sumsub **sí existe** (el blueprint detalla sus requisitos exactos: prueba de vida del representante legal + cédula + razón social + NIT + RUT + cámara de comercio) — "en evaluación" se refiere al momento/alcance de su lanzamiento amplio, no a que no exista. Por lo tanto la sub-rama Colombia de la opción 7 pasa de "sin enlace" a **con enlace real**, igual que las otras 2 sub-ramas de esa opción.

Nuevo Copy: *"Para empresas en Colombia este proceso todavía se está afinando, así que cada caso se revisa uno por uno. Si ya nos compartiste los datos de tu empresa, no necesitas hacer nada más — solo espera a que tu revisión avance. Si aún no has empezado, toca aquí para comenzar."*

Se actualizaron también los párrafos introductorios de los 3 archivos: ya no dicen que "los bloques A y B" de la opción 7 tienen enlace (ahora las 3 sub-ramas lo tienen), y se agregó una regla explícita: ninguna respuesta del árbol asume que el usuario ya está en revisión — todas cubren el caso de quien aún no ha empezado.
</objective>

<execution_context>
@D:/validacion-identidad/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<tasks>

<task type="auto">
  <name>Task 1: Corregir la sub-rama Colombia de la opción 7 y los párrafos introductorios en los 3 archivos</name>
  <files>docs/validacion/Soporte-Validacion-Identidad.md, docs/validacion/Service_Blueprint_Diagrama Fase 0.md, docs/validacion/Service_Blueprint_Diagrama.html</files>
  <action>Reemplazar el Copy y la Nota interna de la sub-rama Colombia (opción 7) en los 3 archivos; actualizar los párrafos introductorios que listaban "los bloques A y B" de la opción 7 como únicos con enlace, y agregar la regla de no asumir "ya en revisión". Ya aplicada por el orquestador.</action>
  <verify>
    <automated>Grep sobre los 3 archivos: "sin enlace formal todavía" y "sin enlace todavía" NO deben aparecer; "Si aún no has empezado, toca aquí" debe aparecer en los 3; data-cross-row del HTML sigue en 30.</automated>
  </verify>
  <done>Sub-rama Colombia de la opción 7 con enlace real cubriendo ambos casos; intros actualizadas; sin regresiones estructurales.</done>
</task>

</tasks>

<output>
Create `.planning/quick/260720-taj-corregir-la-sub-rama-colombia-de-la-opci/260720-taj-SUMMARY.md` when done
</output>

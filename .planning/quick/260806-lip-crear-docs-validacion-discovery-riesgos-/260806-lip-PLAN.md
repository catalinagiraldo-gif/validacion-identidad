---
phase: quick-260806-lip
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/validacion/Discovery-Riesgos-Transicion-Fase5.md
autonomous: true
requirements: [QUICK-260806-lip]

must_haves:
  truths:
    - "Existe docs/validacion/Discovery-Riesgos-Transicion-Fase5.md como documento persistente y citable junto a Historia.md y Consideraciones.md"
    - "El documento contiene las 7 secciones del análisis aprobado (riesgos, UX, impacto en otros proyectos, impacto en código de este repo, mapeo /new/, datos con fuente, preguntas abiertas)"
    - "El documento no tiene front-matter YAML, igual que el resto de docs/validacion/"
    - "Los enlaces internos a otros documentos de docs/validacion/ resuelven a archivos que existen en disco"
    - "Ningún hallazgo, cifra, cita de fuente o pregunta abierta del plan aprobado se pierde ni se reinterpreta"
  artifacts:
    - path: "docs/validacion/Discovery-Riesgos-Transicion-Fase5.md"
      provides: "Análisis de riesgos, impacto y datos para la transición a Fase 5"
      min_lines: 150
      contains: "## 6. Datos a considerar, con fuente"
  key_links:
    - from: "docs/validacion/Discovery-Riesgos-Transicion-Fase5.md"
      to: "docs/validacion/Service_Blueprint_Diagrama_Fase_5.md"
      via: "enlace relativo en la sección de contexto"
      pattern: "\\./Service_Blueprint_Diagrama_Fase_5\\.md"
---

<objective>
Crear `docs/validacion/Discovery-Riesgos-Transicion-Fase5.md` transcribiendo fielmente el análisis ya redactado y aprobado por el usuario en `C:\Users\USER\.claude\plans\los-riesgos-la-experiencia-cryptic-mccarthy.md`, adaptado al formato narrativo de la carpeta `docs/validacion/`.

Purpose: el análisis de riesgos, impacto en experiencia, impacto cruzado en otros proyectos (este repo + Darwin/dropi-agente-pm) y datos-con-fuente para la transición a Fase 5 hoy solo vive en un plan de chat. Persistirlo en `docs/validacion/` lo convierte en fuente citable junto a `Historia.md` y `Consideraciones.md`.
Output: un único archivo Markdown nuevo. Cero cambios de código.
</objective>

<execution_context>
@D:/validacion-identidad/.claude/get-shit-done/workflows/execute-plan.md
@D:/validacion-identidad/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md

Fuente a transcribir (contenido completo, ya aprobado — NO reinterpretar):
@C:/Users/USER/.claude/plans/los-riesgos-la-experiencia-cryptic-mccarthy.md

Referencias de estilo narrativo de la carpeta destino:
@docs/validacion/Historia.md
@docs/validacion/Consideraciones.md

Nota sobre CLAUDE.md: las reglas de "Wireframe Generation Protocol", DS Registry, navigation-map y responsive NO aplican a este plan. Esta tarea produce un documento `.md`, no una vista Angular. No se toca `navigation-map.json`, ni `ds-registry/`, ni `src/`.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Escribir Discovery-Riesgos-Transicion-Fase5.md</name>
  <files>docs/validacion/Discovery-Riesgos-Transicion-Fase5.md</files>
  <action>
Crear el archivo con la herramienta Write (nunca heredoc/cat). Transcribir el contenido de `C:\Users\USER\.claude\plans\los-riesgos-la-experiencia-cryptic-mccarthy.md` con estas reglas exactas.

QUÉ SE COPIA VERBATIM (texto, tablas Markdown, bullets, negritas, cifras, nombres de archivo citados como fuente, IDs de reglas RN-XX, nombres de personas y células):
- El título H1: `# Discovery: riesgos, experiencia e impacto cruzado — transición a Fase 5 (validación de identidad tech-native)`
- El bloque de contexto completo (los 4 numerales y el párrafo de cierre sobre las 3 exploraciones en paralelo).
- Sección 1 completa, con sus 4 subsecciones (`### 1.1 Cumplimiento externo / legal` con su tabla de 6 filas, `### 1.2 Técnicos`, `### 1.3 Negocio / financieros`, `### 1.4 Gobernanza / ejecución`).
- Sección 2 completa (4 bullets de impacto UX más allá del happy path).
- Sección 3 completa, con `### 3.1 Dentro de Darwin (dropi-agente-pm)` (tabla de 6 proyectos: BAC-002, Seguridad Retiros dropiPay, Discovery SAC & Help Center, Perfil Marca Independiente, BAU Competitivo Marcas, Oportunidades por País México) y `### 3.2 Dentro de este repo`.
- Sección 4 completa (IdentityGateComponent, los dos servicios V1/V2 sin sincronizar, rutas `/old/*` sin gate, dropicard old, orden-manual).
- Sección 5 completa, con el párrafo del stack Fase 0 del layout, la mención de `prototype-demo-panel.component.ts`, las 4 tablas de mapeo (Financiero, Cuenta/Configuración, Pedidos/Home/Dashboard), el bloque de Header/Sidebar, el de Resto de secciones y la lista numerada "Qué tocar, en orden de menor a mayor esfuerzo" (5 puntos).
- Sección 6 completa (tabla de 8 filas de datos con fuente, incluidas todas las cifras: 12.402 procesos Truora, 29.328 sin KYC, 3.369 en desfase, 78 fraude post-KYC, 20 posible suplantación, ~115.000 usuarios colombianos).
- Sección 7 completa (las 7 preguntas abiertas numeradas).
- Los separadores `---` entre secciones tal como están en la fuente.

ÚNICAS 4 ADAPTACIONES PERMITIDAS (no son contenido nuevo, son formato):
1. Renombrar el encabezado `## Context` a `## Contexto y propósito`, para alinear con el estilo en español de la carpeta (`Historia.md` usa "Contexto"). El cuerpo de la sección no cambia.
2. Corregir el enlace roto de la fuente: `[`Service_Blueprint_Diagrama_Fase_5.md`](../../../../d/validacion-identidad/docs/validacion/Service_Blueprint_Diagrama_Fase_5.md)` pasa a `[`Service_Blueprint_Diagrama_Fase_5.md`](./Service_Blueprint_Diagrama_Fase_5.md)`, porque el documento destino vive en la misma carpeta.
3. Eliminar la sección meta `## Deliverable propuesto (para tu aprobación)` y su párrafo (describe el acto de escribir este mismo archivo y el flujo GSD; es contexto de chat, no análisis).
4. Conservar la frase de verificación de esa sección como sección final `## Verificación`, con este texto: "Contrastar este documento con Paula Macias (PO de BAC-001/BAC-002) y con TI para confirmar que los puntos abiertos (§7) reflejan el estado real y no supuestos desactualizados. No requiere pruebas automatizadas por ser un documento."

PROHIBIDO:
- Front-matter YAML al inicio (ningún archivo de `docs/validacion/` lo tiene).
- Agregar hallazgos, recomendaciones, conclusiones, resúmenes ejecutivos o secciones que no estén en la fuente.
- Reescribir, resumir o "mejorar" los hallazgos; suavizar riesgos; cambiar cifras o redondearlas.
- Traducir al inglés, o traducir los nombres de archivo/componente citados.
- Tocar cualquier archivo distinto de `docs/validacion/Discovery-Riesgos-Transicion-Fase5.md`.
  </action>
  <verify>
    <automated>node -e "const fs=require('fs');const p='docs/validacion/Discovery-Riesgos-Transicion-Fase5.md';const t=fs.readFileSync(p,'utf8');if(t.startsWith('---'))throw new Error('tiene front-matter');if(!/^# Discovery: riesgos, experiencia e impacto cruzado/m.test(t))throw new Error('falta H1');const req=['## Contexto y propósito','## 1. Riesgos no cubiertos','## 2. Impacto en la experiencia','## 3. Impacto en otros proyectos','## 4. Impacto en el código','## 5. Mapeo completo','## 6. Datos a considerar, con fuente','## 7. Preguntas abiertas','## Verificación'];for(const h of req){if(!t.includes(h))throw new Error('falta seccion: '+h);}if(t.includes('Deliverable propuesto'))throw new Error('quedo la seccion meta Deliverable');const lines=t.split(/\r?\n/).length;if(lines<150)throw new Error('demasiado corto: '+lines);console.log('OK',lines,'lineas');"</automated>
  </verify>
  <done>El archivo existe, sin front-matter, con H1 correcto, las 9 secciones `##` esperadas, sin la sección meta "Deliverable propuesto" y con al menos 150 líneas.</done>
</task>

<task type="auto">
  <name>Task 2: Verificar integridad de citas, cifras y enlaces</name>
  <files>docs/validacion/Discovery-Riesgos-Transicion-Fase5.md</files>
  <action>
Auditar el archivo recién escrito contra la fuente, sin reescribir contenido salvo para corregir omisiones detectadas.

1. Enlace relativo: confirmar que apunta a `./Service_Blueprint_Diagrama_Fase_5.md` y que ese archivo existe en `docs/validacion/`. Confirmar que NO quedó ninguna ruta tipo `../../../../d/validacion-identidad/`.
2. Fuentes citadas: verificar que los nombres de archivo mencionados como fuente existen en `docs/validacion/` — `Consem2.md`, `Historia.md`, `Consideraciones.md`, `Reglasvalidacion.md`, `StartUser.md`, `Discovery inicial.md`, `UX-Writing-Validacion-TechNative.md`, `Service_Blueprint_Diagrama Fase 0.md`, `Copia de Información Datos de Facturación LATAM.xlsx`. Si algún nombre citado NO existe en disco, NO lo borres ni lo cambies: déjalo tal cual y anótalo en el SUMMARY como discrepancia a confirmar con el usuario (la fuente fue aprobada; el planner no la corrige).
3. Cifras clave presentes y sin alterar: `~40%`, `≤8%`, `49%`, `78`, `12.402`, `29.328`, `3.369`, `~115.000`, `200K–530K`, `3.664`, `32,8%`, `1.202`, `<400`, `7-8 meses`.
4. Estructura de tablas: las 6 tablas Markdown de las secciones 1.1, 3.1, 5 (x3) y 6 tienen fila de encabezado, separador y todas sus filas — ninguna truncada.
5. Si falta algo, corregirlo copiando de la fuente. No agregar nada nuevo.
  </action>
  <verify>
    <automated>node -e "const fs=require('fs');const t=fs.readFileSync('docs/validacion/Discovery-Riesgos-Transicion-Fase5.md','utf8');if(!t.includes('](./Service_Blueprint_Diagrama_Fase_5.md)'))throw new Error('enlace relativo incorrecto');if(!fs.existsSync('docs/validacion/Service_Blueprint_Diagrama_Fase_5.md'))throw new Error('destino del enlace no existe');if(/\.\.\/\.\.\/\.\.\//.test(t))throw new Error('quedo ruta relativa rota');const nums=['40%','8%','49%','12.402','29.328','3.369','115.000','200K–530K','3.664','32,8%','1.202','7-8 meses'];for(const n of nums){if(!t.includes(n))throw new Error('falta cifra: '+n);}const tables=(t.match(/^\|---/gm)||[]).length;if(tables<6)throw new Error('faltan tablas, encontradas: '+tables);console.log('OK enlaces, cifras y',tables,'tablas');"</automated>
  </verify>
  <done>Enlace relativo resuelve a un archivo existente, no quedan rutas rotas, las 12 cifras clave están presentes y hay al menos 6 tablas Markdown bien formadas.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| ninguno | Tarea de documentación: no hay entrada de usuario, ni endpoint, ni dependencia nueva, ni ejecución de código en runtime |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-quick-260806-01 | Information Disclosure | `docs/validacion/Discovery-Riesgos-Transicion-Fase5.md` | accept | El documento cita nombres internos (Paula Macias, Andrés Herrera), proveedores (Truora/Sumsub) y cifras de negocio, pero el repo es privado y esa misma información ya vive en `Historia.md`, `Consideraciones.md` y `Discovery inicial.md`. No introduce exposición nueva. |
| T-quick-260806-02 | Tampering | integridad del análisis | mitigate | Task 2 audita cifras, tablas y enlaces contra la fuente aprobada para evitar alteración accidental de hallazgos durante la transcripción. |
| T-quick-260806-SC | Tampering | instalaciones npm/pip/cargo | accept | El plan no instala ningún paquete. No aplica el gate de legitimidad. |
</threat_model>

<verification>
1. `docs/validacion/Discovery-Riesgos-Transicion-Fase5.md` existe y abre correctamente como Markdown.
2. No hay front-matter YAML — consistente con el resto de `docs/validacion/`.
3. Las 9 secciones `##` esperadas están presentes y en orden.
4. `git status` muestra exactamente un archivo nuevo y ningún archivo modificado.
</verification>

<success_criteria>
- Documento creado en `docs/validacion/Discovery-Riesgos-Transicion-Fase5.md`, ≥150 líneas, sin front-matter.
- Secciones 1–7 del análisis aprobado transcritas íntegras, incluidas las 6 tablas y las 7 preguntas abiertas.
- Solo las 4 adaptaciones de formato autorizadas aplicadas (encabezado Contexto y propósito, enlace relativo corregido, sección meta eliminada, sección Verificación final).
- Ninguna cifra, fuente citada ni hallazgo alterado respecto a la fuente aprobada.
- Cero archivos de código, `navigation-map.json` o `ds-registry/` tocados.
</success_criteria>

<output>
Create `.planning/quick/260806-lip-crear-docs-validacion-discovery-riesgos-/260806-lip-SUMMARY.md` when done.
</output>

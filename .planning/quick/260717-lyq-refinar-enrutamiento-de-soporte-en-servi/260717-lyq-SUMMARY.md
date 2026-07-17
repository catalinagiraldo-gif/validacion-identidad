---
phase: quick-260717-lyq
plan: 01
subsystem: docs/validacion (Service Blueprint + árbol de soporte)
tags: [documentation, service-blueprint, soporte, deep-link, kyc]
requires:
  - docs/validacion/Soporte-Validacion-Identidad.md (existente)
  - docs/validacion/Service_Blueprint_Diagrama Fase 0.md (existente)
  - docs/validacion/Service_Blueprint_Diagrama.html (existente)
provides:
  - Enrutamiento de soporte por deep-link textual al chip raíz "Validación de identidad" + opción específica
  - Árbol de 8 opciones reformateado al patrón Argentina con escalamiento a asesor humano explícito
  - Coordinación con responsables nombrados (Juan Camilo Rojas + Laura Sánchez / SAC)
affects:
  - docs/validacion/Soporte-Validacion-Identidad.md
  - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
  - docs/validacion/Service_Blueprint_Diagrama.html
key-files:
  created: []
  modified:
    - docs/validacion/Soporte-Validacion-Identidad.md
    - docs/validacion/Service_Blueprint_Diagrama Fase 0.md
    - docs/validacion/Service_Blueprint_Diagrama.html
decisions:
  - No nombrar el bot/IA; usar "el widget de soporte" / "el agente" / "asesor humano"
  - Coordinación Colombia = Juan Camilo Rojas coordina con Laura Sánchez (SAC), patrón Argentina
  - Deep-link por texto (copy nombra el chip raíz), no por integración técnica
metrics:
  duration: ~1 sesión (sin commits — Bash no disponible)
  completed: 2026-07-17
  tasks: 3
  files: 3
---

# Quick 260717-lyq: Refinar enrutamiento de soporte en Service Blueprint Summary

Los 3 CTAs de soporte del Service Blueprint de Validación de Identidad ahora enrutan por texto al chip raíz existente "Validación de identidad" y a su opción específica del árbol, con el sub-árbol de 8 opciones reformateado al patrón Argentina (escalamiento a asesor humano explícito en las 8 filas) y responsables nombrados en Coordinación.

## What Was Done

### Task 1 — Soporte-Validacion-Identidad.md
- **Encabezado (bloque `>`)** reescrito: el widget es un agente de opciones tipo chip (no chat libre) que responde automáticamente y escala a asesor humano si el usuario no queda resuelto — sin nombrar el bot. Se aclara que YA existe un chip raíz "Validación de identidad" y que el documento define el sub-árbol que vive DENTRO de ese chip. Se reemplazó "sin deep-link técnico a una opción específica" por la lógica de deep-link por texto (el copy nombra el chip raíz). Referencias existentes (StartUser.md línea 75, precedente Argentina, Intercom) conservadas.
- **Cabecera de tabla** renombrada al formato Argentina: `# | Opción visible (chip) | Ejemplos de preguntas que resuelve | Acción / Respuesta`.
- **Las 8 filas** conservan su contenido de negocio; la columna "Acción / Respuesta" ahora hace explícita y consistente la lógica de escalamiento (respuesta automática primero → chip de seguimiento "Necesito la ayuda de un asesor" → asesor humano). Filas 1/2/3 conservan los nombres exactos que son destino de los 3 CTAs.
- **Nota de diferenciación por país** añadida tras la tabla (Colombia solo validación de identidad; Truora personas naturales; KYB sin confirmar / bloque C "en evaluación"; resto de países manual vía Sumsub; sin video-tutorial).
- **Sección Coordinación** actualizada: Juan Camilo Rojas coordina con Laura Sánchez (SAC) para montar el sub-árbol dentro del chip raíz ya existente; se mantiene la distinción entre lo que YA existe (widget + chip raíz) y lo que FALTA configurar (sub-árbol de 8 opciones).

### Task 2 — Service_Blueprint_Diagrama Fase 0.md
- **Bloqueo (Etapa 1, Modal Pantalla Completa):** el copy ahora instruye tocar el chip raíz "Validación de identidad" → opción "Mi cuenta está bloqueada" (deep-link por texto). Referencia al árbol conservada.
- **Pendiente / En revisión de Financiero:** copy orienta al chip raíz "Validación de identidad" → opción "Mi verificación sigue en revisión". Botón secundario "Contactar a soporte" junto a "Entendido" conservado.
- **Rechazado:** copy orienta al chip raíz "Validación de identidad" → opción "Me rechazaron la verificación", conservando "— luego expulsión (ver Etapa 1)".
- **Notas finales (viñeta de enrutamiento):** actualizada para reflejar el deep-link por texto (no por integración) y el mapeo CTA → opción por cada caso.
- Bloque "Incompleta en Sumsub" (botón "Continuar verificación") NO tocado — verificado intacto.

### Task 3 — Service_Blueprint_Diagrama.html
- Los 3 CTAs del HTML (archivo de una sola línea, línea 17) reflejan de forma compacta el chip raíz "Validación de identidad" y su opción específica (Bloqueo → "Mi cuenta está bloqueada", Pendiente → "Mi verificación sigue en revisión", Rechazado → "Me rechazaron la verificación").
- Solo se editó texto visible. Ids, clases, atributos `data-cross-row-*` y estructura de grid/flechas intactos (conteo `data-cross-row` = 30, sin cambios). Bloque "Incompleta en Sumsub" ("Continuar verificación") sin cambios.

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- **Task 1:** cabecera `Opción visible (chip)` presente (línea 9); `Juan Camilo Rojas` y `Laura Sánchez` presentes (línea 26); `Validación de identidad` aparece 4 veces.
- **Task 2:** las 3 opciones destino presentes (líneas 141, 175, 179 + Notas finales línea 266); `Continuar verificación` intacto.
- **Task 3:** las 3 opciones presentes en línea 17; `data-cross-row` = 30 (sin cambios respecto al original); `Continuar verificación` intacto.
- **Consistencia cross-file:** los 3 archivos nombran el mismo chip raíz "Validación de identidad" y coinciden en la opción por cada CTA.
- **Sin nombre de bot:** ningún archivo introduce el nombre propio de un bot/IA; se usó "el widget", "el agente", "asesor humano".

## Commits

**No se realizaron commits** — el entorno Bash/git no está disponible en esta sesión (git-bash fork errors). Los 3 archivos fueron editados vía Edit tool y quedan listos para que el orquestador (sesión padre) los agregue y committee vía PowerShell.

Archivos a commitear:
- `docs/validacion/Soporte-Validacion-Identidad.md`
- `docs/validacion/Service_Blueprint_Diagrama Fase 0.md`
- `docs/validacion/Service_Blueprint_Diagrama.html`
- `.planning/quick/260717-lyq-refinar-enrutamiento-de-soporte-en-servi/260717-lyq-SUMMARY.md`

## Self-Check: PASSED

- FOUND: docs/validacion/Soporte-Validacion-Identidad.md (modificado, verificado por grep)
- FOUND: docs/validacion/Service_Blueprint_Diagrama Fase 0.md (modificado, verificado por grep)
- FOUND: docs/validacion/Service_Blueprint_Diagrama.html (modificado, verificado por grep)
- Commits: N/A (Bash no disponible — orquestador committea)

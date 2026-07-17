---
phase: quick-260717-jg9
plan: 01
subsystem: docs/validacion
tags: [service-blueprint, soporte, documentacion]
requires: []
provides:
  - "docs/validacion/Soporte-Validacion-Identidad.md (árbol de decisión de 8 opciones para el widget de soporte)"
affects:
  - "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"
  - "docs/validacion/Service_Blueprint_Diagrama.html"
tech-stack:
  added: []
  patterns: ["documentación Markdown/HTML estática, sin código ejecutable"]
key-files:
  created:
    - docs/validacion/Soporte-Validacion-Identidad.md
  modified:
    - "docs/validacion/Service_Blueprint_Diagrama Fase 0.md"
    - docs/validacion/Service_Blueprint_Diagrama.html
decisions:
  - "Los 3 puntos de contacto (Bloqueo, Rechazado, Pendiente-en-revisión) abren el mismo widget de soporte flotante existente en su menú raíz, sin deep-link técnico — orientación vía copy del modal, referenciando Soporte-Validacion-Identidad.md."
  - "No se agregó fila nueva a la tabla de conectores verticales/flechas horizontales del HTML: el nuevo botón 'Contactar a soporte' en Pendiente-en-revisión no introduce una acción de backstage distinta a la ya cubierta por Back stage → Acciones punto 2 ('SLA para Soporte') de Etapa Continua."
metrics:
  duration: "~15 min"
  completed: "2026-07-17"
---

# Quick Task 260717-jg9: Enrutamiento de soporte en el Service Blueprint Summary

Se documentó el destino de los 3 botones de soporte del blueprint de validación de identidad (widget flotante existente, menú raíz, sin deep-link) y se creó el árbol de decisión de 8 opciones que ese widget debe resolver.

## What Was Built

1. **`docs/validacion/Soporte-Validacion-Identidad.md` (nuevo):** documento con encabezado explicando su propósito (define el árbol de opciones del widget de soporte existente para el flujo de validación de identidad, no lo reemplaza), tabla de 8 filas en formato `# | Opción visible | Preguntas que resuelve | Acción/Respuesta`, y sección `## Coordinación` que distingue lo que ya existe (widget flotante, AS-IS en `StartUser.md` línea 75) de lo que falta configurar (este árbol dentro de Intercom), sin nombrar ningún responsable.

2. **`docs/validacion/Service_Blueprint_Diagrama Fase 0.md` (editado):**
   - Etapa 1 (Bloqueo), Modal Pantalla Completa: se agregó aclaración de que el botón "Contactar a soporte" abre el widget en su menú raíz, sin deep-link, orientando al usuario vía copy — referencia a `Soporte-Validacion-Identidad.md`.
   - Etapa Continua → Pendiente → "En revisión de Financiero": se agregó `Botón secundario: **"Contactar a soporte"**` junto a "Entendido" (antes esta pantalla no ofrecía ninguna vía de contacto), con la misma lógica de destino.
   - Etapa Continua → Rechazado: se agregó la misma aclaración de destino/orientación (apelación/rechazo), conservando "— luego expulsión (ver Etapa 1)."
   - "Incompleta en Sumsub": NO tocado — sigue solo con "Continuar verificación".
   - "## Notas finales": se agregó una viñeta nueva documentando el patrón de enrutamiento de soporte y enlazando `Soporte-Validacion-Identidad.md`.

3. **`docs/validacion/Service_Blueprint_Diagrama.html` (editado):** las mismas 3 cajas ancla (`id="modal-pantalla"` Bloqueo, bloque RECHAZADO, bloque PENDIENTE "En revisión de Financiero") reflejan el mismo destino/orientación de forma más concisa (apto para caja compacta de diagrama), conservando toda la estructura de grid/ids/`data-cross-row-*`/conectores intacta. El bloque "Incompleta en Sumsub" (mismo div, inmediatamente después) queda intacto, mostrando solo "Continuar verificación".
   - Evaluación del punto 5 de la Tarea 3: no se agregó fila nueva a la tabla de conectores verticales ni a la de flechas horizontales de secuencia — el nuevo botón "Contactar a soporte" en Pendiente-en-revisión no introduce una acción de backstage distinta a la ya cubierta por Back stage → Acciones punto 2 de Etapa Continua ("SLA para Soporte"). El bloque PENDIENTE sigue sin `id` ni `data-cross-row-target` propio, como antes.

## Verification

- `Soporte-Validacion-Identidad.md`: 8 filas `| N |` (N=1..8), sección `## Coordinación` presente, sin menciones de bot/chatbot/inteligencia artificial (confirmado con Grep).
- `Service_Blueprint_Diagrama Fase 0.md`: 4 referencias a "Soporte-Validacion-Identidad" (≥3 requerido), "Botón secundario" presente, bloque "Incompleta en Sumsub" verificado sin "Contactar a soporte" en las líneas siguientes, sin menciones de bot/chatbot/IA.
- `Service_Blueprint_Diagrama.html`: 3 ocurrencias de "Soporte-Validacion-Identidad" (confirmado con búsqueda `-o` línea por línea, ya que el archivo es una sola línea física), "Botón secundario" presente, `id="modal-pantalla"` intacto, "Continuar verificación" intacto, sin menciones de bot/chatbot/IA. Se leyó de vuelta el fragmento completo del bloque PENDIENTE → Incompleta-en-Sumsub para confirmar que el botón "Continuar verificación" del segundo bloque no fue alterado.
- Los 3 archivos, leídos por separado, describen el mismo destino (widget de soporte existente, menú raíz, sin deep-link) y la misma lógica de orientación (copy del modal + referencia a `Soporte-Validacion-Identidad.md`).
- El árbol nuevo no contradice el SLA 48-72h, la distinción Colombia=Truora/resto=Sumsub manual, ni el wording ya fijado ("Contactar a soporte" / "Entendido" / "Continuar verificación").
- Ningún archivo nombra un bot/agente específico en el texto nuevo — solo "widget de soporte" / "soporte de Dropi" / "un agente" (agente humano, en la opción 8 y en casos de escalamiento, consistente con "Soporte (Daniela/Juan)" ya mencionado en el blueprint original, que tampoco es un bot).

## Deviations from Plan

None — plan executed exactly as written, incluyendo la evaluación condicional del punto 5 de la Tarea 3 (no se requirió fila de conector nueva).

## Environment Note — Commits NOT Made

El entorno de ejecución tenía la herramienta Bash rota (errores `fork: retry: Resource temporarily unavailable` de git-bash en cada invocación, confirmado en dos intentos independientes, incluyendo un intento final de `git status --short`). Siguiendo la instrucción explícita del prompt de ejecución, **no se realizó ningún commit** — todos los cambios de archivo quedan sin confirmar (uncommitted) en el working tree. El agente orquestador (sesión padre) debe hacer `git add` + `git commit` vía PowerShell para estos 3 archivos:

- `docs/validacion/Soporte-Validacion-Identidad.md` (nuevo)
- `docs/validacion/Service_Blueprint_Diagrama Fase 0.md` (modificado)
- `docs/validacion/Service_Blueprint_Diagrama.html` (modificado)

No se actualizó `ROADMAP.md` ni `STATE.md` (fuera de alcance de este quick task, según constraints).

## Self-Check: PASSED

- FOUND: docs/validacion/Soporte-Validacion-Identidad.md
- FOUND: docs/validacion/Service_Blueprint_Diagrama Fase 0.md (edits verified via Grep/Read)
- FOUND: docs/validacion/Service_Blueprint_Diagrama.html (edits verified via Grep/Read)
- No commit hashes to verify — no commits were made (see Environment Note above).

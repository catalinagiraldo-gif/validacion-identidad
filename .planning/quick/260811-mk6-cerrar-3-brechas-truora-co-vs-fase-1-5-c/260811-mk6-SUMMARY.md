---
phase: quick-260811-mk6
plan: 01
status: complete
requirements: [GAP-2.1-GPS-VPN, GAP-2.6-INTENTOS-COOLDOWN, GAP-2.3-ABANDONO]
commits: [dafec92, 1ec6576]
completed: 2026-08-11
---

# Quick 260811-mk6: Cerrar 3 brechas Truora CO vs Fase 1-5 — Summary

Las 3 brechas (checklist GPS/VPN, cooldown de intentos con temporizador visible, aviso de abandono por inactividad) quedan implementadas en blueprint **y** prototipo.

## Nota de ejecución — recuperación en dos capas

El executor (gsd-executor, worktree aislado `agent-acdd3798ff0f68fa0`) completó el trabajo de código y documentación pero no pudo commitear ni correr `yarn build` porque el shell del entorno volvió a fallar (`dofork ... Resource temporarily unavailable`) — 4ª sesión consecutiva con este problema.

Además, el executor detectó y reportó con precisión un segundo problema, más serio: **el worktree se creó desde una base obsoleta** (commit `6206368`, previo a los 3 quick-tasks anteriores de esta misma sesión). Los documentos del blueprint y `identity-fase15-state-switcher/*` (creado en el quick-task anterior, `260811-d4i`) estaban desactualizados o ausentes del worktree. El executor, correctamente, **no intentó copiar sus archivos completos sobre el repo principal** — eso habría revertido trabajo más nuevo. En su lugar dejó ediciones ancladas a contenido (no a número de línea) y documentó el problema con precisión quirúrgica en su SUMMARY.

El orquestador (sesión principal, con PowerShell) verificó la causa exacta: los 4 archivos de código (`identity-sumsub-modal.component.{ts,html,scss}`, `identity-modal.service.ts`) resultaron genuinamente idénticos entre la base del worktree y `main` actual (confirmado con `git diff 6206368 HEAD -- <archivo>`, no solo comparación de texto) — ningún quick-task de esta sesión los había tocado. Eso permitió generar un parche (`git diff` en el worktree → `git apply` sobre `main`) que aplicó limpio. Los 3 documentos del blueprint sí habían cambiado; para esos se releyó el contenido actual de `main` y se reaplicaron las mismas ediciones semánticas del executor con `Edit` ancla-por-ancla (verificando cada ancla contra el archivo real antes de escribir). El botón de demo del switcher (Task 3, Paso 5) no existía en el worktree en absoluto — se añadió directamente sobre `main` siguiendo el parche de 2 ediciones que el executor dejó documentado.

`yarn build` se corrió después de aplicar todo: **compiló sin errores nuevos** — el chunk lazy `layout-new-component` creció de 235.56 kB a 241.42 kB, consistente con las adiciones. Solo los 3 warnings preexistentes no relacionados.

## Cambios realizados

### Documentación (commit `dafec92`)
- `Service_Blueprint_Diagrama_Fase_5.md` / `.html`: nuevo bullet en C5 documentando el aviso automático "¿Sigues ahí?" tras 10 min de inactividad (Truora `2.3`); catálogo de causas puntuales (C6) pasa de `🚧 a confirmar con TI` a `✅ construido en el prototipo`, con el cooldown de "10 minutos" ahora explícito en ambos archivos (antes solo en el `.md`).
- `Especificaciones-UX-Mejoras-Fase5.md`: corregida la fila `2.3` — ya no afirma que "Fase 5 ya lo mejora"; distingue el resume manual (mejora real preexistente) del disparo automático (agregado en esta iteración).

### Prototipo (commit `1ec6576`)
- `identity-sumsub-modal.component.ts/.html/.scss`:
  - Checklist de screen1 pasa de 5 a 8 ítems: "Activa el GPS de tu celular" / "Apaga cualquier VPN activa" / "Vuelve a Dropi al terminar" primero, luego los 5 originales. `CHECKLIST_LABELS` promovido a constante de módulo para evitar el bug de orden de inicialización de campos (D-05 del plan).
  - Contador de 3 intentos para rechazo de documento (`DOCUMENTO_MAX_INTENTOS`), decrementado dentro del `effect` existente con guarda `documentoIntentoContabilizado` (evita doble conteo, D-04); al llegar a 0 activa un cooldown de 10 minutos (`DOCUMENTO_COOLDOWN_SECONDS`) con temporizador mm:ss visible y el botón "Reintentar verificación" deshabilitado. Singular/plural corregido ("Te queda 1 intento" / "Te quedan N intentos").
  - Banner inline `¿Sigues ahí?` en screen1/screen2 tras 10 minutos sin interacción (`ultimaActividad`), con un solo botón "Reanudar validación" que no pierde el formulario ya diligenciado. Registro de actividad conectado a 19 puntos de interacción del template, incluyendo los 6 de la rama vía-facturación/KYB que el plan original no había listado (desviación documentada por el executor — sin esto, un usuario activo en esa rama habría recibido un falso aviso).
- `identity-modal.service.ts`: nuevo `avisoAbandono` + `mostrarAvisoAbandono()`/`ocultarAvisoAbandono()`, reseteado en `open()`/`close()` (no en el modal) para que el switcher pueda encadenar `open()` + `mostrarAvisoAbandono()` de forma determinista sin que el efecto de reset del modal se lo borre.
- `identity-fase15-state-switcher.component.ts/.html`: nuevo botón "Aviso de abandono (10 min)" en la sección "Abrir modal de verificación" — llama `previsualizarAvisoAbandono()`, que abre el modal si no está abierto y fuerza el aviso, sin esperar 10 minutos reales.

## Verificación ejecutada

- Gates de `grep` del plan (corridos por el executor antes del bloqueo): Tarea 1 y Tarea 2 → PASS completo. Tarea 3 → PASS en servicio/modal, bloqueado solo en el switcher (archivo ausente del worktree, resuelto por el orquestador).
- `git diff 6206368 HEAD -- <4 archivos>` (orquestador): confirmó identidad real antes de aplicar el parche — no fue solo una comparación de texto, sino la fuente de verdad de git.
- `git apply --check` seguido de `git apply`: el parche de los 4 archivos de código aplicó limpio sobre `main` sin conflictos.
- `yarn build`: **PASSED** — `Application bundle generation complete. [34.550 seconds]`, sin errores nuevos.

## Pendiente para el usuario

Recorrido manual en `yarn start`: forzar 3 rechazos seguidos y confirmar el cooldown con temporizador corriendo; usar el nuevo botón del switcher para ver el aviso de abandono sin esperar; confirmar el checklist de 8 ítems en screen1; verificar responsive del banner y del cooldown a 1024px y `$bp-sm`.

## Nota de infraestructura — para investigar aparte

Esta es la 2ª vez en la sesión (de 4 quick-tasks) que el worktree asignado a un executor se crea desde una base desactualizada respecto al `main` real del repo. Las primeras 3 veces la base estaba solo un commit atrás (sin impacto real); esta vez estaba 4 commits atrás y sí causó impacto real (archivos ausentes, contenido divergente). Vale la pena revisar por qué el mecanismo de creación de worktrees no está partiendo siempre del `HEAD` más reciente de `main`.

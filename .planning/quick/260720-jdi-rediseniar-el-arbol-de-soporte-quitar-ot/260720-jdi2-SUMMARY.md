---
status: complete
---

# Follow-up: Copy más cálido + sub-ramas por país (opciones 5 y 7) — Summary

Segunda pasada sobre el árbol de soporte, a pedido del usuario: (1) reescribir el copy de las 7 opciones con criterios de UX writing para que suene más cálido/empático (usando el skill `ux-writing`, patrón: reconocer la fricción sin sonar condescendiente → explicar brevemente → dar el siguiente paso o tranquilizar), y (2) evaluar si alguna rama tiene sub-ramas reales y agregarlas si aplica.

## Análisis de sub-ramas

Se revisaron las 7 opciones contra el contexto completo de Fase 0 (Reglasvalidacion.md, bloques A-E de DOC ENLACES en el blueprint). Conclusión: **solo 2 de las 7 tienen una bifurcación real**, porque el proceso mismo cambia según el país del usuario:

- **Opción 5** ("No sé qué proceso me aplica"): Colombia (Truora para personas naturales / KYB en evaluación para empresas) vs. resto de países (proceso manual vía Sumsub, bloques A/B/D/E).
- **Opción 7** ("Tengo una empresa / dudas de KYB"): Colombia (KYB "en evaluación", sin proceso formal aún) vs. resto de países (reglas de persona jurídica ya definidas, con pasos concretos).

Las otras 5 opciones (1, 2, 3, 4, 6) se dejaron como respuesta única — no se encontró una bifurcación real y ya documentada que las justifique; forzar sub-ramas ahí habría sido inventar contenido no grounded en los docs existentes.

## What Was Built

1. **`docs/validacion/Soporte-Validacion-Identidad.md` (reescrito completo):** las 7 celdas "Copy" reescritas con tono cálido; opciones 5 y 7 reestructuradas con "Copy inicial" + "Sub-rama Colombia" + "Sub-rama Resto de países" (cada una con su propio Copy y Nota interna); intro (párrafo 3) actualizado explicando que 5 de 7 son terminales y 2 tienen sub-rama por país; Coordinación y nota de Argentina actualizadas.

2. **`docs/validacion/Service_Blueprint_Diagrama Fase 0.md` (2 ediciones):**
   - Caja compacta del ítem 3 (grid principal): sin cambios de contenido de negocio, solo referencia a las sub-ramas en la intro.
   - Sección "## Detalle del árbol de soporte": las 7 entradas reescritas con copy cálido; opciones 5 y 7 con sub-ramas explícitas (Copy inicial + 2 sub-ramas con su propio Copy/Nota interna cada una).

3. **`docs/validacion/Service_Blueprint_Diagrama.html` (2 ediciones):**
   - Caja compacta "Árbol de opciones": intro actualizada mencionando que las opciones 5 y 7 tienen sub-rama por país.
   - Tarjeta "Detalle del árbol de soporte": las 7 cajas reescritas con copy cálido; las cajas 5 y 7 ahora incluyen un mini-fork interno (borde punteado + 🇨🇴 Colombia / 🌎 Resto de países, cada uno con su Copy y Nota interna) — sin alterar la estructura de árbol (fan-out/fan-in) del resto del diagrama; solo esas 2 columnas son más altas.

## Verification

- `data-cross-row` sigue en 30 ocurrencias — grid principal intacto.
- Ambas sub-ramas (Colombia / Resto de países) presentes en los 3 archivos, consistentes entre sí.
- El copy nuevo es más cálido (reconoce la fricción, tranquiliza, ofrece el siguiente paso) sin usar emojis en exceso ni sonar condescendiente, siguiendo el patrón del skill `ux-writing` para mensajes de error/bloqueo/espera.
- Las 5 opciones restantes (1, 2, 3, 4, 6) quedan como respuesta única — sin sub-ramas inventadas.

## Deviations from Plan

Continuación directa de la quick task 260720-jdi (mismo directorio) — ejecutada por el orquestador con Write/Edit directamente, sin spawnear un nuevo gsd-executor, dado el volumen y precisión de contenido ya preparado. Se documenta como un SUMMARY adicional dentro del mismo directorio de quick task para mantener el registro sin crear un nuevo quick_id innecesario para un follow-up inmediato del mismo tema.

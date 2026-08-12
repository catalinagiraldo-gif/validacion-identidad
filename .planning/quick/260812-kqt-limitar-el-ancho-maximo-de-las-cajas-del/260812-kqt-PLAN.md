---
quick_id: 260812-kqt
description: Limitar el ancho maximo de las cajas del blueprint Fase 5 a 600px
mode: quick
---

# Plan — Limitar el ancho de las cajas a 600px

## Problema

El usuario pidió, tras el ajuste de densidad anterior (260812-km0), que las cajas también fueran menos anchas — un máximo de ~600px. Causa: las columnas de ETAPA 2 y ETAPA 3 en `.blueprint { grid-template-columns: 40px 150px 236px 236px max-content max-content; }` usan `max-content`, así que crecen tanto como el contenido más ancho de todo el documento en esa columna, y cada `.box` (con `width: 100%` dentro de su `.sub-col` flex) hereda ese ancho.

## Fix — una línea, mismo archivo

`docs/validacion/Service_Blueprint_Diagrama_Fase_5.html`, regla `.box`: agregar `max-width: 600px` junto al `width: 100%` existente. La caja sigue llenando el 100% de su contenedor hasta ese tope, sin importar cuánto crezca la columna `max-content` por otro contenido. No se toca `grid-template-columns` (arriesgaría desalinear las columnas de todas las etapas) ni ninguna otra medida.

## Verificación

Abrir el archivo en el navegador y confirmar que ninguna caja supera ~600px de ancho, en cualquier fila del diagrama.

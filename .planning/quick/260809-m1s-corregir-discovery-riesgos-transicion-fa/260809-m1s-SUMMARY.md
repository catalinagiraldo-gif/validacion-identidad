---
status: complete
---

# Quick Task 260809-m1s: Corregir Discovery-Riesgos-Transicion-Fase5.md — Summary

## Qué se hizo

El usuario seleccionó la línea 5 de `docs/validacion/Discovery-Riesgos-Transicion-Fase5.md` y aclaró que el modelo "no-code (UserPilot + CRM + Google Sheets)" descrito ahí como el sistema actual **no es lo que Dropi tiene hoy**: era la propuesta de la Fase 0 de `Historia.md` (un diseño para validar sin integración técnica compleja) que nunca se implementó — en cuanto hubo apoyo de TI, el equipo saltó directo al enfoque tech-native.

Se leyó `Historia.md` completo para confirmar el AS-IS real: Truora como único mecanismo, solo KYC de personas naturales, solo Colombia; un hard gate simple ya existente hoy en el primer retiro/transferencia; 40% de validaciones manuales (3.000–4.000 casos/mes) gestionadas por Back Office vía WhatsApp e Intercom, sin SLA ni tickets formales; sin KYB.

Se aplicaron 4 ediciones puntuales a `docs/validacion/Discovery-Riesgos-Transicion-Fase5.md`:

1. **Contexto y propósito** — el párrafo de apertura se reemplazó por tres párrafos: (a) el AS-IS real (Truora-only), (b) la aclaración de que UserPilot/CRM/Sheets fue la propuesta de Fase 0 nunca implementada, con referencia cruzada al hallazgo de BAC-002 ("saltar la Fase Cero e ir directo a Fase 1"), y (c) la migración real que describe el resto del documento.
2. **§1.4 Gobernanza/ejecución** — nuevo bullet: Fase 0 se saltó sin piloto barato; los habilitadores HU-00 de `Historia.md` (PoC Sumsub, aval de seguridad, motor de ruteo) siguen sin cerrar.
3. **§6 Datos a considerar** — nueva "Nota de precisión" después de la tabla, aclarando que las filas de Google Sheets/Excel-UserPilot describen el mecanismo propuesto, no confirmado en producción.
4. **§7 Preguntas abiertas** — nueva pregunta 8 sobre si Fase 0 queda descartada o como contingencia.

Ninguna otra sección del documento se modificó. No se tocó `Historia.md` ni ningún otro archivo.

## Verificación

Diff inspeccionado línea por línea tras el commit (`git show`): las 4 ediciones aparecen exactamente donde se especificaron, sin cambios accidentales en el resto del documento.

## Commits

- `dc9e3cc` — docs(quick-260809-m1s): corregir AS-IS en Discovery-Riesgos-Transicion-Fase5.md (UserPilot fue propuesta de Fase 0, nunca implementada)

## Nota de entorno

El Bash del sistema (git-bash) sigue fallando al hacer fork en este entorno ("Resource temporarily unavailable"). Esta tarea se ejecutó con Edit + PowerShell directamente en el hilo principal en vez de delegar a gsd-planner/gsd-executor, dado que el alcance ya estaba completamente especificado (4 ediciones exactas, un solo archivo) y evitar la sobrecarga de dos rondas de subagentes en background era más eficiente.

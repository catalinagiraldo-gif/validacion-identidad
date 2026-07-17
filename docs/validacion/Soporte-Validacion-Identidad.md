# Soporte — Árbol de Decisión (Validación de Identidad, Fase 0)

> Este documento define qué debe mostrar/resolver el widget de soporte flotante ya existente en la plataforma cuando un usuario llega desde el flujo de validación de identidad descrito en `Service_Blueprint_Diagrama Fase 0.md` / `Service_Blueprint_Diagrama.html`. **No reemplaza el widget** — el widget de soporte ya existe hoy en Dropi (documentado como punto de dolor AS-IS en `StartUser.md`, línea 75: "El usuario utiliza el botón flotante de Soporte (SAC) para saltarse las reglas o pedir actualizaciones manuales, colapsando el equipo operativo"). Este documento solo define el árbol de opciones que ese widget debe ofrecer para esta validación, siguiendo el mismo formato usado en un proyecto no relacionado de facturación Argentina: un Product Designer define el árbol, que luego se coordina con el equipo de SAC/soporte para configurarse dentro de Intercom.
>
> Los tres puntos de contacto del blueprint (modal de Bloqueo en Etapa 1, modal Rechazado y modal Pendiente-en-revisión en Etapa Continua) abren este mismo widget en su menú raíz — sin deep-link técnico a una opción específica. La orientación hacia la opción correcta depende del copy de cada modal, no de una integración.

## Árbol de decisión

| # | Opción visible | Preguntas que resuelve | Acción/Respuesta |
|---|---|---|---|
| 1 | Mi cuenta está bloqueada | Por qué no puede retirar/transferir, si es un error de la plataforma, cuánto va a durar. | Aclarar que el bloqueo es una revisión de Legal/Financiero (Etapa 1 del blueprint), no un error de código ni una sanción automática. No tiene ETA fijo porque depende de que Legal/Financiero resuelvan el caso a mano. Si el usuario indica que lleva mucho tiempo esperando, escalar a agente. |
| 2 | Me rechazaron la verificación | Por qué lo rechazaron, si puede apelar, qué hacer si cree que es un error. | Aclarar que "Rechazado" (falla del proceso) es distinto de "Bloqueado por fraude" (falla del usuario). Ofrecer la vía de apelación ya contemplada en el blueprint ("Soporte desbanea cuenta si es falso positivo", Etapa Continua, Back stage punto 3) — reenviar el caso a revisión. |
| 3 | Mi verificación sigue en revisión | Cuánto tarda, si debe hacer algo más, si debe repetir el proceso. | Informar el SLA real de 48–72 horas hábiles (ya documentado en el blueprint, Etapa Continua Back stage punto 2, y en `UX-Writing-Modales-UserPilot.md` sección 4b). Aclarar que no necesita repetir el proceso ni reenviar documentos. |
| 4 | Empecé la verificación pero no la terminé | Cómo retoma donde quedó, si tiene que volver a empezar todo. | Guiar al usuario para retomar el proceso en Sumsub — redirige al flujo (mismo destino que el botón "Continuar verificación" del modal "incompleto en Sumsub"), no a un agente. |
| 5 | No sé qué proceso me aplica / qué documentos necesito | Qué documentos necesita, por qué en su país es diferente. | Diferenciar por país: Colombia usa Truora (solo personas naturales; las empresas usan KYB de Sumsub, bloque C, en evaluación). El resto de países usa proceso manual vía Sumsub con variantes por persona natural/jurídica/extranjero (bloques A/B/D/E ya definidos en el blueprint). No hay video-tutorial disponible — dar guía en texto paso a paso según el bloque que le aplica. |
| 6 | Soy extranjero, no sé qué documento cargar | Si usa pasaporte o su ID nacional, por qué le piden algo distinto. | Explicar que puede cargar pasaporte o identificación extranjera — Sumsub parametriza automáticamente el formato local del documento (Reglasvalidacion.md, regla 3 "Parametrización Automática Cross-Border"). Como este caso requiere revisión manual, escalar a agente. |
| 7 | Tengo una empresa / dudas de KYB | Qué necesita para validar su empresa, por qué piden NIT/cámara de comercio. | En Colombia, el KYB está "en evaluación" (bloque C del blueprint) — comunicar que la vía formal aún se está definiendo. En el resto de países, sigue las reglas de persona jurídica ya definidas: prueba de vida del representante legal + búsqueda de la empresa + datos fiscales; Sumsub autocompleta por nombre (Reglasvalidacion.md, regla 3 "Regla de Cero Fricción en Empresa") — el usuario no digita NIT. |
| 8 | Otro tema | Cualquier consulta fuera de las anteriores. | Escalar directo a un agente humano. |

## Coordinación

- **Ya existe hoy:** el widget de soporte flotante, disponible en toda la plataforma independientemente de este blueprint (documentado como punto de dolor AS-IS en `StartUser.md`, línea 75).
- **Falta configurar:** este árbol de 8 opciones dentro de ese widget, específico para el flujo de validación de identidad (Fase 0).
- El responsable de validar y construir este árbol dentro de Intercom para este proyecto está por definir.

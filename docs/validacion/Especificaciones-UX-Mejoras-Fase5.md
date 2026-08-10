# Especificaciones UX — 10 puntos de mejora para el flujo Fase 5

## Contexto y propósito

Este documento responde a un pedido directo de Catalina (PO del proyecto) tras leer [`Discovery-Riesgos-Transicion-Fase5.md`](Discovery-Riesgos-Transicion-Fase5.md), [`Casos-Externos-Referencia-Fase5.md`](Casos-Externos-Referencia-Fase5.md) y la charla técnica con Sumsub ([`ValidaciónSumsubREU.md`](ValidaciónSumsubREU.md)): analizar con lente de UX qué falta especificar y modificar en el [blueprint de Fase 5](Service_Blueprint_Diagrama_Fase_5.md), a partir de 10 puntos concretos que trajo más 3 comentarios adicionales. Es el tercer documento de esta serie de análisis — mismo rigor que sus dos hermanos (cita textual + heurística + severidad), pero con foco exclusivo en **qué modificar en el diseño de interacción y en el copy**, no en riesgo de negocio ni en casos externos (esos ya están cubiertos en los otros dos).

A diferencia de los documentos hermanos, este también incorpora una fuente nueva: el **flujo de Truora ya en producción**, tal como vive hoy en Figma (archivo "Cuenta V2.0.0"), porque Catalina señaló que ese flujo "tiene casi la misma lógica" de estados que Fase 5 necesita, aunque con "muchísimas mejoras a nivel de UX" pendientes — es decir, sirve como referencia de qué lógica de estado reusar y qué errores de UX ya cometidos no repetir.

## Metodología

Heurísticas de Nielsen (10) + Krug ("Don't make me think") con escala de severidad 0-4 del skill `ux-heuristics`, igual que `Casos-Externos-Referencia-Fase5.md`. Donde aplica, se suma la lente de `interaction-design-patterns` y `accessibility-and-inclusive-design` del skill `using-ux-designer` — estados de carga, foco de modal, contraste de banners de riesgo. Convención de severidad: 0=no es problema · 1=cosmético · 2=menor · 3=mayor · 4=catastrófico.

---

## 0. Fuente nueva — el flujo actual de Truora en Figma, comparado con Fase 5

Archivo Figma **"Cuenta V2.0.0"**, sección *"2. Validación de datos"* ([node 3351:124321](https://www.figma.com/design/HvoEmrK4bRGgOg1NrUFrjV/Cuenta-V2.0?node-id=3351-124321)), 8 estados ya en producción. Se leyó copy verbatim y comportamiento de cada uno para esta comparación.

| Estado actual (Figma) | Copy / comportamiento verbatim | Lección para Fase 5 |
|---|---|---|
| `2.1` Indicaciones | Modal con video + 3 tips pasivos (GPS activo, VPN apagada, "regresa a Dropi al terminar") antes de abrir Truora. Sin checkbox de confirmación. | **Reusar el contenido, no el patrón.** Fase 5 hoy no menciona GPS/VPN en ningún punto — hay que agregarlo antes de abrir el enlace (C5), pero como lista corta y visible, no como texto que se puede saltar sin leer. |
| `2.2` En validación | Banner pasivo: *"Tu información está en proceso de validación. Te avisaremos muy pronto"*. Sin botón, sin ETA, sin forma de consultar estado. | **No repetir.** Es un dead-end confirmado — mismo síntoma que el gap ya citado en `Casos-Externos-Referencia-Fase5.md` §2.2 (CS.Money, severidad 2: sin indicador de progreso durante el chequeo). Alimenta el punto 4 abajo. |
| `2.3` Proceso abandonado | Banner + botón único "Reanudar validación", dispara a los 10 min de inactividad. Mismo copy sin importar cuánto avanzó el usuario. | Aceptable como patrón base; Fase 5 ya lo mejora al prometer retomar "exactamente donde quedó" (`UX-Writing` §9c) — mantener esa mejora. |
| `2.4` Validación exitosa | **No tiene una pantalla de éxito explícita** — el "aviso" es un banner de facturación que asume que ya pasó. | **Contraste positivo para Fase 5**: el toast + confetti "¡Cuenta verificada!" (`UX-Writing` §9a) ya resuelve este gap. Documentar como acierto a preservar, no a rediseñar. |
| `2.5` Rechazada por Truora | Alert + modal con **countdown no cancelable** que expulsa al usuario fuera de Dropi. Nota interna de diseño: *"El usuario debe ser redirigido fuera de Dropi. No se le permite ingresar nuevamente a Dropi"*. Único botón antes de la expulsión: "Escribir a Soporte". | **Hallazgo crítico** — ver §7 y la sección de comentarios abajo. Es la evidencia concreta de que expulsar a un usuario ya se hace hoy, y que el soporte post-expulsión no está resuelto. |
| `2.6` / `2.7` Sin éxito 2º/3er intento | *"Te quedan 2 intentos"* / *"Te queda 1 intento"* (bug de gramática: "Aún tienes 1 intentos disponibles"). Cooldown de 10 min sin temporizador visible en el banner. | **Reusar el patrón de conteo de intentos** (es exactamente lo que pide el punto 1 de este documento) — pero corregir el bug de plural/singular y agregar temporizador visible del cooldown. |
| `2.8` Sin éxito - Soporte | Alert + modal con código de escalación **`[123456]` — placeholder sin resolver en el archivo de diseño**. Deriva a un ícono de chat flotante genérico, sin contexto. | No replicar el placeholder sin resolver ni la falta de contexto al llegar a soporte — el usuario tiene que reexplicar todo desde cero. |

**Constante en las 8 pantallas:** Truora nunca se nombra al usuario — confirma que "el proveedor nunca se nombra" ya es un patrón vigente en producción, no solo una propuesta nueva para Fase 5.

---

## Puntos 1-9 — especificación por punto

### 1 · Error granular — comunicar específicamente qué le falta al usuario

**Estado actual:** el banner "Incompleto" de C6 (`Service_Blueprint_Diagrama_Fase_5.md` §C6, `UX-Writing-Validacion-TechNative.md` §9c) tiene solo 3 variantes por categoría ("Te falta terminar tu identidad" / "...tus datos de facturación" / "Te falta un paso"), sin desglose de la causa puntual dentro de cada categoría.

**Heurística:** Nielsen #9 (ayudar a reconocer/diagnosticar/recuperarse de errores) — severidad **3**, ya citada en `Casos-Externos-Referencia-Fase5.md` §2.1 (Stripe Connect: `disabled_reason` con 10+ valores distintos vs. el mensaje único de Dropi) y §2.6 (Nubank: distinción entre acción síncrona visible vs. proceso asíncrono invisible).

**Especificación:** desglosar el banner "Incompleto" por causa puntual — documento sin cargar / prueba de vida pendiente / dato con discrepancia con el documento — separando explícitamente los casos donde el usuario tiene algo que hacer de los casos donde solo debe esperar un proceso interno (mismo eje que el punto 7). El patrón "Te quedan N intentos" de Truora (`2.6`/`2.7` en Figma) ya es un buen punto de partida — reusarlo, corrigiendo el bug de plural/singular ("1 intento" no "1 intentos") y agregando un temporizador visible durante el cooldown, en vez de solo texto.

### 2 · Recordatorio tras umbral de cantidad de órdenes

**Estado actual:** ETAPA 2 del blueprint ya define un job de recordatorio (una sola vez, unos días después de cerrar C2/C4d) y el modal C4d se dispara al volverse "activo" (~20 órdenes, aún en discusión).

**Heurística:** Nielsen #1 (visibilidad del estado del sistema) — severidad **2** como está hoy (umbral binario), pero conecta con un riesgo de negocio de severidad más alta ya documentado en `Discovery-Riesgos-Transicion-Fase5.md` §1.3: los Top 5 proveedores no validados por volumen mueven 200K-530K órdenes lifetime y nunca disparan el hard gate porque no retiran dinero — la validación depende de una acción del usuario, no de su exposición de riesgo.

**Especificación:** en vez de un único umbral binario "activo/no activo", una cadencia de recordatorio escalonada por volumen de órdenes acumuladas sin validar (ej. un aviso más notorio al cruzar cada cierto número de órdenes adicionales, no solo al entrar a "activo" la primera vez) — sin violar la Regla F ya existente (Despliegue por Lotes / Periodo Pedagógico: nunca bloquear de golpe, siempre con 1-2 semanas de aviso previo).

### 3 · Comunicar la importancia (compliance/TYC) sin repetir el enlace

**Estado actual:** el blueprint dice hoy "Mismo aviso legal de Términos y Privacidad que Fase 0.5" (nota de C3) sin especificar el copy exacto.

**Grounding:** `REUCONTI.md` líneas 130-131 — Catalina ya definió que la aceptación de Términos y Condiciones ocurre **dentro del SDK de Sumsub** ("cuando ya llegué en Samsung pues sí le mencioné como para continuar vas a estar aceptando tal los términos"), no como un enlace repetido en las alertas de Dropi.

**Heurística:** Nielsen #2 (coincidencia con el mundo real, lenguaje real) — severidad **2**. Conecta con el riesgo de transparencia frente al usuario ya señalado en `Discovery-Riesgos-Transicion-Fase5.md` §1.1 (el proveedor nunca se nombra, aunque procesa datos personales).

**Especificación:** agregar una línea de micro-copy — sin enlace — en el modal hard gate (C3) y en el soft touch (C2): *"Esto hace parte del tratamiento de tus datos personales, según nuestros Términos y Condiciones"*. Refuerza el motivo sin repetir el enlace, y sin nombrar al proveedor.

### 4 · Cómo se ve Dropi mientras corre la validación de Truora

**Estado actual:** el blueprint (C5) ya describe un banner "Estamos confirmando tus datos" **después** de que el usuario vuelve del proveedor, pero no describe qué ve **mientras** el WebSDK/enlace de Truora está abierto.

**Grounding:** `REUCONTI.md` líneas 180-186 (Catalina describe el "reflejo" entre el estado de Truora y el de Dropi) + el estado `2.2 En validación` del Figma de producción, que hoy es exactamente ese vacío: un banner pasivo sin ETA, sin botón, sin forma de consultar estado — confirmado en producción, no solo teórico (ver §0).

**Heurística:** Nielsen #1 (visibilidad del estado del sistema) — severidad **2**, mismo hallazgo de `Casos-Externos-Referencia-Fase5.md` §2.2 (CS.Money: sin indicador de progreso durante el chequeo mismo).

**Especificación:** documentar en C5 un indicador persistente (no el banner pasivo actual) mientras el enlace de Truora/Sumsub está abierto, para que el usuario no sienta que "salió" de Dropi sin dejar rastro. Sumar los tips de seguridad de `2.1` (GPS activo, VPN apagada) al copy de C5 antes de abrir el enlace — hoy están enterrados como texto pasivo en el flujo de Truora y Fase 5 no los menciona en absoluto.

### 5 · Niveles de verificación visibles para Colombia (identidad ≠ facturación)

**Estado actual:** la tabla "Colombia vs. Resto de países" del blueprint es una decisión de arquitectura interna — el usuario colombiano no ve explícitamente que su proceso tiene 2 pasos separados (identidad → Truora, facturación → Sumsub); solo lo infiere paso a paso.

**Heurística:** Nielsen #1 + #7 (visibilidad + flexibilidad) — severidad **3**, mismo gap que `Casos-Externos-Referencia-Fase5.md` §2.2 (Binance: tiers de verificación visibles, cada uno con el dato que pide y el beneficio que desbloquea).

**Especificación:** indicador de pasos en Información de cuenta / Datos de facturación (Colombia únicamente) — *"Paso 1 de 2 · Identidad"* / *"Paso 2 de 2 · Facturación"* — reutilizando el componente del DS Registry `dropi-steps` (`ds-registry/components/dropi-steps.json`, estados `pending | focus | completed | error`, ya soporta exactamente este caso). Fuera de Colombia no aplica — un solo enlace resuelve ambas.

### 6 · Definir mejor la recapitulación de datos cuando la validación se unifica

**Estado actual:** `UX-Writing-Validacion-TechNative.md` §10 ya tiene una pantalla de solo lectura ("Tus datos de validación") para Resto de países, pero sin desglosar qué campo vino del bloque de identidad y cuál del bloque fiscal.

**Heurística:** Nielsen #6 (reconocimiento antes que recuerdo) — severidad **2**.

**Especificación:** agrupar los campos mostrados por origen (Identidad / Datos fiscales) en esa pantalla de recapitulación, y confirmar explícitamente el caso de reconciliación parcial: si Sumsub confirma un bloque antes que el otro, la pantalla debe reflejar cuál ya está confirmado y cuál sigue pendiente, en vez de mostrar todo como un bloque monolítico "en proceso".

### 7 · "Bloqueado" no distingue decisión instantánea de investigación en curso

**Estado actual:** un único banner "Tu cuenta está bloqueada por seguridad" (`C6`, `UX-Writing` §9e, `Soporte-Validacion-Fase-5.md` opción 1) cubre tanto una bandera de riesgo en investigación (reversible, sin ETA) como lo que en la práctica es un baneo definitivo.

**Heurística:** Nielsen #1 — severidad **3**, hallazgo ya citado en `Casos-Externos-Referencia-Fase5.md` §2.6 (Nubank: acciones síncronas/visibles vs. asíncronas/invisibles son experiencias psicológicamente distintas). Ahora con evidencia directa de producción (ver §0): el estado `2.5` de Truora en Figma ya implementa un bloqueo definitivo (expulsión con countdown) visualmente casi idéntico al bloqueo "en revisión" de `2.8` — mismo componente Alert/Dialog, severidad de fondo completamente distinta.

**Especificación:** dividir "Bloqueado" en dos variantes de copy — **bloqueo de riesgo en investigación** (reversible, sin ETA, tono actual: "Nuestro equipo la está revisando para proteger tus fondos") vs. **bloqueo definitivo** (irreversible, tono distinto, sin promesa de resolución). A diferencia del `2.5` actual, ninguna de las dos variantes debe expulsar al usuario sin dejarle un canal de soporte alcanzable — ver comentario de baneo más abajo. Aplicado directamente en `Service_Blueprint_Diagrama_Fase_5.md`, `UX-Writing-Validacion-TechNative.md` y `Soporte-Validacion-Fase-5.md` (ver Entregable 2 de este proyecto).

### 8 · Especificaciones del proceso cross-country

**Estado actual:** el blueprint marca dos puntos abiertos 🚧 separados que en realidad son la misma pregunta de fondo: reconocimiento de identidad ya validada en otro país (ETAPA 1) y propagación de bloqueo/baneo entre países (Regla E, nota de referencia cruzada a `Historia.md` Fase 1).

**Grounding:** `Discovery-Riesgos-Transicion-Fase5.md` §7 pregunta 1 · `Casos-Externos-Referencia-Fase5.md` §2.7 (Sumsub Reusable KYC + Airbnb "closely associated", ambos severidad **4** — los gaps más críticos del documento hermano) · cita textual de Catalina en `REUCONTI.md` 213-220: *"Y definitivamente es un ban definitivo para la persona... y también cose cruntry"*.

**Especificación:** nombrar explícitamente dos mecanismos distintos, no uno solo:
- **(a) Reconocimiento cross-country positivo** — un usuario ya validado en un país solo debería tener que completar el dato puntual que le falte en el país nuevo (ej. solo facturación en México si ya validó identidad en Colombia), sin repetir todo el proceso.
- **(b) Propagación cross-country de un bloqueo/baneo** — si se decide banear a un usuario por riesgo en un país, ¿aplica automáticamente en los demás países donde opera con el mismo correo/documento?

Ambos quedan marcados 🚧 pendientes de decisión Legal/TI — este documento deja el copy especificado y listo para cuando se decida, pero no resuelve la pregunta de negocio.

### 9 · Comunicado oficial extenso del nuevo proceso de validación

**Estado actual:** no existe ningún artefacto de comunicación de rollout — el blueprint solo tiene la Regla F (Despliegue por Lotes / Periodo Pedagógico) como mecanismo de aviso previo, sin definir el contenido de ese aviso.

**Heurística:** Nielsen #5 (prevención de errores, comunicar la consecuencia completa por adelantado) — severidad **2**, mismo patrón que `Casos-Externos-Referencia-Fase5.md` §2.1 (Airbnb: cascada de consecuencias comunicadas antes de que ocurran).

**Especificación:** plantilla de comunicado (in-app + correo, una sola vez, antes del despliegue por cohorte) con: qué cambia (de Truora-only manual a un flujo automático), por qué (cumplimiento normativo y protección de fondos, sin tecnicismos), qué pasa si no se completa (bloqueo progresivo de salidas de dinero, nunca de ventas), y el tiempo esperado de resolución. Sin nombrar Sumsub ni Truora. Ver plantilla completa en `UX-Writing-Validacion-TechNative.md` §13 (Entregable 2).

---

## Comentarios del usuario (no numerados)

### A · La duda del baneo — ¿cómo contacta a soporte un usuario bloqueado/expulsado?

Catalina planteó la duda directamente: *"el tema del bloqueo me genera la duda porque si bloqueamos al usuario es como un baneo, eso quiere decir que se saca al usuario de la cuenta (actualmente funciona así para truora según el flujo que hay en figma) ¿cómo haría el usuario para contactar a soporte?"*

**Esto ya no es una pregunta hipotética — tiene evidencia doble:**
1. **Palabras textuales de Catalina** en `REUCONTI.md` 213-220 sobre baneo definitivo y cross-country: *"Y definitivamente es un ban definitivo para la persona... y también cose cruntry"*.
2. **Comportamiento confirmado en producción** (ver §0, estado `2.5`): hoy el usuario rechazado por Truora es expulsado de Dropi con un countdown no cancelable, y el único botón de soporte ("Escribir a Soporte") vive **antes** de esa expulsión — después de ser expulsado, no hay un canal de soporte definido dentro del flujo.

**Riesgo:** el árbol de soporte in-app (`Soporte-Validacion-Fase-5.md`) vive dentro de la sesión autenticada. Si "Bloqueado definitivo" implica cerrar sesión o suspender la cuenta, ese árbol deja de ser alcanzable justo cuando más se necesita.

**Opciones de mitigación a evaluar con Legal/SAC** (no se decide aquí):
- No expulsar al usuario del todo: dejarlo en una pantalla de solo lectura con el árbol de soporte accesible, en vez de redirigirlo fuera de la app.
- Un canal de soporte fuera de la sesión autenticada (correo o WhatsApp visible incluso en una pantalla de "cuenta suspendida"), para el caso en que sí se decida cerrar la sesión.

**Marcado 🚧 — pendiente de validar con Legal/SAC antes de construir**, junto con el punto 8 (cross-country).

### B · Nunca mencionar Sumsub ni Truora en las alertas

Ya es una regla transversal existente en el blueprint ("El proveedor nunca se nombra en el copy") y está confirmada como patrón ya vigente en producción (§0: ninguna de las 8 pantallas de Truora nombra al proveedor). Ninguna especificación de este documento la viola — todas las especificaciones nuevas (puntos 1, 3, 4, 5, 9) hablan de "tu identidad", "tus datos de facturación" o "el proceso de validación", nunca del proveedor.

### C · Resultado inmediato — sin pantalla de espera al validarse

**Grounding:** `REUCONTI.md` líneas 222-233, palabras textuales de Catalina: *"está aprobado automáticamente sin que la persona tenga que esperar mucho tiempo se pueda disparar la API para mencionarle el mensaje"* / *"que sí o sí la persona tenga algo, pues la respuesta en drope automáticamente y no tener que esperar a que el equipo a mano esté revisando el proceso"*.

**Estado actual:** el copy de C5/C6 (`UX-Writing` §11) presenta el banner "en proceso" con SLA de hasta 24 horas como si aplicara a todos los casos por igual.

**Especificación:** aclarar explícitamente que ese SLA de 24h aplica **solo** a la cola de excepciones (≤8% de los casos, `Historia.md`). El camino automático mayoritario (>92%) debe resolver en segundos — mismo orden de magnitud que CS.Money (8 segundos, `Casos-Externos-Referencia-Fase5.md` §2.2) — y mostrar el resultado inmediato, sin exponer a la mayoría de los usuarios a lenguaje de espera de "hasta 24 horas" que hoy no les aplica.

---

## Tabla resumen — qué se actualiza y qué queda abierto

| Punto | Documento vivo actualizado | Estado |
|---|---|---|
| 1 · Error granular | `Service_Blueprint_Diagrama_Fase_5.md` (C6) + `.html` (`#state-incomplete`) | ✅ Aplicado — catálogo de causas especificado; 🚧 confirmar con TI antes de construir |
| 2 · Recordatorio por umbral | `Service_Blueprint_Diagrama_Fase_5.md` (ETAPA 2) + `.html` (detalle Etapa 2) | ✅ Aplicado — cadencia de 2 niveles especificada; 🚧 umbral exacto (N órdenes) pendiente de Producto |
| 3 · Micro-copy TYC | `Service_Blueprint_Diagrama_Fase_5.md` (C3), `UX-Writing` §3 | ✅ Aplicado |
| 4 · Reflejo visual Truora | `Service_Blueprint_Diagrama_Fase_5.md` (C5) + `.html` (`#provider-reflection`) | ✅ Aplicado — copy e indicador especificados; 🚧 formato visual exacto pendiente de TI/Product Design |
| 5 · Indicador de pasos CO | `Service_Blueprint_Diagrama_Fase_5.md` (C4), `UX-Writing` nueva entrada | ✅ Aplicado |
| 6 · Recapitulación por bloque | `Service_Blueprint_Diagrama_Fase_5.md` (C4 resto de países) + `.html` | ✅ Aplicado — desglose por bloque especificado; 🚧 reconciliación parcial pendiente de confirmar con TI |
| 7 · Split "Bloqueado" | `Service_Blueprint_Diagrama_Fase_5.md` (C6, Regla E), `UX-Writing` §9e/9f, `Soporte-Validacion-Fase-5.md` opción 1 | ✅ Aplicado (copy de las dos variantes); canal de soporte post-baneo queda 🚧 |
| 8 · Cross-country | `Service_Blueprint_Diagrama_Fase_5.md` (ETAPA 1, C6 "Definitivo") + `.html` | ✅ Aplicado — copy de ambos mecanismos (a: reconocimiento, b: propagación de baneo) especificado, sin activar; 🚧 decisión de negocio pendiente de Legal/TI |
| 9 · Comunicado oficial | `UX-Writing` §13 (nueva) | ✅ Aplicado (plantilla) |
| Comentario A · Baneo/soporte | `Service_Blueprint_Diagrama_Fase_5.md` (Regla E) + `.html`, `Soporte-Validacion-Fase-5.md` opción 1 | ✅ Aplicado — las 2 opciones de mitigación quedaron explícitas; 🚧 decisión final pendiente de Legal/SAC |
| Comentario B · No nombrar proveedor | — | Confirmado, sin cambios necesarios |
| Comentario C · Resultado inmediato | `Service_Blueprint_Diagrama_Fase_5.md` (C5/C6), `UX-Writing` §11 | ✅ Aplicado |

---

## Verificación

Contrastar con Catalina y Legal/SAC antes de tratar como definitivo el punto 8 (cross-country) y el Comentario A (baneo/soporte) — son preguntas abiertas, no decisiones tomadas por este documento. Verificar que los tres documentos vivos (`Service_Blueprint_Diagrama_Fase_5.md`, `UX-Writing-Validacion-TechNative.md`, `Soporte-Validacion-Fase-5.md`) queden consistentes entre sí tras la edición — mismas dos variantes de "Bloqueado" nombradas igual en los tres. No requiere pruebas automatizadas por ser documentación.

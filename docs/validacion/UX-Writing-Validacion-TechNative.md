# UX Writing — Validación tech-native (loop de completar gaps)

> Copies canónicos para las intervenciones nativas del [Service Blueprint Diagrama Fase 5](Service_Blueprint_Diagrama_Fase_5.md). Idioma: español neutro LatAm. Tono Dropi (directo, cercano, sin jerga de proveedor). Proceso: purposeful → concise → conversational → clear. Los mismos textos viven en las cajas Front Acciones del MD y del HTML.

**Naming:** este pack cubre el **loop de completar validación** (gaps de identidad / facturación). No es la edición post-aprobación de `Historia.md` Fase 5 (ver addendum en el blueprint).

**Mapa de coerción** (de menos a más forzoso):

| Nivel | Mecanismo | Puede evadirse | Cuándo |
|---|---|---|---|
| Soft | Slide-up inferior derecho | Sí (X) | Home / navegación pasiva |
| Welcome | Modal primera venta / primer movimiento wallet | Sí (después / X) | Primer evento de valor |
| Hard | Tooltip + modal interceptor | No (hasta completar o ir al enlace) | Clic en movimiento de salida |
| Estado | Banner / toast de resultado | Depende del estado | Tras webhook |

Truora / Sumsub **no aparecen en copy de usuario**; solo en Nota interna.

---

## 1. Soft — Slide-up inferior derecho

| Elemento | Copy |
|---|---|
| Headline | **Verifica tu cuenta** |
| Body | En Dropi lo necesitamos para confirmar quién eres y mantener la plataforma segura. |
| Botón primario | **Completar ahora** |
| Cierre | Ícono X · `aria-label="Cerrar, verificar más tarde"` |

**Nota interna:** Mismo eje que el banner Fase 0 (`UX-Writing-Modales-UserPilot.md`): motivo = seguridad de la plataforma, no retiros si el usuario aún no tiene saldo. El CTA rutea según gaps (identidad primero en CO si faltan ambos).

---

## 2. Hard gate — Tooltip en movimiento financiero deshabilitado

| Elemento | Copy |
|---|---|
| Tooltip | Completa tu validación para usar esta función. |

**Nota interna:** Hard gate solo en salidas (retiros, transferencias, DropiCard). Órdenes y entradas siguen libres (`Reglasvalidacion.md`).

---

## 3. Hard gate — Modal interceptor (variantes por gap)

### 3a. Falta identidad (prioridad; CO o si el CTA va a Mi cuenta)

| Elemento | Copy |
|---|---|
| Headline | **Completa tu identidad para continuar** |
| Body | Antes de mover fondos necesitamos confirmar quién eres. Te llevamos a Información de cuenta. |
| Botón | **Ir a Información de cuenta** |

### 3b. Solo falta facturación (Colombia)

| Elemento | Copy |
|---|---|
| Headline | **Completa tus datos de facturación** |
| Body | Por seguridad y para desbloquear movimientos financieros, valida tus datos de facturación. Te lleva unos minutos. |
| Botón | **Completar facturación** |

### 3c. Faltan ambas (Colombia)

| Elemento | Copy |
|---|---|
| Headline | **Valida tus datos para continuar** |
| Body | Antes de mover fondos necesitamos tu identidad y tus datos de facturación. Empieza por tu identidad en Información de cuenta. |
| Botón | **Completar identidad** |

### 3d. Resto de países (un solo destino)

| Elemento | Copy |
|---|---|
| Headline | **Valida tus datos para continuar** |
| Body | Antes de mover fondos necesitamos confirmar quién eres. Te llevamos a completar la validación. |
| Botón | **Continuar a validación** |

**Nota interna:** En CO, 3a/3b/3c eligen destino (Mi cuenta → Truora vs enlace Sumsub). Fuera de CO, un enlace Sumsub cubre KYC+KYB. Aviso legal (Términos + Privacidad) igual que Fase 0.5.

### 3e. Micro-copy de tratamiento de datos (línea adicional en 3a-3d, y en el slide-up §1)

| Elemento | Copy |
|---|---|
| Línea adicional bajo el body | Esto hace parte del tratamiento de tus datos personales, según nuestros Términos y Condiciones. |

**Nota interna:** sin enlace — la aceptación explícita de Términos ya ocurre dentro del flujo del proveedor (Truora/Sumsub), confirmado por Catalina en `REUCONTI.md` 130-131. Ver [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#3--comunicar-la-importancia-compliancetyc-sin-repetir-el-enlace) punto 3.

---

## 4. Bienvenida — Primera orden o primer movimiento wallet

| Elemento | Copy |
|---|---|
| Headline | **¡Tu primera venta en Dropi!** |
| Body | Qué bueno que ya empezaste. Para retirar o usar tu dinero, completa tu validación de datos. Es por tu seguridad y la de la plataforma. |
| Botón primario | **Completar validación** |
| Secundario | **Ahora no** |

**Nota interna:** CTA usa la misma matriz de gaps que el modal hard (prioridad identidad en CO). Celebración proporcional; no promete DropiCard si el usuario aún no la conoce.

---

## 5. Módulo — Datos de facturación (Colombia)

### 5a. Vacío

| Elemento | Copy |
|---|---|
| Headline | **Completa tus datos de facturación** |
| Body | Por seguridad y para desbloquear movimientos financieros, valida tus datos de facturación. No es un formulario aquí: te llevamos al proceso seguro. |
| Botón / enlace | **Completar datos de facturación** |

**Nota interna:** Sin formulario KYB nativo en Dropi (evitar retroceso frente a Sumsub). Enlace abre Sumsub.

### 5b. En proceso (tras volver de Sumsub, esperando el webhook)

| Elemento | Copy |
|---|---|
| Formato | La tarjeta reemplaza el botón por una etiqueta de estado — **banner fijo dentro de la tarjeta, no modal**. No interrumpe el resto de la navegación. |
| Headline | **Estamos confirmando tus datos de facturación** |
| Body | No debería tardar más de 24 horas. Mientras tanto, sigue comprando y vendiendo sin problema — solo pausamos tus retiros y transferencias. |

**Nota interna:** mismo copy que `Service_Blueprint_Diagrama_Fase_5.md` §C5 / este documento §11 ("Colombia · falta facturación") — es el mismo aviso, mostrado en el lugar donde vive la acción (la tarjeta de Datos de facturación), no solo como banner flotante. Sin fecha de desbloqueo todavía — a diferencia del estado "Completo" (§6), aquí no se sabe cuándo resuelve, solo el SLA de 24h.

---

## 6. Módulo — Datos de facturación completos (read-only)

| Elemento | Copy |
|---|---|
| Headline | **Tus datos de facturación** |
| Campos mostrados | Razón social · NIT · RUT · Cámara de comercio · Representante legal · Correo de facturación |
| Alerta | No podrás editar estos datos en los próximos 6 meses. Si necesitas un cambio, escribe a soporte desde el ícono de abajo a la derecha. |
| Excepción | Correo de facturación se puede editar en cualquier momento, incluso durante el bloqueo — no dispara una nueva validación. |

**Nota interna:** campos derivados de Fase 0 (`DOC ENLACES`, KYB Colombia: prueba de vida del representante legal + cédula + razón social + NIT + RUT + cámara de comercio) y de `Historia.md` (correo de facturación es campo no sensible, `RN-11` no le aplica). RN-11 / fricción defensiva; edición real = flujo hermano (addendum). Copy de campos nuevo — validar con Product Design antes de construir.

---

## 7. Módulo — Información de cuenta (Colombia)

| Elemento | Copy |
|---|---|
| Headline (incompleto) | **Completa tu información de cuenta** |
| Body (incompleto) | Con estos datos confirmamos quién eres. Al guardar, empezamos la validación con una prueba de vida. |
| Campos del formulario | Tipo de persona · Nombre completo · Tipo de documento · Número de documento · Documento adjunto |
| Botón | **Guardar y continuar** |

| Estado | Copy / comportamiento |
|---|---|
| Incompleto | Formulario editable, con los campos de arriba → al guardar, se abre un **enlace aparte** (fuera de Dropi) donde el proveedor toma la prueba de vida (liveness). El usuario la completa en su propio tiempo — no es parte del formulario de Dropi. |
| **En proceso** | Al volver a Dropi (haya completado o no la prueba de vida todavía), los campos quedan visibles pero deshabilitados. **Formato: banner fijo dentro de la página, no modal** — no bloquea el resto de la navegación. Headline: **Estamos confirmando tu identidad**. Body: *No debería tardar más de 24 horas. Mientras tanto, sigue comprando y vendiendo sin problema — solo pausamos tus retiros y transferencias.* Sin fecha de desbloqueo todavía — a diferencia del estado siguiente, aquí no se sabe cuándo resuelve, solo el SLA de 24h. |
| Completo + RN-11 vigente | Mismos campos, visibles pero bloqueados. Tooltip: *Podrás editar este dato el {unlock_at}. Lo bloqueamos temporalmente por seguridad.* |
| Completo + RN-11 vencido | Editable; cambios en nombre, tipo de persona, tipo/número de documento o documento adjunto disparan el flujo de edición (addendum). Dirección y ciudad se guardan directo, sin re-validación. |

**Nota interna:** campos derivados de `Historia.md` (sensibles: nombre, tipo de persona, tipo y número de documento, documento adjunto · no sensibles: dirección, ciudad). El aviso "En proceso" es el mismo copy que `Service_Blueprint_Diagrama_Fase_5.md` §C5 / este documento §11 ("Colombia · falta identidad") — mostrado en el lugar donde vive la acción (la página de Información de cuenta), no solo como banner flotante. Copy de campos nuevo — validar con Product Design antes de construir.

---

## 8. Éxito parcial + cross-sell (confetti)

### 8a. Completó identidad; falta facturación (CO)

| Elemento | Copy |
|---|---|
| Headline | **¡Identidad lista!** |
| Body | Ya validaste quién eres. Ahora completa tus datos de facturación para desbloquear movimientos financieros. |
| Botón | **Completar facturación** |

### 8b. Completó facturación; falta identidad (CO)

| Elemento | Copy |
|---|---|
| Headline | **¡Datos de facturación listos!** |
| Body | Qué bien. Para desbloquear movimientos financieros también necesitas validar tu identidad en Información de cuenta. |
| Botón | **Ir a Información de cuenta** |

**Nota interna (8a/8b):** el sistema revisa el estado real del otro dato **en el momento en que resuelve el primero** — no asume que sigue faltando. Si el usuario ya lo había completado por su cuenta mientras el primero estaba en proceso (son proveedores y tiempos distintos), se salta 8a/8b y pasa directo a 8c.

### 8c. Completó todo (cualquier país)

| Elemento | Copy |
|---|---|
| Headline | **¡Cuenta verificada!** |
| Body | Ya puedes transferir tu wallet, registrar datos bancarios y pedir tu DropiCard. |
| Duración | Toast / modal breve con confetti; auto-dismiss 4–5 s |

---

## 9. Estados post-webhook

El **formato** depende de si el usuario necesita decidir algo o solo enterarse — nunca al revés:

- **Toast** (aprobado, todo completo): el mayor logro del flujo, pero no requiere ninguna decisión — se retira solo, no bloquea la pantalla.
- **Modal** (aprobación parcial, solo Colombia): sí pide una decisión real (¿completo el otro dato ahora o después?), por eso interrumpe con un botón.
- **Banner** (rechazado, incompleto, en revisión, bloqueado): informa sin interrumpir — el usuario puede seguir navegando y volver cuando quiera.

El **copy** nombra qué se resolvió (identidad, facturación o ambas) cuando aplica. Dos headlines se mantienen genéricos a propósito porque ya están referenciados en `Service_Blueprint_Fase_5_Mapa-Decision.md` — se marcan abajo. *Convención de esta sección: comillas = texto literal que ve el usuario; sin comillas = caso, nota o acción interna, para no confundir una cosa con la otra.*

### 9a. Aprobado (toast)

| Elemento | Copy |
|---|---|
| Headline | **"¡Cuenta verificada!"** |
| Body | "Ya puedes transferir tu wallet, registrar datos bancarios y pedir tu DropiCard." |
| Duración *(nota, no se muestra)* | Auto-dismiss 4–5 s |

### 9b. Rechazado (banner) — 3 variantes

| Caso *(no se muestra)* | Headline *(texto literal)* |
|---|---|
| Colombia · identidad rechazada | **"No pudimos confirmar tu identidad"** |
| Colombia · facturación rechazada | **"No pudimos confirmar tus datos de facturación"** |
| Resto de países / genérico | **"No pudimos validar tus datos"** |

Nota (no se muestra): la fila genérica es el headline de referencia, ya usado en Mapa-Decision. Body, texto literal (las 3): *"Conservamos lo que ya tenías aprobado antes. Puedes intentarlo de nuevo cuando quieras."* Botones: **Reintentar** / **Contactar a soporte**.

### 9c. Incompleto (banner) — 3 variantes

| Caso *(no se muestra)* | Headline *(texto literal)* |
|---|---|
| Colombia · identidad incompleta | **"Te falta terminar tu identidad"** |
| Colombia · facturación incompleta | **"Te falta terminar tus datos de facturación"** |
| Resto de países / genérico | **"Te falta un paso"** |

Nota (no se muestra): la fila genérica es el headline de referencia, ya usado en Mapa-Decision. Body, texto literal (las 3): *"Empezaste el proceso pero no lo terminaste."* Botón: **Continuar validación** — retoma exactamente donde quedó.

### 9d. En revisión prolongada (banner) — 4 variantes

Es la continuación del aviso "en proceso" de §11 cuando el caso cae en la cola de revisión manual (≤8% de los casos, `Historia.md`) en vez de resolver solo.

| Caso *(no se muestra)* | Headline *(texto literal)* |
|---|---|
| Colombia · identidad | **"Seguimos confirmando tu identidad"** |
| Colombia · facturación | **"Seguimos confirmando tus datos de facturación"** |
| Resto de países | **"Seguimos confirmando tus datos"** |
| Ecuador/Chile/Argentina migrado | **"Seguimos confirmando tus datos"** |

Nota (no se muestra, solo para el caso EC/CL/AR migrado): su caso ya sigue este mismo proceso automático. Body, texto literal (las 4): *"Pasó a revisión manual — nuestro equipo lo está mirando. No debería tardar más de 24 horas en total. Mientras tanto, sigue comprando y vendiendo sin problema — no necesitas reenviar nada."* Botón: **Entendido**.

### 9e. Bloqueado — en investigación (banner, sin botón de reintento) — universal

No depende de identidad ni facturación — es una bandera de riesgo de Legal/Financiero, no un resultado del webhook (Regla E). Reversible, sin ETA fijo — distinto de 9f.

| Elemento | Copy |
|---|---|
| Headline | **"Tu cuenta está bloqueada por seguridad"** |
| Body | "Nuestro equipo la está revisando para proteger tus fondos. No podrás hacer retiros, transferencias ni pedir DropiCard mientras dure la revisión." |
| Acción *(nota, no se muestra)* | Sin botón de reintento — dirige al árbol de soporte (`Soporte-Validacion-Fase-5.md`). |

### 9f. Bloqueado — definitivo (banner, sin botón de reintento) — universal

Irreversible. No prometer resolución. A diferencia del estado equivalente ya en producción para Truora (`2.5 Validación rechazada por Truora`, Figma "Cuenta V2.0.0"), que hoy expulsa al usuario de la app con un countdown no cancelable y deja el soporte inalcanzable después de la expulsión, este estado no debe cerrar la sesión sin dejar un canal de soporte accesible.

| Elemento | Copy |
|---|---|
| Headline | **"Tu cuenta fue suspendida de forma definitiva"** |
| Body | "Tras revisar tu caso, no puedes seguir operando en Dropi. Esta decisión no tiene reversión." |
| Acción *(nota, no se muestra)* | Sin botón de reintento. 🚧 Canal de soporte post-suspensión (sesión de solo lectura vs. canal fuera de sesión) — pendiente de decisión Legal/SAC, ver [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#a--la-duda-del-baneo--cómo-contacta-a-soporte-un-usuario-bloqueadoexpulsado) Comentario A. |

**Nota interna (9e/9f):** ver [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#7--bloqueado-no-distingue-decisión-instantánea-de-investigación-en-curso) punto 7 para el análisis completo de por qué se dividió este estado.

---

## 10. Módulo único — Resto de países (identidad y, si aplica, empresa)

| Elemento | Copy |
|---|---|
| Headline | **Valida tu identidad y tus datos de facturación** |
| Body | Un formulario guiado te pide lo que necesitamos, según tu país. No tienes que volver después — todo queda listo de una vez. |
| Botón | **Completar validación** |

**Lo que pide el formulario, según bloque de país** (dentro de Sumsub — no es una pantalla de Dropi, igual que la facturación en Colombia):

| Bloque | Persona natural | Si declara empresa |
|---|---|---|
| A — GT, PA, PY, PE, MX, VE, CR, Europa | Documento de identidad + prueba de vida + datos fiscales | Prueba de vida del representante legal + nombre de la empresa (el resto se autocompleta) |
| B — CL, EC, AR | Documento de identidad + prueba de vida | Prueba de vida del representante legal + documento de la empresa (sin autocompletar) |

| Estado completo (read-only) | Copy |
|---|---|
| Headline | **Tus datos de validación** |
| Body | Lista combinada de identidad y facturación, tal como quedaron validados. |
| Alerta | No podrás editar estos datos en los próximos 6 meses. Si necesitas un cambio, escribe a soporte desde el ícono de abajo a la derecha. |

**Nota interna:** campos derivados de Fase 0 (`DOC ENLACES`, bloques A/B) y de la tabla de ruteo de C5 (`Service_Blueprint_Diagrama_Fase_5.md`). El formulario en sí vive dentro de Sumsub — Dropi solo sirve la tarjeta de entrada (arriba) y, al volver, la lista de solo lectura. Copy nuevo — validar con Product Design antes de construir.

---

## 11. En proceso — mientras se confirma (antes del resultado final)

Se muestra justo después de que el usuario acepta ir a validar (C5), mientras espera la respuesta automática. Distinto del estado final "En revisión" de C6 (§9) — ese aparece si, pasadas las 24h, el caso sigue sin resolver solo.

> ⏱️ **Nota de timing:** para el camino automático (>92% de los casos), esta pantalla es una transición de segundos, no una espera real — el resultado de §9a-§9c llega casi de inmediato. El SLA de 24h que menciona el body de abajo aplica **solo** a la cola de excepciones (§9d, ≤8% de los casos); no es la experiencia por defecto. Ver [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#c--resultado-inmediato--sin-pantalla-de-espera-al-validarse), Comentario C.

**Formato: banner fijo dentro de la página donde vive la acción, no modal.** Para Colombia, es el mismo aviso que aparece embebido en Información de cuenta (§7) o en Datos de facturación (§5b) — no un banner flotante aparte. Para el resto de países, aparece en la única página del módulo. No interrumpe el resto de la navegación ni bloquea otras pantallas.

| Caso | Headline | Body |
|---|---|---|
| Colombia · falta identidad | **Estamos confirmando tu identidad** | No debería tardar más de 24 horas. Mientras tanto, sigue comprando y vendiendo sin problema — solo pausamos tus retiros y transferencias. |
| Colombia · falta facturación | **Estamos confirmando tus datos de facturación** | No debería tardar más de 24 horas. Mientras tanto, sigue comprando y vendiendo sin problema — solo pausamos tus retiros y transferencias. |
| Colombia · faltan ambas | **Estamos confirmando tu identidad** (primero) | Al aprobarse, pasa a "Estamos confirmando tus datos de facturación" — nunca se muestran los dos avisos a la vez. |
| Resto de países (bloques A/B) | **Estamos confirmando tus datos** | No debería tardar más de 24 horas. Mientras tanto, sigue comprando y vendiendo sin problema — solo pausamos tus retiros y transferencias. |
| Ecuador/Chile/Argentina migrado | **Estamos confirmando tus datos** | Tu caso ya sigue este mismo proceso automático. No debería tardar más de 24 horas y no necesitas reenviar nada. |

**Por qué este tono:** evitamos el registro de "ticket de sistema" (*"puede tomar hasta 24 horas"*, *"se bloquean los retiros"* en voz pasiva) y hablamos como Dropi hablándole a la persona — verbos activos ("pausamos"), acciones concretas ("comprar y vender") en vez de abstractas ("operar"), sin prometer más de lo que sabemos (nunca "ya casi termina", solo el tope real de 24h).

**Nota interna:** el proveedor nunca se nombra ("confirmando tu identidad", no "Truora está revisando"). Para Colombia, el headline cambia según cuál de los dos datos está en proceso — nunca dice "tu solicitud" genérico. Copy nuevo — validar con Product Design antes de construir.

---

## Antes → Después (eje del replanteo)

| Antes (jerga / scope edición) | Después (momento del usuario) |
|---|---|
| field_diff / precedencia sensible | ¿Qué te falta? identidad / facturación / ambas |
| Confirma tus cambios para continuar | Completa tu identidad / facturación para continuar |
| Router C/A/B/D/E (en copy usuario) | Un enlace o dos destinos, sin nombrar el motor |
| Habilitación por entidad | ¿Puedes editar este dato ahora? (solo addendum edición) |

---

## 12. Indicador de pasos — Información de cuenta y Datos de facturación (solo Colombia)

| Elemento | Copy |
|---|---|
| Paso 1 | **Paso 1 de 2 · Identidad** |
| Paso 2 | **Paso 2 de 2 · Facturación** |

**Nota interna:** componente DS `dropi-steps` (`ds-registry/components/dropi-steps.json`), estados `pending \| focus \| completed \| error`. Hace visible que Colombia tiene dos pasos separados (Truora identidad + Sumsub facturación) — hoy solo se infiere navegando. No aplica fuera de Colombia (un solo enlace resuelve ambas). Vive en §5 y §7 (Datos de facturación e Información de cuenta). Ver [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#5--niveles-de-verificación-visibles-para-colombia-identidad--facturación) punto 5.

---

## 13. Comunicado oficial de migración (rollout, una sola vez por cohorte)

| Elemento | Copy |
|---|---|
| Canal | In-app (banner o modal, una sola vez) + correo, antes de activar el hard gate para esa cohorte (Regla F) |
| Headline | **Estamos actualizando cómo validamos tu cuenta** |
| Body | Para proteger tus fondos y cumplir con la regulación, pasamos a un proceso de validación automático y más rápido. No cambia nada en cómo vendes ni en tus órdenes — solo afecta retiros, transferencias y DropiCard si tienes datos pendientes. |
| Qué pasa si no se completa | Si no completas tu validación, iremos pausando gradualmente tus retiros y transferencias — nunca tus ventas. Te avisaremos antes de cada paso. |
| Botón | **Completar validación** / **Entendido** |

**Nota interna:** sin nombrar Sumsub ni Truora. Reutiliza el patrón de cascada de consecuencias comunicadas por adelantado (Airbnb, `Casos-Externos-Referencia-Fase5.md` §2.1) y la Regla F ya existente (Despliegue por Lotes / Periodo Pedagógico) — se envía una sola vez, 1-2 semanas antes de activar el hard gate para esa cohorte. Ver [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#9--comunicado-oficial-extenso-del-nuevo-proceso-de-validación) punto 9.

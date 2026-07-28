# Service Blueprint — Loop tech-native de completar lo que falta (identidad + facturación)

> Mismo journey de negocio que [`Service_Blueprint_Diagrama Fase 0.md`](Service_Blueprint_Diagrama%20Fase%200.md) (soft → hard → validar → resolver), pero con tecnología nativa en vez de UserPilot, CRM y Google Sheets. Este documento sigue el mismo formato narrativo que Fase 0, incluyendo su misma división en **etapas principales** — cada etapa agrupa uno o varios pasos (C0–C6) que comparten un mismo momento del journey, con sus siete carriles (Usuarios, Tarea, Canales, Acciones front, Acciones back, Herramientas, Stakeholders). La versión visual equivalente es [`Service_Blueprint_Diagrama_Fase_5.html`](Service_Blueprint_Diagrama_Fase_5.html).
>
> ⚠️ **Naming:** el archivo se llama "Fase_5" por historial del repo, pero **no es la "Fase 5 — edición post-validación" de [`Historia.md`](Historia.md)**. Aquí se documenta el **loop para completar lo que falta** de identidad y facturación. La edición post-aprobación vive en el [Addendum](#addendum--edición-post-aprobación-historia-fase-5) al final.
>
> 📎 Este documento ya incluye, dentro de cada paso, la tabla SI → ENTONCES de esa bifurcación — no hace falta salir de aquí para seguir la lógica completa. [`Service_Blueprint_Fase_5_Mapa-Decision.md`](Service_Blueprint_Fase_5_Mapa-Decision.md) queda como referencia opcional más profunda (diagramas mermaid de cada rama). Copy canónico completo: [`UX-Writing-Validacion-TechNative.md`](UX-Writing-Validacion-TechNative.md). Árbol de soporte (widget de ayuda): [`Soporte-Validacion-Fase-5.md`](Soporte-Validacion-Fase-5.md).

## Qué cambia frente a Fase 0

| Mecanismo | Fase 0 (no-code) | Este blueprint (tech-native) |
|---|---|---|
| Canal de intervención | UserPilot / CRM | UI nativa Dropi (slide-up, tooltip, modal, módulos) |
| Actualización de estados | Descarga de Sumsub → Google Sheet → apagar modal a mano | Aviso automático y firmado del proveedor ("webhook") → el motor de estados actualiza Dropi → el usuario lo ve, en milisegundos |
| Back Office | Ejecuta el proceso a mano | Revisa solo las excepciones que la cola no resuelve |
| Eje del flujo | Antigüedad del usuario (nuevo / activo) | Qué le falta: ¿identidad? ¿facturación? + país |
| Tiempo de resolución manual | Hasta 72h hábiles (cola + Google Sheet a mano) | Hasta 24h (`RN-07`, `Historia.md`) — y solo aplica al ≤8% que cae en la cola de excepciones |

## Cómo está organizado este blueprint

- **4 etapas principales, de izquierda a derecha** — misma granularidad que Fase 0 (PRE-ETAPA → ETAPA 0 → ETAPA 0.5 → ETAPA CONTINUA). Cada etapa puede agrupar más de un paso interno:
  1. **PRE-ETAPA · Preparación** — el paso `C0`.
  2. **ETAPA 1 · Segmentación** — el paso `C1`.
  3. **ETAPA 2 · Canales de entrada** — los pasos `C2`, `C3` y `C4`, **en paralelo** dentro de la misma etapa.
  4. **ETAPA 3 · Validación y Resolución** — los pasos `C5` y `C6`, en secuencia dentro de la misma etapa.
- **Dentro de ETAPA 2, el usuario entra por uno solo de los tres pasos (C2, C3 o C4), no por los tres.** Los tres convergen en `C5` (ETAPA 3).
- **Filas (7 carriles, de arriba hacia abajo)**, misma convención que Fase 0:
  1. **Usuarios** — a quién le aplica ese paso.
  2. **Tarea** — la secuencia de pasos, en orden horizontal.
  3. **Front stage → Canales** — por dónde le llega la intervención al usuario.
  4. **Front stage → Acciones** — qué ve y hace el usuario en pantalla, con el copy exacto.
  5. **Back stage → Acciones** — qué hace el sistema o el equipo interno sin que el usuario lo vea.
  6. **Herramientas** — qué sistemas soportan ese paso.
  7. **Stakeholders** — quién es responsable de qué parte.
- **Convención de color** (igual a Fase 0): 🟢 verde = usuario/hito positivo · 🟣 morado = sistema/backstage · 🔵 azul = UI nativa · 🔴 rojo = motor de identidad (Truora/Sumsub) o hard gate · 🟡 amarillo = decisión · ⚪ gris = soporte/herramienta.

## Colombia vs. Resto de países — la diferencia central

Esta es la diferencia estructural que determina el copy y la dinámica de C3, C4, C5 y C6 en cada país. Cada sub-sección más abajo detalla el copy exacto; esta tabla resume el patrón antes de entrar al detalle.

| Dimensión | Colombia | Resto de países (incluye Ecuador/Chile/Argentina sin pendiente) |
|---|---|---|
| Proveedores | Dos: Truora (identidad) + Sumsub (facturación) | Uno: Sumsub (identidad y facturación juntas) |
| Pasos para completar | Dos pasos separados | Un solo paso, con un enlace |
| Información de cuenta (identidad) | Formulario propio de Dropi — al guardar, dispara la validación en Truora | No existe como paso separado — va todo dentro del enlace único de Sumsub |
| Datos de facturación | No es un formulario — enlace directo a la ventana de Sumsub (KYB) | No existe como paso separado — mismo enlace único |
| Mensajes del hard gate (C3) | Hasta 4 variantes: falta identidad / falta solo facturación / faltan ambas / — | Una sola variante: "Valida tus datos para continuar" |
| Resultado al completar | Puede quedar parcial — aprueba un dato y falta el otro (confetti + invitación a completar lo que falta) | Siempre queda completo de una vez (confetti + "¡Cuenta verificada!") |
| Bienvenida (C4d) si le faltan ambas | Prioriza identidad (Truora), luego ofrece facturación (Sumsub) | Un solo enlace resuelve ambas |

---

## PRE-ETAPA · Preparación — sync con Truora y Sumsub

**Usuarios:** Toda la base, con estados por sincronizar: pendientes, aprobados, incompletos y pendientes manuales de Ecuador, Chile y Argentina.

**Tarea** (secuencia horizontal):
1. ⚫ Inicio
2. 🟣 Sync de estados: el sistema consulta Truora y Sumsub vía API y escribe en Dropi `aprobado` / `incompleto` / `en_revision` / pendiente — en milisegundos, sin descargas manuales ni Google Sheets.
3. 🟣 Migración EC/CL/AR: los casos que hoy se revisan a mano en Ecuador, Chile y Argentina se crean o actualizan como applicant en Sumsub; Dropi los deja en `en_revision` por defecto. *(Alternativa si Legal lo pide: esperar 72h sin abrir un caso nuevo en Sumsub.)* 🚧 **Punto abierto:** propuesta de TI aún sin validar con Legal — falta definir la experiencia final antes de tomarla como decisión cerrada.
4. 🟢 Flags listos — *(pasa a ETAPA 1)*

**Front stage → Canales:** Ninguno para el usuario. Corre como jobs automáticos de sincronización en el backend de Dropi, conectados directamente a la API de Truora y a la API de Sumsub.

**Front stage → Acciones:** Ninguna acción nueva en el momento de la migración — el usuario no ve nada mientras corre el script. El cambio lo nota la próxima vez que entra a Dropi: en vez de su caso pendiente en revisión manual (WhatsApp / Google Sheet), ve el mismo banner "Estamos confirmando tus datos" que ve cualquier otro usuario en revisión (ver C5/C6) — su proceso ya corre dentro del flujo automático de Sumsub, sin que haya tenido que reenviar nada.

**Back stage → Acciones:**
- 🟣 Los jobs de sincronización (API sync) mantienen `has_identity`, `has_billing`, `country` y `manual_pending` alineados con el proveedor.
- 🟣 El script de migración EC/CL/AR homologa un "Aprobado manual" a `has_billing = true`; inyecta un "Pendiente manual" al flujo de Sumsub.

**Herramientas:** API Truora · API Sumsub · jobs de sync.

**Stakeholders:**
- **TI** — mantiene los jobs de sincronización y el script de migración.
- **Legal** — decide si aplica la alternativa de espera de 72h.

**SI → ENTONCES (EC/CL/AR pendiente manual):**

| SI | ENTONCES (por defecto) | Alternativa si Legal lo pide |
|---|---|---|
| Usuario en revisión manual de Ecuador, Chile o Argentina | 🚧 Se crea o actualiza como applicant en Sumsub; Dropi queda en `en_revision` — *propuesta aún sin validar con Legal* | Esperar 72h sin abrir un caso nuevo en Sumsub |
| Sumsub pide completar el proceso | El usuario retoma en ETAPA 3 (C5) con el botón Continuar | — |
| Usuario de esos países sin pendiente, con un dato nuevo por completar | Un solo enlace corto de Sumsub (identidad + facturación) | — |

---

## ETAPA 1 · Segmentación y Estado API — ¿qué le falta?

**Usuarios:** Dropshipper, Proveedor o Marca Blanca, con o sin identidad y con o sin facturación aprobadas, según su país.

**En una frase:** Antes de iniciar cualquier acción, el sistema decide en milisegundos consultando vía API las bases de datos de Truora y Sumsub — sin descargas manuales ni Google Sheets. Si ya tiene identidad y facturación completas, no pasa nada. Si le falta algo, determinamos su canal de entrada.

**Tarea** (secuencia horizontal):
1. 🟡 **[Decisión]** ¿Tiene identidad y facturación aprobadas?
2. 🟢 Si ambas están OK → no pasa nada: sigue operando normal, sin ver el aviso sutil (soft touch), el bloqueo estricto (hard gate) ni ningún modal.
3. 🟣 Si falta alguna → queda elegible y espera a que el usuario elija un canal en ETAPA 2 (C2, C3 o C4).

**Front stage → Canales:** Ninguno para el usuario. La decide el motor de segmentación en el backend de Dropi — no hay pantalla ni notificación.

**Front stage → Acciones:** Ninguna. Esta etapa no tiene copy — solo clasifica.

**Back stage → Acciones:**
- 🟣 El motor de segmentación lee los flags que dejó la PRE-ETAPA y decide si el usuario es elegible para alguna intervención.

**Herramientas:** Motor de segmentación.

**Stakeholders:**
- **TI** — mantiene el motor de segmentación.

**SI → ENTONCES (Gaps y Estado API):**

| SI (estado devuelto por la API) | ENTONCES (qué le falta) | Destino en el flujo |
|---|---|---|
| `has_identity` y `has_billing` = Aprobado | No pasa nada: sin aviso sutil, sin bloqueo estricto, sin modal | Fin del flujo (operación normal) |
| Falta identidad y/o facturación (incompleto o sin iniciar) | Elegible para intervención (cuenta nueva o antigua) | Espera a que el usuario elija un canal en ETAPA 2 (C2, C3 o C4) |
| Estado API = Pendiente / En Revisión | Validación en curso por parte del proveedor | Bloqueo transaccional temporal → espera la respuesta del proveedor (ETAPA 3) |

---

## ETAPA 2 · Canales de entrada (Rutas Paralelas, el usuario elige UNO)

**En una frase:** la intervención se adapta a la antigüedad y la acción del usuario: los nuevos ven el mensaje de bienvenida, los antiguos ven el aviso sutil. El bloqueo estricto (hard gate) solo aparece al intentar un movimiento financiero, sin importar la antigüedad — los otros dos canales se pueden ignorar o posponer.

**SI → ENTONCES (Canal):**

| SI el usuario… | Antigüedad / estado | Canal | ¿Bloqueante? |
|---|---|---|---|
| Recibe su 1ª orden (venta) o hace su 1er movimiento de wallet | Nuevo, sin iniciar validaciones | **C4d** Bienvenida | No — puede posponer |
| Navega en Home / Dashboard | Antiguo, le falta alguna validación | **C2** Soft touch | No — puede cerrar la X |
| Hace clic en Retirar / Transferir / DropiCard | Nuevo o antiguo, con datos incompletos | **C3** Hard gate (bloqueo estricto) | Sí — obligatorio |
| Abre Información de cuenta o Datos de facturación | Nuevo o antiguo, con datos incompletos | **C4** Módulo | Según su estado |

> **Importante:** los tres pasos siguientes (C2, C3, C4) son **alternativas dentro de esta misma etapa, no una secuencia**. El usuario entra por uno solo según lo que haga — nunca pasa de "C2 a C3 a C4" en fila. Ver [Mitos a evitar](#mitos-a-evitar).

**Recordatorio si no completa:** si el usuario cierra el aviso sutil (C2) o pospone la bienvenida (C4d) y el dato le sigue faltando, un job de recordatorio le reenvía el mismo aviso una sola vez, unos días después — mismo canal in-app, o correo/WhatsApp si tiene ese canal configurado. No se repite a diario. El bloqueo estricto (C3) no lleva recordatorio: ya es obligatorio en el momento en que aparece.

**Herramientas (recordatorio):** job de recordatorio.

**Stakeholders (recordatorio):**
- **TI** — mantiene el job de recordatorio.
- **Product Designer / Growth** — define cadencia y copy.

### C2 · Soft touch — el usuario navega sin tocar su dinero

**Usuarios:** Usuario con algún dato incompleto, navegando en Home o el Dashboard, sin intentar retirar, transferir o pedir DropiCard.

**Tarea** (secuencia horizontal):
1. 🟢 Usuario con algo pendiente entra al Home
2. 🔵 Ve el slide-up "Verifica tu cuenta"
3. 🟣 Puede cerrarlo con la X y seguir navegando — cerrarlo **no** lo manda al hard gate.

**Front stage → Canales:**
1. 🔵 Slide-up nativo, esquina inferior derecha. Se renderiza desde el frontend de Dropi (Angular); no tapa la pantalla.

**Front stage → Acciones:**
1. 🔵 Slide-up — Headline: **Verifica tu cuenta**. Body: *En Dropi lo necesitamos para confirmar quién eres y mantener la plataforma segura.* Botón: **Completar ahora**. Cierre con X (`aria-label="Cerrar, verificar más tarde"`). *(Si pulsa Completar ahora, sale a ETAPA 3 — o al paso C4 si el destino es Información de cuenta.)*

**Back stage → Acciones:**
- 🟣 El frontend de Dropi registra la impresión del slide-up. No bloquea ninguna operación.

**Herramientas:** Frontend Dropi (Angular).

**Stakeholders:**
- **Product Designer / Growth** — copy y frecuencia del slide-up.
- **TI** — mantiene el frontend que registra la impresión.

### C3 · Hard gate — el usuario intenta sacar dinero

**Usuarios:** Usuario con algún dato incompleto que hace clic en **Retirar**, **Transferir entre wallets** o **Solicitar DropiCard**. Aplica igual a cuentas nuevas o antiguas — lo que dispara el bloqueo es la acción, no la antigüedad.

**Antes del modal — alerta pasiva ya existente:** para validación de identidad y facturación ya hay recordatorios con alertas visibles con solo entrar a Wallet, Datos bancarios, Retiros de saldo o DropiCard — no son nuevos, ya están en producción. El modal interceptor de este paso es distinto y más contundente: solo aparece al hacer clic en la acción de salida en sí (Retirar / Transferir / Solicitar DropiCard), no al simplemente navegar a esas páginas.

**Tarea** (secuencia horizontal):
1. 🟢 Usuario con algo pendiente intenta una salida de dinero
2. 🔴 El control se deshabilita y aparece un mensaje emergente
3. 🔵 Se abre un modal según lo que le falte
4. 🟢 Acepta el botón — *(pasa a ETAPA 3, o al paso C4 si el destino es Información de cuenta)*

**Front stage → Canales:**
1. 🔴 Tooltip + modal nativo interceptor, sobre el control de salida. Renderizado por el frontend de Dropi (Angular) y bloqueado por el hard gate API.

**Front stage → Acciones:**
1. 🔵 Tooltip: *Completa tu validación para usar esta función.*
2. 🔵 Falta identidad — Headline: **Completa tu identidad para continuar**. Body: *Antes de mover fondos necesitamos confirmar quién eres. Te llevamos a Información de cuenta.* Botón: **Ir a Información de cuenta**.
3. 🔵 Solo falta facturación (Colombia) — Headline: **Completa tus datos de facturación**. Body: *Por seguridad y para desbloquear movimientos financieros, valida tus datos de facturación. Te lleva unos minutos.* Botón: **Completar facturación**.
4. 🔵 Faltan ambas (Colombia) — Headline: **Valida tus datos para continuar**. Body: *Antes de mover fondos necesitamos tu identidad y tus datos de facturación. Empieza por tu identidad en Información de cuenta.* Botón: **Completar identidad**.
5. 🔵 Resto de países — Headline: **Valida tus datos para continuar**. Body: *Antes de mover fondos necesitamos confirmar quién eres. Te llevamos a completar la validación.* Botón: **Continuar a validación**.

*(El proveedor — Truora o Sumsub — nunca se nombra en el copy que ve el usuario; ver el ruteo real en ETAPA 3. Mismo aviso legal de Términos y Privacidad que Fase 0.5.)*

**Back stage → Acciones:**
- 🔴 El hard gate (motor de bloqueo, expuesto como hard gate API) solo se aplica a retiros, transferencias y DropiCard. Órdenes, ventas y entradas de dinero siguen libres (`Reglasvalidacion.md`).
- 🔴 El hard gate API resuelve qué modal mostrar según lo que le falte y su país (ver ETAPA 3).

**Herramientas:** Frontend Dropi (Angular) · hard gate API.

**Stakeholders:**
- **Product Designer + Financiero** — regla de qué acciones bloquean.
- **TI** — mantiene el hard gate API.

### C4 · Módulo — el usuario abre cuenta, facturación o hace su primera venta

**Usuarios:** Usuario con algo pendiente que abre `Información de cuenta` o `Datos de facturación`, o que genera su primera orden o su primer movimiento de wallet.

**Tarea** (secuencia horizontal):
1. 🟢 Usuario abre un módulo o genera su primer evento de valor
2. 🟣 En Colombia, identidad y facturación se completan por separado; en el resto de países, en un solo paso
3. 🟢 Al completar, sale a ETAPA 3 (C5)

**Front stage → Canales:**
1. 🔵 Página nativa `Mi cuenta` / `Datos de facturación`, servida por el frontend de Dropi (Angular) y la API de perfil y facturación.
2. 🔵 Modal de bienvenida en la primera venta, mismo frontend.

**Front stage → Acciones:**
1. 🔵 Bienvenida (primera venta o primer movimiento de wallet) — Headline: **¡Tu primera venta en Dropi!**. Body: *Qué bueno que ya empezaste. Para retirar o usar tu dinero, completa tu validación de datos. Es por tu seguridad y la de la plataforma.* Botones: **Completar validación** / **Ahora no**.
2. 🔵 Colombia · Información de cuenta — Headline: **Completa tu información de cuenta**. Body: *Con estos datos confirmamos quién eres. Al guardar, empezamos la validación con una prueba de vida.* Campos: tipo de persona · nombre completo · tipo de documento · número de documento · documento adjunto. Botón: **Guardar y continuar**.
   - Incompleto → formulario editable con esos campos; al guardar, se abre un **enlace aparte** (fuera de Dropi) donde el proveedor toma la prueba de vida — el usuario la completa en su propio tiempo, no es parte del formulario de Dropi.
   - **En proceso** (al volver a Dropi, mientras se confirma) → los campos quedan visibles pero deshabilitados. **Formato: banner fijo dentro de la página, no modal** — no bloquea el resto de la navegación. Headline: **Estamos confirmando tus datos**. Body: *Mientras tanto, puedes seguir usando Dropi pero hemos pausado temporalmente tus retiros y transferencias.* (Nota interna: este banner reutiliza el mismo flujo de confirmación de Truora que ya está en producción — no es un banner nuevo.)
   - Completo → mismos campos, visibles pero de solo lectura. Sin fecha de desbloqueo automática — para editarlos, el usuario contacta a soporte: nombre, tipo de persona, tipo/número de documento y documento adjunto activan el flujo de re-validación (ver [Addendum](#addendum--edición-post-aprobación-historia-fase-5)); dirección y ciudad se guardan directo.
3. 🔵 Colombia · Datos de facturación:
   - Vacío → Headline: **Completa tus datos de facturación**. Body: *Por seguridad y para desbloquear movimientos financieros, valida tus datos de facturación. No es un formulario aquí: te llevamos al proceso seguro.* Botón: **Completar datos de facturación** (sin formulario KYB nativo en Dropi — *nota: Sumsub ya corre el proceso completo de KYB, documento + verificación; construir un formulario propio en Dropi duplicaría ese trabajo*).
   - **En proceso** (al volver de Sumsub, mientras se confirma) → la tarjeta reemplaza el botón por una etiqueta de estado. **Formato: banner fijo dentro de la tarjeta, no modal**. Headline: **Estamos confirmando tus datos**. Body: *Mientras tanto, puedes seguir usando Dropi pero hemos pausado temporalmente tus retiros y transferencias.*
   - Completo → Headline: **Tus datos de facturación**. Campos mostrados (solo lectura): razón social · NIT · RUT · cámara de comercio · representante legal · correo de facturación. Aviso de solo lectura + acceso a soporte. Excepción: el correo de facturación se puede editar en cualquier momento, sin disparar una nueva validación.
   - Si al llegar aquí la facturación ya estaba aprobada (por ejemplo, el usuario la completó por su cuenta mientras la identidad seguía en proceso), no se le vuelve a pedir — pasa directo al resultado final "¡Cuenta verificada!" (ver C6).
4. 🔵 Resto de países — Headline: **Valida tu identidad y tus datos de facturación**. Body: *Un formulario guiado te pide lo que necesitamos, según tu país. No tienes que volver después — todo queda listo de una vez.* Botón: **Completar validación**. El formulario vive dentro de Sumsub (no es una pantalla de Dropi): bloque A (GT, PA, PY, PE, MX, VE, CR, Europa) pide documento + prueba de vida + datos fiscales, y si declara empresa, autocompleta al buscarla por nombre; bloque B (CL, EC, AR) pide documento + prueba de vida, y si declara empresa, el documento de la empresa sin autocompletar. Al completar → Headline: **Tus datos de validación**. Lista combinada de identidad y facturación, con el mismo aviso de solo lectura.

> Campos y copy completos, con la nota de qué es hecho confirmado (`Historia.md`, Fase 0) vs. copy nuevo por validar: [`UX-Writing-Validacion-TechNative.md`](UX-Writing-Validacion-TechNative.md) §5, §6, §7, §10, §11.

**Back stage → Acciones:**
- 🟣 La API de perfil y facturación carga los datos guardados y bloquea (solo lectura) los campos del Dueño si ya están validados; editarlos pasa por soporte, que dispara re-validación si el campo es sensible.

**Herramientas:** Frontend Dropi (Angular) · API de perfil y facturación.

**Stakeholders:**
- **Product Designer** — diseño de los módulos.
- **TI** — mantiene la API de perfil y facturación.

---

## ETAPA 3 · Validación y Resolución

Los pasos `C5` (Validación) y `C6` (Resolución) están en secuencia dentro de esta misma etapa: `C5` abre el proveedor, `C6` procesa la respuesta.

### C5 · Validación y ruteo — país + lo que falta

**Usuarios:** Usuario que aceptó el botón desde C2, C3 o C4 (ETAPA 2).

**Tarea** (secuencia horizontal):
1. 🟢 Usuario acepta el botón
2. 🔴 El sistema abre el destino correcto según su país y lo que le falta — el usuario nunca elige entre Truora o Sumsub
3. 🟣 Dropi queda en `en_revision` mientras espera respuesta — *(pasa a C6, dentro de la misma etapa)*

**Front stage → Canales:**
1. 🔴 WebSDK o enlace de Truora / Sumsub, abierto por el router de país (backend de Dropi). El hard gate de salidas sigue activo mientras se resuelve; órdenes y entradas de dinero quedan libres.

**Front stage → Acciones:** el aviso "en proceso" cambia según qué se esté confirmando — nunca dice "tu solicitud" genérico, y el proveedor nunca se nombra. **Formato: banner fijo dentro de la página donde vive la acción (Información de cuenta o Datos de facturación en Colombia; el módulo único en el resto de países), no modal ni banner flotante aparte:**
1. 🔵 Colombia · falta identidad — vive en Información de cuenta (ver C4). Headline: **Estamos confirmando tus datos**. Body: *Mientras tanto, puedes seguir usando Dropi pero hemos pausado temporalmente tus retiros y transferencias.* (Nota interna: mismo flujo de confirmación de Truora que ya está en producción, no es un banner nuevo.)
2. 🔵 Colombia · falta facturación — vive en Datos de facturación (ver C4). Mismo headline y body que arriba.
3. 🔵 Colombia · faltan ambas — Muestra primero el aviso de identidad; al aprobarse, pasa al de facturación en su propia página. Nunca se muestran los dos avisos a la vez.
4. 🔵 Resto de países (bloques A/B) — vive en el módulo único (ver C4). Headline: **Estamos confirmando tus datos**. Mismo body que arriba (identidad y facturación se validan juntas, sin separarlas).
5. 🔵 Ecuador/Chile/Argentina migrado — mismo módulo único. Headline: **Estamos confirmando tus datos**. Body: *Tu caso ya sigue este mismo proceso automático — no necesitas reenviar nada.*

El ruteo real (a qué proveedor va cada caso) es interno — ver tabla abajo. Copy completo: [`UX-Writing-Validacion-TechNative.md`](UX-Writing-Validacion-TechNative.md) §5b, §7, §11.

**Back stage → Acciones:** el router de país (backend de Dropi) decide a qué proveedor enviarlo según su país y lo que le falte, y confirma la respuesta con una firma digital ("webhook").

**SI → ENTONCES (a dónde lo manda, según el país y lo que le falte):**

| SI (condición del usuario) | Proveedor que lo valida | Lo que pasa (destino) |
|---|---|---|
| Colombia + falta identidad | Truora (validación de identidad) | Va a Información de cuenta → llena el formulario de Dropi → sigue el proceso en Truora |
| Colombia + falta facturación | Sumsub (validación de facturación) | Sin formulario en Dropi — enlace directo a la ventana de Sumsub para validar la empresa (KYB) |
| Colombia + faltan ambas | Primero Truora, luego Sumsub | Prioriza identidad; al aprobarse, le ofrece completar también la facturación |
| Otros países, persona natural — bloque A (GT, PA, PY, PE, MX, VE, CR, Europa) | Sumsub (identidad y facturación juntas) | Módulo único. Si además declara empresa, Sumsub la busca por nombre y autocompleta el dato fiscal. |
| Otros países, persona natural — bloque B (CL, EC, AR) | Sumsub (identidad y facturación juntas) | Módulo único. Si además declara empresa, pide el documento de la empresa sin autocompletar. |
| Marca Blanca, cualquier país | Sumsub, mismo ruteo por bloque que le corresponda | Mismo flujo automático de arriba, con la interfaz sin marca Dropi. |
| Usuario extranjero (documento distinto al del país donde opera) | Sumsub | Acepta pasaporte o el documento oficial de su país de origen — el sistema reconoce el formato solo. |
| Factura a nombre de un tercero | Sumsub ("continuar en el teléfono") | Genera un enlace para el celular; el usuario se lo reenvía al tercero, que solo completa la prueba de vida — sin repetir los datos que ya cargó el titular. |
| 🚧 Excepción Ecuador/Chile/Argentina (pendiente manual) — punto abierto, ver PRE-ETAPA | Sumsub (ya migrado, propuesta sin validar con Legal) | Ya migrado a Sumsub en la PRE-ETAPA; si Sumsub pide retomar, continúa aquí |

Todos los mensajes de las filas "Otros países" llevan al mismo módulo único de Sumsub — la diferencia entre bloque A y B es solo si el formulario autocompleta o no el dato de la empresa.

**Herramientas:** Truora · Sumsub · WebSDK · router de país (backend de Dropi).

**Stakeholders:**
- **TI** — mantiene el router de país.
- **TI + proveedores** — mantienen los enlaces (WebSDK) y el enrutamiento.

### C6 · Resolución — el webhook decide

**Usuarios:** Usuario con resultado `aprobado`, `rechazado`, `incompleto` o `en_revision`.

**Tarea** (secuencia horizontal):
1. ⚫ Llega el webhook firmado de Truora o Sumsub
2. 🟣 El motor de estados actualiza identidad y/o facturación
3. 🟢 El usuario ve el resultado — *(fin del loop, o vuelve al paso C4/C5 si todavía le falta lo otro)*

**Front stage → Canales:**
1. 🔵 Estado dentro de la app (frontend Dropi, Angular) + notificación automática (in-app, correo o WhatsApp), enviada por el motor de estados al recibir el webhook.

**Front stage → Acciones:** el formato depende de si el usuario necesita decidir algo o solo enterarse — y el copy nombra qué se resolvió (identidad, facturación o ambas) y en qué país aplica, salvo donde ya existe una redacción genérica de referencia (ver nota de cada bloque). *Convención: todo lo que va entre comillas es texto literal que ve el usuario en pantalla; lo que va sin comillas (notas, "Nota:", explicaciones entre paréntesis) es información interna que no se muestra.*

**Aprobado — cierra el loop (toast, sin acción requerida):**
1. 🟢 Universal — Colombia cuando resuelve el segundo dato pendiente, o único resultado posible en Resto de países. Toast + confeti, auto-dismiss 4–5s: **"¡Cuenta verificada!"** *"Ya puedes transferir tu wallet, registrar datos bancarios y pedir tu DropiCard."* Los datos quedan en **solo lectura**, con el aviso: *"Estos datos ya no se pueden editar. Si necesitas un cambio, escribe a soporte."*

**Aprobación parcial — pide una decisión (modal + confeti, solo Colombia):**
2. 🔵 Colombia · completó identidad, falta facturación — **"¡Identidad lista!"** *"Ya validaste quién eres. Ahora completa tus datos de facturación para desbloquear movimientos financieros."* Botón: **Completar facturación**.
3. 🔵 Colombia · completó facturación, falta identidad — **"¡Datos de facturación listos!"** *"Qué bien. Para desbloquear movimientos financieros también necesitas validar tu identidad en Información de cuenta."* Botón: **Ir a Información de cuenta**.
   - Nota (no se muestra): no existe en Resto de países — ahí identidad y facturación siempre se resuelven juntas, nunca por separado.
   - Nota (no se muestra): el sistema revisa el estado real del otro dato en el momento en que resuelve el primero — no asume que sigue faltando. Si el usuario ya lo había completado por su cuenta mientras el primero estaba en proceso, se saltan estos dos mensajes y pasa directo a "¡Cuenta verificada!" (ítem 1).

**Rechazado — informa y deja reintentar (banner):**

| Caso *(no se muestra)* | Headline *(texto literal)* |
|---|---|
| 🟥 Colombia · identidad rechazada | **"No pudimos confirmar tu identidad"** |
| 🟥 Colombia · facturación rechazada | **"No pudimos confirmar tus datos de facturación"** |
| 🟥 Resto de países / genérico | **"No pudimos validar tus datos"** |

Nota (no se muestra): la fila genérica es el headline de referencia, ya citado en `Mapa-Decision.md`. Mismo cuerpo en los 3, texto literal: *"Conservamos lo que ya tenías aprobado antes. Puedes intentarlo de nuevo cuando quieras."* Botones: **Reintentar** / **Contactar a soporte**.

**Incompleto — invita a retomar (banner):**

| Caso *(no se muestra)* | Headline *(texto literal)* |
|---|---|
| 🟡 Colombia · identidad incompleta | **"Te falta terminar tu identidad"** |
| 🟡 Colombia · facturación incompleta | **"Te falta terminar tus datos de facturación"** |
| 🟡 Resto de países / genérico | **"Te falta un paso"** |

Nota (no se muestra): la fila genérica es el headline de referencia, ya citado en `Mapa-Decision.md`. Mismo cuerpo en los 3, texto literal: *"Empezaste el proceso pero no lo terminaste."* Botón: **Continuar validación** — retoma exactamente donde quedó en la API.

**En revisión prolongada — mismo aviso que ya venía viendo, ahora en modo persistente (banner, ≤8% de los casos):**

| Caso *(no se muestra)* | Headline *(texto literal)* |
|---|---|
| ⚪ Colombia · identidad | **"Seguimos confirmando tu identidad"** |
| ⚪ Colombia · facturación | **"Seguimos confirmando tus datos de facturación"** |
| ⚪ Resto de países | **"Seguimos confirmando tus datos"** |
| ⚪ Ecuador/Chile/Argentina migrado | **"Seguimos confirmando tus datos"** |

Nota (no se muestra): en el caso EC/CL/AR migrado, es porque su caso ya sigue este mismo proceso automático. Mismo cuerpo en las 4, texto literal: *"Pasó a revisión manual — nuestro equipo lo está mirando. No debería tardar más de 24 horas en total. Mientras tanto, sigue comprando y vendiendo sin problema — no necesitas reenviar nada."* Botón: **Entendido**.

**Bloqueado — bandera de riesgo, no depende de identidad ni facturación (banner, sin reintento):**

| Caso *(no se muestra)* | Headline *(texto literal)* |
|---|---|
| 🟥 Universal, cualquier país | **"Tu cuenta está bloqueada por seguridad"** |

Texto literal (body): *"Nuestro equipo la está revisando para proteger tus fondos. No podrás hacer retiros, transferencias ni pedir DropiCard mientras dure la revisión."* Nota (no se muestra): sin botón de reintento — dirige al [árbol de soporte](Soporte-Validacion-Fase-5.md) (chip "Validación de identidad" → "Mi cuenta está bloqueada").

Copy completo por caso, con la razón detrás de cada formato: [`UX-Writing-Validacion-TechNative.md`](UX-Writing-Validacion-TechNative.md) §9.

**Back stage → Acciones:**
- 🟣 Motor de estados: valida la firma del aviso y que no esté repetido, nunca sobrescribe un aprobado con un rechazo, y envía una notificación por cada cambio real de estado.
- 🟣 Cola de excepciones para los casos que el webhook no resuelve solo — meta operativa: ≤8% manual (`Historia.md`).
- 🔴 Bloqueado es una bandera de riesgo que pone Legal/Financiero directamente en Dropi — no llega por el webhook de Truora/Sumsub y puede coexistir con cualquiera de los otros estados. Ver [Regla E](#reglas-transversales).

**Herramientas:** Aviso automático del proveedor (webhook) · motor de estados · notificaciones.

**Stakeholders:**
- **TI** — mantiene el motor de estados y la cola de excepciones.
- **Legal / Soporte** — solo revisan lo que cae en la cola.
- **Legal / Financiero** — deciden y levantan el bloqueo por riesgo (independiente del webhook).

**SI → ENTONCES (resultado del webhook):** tabla resumen — el copy exacto por caso (identidad/facturación/país) y el formato (toast/modal/banner) están en la lista de Acciones arriba.

| SI (estado del webhook) | ENTONCES UI (mensaje en Dropi) | Comportamiento del módulo tras el resultado |
|---|---|---|
| Aprobado, ya tiene todo completo | Toast: "¡Cuenta verificada!" + confetti | Datos en **solo lectura**. Aviso: "Estos datos ya no se pueden editar. Si necesitas un cambio, escribe a soporte." |
| Aprobación parcial (solo Colombia) | Modal: "¡Identidad lista! Completar facturación" (o su inverso) + confetti | Lo que ya completó queda en solo lectura; lo que le sigue faltando queda pendiente y se le sigue exigiendo |
| Rechazado (identidad, facturación o genérico según el caso) | Banner: "No pudimos confirmar tu identidad" / "...tus datos de facturación" / "No pudimos validar tus datos" | Los datos previos válidos se conservan; se habilitan los reintentos hacia Sumsub/Truora |
| Incompleto (identidad, facturación o genérico según el caso) | Banner: "Te falta terminar tu identidad" / "...tus datos de facturación" / "Te falta un paso" | Botón Continuar retoma exactamente donde quedó en la API |
| En revisión prolongada (identidad, facturación, resto de países o EC/CL/AR migrado — ver SI→ENTONCES en la PRE-ETAPA) | Banner: "Seguimos confirmando tu identidad" / "...tus datos de facturación" / "...tus datos" — hasta 24h en total (`RN-07`) | Solo se bloquean las salidas de dinero; no hace falta reenviar documentos |
| Bloqueado por Legal/Financiero (no por el proveedor, cualquier caso) | Banner: "Tu cuenta está bloqueada por seguridad" | Sin fecha fija — depende de que Legal/Financiero resuelvan el caso a mano; ver árbol de soporte |

---

## Reglas transversales

- **Regla A · Hard gate solo en salidas.** Retiros, transferencias y DropiCard. Órdenes, ventas y entradas de dinero nunca lo disparan.
- **Regla B · Webhook directo.** Sin Google Sheets en el camino feliz. Un solo evento actualiza identidad y facturación.
- **Regla C · Consolidación de EC/CL/AR (excepción técnica).** TI define un script de migración para los usuarios de Ecuador, Chile y Argentina que hoy tienen KYB manual: si el usuario está "Aprobado" a mano, se homologa a `has_billing = true` por base de datos; si está "Pendiente", se inyecta en el flujo nuevo de Sumsub.
- **Regla D · Bloqueo de UI (solo lectura tras aprobar).** Al recibir el webhook de aprobación, los campos de Información de cuenta y Facturación se muestran deshabilitados, sin fecha automática de desbloqueo. Para editarlos, el usuario contacta a soporte; si el campo es sensible, esa edición dispara re-validación (ver [Addendum](#addendum--edición-post-aprobación-historia-fase-5)).
- **Colombia separa proveedores.** Identidad → Truora. Facturación → Sumsub. El resto de países usa un solo Sumsub para ambas.
- **El proveedor nunca se nombra en el copy de usuario.** Truora y Sumsub solo aparecen en notas internas.
- **Regla E · Bloqueado ≠ Rechazado.** Bloqueado es una bandera de riesgo que pone Legal/Financiero directamente en Dropi (fraude, saldo negativo, etc.) — no la pone el proveedor de identidad y no llega por el webhook. Puede coexistir con cualquier estado de C6 (incluso "Aprobado"). Se resuelve a mano, sin ETA fijo, y el usuario lo consulta desde el árbol de soporte, no desde un botón de reintento.

## Mitos a evitar

| Mito | Realidad |
|---|---|
| "Después del slide-up viene el hard gate" | No. El hard gate solo aparece si el usuario intenta sacar dinero — puede no verlo nunca. |
| "Si cierra el slide-up, queda bloqueado" | No. El slide-up es opcional; el único bloqueo real es el hard gate en salidas. |
| "La facturación en Colombia es un formulario de Dropi" | No. Es un enlace a Sumsub o una lista de solo lectura. |
| "Fuera de Colombia también hay Truora y Sumsub por separado" | No. Un solo Sumsub cubre identidad y facturación. |
| "Los pendientes de Ecuador, Chile y Argentina siguen en WhatsApp para siempre" | No. La PRE-ETAPA los migra a Sumsub sin que el usuario haga nada; la próxima vez que entra ve el mismo banner "Estamos confirmando tus datos" del resto de la base, y si Sumsub le pide retomar, continúa en C5 con el botón Continuar — no vuelve a WhatsApp ni repite datos. |

## Notas finales

- Este blueprint documenta el **loop de completar lo que falta** (identidad + facturación), organizado en **4 etapas principales** (PRE-ETAPA, ETAPA 1, ETAPA 2, ETAPA 3) — misma granularidad que Fase 0. No es la "Fase 5 — edición post-validación" de `Historia.md`; ver el [Addendum](#addendum--edición-post-aprobación-historia-fase-5).
- Cada paso ya trae su propia tabla SI → ENTONCES; [`Service_Blueprint_Fase_5_Mapa-Decision.md`](Service_Blueprint_Fase_5_Mapa-Decision.md) es solo la referencia opcional con los diagramas mermaid de cada rama.
- Copy canónico completo (con notas internas): [`UX-Writing-Validacion-TechNative.md`](UX-Writing-Validacion-TechNative.md).
- Árbol del widget de soporte (qué ve el usuario si pregunta en vez de ver un banner): [`Soporte-Validacion-Fase-5.md`](Soporte-Validacion-Fase-5.md).
- **Criterios de aceptación:** un usuario con todo completo no ve el aviso sutil ni el bloqueo estricto · el slide-up se puede cerrar, el bloqueo estricto no · en Colombia la facturación nunca muestra un formulario propio de Dropi · con ambos datos pendientes en Colombia, el botón prioriza identidad · fuera de Colombia un solo enlace resuelve todo · un pendiente migrado de Ecuador/Chile/Argentina ve "en revisión" sin reenviar documentos · una respuesta aprobada del proveedor libera las salidas y un rechazo no borra datos previos válidos.

---

## Addendum — Edición post-aprobación (Historia Fase 5)

> Este addendum es el flujo **hermano**, no el eje de este blueprint. Corresponde a [`Historia.md`](Historia.md) línea 62: *edición post-validación con re-validación inteligente*.

**Cuándo aplica:** usuario ya `aprobado` que quiere **cambiar** datos (no completar lo que le falta).

| Pieza | Regla |
|---|---|
| RN-11 | Dueño: campos sensibles de identidad quedan en solo lectura tras la última validación, sin fecha de desbloqueo automática — editarlos pasa por soporte y dispara re-validación. Responsable Tributario: sin bloqueo, edición directa. |
| Sensibles | Nombre, tipo de persona, tipo/número de documento, documento adjunto → re-validación (mismo ruteo de ETAPA 3 / C5). |
| No sensibles | Dirección, ciudad, correo de facturación → guardado directo + auditoría; costo de validación `0`. |
| Precedencia | Un campo sensible en el lote manda todo el lote a re-validación. |
| Rechazo | Conserva la versión aprobada anterior. |
| UI | Formulario con los valores aprobados; propuesta hasta que el webhook diga `aprobado`. Facturación en Colombia ya aprobada: lista de solo lectura (no un formulario libre). |

No se dibuja como etapas principales del loop de completar lo que falta, para no mezclar "completar por primera vez" con "editar después". Si se necesita un diagrama dedicado, puede derivarse de este addendum sin alterar las 4 etapas.

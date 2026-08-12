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

> 🚧 **Punto abierto de alcance — propuesta de TI (José Giraldo), aún en estimación:** en la reunión de seguimiento (`REUCONTI.md`), TI propuso empezar solo con **KYC (identidad) vía Sumsub para todos los países menos Colombia**, dejando el **KYB (facturación) para una fase posterior** — por seguridad de la información y para no comprometer el alcance del proyecto completo. Esto es distinto de lo que asume hoy este blueprint: que "Resto de países" resuelve identidad y facturación **juntas, en un solo paso** (ver C4/C5 y la tabla "Colombia vs. Resto de países" abajo). José aclaró que es una propuesta sin decisión cerrada, pendiente de una estimación de tiempos que su equipo está construyendo; Producto (Paula/Catalina) espera que TI revise primero los flujos ya levantados con Sumsub antes de definir si se fasea así. Si se adopta el faseo, el flujo unificado de "Resto de países" descrito en este documento pasaría a resolverse en dos entregas en vez de una.

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

| Dimensión | Colombia | Resto de países (incluye Ecuador/Chile/Argentina) |
|---|---|---|
| Proveedores | Dos: Truora (identidad) + Sumsub (facturación), sesiones independientes | Uno: Sumsub — una sola sesión valida identidad y facturación juntas |
| Pasos para completar | Dos pasos separados | Una sola sesión/enlace, pero se refleja en dos páginas de Dropi (ver fila siguiente) |
| Información de cuenta (Configurar → Cuenta) | Formulario propio de Dropi — al guardar, dispara la validación en Truora | Banner + enlace a Sumsub → bloque de texto de solo lectura al completar (nunca formulario) |
| Datos de facturación (Financiero → Facturación Dropi) | Banner + enlace a la ventana de Sumsub (KYB) → bloque de texto de solo lectura al completar — nunca formulario | Banner + enlace a Sumsub (misma sesión que Información de cuenta) → bloque de texto de solo lectura al completar. Chile/Ecuador/Argentina: se convierte desde un formulario manual que existe hoy. Resto (bloque A): módulo nuevo, no existe hoy |
| Mensajes del hard gate (C3) | Hasta 4 variantes: falta identidad / falta solo facturación / faltan ambas / — | Una sola variante: "Valida tus datos para continuar" |
| Resultado al completar | Puede quedar parcial — aprueba un dato y falta el otro (confetti + invitación a completar lo que falta) | Siempre queda completo de una vez (confetti + "¡Cuenta verificada!") — la sesión es una sola, aunque se vea reflejada en dos páginas |
| Bienvenida (C4d) si le faltan ambas | Prioriza identidad (Truora), luego ofrece facturación (Sumsub) | Un solo enlace resuelve ambas — cualquiera de las dos páginas lleva al mismo enlace |

---

## PRE-ETAPA · Preparación — sync con Truora y Sumsub

**Usuarios:** Toda la base, con estados por sincronizar: pendientes, aprobados, incompletos y pendientes manuales de Ecuador, Chile y Argentina.

**Tarea** (secuencia horizontal):
1. ⚫ Inicio
2. 🟣 Sync de estados: el sistema consulta Truora y Sumsub vía API y escribe en Dropi `aprobado` / `incompleto` / `en_revision` / pendiente — en milisegundos, sin descargas manuales ni Google Sheets.
3. 🟣 Migración EC/CL/AR: los casos que hoy se revisan a mano en Ecuador, Chile y Argentina se crean o actualizan como applicant en Sumsub **de inmediato, sin espera artificial**; Dropi los deja en `en_revision` por defecto mientras Sumsub confirma. 🚧 **Punto abierto:** propuesta de TI aún sin validar con Legal — falta definir la experiencia final antes de tomarla como decisión cerrada.
4. 🟢 Flags listos — *(pasa a ETAPA 1)*

**Front stage → Canales:** Ninguno para el usuario. Corre como jobs automáticos de sincronización en el backend de Dropi, conectados directamente a la API de Truora y a la API de Sumsub.

**Front stage → Acciones:** Ninguna acción nueva en el momento de la migración — el usuario no ve nada mientras corre el script. El cambio lo nota la próxima vez que entra a Dropi: en vez de su caso pendiente en revisión manual (WhatsApp / Google Sheet), ve el mismo banner "Estamos confirmando tus datos" que ve cualquier otro usuario en revisión (ver C5/C6) — su proceso ya corre dentro del flujo automático de Sumsub, sin que haya tenido que reenviar nada.

**Back stage → Acciones:**
- 🟣 Los jobs de sincronización (API sync) mantienen `has_identity`, `has_billing`, `country` y `manual_pending` alineados con el proveedor.
- 🟣 El script de migración EC/CL/AR homologa un "Aprobado manual" a `has_billing = true`; inyecta un "Pendiente manual" al flujo de Sumsub.

**Herramientas:** API Truora · API Sumsub · jobs de sync.

**Stakeholders:**
- **TI** — mantiene los jobs de sincronización y el script de migración.
- **Legal** — valida el enfoque de migración inmediata a Sumsub (el punto abierto de arriba).

**SI → ENTONCES (EC/CL/AR pendiente manual):**

| SI | ENTONCES |
|---|---|
| Usuario en revisión manual de Ecuador, Chile o Argentina | 🚧 Se crea o actualiza como applicant en Sumsub de inmediato; Dropi queda en `en_revision` — *propuesta aún sin validar con Legal* |
| Sumsub pide completar el proceso | El usuario retoma en ETAPA 3 (C5) con el botón Continuar |
| Usuario de esos países sin pendiente, con un dato nuevo por completar | Un solo enlace corto de Sumsub (identidad + facturación) |

> ⏱️ **No hay espera de 72h.** El estado se refleja automáticamente vía webhook, típicamente en segundos — no en 72h como planteaba una versión anterior de este blueprint (idea sin fuente real: no aparece en `REUCONTI.md`, que solo usa "24 horas" como salvedad ante posibles retrasos de sincronización, nunca como tiempo de revisión). El único "en proceso" real es mientras el usuario está dentro del enlace de Sumsub completando su parte. En casos raros de desfase de sincronización — ya observado hoy, no hipotético: `Discovery-Riesgos-Transicion-Fase5.md` documenta a Ecuador con la wallet bloqueada tras aprobar por retraso de sync, y a Colombia con 3.369 casos en desfase sobre 12.402 procesos de Truora (BAC-001/BAC-002) — puede tardar hasta 24h en reflejarse. No es el diseño esperado, es el mismo riesgo de sync ya conocido, no una espera planeada.

> 🚧 **Nota fuera de alcance — Guatemala/Panamá:** en la reunión de seguimiento (`REUCONTI.md`), Jonathan y Catalina mencionaron usuarios de Guatemala y Panamá validados en un flujo paralelo (Truora **y** Sumsub) por una gestión puntual — resolver una crisis de un país "café" —, que también necesitarían migrar/actualizar su estado. Sin embargo, `Historia.md` marca explícitamente el **"flujo nativo para Guatemala/Panamá" como no-objetivo de la v1** (solo aplica el parche actual con Coloca Payments, que es un proceso distinto de validación de cuentas bancarias, no de identidad/facturación). Por eso esta migración **no se resuelve en este loop** — se deja aquí solo como referencia, por si Legal/Producto decide traerla a alcance más adelante.

---

## ETAPA 1 · Segmentación y Estado API — ¿qué le falta?

**Usuarios:** Dropshipper, Proveedor o Marca Blanca, con o sin identidad y con o sin facturación aprobadas, según su país.

> **Combinaciones posibles según país:** en Colombia, Chile, Ecuador y (próximamente) Argentina, el patrón normal es: nada completo, solo identidad completa, o ambas completas — identidad va antes que facturación. **Solo en Colombia**, por una configuración existente, se puede dar el caso raro inverso: facturación aprobada sin que la identidad lo esté. Es una excepción conocida, no un patrón a diseñar activamente — el flujo ya la cubre (mensaje de aprobación parcial "¡Datos de facturación listos!" en C6). Ver la Matriz A al final del documento.

**En una frase:** Antes de iniciar cualquier acción, el sistema decide en milisegundos consultando vía API las bases de datos de Truora y Sumsub — sin descargas manuales ni Google Sheets. Si ya tiene identidad y facturación completas, no pasa nada. Si le falta algo, determinamos su canal de entrada.

**Tarea** (secuencia horizontal):
1. 🟡 **[Decisión]** ¿Tiene identidad y facturación aprobadas?
2. 🟢 Si ambas están OK → no pasa nada: sigue operando normal, sin ver el aviso sutil (soft touch), el bloqueo estricto (hard gate) ni ningún modal.
3. 🟣 Si falta alguna → queda elegible y espera a que el usuario elija un canal en ETAPA 2 (C2, C3 o C4).
4. 🚧 *(Punto abierto)* Si ya está validado en otro país → el motor de segmentación podría reconocerlo y pedirle solo lo específico que le falte en el país nuevo, en vez de todo el proceso.

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
| 🚧 Ya validado en otro país (mismo correo/nombre), con un dato puntual nuevo por país (ej. facturación en México) | Elegible, pero potencialmente sin repetir todo el proceso | *Punto abierto — ver nota abajo* |

> 🚧 **Punto abierto — reconocimiento cross-country:** en la reunión de seguimiento (`REUCONTI.md`), Catalina planteó que, si Dropi tuviera su propia base de datos de estados de validación, se podría reconocer a un usuario ya validado en un país (por correo/nombre) y pedirle solo lo puntual que le falte en el país nuevo — por ejemplo, solo datos de facturación en México si ya validó identidad en Colombia — sin repetir el proceso completo. Es una propuesta, aún sin validar con TI/Legal, y se relaciona con el habilitador "Motor de ruteo por nacionalidad" (`Historia.md`, HU-00): ese motor rutea KYC/KYB por país de nacionalidad/constitución, pero no está definido si también evita re-pedir datos ya validados en otro país. Este blueprint no asume todavía este comportamiento — cada país sigue pidiendo su propio flujo completo (ver ETAPA 2/3).
>
> **Copy de ejemplo si se decide implementar** (punto 8a de [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#8--especificaciones-del-proceso-cross-country)): *"Ya validamos tu identidad en {país_origen}. Solo necesitas completar {dato_puntual} para operar en {país_nuevo}."* — no reemplaza la decisión de negocio, solo deja el copy listo para cuando se resuelva.

---

## ETAPA 2 · Canales de entrada (Rutas Paralelas, el usuario elige UNO)

**En una frase:** la intervención se adapta a la antigüedad y la acción del usuario: los nuevos no ven nada todavía (para no confundirlos ni generar deserción), los activos ven la bienvenida/alerta, los antiguos ven el aviso sutil. El bloqueo estricto (hard gate) solo aparece al intentar un movimiento financiero, sin importar la antigüedad — los otros dos canales se pueden ignorar o posponer.

**SI → ENTONCES (Canal):**

| SI el usuario… | Antigüedad / estado | Canal | ¿Bloqueante? |
|---|---|---|---|
| Es nuevo y recién hace su 1ª orden o 1er movimiento de wallet | Nuevo, sin iniciar validaciones | **Nada** — no ve ningún aviso de identidad/facturación todavía | No aplica |
| Ya es "activo" (20 órdenes — valor de trabajo confirmado) y le falta algo | Activo | **C4d** Bienvenida/alerta, en un modal de Home | No — puede posponer |
| Navega en Home / Dashboard | Antiguo, le falta alguna validación | **C2** Soft touch | No — puede cerrar la X |
| Hace clic en Retirar / Transferir / DropiCard | Nuevo o antiguo, con datos incompletos | **C3** Hard gate (bloqueo estricto) | Nuevo: sí, obligatorio, sin excepción. Activo: sí, salvo el periodo de gracia tentativo de la Regla G |
| Abre Información de cuenta o Datos de facturación | Nuevo o antiguo, con datos incompletos | **C4** Módulo | Según su estado |

> **Importante:** los tres pasos siguientes (C2, C3, C4) son **alternativas dentro de esta misma etapa, no una secuencia**. El usuario entra por uno solo según lo que haga — nunca pasa de "C2 a C3 a C4" en fila. Ver [Mitos a evitar](#mitos-a-evitar).

> ✅ **Regla definida — cuándo empieza a ver algo un usuario nuevo:** en la reunión de seguimiento (`REUCONTI.md`), Catalina fue explícita en que a un usuario **nuevo no se le debe mostrar nada** de identidad/facturación desde su primera venta — mostrarlo ahí puede confundirlo y generar deserción. La regla diferencia entre "nuevo" y **"activo"**: un usuario se considera activo cuando alcanza **20 órdenes** (valor de trabajo confirmado, `REUCONTI.md`) y solo entonces recibe la alerta de C4d, vía un modal en Home. Esto reemplaza el disparador anterior de este blueprint ("1ª orden o 1er movimiento de wallet"), que no reflejaba esta regla. También se relaciona con la *Regla del Despliegue por Lotes* y la *Regla del Periodo Pedagógico* de [`Reglasvalidacion.md`](Reglasvalidacion.md) — ver Regla F más abajo.
>
> El número exacto puede refinarse más adelante con Producto, pero **ya no bloquea el diseño ni la construcción**: la bifurcación Nuevo/Activo es la que gobierna la experiencia, y el umbral es un parámetro ajustable dentro de ella.

**Recordatorio si no completa:** si el usuario cierra el aviso sutil (C2) o pospone la bienvenida/alerta de activo (C4d) y el dato le sigue faltando, un job de recordatorio le reenvía el mismo aviso — mismo canal in-app, o correo/WhatsApp si tiene ese canal configurado. El bloqueo estricto (C3) no lleva recordatorio: ya es obligatorio en el momento en que aparece.

> 🚧 **Cadencia escalonada por volumen de órdenes (valores de ejemplo, a confirmar con Producto) — punto 2 de [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#2--recordatorio-tras-umbral-de-cantidad-de-órdenes):**
>
> | Nivel | Disparador | Tono / canal |
> |---|---|---|
> | 1 (ya existe) | Una sola vez, unos días después de cerrar C2/C4d | Mismo tono suave, mismo canal in-app |
> | 2 (nuevo) | Si acumula +N órdenes adicionales sin resolver el dato (N a definir con Producto, ej. +30) | Recordatorio más notorio, mismo canal + correo/WhatsApp si está configurado |
>
> Conecta con el riesgo de negocio ya documentado en `Discovery-Riesgos-Transicion-Fase5.md` §1.3 (proveedores Top 5 con 200K-530K órdenes lifetime que nunca disparan el hard gate porque no retiran dinero). Nunca se salta la Regla F (Despliegue por Lotes / Periodo Pedagógico) — el recordatorio nunca se convierte en bloqueo sin el aviso previo de 1-2 semanas.

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

6. 🔵 Micro-copy de tratamiento de datos (todas las variantes de arriba, línea adicional bajo el body): *Esto hace parte del tratamiento de tus datos personales, según nuestros Términos y Condiciones.* Sin enlace — la aceptación explícita de Términos ya ocurre dentro del flujo del proveedor (Truora/Sumsub), no se repite aquí. *(Especificado en [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#3--comunicar-la-importancia-compliancetyc-sin-repetir-el-enlace) punto 3.)*

**Back stage → Acciones:**
- 🔴 El hard gate (motor de bloqueo, expuesto como hard gate API) solo se aplica a retiros, transferencias y DropiCard. Órdenes, ventas y entradas de dinero siguen libres (`Reglasvalidacion.md`).
- 🔴 El hard gate API resuelve qué modal mostrar según lo que le falte y su país (ver ETAPA 3).

**Herramientas:** Frontend Dropi (Angular) · hard gate API.

**Stakeholders:**
- **Product Designer + Financiero** — regla de qué acciones bloquean.
- **TI** — mantiene el hard gate API.

### C4 · Módulo — el usuario abre cuenta, facturación o hace su primera venta

**Usuarios:** Usuario con algo pendiente que abre `Información de cuenta` o `Datos de facturación`, o que ya es "activo" (20 órdenes — valor de trabajo confirmado, `REUCONTI.md`) y le falta algo.

**Tarea** (secuencia horizontal):
1. 🟢 Usuario abre un módulo, o ya es "activo" y le falta algo
2. 🟣 Información de cuenta y Datos de facturación son siempre dos páginas separadas; en Colombia se completan con dos sesiones independientes (Truora + Sumsub), en el resto de países con una sola sesión de Sumsub que resuelve ambas
3. 🟢 Al completar, sale a ETAPA 3 (C5)

**Front stage → Canales:**
1. 🔵 Página nativa `Mi cuenta` / `Datos de facturación`, servida por el frontend de Dropi (Angular) y la API de perfil y facturación.
2. 🔵 Modal de bienvenida/alerta en Home, cuando el usuario cruza el umbral de "activo", mismo frontend.

**Front stage → Acciones:**

0. 🔵 Indicador de pasos (solo Colombia, en Información de cuenta y Datos de facturación): **"Paso 1 de 2 · Identidad"** / **"Paso 2 de 2 · Facturación"**, reutilizando el componente DS `dropi-steps` (`ds-registry/components/dropi-steps.json`, estados `pending | focus | completed | error`). Hace visible al usuario colombiano que su validación tiene dos pasos separados — hoy solo se infiere navegando. No aplica fuera de Colombia (un solo enlace resuelve ambas). *(Especificado en [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#5--niveles-de-verificación-visibles-para-colombia-identidad--facturación) punto 5.)*

1. 🔵 Bienvenida/alerta — 🔒 **Exclusivo de usuarios ACTIVOS (20+ órdenes, valor de trabajo confirmado). Un usuario nuevo nunca ve esto.** Headline: **Completa tu validación de datos**. Body: *Ya registraste ventas en Dropi. Para retirar o usar tu dinero, completa tu validación de datos. Es por tu seguridad y la de la plataforma.* Botones: **Completar validación** / **Ahora no**. *(✅ Copy resuelto: el headline anterior, "¡Tu primera venta en Dropi!", se escribió pensando en la primera venta y contradecía el disparador real de "activo" — ya corregido. Copy 🆕 propuesto, a validar con Product/Growth.)*
2. 🔵 Colombia · Información de cuenta — Headline: **Completa tu información de cuenta**. Body: *Con estos datos confirmamos quién eres. Al guardar, empezamos la validación con una prueba de vida.* Campos: tipo de persona · nombre completo · tipo de documento · número de documento · documento adjunto. Botón: **Guardar y continuar**.
   - Incompleto → formulario editable con esos campos; al guardar, se abre un **enlace aparte** (fuera de Dropi) donde el proveedor toma la prueba de vida — el usuario la completa en su propio tiempo, no es parte del formulario de Dropi.
   - **Esta alerta aparece siempre que falte el dato — nuevo o activo, sin excepción.** Solo cambia el copy de refuerzo bajo el body (🆕 propuesto, a validar con Product/UX Writing): usuario nuevo → *"Estás empezando en Dropi. Por tu seguridad y para cumplir con la normativa, valida estos datos antes de mover dinero."* Usuario activo → *"Ya registraste ventas en Dropi. Para retirar tu saldo o mover dinero, necesitas completar estos datos."* A diferencia del aviso del Home (C4d, solo activos), esta alerta dentro del módulo no depende de la antigüedad — solo el copy varía.
   - **En proceso** (al volver a Dropi, mientras se confirma) → los campos quedan visibles pero deshabilitados. **Formato: banner fijo dentro de la página, no modal** — no bloquea el resto de la navegación. Headline: **Estamos confirmando tus datos**. Body: *Mientras tanto, puedes seguir usando Dropi pero hemos pausado temporalmente tus retiros y transferencias.* (Nota interna: este banner reutiliza el mismo flujo de confirmación de Truora que ya está en producción — no es un banner nuevo.)
   - Completo → mismos campos, visibles pero de solo lectura. Sin fecha de desbloqueo automática — para editarlos, el usuario contacta a soporte: nombre, tipo de persona, tipo/número de documento y documento adjunto activan el flujo de re-validación (ver [Addendum](#addendum--edición-post-aprobación-historia-fase-5)); dirección y ciudad se guardan directo.
3. 🔵 Colombia · Datos de facturación:
   - Vacío → Headline: **Completa tus datos de facturación**. Body: *Por seguridad y para desbloquear movimientos financieros, valida tus datos de facturación. No es un formulario aquí: te llevamos al proceso seguro.* Botón: **Completar datos de facturación** (sin formulario KYB nativo en Dropi — *nota: Sumsub ya corre el proceso completo de KYB, documento + verificación; construir un formulario propio en Dropi duplicaría ese trabajo*). Igual que en Información de cuenta, esta alerta aparece siempre (nuevo o activo) con el mismo copy de refuerzo diferenciado por tenencia (🆕 propuesto, ver arriba).
   - **En proceso** (al volver de Sumsub, mientras se confirma) → la tarjeta reemplaza el botón por una etiqueta de estado. **Formato: banner fijo dentro de la tarjeta, no modal**. Headline: **Estamos confirmando tus datos**. Body: *Mientras tanto, puedes seguir usando Dropi pero hemos pausado temporalmente tus retiros y transferencias.*
   - Completo → Headline: **Tus datos de facturación**. Campos mostrados (solo lectura): razón social · NIT · RUT · cámara de comercio · representante legal · correo de facturación. Aviso de solo lectura + acceso a soporte. Excepción: el correo de facturación se puede editar en cualquier momento, sin disparar una nueva validación.
   - Si al llegar aquí la facturación ya estaba aprobada (por ejemplo, el usuario la completó por su cuenta mientras la identidad seguía en proceso), no se le vuelve a pedir — pasa directo al resultado final "¡Cuenta verificada!" (ver C6).
4. 🔵 **Resto de países — dos páginas, una sola sesión.** Corrección frente a versiones anteriores de este blueprint: no es "un módulo único" — como en Colombia, **Información de cuenta** (Configurar → Cuenta) y **Datos de facturación** (Financiero → Facturación Dropi) son dos páginas de Dropi siempre separadas (confirmado en `src/app/config/sidebar-new-nav.config.ts`), cada una con su propio estado vacío/en proceso/completo. La diferencia con Colombia es que aquí **una sola sesión de Sumsub** resuelve ambas páginas a la vez — el usuario entra por cualquiera de las dos y termina completando las dos.
   - **Chile / Ecuador / Argentina (bloque B):** ambas páginas **se convierten** desde el formulario manual que ya existe hoy para estos tres países (`REUCONTI.md` líneas 88-90, 156-163) — dejan de ser formulario y pasan al mismo patrón banner+enlace → texto de solo lectura.
   - **Resto de países / bloque A (GT, PA, PY, PE, MX, VE, CR, Europa):** ambas páginas son **módulo nuevo** — Datos de facturación no existe hoy para estos países, se agrega de cero con el mismo patrón.
   - **Vacío (ambas páginas):** Headline: **Valida tu identidad y tus datos de facturación**. Body: *Un formulario guiado te pide lo que necesitamos, según tu país. No tienes que volver después — todo queda listo de una vez.* Botón: **Completar validación** — lleva al mismo enlace de Sumsub sin importar desde cuál de las dos páginas se entró. **Esta alerta aparece siempre que falte el dato — nuevo o activo, igual que en Colombia.** Copy de refuerzo bajo el body (🆕 propuesto): usuario nuevo → *"Estás empezando en Dropi. Por tu seguridad y para cumplir con la normativa, valida estos datos antes de mover dinero."* Usuario activo → *"Ya registraste ventas en Dropi. Para retirar tu saldo o mover dinero, necesitas completar estos datos."*
   - El formulario vive dentro de Sumsub (no es una pantalla de Dropi): bloque A pide documento + prueba de vida + datos fiscales, y si declara empresa, autocompleta al buscarla por nombre; bloque B pide documento + prueba de vida, y si declara empresa, el documento de la empresa sin autocompletar.
   - **En proceso (ambas páginas):** mismo banner fijo "Estamos confirmando tus datos" que Colombia (ver C5).
   - **Completo — cada página muestra solo su propio bloque, no las dos juntas:**
     - **Información de cuenta** → Headline: **Tu información de cuenta**. Bloque de texto de solo lectura: documento de identidad, estado de la prueba de vida (nunca se muestra el archivo, solo el estado).
     - **Datos de facturación** → Headline: **Tus datos de facturación**. Bloque de texto de solo lectura: nombre/razón social fiscal, documento de empresa (bloque B) o dato autocompletado al buscarla por nombre (bloque A).
   - 🚧 Reconciliación parcial (a confirmar con TI): si Sumsub confirma un bloque antes que el otro, cada página refleja el estado de su propio bloque de forma independiente — la página ya confirmada pasa a solo lectura mientras la otra sigue mostrando "en proceso". El modelo de dos páginas resuelve esto de forma más natural que una sola pantalla combinada. *(Punto 6 de [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#6--definir-mejor-la-recapitulación-de-datos-cuando-la-validación-se-unifica).)*

> Campos y copy completos, con la nota de qué es hecho confirmado (`Historia.md`, Fase 0) vs. copy nuevo por validar: [`UX-Writing-Validacion-TechNative.md`](UX-Writing-Validacion-TechNative.md) §5, §6, §7, §10, §11. Nota: ese documento y `Especificaciones-UX-Mejoras-Fase5.md` todavía describen "un solo módulo fuera de Colombia" — esta sección lo corrige a partir de `sidebar-new-nav.config.ts` y `REUCONTI.md`; esos otros docs quedan pendientes de reconciliar, fuera del alcance de este blueprint.
>
> 🚧 **Punto abierto de alcance:** esta "una sola sesión" para Resto de países asume que identidad y facturación se resuelven juntas desde el día 1. TI propuso en la reunión de seguimiento fasear esto (KYC primero, KYB después) — ver la nota al inicio del documento, en [Qué cambia frente a Fase 0](#qué-cambia-frente-a-fase-0).

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

**Front stage → Acciones:** el aviso "en proceso" cambia según qué se esté confirmando — nunca dice "tu solicitud" genérico, y el proveedor nunca se nombra. **Formato: banner fijo dentro de la página donde vive la acción (Información de cuenta o Datos de facturación — mismo patrón en Colombia y en el resto de países), no modal ni banner flotante aparte:**

> ⏱️ **Nota de timing:** para el camino automático (>92% de los casos, `Historia.md`), este banner es una transición de segundos, no una pantalla de espera — el resultado (C6) llega casi de inmediato, sin que el usuario tenga que esperar. El SLA de hasta 24h que aparece más abajo (C6, "En revisión prolongada") aplica **solo** a la cola de excepciones (≤8%) que sí requiere revisión manual. No exponer al camino mayoritario a lenguaje de espera que no le corresponde. *(Especificado en [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#c--resultado-inmediato--sin-pantalla-de-espera-al-validarse), Comentario C.)*
>
> 👁️ **Mientras el WebSDK/enlace del proveedor está abierto** (antes de volver a Dropi) — punto 4 de [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#4--cómo-se-ve-dropi-mientras-corre-la-validación-de-truora):
> - Indicador persistente (no el banner pasivo actual) para que el usuario no sienta que "salió" de Dropi sin dejar rastro. 🚧 Formato visual exacto a definir con TI/Product Design.
> - Checklist corto de tips antes de abrir el enlace, visible (no texto que se pueda saltar sin leer): *"Activa el GPS de tu celular"* · *"Apaga cualquier VPN activa"* · *"Vuelve a Dropi al terminar"* — tomados del flujo de Truora ya en producción (`2.1 Indicaciones`, Figma "Cuenta V2.0.0"), donde hoy son texto pasivo sin confirmación.
> - Aviso automático por inactividad: si pasan **10 minutos sin que el usuario interactúe** con el formulario, aparece un aviso in-app con el headline *"¿Sigues ahí?"* y un único botón *"Reanudar validación"* — mismo patrón de un-solo-botón de Truora (`2.3 Proceso abandonado`, Figma "Cuenta V2.0.0"). La mejora frente a Truora: al reanudar, el usuario **queda exactamente donde estaba y no pierde lo que ya tecleó** — es la misma promesa que Fase 5 ya hacía para el resume manual (`UX-Writing` §9c), ahora aplicada también al **disparo automático**. Nota (no se muestra): hasta esta iteración Fase 5 solo tenía el resume **manual** — el botón "Continuar validación" del estado Incompleto (C6) —, nunca un disparo por inactividad; el copy de pantalla nunca nombra al proveedor.
1. 🔵 Colombia · falta identidad — vive en Información de cuenta (ver C4). Headline: **Estamos confirmando tus datos**. Body: *Mientras tanto, puedes seguir usando Dropi pero hemos pausado temporalmente tus retiros y transferencias.* (Nota interna: mismo flujo de confirmación de Truora que ya está en producción, no es un banner nuevo.)
2. 🔵 Colombia · falta facturación — vive en Datos de facturación (ver C4). Mismo headline y body que arriba.
3. 🔵 Colombia · faltan ambas — Muestra primero el aviso de identidad; al aprobarse, pasa al de facturación en su propia página. Nunca se muestran los dos avisos a la vez.
4. 🔵 Resto de países (bloques A/B) — vive en Información de cuenta **y** en Datos de facturación (ver C4) — misma sesión, dos páginas. Headline: **Estamos confirmando tus datos**. Mismo body que arriba (identidad y facturación se validan juntas, sin separarlas).
5. 🔵 Ecuador/Chile/Argentina migrado — mismas dos páginas (Información de cuenta y Datos de facturación). Headline: **Estamos confirmando tus datos**. Body: *Tu caso ya sigue este mismo proceso automático — no necesitas reenviar nada.*

El ruteo real (a qué proveedor va cada caso) es interno — ver tabla abajo. Copy completo: [`UX-Writing-Validacion-TechNative.md`](UX-Writing-Validacion-TechNative.md) §5b, §7, §11.

**Back stage → Acciones:** el router de país (backend de Dropi) decide a qué proveedor enviarlo según su país y lo que le falte, y confirma la respuesta con una firma digital ("webhook").

**SI → ENTONCES (a dónde lo manda, según el país y lo que le falte):**

| SI (condición del usuario) | Proveedor que lo valida | Lo que pasa (destino) |
|---|---|---|
| Colombia + falta identidad | Truora (validación de identidad) | Va a Información de cuenta → llena el formulario de Dropi → sigue el proceso en Truora |
| Colombia + falta facturación | Sumsub (validación de facturación) | Sin formulario en Dropi — enlace directo a la ventana de Sumsub para validar la empresa (KYB) |
| Colombia + faltan ambas | Primero Truora, luego Sumsub | Prioriza identidad; al aprobarse, le ofrece completar también la facturación |
| Otros países, persona natural — bloque A (GT, PA, PY, PE, MX, VE, CR, Europa) | Sumsub (identidad y facturación juntas) | Información de cuenta + Datos de facturación (módulo nuevo, no existe hoy), una sola sesión. Si además declara empresa, Sumsub la busca por nombre y autocompleta el dato fiscal. |
| Otros países, persona natural — bloque B (CL, EC, AR) | Sumsub (identidad y facturación juntas) | Información de cuenta + Datos de facturación (se convierte desde el formulario manual que existe hoy), una sola sesión. Si además declara empresa, pide el documento de la empresa sin autocompletar. |
| Marca Blanca, cualquier país | Sumsub, mismo ruteo por bloque que le corresponda | Mismo flujo automático de arriba, con la interfaz sin marca Dropi. |
| Usuario extranjero (documento distinto al del país donde opera) | Sumsub | Acepta pasaporte o el documento oficial de su país de origen — el sistema reconoce el formato solo. |
| Factura a nombre de un tercero | Sumsub ("continuar en el teléfono") | Genera un enlace para el celular; el usuario se lo reenvía al tercero, que solo completa la prueba de vida — sin repetir los datos que ya cargó el titular. |
| 🚧 Excepción Ecuador/Chile/Argentina (pendiente manual) — punto abierto, ver PRE-ETAPA | Sumsub (ya migrado, propuesta sin validar con Legal) | Ya migrado a Sumsub en la PRE-ETAPA; si Sumsub pide retomar, continúa aquí |

Todos los mensajes de las filas "Otros países" llevan a la misma sesión única de Sumsub, reflejada en las dos páginas (Información de cuenta y Datos de facturación) — la diferencia entre bloque A y B es solo si el formulario autocompleta o no el dato de la empresa.

> 🚧 **Punto abierto de alcance:** las filas "Otros países" de esta tabla asumen KYC + KYB en una sola sesión desde el día 1. TI propuso fasear esto (KYC primero para todos los países menos Colombia, KYB después) — ver [Qué cambia frente a Fase 0](#qué-cambia-frente-a-fase-0), aún sin decisión cerrada.

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

**Aprobado — cierra el loop (toast, sin acción requerida, llega en segundos para el camino automático):**
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

> ✅ **Catálogo de causas puntuales (construido en el prototipo) — desglosa "Incompleto" en vez de un mensaje único, punto 1 de [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#1--error-granular--comunicar-específicamente-qué-le-falta-al-usuario):**
>
> | Causa | ¿Requiere acción del usuario? | Copy adicional bajo el body |
> |---|---|---|
> | Documento sin cargar | Sí | "Aún no subiste tu documento." |
> | Documento ilegible / foto borrosa | Sí | "No pudimos leer bien tu documento — vuelve a intentarlo." |
> | Prueba de vida no completada | Sí | "Te falta completar la verificación con tu cámara." |
> | Dato no coincide con el documento | Sí — reusa el patrón de Truora `2.6`/`2.7`: *"Revisa los datos y vuelve a intentarlo en 10 minutos. Te quedan N intentos."* (corregir el bug de plural que hoy tiene Truora: "1 intento", no "1 intentos") con un **temporizador visible** durante el cooldown, no solo texto — **implementado en el prototipo** (`identity-sumsub-modal`: 3 intentos, cooldown de 10 minutos con temporizador mm:ss visible y botón "Reintentar verificación" deshabilitado mientras corre) | — |
> | Revisión de riesgo en curso, sin acción posible del usuario | No | Este caso no es "Incompleto" — converge con el estado "En revisión" de abajo, para no duplicar la misma espera bajo dos nombres distintos |

**En revisión prolongada — mismo aviso que ya venía viendo, ahora en modo persistente (banner, exclusivo de la cola de excepciones, ≤8% de los casos — el >92% restante nunca ve este estado porque su resultado llega en segundos):**

| Caso *(no se muestra)* | Headline *(texto literal)* |
|---|---|
| ⚪ Colombia · identidad | **"Seguimos confirmando tu identidad"** |
| ⚪ Colombia · facturación | **"Seguimos confirmando tus datos de facturación"** |
| ⚪ Resto de países | **"Seguimos confirmando tus datos"** |
| ⚪ Ecuador/Chile/Argentina migrado | **"Seguimos confirmando tus datos"** |

Nota (no se muestra): en el caso EC/CL/AR migrado, es porque su caso ya sigue este mismo proceso automático. Mismo cuerpo en las 4, texto literal: *"Pasó a revisión manual — nuestro equipo lo está mirando. No debería tardar más de 24 horas en total. Mientras tanto, sigue comprando y vendiendo sin problema — no necesitas reenviar nada."* Botón: **Entendido**.

**Bloqueado — bandera de riesgo, no depende de identidad ni facturación (banner, sin reintento). Dos variantes según su naturaleza — ver [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#7--bloqueado-no-distingue-decisión-instantánea-de-investigación-en-curso) punto 7:**

| Caso *(no se muestra)* | Headline *(texto literal)* |
|---|---|
| 🟥 En investigación (reversible, sin ETA) | **"Tu cuenta está bloqueada por seguridad"** |
| 🟥 Definitivo (irreversible) | **"Tu cuenta fue suspendida de forma definitiva"** |

**En investigación** — Texto literal (body): *"Nuestro equipo la está revisando para proteger tus fondos. No podrás hacer retiros, transferencias ni pedir DropiCard mientras dure la revisión."* Nota (no se muestra): sin botón de reintento — dirige al [árbol de soporte](Soporte-Validacion-Fase-5.md) (chip "Validación de identidad" → "Mi cuenta está bloqueada").

**Definitivo** — Texto literal (body): *"Tras revisar tu caso, no puedes seguir operando en Dropi. Esta decisión no tiene reversión."* Nota (no se muestra): a diferencia del estado equivalente ya en producción para Truora (`2.5 Validación rechazada por Truora` en Figma), que hoy expulsa al usuario de la app con un countdown no cancelable dejando el soporte inalcanzable después, este estado **no debe cerrar la sesión del usuario sin dejarle un canal de soporte accesible** — 🚧 el mecanismo exacto (mantener sesión de solo lectura vs. canal de soporte fuera de sesión) queda pendiente de decisión Legal/SAC, no resuelto por este blueprint.

> 🚧 **Punto abierto — propagación cross-country (punto 8b de [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#8--especificaciones-del-proceso-cross-country)):** si se decide banear a un usuario por riesgo, ¿aplica automáticamente en los demás países donde opera con el mismo correo/documento? Grounding: cita de Catalina en `REUCONTI.md` 213-220 sobre baneo cross-country. Si se activa, el body de "Definitivo" pasaría a: *"Tras revisar tu caso, no puedes seguir operando en Dropi en ninguno de los países donde tienes cuenta. Esta decisión no tiene reversión."* — **sin activar todavía**, queda como copy de reserva hasta que Legal/TI decidan.

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
| Bloqueado por Legal/Financiero — en investigación (no por el proveedor) | Banner: "Tu cuenta está bloqueada por seguridad" | Sin fecha fija — depende de que Legal/Financiero resuelvan el caso a mano; ver árbol de soporte |
| Bloqueado por Legal/Financiero — definitivo (no por el proveedor) | Banner: "Tu cuenta fue suspendida de forma definitiva" | Sin reversión; canal de soporte post-suspensión 🚧 pendiente de decisión Legal/SAC |

---

## Reglas transversales

- **Regla A · Hard gate solo en salidas.** Retiros, transferencias y DropiCard. Órdenes, ventas y entradas de dinero nunca lo disparan.
- **Regla B · Webhook directo.** Sin Google Sheets en el camino feliz. Un solo evento actualiza identidad y facturación.
- **Regla C · Consolidación de EC/CL/AR (excepción técnica).** TI define un script de migración para los usuarios de Ecuador, Chile y Argentina que hoy tienen KYB manual: si el usuario está "Aprobado" a mano, se homologa a `has_billing = true` por base de datos; si está "Pendiente", se inyecta en el flujo nuevo de Sumsub.
- **Regla D · Bloqueo de UI (solo lectura tras aprobar).** Al recibir el webhook de aprobación, los campos de Información de cuenta y Facturación se muestran deshabilitados, sin fecha automática de desbloqueo. Para editarlos, el usuario contacta a soporte; si el campo es sensible, esa edición dispara re-validación (ver [Addendum](#addendum--edición-post-aprobación-historia-fase-5)).
  - 🚧 **Sobre la duración — no es un bloqueo de 6 meses (todavía).** `RN-11` (`Historia.md`) especifica una duración de 6 meses para este candado. Este blueprint deliberadamente **no fija esa cifra** — por ahora es un bloqueo sin fecha automática de desbloqueo, y punto. 6 meses queda como duración **tentativa, sin decisión cerrada**; si se confirma, se documenta aquí explícitamente en vez de asumirla. Nota: `UX-Writing-Validacion-TechNative.md` (§6, §10) sí escribe "6 meses" en el copy literal hoy — es una inconsistencia entre docs a reconciliar más adelante, fuera del alcance de este blueprint.
- **Colombia separa proveedores.** Identidad → Truora. Facturación → Sumsub. El resto de países usa un solo Sumsub para ambas.
- **El proveedor nunca se nombra en el copy de usuario.** Truora y Sumsub solo aparecen en notas internas.
- **Regla E · Bloqueado ≠ Rechazado.** Bloqueado es una bandera de riesgo que pone Legal/Financiero directamente en Dropi (fraude, saldo negativo, etc.) — no la pone el proveedor de identidad y no llega por el webhook. Puede coexistir con cualquier estado de C6 (incluso "Aprobado"). Se resuelve a mano, sin ETA fijo, y el usuario lo consulta desde el árbol de soporte, no desde un botón de reintento.
  - 🚧 **Regla E.1 · Bloqueado tiene dos naturalezas distintas, hoy indistinguibles para el usuario.** "Bloqueado" cubre tanto una investigación reversible como lo que en la práctica es un baneo definitivo (confirmado por Catalina en `REUCONTI.md` 213-220 y ya implementado hoy para Truora — ver el estado `2.5` en el Figma de producción, que expulsa al usuario de la app sin dejar canal de soporte alcanzable después). Ver [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#7--bloqueado-no-distingue-decisión-instantánea-de-investigación-en-curso) para el copy de las dos variantes propuestas en C6. El mecanismo de contacto a soporte para el caso definitivo queda 🚧 pendiente de decisión Legal/SAC — dos opciones a evaluar (Comentario A de [`Especificaciones-UX-Mejoras-Fase5.md`](Especificaciones-UX-Mejoras-Fase5.md#a--la-duda-del-baneo--cómo-contacta-a-soporte-un-usuario-bloqueadoexpulsado)):
    1. **No expulsar al usuario del todo** — dejarlo en una pantalla de solo lectura con el [árbol de soporte](Soporte-Validacion-Fase-5.md) accesible, en vez de redirigirlo fuera de la app (a diferencia del patrón actual de Truora).
    2. **Canal de soporte fuera de la sesión autenticada** (correo o WhatsApp visible incluso en una pantalla de "cuenta suspendida"), para el caso en que sí se decida cerrar la sesión.
  - 🚧 **Nota de referencia cruzada (pertenece a Fase 1 — Bloqueo cruzado, `Historia.md`):** en la reunión de seguimiento (`REUCONTI.md`), Catalina propuso que un `Rechazado` de C6 se cruce contra la base de saldos negativos de cartera (script de Python de Andrés Herrera con TI) y contra el historial de órdenes del usuario, para decidir si aplica un baneo — potencialmente **cross-country**, ya que hoy cada país tiene su propia base y un usuario baneado en uno puede seguir operando en otro con el mismo correo. Este cruce y el baneo consolidado son el objeto de **Fase 1 — Bloqueo cruzado de usuarios baneados** de `Historia.md` (RN-17, habilitador "Modelo de datos del registro consolidado de baneados"), **no** del loop de completar lo que falta que documenta este blueprint. Se deja aquí solo como referencia para no perder el hilo entre ambas fases.
- **Regla F · Despliegue por lotes y periodo pedagógico (rollout, no día 1).** El hard gate y sus alertas nunca se activan de golpe para toda la base — se despliegan progresivamente por cohortes según volumen de órdenes, y antes de bloquear a un usuario existente debe haber 1-2 **semanas** de avisos preventivos (`Reglasvalidacion.md`, "Regla del Despliegue por Lotes" y "Regla del Periodo Pedagógico"). Esto es sobre el **lanzamiento** del hard gate (cómo se activa por primera vez para toda la base) — distinto de la Regla G de abajo, que es sobre el **estado estable** una vez ya está activo. Ver también el umbral de "activo" en [Etapa 2](#etapa-2--canales-de-entrada-rutas-paralelas-el-usuario-elige-uno).
- **Regla G · Periodo de gracia para usuarios activos.** Fuente directa: en la reunión de seguimiento (`REUCONTI.md` líneas 133-137), Catalina señaló que hoy en Colombia la alerta y la restricción de movimientos financieros por datos de facturación **no están activas**, y que hace falta "dejar como un lapso" antes de bloquear — mostrando igual la alerta, sin bloquear todavía. Esta regla lo formaliza:
  - **Usuarios activos** (Colombia, Chile, Ecuador — y Argentina siguiendo el mismo patrón) no reciben bloqueo financiero inicial aunque les falte identidad y/o facturación. Se les da un lapso — 🚧 **por definir, tentativamente ~1 mes** — durante el cual pueden seguir retirando, transfiriendo o usando DropiCard sin bloqueo, pero **sí ven** el aviso (C2 soft touch / C4d bienvenida). Al vencer el lapso, el hard gate (C3) empieza a aplicarles, respetando igual el aviso previo de la Regla F.
  - **Usuarios nuevos** no reciben este colchón: no ven ningún aviso proactivo (ver Etapa 2), pero si intentan una acción financiera (Retirar / Transferir / DropiCard) el hard gate (C3) los bloquea de inmediato, sin periodo de gracia. La ausencia de aviso previo no es una ausencia de bloqueo.
  - 🚧 Bloque A (resto de países fuera de Colombia/Chile/Ecuador/Argentina) no está cubierto todavía por esta regla — punto abierto, no asumir que aplica ni que no aplica.
  - ⚠️ **Tensión a declarar, no a ocultar:** esta regla amplía la ventana de exposición del riesgo ya documentado en `Discovery-Riesgos-Transicion-Fase5.md` §1.3 — usuarios de alto volumen (200K-530K órdenes lifetime) que nunca disparan el hard gate porque no retiran dinero. Dar más tiempo a los activos antes de bloquearlos extiende exactamente esa ventana para exactamente esa población. Es un trade-off de negocio consciente (no bloquear de golpe a quienes ya mueven plata), no un descuido.

## Mitos a evitar

| Mito | Realidad |
|---|---|
| "Después del slide-up viene el hard gate" | No. El hard gate solo aparece si el usuario intenta sacar dinero — puede no verlo nunca. |
| "Si cierra el slide-up, queda bloqueado" | No. El slide-up es opcional; el único bloqueo real es el hard gate en salidas. |
| "La facturación en Colombia es un formulario de Dropi" | No. Es un enlace a Sumsub o una lista de solo lectura. |
| "Fuera de Colombia también hay Truora y Sumsub por separado" | No. Un solo Sumsub cubre identidad y facturación. |
| "Los pendientes de Ecuador, Chile y Argentina siguen en WhatsApp para siempre" | No. La PRE-ETAPA los migra a Sumsub sin que el usuario haga nada; la próxima vez que entra ve el mismo banner "Estamos confirmando tus datos" del resto de la base, y si Sumsub le pide retomar, continúa en C5 con el botón Continuar — no vuelve a WhatsApp ni repite datos. |
| "Fuera de Colombia todo vive en una sola pantalla de Dropi" | No. Información de cuenta y Datos de facturación son dos páginas separadas (Configurar y Financiero) para todos los países, igual que Colombia — comparten una sola sesión de Sumsub, pero no una sola pantalla. |
| "Esperamos 72h a que el proveedor revise el caso" | No. El estado se refleja automáticamente vía webhook, típicamente en segundos. El único tiempo "en proceso" real es mientras el usuario está dentro del enlace del proveedor completando su parte — ver PRE-ETAPA. |

## Notas finales

- Este blueprint documenta el **loop de completar lo que falta** (identidad + facturación), organizado en **4 etapas principales** (PRE-ETAPA, ETAPA 1, ETAPA 2, ETAPA 3) — misma granularidad que Fase 0. No es la "Fase 5 — edición post-validación" de `Historia.md`; ver el [Addendum](#addendum--edición-post-aprobación-historia-fase-5).
- Cada paso ya trae su propia tabla SI → ENTONCES; [`Service_Blueprint_Fase_5_Mapa-Decision.md`](Service_Blueprint_Fase_5_Mapa-Decision.md) es solo la referencia opcional con los diagramas mermaid de cada rama.
- Copy canónico completo (con notas internas): [`UX-Writing-Validacion-TechNative.md`](UX-Writing-Validacion-TechNative.md).
- Árbol del widget de soporte (qué ve el usuario si pregunta en vez de ver un banner): [`Soporte-Validacion-Fase-5.md`](Soporte-Validacion-Fase-5.md).
- **Criterios de aceptación:** un usuario con todo completo no ve el aviso sutil ni el bloqueo estricto · el slide-up se puede cerrar, el bloqueo estricto no · en Colombia la facturación nunca muestra un formulario propio de Dropi · con ambos datos pendientes en Colombia, el botón prioriza identidad · fuera de Colombia un solo enlace resuelve todo · un pendiente migrado de Ecuador/Chile/Argentina ve "en revisión" sin reenviar documentos · una respuesta aprobada del proveedor libera las salidas y un rechazo no borra datos previos válidos.

---

## Matrices de referencia rápida

Dos tablas para identificar de un vistazo qué pasa en cada caso, según país y estado. Complementan (no reemplazan) la tabla ["Colombia vs. Resto de países"](#colombia-vs-resto-de-países--la-diferencia-central) del inicio y la tabla de ruteo del [detalle de C5](#c5--validación-y-ruteo--país--lo-que-falta) — esas responden "qué proveedor lo valida"; estas responden "qué ve el usuario, según lo que ya tiene y dónde vive".

### Matriz A — Estados iniciales posibles, por país

| País / bloque | Nada completo | Solo identidad | Solo facturación | Ambas completas |
|---|---|---|---|---|
| Colombia | Posible | Posible — patrón normal (identidad antes que facturación) | ⚠️ Raro — caso de una configuración existente, no el patrón esperado. El flujo ya lo cubre (ver C6, "¡Datos de facturación listos!") | Sin aviso, opera normal |
| Chile / Ecuador | Posible | Posible | No aplica — una sola sesión de Sumsub valida ambas juntas, no hay canal para aprobar solo facturación | Sin aviso, opera normal |
| Argentina | Posible | Posible | No aplica — mismo patrón que Chile/Ecuador | Sin aviso, opera normal |
| Resto de países (bloque A) | Posible | Posible | No aplica — mismo motivo que Chile/Ecuador | Sin aviso, opera normal |

### Matriz B — Qué ve el usuario, por módulo y país

| Módulo | Colombia | Chile / Ecuador / Argentina (bloque B) | Resto de países (bloque A) |
|---|---|---|---|
| Información de cuenta (Configurar → Cuenta) — vacío | Formulario propio de Dropi | Banner + enlace a Sumsub — antes era formulario manual, se convierte | Banner + enlace a Sumsub — módulo nuevo |
| Información de cuenta — completo | Campos de solo lectura | Bloque de texto de solo lectura | Bloque de texto de solo lectura |
| Datos de facturación (Financiero → Facturación Dropi) — vacío | Banner + enlace a Sumsub | Banner + enlace a Sumsub — antes era formulario manual, se convierte | Banner + enlace a Sumsub — módulo nuevo, no existe hoy |
| Datos de facturación — completo | Campos de solo lectura | Bloque de texto de solo lectura | Bloque de texto de solo lectura |
| Proveedor(es) | Truora (identidad) + Sumsub (facturación) — dos sesiones independientes | Sumsub — una sola sesión para las dos páginas | Sumsub — una sola sesión para las dos páginas |
| Bloqueo financiero si falta algo | Regla G: sin bloqueo inicial para activos (lapso tentativo ~1 mes); nuevos, bloqueo inmediato al intentar una acción financiera | Regla G aplica igual | 🚧 No cubierto todavía por Regla G — punto abierto |

---

## Addendum — Edición post-aprobación (Historia Fase 5)

> Este addendum es el flujo **hermano**, no el eje de este blueprint. Corresponde a [`Historia.md`](Historia.md) línea 62: *edición post-validación con re-validación inteligente*.

**Cuándo aplica:** usuario ya `aprobado` que quiere **cambiar** datos (no completar lo que le falta).

| Pieza | Regla |
|---|---|
| RN-11 | Dueño: campos sensibles de identidad quedan en solo lectura tras la última validación, sin fecha de desbloqueo automática — editarlos pasa por soporte y dispara re-validación. Responsable Tributario: sin bloqueo, edición directa. 🚧 `RN-11` en `Historia.md` fija esto en 6 meses; este blueprint no adopta esa cifra todavía — ver Regla D. |
| Sensibles | Nombre, tipo de persona, tipo/número de documento, documento adjunto → re-validación (mismo ruteo de ETAPA 3 / C5). |
| No sensibles | Dirección, ciudad, correo de facturación → guardado directo + auditoría; costo de validación `0`. |
| Precedencia | Un campo sensible en el lote manda todo el lote a re-validación. |
| Rechazo | Conserva la versión aprobada anterior. |
| UI | Formulario con los valores aprobados; propuesta hasta que el webhook diga `aprobado`. Facturación en Colombia ya aprobada: lista de solo lectura (no un formulario libre). |

No se dibuja como etapas principales del loop de completar lo que falta, para no mezclar "completar por primera vez" con "editar después". Si se necesita un diagrama dedicado, puede derivarse de este addendum sin alterar las 4 etapas.

# Service Blueprint — Diagrama (KYC y Mitigación de Riesgo MVP)

> Transcripción textual completa de `Service_Blueprint_Diagrama.html`. El HTML original es un diagrama visual de swimlanes (grilla con columnas = etapas del proyecto y filas = carriles de servicio, con flechas conectando pasos). Este documento traduce esa misma información a texto plano, en orden de lectura, sin omitir ningún contenido (incluye tooltips/anotaciones ocultas y todas las etiquetas de las flechas), para que cualquier LLM sin capacidad de renderizado visual pueda leerlo completo.
>
> **Nota de esta copia "con TI":** esta versión agrega un 8vo carril — "Tecnología → Automatización posible" — con propuestas de automatización por etapa. No forma parte del HTML ni del proceso original de Fase 0 (ver `Service_Blueprint_Diagrama.html` / `Service_Blueprint_Diagrama Fase 0.md` para la versión sin este carril).

## Cómo está organizado el diagrama original

- **Columnas (5 etapas, de izquierda a derecha):** PRE-ETAPA (Setup) → ETAPA 0 (Nuevos) → ETAPA 0.5 (Activos) → ETAPA 1 (Bloqueo) → ETAPA CONTINUA (Semanal).
- **Filas (carriles de servicio, de arriba hacia abajo):**
  1. **Usuarios** — segmento de usuario al que aplica esa etapa.
  2. **Tarea** — la secuencia de pasos que ocurre, en orden horizontal (cada paso es una caja, conectada por flechas horizontales a la siguiente).
  3. **Front stage → Canales** — por dónde le llega la intervención al usuario (UserPilot, CRM, Sumsub, etc.).
  4. **Front stage → Acciones** — qué ve/hace el usuario específicamente en pantalla.
  5. **Back stage → Acciones** — qué hace el equipo interno (Legal, Financiero, TI, Cartera, Admin) sin que el usuario lo vea.
  6. **Herramientas** — qué sistemas/software soportan esa etapa.
  7. **Stakeholders** — qué rol/persona es responsable de qué parte.
  8. **Tecnología → Automatización posible** — carril exclusivo de esta copia "con TI" (no existe en el HTML/proceso original): oportunidad de automatización identificada para esa etapa, ubicada visualmente entre Herramientas y Stakeholders.
- **Conectores verticales entre filas:** además de las flechas horizontales dentro de una misma fila (secuencia de la Tarea), hay flechas verticales que saltan de una fila a la fila inmediatamente inferior (p. ej. de "Tarea" a "Canales", de "Canales" a "Acciones", de "Acciones" a "Back stage"), señalando qué paso de una fila dispara qué paso de la fila siguiente. Estas se listan explícitamente en cada etapa con la etiqueta que llevan en el diagrama (ej. "→ [Silenciado] →").
- **Convención de color observada en las cajas** (no es una leyenda explícita en el HTML, se infiere del uso consistente):
  - 🟢 **Verde** (`#C3F4D4`/`#70D998`): pantalla o hito positivo que ve/vive el usuario (ej. "Usuario Nuevo entra al Dashboard", "Estado: Aprobado").
  - 🟣 **Morado/lavanda** (`#EAD9FF`/`#C495FF`): acción de sistema o de backoffice, no es una pantalla (ej. "Migración de base interna", "Sumsub Verifica Liveness").
  - 🔵 **Azul** (`#D1E8FF`/`#73B8FF`): un modal o intervención directa de UserPilot sobre la pantalla del usuario (ej. "Intercepta: Modal UserPilot", "Freno Seco: Modal Full-Screen").
  - 🔴 **Rojo** (`#FFD6D6`/`#FF8080`): el motor externo Sumsub (o una acción crítica asociada, como el baneo).
  - 🟡 **Rombo amarillo** (`#FFF3CD`/`#FFD966`, rotado 45°): punto de decisión/bifurcación del usuario o del sistema.
  - ⚪ **Gris** (`#E5E7EB`/`#9CA3AF`): canal pasivo/silencioso (ej. el ícono de correo "CRM"). En esta copia "con TI" también es el color de las cajas punteadas del carril "Tecnología → Automatización posible".
  - Las flechas teal (verde azulado) son los conectores verticales entre filas; las flechas índigo son las flechas horizontales de secuencia dentro de una misma fila.

---

## PRE-ETAPA: Preparación y Setup

**Usuarios:** Equipo interno (Setup) y Usuarios a migrar.

**Tarea** (secuencia horizontal):
1. ⚫ Inicio
2. 🟣 Migración de Bases Históricas: se exporta en formato ZIP/Excel la base temporal de ColocaPayments (usuarios ya validados, solo Guatemala y Panamá), el repositorio interno de Cartera (validados históricos multipaís) y el repositorio de ~115.000 usuarios de Colombia ya validados con Truora (estados aprobados históricos) — todos se cargan en Sumsub. Objetivo Colombia: evitar re-validaciones pagadas y reducir costos operativos con Sumsub al importar casos ya certificados.
3. 🟣 Setup Manual: configuración de Google Sheets y campañas en UserPilot. — *(conector vertical hacia Canales, etiqueta "Activa Setup")*
4. 🟢 Validar operación manual — *(flecha horizontal índigo: "Ir a Etapa 0")*

**Front stage → Canales:**
1. ⚪ CRM (ícono de correo) — *(conector vertical hacia Back stage, etiqueta "Silenciado")*
2. 🔵 UserPilot — *(conector vertical hacia Back stage, etiqueta "Silenciado")*
3. 🔴 Sumsub — *(flecha horizontal índigo: "Canales E0")*

**Front stage → Acciones:** Ninguna intervención visual. Proceso invisible.

**Back stage → Acciones:**
- 🟣 1. [PROCESO MANUAL] Definición operativa en Google Sheets: Legal, Admin, Cartera y CRM comparten un mismo documento donde actualizan a mano los estados de validación — sin usar Zapier, HubSpot ni ninguna integración por API.
- 🟣 2. [NO-CODE] Config Sumsub: prioridad a la existencia legal sobre la detección de IA.
- 🟣 3. [NO-CODE] Lotes de Despliegue MVP: se activan las campañas de UserPilot para interceptar usuarios, priorizando los países que hoy no tienen módulo de facturación (Guatemala, Panamá, Paraguay, Perú). Se regula el volumen para que Financiero/Legal puedan auditar a mano sin colapsarse. — *(flecha horizontal índigo: "BS E0")*

**Herramientas:** CRM · UserPilot · Sumsub · Google Sheets.

**Tecnología → Automatización posible:** Sustituir el Google Sheet por una base de datos interna con API — un sistema central donde el estado de cada usuario se actualiza solo, y que Legal, Financiero, Cartera y CRM consultan en vivo, en vez de editar un documento compartido a mano. Migrar las 3 cargas históricas (ColocaPayments, Cartera, ~115k Truora Colombia) con un proceso automatizado y con registro de errores, en vez de exportar/importar archivos a mano. La config de Sumsub y el ritmo de "Lotes de Despliegue" por país quedan en un archivo controlado — se activan o pausan con un interruptor, sin entrar al panel de Sumsub cada vez.

**Stakeholders:**
- **Legal** — Google Sheet compartido y config. Sumsub.
- **Financiero** — Lotes de Despliegue.

---

## ETAPA 0: Onboarding Suave

**Usuarios:** Usuarios Nuevos sin historial — entran por primera vez al Home/Dashboard de Dropi.

**Tarea** (secuencia horizontal):
1. ⚫ Inicio — *(conector vertical hacia Canales, etiqueta "Inicia Onboarding")*
2. 🟢 Usuario Nuevo entra al Dashboard
3. 🟣 Explora Catálogo (sin bloqueos)
4. 🔵 Cierra Banner Lateral "Seguridad"
5. 🟢 Genera Primera Orden (Venta) — *(flecha horizontal índigo: "Ir a Etapa 0.5")*

**Front stage → Canales:**
1. 🔵 UserPilot — *(conector vertical hacia Acciones, etiqueta "Muestra Banner")*
2. ⚪ WhatsApp / Correo (CRM) (ícono de mensaje) — *(conector vertical hacia Acciones, etiqueta "Envía Recordatorio")* *(flecha horizontal índigo: "Canales E0.5")*

**Front stage → Acciones:**
1. 🔵 Panel Lateral (aparece al entrar al Home por primera vez) — Headline: **"Verifica tu cuenta"**. Body: *"En Dropi lo necesitamos para confirmar quién eres y mantener la plataforma segura."* Botón: **"Verificar ahora"**. Ocupa 25% de pantalla, con botón 'X' visible (`aria-label="Cerrar, verificar más tarde"`). *(Sin incentivo monetario aquí — es solo pedagógico. El bono de fletes, masterclasses y "Kit Dropi" es exclusivo de "Semana de la Seguridad" en Etapa 0.5/Activos-Riesgo. Fuente: mesa 7-jul, Consideraciones.md. Copy corregida: la versión anterior mencionaba "retirar tu dinero o hacer transferencias entre wallets" como motivo, pero un usuario que recién entra al Home no tiene wallets ni ha generado dinero en Dropi todavía — hablarle de retirar algo que no tiene no tiene sentido. El motivo ahora se ancla en la necesidad de Dropi como empresa (confirmar identidad, mantener la plataforma segura), no en un beneficio futuro del usuario. Headline en imperativo singular ("Verifica", no "Verifiquemos"): la acción es responsabilidad del usuario. Justificación completa: ver `UX-Writing-Modales-UserPilot.md`)*
2. ⚪ Recordatorio por WhatsApp/Correo (CRM): mensaje automático que le llega al usuario días después de su primer login, si no completó la validación de identidad desde el Panel Lateral. Copy: *"Hola 👋 Aún falta validar tu identidad en Dropi (documento + selfie, unos minutos). Lo pedimos para confirmar quién eres y completar tu perfil. Entra a tu panel y pulsa «Verificar ahora»."* **Asunto sugerido (correo):** "Completa tu validación de identidad en Dropi". Terminología deliberada: usa "validar/validación de identidad" y menciona "documento + selfie" para distinguirlo del OTP de correo/celular (código de 6 dígitos dentro del flujo Sumsub) y del 2FA de Configuración → Seguridad; evita "verificar tu cuenta" (suena a activación por código). Sin retiros, wallet ni transacciones — el usuario nuevo aún no tiene saldo. Es el mismo envío programado que se define en Back stage (punto 2) — aquí es donde el usuario realmente lo ve.
3. 🟣 Sutil: Permite navegación total. Usuario puede ignorarlo y seguir comprando — pero si hace clic en "Transferir Wallet", "Recargar", "Registro de Datos Bancarios", "Solicitud DropiCard", "Datos de Facturación" o "Información de Cuenta" antes de verificarse, salta directo al flujo de Etapa 0.5 (modal interceptor UserPilot, o modal exclusivo bancario en GT/PA): mismo trato que un usuario Activo, sin importar que sea Nuevo. — *(flecha horizontal índigo: "FS E0.5")*

**Back stage → Acciones:**
- 🟣 1. [MANUAL] Segmentación visual en UserPilot: filtra a los usuarios por fecha de registro para aislar a los Nuevos.
- 🟣 2. [MANUAL] Envíos programados desde el CRM por WhatsApp y correo con mensajes de educación en seguridad (cadencia y tema exactos por confirmar — Tabla Fase 0.csv solo dice "semanales"). — *(flecha horizontal índigo: "BS E0.5")*

**Herramientas:** UserPilot · CRM.

**Tecnología → Automatización posible:** En cuanto un usuario se registra, el sistema de Dropi le avisa automáticamente a UserPilot (una señal interna que dispara la acción sola, sin que nadie la active a mano) para etiquetarlo como "Usuario Nuevo" — hoy alguien filtra esa lista manualmente por fecha. Los recordatorios de WhatsApp/correo se programan solos según cuántos días lleve el usuario sin verificarse, en vez de que CRM los agende a mano.

**Stakeholders:**
- **Product Designer** — Banner.
- **CRM** — Flujos.

---

## ETAPA 0.5: Trigger Transaccional (Activos)

**Usuarios:** Usuarios Activos (Dropshippers / Proveedores) — y también Usuarios Nuevos, si intentan Transferir Wallet, Recargar, Registro de Datos Bancarios, Solicitud DropiCard, Datos de Facturación o Información de Cuenta antes de verificarse en Etapa 0 (GT/PA: modal exclusivo bancario; resto: modal interceptor UserPilot). El disparador es la acción, no la antigüedad de la cuenta.

**Tarea** (secuencia horizontal):
1. 🟢 Dropshipper en Módulo Financiero
2. 🟣 Clic: "Transferir Wallet", "Recargar", "Registro de Datos Bancarios", "Solicitud DropiCard", "Datos de Facturación" o "Información de Cuenta" *(Growth Ops: triggers estándar → Modal UserPilot. "Registro de Datos Bancarios" bifurca: GT/PA → modal exclusivo cuentas bancarias → link Sumsub del país; resto → Modal UserPilot. "Datos de Facturación" e "Información de Cuenta": editar exige verificarse primero)* — *(conector vertical hacia Canales, etiqueta "Intercepta Clic")*
3. 🔵 Intercepta: Modal UserPilot (Interceptor Recurrente / Spam Visual)
4. 🔴 Redirección Automática a Sumsub — la pregunta de "Persona Natural" o "Empresa" ya no es un paso de UserPilot: Sumsub la hace dentro de su propio formulario (ver Back stage → DOC ENLACES). — *(flecha horizontal índigo: "Ir a Etapa 1")*

**Front stage → Canales:**
1. 🔵 UserPilot — *(conector vertical hacia Acciones, etiqueta "Despliega")*
2. 🔴 Sumsub WebSDK — *(flecha horizontal índigo: "Canales E1")*

**Front stage → Acciones:**
1. 🔵 Modal Interceptor Recurrente (Spam Visual / No-Code) — Headline: **"Verifica tu identidad para continuar"**. Body: *"Antes de mover fondos necesitamos confirmar quién eres. Te llevamos a completar la verificación."* Botón único: **"Continuar a verificación"**. *(Corrección: el modal ya no pregunta si eres Persona Natural o Empresa — esa pregunta pasó a ser parte del propio formulario de Sumsub, no un paso de UserPilot. Ver Back stage → DOC ENLACES.)* **Aviso legal visible:** enlaces a **Política de Privacidad** y **Términos y Condiciones** de Dropi — *"Al continuar, aceptas los [Términos y Condiciones] y autorizas el tratamiento de tus datos conforme a la [Política de Privacidad] de Dropi."* *(URLs finales pendientes de Legal por país — ver `Plan2.md` C-08/C-09.)* El texto no varía entre reapariciones (evita apariencia de manipulación). Sin botón 'X', obliga a ir a Sumsub. ⚠️ Atención Legal y Financiero: este pop-up es ineludible — UserPilot NO puede ser evadido por AdBlockers. Aunque no es un bloqueo a nivel de código backend, intercepta obligatoriamente la pantalla del usuario; si intenta evadirlo, el modal reaparecerá infinitamente hasta que complete la validación. *(tiene un botón de anotación "!" — ver tooltip completo en la sección Back stage de esta misma etapa, punto 15 de la tabla de conectores. Copy y justificación de tono: ver `UX-Writing-Modales-UserPilot.md`)* — *(conector vertical hacia Back stage, etiqueta "Tracking")*
2. 🔵 Modal exclusivo Datos Bancarios (GT/PA) — solo al agregar cuenta en **Guatemala** o **Panamá**. Headline/body orientados a validar la identidad del **titular de la cuenta bancaria** (tipo y número de documento del formulario existente). CTA redirige al **enlace Sumsub del país** (bloque A, enlace largo). Si el documento ya quedó validado, el sistema **rechaza** duplicados del mismo tipo+número (regla anti-fraude de cuentas bancarias, fuente: mesa técnica jun-2026). — *(no pasa por UserPilot; ver bifurcación en Tarea paso 2)*
3. 🟣 Auto-cierre y redirección automática — *(flecha horizontal índigo: "FS E1")*

**Back stage → Acciones:**
- 🟣 "📝 DOC ENLACES (SUMSUB FORMS)" — caja con anotación (botón "!") que define qué le pide Sumsub a cada país y tipo de cuenta:
   - **Tooltip del botón "!":** *"Arranque real del MVP (Consem2, mesa 7-jul): solo Guatemala, Panamá, Paraguay y Perú. El resto de esta lista (MX, VE, CR, Europa) se solicita a Sumsub en el setup pero entra de forma gradual (despliegue gradual, Consem2 punto 6) — no es el arranque. El bloque C (Colombia): KYC Truora + facturación Sumsub (natural/jurídica) con alertas UserPilot; ver su propia nota."*
   - **A. Largo (GT, PA, PY, PE, MX, VE, CR, Europa):** para **Registro de Datos Bancarios en GT/PA**, el enlace largo se consume desde el **modal nativo de cuentas bancarias**, no desde UserPilot. Persona natural — prueba de vida (liveness) + documento de identidad + datos fiscales. Empresa — prueba de vida del representante legal + búsqueda de la empresa + datos fiscales.
   - **B. Corto (CL, EC, AR):** persona natural — solo prueba de vida + documento de identidad. Empresa — solo prueba de vida del representante legal + documento de la empresa.
   - **C. Colombia (KYC Truora + facturación Sumsub):** todos deben validar **identidad** y **datos de facturación** (persona natural o jurídica). **KYC/identidad → Truora** desde Datos personales en Dropi (sigue vigente). **Datos de facturación → Sumsub** (natural y jurídica). Empresa/KYB: prueba de vida del representante legal + cédula + razón social + NIT + RUT + cámara de comercio. **UserPilot** muestra alertas para completar la validación de facturación/KYB. No confundir KYC (Truora) con facturación (Sumsub).
   - **D. Marcas Blancas (White-label links):** enlace de Sumsub sin el branding de Dropi. Soporte lo envía a mano por WhatsApp o Intercom — estos usuarios no reciben pop-ups automáticos de UserPilot. **Atención Soporte/Comercial:** ustedes son responsables de enviarlo durante la atención al cliente.
   - **E. Tercero (facturación otra persona natural):** cuando el usuario elige facturar a un tercero, Sumsub ofrece **"Continuar en el teléfono"**, que genera un **link móvil** de verificación. El usuario de Dropi **envía ese link por WhatsApp o correo** al tercero; el tercero completa **solo la biometría (liveness + documento)** desde su dispositivo, **sin rehacer** los pasos previos que ya completó el titular de la cuenta en Dropi. — *(flecha horizontal índigo: "BS E1")*

**Herramientas:** UserPilot · Sumsub WebSDK.

**Tecnología → Automatización posible:** Un sistema interno responde automáticamente qué enlace de Sumsub le corresponde a cada país y tipo de cuenta — reemplaza la tabla "DOC ENLACES" que hoy alguien consulta a mano. En cuanto Sumsub recibe el caso, le avisa solo al sistema de Dropi (webhook: una notificación automática entre sistemas, sin que nadie la escriba) y el estado se actualiza al instante, sin esperar semanas a que Legal lo revise en Etapa Continua. Para Marcas Blancas, el enlace se envía solo por WhatsApp/Intercom, sin que Soporte lo copie y pegue a mano.

**Stakeholders:**
- **PD / Growth** — Rediseño de modal interceptor + adaptación modal exclusivo Datos Bancarios (GT/PA).
- **Legal/Financiero** — Validación de reglas documentales.
- **Soporte** — Envío manual del Enlace D a usuarios de Marcas Blancas.

---

## ETAPA 1: Bloqueo y Rechazos

**Usuarios:** Usuarios con saldos negativos o fraude.

**Tarea** (secuencia horizontal):
1. 🟢 Usuario Negativo/Sospechoso en Financiero
2. 🟣 Intenta Ejecutar Retiro o Envío — *(conector vertical hacia Canales, etiqueta "Atrapa Solicitud")*
3. 🔵 Freno Seco: Modal Full-Screen (Bloqueo Visual / Spam Recurrente — Sin Salida) — *(flecha horizontal índigo: "Termina Flujo")*

**Front stage → Canales:**
1. 🔵 UserPilot — *(conector vertical hacia Acciones, etiqueta "Bloquea")*
2. *(caja con badge "Termina" — flecha horizontal índigo, sin caja de destino adicional en esta fila)*

**Front stage → Acciones:**
1. 🔵 Modal Pantalla Completa — Headline: **"Bloqueamos esta operación por seguridad"**. Body: *"Estamos revisando tu cuenta para proteger tus fondos. No podrás hacer retiros ni envíos mientras dure la revisión. ¿Tienes dudas? Comparte tu caso desde el ícono de soporte, abajo a la derecha."* Sin botón de cierre ni de contacto dentro del modal — no existe un botón "Contactar a soporte" real; permanece hasta que Legal/Financiero resuelvan el caso. La única vía de contacto es el ícono de soporte flotante que ya existe en la esquina inferior derecha de la pantalla (fuera del modal), donde el usuario puede tocar el chip raíz **"Validación de identidad"** y elegir la opción **"Mi cuenta está bloqueada"** del árbol (ver ítems 2-4 a continuación). (Bloqueo Visual: no congela el saldo por código, es UserPilot interceptando la pantalla. Copy y justificación de tono: ver `UX-Writing-Modales-UserPilot.md`) — *(conector vertical hacia Back stage, etiqueta "Reglas")*
2. 🔵 Widget de Soporte — el usuario lo abre voluntariamente, siguiendo la indicación del modal (no hay apertura automática ni integración); chip raíz **"Validación de identidad"** en su menú principal.
3. 🟣 Árbol de opciones (chips) — dentro del chip raíz "Validación de identidad". El agente responde primero automáticamente según la opción elegida. Las 7 opciones son alternativas independientes — ninguna se ramifica en una sub-decisión adicional ni dispara otra opción; todas son respuestas terminales (texto, o texto con enlace/redirección solo en la opción 4). Solo al final de esa respuesta — nunca antes, ni desde el menú — aparecen los chips de cierre del ítem 4 (detalle completo con el copy exacto de cada opción: ver sección "Detalle del árbol de soporte — Validación de identidad" más abajo). No existe una opción aparte de "Otro tema": si el tema no encaja en ninguna de las 7, el usuario usa el chip "Necesito la ayuda de un asesor" del ítem 4:
   1. **Mi cuenta está bloqueada** — el bloqueo es una revisión de Legal/Financiero, no un error de código ni una sanción automática; sin ETA fijo porque depende de que Legal/Financiero resuelvan el caso a mano.
   2. **Me rechazaron la verificación** — "Rechazado" (falla del proceso) es distinto de "Bloqueado" (revisión de Legal/Financiero); no mencionar fraude al usuario; existe vía de apelación (Soporte desbanea cuenta si es falso positivo, ver Etapa Continua, Back stage punto 3).
   3. **Mi verificación sigue en revisión** — SLA operativo de hasta 72 horas hábiles según la cola (no es el tiempo fijo de una sola revisión); no necesita repetir el proceso ni reenviar documentos.
   4. **Empecé la verificación pero no la terminé** — guía para retomar el proceso en Sumsub (mismo destino que el botón "Continuar verificación" del modal "incompleto en Sumsub"; único caso con enlace real).
   5. **No sé qué proceso me aplica / qué documentos necesito** — diferencia por país: en Colombia todos validan identidad (Truora desde Datos personales) + datos de facturación (Sumsub vía enlace; UserPilot alerta facturación/KYB); el resto de países sigue vía Sumsub (bloques A/B/D/E). No hay video-tutorial disponible para este flujo.
   6. **Soy extranjero, no sé qué documento cargar** — puede cargar pasaporte o identificación de su país de origen; Sumsub parametriza automáticamente el formato local (aplica multipaís, no solo Colombia; Reglasvalidacion.md, regla 3 "Parametrización Automática Cross-Border").
   7. **Tengo una empresa / dudas de KYB** — 3 sub-ramas por país: en Colombia, facturación/KYB vía Sumsub (UserPilot alerta); identidad vía Truora; en bloque A (GT/PA/PY/PE/MX/VE/CR/Europa) Sumsub autocompleta por nombre y el usuario no digita NIT (Reglasvalidacion.md, regla 3 "Regla de Cero Fricción en Empresa"); en bloque B (CL/EC/AR) prueba de vida + documento de la empresa, sin ese autocompletado.
4. ⚪ Chips de cierre (al final de cada opción) — después de la respuesta automática de cada una de las 7 opciones anteriores — no antes, no desde el menú — el agente ofrece juntos dos chips: **"Es todo por hoy"** (cierra la conversación sin escalar) y **"Necesito la ayuda de un asesor"** (escala a un asesor humano si el usuario lo elige).
5. 🟣 Si es Criminal (Sumsub): Baneo total de IP y cuenta. — *(flecha horizontal índigo: "Termina")*

**Back stage → Acciones:**
- 🟣 1. Cartera (Andrés Herrera) corre un script interno en Python que cruza bases de datos para detectar saldo negativo o fraude por país (y cruza cuentas por correo + DNI para baneos multipaís), y con eso lanza campañas focalizadas en UserPilot.
- 🟣 2. Si Sumsub rechaza el caso por un delito grave (lavado de activos, listas restrictivas), Legal y Financiero se reúnen y devuelven el dinero del usuario a una cuenta externa.
- 🟣 3. El baneo se ejecuta a mano y al mismo tiempo en Colombia, Chile, Ecuador, Perú y Venezuela, **cruzando cuentas por correo y por documento de identidad (DNI)** — una misma persona puede tener varios correos; el DNI es el conector primario para detectar reincidencia multipaís. El bloqueo en registro o login con correo baneado todavía no tiene pantalla propia (regla de negocio RN-16/17, pendiente de diseño). — *(flecha horizontal índigo: "Termina")*

**Herramientas:** UserPilot · Python (Cartera).

**Tecnología → Automatización posible:** El script de Cartera deja de correrse a mano: se ejecuta solo, por horario o apenas detecta un saldo negativo, y se conecta directo con UserPilot para activar el bloqueo. Un sistema central hace el baneo en los 5 países a la vez automáticamente (hoy se hace uno por uno, a mano, cruzando correo y documento), dejando registro de auditoría. Si Sumsub detecta un delito grave, el caso para Legal/Financiero ya llega armado con el monto y la cuenta externa, para que solo falte decidir.

**Stakeholders:**
- **Cartera** — Listas negativas.
- **Legal/Financiera** — Reembolsos y baneos.

---

## ETAPA CONTINUA: Operación Semanal

**Usuarios:** Usuarios que iniciaron validación.

**Tarea** (secuencia horizontal):
1. ⚫ Inicio — *(conector vertical hacia Canales, etiqueta "Solicita Datos")*
2. 🟣 Sumsub Verifica Liveness y Tributario
3. 🟡 **[Decisión/rombo]** Legal descarga estados de Sumsub y actualiza el Google Sheet (manual)
4. 🟢 Estado: Aprobado, Pendiente (en revisión de Financiero, o incompleto en Sumsub — ver Front stage → Acciones) o Rechazado

**Front stage → Canales:**
1. 🔴 Sumsub Backoffice — *(conector vertical hacia Acciones, etiqueta "Datos")*
2. 🔵 UserPilot
3. ⚪ WhatsApp / Correo (CRM) — *(conector vertical hacia Acciones, etiqueta "Notificaciones")*

**Front stage → Acciones:**
1. 🟢 🟩 APROBADO: Modal muestra **"¡Cuenta verificada!"** — *"Ya puedes transferir tu wallet, registrar tus datos bancarios y pedir tu DropiCard."* Desaparece solo a los 4-5 segundos. — *(conector vertical hacia Back stage, etiqueta "Auditoría")*
2. 🔵 🟦 PENDIENTE — dos motivos distintos, cada uno con su propio mensaje (no es un solo estado):
   - **En revisión de Financiero** (Sumsub ya recibió todo, falta la auditoría tributaria interna): Modal muestra **"Tu verificación sigue en proceso"** — *"Según la cola de revisión, puede tomar hasta 72 horas hábiles. Te avisaremos apenas esté lista — no necesitas hacer nada más."* Botón: **"Entendido"**. Botón secundario: **"Contactar a soporte"** — hoy esta pantalla no ofrecía ninguna vía de contacto; se agrega junto a "Entendido" con la misma lógica que en Etapa 1 y en Rechazado: el botón NO abre el widget automáticamente — el copy solo le indica al usuario que puede contactar a soporte, orientándolo a abrir por su cuenta el widget de soporte flotante existente, tocar el chip raíz **"Validación de identidad"** y elegir la opción **"Mi verificación sigue en revisión"** del árbol (indicación textual, no integración; mismo árbol de soporte descrito en Etapa 1 → Front stage → Acciones, ítems 2-4).
   - **Incompleta en Sumsub** (el usuario inició el proceso pero no lo terminó — así lo reporta Sumsub): Modal muestra **"Tu verificación quedó incompleta"** — *"Empezaste el proceso pero no lo terminaste en Sumsub. Complétalo para poder operar sin restricciones."* Botón: **"Continuar verificación"** (lo regresa a Sumsub).
   - *(Hay un tercer caso — el usuario nunca dio clic a "Validar identidad" — pero ese no genera estado en Sumsub, porque nunca llegó a crear un caso allí. Ese usuario no aparece como "Pendiente" en el Google Sheet: simplemente sigue viendo el Modal Interceptor Recurrente de Etapa 0.5 cada vez que intenta una de las acciones que lo disparan, sin haber llegado nunca a Sumsub. Ver Notas finales.)*

🟥 RECHAZADO: Modal muestra **"No pudimos verificar tu identidad"** — *"Por seguridad, restringimos las operaciones de esta cuenta. Si crees que es un error, contáctanos y lo revisamos."* Botón: **"Contactar a soporte"** — luego expulsión (ver Etapa 1). El botón NO abre el widget automáticamente; el copy solo le indica al usuario que puede contactar a soporte, orientándolo a abrir por su cuenta el mismo widget de soporte flotante existente, tocar el chip raíz **"Validación de identidad"** y elegir la opción **"Me rechazaron la verificación"** del árbol (indicación textual, no integración; mismo árbol de soporte descrito en Etapa 1 → Front stage → Acciones, ítems 2-4). *(Copy y justificación de tono: ver `UX-Writing-Modales-UserPilot.md`)*
3. ⚪ Notificaciones por WhatsApp/Correo (CRM): mensaje manual que el equipo de CRM envía según el estado del usuario en el Google Sheet — tres mensajes distintos:
   - **Aprobado:** cumple la promesa hecha en el modal Pendiente ("te avisaremos apenas esté lista") y además sirve de gancho para reactivar el uso de Dropi: *"Hola 👋 ¡tu cuenta en Dropi ya está verificada! Ya puedes transferir tu wallet, registrar tus datos bancarios y pedir tu DropiCard sin restricciones. Aprovecha y sigue haciendo crecer tu negocio 🚀"* Se envía una sola vez, apenas Admin marca "Aprobado" en el Sheet.
   - **En revisión de Financiero:** *"Hola 👋 tu verificación en Dropi sigue en proceso — según la cola de revisión, puede tomar hasta 72 horas hábiles. Te avisaremos apenas esté lista, no necesitas hacer nada más. ¿Dudas? Escríbenos."* Se envía una sola vez — no se repite, para no contradecir el "no necesitas hacer nada más" del modal.
   - **Incompleta en Sumsub:** *"Hola 👋 empezaste tu verificación en Dropi pero no la terminaste. Complétala para seguir operando sin restricciones: [link a Sumsub]."* Este sí puede repetirse según la cadencia que defina CRM, porque aquí sí hay una acción pendiente del usuario.

**Back stage → Acciones:**
- 🟣 1. **[PROCESO 100% MANUAL — EL CUELLO DE BOTELLA]**
   - **Descarga:** Legal descarga los estados desde el backoffice de Sumsub.
   - **Actualización en Google Sheets:** Legal actualiza a mano el Google Sheet compartido, marcando quién está Aprobado, Rechazado, o Pendiente — y si es Pendiente, con cuál de los dos motivos que reporta Sumsub: **en revisión de Financiero** (documentos completos, falta auditoría tributaria) o **incompleto** (el usuario no terminó el proceso en Sumsub).
   - **Ejecución:** con base en ese Sheet, Admin apaga el pop-up de UserPilot a los Aprobados y CRM les notifica la aprobación por WhatsApp/correo — cumple la promesa hecha en el modal Pendiente y sirve de gancho para reactivar el uso de Dropi —; a los Pendientes, CRM envía el mensaje que corresponda según el motivo: status update de una sola vez si espera a Financiero, o insistencia repetible si quedó incompleto en Sumsub (ver Front stage → Acciones, punto 3); y Financiero audita los datos tributarios cruzados contra Dropi de los que están en revisión.
   - **Capacidad:** el lanzamiento es país por país (ver "Lotes de Despliegue", PRE-ETAPA). Si se acumulan pendientes, Financiero o Legal avisan para pausar las campañas de UserPilot.
- 🟣 2. ⚠️ SLA para Soporte: como la actualización es 100% manual por Google Sheets (y depende de la cola de revisión), el pop-up no desaparece apenas se aprueba. Soporte debe avisarle a los usuarios que el proceso puede tomar hasta 72 horas hábiles según la cola — no es el tiempo fijo de una sola revisión — y que la pantalla puede tardar entre 48 y 72 horas hábiles en actualizarse.
- 🟣 3. Soporte (Daniela/Juan) desbanea la cuenta si resulta ser un falso positivo.

**Herramientas:** Sumsub Backoffice · Google Sheets · UserPilot · CRM.

**Tecnología → Automatización posible:** En cuanto Sumsub termina de revisar un caso, le avisa automáticamente al sistema de Dropi (webhook: aviso automático entre sistemas, sin intervención humana) y el estado se actualiza solo — hoy Legal tiene que entrar a Sumsub, descargar la lista y actualizar el Google Sheet a mano, lo que genera el mayor atraso del proceso. Ese mismo aviso apaga el pop-up en UserPilot si el usuario quedó Aprobado, y manda el WhatsApp/correo correspondiente sin que Admin ni CRM tengan que hacerlo. La revisión tributaria de Financiero sigue siendo una decisión humana, pero los datos ya le llegan organizados en un tablero, sin tener que buscarlos.

**Stakeholders:**
- **Legal** — Descarga y actualiza el Google Sheet.
- **Admin** — Actualiza UserPilot según el Sheet.
- **CRM** — Reenvía mensajes a Pendientes.
- **Financiero** — Auditoría de datos tributarios.
- **Soporte** — Informa el SLA de 48–72h a validados.

---

## Detalle del árbol de soporte — Validación de identidad

Sub-árbol de 7 opciones dentro del chip raíz "Validación de identidad" del widget de soporte (ver Etapa 1 → Front stage → Acciones arriba). Son alternativas independientes — el usuario elige una sola, ninguna dispara ni encadena con otra opción; todas convergen en la misma caja "Chips de cierre". No existe una opción aparte de "Otro tema": si el tema del usuario no encaja en ninguna de las 7, usa el chip "Necesito la ayuda de un asesor" al final de la respuesta que eligió. Cada opción separa el **Copy** (mensaje literal que vería el usuario, redactado con calidez) de la **Nota interna** (regla de negocio que lo sustenta, no se le muestra al usuario). **Las opciones 5 y 7 tienen una sub-rama interna por país** — es la única bifurcación real del árbol, porque el proceso mismo cambia por país. La opción 5 se bifurca en 2 (Colombia vs. resto de países); la opción 7 se bifurca en **3** (Colombia / bloque A con autocompletado / bloque B sin autocompletado), porque el blueprint (DOC ENLACES, Etapa 0.5) distingue 3 grupos reales para empresas. **El widget detecta el país automáticamente (Intercom ya tiene ese dato) — nunca se le pregunta al usuario**. Todas las sub-ramas siguen siendo terminales, ninguna abre un nivel adicional. **En toda ruta donde el usuario puede empezar o continuar su validación** (opción 4, ambas sub-ramas de la 5, opción 6, y las 3 sub-ramas de la 7) **el copy muestra un enlace ("toca aquí")** en vez de solo describir el proceso — **ninguna respuesta asume que el usuario ya está en revisión**; siempre se cubren los dos casos (ya empezó / aún no ha empezado). Casi todos apuntan a Sumsub. En Colombia todos validan **identidad (Truora)** + **datos de facturación (Sumsub)** — natural o jurídica; UserPilot alerta para completar facturación/KYB. El "toca aquí" de la opción 5-CO es Sumsub facturación, no Truora. **Por ningún motivo el Copy nombra el validador** (ni "Sumsub" ni "Truora"), sea cual sea el destino real; esa información vive solo en la Nota interna. El copy es el mismo ya validado en `Soporte-Validacion-Identidad.md`.

**Chip raíz:** "Validación de identidad" (menú principal del widget) → el usuario elige un chip (una sola opción, sin encadenamiento):

1. **Mi cuenta está bloqueada**
   - **Copy:** *"Entendemos que esto es incómodo, y queremos que sepas que no es un error ni una sanción automática. Bloqueamos tu cuenta como medida de seguridad mientras nuestro equipo revisa tu caso a fondo, para proteger tus fondos y tu información. No necesitas hacer nada mientras tanto — no hay un tiempo exacto porque cada caso se revisa a mano, pero te avisaremos en cuanto quede resuelto."*
   - **Nota interna:** es una revisión de Legal/Financiero (Etapa 1), no un error de código ni una sanción automática; sin ETA fijo.

2. **Me rechazaron la verificación**
   - **Copy:** *"Un rechazo no significa que hayas hecho algo mal. Muchas veces se debe a un detalle que se puede corregir, como una foto borrosa o un dato que no coincide con tu documento. Si crees que fue un error o quieres que revisemos tu caso de nuevo, cuéntanos y con gusto lo reenviamos a revisión."*
   - **Nota interna:** distinción Rechazado (falla del proceso) vs Bloqueado (revisión de Legal/Financiero); no mencionar fraude al usuario; apelación ya contemplada (Soporte desbanea si es falso positivo, Etapa Continua, Back stage punto 3).

3. **Mi verificación sigue en revisión**
   - **Copy:** *"Tu verificación ya está en manos de nuestro equipo. Según la cola de revisión, el proceso puede tomar hasta 72 horas hábiles — te pedimos paciencia. No necesitas repetir el proceso ni reenviar documentos: en cuanto esté lista, te avisamos para que sigas operando sin restricciones."*
   - **Nota interna:** SLA operativo 48–72h hábiles (cola + actualización manual Google Sheets / UserPilot; Etapa Continua, Back stage punto 2) — no es el tiempo fijo de una sola revisión.

4. **Empecé la verificación pero no la terminé**
   - **Copy:** *"Sin problema, lo que ya avanzaste queda guardado — puedes retomar tu verificación justo donde la dejaste, sin tener que empezar de nuevo ni repetir pasos ya completados. Toca aquí para continuar y terminarla en pocos minutos."* (único caso del árbol con enlace/redirección real)
   - **Nota interna:** enlace a Sumsub — mismo destino que el botón "Continuar verificación" del modal "incompleto en Sumsub"; el nombre del validador nunca se menciona en el Copy.

5. **No sé qué proceso me aplica / qué documentos necesito** — sub-rama por país (detectado automáticamente, no se pregunta):
   - **Sub-rama Colombia — Copy:** *"Completar tu validación confirma quién eres, protege tu cuenta y te permite operar sin restricciones. En Colombia son dos pasos: para tu identidad, ve a Datos personales; para tus datos de facturación, toca aquí — el formulario te guía en cada paso."* — **Nota interna:** en CO todos validan identidad + datos de facturación (natural o jurídica). KYC/identidad → **Truora** desde **Datos personales** en Dropi (NO es este enlace). Datos de facturación → **Sumsub** (este "toca aquí"), para natural y jurídica. UserPilot muestra alertas para completar la validación de facturación/KYB. El validador nunca se nombra en el Copy.
   - **Sub-rama Resto de países — Copy:** *"Completar tu validación confirma quién eres, protege tu cuenta y te permite operar sin restricciones. Es un formulario guiado que te indica qué subir en cada paso. Toca aquí para comenzar."* — **Nota interna:** enlace a Sumsub (bloques A/B del blueprint), sin video-tutorial.
   - Ambas sub-ramas convergen en los mismos Chips de cierre — ninguna abre un tercer nivel.

6. **Soy extranjero, no sé qué documento cargar**
   - **Copy:** *"No hay problema: puedes validarte con tu pasaporte o con la identificación oficial de tu país de origen. El sistema reconoce automáticamente el formato según el país — no tienes que indicarnos nada extra. Toca aquí para comenzar tu validación."*
   - **Nota interna:** Sumsub parametriza el formato local (Reglasvalidacion.md, regla 3); aplica multipaís, no solo Colombia; con enlace real; caso requiere revisión manual, se ofrece de inmediato el chip de asesor.

7. **Tengo una empresa / dudas de KYB** — 3 sub-ramas por país (detectado automáticamente, no se pregunta) — el blueprint distingue 3 grupos reales para empresas (DOC ENLACES, Etapa 0.5):
   - **Sub-rama Colombia — Copy:** *"Para empresas en Colombia, la validación de datos de facturación se hace en un formulario guiado: te pedirá la información y los documentos de tu empresa y de tu representante legal, paso a paso. Si ya empezaste, puedes retomar donde quedaste. Si aún no has empezado, toca aquí para comenzar."* — **Nota interna:** Sumsub KYB/facturación CO (natural o jurídica según el caso); mecanismo vía Sumsub (prueba de vida del representante legal + cédula + razón social + NIT + RUT + cámara de comercio). Con enlace real; la cola de revisión manual puede aplicar sin presentarlo como proceso incompleto de producto.
   - **Sub-rama Bloque A (GT, PA, PY, PE, MX, VE, CR, Europa) — Copy:** *"Para validar tu empresa, el formulario te guía en cada paso. Incluye una prueba de vida de tu representante legal y la búsqueda de tu empresa por nombre: al seleccionarla, el sistema completa automáticamente datos como el identificador fiscal, para que no tengas que digitarlos a mano. Toca aquí para comenzar."* — **Nota interna:** "Regla de Cero Fricción en Empresa" (Reglasvalidacion.md regla 3) — Sumsub busca por nombre y autocompleta; con enlace real.
   - **Sub-rama Bloque B (CL, EC, AR) — Copy:** *"Para validar tu empresa, el formulario te guía en cada paso. Te pedirá una prueba de vida de tu representante legal y el documento de tu empresa. Toca aquí para comenzar."* — **Nota interna:** prueba de vida + documento de la empresa, sin búsqueda automática por nombre — el blueprint no confirma autocompletado para este bloque; con enlace real.
   - Las 3 sub-ramas convergen en los mismos Chips de cierre — ninguna abre un nivel adicional.

**Chips de cierre** (al final de la respuesta de la opción elegida — o de su sub-rama, en las opciones 5 y 7 — no antes, no desde el menú): **"Es todo por hoy"** (cierra) y **"Necesito la ayuda de un asesor para mi validación de identidad"** (escala a un asesor humano).

---

## Tabla completa de conectores verticales (entre filas)

Cada fila representa una flecha vertical (teal) que va de una caja de una fila a una caja de la fila inmediatamente inferior, dentro de la misma etapa.

| # | Etapa | Fila origen | Caja origen (texto) | Etiqueta de la flecha | Fila destino | Caja destino (texto) |
|---|---|---|---|---|---|---|
| 1 | PRE-ETAPA | Tarea | Setup Manual: Google Sheets + UserPilot | Activa Setup | Canales | UserPilot (id `userpilot-pre`) |
| 2 | ETAPA 0 | Tarea | Inicio (círculo) | Inicia Onboarding | Canales | UserPilot (id `userpilot-fase0`) |
| 3 | ETAPA 0.5 | Tarea | Clic: "Transferir Wallet", "Recargar", "Registro de Datos Bancarios", "Solicitud DropiCard", "Datos de Facturación" o "Información de Cuenta" | Intercepta Clic | Canales | UserPilot (id `userpilot-fase05`) |
| 4 | ETAPA 1 | Tarea | Intenta Ejecutar Retiro o Envío | Atrapa Solicitud | Canales | UserPilot (id `userpilot-fase1`) |
| 5 | ETAPA CONTINUA | Tarea | Inicio (círculo) | Solicita Datos | Canales | Sumsub Backoffice (id `sumsub-continua`) |
| 6 | PRE-ETAPA | Canales | CRM (ícono correo) | Silenciado | Back stage Acciones | 1. Google Sheets compartido... (id `piloto-tecnico`) |
| 7 | PRE-ETAPA | Canales | UserPilot (id `userpilot-pre`) | Silenciado | Back stage Acciones | 2. Config Sumsub... (id `config-sumsub`) |
| 8 | ETAPA 0 | Canales | UserPilot (id `userpilot-fase0`) | Muestra Banner | Front Acciones | Panel Lateral: "Verifica tu cuenta" (id `panel-lateral`) |
| 9 | ETAPA 0.5 | Canales | UserPilot (id `userpilot-fase05`) | Despliega | Front Acciones | Modal Interceptor Recurrente/Spam Visual... (id `modal-optimizado`) |
| 10 | ETAPA 1 | Canales | UserPilot (id `userpilot-fase1`) | Bloquea | Front Acciones | Modal Pantalla Completa... (id `modal-pantalla`) |
| 11 | ETAPA CONTINUA | Canales | Sumsub Backoffice (id `sumsub-continua`) | Datos | Front Acciones | 🟩 APROBADO... (id `aprobado`) |
| 12 | ETAPA 0.5 | Front Acciones | Modal Interceptor Recurrente/Spam Visual... (id `modal-optimizado`) | Tracking | Back stage Acciones | DOC ENLACES (SUMSUB FORMS) (id `event-tracking`) |
| 13 | ETAPA 1 | Front Acciones | Modal Pantalla Completa... (id `modal-pantalla`) | Reglas | Back stage Acciones | 1. Cartera (Andrés Herrera)... (id `python-script`) |
| 14 | ETAPA CONTINUA | Front Acciones | 🟩 APROBADO... (id `aprobado`) | Auditoría | Back stage Acciones | 1. [PROCESO 100% MANUAL] Descarga y Google Sheet... (id `financiero-continua`) |
| 15 | ETAPA 0.5 | Back stage Acciones | DOC ENLACES (SUMSUB FORMS) (id `event-tracking`) | Legal | Herramientas | UserPilot · Sumsub WebSDK (id `herramientas-fase05`) |
| 16 | ETAPA 0 | Canales | WhatsApp / Correo (CRM) (id `whatsapp-fase0`) | Envía Recordatorio | Front Acciones | Recordatorio por WhatsApp/Correo (CRM) (id `recordatorio-fase0`) |
| 17 | ETAPA CONTINUA | Canales | WhatsApp / Correo (CRM) (id `whatsapp-continua`) | Notificaciones | Front Acciones | Notificaciones por WhatsApp/Correo (CRM) (id `recordatorio-continua`) |

## Tabla de flechas horizontales de secuencia (dentro de una misma fila/etapa)

Estas son las flechas índigo que van de una caja a la siguiente caja de la misma fila, casi siempre indicando "avanza a..." o "termina aquí".

| Etapa | Fila | Desde | Etiqueta | Hacia (contexto) |
|---|---|---|---|---|
| PRE-ETAPA | Tarea | Validar operación manual | Ir a Etapa 0 | pasa a la columna ETAPA 0 |
| PRE-ETAPA | Canales | Sumsub | Canales E0 | pasa a Canales de ETAPA 0 |
| PRE-ETAPA | Back stage Acciones | 3. Lotes de Despliegue MVP | BS E0 | pasa a Back stage de ETAPA 0 |
| ETAPA 0 | Tarea | Genera Primera Orden (Venta) | Ir a Etapa 0.5 | pasa a la columna ETAPA 0.5 |
| ETAPA 0 | Canales | WhatsApp / Correo (CRM) | Canales E0.5 | pasa a Canales de ETAPA 0.5 |
| ETAPA 0 | Front Acciones | Sutil: permite navegación total | FS E0.5 | pasa a Front Acciones de ETAPA 0.5 |
| ETAPA 0 | Back stage Acciones | 2. Envíos programados desde el CRM | BS E0.5 | pasa a Back stage de ETAPA 0.5 |
| ETAPA 0.5 | Tarea | Redirección Automática a Sumsub | Ir a Etapa 1 | pasa a la columna ETAPA 1 |
| ETAPA 0.5 | Canales | Sumsub WebSDK | Canales E1 | pasa a Canales de ETAPA 1 |
| ETAPA 0.5 | Front Acciones | Auto-cierre y redirección automática | FS E1 | pasa a Front Acciones de ETAPA 1 |
| ETAPA 0.5 | Back stage Acciones | C. Colombia (bloque completo) | BS E1 | pasa a Back stage de ETAPA 1 |
| ETAPA 1 | Canales | (caja "Termina" junto a UserPilot) | Termina | fin de flujo en esta rama |
| ETAPA 1 | Front Acciones | Si es Criminal (Sumsub): Baneo total | Termina | fin de flujo en esta rama |
| ETAPA 1 | Back stage Acciones | 3. El baneo se ejecuta a mano y al mismo tiempo | Termina | fin de flujo en esta rama |

## Tabla de oportunidades tecnológicas por etapa

*(Carril exclusivo de esta copia "con TI" — no forma parte del HTML/proceso original de Fase 0. Ubicado visualmente entre Herramientas y Stakeholders en cada una de las 5 etapas.)*

| # | Etapa | Oportunidad de automatización (Tecnología → Automatización posible) |
|---|---|---|
| 1 | PRE-ETAPA | Sustituir el Google Sheet por una base de datos interna con API — un sistema central donde el estado de cada usuario se actualiza solo, y que Legal, Financiero, Cartera y CRM consultan en vivo, en vez de editar un documento compartido a mano. Migrar las 3 cargas históricas (ColocaPayments, Cartera, ~115k Truora Colombia) con un proceso automatizado y con registro de errores, en vez de exportar/importar archivos a mano. La config de Sumsub y el ritmo de "Lotes de Despliegue" por país quedan en un archivo controlado — se activan o pausan con un interruptor, sin entrar al panel de Sumsub cada vez. |
| 2 | ETAPA 0 | En cuanto un usuario se registra, el sistema de Dropi le avisa automáticamente a UserPilot (una señal interna que dispara la acción sola, sin que nadie la active a mano) para etiquetarlo como "Usuario Nuevo" — hoy alguien filtra esa lista manualmente por fecha. Los recordatorios de WhatsApp/correo se programan solos según cuántos días lleve el usuario sin verificarse, en vez de que CRM los agende a mano. |
| 3 | ETAPA 0.5 | Un sistema interno responde automáticamente qué enlace de Sumsub le corresponde a cada país y tipo de cuenta — reemplaza la tabla "DOC ENLACES" que hoy alguien consulta a mano. En cuanto Sumsub recibe el caso, le avisa solo al sistema de Dropi (webhook: una notificación automática entre sistemas, sin que nadie la escriba) y el estado se actualiza al instante, sin esperar semanas a que Legal lo revise en Etapa Continua. Para Marcas Blancas, el enlace se envía solo por WhatsApp/Intercom, sin que Soporte lo copie y pegue a mano. |
| 4 | ETAPA 1 | El script de Cartera deja de correrse a mano: se ejecuta solo, por horario o apenas detecta un saldo negativo, y se conecta directo con UserPilot para activar el bloqueo. Un sistema central hace el baneo en los 5 países a la vez automáticamente (hoy se hace uno por uno, a mano, cruzando correo y documento), dejando registro de auditoría. Si Sumsub detecta un delito grave, el caso para Legal/Financiero ya llega armado con el monto y la cuenta externa, para que solo falte decidir. |
| 5 | ETAPA CONTINUA | En cuanto Sumsub termina de revisar un caso, le avisa automáticamente al sistema de Dropi (webhook: aviso automático entre sistemas, sin intervención humana) y el estado se actualiza solo — hoy Legal tiene que entrar a Sumsub, descargar la lista y actualizar el Google Sheet a mano, lo que genera el mayor atraso del proceso. Ese mismo aviso apaga el pop-up en UserPilot si el usuario quedó Aprobado, y manda el WhatsApp/correo correspondiente sin que Admin ni CRM tengan que hacerlo. La revisión tributaria de Financiero sigue siendo una decisión humana, pero los datos ya le llegan organizados en un tablero, sin tener que buscarlos. |

## Notas finales

- El diagrama no tiene ninguna caja o fila adicional fuera de las 5 etapas y 7 carriles descritos arriba — esta transcripción cubre el 100% del contenido textual del HTML, incluyendo los dos tooltips (`title="..."`) que solo son visibles al pasar el mouse sobre los botones de anotación "!" (uno en "Modal Interceptor Recurrente/Spam Visual" de Etapa 0.5, otro en "DOC ENLACES" de Etapa 0.5 — este último ya transcrito en la sección de esa etapa). **Nota de esta copia "con TI":** a diferencia del HTML/proceso original de Fase 0 (que solo tiene 7 carriles), esta copia sí agrega un 8vo carril — "Tecnología → Automatización posible" — visible entre Herramientas y Stakeholders en las 5 etapas del `Service_Blueprint_Diagrama con TI.html`; es una propuesta de automatización a futuro, no forma parte del proceso Fase 0 vigente.
- Terminología estandarizada (mesa 9-jul): Etapa 0.5 usa "Interceptor Recurrente / Spam Visual" y Etapa 1 usa "Bloqueo Visual / Spam Recurrente — Sin Salida" para dejar explícito ante TI y Legal que ningún modal congela fondos a nivel de código — es UserPilot interceptando la pantalla del front-end. Etapa 0.5 reaparece en cada intento; Etapa 1 es persistente hasta resolución de Legal/Financiero.
- **Robustez ante AdBlockers:** UserPilot no puede ser evadido por bloqueadores de anuncios — el modal interceptor es robusto e ineludible en el frontend. Si el usuario no hace clic para ir a Sumsub, no puede avanzar. Esto aplica a todos los modales de UserPilot del diagrama (Etapa 0.5 y Etapa 1).
- **100% No-Code / Sin integraciones:** el MVP no usa APIs, Zapier ni HubSpot. Toda la operación (segmentación, envíos, actualización de estados) se hace a mano: CRM genérico para envíos, UserPilot para segmentación visual, y un Google Sheet compartido (Legal, Admin, Cartera, CRM, Financiero) como fuente única de estados de validación.
- **CRM visible en Front stage (WhatsApp):** el trabajo del CRM es interno (Back stage), pero su resultado sí le llega al usuario — como mensaje de WhatsApp (y correo, en Etapa 0). Por eso Etapa 0 y Etapa Continua ahora tienen su propia caja de Canales/Acciones para ese recordatorio, en vez de dejarlo implícito solo en Back stage.
- **Notificación de Aprobado, no solo modal efímero:** el modal "¡Cuenta verificada!" desaparece solo en 4-5 segundos — fácil de perderse. Por eso, cuando el estado pasa a Aprobado, CRM también envía un mensaje por WhatsApp/correo: cumple la promesa hecha en el modal Pendiente ("te avisaremos apenas esté lista") y funciona como gancho de reactivación para que el usuario vuelva a usar Dropi.
- **Tres tipos de "Pendiente" (no uno solo):** (1) **En revisión de Financiero** — Sumsub ya recibió todo, falta la auditoría tributaria interna; el usuario no tiene que hacer nada. (2) **Incompleto en Sumsub** — el usuario inició el proceso pero no lo terminó; necesita volver y completarlo. (3) **Nunca inició** — el usuario ni siquiera dio clic a "Validar identidad". Solo (1) y (2) aparecen en el Google Sheet, porque solo esos generan un caso dentro de Sumsub. El caso (3) no tiene Backstage propio: ya está cubierto por el Modal Interceptor Recurrente de Etapa 0.5, que sigue reapareciendo cada vez que el usuario intenta una acción sin haber llegado nunca a Sumsub — nunca entra en el flujo de Etapa Continua.
- **Persona Natural/Empresa ya no es pregunta de UserPilot:** el modal interceptor de Etapa 0.5 solo intercepta y redirige — no bifurca. La pregunta de si el usuario es Persona Natural o Empresa se eliminó del modal y del flujo de Tarea/Front stage porque esa distinción ya la hace Sumsub dentro de su propio formulario (ver Back stage → DOC ENLACES, donde A/B/C ya distinguen requisitos por tipo de cuenta). Ya no es un rombo de decisión de UserPilot.
- **Migración Truora Colombia (~115k) vs motores en Colombia:** la PRE-ETAPA importa ~115.000 usuarios colombianos ya validados con Truora a Sumsub (carga histórica silenciosa, reduce costos de re-validación). En Colombia (DOC ENLACES bloque C): todos validan **KYC/identidad (Truora)** + **datos de facturación (Sumsub)** — natural o jurídica. UserPilot alerta para completar facturación/KYB. El enlace SAC de opción 5-CO es Sumsub facturación, no Truora.
- **Trigger "Recargar" (actualización jul-2026):** el clic en **Recargar** en wallet ahora dispara el interceptor de Etapa 0.5. Esto actualiza la Regla de Validación Nula de `Consideraciones.md` para usuarios activos que intentan recargar sin verificarse; el registro inicial sigue sin exigir documento.
- **Cruce multipaís correo + DNI (Andrés Herrera):** el baneo simultáneo en CO/CL/EC/PE/VE cruza por **correo y documento de identidad (DNI)**, porque una misma persona puede operar con múltiples correos. El script Python de Cartera aplica el mismo criterio.
- **Bifurcación Datos Bancarios GT/PA:** en Guatemala y Panamá, "Registro de Datos Bancarios" no usa el modal interceptor UserPilot sino el **modal exclusivo** ya existente en Dropi para validar titulares de cuenta; debe enlazarse al link Sumsub del país. En el resto de países, sigue el interceptor UserPilot estándar.
- Los íconos SVG decorativos (el ícono de sobre/correo usado en la caja "CRM" de PRE-ETAPA) no llevan texto propio, se describen aquí solo como "(ícono de correo)".
- Para el detalle de qué corrección de negocio motivó cada texto (fuente: `Consem2.md`, `Historia.md`, `Consideraciones.md`, Tabla Fase 0.csv, mesa técnica del 7 de julio), ver el historial de la conversación donde se auditó y corrigió este blueprint — este documento es una transcripción fiel del estado actual del HTML, no un análisis de por qué dice lo que dice.
- **Enrutamiento de soporte (Bloqueo, Pendiente-en-revisión, Rechazado):** los 3 puntos de contacto del blueprint NO abren el widget de soporte automáticamente — no existe esa integración técnica —; su copy solo le indica al usuario que puede contactar a soporte por su cuenta, y nombra el chip raíz existente **"Validación de identidad"** como punto de entrada textual, orientando a la opción específica del árbol según el caso — Bloqueo → **"Mi cuenta está bloqueada"**, Pendiente-en-revisión → **"Mi verificación sigue en revisión"**, Rechazado → **"Me rechazaron la verificación"**. Es un deep-link por texto (no por integración): la orientación depende del copy de cada modal, no de una integración. Pendiente-en-revisión tiene un botón secundario "Contactar a soporte" junto a "Entendido" (antes no ofrecía ninguna vía de contacto). El árbol completo de 8 opciones que ese widget debe resolver para este flujo vive directamente en **Etapa 1 → Front stage → Acciones** (ítems 2-4: Widget de Soporte, Árbol de opciones, Escalamiento) — ya no en un documento aparte.

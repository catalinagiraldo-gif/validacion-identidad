# Service Blueprint — Diagrama (KYC y Mitigación de Riesgo MVP)

> Transcripción textual completa de `Service_Blueprint_Diagrama.html`. El HTML original es un diagrama visual de swimlanes (grilla con columnas = fases del proyecto y filas = carriles de servicio, con flechas conectando pasos). Este documento traduce esa misma información a texto plano, en orden de lectura, sin omitir ningún contenido (incluye tooltips/anotaciones ocultas y todas las etiquetas de las flechas), para que cualquier LLM sin capacidad de renderizado visual pueda leerlo completo.

## Cómo está organizado el diagrama original

- **Columnas (5 fases, de izquierda a derecha):** PRE-FASE (Setup) → FASE 0 (Nuevos) → FASE 0.5 (Activos) → FASE 1 (Bloqueo) → FASE CONTINUA (Semanal).
- **Filas (carriles de servicio, de arriba hacia abajo):**
  1. **Usuarios** — segmento de usuario al que aplica esa fase.
  2. **Tarea** — la secuencia de pasos que ocurre, en orden horizontal (cada paso es una caja, conectada por flechas horizontales a la siguiente).
  3. **Front stage → Canales** — por dónde le llega la intervención al usuario (UserPilot, CRM, Sumsub, etc.).
  4. **Front stage → Acciones** — qué ve/hace el usuario específicamente en pantalla.
  5. **Back stage → Acciones** — qué hace el equipo interno (Legal, Financiero, TI, Cartera, Admin) sin que el usuario lo vea.
  6. **Herramientas** — qué sistemas/software soportan esa fase.
  7. **Stakeholders** — qué rol/persona es responsable de qué parte.
- **Conectores verticales entre filas:** además de las flechas horizontales dentro de una misma fila (secuencia de la Tarea), hay flechas verticales que saltan de una fila a la fila inmediatamente inferior (p. ej. de "Tarea" a "Canales", de "Canales" a "Acciones", de "Acciones" a "Back stage"), señalando qué paso de una fila dispara qué paso de la fila siguiente. Estas se listan explícitamente en cada fase con la etiqueta que llevan en el diagrama (ej. "→ [Silenciado] →").
- **Convención de color observada en las cajas** (no es una leyenda explícita en el HTML, se infiere del uso consistente):
  - 🟢 **Verde** (`#C3F4D4`/`#70D998`): pantalla o hito positivo que ve/vive el usuario (ej. "Usuario Nuevo entra al Dashboard", "Estado: Aprobado").
  - 🟣 **Morado/lavanda** (`#EAD9FF`/`#C495FF`): acción de sistema o de backoffice, no es una pantalla (ej. "Migración de base interna", "Sumsub Verifica Liveness").
  - 🔵 **Azul** (`#D1E8FF`/`#73B8FF`): un modal o intervención directa de UserPilot sobre la pantalla del usuario (ej. "Intercepta: Modal UserPilot", "Freno Seco: Modal Full-Screen").
  - 🔴 **Rojo** (`#FFD6D6`/`#FF8080`): el motor externo Sumsub (o una acción crítica asociada, como el baneo).
  - 🟡 **Rombo amarillo** (`#FFF3CD`/`#FFD966`, rotado 45°): punto de decisión/bifurcación del usuario o del sistema.
  - ⚪ **Gris** (`#E5E7EB`/`#9CA3AF`): canal pasivo/silencioso (ej. el ícono de correo "CRM").
  - Las flechas teal (verde azulado) son los conectores verticales entre filas; las flechas índigo son las flechas horizontales de secuencia dentro de una misma fila.

---

## PRE-FASE: Preparación y Setup

**Usuarios:** Equipo interno (Setup) y Usuarios a migrar.

**Tarea** (secuencia horizontal):
1. ⚫ Inicio
2. 🟣 Migración de Bases Históricas: se exporta en formato ZIP/Excel la base temporal de ColocaPayments (usuarios ya validados, solo Guatemala y Panamá) y el repositorio interno de Cartera (validados históricos multipaís) — ambos se cargan en Sumsub.
3. 🟣 Setup Manual: configuración de Google Sheets y campañas en UserPilot. — *(conector vertical hacia Canales, etiqueta "Activa Setup")*
4. 🟢 Validar operación manual — *(flecha horizontal índigo: "Ir a Fase 0")*

**Front stage → Canales:**
1. ⚪ CRM (ícono de correo) — *(conector vertical hacia Back stage, etiqueta "Silenciado")*
2. 🔵 UserPilot — *(conector vertical hacia Back stage, etiqueta "Silenciado")*
3. 🔴 Sumsub — *(flecha horizontal índigo: "Canales F0")*

**Front stage → Acciones:** Ninguna intervención visual. Proceso invisible.

**Back stage → Acciones:**
- 🟣 1. [PROCESO MANUAL] Definición operativa en Google Sheets: Legal, Admin, Cartera y CRM comparten un mismo documento donde actualizan a mano los estados de validación — sin usar Zapier, HubSpot ni ninguna integración por API.
- 🟣 2. [NO-CODE] Config Sumsub: prioridad a la existencia legal sobre la detección de IA.
- 🟣 3. [NO-CODE] Lotes de Despliegue MVP: se activan las campañas de UserPilot para interceptar usuarios, priorizando los países que hoy no tienen módulo de facturación (Guatemala, Panamá, Paraguay, Perú). Se regula el volumen para que Financiero/Legal puedan auditar a mano sin colapsarse. — *(flecha horizontal índigo: "BS F0")*

**Herramientas:** CRM · UserPilot · Sumsub · Google Sheets.

**Stakeholders:**
- **Legal** — Google Sheet compartido y config. Sumsub.
- **Financiero** — Lotes de Despliegue.

---

## FASE 0: Onboarding Suave

**Usuarios:** Usuarios Nuevos sin historial — entran por primera vez al Home/Dashboard de Dropi.

**Tarea** (secuencia horizontal):
1. ⚫ Inicio — *(conector vertical hacia Canales, etiqueta "Inicia Onboarding")*
2. 🟢 Usuario Nuevo entra al Dashboard
3. 🟣 Explora Catálogo (sin bloqueos)
4. 🔵 Cierra Banner Lateral "Seguridad"
5. 🟢 Genera Primera Orden (Venta) — *(flecha horizontal índigo: "Ir a Fase 0.5")*

**Front stage → Canales:**
1. 🔵 UserPilot — *(conector vertical hacia Acciones, etiqueta "Muestra Banner")*
2. ⚪ Correo (CRM) (ícono de correo) — *(flecha horizontal índigo: "Canales F0.5")*

**Front stage → Acciones:**
1. 🔵 Panel Lateral (aparece al entrar al Home por primera vez) — Headline: **"Verifica tu cuenta"**. Body: *"Es el paso que necesitas completar para retirar tu dinero o hacer transferencias entre tus wallets."* Botón: **"Verificar ahora"**. Ocupa 25% de pantalla, con botón 'X' visible (`aria-label="Cerrar, verificar más tarde"`). *(Sin incentivo monetario aquí — es solo pedagógico. El bono de fletes, masterclasses y "Kit Dropi" es exclusivo de "Semana de la Seguridad" en Fase 0.5/Activos-Riesgo. Fuente: mesa 7-jul, Consideraciones.md. Copy alineada con `Historia.md`: la validación "se vuelve obligatoria cuando el usuario intenta su primer retiro o transferencia entre wallets" — el banner adelanta esa razón real desde el Home, en vez de dar un motivo genérico. Headline en imperativo singular ("Verifica", no "Verifiquemos"): la acción es responsabilidad del usuario, no una tarea compartida. Justificación completa: ver `UX-Writing-Modales-UserPilot.md`)*
2. 🟣 Sutil: Permite navegación total. Usuario puede ignorarlo y seguir comprando — pero si hace clic en "Transferir Wallet", "Registro de Datos Bancarios" o "Solicitud DropiCard" antes de verificarse, salta directo al modal interceptor de Fase 0.5: mismo trato que un usuario Activo, sin importar que sea Nuevo. — *(flecha horizontal índigo: "FS F0.5")*

**Back stage → Acciones:**
- 🟣 1. [MANUAL] Segmentación visual en UserPilot: filtra a los usuarios por fecha de registro para aislar a los Nuevos.
- 🟣 2. [MANUAL] Envíos programados desde el CRM con correos de educación en seguridad (cadencia y tema exactos por confirmar — Tabla Fase 0.csv solo dice "semanales"). — *(flecha horizontal índigo: "BS F0.5")*

**Herramientas:** UserPilot · CRM.

**Stakeholders:**
- **Product Designer** — Banner.
- **CRM** — Flujos.

---

## FASE 0.5: Trigger Transaccional (Activos)

**Usuarios:** Usuarios Activos (Dropshippers / Proveedores) — y también Usuarios Nuevos, si intentan estas mismas acciones (Transferir Wallet, Registro de Datos Bancarios, Solicitud DropiCard) antes de verificarse en Fase 0. El disparador es la acción, no la antigüedad de la cuenta: reciben el mismo modal interceptor.

**Tarea** (secuencia horizontal):
1. 🟢 Dropshipper en Módulo Financiero
2. 🟣 Clic: "Transferir Wallet", "Registro de Datos Bancarios" o "Solicitud DropiCard" *(Growth Ops: interceptar en "Registro de Datos Bancarios" evita que el usuario configure una cuenta sin validarse — es el paso previo al retiro real)* — *(conector vertical hacia Canales, etiqueta "Intercepta Clic")*
3. 🔵 Intercepta: Modal UserPilot (Interceptor Recurrente / Spam Visual)
4. 🟡 **[Decisión/rombo]** Elige: "Soy persona natural" o "Soy una empresa"
5. 🔴 Redirección Automática a Sumsub — *(flecha horizontal índigo: "Ir a Fase 1")*

**Front stage → Canales:**
1. 🔵 UserPilot — *(conector vertical hacia Acciones, etiqueta "Despliega")*
2. 🔴 Sumsub WebSDK — *(flecha horizontal índigo: "Canales F1")*

**Front stage → Acciones:**
1. 🔵 Modal Interceptor Recurrente (Spam Visual / No-Code) — Headline: **"Verifica tu identidad para continuar"**. Body: *"Antes de mover fondos necesitamos confirmar quién eres. Elige el tipo de cuenta que tienes en Dropi para seguir con la verificación."* Botones: **"Soy persona natural"** / **"Soy una empresa"**. El texto no varía entre reapariciones (evita apariencia de manipulación). Sin botón 'X' ni 'Continuar', obliga a ir a Sumsub. ⚠️ Atención Legal y Financiero: este pop-up es ineludible — UserPilot NO puede ser evadido por AdBlockers. Aunque no es un bloqueo a nivel de código backend, intercepta obligatoriamente la pantalla del usuario; si intenta evadirlo, el modal reaparecerá infinitamente hasta que complete la validación. *(tiene un botón de anotación "!" — ver tooltip completo en la sección Back stage de esta misma fase, punto 15 de la tabla de conectores. Copy y justificación de tono: ver `UX-Writing-Modales-UserPilot.md`)* — *(conector vertical hacia Back stage, etiqueta "Tracking")*
2. 🟡 **[Decisión/rombo]** Muestra dos opciones ("Soy persona natural" / "Soy una empresa")
3. 🟣 Auto-cierre y redirección automática — *(flecha horizontal índigo: "FS F1")*

**Back stage → Acciones:**
- 🟣 "📝 DOC ENLACES (SUMSUB FORMS)" — caja con anotación (botón "!") que define qué le pide Sumsub a cada país y tipo de cuenta:
   - **Tooltip del botón "!":** *"Arranque real del MVP (Consem2, mesa 7-jul): solo Guatemala, Panamá, Paraguay y Perú. El resto de esta lista (MX, VE, CR, Europa) se solicita a Sumsub en el setup pero entra de forma gradual (despliegue gradual, Consem2 punto 6) — no es el arranque. El bloque C (Colombia) está en evaluación, ver su propia nota."*
   - **A. Largo (GT, PA, PY, PE, MX, VE, CR, Europa):** persona natural — prueba de vida (liveness) + documento de identidad + datos fiscales. Empresa — prueba de vida del representante legal + búsqueda de la empresa + datos fiscales.
   - **B. Corto (CL, EC, AR):** persona natural — solo prueba de vida + documento de identidad. Empresa — solo prueba de vida del representante legal + documento de la empresa.
   - **C. Colombia (en evaluación, mesa 7-jul):** solo aplica a empresas, vía KYB de Sumsub — prueba de vida del representante legal + cédula del representante legal + razón social + NIT + RUT + cámara de comercio. Las personas naturales siguen validándose con Truora, fuera de este enlace.
   - **D. Marcas Blancas (White-label links):** enlace de Sumsub sin el branding de Dropi. Soporte lo envía a mano por WhatsApp o Intercom — estos usuarios no reciben pop-ups automáticos de UserPilot. **Atención Soporte/Comercial:** ustedes son responsables de enviarlo durante la atención al cliente. — *(flecha horizontal índigo: "BS F1")*

**Herramientas:** UserPilot · Sumsub WebSDK.

**Stakeholders:**
- **PD / Growth** — Rediseño de modal.
- **Legal/Financiero** — Validación de reglas documentales.
- **Soporte** — Envío manual del Enlace D a usuarios de Marcas Blancas.

---

## FASE 1: Bloqueo y Rechazos

**Usuarios:** Usuarios con saldos negativos o fraude.

**Tarea** (secuencia horizontal):
1. 🟢 Usuario Negativo/Sospechoso en Financiero
2. 🟣 Intenta Ejecutar Retiro o Envío — *(conector vertical hacia Canales, etiqueta "Atrapa Solicitud")*
3. 🔵 Freno Seco: Modal Full-Screen (Bloqueo Visual / Spam Recurrente — Sin Salida) — *(flecha horizontal índigo: "Termina Flujo")*

**Front stage → Canales:**
1. 🔵 UserPilot — *(conector vertical hacia Acciones, etiqueta "Bloquea")*
2. *(caja con badge "Termina" — flecha horizontal índigo, sin caja de destino adicional en esta fila)*

**Front stage → Acciones:**
1. 🔵 Modal Pantalla Completa — Headline: **"Bloqueamos esta operación por seguridad"**. Body: *"Estamos revisando tu cuenta para proteger tus fondos. No podrás hacer retiros ni envíos mientras dure la revisión."* Botón único: **"Contactar a soporte"** (evita dejar al usuario sin ninguna acción disponible). Sin botón de cierre — permanece hasta que Legal/Financiero resuelvan el caso. (Bloqueo Visual: no congela el saldo por código, es UserPilot interceptando la pantalla. Copy y justificación de tono: ver `UX-Writing-Modales-UserPilot.md`) — *(conector vertical hacia Back stage, etiqueta "Reglas")*
2. 🟣 Si es Criminal (Sumsub): Baneo total de IP y cuenta. — *(flecha horizontal índigo: "Termina")*

**Back stage → Acciones:**
- 🟣 1. Cartera (Andrés Herrera) corre un script interno en Python que cruza bases de datos para detectar saldo negativo o fraude por país, y con eso lanza campañas focalizadas en UserPilot.
- 🟣 2. Si Sumsub rechaza el caso por un delito grave (lavado de activos, listas restrictivas), Legal y Financiero se reúnen y devuelven el dinero del usuario a una cuenta externa.
- 🟣 3. El baneo se ejecuta a mano y al mismo tiempo en Colombia, Chile, Ecuador, Perú y Venezuela (cruzando por correo). El bloqueo en registro o login con correo baneado todavía no tiene pantalla propia (regla de negocio RN-16/17, pendiente de diseño). — *(flecha horizontal índigo: "Termina")*

**Herramientas:** UserPilot · Python (Cartera).

**Stakeholders:**
- **Cartera** — Listas negativas.
- **Legal/Financiera** — Reembolsos y baneos.

---

## FASE CONTINUA: Operación Semanal

**Usuarios:** Usuarios que iniciaron validación.

**Tarea** (secuencia horizontal):
1. ⚫ Inicio — *(conector vertical hacia Canales, etiqueta "Solicita Datos")*
2. 🟣 Sumsub Verifica Liveness y Tributario
3. 🟡 **[Decisión/rombo]** Legal descarga estados de Sumsub y actualiza el Google Sheet (manual)
4. 🟢 Estado: Aprobado, Pendiente o Rechazado

**Front stage → Canales:**
1. 🔴 Sumsub Backoffice — *(conector vertical hacia Acciones, etiqueta "Datos")*
2. 🔵 UserPilot

**Front stage → Acciones:**
1. 🟢 🟩 APROBADO: Modal muestra **"¡Cuenta verificada!"** — *"Ya puedes transferir tu wallet, registrar tus datos bancarios y pedir tu DropiCard."* Desaparece solo a los 4-5 segundos. — *(conector vertical hacia Back stage, etiqueta "Auditoría")*
2. 🔵 🟦 PENDIENTE: Modal muestra **"Tu verificación sigue en proceso"** — *"Puede tardar hasta 72 horas hábiles. Te avisaremos por correo apenas esté lista — no necesitas hacer nada más."* Botón: **"Entendido"**. 🟥 RECHAZADO: Modal muestra **"No pudimos verificar tu identidad"** — *"Por seguridad, restringimos las operaciones de esta cuenta. Si crees que es un error, contáctanos y lo revisamos."* Botón: **"Contactar a soporte"** — luego expulsión (ver Fase 1). *(Copy y justificación de tono: ver `UX-Writing-Modales-UserPilot.md`)*

**Back stage → Acciones:**
- 🟣 1. **[PROCESO 100% MANUAL — EL CUELLO DE BOTELLA]**
   - **Descarga:** Legal descarga los estados desde el backoffice de Sumsub.
   - **Actualización en Google Sheets:** Legal actualiza a mano el Google Sheet compartido, marcando quién está Aprobado, Pendiente o Rechazado.
   - **Ejecución:** con base en ese Sheet, Admin apaga el pop-up de UserPilot a los Aprobados, CRM reenvía mensajes a los Pendientes insistiendo en la validación, y Financiero audita los datos tributarios cruzados contra Dropi.
   - **Capacidad:** el lanzamiento es país por país (ver "Lotes de Despliegue", PRE-FASE). Si se acumulan pendientes, Financiero o Legal avisan para pausar las campañas de UserPilot.
- 🟣 2. ⚠️ SLA para Soporte: como la actualización es 100% manual por Google Sheets, el pop-up no desaparece apenas se aprueba. Soporte debe avisarle a los usuarios ya validados que la pantalla puede tardar entre 48 y 72 horas hábiles en actualizarse.
- 🟣 3. Soporte (Daniela/Juan) desbanea la cuenta si resulta ser un falso positivo.

**Herramientas:** Sumsub Backoffice · Google Sheets · UserPilot · CRM.

**Stakeholders:**
- **Legal** — Descarga y actualiza el Google Sheet.
- **Admin** — Actualiza UserPilot según el Sheet.
- **CRM** — Reenvía mensajes a Pendientes.
- **Financiero** — Auditoría de datos tributarios.
- **Soporte** — Informa el SLA de 48–72h a validados.

---

## Tabla completa de conectores verticales (entre filas)

Cada fila representa una flecha vertical (teal) que va de una caja de una fila a una caja de la fila inmediatamente inferior, dentro de la misma fase.

| # | Fase | Fila origen | Caja origen (texto) | Etiqueta de la flecha | Fila destino | Caja destino (texto) |
|---|---|---|---|---|---|---|
| 1 | PRE-FASE | Tarea | Setup Manual: Google Sheets + UserPilot | Activa Setup | Canales | UserPilot (id `userpilot-pre`) |
| 2 | FASE 0 | Tarea | Inicio (círculo) | Inicia Onboarding | Canales | UserPilot (id `userpilot-fase0`) |
| 3 | FASE 0.5 | Tarea | Clic: "Transferir Wallet", "Registro de Datos Bancarios" o "Solicitud DropiCard" | Intercepta Clic | Canales | UserPilot (id `userpilot-fase05`) |
| 4 | FASE 1 | Tarea | Intenta Ejecutar Retiro o Envío | Atrapa Solicitud | Canales | UserPilot (id `userpilot-fase1`) |
| 5 | FASE CONTINUA | Tarea | Inicio (círculo) | Solicita Datos | Canales | Sumsub Backoffice (id `sumsub-continua`) |
| 6 | PRE-FASE | Canales | CRM (ícono correo) | Silenciado | Back stage Acciones | 1. Google Sheets compartido... (id `piloto-tecnico`) |
| 7 | PRE-FASE | Canales | UserPilot (id `userpilot-pre`) | Silenciado | Back stage Acciones | 2. Config Sumsub... (id `config-sumsub`) |
| 8 | FASE 0 | Canales | UserPilot (id `userpilot-fase0`) | Muestra Banner | Front Acciones | Panel Lateral: "Verifica tu cuenta" (id `panel-lateral`) |
| 9 | FASE 0.5 | Canales | UserPilot (id `userpilot-fase05`) | Despliega | Front Acciones | Modal Interceptor Recurrente/Spam Visual... (id `modal-optimizado`) |
| 10 | FASE 1 | Canales | UserPilot (id `userpilot-fase1`) | Bloquea | Front Acciones | Modal Pantalla Completa... (id `modal-pantalla`) |
| 11 | FASE CONTINUA | Canales | Sumsub Backoffice (id `sumsub-continua`) | Datos | Front Acciones | 🟩 APROBADO... (id `aprobado`) |
| 12 | FASE 0.5 | Front Acciones | Modal Interceptor Recurrente/Spam Visual... (id `modal-optimizado`) | Tracking | Back stage Acciones | DOC ENLACES (SUMSUB FORMS) (id `event-tracking`) |
| 13 | FASE 1 | Front Acciones | Modal Pantalla Completa... (id `modal-pantalla`) | Reglas | Back stage Acciones | 1. Cartera (Andrés Herrera)... (id `python-script`) |
| 14 | FASE CONTINUA | Front Acciones | 🟩 APROBADO... (id `aprobado`) | Auditoría | Back stage Acciones | 1. [PROCESO 100% MANUAL] Descarga y Google Sheet... (id `financiero-continua`) |
| 15 | FASE 0.5 | Back stage Acciones | DOC ENLACES (SUMSUB FORMS) (id `event-tracking`) | Legal | Herramientas | UserPilot · Sumsub WebSDK (id `herramientas-fase05`) |

## Tabla de flechas horizontales de secuencia (dentro de una misma fila/fase)

Estas son las flechas índigo que van de una caja a la siguiente caja de la misma fila, casi siempre indicando "avanza a..." o "termina aquí".

| Fase | Fila | Desde | Etiqueta | Hacia (contexto) |
|---|---|---|---|---|
| PRE-FASE | Tarea | Validar operación manual | Ir a Fase 0 | pasa a la columna FASE 0 |
| PRE-FASE | Canales | Sumsub | Canales F0 | pasa a Canales de FASE 0 |
| PRE-FASE | Back stage Acciones | 3. Lotes de Despliegue MVP | BS F0 | pasa a Back stage de FASE 0 |
| FASE 0 | Tarea | Genera Primera Orden (Venta) | Ir a Fase 0.5 | pasa a la columna FASE 0.5 |
| FASE 0 | Canales | Correo (CRM) | Canales F0.5 | pasa a Canales de FASE 0.5 |
| FASE 0 | Front Acciones | Sutil: permite navegación total | FS F0.5 | pasa a Front Acciones de FASE 0.5 |
| FASE 0 | Back stage Acciones | 2. Envíos programados desde el CRM | BS F0.5 | pasa a Back stage de FASE 0.5 |
| FASE 0.5 | Tarea | Redirección Automática a Sumsub | Ir a Fase 1 | pasa a la columna FASE 1 |
| FASE 0.5 | Canales | Sumsub WebSDK | Canales F1 | pasa a Canales de FASE 1 |
| FASE 0.5 | Front Acciones | Auto-cierre y redirección automática | FS F1 | pasa a Front Acciones de FASE 1 |
| FASE 0.5 | Back stage Acciones | C. Colombia (bloque completo) | BS F1 | pasa a Back stage de FASE 1 |
| FASE 1 | Canales | (caja "Termina" junto a UserPilot) | Termina | fin de flujo en esta rama |
| FASE 1 | Front Acciones | Si es Criminal (Sumsub): Baneo total | Termina | fin de flujo en esta rama |
| FASE 1 | Back stage Acciones | 3. El baneo se ejecuta a mano y al mismo tiempo | Termina | fin de flujo en esta rama |

## Notas finales

- El diagrama no tiene ninguna caja o fila adicional fuera de las 5 fases y 7 carriles descritos arriba — esta transcripción cubre el 100% del contenido textual del HTML, incluyendo los dos tooltips (`title="..."`) que solo son visibles al pasar el mouse sobre los botones de anotación "!" (uno en "Modal Interceptor Recurrente/Spam Visual" de Fase 0.5, otro en "DOC ENLACES" de Fase 0.5 — este último ya transcrito en la sección de esa fase).
- Terminología estandarizada (mesa 9-jul): Fase 0.5 usa "Interceptor Recurrente / Spam Visual" y Fase 1 usa "Bloqueo Visual / Spam Recurrente — Sin Salida" para dejar explícito ante TI y Legal que ningún modal congela fondos a nivel de código — es UserPilot interceptando la pantalla del front-end. Fase 0.5 reaparece en cada intento; Fase 1 es persistente hasta resolución de Legal/Financiero.
- **Robustez ante AdBlockers:** UserPilot no puede ser evadido por bloqueadores de anuncios — el modal interceptor es robusto e ineludible en el frontend. Si el usuario no hace clic para ir a Sumsub, no puede avanzar. Esto aplica a todos los modales de UserPilot del diagrama (Fase 0.5 y Fase 1).
- **100% No-Code / Sin integraciones:** el MVP no usa APIs, Zapier ni HubSpot. Toda la operación (segmentación, envíos, actualización de estados) se hace a mano: CRM genérico para envíos, UserPilot para segmentación visual, y un Google Sheet compartido (Legal, Admin, Cartera, CRM, Financiero) como fuente única de estados de validación.
- Los íconos SVG decorativos (el ícono de sobre/correo usado en las cajas "CRM" y "Correo (CRM)") no llevan texto propio, se describen aquí solo como "(ícono de correo)".
- Para el detalle de qué corrección de negocio motivó cada texto (fuente: `Consem2.md`, `Historia.md`, `Consideraciones.md`, Tabla Fase 0.csv, mesa técnica del 7 de julio), ver el historial de la conversación donde se auditó y corrigió este blueprint — este documento es una transcripción fiel del estado actual del HTML, no un análisis de por qué dice lo que dice.

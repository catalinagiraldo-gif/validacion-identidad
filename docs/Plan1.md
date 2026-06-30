# Spec de prototipo — Flujo de validación de identidad (Dropi)

Fecha: 2026-06-18
Para: prompt/plan de construcción en Claude Code
Basado en: evaluación heurística + WCAG + benchmark (Sumsub/Veriff/Onfido/GOV.UK/Binance/Wise/Mercado Libre) + propuesta de rediseño 8.1–8.7 del documento `Validacion_identidad_evaluacion_UX_propuesta.docx`, y los flujos del FigJam "Validación de identidad" (board `89yfrFN1cQa4hI9cshybpH`).

## Cómo usar este documento

Cada bloque "Vista" describe una pantalla o modal del prototipo, en el orden en que aparecen en el flujo. Está pensado para pegarse directamente como prompt/spec en Claude Code, vista por vista o completo. El orden de las vistas es el recorrido natural del usuario: entrada → datos actuales → solicitud de cambio → verificación → formulario → confirmación → validación con Sumsub → estado de resultado.

## Roles

Persona natural (KYC) y persona jurídica (KYB) comparten las mismas vistas; el formulario y el módulo fiscal cambian campos según `tipo_persona` y `país`. En el template de cada vista se usa el rol `dropshipper | proveedor` porque ambos tipos de cuenta pasan por esta validación.

## Limitación de Figma (léase antes de construir)

Los nodos `85:1189` y `96:6712` del FigJam no pudieron recuperarse en esta sesión (timeout de `get_figjam` agotado dos veces; `get_screenshot` genera una URL pero el entorno de esta sesión bloquea la descarga de `figma.com`). Los nodos `99:9408` (diagrama de flujo actual) y `115:12752` (matriz de campos por país) sí se recuperaron completos y se usan como referencia de lógica/datos en este spec — pero son un diagrama de flujo y una tabla, no mockups de alta fidelidad. Ninguna vista de este spec tiene un mockup visual pixel-perfect disponible; el diseño visual de cada pantalla queda abierto a construirse a partir de la descripción funcional de cada Vista. Si se recupera el contenido de 85:1189/96:6712 más adelante, hay que revisar este spec contra esos nodos.

---

### Vista 1
- Nombre: Entrada y encuadre del beneficio
- Módulo: identidad > entrada
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
  (referencia de lógica del flujo actual; no existe mockup visual — vista nueva propuesta en la sección 8.1 del documento de evaluación UX)
- Nodos adicionales: N/D

### Tipo de vista
- [x] Página completa (page) — interstitial/banner mostrado la primera vez que el usuario entra a un flujo que requiere identidad validada (p. ej. antes de retirar dinero o activar facturación)

### Datos mock
- Entidad principal: usuario (nombre, tipo_persona, país, estado_validación: "sin_iniciar")
- Cantidad mínima de items: 1 (vista de un solo usuario logueado)
- Propiedades importantes: nombre, beneficio bloqueado (ej. "retiros", "facturación automática"), tiempo estimado ("~5 min"), CTA principal
- ¿Hay imágenes en el diseño de Figma?: no (no hay mockup disponible; usar ilustración genérica o ícono)

### Interacciones clave
- Explica en una frase qué se gana al validar (ej. "Valida tu identidad para empezar a retirar tus ganancias") y cuánto tarda, sin tecnicismos de KYC/KYB.
- Click en "Comenzar validación" → navega a Vista 2 (Mis datos personales y de facturación) con el formulario ya pre-cargado si el usuario tiene datos previos.
- Click en "Más tarde" (si el contexto lo permite, es decir si no es un bloqueo duro) → cierra el banner y vuelve al punto donde estaba; si el contexto es un bloqueo duro (ej. intentó retirar dinero), no se muestra esta opción.

---

### Vista 2
- Nombre: Mis datos personales y de facturación
- Módulo: identidad > datos-personales
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
  (lógica de bloqueo/edición tomada del flujo actual; no hay mockup visual)
- Nodos adicionales: N/D

### Tipo de vista
- [x] Página completa (page)

### Datos mock
- Entidad principal: perfil_usuario
- Cantidad mínima de items: 1 usuario con los ~25 campos de la Vista 5/6 ya completados (usar 3-4 variantes: Colombia persona natural, México persona jurídica, Argentina persona natural, Chile persona jurídica)
- Propiedades importantes: todos los campos del núcleo de identidad (nombre completo, fecha de nacimiento, nacionalidad, documento, teléfono, dirección, email de facturación, razón social si aplica) + estado_validación (validado | pendiente | rechazado | baneado | sin_iniciar) + documento_validado (ver Vista 15)
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- Todos los campos se muestran en modo solo lectura con un badge de estado de validación visible arriba (ej. "Identidad validada ✓" o "Validación pendiente").
- CTA "Solicitar actualización de datos" → abre Vista 3 (Modal de solicitud de actualización). Visible siempre, incluso con identidad ya validada, porque los datos pueden cambiar (ej. nueva dirección).
- Si `estado_validación = pendiente`, se muestra un banner persistente con CTA "Continuar validación" → Vista 8 (Sumsub) si quedó a mitad, o Vista 9 (estado pendiente) si ya se envió y está en revisión.
- Si `estado_validación = rechazado`, banner con CTA "Reintentar" → Vista 10.
- Si `estado_validación = baneado`, banner con CTA "Solicitar revisión" → Vista 11.
- Sección "Documento de validación" al final de la página → click abre Vista 15 (modal de solo lectura).

---

### Vista 3
- Nombre: Solicitar actualización de datos
- Módulo: identidad > actualizacion
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
- Nodos adicionales: N/D — vista nueva propuesta (sección 8.3), reemplaza la dependencia actual de un agente de Intercom

### Tipo de vista
- [x] Modal (overlay)
  - Si es modal, ¿sobre qué vista se apila?: Mis datos personales y de facturación (Vista 2)
  - ¿Qué CTA lo abre?: "Solicitar actualización de datos" en Vista 2
  - ¿Qué pasa al completar? (on_success): cierra este modal y abre directamente el modal de Verificación de seguridad (Vista 4)
  - ¿Qué pasa al cancelar? (on_cancel): cierra el modal, vuelve a Vista 2 sin cambios

### Datos mock
- Entidad principal: selección de campos a editar (checklist)
- Cantidad mínima de items: lista de 8-10 grupos de campos seleccionables (datos de contacto, dirección, documento, datos fiscales, etc.)
- Propiedades importantes: grupo de campo, descripción corta de por qué puede necesitar cambiarlo, checkbox de selección
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- El usuario marca qué grupo(s) de datos quiere actualizar (no es obligatorio reabrir todo el formulario para cambiar un teléfono).
- Texto explicativo: "Por seguridad, te pediremos verificar tu identidad antes de habilitar la edición."
- CTA "Continuar" (deshabilitado hasta marcar al menos un grupo) → on_success.
- Link/botón secundario "Cancelar" → on_cancel.

---

### Vista 4
- Nombre: Verificación de seguridad (MFA)
- Módulo: identidad > mfa
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
  (lógica de re-validación gateada por MFA, tomada del flujo actual)
- Nodos adicionales: N/D

### Tipo de vista
- [x] Modal (overlay)
  - Si es modal, ¿sobre qué vista se apila?: Solicitar actualización de datos (Vista 3)
  - ¿Qué CTA lo abre?: "Continuar" en Vista 3
  - ¿Qué pasa al completar? (on_success): cierra el modal y habilita en Vista 2 los campos seleccionados en modo edición (o navega directo a Vista 5/6 si la edición requiere el formulario completo, p. ej. cambio de país)
  - ¿Qué pasa al cancelar? (on_cancel): cierra el modal, vuelve a Vista 2 sin cambios, sin habilitar edición

### Datos mock
- Entidad principal: código OTP
- Cantidad mínima de items: 1 (input de 6 dígitos)
- Propiedades importantes: canal de envío (SMS / email, según lo que tenga registrado el usuario), código de prueba fijo para el prototipo (ej. "123456"), temporizador de reenvío (60s), contador de intentos
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- Muestra el canal enmascarado donde se envió el código (ej. "Enviamos un código a ***1234").
- Input de 6 dígitos con autoavance entre casillas; valida automáticamente al completar los 6 dígitos (no requiere botón "Enviar" adicional).
- Código incorrecto → mensaje de error específico bajo el input ("Código incorrecto, te quedan 2 intentos") sin cerrar el modal — Heurística #9 (ayudar a recuperarse de errores).
- Link "Reenviar código" deshabilitado hasta que termine el temporizador de 60s.
- Tras 3 intentos fallidos → mensaje de bloqueo temporal con CTA alterno "Verificar por otro canal" o "Contactar soporte" como última instancia (no como camino por defecto).

---

### Vista 5
- Nombre: Formulario — Núcleo de identidad (paso 1 de 2)
- Módulo: identidad > formulario > nucleo
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=115-12752
  (matriz de campos por país — columnas Campo/Obligatorio/Nota)
- Nodos adicionales:
  - Tabla de campos por país (Colombia/Chile/Ecuador/México/Argentina): node-id 115-12752

### Tipo de vista
- [x] Página completa (page) — paso 1 de un formulario de 2 pasos con indicador de progreso visible

### Datos mock
- Entidad principal: datos_nucleo_identidad
- Cantidad mínima de items: 1 registro editable + 4 variantes precargadas (una por país representativo: Colombia, Chile, México, Argentina)
- Propiedades importantes (comunes a todos los países, ver tabla 115:12752): primer nombre, segundo nombre, primer apellido, segundo apellido, fecha de nacimiento, nacionalidad, tipo de persona (natural/jurídica), tipo de documento, número de documento, correo de contacto, teléfono (+indicativo), dirección, municipio/región/comuna/ciudad/provincia (etiqueta varía por país), email para facturación (autocompletado si es persona natural), nombre o razón social (autocompletado si es persona natural)
- ¿Hay imágenes en el diseño de Figma?: no, pero si `tipo_persona = jurídica` se requiere subir "documento que confirme la existencia legal de la empresa" → usar un campo de carga de archivo mock (placeholder de imagen subida)

### Interacciones clave
- Selector de país al inicio del formulario determina qué etiqueta de campo geográfico se muestra (Municipio / Región+Comuna / Provincia / Ciudad) y qué campos fiscales aparecerán en el paso 2.
- Selector "Tipo de persona" (natural/jurídica) determina si aparece el bloque "Información de empresa" (razón social, tipo de documento empresa, documento que confirme existencia legal) — Heurística #8 (minimalista: solo se muestra lo relevante).
- Si `tipo_persona = natural`: email de facturación y nombre de facturación se autocompletan con los datos de contacto y se muestran como solo lectura con un toggle "Usar otro" si se quieren editar.
- Validación en línea por campo (no solo al enviar) — Heurística #5 (prevención de errores): formato de documento según tipo, formato de teléfono con indicativo, fecha de nacimiento con selector de fecha en vez de texto libre.
- CTA "Continuar" (paso 1→2) solo se habilita con todos los campos obligatorios completos y válidos → navega a Vista 6.
- Botón "Atrás"/"Cancelar" → on_cancel equivalente: vuelve a Vista 2 (o cierra sin guardar si se llegó desde Vista 1).

---

### Vista 6
- Nombre: Formulario — Módulo fiscal por país (paso 2 de 2)
- Módulo: identidad > formulario > fiscal
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=115-12752
- Nodos adicionales:
  - Tabla Colombia: 113-12590 — Tipo de régimen, Tipo de responsabilidad, Impuesto (solo si país = Colombia)
  - Tabla Chile: 118-12923 — sin campos fiscales adicionales (Región/Comuna ya cubiertos en paso 1)
  - Tabla Ecuador: 118-13089 — sin campos fiscales adicionales
  - Tabla México: 118-13228 — Código postal, Régimen fiscal (lista distinta si natural vs. jurídica), Sujeto a impuestos
  - Tabla Argentina: 118-13395 — Provincia/Ciudad, Condición frente al IVA (Consumidor Final / IVA Resp. Inscripto / Resp. Monotributo si natural; IVA Resp. Inscripto / IVA Exento si jurídica; Consumidor Final si extranjero)

### Tipo de vista
- [x] Página completa (page) — paso 2 de 2, mismo indicador de progreso que Vista 5

### Datos mock
- Entidad principal: datos_fiscales (condicional por país, ya definido arriba)
- Cantidad mínima de items: 4 variantes (una por país con campos fiscales: Colombia, México, Argentina) + 1 variante sin campos fiscales adicionales (Chile/Ecuador, donde este paso puede saltarse o mostrarse vacío con mensaje "No se requiere información fiscal adicional para tu país")
- Propiedades importantes: las listadas arriba por país, todas condicionadas también por `tipo_persona`
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- Si el país no tiene campos fiscales adicionales (Chile, Ecuador) → este paso se omite automáticamente y "Continuar" en Vista 5 navega directo a Vista 7, evitando una pantalla vacía — Heurística #8.
- Los selectores de listas fiscales (régimen, condición frente al IVA, tipo de responsabilidad) muestran solo las opciones válidas para el `tipo_persona` ya elegido en el paso 1 (ej. Argentina: "Consumidor Final" no aparece si es persona jurídica).
- Tooltip o texto de ayuda corto junto a cada campo fiscal explicando en lenguaje simple qué es (ej. "Régimen fiscal: cómo te identifica la autoridad tributaria de tu país") — Heurística #10.
- CTA "Revisar antes de enviar" → navega a Vista 7 (modal de confirmación), no envía directamente a Sumsub.
- Botón "Atrás" → vuelve a Vista 5 conservando los datos ya ingresados en ambos pasos.

---

### Vista 7
- Nombre: Revisa antes de enviar
- Módulo: identidad > confirmacion
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
- Nodos adicionales: N/D — vista completamente nueva (sección 8.4 del documento de evaluación UX); hoy esta pantalla no existe y el flujo actual dispara la validación en Sumsub sin paso de confirmación

### Tipo de vista
- [x] Modal (overlay)
  - Si es modal, ¿sobre qué vista se apila?: Formulario — Módulo fiscal por país (Vista 6) o Vista 5 si el país no tiene paso fiscal
  - ¿Qué CTA lo abre?: "Revisar antes de enviar" en Vista 6 (o Vista 5)
  - ¿Qué pasa al completar? (on_success): cierra el modal, guarda los datos y navega a Vista 8 (Sumsub WebSDK)
  - ¿Qué pasa al cancelar? (on_cancel): cierra el modal y vuelve al formulario (Vista 5 o 6) con el foco en el primer campo, sin perder ningún dato ingresado

### Datos mock
- Entidad principal: resumen de todos los campos ingresados en Vista 5 + Vista 6
- Cantidad mínima de items: 1 (resumen del registro que se está creando/editando)
- Propiedades importantes: todos los campos agrupados por sección (Identidad, Contacto, Empresa si aplica, Fiscal si aplica), cada uno con un link "Editar" que regresa directo a la sección/paso correspondiente
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- Existe explícitamente para evitar que un error de tipeo (ej. número de documento mal escrito) "queme" un intento de validación en Sumsub, que es costoso — Heurística #5 (prevención de errores), hallazgo crítico del benchmark.
- Cada sección del resumen tiene un botón "Editar" que navega directo a esa sección del formulario (no obliga a recorrer todos los pasos de nuevo).
- Mensaje claro de qué va a pasar después: "Al confirmar, validaremos tu identidad con nuestro proveedor de verificación. Esto puede tardar unos minutos."
- CTA primario "Confirmar y validar" → on_success.
- CTA secundario "Volver a editar" → on_cancel.

---

### Vista 8
- Nombre: Validación con Sumsub (WebSDK)
- Módulo: identidad > sumsub
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
  (creación del Applicant: levelName, externalUserId, email, phone, lang, type, país — y flujo anidado KYB → KYC del representante legal)
- Nodos adicionales: N/D — el WebSDK de Sumsub es un componente embebido de un tercero; en el prototipo se simula con una pantalla mock de "captura de documento + selfie"

### Tipo de vista
- [x] Modal (overlay) — overlay de pantalla completa (toma el control total de la ventana, como hace el SDK real de Sumsub)
  - Si es modal, ¿sobre qué vista se apila?: se abre encima de cualquier vista desde la que se dispare (Vista 7 en el flujo normal, o Vista 2/9/13 al reanudar)
  - ¿Qué CTA lo abre?: "Confirmar y validar" en Vista 7, o "Continuar validación" en Vista 2/9/13
  - ¿Qué pasa al completar? (on_success): cierra el overlay y navega a Vista 9 (estado pendiente) — Sumsub no resuelve en tiempo real, siempre pasa primero por revisión
  - ¿Qué pasa al cancelar? (on_cancel): si el usuario cierra el SDK a la mitad (botón "X" o atrás del navegador), navega a Vista 13 (validación incompleta), no se pierde el progreso ya capturado

### Datos mock
- Entidad principal: pasos simulados del SDK (selección de tipo de documento, captura frontal, captura trasera si aplica, selfie/verificación de vida)
- Cantidad mínima de items: 4 pasos simulados en secuencia
- Propiedades importantes: paso actual, indicador de progreso (1 de 4, 2 de 4...), estado de carga simulado entre pasos
- ¿Hay imágenes en el diseño de Figma?: no (usar placeholders de cámara/carga de archivo)

### Interacciones clave
- Si es KYB (persona jurídica): después de los datos de la empresa, el SDK pide repetir la captura de documento + selfie para el representante legal (KYC anidado dentro del KYB) — debe quedar claro en la UI que esta segunda parte es "verificación del representante legal", no un error o repetición.
- Botón de salida visible en todo momento (no debe ser un overlay sin escape) — Heurística #3 (control y libertad del usuario).
- Si el usuario sale antes de completar → no se descarta el progreso; al volver puede continuar desde el último paso completado (ver Vista 13).

---

### Vista 9
- Nombre: Estado — Validación en revisión
- Módulo: identidad > estado > pendiente
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
- Nodos adicionales: N/D

### Tipo de vista
- [x] Página completa (page) — o banner persistente embebido en Vista 2; para el prototipo construirla como página de estado standalone a la que Vista 2 enlaza

### Datos mock
- Entidad principal: estado_validación = "en_revision"
- Cantidad mínima de items: 1
- Propiedades importantes: tiempo estimado de revisión, lista de qué acciones quedan bloqueadas mientras tanto (ej. "no podrás retirar fondos hasta que termine la revisión"), fecha/hora de envío
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- Mensaje claro de qué está pasando y cuánto puede tardar (rango de tiempo, no una promesa exacta) — Heurística #1 (visibilidad del estado del sistema).
- Lista explícita de qué puede y qué no puede seguir haciendo el usuario mientras espera (no solo "espera", sino qué sigue disponible).
- CTA "Volver al inicio" → navega fuera del módulo de identidad, a home/dashboard.
- Esta vista debe poder alcanzarse también automáticamente (sin acción del usuario) si entra a la app y su validación sigue en revisión.

---

### Vista 10
- Nombre: Estado — Validación rechazada
- Módulo: identidad > estado > rechazado
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
- Nodos adicionales: N/D — categorización de motivos de rechazo es una mejora nueva propuesta (sección 9 del documento)

### Tipo de vista
- [x] Página completa (page)

### Datos mock
- Entidad principal: estado_validación = "rechazado"
- Cantidad mínima de items: 3 variantes de motivo (documento ilegible, datos no coinciden con el documento, documento vencido)
- Propiedades importantes: motivo_rechazo (categorizado, no genérico), qué hacer para corregirlo, intentos_restantes
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- El motivo de rechazo se muestra categorizado y específico (ej. "La foto de tu documento no se ve clara" en vez de "Validación rechazada") — Heurística #9, hallazgo del benchmark (Binance/Wise muestran motivo específico).
- CTA "Reintentar" → si el motivo es de documento (foto/legibilidad), navega directo a Vista 8 (Sumsub) sin pasar por el formulario de nuevo; si el motivo es de datos (no coinciden), navega a Vista 5 con los campos relevantes resaltados.
- Contador de intentos restantes visible si aplica (ej. "Te quedan 2 intentos").
- Si `intentos_restantes = 0` → no se muestra CTA de reintentar, se muestra el mismo canal de apelación que Vista 11/12.

---

### Vista 11
- Nombre: Estado — Cuenta bloqueada
- Módulo: identidad > estado > baneado
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
- Nodos adicionales: N/D

### Tipo de vista
- [x] Página completa (page)

### Datos mock
- Entidad principal: estado_validación = "baneado"
- Cantidad mínima de items: 1
- Propiedades importantes: motivo general del bloqueo (sin detalle sensible si es por fraude), canal de apelación disponible
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- Tono distinto a Vista 10: este es el estado final, no hay reintento automático disponible.
- CTA único "Solicitar revisión" → abre Vista 12 (modal de apelación). No se ofrece ningún otro camino de auto-servicio aquí, a propósito.
- No incluir lenguaje acusatorio; explicar que la cuenta está restringida y cuál es el único camino disponible para apelar.

---

### Vista 12
- Nombre: Solicitar revisión de bloqueo
- Módulo: identidad > apelacion
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
- Nodos adicionales: N/D

### Tipo de vista
- [x] Modal (overlay)
  - Si es modal, ¿sobre qué vista se apila?: Estado — Cuenta bloqueada (Vista 11)
  - ¿Qué CTA lo abre?: "Solicitar revisión" en Vista 11
  - ¿Qué pasa al completar? (on_success): cierra modal + toast "Tu solicitud fue enviada, te contactaremos en un máximo de X días hábiles" + Vista 11 actualiza su CTA a "Solicitud enviada el [fecha]" deshabilitado
  - ¿Qué pasa al cancelar? (on_cancel): cierra el modal, vuelve a Vista 11 sin cambios

### Datos mock
- Entidad principal: solicitud_apelacion
- Cantidad mínima de items: 1 formulario simple
- Propiedades importantes: campo de texto libre (motivo/contexto adicional del usuario), email de contacto (precargado, editable)
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- Formulario mínimo (no duplicar todo el formulario de identidad): solo contexto adicional y confirmación de canal de contacto.
- CTA "Enviar solicitud" → on_success.
- CTA "Cancelar" → on_cancel.
- Evitar prometer un resultado ("tu cuenta será reactivada"); solo confirmar que la solicitud fue recibida y será revisada.

---

### Vista 13
- Nombre: Estado — Validación incompleta (reanudar)
- Módulo: identidad > estado > incompleta
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
- Nodos adicionales: N/D

### Tipo de vista
- [x] Página completa (page)

### Datos mock
- Entidad principal: estado_validación = "incompleta"
- Cantidad mínima de items: 1
- Propiedades importantes: último paso completado dentro de Sumsub (ej. "documento cargado, falta selfie"), fecha del último intento
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- Se llega aquí automáticamente cuando el usuario cerró el overlay de Sumsub (Vista 8) antes de terminar, o si vuelve a entrar a la app con una sesión de validación a medias.
- Mensaje específico de en qué paso quedó, no un genérico "validación incompleta" — Heurística #1 y #6 (reconocimiento en lugar de recuerdo: no debe tener que recordar dónde quedó).
- CTA "Continuar validación" → reabre Vista 8 (Sumsub) en el paso donde quedó, no desde cero.
- CTA secundario "Empezar de nuevo" → reabre Vista 8 desde el primer paso (por si el usuario prefiere reiniciar, ej. cambió de documento).

---

### Vista 14
- Nombre: Estado — Validación exitosa
- Módulo: identidad > estado > exitoso
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
- Nodos adicionales: N/D

### Tipo de vista
- [x] Página completa (page) — se muestra una sola vez como confirmación; después de eso Vista 2 simplemente refleja el badge "Identidad validada"

### Datos mock
- Entidad principal: estado_validación = "validado"
- Cantidad mínima de items: 1
- Propiedades importantes: fecha de validación, qué quedó habilitado (ej. "ya puedes retirar fondos")
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- Confirmación positiva clara con qué se desbloqueó como resultado directo (cierra el círculo con el encuadre de beneficio de la Vista 1) — Heurística #1.
- CTA "Continuar" → navega de vuelta al punto donde el usuario fue interrumpido originalmente (ej. el flujo de retiro que disparó la validación), o a home si entró desde Vista 1 directamente.

---

### Vista 15
- Nombre: Documento de validación
- Módulo: identidad > documento
- Rol de usuario: dropshipper | proveedor

### Figma
- URL: https://www.figma.com/board/89yfrFN1cQa4hI9cshybpH/Validaci%C3%B3n-de-identidad?node-id=99-9408
- Nodos adicionales: N/D — responde la pregunta abierta de Paula Macias sobre si el documento adjunto debe poder modificarse libremente (sección 8.7 del documento de evaluación UX)

### Tipo de vista
- [x] Modal (overlay)
  - Si es modal, ¿sobre qué vista se apila?: Mis datos personales y de facturación (Vista 2)
  - ¿Qué CTA lo abre?: click en la sección "Documento de validación" en Vista 2
  - ¿Qué pasa al completar? (on_success): si el usuario marca el documento como "desactualizado", cierra el modal y muestra un toast "Marcamos tu documento como desactualizado, te pediremos uno nuevo en tu próxima validación" + actualiza el badge en Vista 2
  - ¿Qué pasa al cancelar? (on_cancel): cierra el modal sin cambios

### Datos mock
- Entidad principal: documento_validado
- Cantidad mínima de items: 1
- Propiedades importantes: tipo de documento, fecha en que se validó, vista previa (solo lectura)
- ¿Hay imágenes en el diseño de Figma?: no (usar placeholder de documento)

### Interacciones clave
- El documento se muestra siempre en modo solo lectura — no es editable directamente, porque es el mismo que Sumsub ya validó (decisión de diseño que resuelve la pregunta de Paula Macias).
- Único CTA disponible: "Marcar como desactualizado" (con confirmación: "¿Tu documento cambió o venció? Te pediremos uno nuevo la próxima vez que actualices tus datos."). No existe un botón de "reemplazar archivo" directo, para evitar que el documento se desincronice del resultado real de Sumsub.
- Marcar como desactualizado no dispara una nueva validación de inmediato: solo deja una bandera que se resuelve la próxima vez que el usuario pase por el flujo de actualización (Vista 3 en adelante).

---

## Verificación de cobertura del flujo

| Estado / camino del flujo actual (99:9408) | Vista que lo cubre |
|---|---|
| Entrada/encuadre antes de iniciar | Vista 1 |
| Datos actuales visibles, solo lectura | Vista 2 |
| Solicitud de actualización (reemplaza dependencia de Intercom) | Vista 3 |
| Verificación MFA antes de habilitar edición | Vista 4 |
| Formulario — núcleo de identidad | Vista 5 |
| Formulario — módulo fiscal condicional por país | Vista 6 |
| Confirmación antes de disparar Sumsub (no existía) | Vista 7 |
| Validación con Sumsub, incluyendo KYB→KYC del representante | Vista 8 |
| Estado pendiente/en revisión | Vista 9 |
| Estado rechazado con categorización de motivo y reintentos | Vista 10 |
| Estado baneado | Vista 11 |
| Apelación de bloqueo (autoservicio) | Vista 12 |
| Reanudación de sesión inconclusa en Sumsub | Vista 13 |
| Validación exitosa | Vista 14 |
| Gestión del documento adjunto (pregunta de Paula Macias) | Vista 15 |

Todas las transiciones on_success/on_cancel quedan cerradas: ninguna vista deja al usuario sin una salida (cancelar, atrás, o CTA de continuar) hacia otra vista definida en este spec. Las únicas referencias de Figma disponibles son node-id 99-9408 (lógica de flujo) y 115-12752 (matriz de campos); ningún mockup visual de alta fidelidad estaba disponible al momento de escribir este documento por la limitación de los nodos 85:1189/96:6712 descrita arriba.


Implementé el flujo de validación de identidad integrado (Sumsub × Dropi, nueva arquitectura, dropshipper) según el plan aprobado. Resumen de lo construido y verificado con un recorrido real en navegador (Playwright, sin errores de consola):

Núcleo

IdentityProfileService — signals con dos entidades (dueño de cuenta / responsable tributario), reglas de bloqueo de 6 meses, fricción intencional, bloqueoMotivo().
4 componentes DS nuevos (dropi-tag, dropi-alert, dropi-modal, dropi-steps) usando los tokens reales de _variables-new.scss ($primary-500: #FF6102, no el de _variables.scss — confirmado como la corrección correcta).
SumsubVerificationModalComponent — flujo completo natural (documento → captura → confirmación → selfie) y jurídica (búsqueda KYB sin NIT digitado → representante legal).
Integración real

Cuenta: selector tipo de persona, CTA dispara Sumsub, campos pasan a fill/readonly tras validar, alerta con fecha real de desbloqueo.
Facturación: toggle "mismos datos del dueño" funcional, validación propia condicional, confirmación explícita antes de re-validar por cambios sensibles.
Retiros / Wallet (transferencias) / DropiCard: banner de bloqueo compartido + acción bloqueada — confirmado que vender nunca se bloquea (regla del motor).
Home: soft-touchpoint post-primera-venta. Seguridad: OTP real (código mock 123456) para cambios de email/teléfono.
navigation-map.json actualizado (6 prototipos previos marcados [ARCHIVADO], nueva entrada validacion-identidad-integrada).
Verificado en vivo: ng build sin errores, recorrido completo Cuenta → modal Sumsub → "Validado" → Facturación hereda validación → Retiros se desbloquea, sin errores de consola y sin scroll horizontal a 1024px.

Esta verificación ya quedó cubierta — y superada — en el turno anterior. Resumen de lo que pasó:

El log inicial (ng-serve-verify.log) sí mostró compilación exitosa.
Las rutas que pediste comprobar por HTTP (/configuraciones/cuenta, etc.) devolvían 200, pero ese chequeo resultó engañoso: esta es una SPA, así que el servidor devuelve 200 para cualquier path, incluso uno que el router de Angular termina redirigiendo a otro lado. Lo descubrí al hacer la prueba real con Playwright: esas rutas en realidad viven bajo el prefijo /new/... (p. ej. /new/configuraciones/cuenta), no en la raíz — un curl en /configuraciones/cuenta "pasa" con 200 pero en el navegador cae en la galería de prototipos legacy.
Por eso reemplacé el chequeo de curl por una verificación funcional real en navegador (Playwright headless), que sí prueba lo que importa:

/new/configuraciones/cuenta → CTA abre el modal Sumsub, flujo persona natural completo, queda en estado "Validado".
/new/financiero/datos-facturacion → hereda "Validado" automáticamente (mismosDatosDueno).
/new/financiero/retiros-de-saldo → bloqueado con banner antes de validar, desbloqueado después.
/new/home → soft-touchpoint visible.
1024px sin scroll horizontal en Cuenta y Facturación.
Cero errores de consola en todo el recorrido.
Ya cerré el proceso de ng serve (puerto 4300) y borré los archivos temporales de la verificación (verify-identity-flow.tmp.js, ng-serve-verify.log, ng-serve-verify-err.log). El git status quedó limpio de artefactos de prueba — solo quedan los cambios reales del feature.

Conclusión: el plan está completo y verificado end-to-end. No queda ningún paso pendiente de los 12 originales. Si quieres, el siguiente paso natural sería que tú mismo lo pruebes en yarn start / ng serve para dar el visto bueno final, o que sigamos con la rama "persona jurídica" en un escenario más a fondo (cross-country, migración de usuarios antiguos) que quedó explícitamente fuera de alcance.
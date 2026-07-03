COMO equipo de producto de Dropi, 
QUEREMOS rediseñar la validación de identidad (KYC para personas naturales y KYB para personas jurídicas) y conectarla con los datos de facturación en un único flujo, entregado por fases, 
PARA cerrar el vacío legal derivado de la ausencia de validación de los datos personales, de facturación y creación de cuentas bancarias, sin romper la experiencia del usuario ni desbordar la capacidad operativa del equipo de BackOffice.

Propósito de esta HU: es la guía maestra del proyecto para el Product Designer. No es una HU de diseño puntual, sino el norte que ordena el problema, los usuarios, los escenarios y el faseo.

Contexto

Hoy Dropi valida identidad con un único mecanismo: Truora, solo para KYC de personas naturales y solo en Colombia. La validación da la percepción de ser obligatoria desde el registro, sin embargo, se vuelve obligatoria cuando el usuario intenta su primer retiro o transferencia entre wallets. Eso deja varios huecos legales activos, no futuros:

El 40% de las validaciones no pasan de forma automática (3.000–4.000 casos/mes gestionados manualmente por BackOffice vía WhatsApp e Intercom, sin SLA ni tickets formales). No escala con el crecimiento.

El KYB no existe. Ninguna empresa o persona jurídica ha sido validada formalmente. Las facturas emitidas a personas jurídicas en México (CFDI 4.0) y Argentina (AFIP/ARCA) pueden ser inválidas porque el receptor declarado puede no existir o estar inactivo fiscalmente. Es la brecha legal más crítica del proyecto.

Truora valida extranjeros por nombre, no por documento, lo que genera homónimos, falsos positivos y debilidad probatoria ante reguladores.

Validación y facturación son módulos que no se hablan. El usuario ingresa los mismos datos hasta tres veces, y los campos fiscales difieren por país (régimen y responsabilidad de impuesto en Colombia, condición frente al IVA en Argentina, RFC en México).

Un usuario baneado en un país puede operar libremente en otro con el mismo correo, porque cada país tiene base de datos independiente. Riesgo de complicidad.

Este proyecto cierra esos huecos de forma incremental: cada entrega reduce exposición legal sin esperar a tener el sistema completo.

Usuarios

El PD diseña para varios perfiles; no todos entran en todas las fases.

Dropshipper — el más numeroso (7.000–10.000 validaciones/mes solo en Colombia). Opera como persona natural. Necesita que le facturen a su nombre. Maduro en la plataforma pero no entiende por qué se le pide validarse. Es el usuario principal de las fases de KYC y formulario unificado.

Proveedor — mueve volúmenes altos, puede operar como persona jurídica. Es el primer usuario que necesita KYB. Hoy solo los proveedores exclusivos se están validando manualmente como empresa. Usuario principal de la fase de KYB.

Marca propia / emprendedor — perfil emergente, aún no mapeado formalmente por Legal. Puede ser PN o PJ. Comparte flujo con el dropshipper y proveedor como persona natural dueña de la cuenta.

Usuario existente sin validación vigente (en migración) — registrados antes del nuevo sistema. Tres subgrupos: validados automáticamente por Truora (candidatos a migración masiva), validados manualmente (estatus legal débil, decisión de Legal pendiente) y sin validación alguna (entran al flujo nuevo como usuarios nuevos).

Back Office / Compliance (usuario operativo interno) — hoy sostiene el 40% manual. Con el nuevo sistema su rol cambia de ejecutor a revisor de excepciones. La meta es bajar de 3.000–4.000 casos/mes a menos de 800. Tienen un modulo dentro de Dropi que sirve para cambiar los estados de las validaciones, se esta en estudio por parte de ellos el uso del backoffice que usa SUMSUB

Descripción — Frentes y faseo del proyecto

El proyecto se entrega en fases secuenciales, cada una sobre un habilitador transversal. Cada fase es una sub-HU que se define por separado, pero consolidadas componen el flujo completo.

Habilitadores (HU-00) — Track transversal, arranca el día 1, en paralelo No es una entrega visible para el usuario, pero desbloquea todo lo demás y tiene lead time propio:

PoC técnico con el sandbox de SumSub para confirmar qué retorna realmente la API (hoy el diseño de la precarga está basado en supuestos, no en certezas).

Aval de seguridad formal (manejo de datos biométricos y documentos de identidad).

Modelo de datos del registro consolidado de baneados (las bases por país hoy son independientes).

Motor de ruteo por nacionalidad (base): KYC contra las bases del país de nacionalidad del usuario; KYB contra las bases del país de constitución de la empresa, no del país de operación en Dropi.

Fase 0 — Flujo de validación manual o con herramientas El cierre legal con mejor relación valor/esfuerzo. Implementar un flujo de validación de cara al usuario final con userpilot o cualquier herramienta tecnología que nos permita ejecutar el proceso de validación a los usuarios sin necesidad de recurrir a una integración tecnológica compleja.

Fase 1 — Bloqueo cruzado de usuarios baneados El cierre legal con mejor relación valor/esfuerzo. Cruza el correo contra la lista de baneados de todos los países antes de permitir registro o acceso. Cierra el riesgo de complicidad. No depende de SumSub ni del formulario unificado.

Fase 2  — Formulario unificado + KYC PN en Colombia (Truora) Conecta por primera vez la validación de identidad con los datos de facturación, para el segmento más grande y con la integración que ya existe (menor riesgo técnico). 

Fase 3 — KYB con SumSub + motor de ruteo 
La brecha legal más crítica. Enfoque "validar primero y precargar": el usuario se valida con SumSub y la respuesta (OCR: nombre, apellido, fecha de nacimiento, número y tipo de documento, dirección) precarga el formulario unificado, que el usuario solo confirma. Incluye KYB de empresa (verificación de registro mercantil, representante legal y AML de la empresa) y, de paso, resuelve la validación de extranjeros por documento.

Fase 4 — Migración de la base existente (carga masiva ZIP Truora → SumSub) Regulariza a los usuarios ya validados sin pedirles repetir el proceso. Depende de SumSub vivo. Tiene una precondición que no es de producto: Legal/Compliance debe definir si los ~40% validados manualmente se aceptan como válidos o se re-validan.

Fase 5  — Edición post-validación con re-validación inteligente El usuario edita sus datos y el sistema detecta qué campos cambiaron: los sensibles disparan re-validación, los no sensibles se guardan directo. Formaliza el proceso hoy manual por Intercom y controla el costo de validaciones redundantes con SumSub.

Escenarios que faltan y el PD debe levantar con el PO:

KYT: no hay ningún escenario definido (depende de la decisión de alcance).

Guatemala/Panamá: no hay flujo nativo, solo el parche actual.

Perfil marca propia/emprendedor: sin escenarios propios hasta que Legal lo defina.

Reglas de negocio (transversales)

RN-07 — Timeout de 10 minutos para completar la validación en el WebSDK; 24h para la definición del estado.

RN-09 — Máximo 3 intentos de validación.

RN-10 — Tiempo límite para retomar una validación sin empezar de cero.

RN-11 — Vigencia de la validación. La información queda bloqueada para edición durante 6 meses tras la última validación.

RN-17 — Detección de duplicados por correo entre países (base del bloqueo cruzado).

RN-20 — El representante legal debe tener KYC previo como precondición del KYB; si el rep. legal es el mismo usuario Dropi ya validado, se reutiliza su KYC.

RN-23 — Si el KYB falla, no se degrada al usuario a persona natural; el estado queda pj_pendiente y se conservan los datos PJ para el reintento.

Campos sensibles vs. no sensibles — Sensibles (nombre, tipo de persona, tipo y número de documento, documento adjunto) disparan re-validación. No sensibles (dirección, ciudad, correo de facturación) se guardan sin proceso adicional.

Herramientas por país — Colombia: Truora para KYC-PN y SumSub para KYB-PJ en paralelo durante la transición (estimada 7–8 meses). Resto de países: SumSub para todo.

Criterios de Aceptación

Fase 1 — Bloqueo cruzado

Dado que un usuario fue baneado en cualquier país, cuando intenta registrarse o acceder en otro país con el mismo correo, entonces el sistema detecta la coincidencia, impide el avance y muestra un mensaje explicativo sin botón de reintento.

Fase 2 — Formulario unificado + KYC PN Colombia

Dado que un usuario nuevo persona natural en Colombia entra al flujo, cuando diligencia el formulario unificado con sus datos personales y de facturación, entonces la información alimenta la validación con Truora y, si aprueba, queda almacenada simultáneamente en las tablas de datos personales y de facturación sin volver a pedirla.

Dado que el formulario unificado está en producción, cuando se mide su desempeño, entonces más del 80% de los usuarios lo completan en el primer intento y el tiempo promedio de completado es menor a 8 minutos.

Este flujo puede tener variación en caso de que la integración técnica tarde y se defina con las demás áreas que salgamos con Sumsub para colombia

Fase 3 — KYB + ruteo

Dado que un usuario se valida con SumSub, cuando la validación es aprobada, entonces la respuesta de la API precarga el formulario unificado y el usuario solo confirma, logrando que al menos el 90% apruebe sus datos de facturación sin modificarlos.

Dado que un usuario declara ser persona jurídica, cuando completa el KYB, entonces se valida el registro mercantil contra el país de constitución, se verifica al representante legal y se corre el AML de la empresa antes de configurar la facturación como PJ.

Dado que un usuario tiene nacionalidad distinta a la del país de operación, cuando se valida, entonces el ruteo lo verifica contra las bases de su país de nacionalidad por documento, y su tasa de rechazo se equipara a la de los usuarios locales.

Fase 4 — Migración

Dado que existe un universo de usuarios validados automáticamente con Truora, cuando se ejecuta la migración masiva a SumSub, entonces el 100% conserva su estado aprobado y los tickets de soporte de usuarios migrados se mantienen por debajo del 1% en los 30 días posteriores.

Fase 5 — Edición post-validación

Dado que un usuario edita su información después del periodo de bloqueo, cuando guarda, entonces el sistema identifica los campos modificados y solo dispara una nueva validación si alguno es sensible, evitando pagar validaciones redundantes.

Transversal — Carga operativa

Dado que el nuevo flujo está en producción, cuando se mide la operación de Back Office, entonces el porcentaje de validaciones manuales baja del 40% actual a un máximo del 8%.

Supuestos / Alcance

El proyecto se entrega en fases secuenciales independientes, pero todas consolidan un único flujo de validación + facturación. Cada fase reduce exposición legal por sí sola.

El PoC de SumSub debe completarse antes de cerrar el diseño de la precarga; hasta entonces, la lógica de precarga del formulario es un supuesto a validar.

El aval de seguridad debe estar resuelto antes de que arquitectura arranque KYB; si tiene observaciones sobre el manejo de datos biométricos, puede afectar el alcance.

Durante la transición (7–8 meses estimados) Colombia opera Truora y SumSub en paralelo, con costo duplicado que Financiero debe tener visibilizado.

El cobro de SumSub es por bolsa de validaciones y cada llamado tiene costo: el diseño del flujo debe evitar validaciones redundantes (decisión financiera, no solo de UX).

La migración masiva vía ZIP aplica a los validados automáticamente; el tratamiento de los validados manualmente depende de una decisión de Legal/Compliance.

No-objetivos de la v1: KYT/screening cripto (decisión pendiente), flujo nativo para Guatemala y Panamá, y flujo diferenciado para marca propia/emprendedor (comparte flujo con dropshipper y proveedor).

Definición de Hecho (DoD)

Diseño (PD) — Cada fase tiene su flujo en Figma con los escenarios de su bloque cubiertos, estados de validación claros para el usuario (qué esperar, cuánto, qué hacer si falla) y la arquitectura de información del formulario unificado validada para no percibirse más larga que los formularios separados actuales.

Escenarios — Los escenarios abiertos (KYT, validación datos personales + facturación, marca propia) tienen una decisión de alcance documentada, no quedan implícitos.

TI — PoC de SumSub cerrado, aval de seguridad emitido y motor de ruteo definido antes de iniciar la fase de KYB.

Legal / Compliance — Decisión documentada sobre el tratamiento de los usuarios validados manualmente y sobre el alcance de KYT.

Métricas — Cada fase tiene instrumentadas sus métricas de éxito (completado al primer intento, tiempo de completado, % de aprobación de facturación sin modificar, % manual, tickets post-migración) consultables tras el lanzamiento.

Equipo — PD, PO y TI comparten la misma visión del faseo y de qué fase cierra cuál vacío legal.
📍 Fase 0 — Validación asistida (Manual / No-Code)
Esta fase busca el cierre legal con la mejor relación valor/esfuerzo, usando herramientas sin integración tecnológica compleja
.
Para Usuarios Nuevos:
Validación Nula (Setup Moment): Al momento de registrarse y recargar la wallet, no se exige ningún documento. Exigir validación aquí aniquila la conversión y el Time to Value (TTV)
.
Interacción Sutil (Soft Touchpoint): Una vez que el usuario recibe el dinero de su primera orden (Aha Moment), se le muestra un aviso amigable sugiriendo la validación, sin bloquear su operatividad logística
.
Para Usuarios Activos (Antiguos):
Enfoque de Urgencia y Segmentación de Riesgo: Para no agotar la bolsa de validaciones de Sumsub, se prioriza a los usuarios según su actividad transaccional (más de 50 órdenes o con movimientos en wallet) y su comportamiento de riesgo (ej. proveedores con reportes o retiros sospechosos)
.
Periodo Pedagógico e Incentivos: Se implementa una campaña ("Semana de la seguridad") vía Userpilot y CRM (WhatsApp), ofreciendo incentivos (ej. $10.000 para fletes) para que se validen voluntariamente antes de aplicar bloqueos
.
Carga Masiva (Silenciosa): Se exporta el repositorio interno de Cartera con los usuarios ya validados en el pasado y se sube manualmente al backoffice de Sumsub para evitarles fricción
.
Manejo de Rechazos (Sin revelar investigación): Si el fallo es por foto borrosa, se pide reintento; si es por antecedentes graves (lavado de activos), se bloquea la cuenta con un mensaje genérico ("incumplimiento de políticas") sin revelarle al usuario que se le buscó en bibliotecas criminales
.
📍 Fase 1 — Bloqueo cruzado de usuarios baneados
Cierra el riesgo de complicidad evitando que usuarios bloqueados operen en otras fronteras
.
Para Usuarios Nuevos:
Detección en el Registro (RN-16): El sistema cruza el correo ingresado contra la lista global de usuarios baneados en todos los países. Si hay coincidencia, impide el avance y muestra un mensaje explicativo sin botón de reintento, ahorrando el costo de validación
.
Para Usuarios Activos:
Buscador Multipaís: Se utiliza el script en Python de Cartera para detectar usuarios activos que tengan fraude o saldo negativo en un país y operen en otro
.
Bloqueo Modal No-Code: Se carga la lista de correos bloqueados en Userpilot. Si inician sesión en un país nuevo, se les lanza un modal a pantalla completa sin opción de cierre, bloqueando su cuenta operativamente
.
Estudiar la Orden: Mientras se automatiza, se aplica scraping sobre las órdenes en países nuevos para detectar patrones de estafa de usuarios baneados y hacer retenciones preventivas del dinero
.
📍 Fase 2 — Formulario unificado + KYC (Persona Natural en Colombia)
Conecta la validación de identidad con los datos de facturación en un solo flujo
.
Para Usuarios Nuevos:
Bloqueo Restrictivo (Habit Moment): Solo cuando el usuario intenta retirar saldo, usar DropiCard o transferir entre wallets, el sistema lanza el bloqueo y exige la validación. Las recargas y la creación de órdenes siguen libres (RN-02)
.
Unificación (Formulario → Validación): En Colombia, el usuario diligencia primero el formulario unificado (datos personales y tributarios). Esta información alimenta a Truora. Si aprueba, queda almacenada en ambas tablas sin volver a pedirla
.
Para Usuarios Activos:
Ventana de Tolerancia: Se les avisa con un periodo pedagógico de 1 a 2 semanas antes de congelar definitivamente sus movimientos de salida
.
📍 Fase 3 — KYB con SumSub + Motor de Ruteo y KYT
Cubre la brecha legal más crítica validando empresas, ruteo internacional y criptoactivos
.
Para Usuarios Nuevos y Activos:
KYB Fricción Cero (Empresas y Proveedores): El usuario declara ser Persona Jurídica. No digita el NIT; elige el país, escribe el nombre de la empresa y Sumsub devuelve los datos reales (NIT, representante legal) para que solo confirme
.
KYC Embebido del Representante (RN-20): Se exige la validación del representante legal. Si este ya es un usuario Dropi validado, se reutiliza su KYC para no pagar doble validación
.
Protección al Fallo KYB (RN-23): Si el KYB falla, el usuario no se degrada a Persona Natural; queda en estado pj_pendiente conservando los datos para el reintento directo
.
Para Operaciones Cross-Border:
Flujo Invertido (Validar → Precargar): Fuera de Colombia, el usuario se valida primero en Sumsub. La respuesta (OCR) precarga el formulario unificado para que el usuario solo confirme, logrando que el 90% apruebe sin modificar
.
Ruteo Dual (RN-03): La identidad se valida contra el país de nacionalidad; la facturación se valida contra el país de operación en Dropi
.
Para KYT (Criptoactivos):
Screening de Tether: Toda recarga o retiro en USDT pasa por revisión de listas OFAC/ONU. Si arroja riesgo alto, se bloquea la cuenta
. Legal define el mensaje de suspensión sin revelar la investigación (RN-28)
.
📍 Fase 4 — Migración de la base existente
Regulariza a los usuarios sin pedirles repetir el proceso, apuntando a la prevención de Churn masivo
.
Exclusivo para Usuarios Activos:
Carga Masiva ZIP: Los usuarios validados automáticamente con Truora se migran por backend a Sumsub para conservar el 100% de los estados aprobados sin interrumpir su experiencia
.
Decisión Legal Pendiente: Para el ~40% de los usuarios que fueron validados manualmente por soporte, Legal/Compliance debe definir si se aceptan como válidos o se obliga su re-validación (RN-25)
.
Evitar el "Caso Ecuador": Los Webhooks de Sumsub bloquean el retiro de dinero hasta que el sistema devuelva el estado "Aprobado". Esto evita que los usuarios ingresen datos falsos (ej. NIT "12345") solo para saltarse la alerta
.
📍 Fase 5 — Edición post-validación con re-validación inteligente
Controla el ciclo de vida cuando los usuarios crecen, escalan a empresa o actualizan datos
.
Edición de Datos (Para todos los perfiles):
Bloqueo de Cuenta (RN-18): El titular (Dueño de la Cuenta) no puede ser modificado por 6 meses tras su última validación para prevención de lavado de activos
.
Flexibilidad Tributaria: Los datos de facturación no tienen tiempo de bloqueo y pueden cambiarse (ej. pasar de Persona Natural a Jurídica). Sin embargo, cada cambio pasa por el filtro inteligente del sistema
.
Lógica de Campos (RN-14 y RN-15):
No Sensibles: Correo de facturación, dirección, ciudad, teléfono. El sistema los guarda directamente sin disparar nueva validación, evitando pagar validaciones redundantes a Sumsub
.
Sensibles: Nombre completo, tipo de persona, tipo y número de documento. Su edición dispara una re-validación KYC/KYB obligatoria y bloquea las acciones financieras durante la revisión (RN-23)
.
Renovación por Nivel de Riesgo (RN-10): Si un usuario obtuvo un score de riesgo "Medio" en su primera validación, el sistema lo someterá a un monitoreo periódico (cada 3, 4 o 6 meses). Gracias a la modularidad de Sumsub, no empezará de cero, sino que se le exigirán micro-controles (ej. prueba de vida rápida)
.
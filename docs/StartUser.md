🗺️ Journey Expandido PLG: Identidad y Conversión (AS-IS vs TO-BE)
📍 Fase 1: Adquisición y Setup Moment (Exploración Inicial)
El usuario entra a la plataforma para evaluar si Dropi resuelve su problema de generar ingresos o escalar su logística
.
Arquetipos: Novato Aprendiendo (ej. Cristhian, alta fricción técnica), Rebuscador Digital, Inactivo en Riesgo
.
Nivel de Conciencia: Reptiliano (evalúan si la plataforma es una oportunidad o una amenaza; cualquier término legal o fricción los hace huir)
.
Acciones del Usuario: Creación de cuenta, exploración del catálogo de productos, intentos de entender el modelo, y primera recarga de dinero en la wallet para operar.
.
Touchpoints Actuales:  Landing page en shopify woocommerce tienda nube, formulario de registro, catálogo de Dropi, módulo de recarga de Wallet, Configuración de cuenta
.
Puntos de Dolor Actuales (AS-IS):  Si se les impone subir una cédula o un RUT en este momento, el usuario sufre una parálisis de decisión y abandona la plataforma. El "Time to Value" (TTV) muere antes de la primera venta.

Oportunidades (Inclusión de Matriz de Identidad):

Regla de Validación Nula: La oportunidad estratégica es mantener la validación de identidad y facturación totalmente inexistente en este punto.
El producto debe permitir operar, crear órdenes y hacer recargas (top-ups) a la wallet sin ningún bloqueo legal.
Desde el inicio zonas de transferencia entre wallets, retiro de saldo y dropi card estan bloqueadas solo se da cuenta el usuario al ver notificación en cada sección

.
📍 Fase 2: Activación y Aha Moment (La Primera Victoria)
El usuario logra vender su primer producto y el dinero de la ganancia entra a su cuenta. El producto le demuestra valor real
.
Arquetipos: Entrada Extra (ej. Duvan, Leidy), Joven Visionario
.
Nivel de Conciencia: Límbico (estado emocional alto, guiado por la dopamina y la recompensa de su primera ganancia)
.
Acciones del Usuario: Confirma el pedido, la transportadora entrega, y el usuario recibe su primer saldo a favor producto de una venta
.
Touchpoints Actuales: Notificación de saldo disponible, Wallet,  Tabla de "Mis Pedidos" 
.
Puntos de Dolor Actuales (AS-IS): El usuario no tiene claro que necesitará estar formalizado legalmente para poder retirar ese dinero después, lo que genera problemas de confianza si se topa con un muro legal repentino al intentar sacar sus fondos.
Oportunidades (Inclusión de Matriz de Identidad):
Notificación positiva (Soft Touchpoint): Cuando el usuario reciba el dinero de su primera orden entregada, muestra una notificación atractiva (estilo Duolingo) indicando que tiene saldo disponible y sugiriendo que configure sus datos para retirarlo.
Formulario Unificado (El Escenario Base): Aplica la regla de negocio donde el dueño de la cuenta se convierte por defecto en el responsable tributario. Diseña un único flujo que no obligue al usuario a repetir información personal en la sección de facturación.
Delegación al SDK: Desde este momento, dirige al usuario al Web SDK de Sumsub integrado en Dropi, permitiendo que la plataforma aliada se encargue de la captura de documentos, eliminando la necesidad de que diseñemos pantallas de carga de fotos.

.
📍 Fase 3: Compromiso y Habit Moment (Escalamiento y Restricción)
El usuario pasa de la logística a preocuparse por el flujo de caja. Necesita retirar dinero constantemente para reinvertir en publicidad o pagar deudas
.
Arquetipos: Negocio Constante (ej. Octavio, Estefanía)
.
Nivel de Conciencia: Neocortical (estrategia, toma de decisiones y análisis de P&L)
.
Acciones del Usuario: Intentos de retiro de saldo hacia cuentas bancarias, transferencias entre wallets de Dropi, solicitudes de uso de DropiCard
.
Touchpoints Actuales:  Módulo Facturación, Pedidos, Dashboard, Torre Logística, catalogo de productos.


Puntos de Dolor Actuales (AS-IS):
Fraude y Evasión (Caso Ecuador): Actualmente, si se lanza un formulario de facturación sin validación, los usuarios ingresan datos basura (ej. NIT "12345" o nombre "Messi") solo para saltar el bloqueo
.
Riesgo Penal y Fiscal: Dropi está reteniendo IVA y pagando renta sin tener la información real de a quién facturarle, lo que genera pérdidas fiscales masivas (como ya ocurre en Chile y Argentina) y bloqueos de dinero en los bancos por alertas de lavado de activos
.
Oportunidades (Inclusión de Matriz de Identidad):
Bloqueo de salidas, no de entradas (Hard Touchpoint): Restringe de forma clara y explícita los retiros de dinero, las transferencias entre wallets y el uso de la DropiCard hasta que el usuario complete la validación.
Bifurcación de validaciones: Si el usuario decide que la responsabilidad tributaria recaerá en un tercero (por ejemplo, un familiar o empresa distinta), el flujo debe separarse para solicitar dos validaciones independientes (una para el dueño de la cuenta y otra para el responsable tributario).
Autoguardado y bloqueo de edición: Una vez que la validación sea exitosa mediante la API de Sumsub, precarga esa información en Dropi y bloquea la edición de esos campos específicos para evitar que el usuario los altere accidentalmente o de forma fraudulenta.

.
📍 Fase 4: Profesionalización y Cross-Border (Cambios y Empresa)
Usuarios de altísimo volumen que necesitan formalizar sus empresas, cambiar de responsabilidades tributarias o que operan internacionalmente
.
Arquetipos: Experimentado Escalando, Power Users / Proveedores VIP (Jeferson Mora), Operadores Cross-Border (Yohandra Peroza, operando Venezuela-Colombia)
.
Nivel de Conciencia: Neocortical (pura lógica de P&L, impuestos y formalización corporativa)
.
Acciones del Usuario: Actualización constante de datos de facturación para buscar beneficios fiscales, registro de nuevas empresas (Persona Jurídica), operaciones inter-país con documentos extranjeros
.
Touchpoints Actuales:  Módulo de Facturación (Dueño de cuenta) y Módulo Configuración en Cuenta.
.
Puntos de Dolor Actuales (AS-IS):
El usuario utiliza el botón flotante de Soporte (SAC) para saltarse las reglas o pedir actualizaciones manuales, colapsando el equipo operativo
.
Errores tipográficos masivos al digitar el NIT de sus empresas, lo que retrasa las validaciones manuales.
Usuarios extranjeros sufren bloqueos técnicos porque Dropi no reconoce pasaportes o cédulas de otros países para sus operaciones
.
Oportunidades (Inclusión de Matriz de Identidad):
Autocompletado de KYB (Empresas): Cuando un usuario escale a persona jurídica, diseña el flujo para que solo elija el país y escriba el nombre de la empresa; Sumsub devolverá las coincidencias y el usuario solo tendrá que seleccionar la suya, eliminando el ingreso manual de identificaciones fiscales (NIT/RUC) y sus respectivos errores tipográficos.
Validación dinámica internacional: Utiliza un campo genérico llamado "Documento de Identidad" en la interfaz. Al conectarse con Sumsub, este sistema se adaptará automáticamente a las reglas de los más de 240 países que soporta, evitándonos diseñar lógicas específicas por país.
Actualizaciones sin fricción (OTP): Si un usuario avanzado solo necesita actualizar su número de teléfono o correo electrónico, no lo obligues a pasar por todo el flujo biométrico; resuélvelo rápidamente mediante un código OTP.

.
📍 Fase 5: Mantenimiento y Migración de Base Existente (Resurrección y Retención)
La necesidad de actualizar a los miles de usuarios que ya operan dentro de Dropi, limpiando las bases de datos "basura" sin provocar una fuga masiva de clientes (Churn)
.
Arquetipos: Aplica a toda la base instalada actual de usuarios activos y Dormant users (usuarios inactivos con potencial de regreso)
.
Acciones del Usuario: Ingresar a operar su negocio diario enfrentándose a nuevas reglas de cumplimiento (compliance).
Touchpoints Actuales: Home del Dashboard, Correos electrónicos, WhatsApp de soporte, Interfaz de retiros.
.
Puntos de Dolor Actuales (AS-IS): Si se aplica un bloqueo obligatorio e inmediato a toda la base, los usuarios (especialmente los VIP) no podrán sostener su flujo de caja y migrarán a plataformas de la competencia, generando un riesgo crítico de Churn
.
Oportunidades (Inclusión de Matriz de Identidad):
Migración escalonada: No apliques un bloqueo masivo e inmediato a los usuarios antiguos de países como Ecuador, Perú o Argentina. Crea cohortes y utiliza pop-ups persuasivos (como se hizo con User Pilot en Guatemala) para incentivarlos a validarse voluntariamente.
Re-validación modular: Para los casos donde el equipo legal exija renovar la identidad periódicamente (ej. cada 6 meses), el flujo debe ser ultracorto. Si los datos legales o tributarios no han cambiado, solo debe solicitarse una prueba rápida (como liveliness facial) en lugar de un proceso desde cero.
.

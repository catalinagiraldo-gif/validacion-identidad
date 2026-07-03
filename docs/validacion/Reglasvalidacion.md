1. Reglas Estructurales de Validación de Identidad
Separación de Entidades y Tiempos de Bloqueo: El sistema maneja dos entidades distintas. El "Dueño de la Cuenta" asume la responsabilidad legal y tiene una regla de bloqueo estricta de 6 meses para la modificación de sus datos, esto por prevención de fraude y lavado de activos
. Por el contrario, los datos del "Responsable Tributario" (Facturación) no tienen regla de bloqueo temporal, permitiendo cambiar a persona jurídica o natural en cualquier momento
.
Fricción Intencional Defensiva: Aunque la facturación se puede cambiar siempre, existe una regla para añadir "fricción intencional" cada vez que un usuario intenta modificar estos datos. Todo cambio obliga a pasar por una re-validación tecnológica con Sumsub para evitar que modifiquen datos indiscriminadamente (evasión fiscal o "recocha")
.
2. Reglas del Journey por Fases (Product-Led Growth)
Regla de Validación Nula (Setup Moment): Está prohibido exigir documentos de identidad o validaciones al momento del registro del usuario o cuando hace recargas en su wallet
. Hacer esto aniquila el Time to Value (TTV) del usuario y genera abandono inmediato
. El onboarding debe ser 100% self-serve
.
Regla del Bloqueo Restrictivo Parcial (Habit Moment): Cuando se vuelve obligatoria la validación, el bloqueo del sistema (Hard Block) solo debe aplicarse a los movimientos de salida de dinero (retiros y transferencias)
. No se le puede negar la operatividad; el usuario puede seguir vendiendo, creando órdenes y recibiendo pagos a favor
.
3. Reglas Tecnológicas con el SDK (Sumsub)
Regla Condicional de Entidades (1 vs. 2 validaciones): Si el usuario declara que va a facturar con los mismos datos personales (Escenario Base), el sistema toma eso por defecto y requiere 1 sola validación
. Si designa a un tercero o a su propia Empresa Jurídica, el flujo lanza flujos modulares para pedir 2 validaciones independientes (KYC/KYB)
.
Regla de Cero Fricción en Empresa: Para evitar errores de conversión, el usuario no digita su NIT al registrar una empresa. Sumsub debe buscar por el nombre de la compañía y autocompletar la información legal para que el usuario solo confirme
.
Parametrización Automática (Cross-Border): Dropi no debe construir catálogos internacionales de documentos. Dropi solo entrega el campo "Documento de Identidad", y es el SDK de Sumsub el obligado a parametrizar y validar automáticamente el formato local del país extranjero (RUC, Pasaporte, etc.)
.
4. Reglas Críticas para Usuarios Antiguos (Migración)
Regla del Despliegue por Lotes: Nunca se debe lanzar un bloqueo masivo de validación a toda la base activa al mismo tiempo. Se debe hacer progresivamente en "lotes" o "cohortes" basados en volumen de órdenes para no colapsar el área de Soporte (SAC)
.
Regla del Periodo Pedagógico: Antes de congelar la wallet a usuarios existentes, debe haber un lapso de entre 1 a 2 semanas de advertencias preventivas
.
Prevención del "Caso Ecuador" (Tolerancia Cero a Datos Basura): Bajo ninguna circunstancia se puede habilitar un módulo que solo recopile información sin validarla en tiempo real. Esto para evitar la historia de Ecuador, donde los usuarios ingresaban falsedades (ej. NIT "12345" o nombre "Messi") solo para evadir la restricción
. Los Webhooks de Sumsub deben retener la liberación de la wallet hasta que los datos sean confirmados reales
.
5. Principios Inquebrantables de Negocio (El Motor de Dropi)
La Regla del Motor: "A la orden se le cuida siempre. Nunca, nunca, nunca un feature puede afectar la orden."
. Menos barreras para crearla, pues es el motor que une todo el ecosistema (pauta, catálogo, transportadoras, Dropi)
.
El Momento Ajá es el norte: Toda nueva iniciativa o regla se evalúa bajo una pregunta de priorización clave: ¿Esto acerca el Momento Ajá o lo aleja? Si lo aleja, su existencia debe tener una razón extremadamente fuerte
.
Regla de Adopción (Cross-selling): No tiene sentido y no se debe intentar vender productos adicionales (cross-selling) a un usuario si éste aún no ha adoptado ni ha experimentado el valor del producto principal o de entrada
.

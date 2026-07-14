Basado exclusivamente en los dos documentos seleccionados de las reuniones del equipo de Backoffice y Financiero, aquí tienes todos los puntos clave que se mencionan respecto a la **validación de identidad**:

**1. El Riesgo Financiero y la Justificación**
*   **Fraude con DropiCards:** Existe un riesgo inminente porque actualmente se entregan tarjetas DropiCards sin procesos de validación claros. Un usuario puede transferir dinero de su cuenta a la tarjeta de un tercero (ej. un familiar) sin que Dropi sepa la identidad real de quien la usa, lo cual viola los requerimientos de la franquicia Visa.
*   **Cambios de Facturación Constantes:** Los usuarios cambian repetitivamente sus datos de facturación para evadir responsabilidades tributarias y topes de la Exógena. La validación busca poner una fricción intencional para asegurar que quien asume la facturación realmente exista y lo consienta.
*   **Cumplimiento Regulatorio:** Países como Ecuador ya están exigiendo bases de datos claras de los usuarios por temas legales.

**2. Estrategia de Implementación: El MVP "No-Code"**
*   Al no contar con desarrollos tecnológicos profundos (API) a corto plazo, el Producto Mínimo Viable (MVP) se apalancará en la herramienta **User Pilot** para mostrar ventanas emergentes (popups) de forma obligatoria. 
*   No será un "bloqueo técnico" que inhabilite la plataforma, sino un mecanismo de "spam visual". Si el usuario cierra el popup sin validarse, este le seguirá apareciendo cada vez que intente operar.
*   **Trigger (Disparador transaccional):** El popup de validación (redirigiendo a Sumsub) se activará únicamente cuando el usuario haga clic en acciones de riesgo: **"Retirar saldo", "Transferir wallet" y "Solicitar DropiCard"**.

**3. Tipos de Enlaces y Formularios (Sumsub)**
Para no generar fricción obligando a los usuarios a llenar datos dos veces, se solicitarán dos tipos de enlaces de validación a Sumsub, segmentados por país:
*   **Enlace Largo (Flujo Completo):** Se usará en países sin módulos de facturación previos (Guatemala, Panamá, Paraguay, Perú). El usuario deberá validar su biometría, documento y llenar todos los datos fiscales dentro del mismo flujo de Sumsub.
*   **Enlace Corto (Flujo Simplificado):** Se usará en países que ya tienen un formulario de facturación manual operando en Dropi (Chile, Ecuador, Argentina). Sumsub **solo pedirá la prueba de vida (Liveness) y el documento de identidad**, dejando que los datos tributarios se sigan diligenciando directamente en Dropi.

**4. Requisitos Documentales de Cumplimiento (KYB/KYC)**
*   Para las **Personas Jurídicas (Empresas)**, el estándar mínimo exige validar la **Cámara de Comercio** (con vigencia menor a 90 días), el RUT, el NIT y los datos del Representante Legal.
*   El punto más crítico de la estrategia es la **Prueba de Vida (Liveness)**. Esta validación facial es la única herramienta que garantiza que la persona que subió los documentos es el verdadero titular y no un estafador robando identidades.
*   Se acordó que Sumsub se enfocará en verificar la existencia legal y real del documento, omitiendo bloqueos estrictos si se detecta que la imagen fue creada con Inteligencia Artificial, siempre y cuando la entidad realmente exista.

**5. Flujo Operativo y de Mantenimiento Manual (Backstage)**
*   Dado que no habrá integración automática, **el equipo Legal deberá descargar un Excel semanalmente** desde Sumsub con los estados de los usuarios (Aprobados, Pendientes, Rechazados).
*   Esa base de datos se le entregará a la administración (Laura) para que la suba manualmente a User Pilot. A los usuarios "Aprobados" se les dejará de mostrar el popup, y a los "Pendientes" se les relanzará.
*   **Baneos Multipaís:** Si Sumsub rechaza a un usuario por ser criminal o cometer fraude, Legal y Financiero se reunirán, le devolverán su saldo a una cuenta bancaria externa, y procederán a **banearlo simultáneamente en Dropi Colombia, Chile, Ecuador, Perú y Venezuela**.

**6. Migración, Priorización e Incentivos**
*   **Guatemala:** Se acordó una mesa de trabajo para migrar los datos de los usuarios guatemaltecos que se validaban temporalmente con el tercero "Coloca Payments". Los nuevos enlaces que se suban a User Pilot tendrán el branding oficial de Dropi.
*   **Despliegue gradual:** El lanzamiento no se hará de golpe en los 12 países, sino de manera paulatina según la capacidad que tenga el equipo operativo para auditar los datos.
*   **Incentivos a la validación:** Además de los bloqueos, se propuso incentivar positivamente a los usuarios para que se validen voluntariamente, ofreciéndoles bonos para cubrir fletes de devoluciones injustificadas, masterclasses en finanzas, acceso a "Kits Dropi" y destacándolos como "negocios serios" ante los proveedores.
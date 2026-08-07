# Casos externos de referencia — empresas verificables por gap de Dropi (transición a Fase 5)

## Contexto y propósito

Investigación con WebSearch/WebFetch (3 exploraciones en paralelo) para responder: ¿qué empresas ya resolvieron problemas parecidos a los de Dropi, con fuente verificable, que Producto pueda citar ante stakeholders? Incluye una auditoría de los casos que ya cita `docs/validacion/Discovery inicial.md`, porque ese documento no traía fuentes y dos de sus cinco casos resultaron problemáticos.

Este documento existe como pieza standalone para que Producto pueda llevar a una reunión únicamente la evidencia externa —casos, URLs y fuerza de evidencia por gap— sin arrastrar el análisis interno de riesgos. Es el documento hermano de `Discovery-Riesgos-Transicion-Fase5.md`: aquel mapea qué riesgos y qué datos faltan del lado de Dropi para la transición a Fase 5; este mapea qué empresas de afuera ya resolvieron cada uno de esos gaps y con qué respaldo público.

---

## 1. Corrección necesaria en `Discovery inicial.md`

| Caso citado en `Discovery inicial.md` | Veredicto | Acción recomendada |
|---|---|---|
| Consensys + Trulioo (KYB automatizado) | **Verificado** — [case study oficial de Trulioo](https://www.trulioo.com/resources/case-studies/consensys-captures-global-verification-efficiency): onboarding de 30-60 min a minutos | Agregar la URL como fuente |
| iFAST Global Bank (identidad + antifraude + scoring) | **Verificado** — [case study oficial de Sumsub](https://sumsub.com/customers/ifast/): 73.5% de aprobación, verificación <1 min | Agregar la URL como fuente |
| Wirex (KYC+KYT unificado) | **Verificado**, con matiz — [case study de Sumsub](https://sumsub.com/customers/wirex/): 83% de aprobación, verificación mediana de 1 segundo | Agregar la URL; **quitar o matizar la cifra "200 países"**, que no está confirmada en el contexto de compliance (existe para un producto distinto de Wirex) |
| Detelio (automatización KYB corporativo) | **Parcialmente verificado** — las cifras "5x más rápido" / "-50% revisión manual" sí están publicadas, pero como benchmark de marketing propio del proveedor, sin cliente nombrado ni caso auditado | Citar solo como "cifra publicada por el proveedor", nunca como "caso de éxito verificado" |
| **Merama, Kavak, Nuvemshop, VTEX** (referentes LATAM con problemas de KYC similares a Dropi) | **NO VERIFICADO — sin ninguna fuente localizable** | **Retirar o reformular** esta mención antes de mostrar el documento a stakeholders. Es un riesgo reputacional real: si alguien pide la fuente, no existe. Puede reformularse como "empresas del sector que probablemente enfrentan retos comparables" sin atribuirles acciones o resultados concretos |

---

## 2. Casos verificados nuevos, organizados por el gap específico de Dropi

### 2.1 Onboarding progresivo — dejar operar sin bloquear, solo pedir KYC/KYB al cruzar un umbral

- **Stripe Connect** — mecanismo técnico documentado con dos flags independientes, `charges_enabled` y `payouts_enabled`: la plataforma puede dejar vender sin permitir aún cobrar. Es la arquitectura más parecida 1:1 a lo que Fase 5 ya diseña (bloquear solo salidas de dinero). [Stripe Docs](https://docs.stripe.com/connect/handling-api-verification)
- **eBay** — gate por umbral explícito (US$600 en ventas/año) que exige identidad + dato fiscal juntos; si no se completa, payouts en hold. [eBay Help](https://www.ebay.com/help/selling/getting-paid/payments-holds?id=4816)
- **Airbnb** — payout suspendido sin identidad + info fiscal, pero el host sigue pudiendo operar (publicar, recibir reservas) hasta cierto punto. [Airbnb Help](https://www.airbnb.com/help/article/122)
- **Uber (caso de contraste)** — exige KYC completo *antes* del primer viaje, no solo antes de cobrar. Útil para argumentarle a stakeholders qué NO replicar si se quiere preservar la conversión temprana.

### 2.2 Hard gate específico en el momento del retiro — el caso más fuerte de todo el informe

- **CS.Money + Sumsub** — verificación obligatoria solo al momento del retiro (no para comprar/vender dentro de la plataforma). Pasaron de ~2 horas y 62.64% de aprobación a **8 segundos y 92.6% de aprobación**, +32% de conversión. Es el caso más citable de todos: mismo proveedor que usa Dropi (Sumsub), mismo patrón exacto de gate solo-en-salida. [Sumsub Case Study](https://sumsub.com/customers/cs-money/)
- **Binance / Coinbase** — sistema de tiers de KYC ligado a límites de retiro (no verificado = retiro mínimo; verificado = retiro alto); el usuario opera con verificación mínima y el retiro es el punto donde escala el nivel exigido. Referencia directa para diseñar límites graduales en vez de todo-o-nada.

### 2.3 Unificación identidad + datos fiscales en un solo flujo

- **Consensys + Trulioo** (ver sección 1) — mismo problema de herramientas fragmentadas que describe `Historia.md`, resuelto centralizando KYB/KYC/screening en un solo proveedor.
- **Twitch** — "tax interview" única que junta W-9/W-8BEN con identidad del beneficiario antes de habilitar payout; si no se completa, retiene automáticamente hasta 30% en vez de bloquear la creación de contenido — modelo alternativo al hard gate total, vale la pena considerarlo como opción de diseño.

### 2.4 LATAM — el caso más relevante culturalmente

- **Rappi + Jumio** — verificación de identidad **ligada a una acción específica** (asignar una entrega al repartidor), no a la navegación general, en México, Colombia, Brasil y Perú. Más de 750.000 cuentas de RappiPay abiertas tras la implementación. Es el único caso LATAM de todo el informe con fuente sólida y métrica pública — el más natural para citar ante un equipo de Producto colombiano. [Jumio Press Release](https://www.jumio.com/about/press-releases/rappi-onboarding-latin-america/)
- Mercado Pago, Nubank, Wise LATAM, dLocal, VTEX, Bold, Addi: sin case study público verificable — no citar como caso documentado (ver sección 1 sobre el mismo problema con Merama/Kavak/Nuvemshop/VTEX).

### 2.5 KYT cripto en plataformas que no son exchanges — el gap de Dropi más difícil de referenciar

- **Triple-A + Elliptic** — pasarela de pago cripto (no exchange) usada por +20.000 negocios de e-commerce; integraron blockchain analytics de Elliptic para reducir falsos positivos en screening de origen de fondos. Cliente real nombrado, sin métricas numéricas exactas. [Elliptic Case Study](https://www.elliptic.co/media-center/case-study-triple-a)
- **Chainalysis KYT + Authsignal** — arquitectura documentada (no caso de cliente): al iniciar un retiro se consulta la wallet destino, y según el score de riesgo (LOW/MEDIUM/HIGH/SEVERE) se aplica Allow/Block/Challenge/Review, disparando verificación adicional en la misma llamada. Es el patrón técnico exacto que Dropi necesitaría para KYT + step-up combinados. [Authsignal](https://www.authsignal.com/blog/articles/automating-chainalysis-workflows-how-to-integrate-chainalysis-kyt-with-authsignai-to-mitigate-crypto-crime-and-streamline-operations)
- No existe ningún caso público que combine "marketplace LATAM + retiro cripto + KYT" con nombre y métricas — es terreno sin precedente documentado, coherente con que Historia.md marque KYT como escenario sin definir.

### 2.6 Fraude posterior a un KYC aprobado — step-up authentication

- **Revolut** — el caso con las cifras más sólidas de todo el informe: bloqueó **US$13.5 millones** en transferencias cripto potencialmente fraudulentas en 3 meses (2024); **92% de las transacciones pasan sin fricción adicional**, solo 1 de cada 5.000 termina en cierre de cuenta. Step-up selectivo, no generalizado — exactamente el balance que Fase 5 necesita para no penalizar al usuario legítimo. [Cointelegraph](https://cointelegraph.com/news/revolut-prevents-14-million-fraud-crypto-3-months)
- **Nubank** — "Defense Platform": orquestador que enruta eventos (ej. transacciones PIX) por reglas + ML, con biometría facial como gate de step-up para operaciones riesgosas, activo por default. Blog técnico oficial, sin % de fraude evitado pero con métricas de infraestructura. [Nubank Engineering Blog](https://building.nubank.com/scaling-fraud-defense-how-nubank-evolved-its-risk-analysis-platform/)

### 2.7 Bloqueo cruzado entre países / identidad compartida — el gap de "Buscador Multipaís"

- **Sumsub Reusable KYC** — mismo proveedor que ya usa Dropi. Caso **PayDo**: +10% en tasa de aprobación, **-23% en fraude auto-confirmado** al compartir una identidad ya verificada entre entidades/jurisdicciones. Caso **Mercuryo**: expansión "a través de jurisdicciones sin construir flujos de KYC separados". Es el candidato más directo para pedirle a Sumsub, dado que Dropi ya tiene contrato con ellos. [Sumsub Customer Cases](https://sumsub.com/customers/reusable-kyc-case/)
- **Industry Sharing Safety Program (Uber + Lyft, vía HireRight)** — el caso más transferible conceptualmente, aunque no es de identidad ni es entre países de una misma empresa: dos compañías competidoras comparten señales de baneo por incidentes graves a través de un intermediario neutral, con reglas de gobernanza claras sobre qué se comparte y cómo se protege la privacidad. Útil como referencia de *cómo diseñar la gobernanza* del "Buscador Multipaís" de Cartera, no solo la tecnología. [Comunicado oficial de Uber](https://www.uber.com/us/en/newsroom/industry-sharing-safety/)
- **Airbnb** — banea cuentas "estrechamente asociadas" a un usuario ya baneado (misma tarjeta de crédito, etc.), confirmado por la empresa a prensa aunque sin documento técnico propio. Evidencia de que vincular por señales compartidas (no solo documento) ya es práctica de industria.

---

## 3. Tabla resumen — fuerza de evidencia para citar ante stakeholders

| Caso | Gap de Dropi que aborda | Fuerza de evidencia |
|---|---|---|
| CS.Money + Sumsub | Hard gate solo en retiro | Alta — case study oficial con números |
| Revolut | Step-up post-KYC ante fraude | Alta — cifras exactas y públicas |
| Rappi + Jumio | Referencia LATAM, gate ligado a acción específica | Alta — press release con cifras, contexto regional |
| Stripe Connect | Onboarding progresivo (arquitectura técnica) | Alta — documentación oficial |
| eBay | Gate por umbral, identidad+fiscal unificados | Alta — help center oficial |
| Sumsub Reusable KYC (PayDo/Mercuryo) | Identidad compartida entre países/entidades | Alta — casos reales con métricas, mismo proveedor que Dropi |
| Consensys + Trulioo | Unificación KYC/KYB fragmentado | Alta — case study oficial |
| iFAST Global Bank / Wirex | Identidad + antifraude + KYT unificados | Alta — case studies oficiales de Sumsub |
| Nubank Defense Platform | Arquitectura de step-up | Alta — blog técnico oficial, sin métrica de fraude evitado |
| Triple-A + Elliptic | KYT cripto en no-exchange | Media — cliente real, sin métricas numéricas |
| Industry Sharing Safety Program | Gobernanza de bloqueo cruzado | Media — comunicado oficial, sin métrica de reincidencia |
| Chainalysis KYT + Authsignal | Arquitectura KYT + step-up combinados | Media — patrón técnico, sin cliente nombrado |
| Detelio | Automatización KYB | Baja — cifra de marketing propio, no caso auditado |
| Merama/Kavak/Nuvemshop/VTEX | — | **Nula — no citar** |

---

## 4. Conclusión

Ningún caso encontrado combina las tres características exactas del contexto de Dropi (marketplace LATAM + retiro en cripto + 12 países) — es terreno relativamente pionero para la región. Lo más honesto ante stakeholders es presentar esto como adaptación de patrones ya probados en otros verticales (fintech global, exchanges, movilidad), no como "así lo hizo una empresa igual a nosotros". El caso más cercano en conjunto sigue siendo **Sumsub** mismo (CS.Money, iFAST, Wirex, PayDo, Mercuryo, Jeton) — tiene sentido, porque es el proveedor que Dropi ya contrató: vale la pena pedirle directamente a Sumsub referencias de clientes con un perfil más parecido a Dropi (marketplace, no fintech pura) antes de asumir que hay que inventar el patrón desde cero.

---

## Verificación

Todas las URLs citadas en este documento fueron obtenidas vía WebFetch real durante la investigación, no inventadas. Antes de presentar el documento a stakeholders, hacer un click-through rápido de las URLs para confirmar que siguen vivas: los case studies de proveedores se reorganizan con frecuencia. No requiere pruebas automatizadas por ser un documento.

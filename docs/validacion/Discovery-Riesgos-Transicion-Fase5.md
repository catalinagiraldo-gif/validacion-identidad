# Discovery: riesgos, experiencia e impacto cruzado — transición a Fase 5 (validación de identidad tech-native)

## Contexto y propósito

Dropi está migrando su flujo de validación de identidad (KYC/KYB) y facturación de un modelo no-code (UserPilot + CRM + Google Sheets, actualización manual) a un flujo tech-native documentado en [`Service_Blueprint_Diagrama_Fase_5.md`](./Service_Blueprint_Diagrama_Fase_5.md): sync automático vía webhook con Truora/Sumsub, hard gate nativo en retiros/transferencias/DropiCard, y una cola de excepciones que debe bajar de ~40% manual a ≤8%.

Ese blueprint es sólido para el **journey feliz** (usuario completa lo que le falta), pero es un diseño de interacción — no un documento de riesgo, de impacto en otros proyectos, ni de qué datos hacen falta para ejecutar bien la transición. El pedido es cerrar esa brecha: usar todo lo ya escrito en `docs/validacion/`, el proyecto hermano **BAC-001** (Darwin, célula Backoffice, PO Paula Macias), un informe de benchmark de industria (`Discovery inicial.md`) y el estado real del código de este repo, para producir un mapa de:
1. Riesgos que el blueprint Fase 5 no cubre o cubre solo parcialmente.
2. Cómo afecta la experiencia del usuario más allá del happy path.
3. Qué otros proyectos activos de producto (en este repo y en Darwin) se ven afectados.
4. Qué datos/fuentes hacen falta, con su origen exacto, para que la transición no pierda información que hoy vive dispersa en Excel/Sheets/repos manuales.

Este documento sintetiza los hallazgos de 3 exploraciones en paralelo (docs/validacion restante, código de este repo, proyectos Darwin) más lo ya leído en esta conversación (blueprint Fase 5, BAC-001, Discovery inicial.md).

---

## 1. Riesgos no cubiertos (o cubiertos solo parcialmente) por el blueprint Fase 5

### 1.1 Cumplimiento externo / legal

| Riesgo | Fuente | Por qué no está en Fase 5 |
|---|---|---|
| DropiCard entrega tarjetas sin validación clara de identidad de quien las usa realmente — riesgo de **violar los requerimientos de la franquicia Visa** | `Consem2.md` L4 | Fase 5 bloquea *solicitar* DropiCard si falta identidad, pero no aborda la transferencia posterior a un tercero no validado |
| Facturas a personas jurídicas inválidas por receptor fiscal inexistente/inactivo — **CFDI 4.0 (México)**, **AFIP/ARCA (Argentina)** | `Historia.md` L13 | Riesgo fiscal por país no está mapeado como bloqueante en el blueprint |
| Ecuador ya exige bases de datos claras de usuarios por ley | `Consem2.md` L6 | Presión regulatoria externa, no interna de producto |
| KYT (screening de wallets cripto/Tether contra OFAC) sin escenario definido | `Historia.md` L64-70; BAC-001 kickoff; `Discovery inicial.md` §5.1 | Es Fase 3 del roadmap BAC-001 — **posterior** a este blueprint. El hard gate C3 no menciona explícitamente wallets cripto como trigger |
| Rechazo por antecedentes de lavado de activos debe bloquear **sin revelar la investigación** al usuario | `Consideraciones.md` L16; RN-28 | Tensión entre transparencia UX (Fase 5 promete explicar "qué falta") y protección de la investigación — no resuelta explícitamente |
| El proveedor (Truora/Sumsub) nunca se nombra al usuario, aunque procesa sus datos personales | `UX-Writing-Validacion-TechNative.md` | Decisión de branding con implicación de transparencia de datos frente a terceros — vale confirmar con Legal/Compliance |

### 1.2 Técnicos

- **Comportamiento inconsistente de Truora según tipo de documento** (cédula vs. pasaporte): con cédula, un documento distinto dispara rechazo por no-coincidencia; con pasaporte, el contraste funciona diferente. Hallazgo empírico de una prueba real, **sin confirmar por el equipo técnico** a junio 2026 (`Hablemos del proyecto validación de identidad...md`, min 30:15).
- **Extranjeros con pasaporte**: 49% de tasa de éxito en Truora (BAC-001, ~32 pts por debajo de cédula nacional) por búsqueda de listas negras por nombre → falsos positivos por homónimos. `StartUser.md` L78 lo atribuye además a que Dropi no reconoce bien el catálogo de documentos extranjeros — es un problema doble (proveedor + catálogo propio), no solo de UX.
- **Contradicción de reglas de negocio detectada entre documentos del propio proyecto**: `Reglasvalidacion.md`/`Consideraciones.md` establecen que **recargar wallet nunca debe pedir validación** ("Regla de Validación Nula" / "La orden se le cuida siempre"), pero una nota de julio 2026 en `Service_Blueprint_Diagrama Fase 0.md` (L312) dice que el botón **"Recargar" ahora también dispara el interceptor**. Esto no está resuelto en el blueprint Fase 5 — hay que confirmar cuál regla es la vigente antes de construir.
- **Tres tipos de "Pendiente" que hoy se mezclan** (en revisión de Financiero / incompleto en Sumsub / nunca inició) — Fase 0 documenta que el tercer caso "no tiene backstage propio" (`Service_Blueprint_Diagrama Fase 0.md` L309). Vale confirmar si C6 de Fase 5 los diferencia igual de bien en la práctica.

### 1.3 Negocio / financieros

- **Costo duplicado durante ~7-8 meses**: Colombia paga Truora + Sumsub en paralelo mientras dura la transición (`Historia.md` L134) — riesgo financiero que Producto debe visibilizar, no solo de UX.
- **Sumsub cobra por "bolsa" de validaciones**, no por uso ilimitado — el diseño del flujo debe evitar validaciones redundantes por decisión financiera, no solo de UX (`Historia.md` L136; `Consideraciones.md` L10).
- **El hard gate solo se activa si el usuario intenta retirar/transferir/pedir DropiCard.** Los Top 5 usuarios no-validados por volumen en BAC-001 mueven 200K–530K órdenes lifetime — si un Supplier de ese volumen no pasa nunca por una acción de salida de dinero, el loop de Fase 5 no lo alcanza nunca. Es el supuesto más riesgoso del diseño: la validación depende de una acción del usuario, no de su exposición de riesgo.
- **Fraude posterior a un KYC exitoso**: 78 usuarios de BAC-001 pasaron Truora y luego fueron baneados — confirma que biometría sola no previene fraude; Fase 5 no define un mecanismo de monitoreo post-aprobación (KYT/ATO) equivalente al descrito en `Discovery inicial.md` §5.3 (Step-up Orchestration).

### 1.4 Gobernanza / ejecución

- **Compliance/Admin no ha parametrizado las reglas de Sumsub a tiempo** — riesgo de cronograma documentado en la transcripción de la reunión de diseño ("ya hicieron la contratación, se libran del proceso").
- **Decisión Legal pendiente sobre el 40% que hoy se valida a mano** (RN-25) — sin esa decisión, no se puede fijar la meta real de la cola de excepciones (¿≤8% o el número absoluto <800 casos/mes de `Historia.md` L35, que no es lo mismo que un porcentaje?).
- **Gap real en la fuente de datos de facturación**: `Copia de Información Datos de Facturación LATAM.xlsx` cubre 9 países × 3 tipos de persona, pero **Paraguay no tiene "Persona Extranjera" definida** — pendiente de Legal/PO antes de poder construir ese país.

---

## 2. Impacto en la experiencia (UX) más allá del happy path

- **Triple captura persiste como riesgo residual**: si algo fuera del control del usuario falla (sync, timeout, proveedor caído), el usuario puede terminar re-ingresando datos — el blueprint Fase 5 no tiene un mecanismo explícito de "recordar lo ya tecleado" ante fallos de proveedor.
- **Estados de bloqueo inconsistentes entre módulos** (ver §4) — si Wallet dice "bloqueado" y Datos de facturación dice "aprobado" para el mismo usuario, el usuario pierde confianza en el sistema — esto ya es un riesgo de implementación, no solo de diseño (ver hallazgo V1/V2 en el código).
- **"Bloqueado" ≠ "Rechazado"** requiere comunicación cuidadosa porque no tiene ETA (Regla E) — el árbol de soporte Fase 5 ya lo contempla, pero es un punto de fricción real: el usuario no puede "hacer nada" para resolverlo él mismo.
- **Onboarding progresivo vs. gating estricto** (`Discovery inicial.md` §4.1): la industria evita exigir KYB completo antes de dejar operar — Fase 5 ya sigue este patrón (bloquea solo salidas de dinero), lo cual es coherente con la mejor práctica, vale la pena citarlo como validación externa del enfoque.

---

## 3. Impacto en otros proyectos de producto

### 3.1 Dentro de Darwin (dropi-agente-pm)

| Proyecto | Célula / PO | Por qué se ve afectado |
|---|---|---|
| **BAC-002 — Facturación Electrónica Argentina** | Backoffice / Paula Macias (misma PO que BAC-001) | Mismo proveedor (Sumsub), directriz ejecutiva reciente de saltar la Fase Cero e ir directo a Fase 1 en todos los países con flujo "largo" (GT, PA, PY, PE, MX, VE, CR) o "corto" (CL, EC, AR ya con facturación activa en Dropi). Bug de sync en Ecuador: wallet queda bloqueada tras aprobar por retraso de sincronización — mismo patrón de riesgo que BAC-001 |
| **Seguridad Retiros dropiPay** | Fintech | Candidato más directo a depender del resultado de KYT/KYC de BAC-001 (antifraude en retiros) |
| **Discovery SAC & Help Center** | Seller Success | 32,8% de los 3.664 tickets mensuales de soporte son por Wallet (estado de retiros, recargas). Meta: bajar de 1.202 a <400 tickets. Si Sumsub introduce falsos positivos o retrasos de sync (como ya documenta BAC-001), este proyecto pierde su KPI principal |
| **Perfil Marca Independiente** | Brands Success | Proyecto activo que unifica cuentas Proveedor/Dropshipper (hoy separadas solo para tener 2 wallets contables). Si BAC-001 define identidad/KYB única por persona jurídica, hay que coordinar explícitamente — riesgo de diseñar dos soluciones al mismo problema en paralelo |
| **BAU Competitivo Marcas** | Brands Success | Ya documenta "retiro de wallet ágil" como brecha frente a SkyDrop/99envios/Confío. Cualquier fricción adicional de Sumsub en retiros empeora una debilidad competitiva ya reconocida |
| **Oportunidades por País (México)** | Seller Success (workshop) | "Disposición de fondos lenta" y "DropiCard con fricciones" ya son dolores documentados en México, justo el país con flujo "largo" de Sumsub planeado |

### 3.2 Dentro de este repo (`validacion-identidad` / RPP Hub)

Ver §4 — hay doble implementación (`old` vs `new`) de casi todos los módulos financieros, con dos servicios de estado de identidad independientes que no se sincronizan entre sí.

---

## 4. Impacto en el código/prototipo actual de este repo

- **Ya existe un patrón reutilizable**: `IdentityGateComponent` (`src/app/common/components/identity-gate/`), parametrizado por `contexto: 'retiro' | 'dropicard' | 'transferencia' | 'facturacion'`, integrado en `wallet.component.ts`, `dropicard.component.ts` (new) y `retiros-saldo.component.ts` (new). Cualquier trabajo de Fase 5 en este repo debería **extender este componente**, no crear un tercer mecanismo.
- **Riesgo real — dos servicios de estado sin sincronizar**:
  - `IdentityDemoStateService` (V1): estado simple (`sin_validar | pendiente | en_revision | rechazado | aprobado`), usado por wallet/dropicard/retiros-saldo/mis-pedidos.
  - `IdentityDemoStateV2Service` (V2): estado granular (`estadoKYB`, `riskScore`, `webhookConfirmed`, `emailBaneado`, `repLegalValidado`...), usado por `datos-facturacion` y `cuenta` (new).
  - El propio código documenta en comentario que **nunca se leen entre sí**. Un usuario "aprobado" en Cuenta/Facturación (V2) puede seguir viendo bloqueo en Wallet/DropiCard (V1) — el mismo riesgo de UX de "estados inconsistentes entre módulos" de §2, pero ya materializado en el prototipo actual.
- **Rutas `/old/*` sin gate**: `pages/old/historial-cartera/historial-cartera.component.ts` no importa `IdentityDemoStateService`; su template tiene "Recargar Cartera" y **"Transferencia entre wallets"** sin ningún guard, mientras la ruta `/new` equivalente sí lo tiene. Ambas rutas siguen activas — riesgo de que QA valide la ruta equivocada y la dé por cubierta.
- **`pages/old/dropicard/dropicard.component.ts`**: `solicitarTarjeta()` es un placeholder vacío sin chequeo de estado — solo hay un banner informativo, no un bloqueo real del CTA.
- **`pedidos/orden-manual`** (modal, listado como WORKING en CLAUDE.md) no tiene ningún gate — si el alcance de Fase 5 llegara a incluir órdenes con recaudo, parte de cero ahí.

---

## 5. Mapeo completo de `/new/` — qué tocar según Fase 5

Todas las rutas `/new/*` cuelgan de `LayoutNewComponent`. A nivel de **layout global** ya corre un stack de identidad "Fase 0" completo, en paralelo al `IdentityGateComponent` que se usa página por página: `IdentitySumsubModalComponent`, `IdentityFase0InterceptorComponent`, `IdentityFase0BlockComponent`, `IdentityFase0ResultComponent`, `IdentityFase0CrmToastComponent`, `IdentityFase0SumsubStandinComponent`, `IdentityFase0StateSwitcherComponent`, `IdentidadTourComponent`. **Decisión previa a cualquier build de Fase 5: ¿se integra sobre este stack Fase 0 ya existente, o se reemplaza?** — construir una tercera capa sin decidir esto agravaría el problema de estados sin sincronizar de §4.

También existe `prototype-demo-panel.component.ts` (panel de control de demo) que ya pilota manualmente los 3 servicios de identidad (V1, V2, Fase0) — es el punto de referencia para ver todos los estados simulables hoy.

### Financiero — ya tiene lógica, pero incompleta o inconsistente

| Ruta `/new/...` | Componente | Estado de identidad hoy |
|---|---|---|
| `historial-de-cartera` | `financiero/wallet/wallet.component.ts` | V1 + V2 + Fase0 + banners + `IdentityGateComponent(contexto="transferencia")` |
| `dropi-card/cards` | `financiero/dropicard/dropicard.component.ts` | V1 + Fase0 + `IdentityGateComponent(contexto="dropicard")` |
| `financiero/retiros-de-saldo` | `financiero/retiros-saldo/retiros-saldo.component.ts` | V1 + Fase0 + `IdentityGateComponent(contexto="retiro")` |
| `financiero/datos-facturacion` | `financiero/datos-facturacion/datos-facturacion.component.ts` | **Parcial** — V1/V2/Fase0 inyectados, pero **sin** `IdentityGateComponent` ni banner activo, pese a ser exactamente el módulo "Datos de facturación" que Fase 5 define con su propio banner "Estamos confirmando tus datos" |
| `financiero/datos-bancarios` | `financiero/datos-bancarios/datos-bancarios.component.ts` | Ninguna — relacionado a retiros/transferencias, sin ningún gate |
| `financiero/facturas`, `financiero/notas-credito` | — | Ninguna (fuera del alcance de identidad, esperado) |
| *(huérfano, sin ruta)* | `financiero/facturacion/facturacion.component.ts` | Existe en disco pero no está en `app.routes.ts` — parece duplicado/legado de `datos-facturacion`; aclarar con el equipo si se elimina |

### Cuenta / Configuración

| Ruta `/new/...` | Componente | Estado de identidad hoy |
|---|---|---|
| `configuraciones/cuenta` | `configurar/cuenta/cuenta.component.ts` | **Parcial** — mismos servicios inyectados que facturación, pero sin `IdentityGateComponent` ni banner activo; es el módulo "Información de cuenta" que Fase 5 define con formulario + banner de confirmación |
| `configuraciones/flujo-identidad-2026-06-18` | `configurar/flujo-identidad/flujo-identidad.component.ts` | Hub/demo dedicado enteramente al flujo de identidad |
| `configuraciones/{seguridad, integraciones, referidos, tienda, usuarios, dropitesters}` | — | Ninguna (esperado, no relacionados) |
| `configuraciones/{datos-personales, validacion-identidad, verificacion-identidad, validacion-identidad-hub, validacion-identidad-pais}` | Apuntan a `pages/old/...` | Arquitectura vieja, sin migrar — decidir si se migran antes de construir Fase 5 encima o se dejan como están |

### Pedidos / Home / Dashboard

| Ruta `/new/...` | Componente | Estado de identidad hoy |
|---|---|---|
| `home` | `home/home.component.ts` | Ya tiene `IdentitySoftBannerComponent(variant="home")` + banner de migración + panel Fase0 — **candidato natural ya montado** para el slide-up soft touch C2 |
| `mis-pedidos/mis-pedidos` | `pedidos/ordenes/ordenes.component.ts` | Tiene `IdentitySoftBannerComponent(variant="pedidos")` con copy de primera venta, pero es un **banner, no el modal** que C4d de Fase 5 describe ("¡Tu primera venta en Dropi!" con botones Completar/Ahora no) |
| `dashboard` | `dashboard/dashboard/dashboard.component.ts` | **Ninguna** — si Fase 5 también debe cubrir Dashboard (no solo Home) para el soft touch, aquí falta todo |
| `pedidos/orden-manual`, `pedidos/mis-pedidos-proveedor` | `pages/old/orders-manual`, `pages/old/orders-provider` | Ninguna — siguen sirviendo componentes viejos sin migrar |

### Header / Sidebar — vacío

`header-new.component.ts` y `sidebar-new.component.ts` no tienen **ningún** indicador visual de estado de cuenta hoy. El blueprint Fase 5 no pide explícitamente uno, pero es el lugar natural si se quisiera dar visibilidad persistente del estado (más allá del banner de página).

### Resto de secciones (Productos, Marketing, Logística, Reportes, CAS, Academy)

Sin ninguna lógica de identidad — coherente con que Fase 5 no los menciona. No requieren cambios salvo que el alcance se amplíe explícitamente.

### Qué tocar, en orden de menor a mayor esfuerzo

1. **`datos-facturacion.component.ts`** y **`cuenta.component.ts`** — ya tienen los servicios inyectados; falta enganchar el banner "Estamos confirmando tus datos" y, si aplica, el `IdentityGateComponent`. Es la brecha más barata de cerrar y la más alineada 1:1 con el texto de Fase 5 (C4, C5).
2. **Modal de bienvenida C4d** — no existe hoy como modal (solo el banner de `ordenes.component.ts`). Hay que construirlo o confirmar si el banner existente se considera "suficiente" para esta iteración.
3. **`dashboard.component.ts`** — decidir si el soft touch C2 debe vivir también aquí, no solo en Home.
4. **Unificar V1/V2/Fase0** antes de seguir enganchando módulos nuevos (ver §4 y la pregunta 5 de §7) — cualquier trabajo de los puntos 1-3 hereda la inconsistencia si no se resuelve primero.
5. **Archivo huérfano `financiero/facturacion.component.ts`** y las rutas `/new/configuraciones/*` y `/new/pedidos/*` que aún sirven componentes `old` — limpieza fuera del alcance funcional de Fase 5, pero relevante para no construir sobre una base ambigua.

---

## 6. Datos a considerar, con fuente

| Dato / fuente | Dónde vive hoy | Para qué sirve en la transición | Gap conocido |
|---|---|---|---|
| Estados históricos Truora (CO) | Google Sheets actualizado a mano (Legal/Admin/Cartera/CRM) — Fase 0 | Es la fuente que el sync automático de Fase 5 debe reemplazar; sirve para reconciliar antes del corte | Sin API, sin Zapier/HubSpot — 100% manual (`Service_Blueprint_Diagrama Fase 0.md` L46) |
| Excel semanal de Sumsub | Descargado a mano por Legal, subido a UserPilot | Referencia de formato de estados hasta que el webhook lo reemplace | Reemplazado por sync automático en Fase 5, pero es el "antes" a validar en paralelo durante el corte |
| `Copia de Información Datos de Facturación LATAM.xlsx` | `docs/validacion/` (este repo) | Reglas exactas de facturación por país (9 países × 3 tipos de persona: natural, jurídica, extranjera) | Paraguay sin hoja/definición de "Persona Extranjera"; error de copy-paste detectado en hoja Colombia (celda F4) |
| Repositorio interno de Cartera (usuarios ya validados) | Cargado manualmente al backoffice de Sumsub | Evitar re-validar usuarios que ya tienen historial | Migración/homologación pendiente |
| Script Python — "Buscador Multipaís" | Cartera | Cruce de baneo entre países (por documento, no solo correo — Andrés Herrera, Cartera) | No documentado como servicio versionado; vive como script suelto |
| Dashboard 28 CSVs (BAC-001) | `dropi-agente-pm/hub/.../bac-001/page.tsx` | Evidencia cuantitativa real de Colombia: 12.402 procesos Truora, 29.328 sin KYC, 3.369 en desfase de sync, 78 fraude post-KYC, 20 posible suplantación, etc. | **Solo existe para Colombia.** No hay el mismo ejercicio de auditoría de datos para los otros 11 países — es el gap de evidencia más grande para escalar Fase 5 fuera de CO |
| `mocks/users.json` (este repo) | `d:\validacion-identidad\mocks\` | Base para simular estados en el prototipo | No tiene ningún campo de identidad/KYC/facturación — todo el estado vive en `sessionStorage`, no en el mock |
| Volumetría de migración | `Service_Blueprint_Diagrama Fase 0.md` L34 | ~115.000 usuarios colombianos ya validados con Truora migran a Sumsub en la Pre-Etapa | Cifra sin contraparte para el resto de países |

---

## 7. Preguntas abiertas que valdría la pena escalar antes de avanzar

1. ¿La regla de "recargar nunca bloquea" sigue vigente, o la actualización de julio 2026 (recargar sí dispara interceptor) es la decisión final? — hoy hay dos documentos del mismo proyecto que se contradicen.
2. ¿Qué pasa con el usuario si Truora falla la validación cruzada solo cuando el documento es cédula (vs. pasaporte)? — sigue sin confirmar por TI a la fecha de la última reunión documentada.
3. ¿Cómo se coordina BAC-001 con BAC-002 (misma PO, mismo proveedor, directriz ejecutiva de ir directo a Fase 1) para no duplicar diseño de flujo por país?
4. ¿Quién audita KYT (cripto) y cuándo — antes o después de que Fase 5 salga a producción, dado que hoy es un riesgo legal activo sin escenario de UX definido?
5. ¿Se decide ya la unificación V1/V2/Fase0 de estado de identidad en este repo (§4 y §5) antes de seguir construyendo más módulos sobre cualquiera de los tres mecanismos?
6. `financiero/facturacion.component.ts` (huérfano, sin ruta) — ¿se elimina o reemplaza a `datos-facturacion.component.ts`?
7. El modal de bienvenida C4d de Fase 5 no existe hoy (solo hay un banner en `ordenes.component.ts`) — ¿se construye como modal nuevo o se reinterpreta el banner existente como su equivalente para esta iteración?

---

## Verificación

Contrastar este documento con Paula Macias (PO de BAC-001/BAC-002) y con TI para confirmar que los puntos abiertos (§7) reflejan el estado real y no supuestos desactualizados. No requiere pruebas automatizadas por ser un documento.

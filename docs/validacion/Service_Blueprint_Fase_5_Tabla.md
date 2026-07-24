# Service Blueprint — Validación tech-native: tabla resumida

> Lectura rápida del [Blueprint](Service_Blueprint_Diagrama_Fase_5.md). Pareja: [`Service_Blueprint_Fase_5_Tabla.html`](Service_Blueprint_Fase_5_Tabla.html).
>
> ⚠️ Loop de **completar gaps**, no edición Historia Fase 5.
>
> 📐 **C2 · C3 · C4 son canales en paralelo** (no Soft → Hard → Módulo). Condiciones: [Mapa](Service_Blueprint_Fase_5_Mapa-Decision.md).

| Etapa | Tipo | SI entra cuando… | Qué pasa | Sale a | NO es |
|---|---|---|---|---|---|
| **0. Prep** | Secuencial backstage | Jobs de sync / lote | Alinea Sumsub↔Dropi; migra pending EC/CL/AR → `en_revision` | **C1** con flags | Una pantalla de usuario |
| **1. Segmentación** | Rombo | Flags listos (sesión) | ¿Identidad? ¿Facturación? ¿Pending? | Idle **o** espera canal | Un modal |
| **2. Soft** | Canal A paralelo | Hay gap **y** Home/pasivo | Slide-up *Verifica tu cuenta*; X cierra | CTA → **C5** (o C4 CO id.) | El paso antes del hard |
| **3. Hard** | Canal B paralelo | Hay gap **y** clic retiro/transfer/DropiCard | Tooltip + modal por gap/país | CTA → **C5** / C4 | Continuación del soft |
| **4. Módulo** | Canal C paralelo | Abre cuenta/facturación **o** 1ª venta | CO: form id. / enlace fact. / lista+alerta · Resto: 1 CTA · Welcome | CTA → **C5** | “Paso 3” de una secuencia |
| **5. Validación** | Convergencia | CTA desde C2 o C3 o C4 | Abre Truora y/o Sumsub; `en_revision`; gate solo salidas | Webhook → **C6** | Form KYB Dropi en CO |
| **6. Resolución** | Cierre | Webhook válido | UI por estado; confetti; cross-sell CO si falta el otro gap | Idle / reintento C5 / cross-sell | Sheet manual |

## Matriz rápida CTA (después del canal)

| Gap | Colombia | Resto | EC/CL/AR |
|---|---|---|---|
| Solo identidad | Mi cuenta → Truora | Sumsub único | Sumsub o banner revisión |
| Solo facturación | Enlace Sumsub (sin form Dropi) | Sumsub único | Sumsub |
| Ambas | Identidad primero → cross-sell facturación | Un enlace | Un enlace |
| Ninguno | Idle | Idle | Idle |
| Pending manual | N/A | N/A | Prep → Sumsub → `en_revision` |

## Mitos vs realidad

| Mito | Realidad |
|---|---|
| Soft → Hard → Módulo | Tres canales paralelos → C5 |
| Cerrar soft = bloqueado | Soft es opt-out; bloqueo solo en salidas (C3) |
| Facturación CO = form Dropi | Enlace Sumsub o lista read-only |
| Fuera de CO también Truora+Sumsub | Un solo Sumsub |

> Detalle SI→ENTONCES: [`Service_Blueprint_Fase_5_Mapa-Decision.md`](Service_Blueprint_Fase_5_Mapa-Decision.md).

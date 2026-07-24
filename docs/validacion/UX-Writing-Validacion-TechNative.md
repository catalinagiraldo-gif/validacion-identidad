# UX Writing — Validación tech-native (loop de completar gaps)

> Copies canónicos para las intervenciones nativas del [Service Blueprint Diagrama Fase 5](Service_Blueprint_Diagrama_Fase_5.md). Idioma: español neutro LatAm. Tono Dropi (directo, cercano, sin jerga de proveedor). Proceso: purposeful → concise → conversational → clear. Los mismos textos viven en las cajas Front Acciones del MD y del HTML.

**Naming:** este pack cubre el **loop de completar validación** (gaps de identidad / facturación). No es la edición post-aprobación de `Historia.md` Fase 5 (ver addendum en el blueprint).

**Mapa de coerción** (de menos a más forzoso):

| Nivel | Mecanismo | Puede evadirse | Cuándo |
|---|---|---|---|
| Soft | Slide-up inferior derecho | Sí (X) | Home / navegación pasiva |
| Welcome | Modal primera venta / primer movimiento wallet | Sí (después / X) | Primer evento de valor |
| Hard | Tooltip + modal interceptor | No (hasta completar o ir al enlace) | Clic en movimiento de salida |
| Estado | Banner / toast de resultado | Depende del estado | Tras webhook |

Truora / Sumsub **no aparecen en copy de usuario**; solo en Nota interna.

---

## 1. Soft — Slide-up inferior derecho

| Elemento | Copy |
|---|---|
| Headline | **Verifica tu cuenta** |
| Body | En Dropi lo necesitamos para confirmar quién eres y mantener la plataforma segura. |
| Botón primario | **Completar ahora** |
| Cierre | Ícono X · `aria-label="Cerrar, verificar más tarde"` |

**Nota interna:** Mismo eje que el banner Fase 0 (`UX-Writing-Modales-UserPilot.md`): motivo = seguridad de la plataforma, no retiros si el usuario aún no tiene saldo. El CTA rutea según gaps (identidad primero en CO si faltan ambos).

---

## 2. Hard gate — Tooltip en movimiento financiero deshabilitado

| Elemento | Copy |
|---|---|
| Tooltip | Completa tu validación para usar esta función. |

**Nota interna:** Hard gate solo en salidas (retiros, transferencias, DropiCard). Órdenes y entradas siguen libres (`Reglasvalidacion.md`).

---

## 3. Hard gate — Modal interceptor (variantes por gap)

### 3a. Falta identidad (prioridad; CO o si el CTA va a Mi cuenta)

| Elemento | Copy |
|---|---|
| Headline | **Completa tu identidad para continuar** |
| Body | Antes de mover fondos necesitamos confirmar quién eres. Te llevamos a Información de cuenta. |
| Botón | **Ir a Información de cuenta** |

### 3b. Solo falta facturación (Colombia)

| Elemento | Copy |
|---|---|
| Headline | **Completa tus datos de facturación** |
| Body | Por seguridad y para desbloquear movimientos financieros, valida tus datos de facturación. Te lleva unos minutos. |
| Botón | **Completar facturación** |

### 3c. Faltan ambas (Colombia)

| Elemento | Copy |
|---|---|
| Headline | **Valida tus datos para continuar** |
| Body | Antes de mover fondos necesitamos tu identidad y tus datos de facturación. Empieza por tu identidad en Información de cuenta. |
| Botón | **Completar identidad** |

### 3d. Resto de países (un solo destino)

| Elemento | Copy |
|---|---|
| Headline | **Valida tus datos para continuar** |
| Body | Antes de mover fondos necesitamos confirmar quién eres. Te llevamos a completar la validación. |
| Botón | **Continuar a validación** |

**Nota interna:** En CO, 3a/3b/3c eligen destino (Mi cuenta → Truora vs enlace Sumsub). Fuera de CO, un enlace Sumsub cubre KYC+KYB. Aviso legal (Términos + Privacidad) igual que Fase 0.5.

---

## 4. Bienvenida — Primera orden o primer movimiento wallet

| Elemento | Copy |
|---|---|
| Headline | **¡Tu primera venta en Dropi!** |
| Body | Qué bueno que ya empezaste. Para retirar o usar tu dinero, completa tu validación de datos. Es por tu seguridad y la de la plataforma. |
| Botón primario | **Completar validación** |
| Secundario | **Ahora no** |

**Nota interna:** CTA usa la misma matriz de gaps que el modal hard (prioridad identidad en CO). Celebración proporcional; no promete DropiCard si el usuario aún no la conoce.

---

## 5. Módulo — Datos de facturación vacío (Colombia)

| Elemento | Copy |
|---|---|
| Headline | **Completa tus datos de facturación** |
| Body | Por seguridad y para desbloquear movimientos financieros, valida tus datos de facturación. No es un formulario aquí: te llevamos al proceso seguro. |
| Botón / enlace | **Completar datos de facturación** |

**Nota interna:** Sin formulario KYB nativo en Dropi (evitar retroceso frente a Sumsub). Enlace abre Sumsub.

---

## 6. Módulo — Datos de facturación completos (read-only)

| Elemento | Copy |
|---|---|
| Headline | **Tus datos de facturación** |
| Body (lista) | Muestra los campos tal como quedaron validados. |
| Alerta | No podrás editar estos datos en los próximos 6 meses. Si necesitas un cambio, escribe a soporte desde el ícono de abajo a la derecha. |

**Nota interna:** RN-11 / fricción defensiva; edición real = flujo hermano (addendum).

---

## 7. Módulo — Información de cuenta (Colombia)

| Estado | Copy / comportamiento |
|---|---|
| Incompleto | Formulario editable → al guardar inicia validación (Truora: liveness + documento). |
| Completo + RN-11 vigente | Formulario visible completo y bloqueado. Tooltip: *Podrás editar este dato el {unlock_at}. Lo bloqueamos temporalmente por seguridad.* |
| Completo + RN-11 vencido | Editable; cambios sensibles disparan el flujo de edición (addendum). |

---

## 8. Éxito parcial + cross-sell (confetti)

### 8a. Completó identidad; falta facturación (CO)

| Elemento | Copy |
|---|---|
| Headline | **¡Identidad lista!** |
| Body | Ya validaste quién eres. Ahora completa tus datos de facturación para desbloquear movimientos financieros. |
| Botón | **Completar facturación** |

### 8b. Completó facturación; falta identidad (CO)

| Elemento | Copy |
|---|---|
| Headline | **¡Datos de facturación listos!** |
| Body | Qué bien. Para desbloquear movimientos financieros también necesitas validar tu identidad en Información de cuenta. |
| Botón | **Ir a Información de cuenta** |

### 8c. Completó todo (cualquier país)

| Elemento | Copy |
|---|---|
| Headline | **¡Cuenta verificada!** |
| Body | Ya puedes transferir tu wallet, registrar datos bancarios y pedir tu DropiCard. |
| Duración | Toast / modal breve con confetti; auto-dismiss 4–5 s |

---

## 9. Estados post-webhook

| Estado | Headline | Body | Botón |
|---|---|---|---|
| `aprobado` | **¡Listo!** | Ya puedes usar tu información actualizada. | — (toast) |
| `en_revision` | **Seguimos revisando tu solicitud** | Puedes seguir operando con lo ya aprobado. No necesitas reenviar documentos. | **Entendido** |
| `incompleto` | **Te falta un paso** | Empezaste la validación pero no la terminaste. | **Continuar validación** |
| `rechazado` | **No pudimos validar tus datos** | Conservamos lo que ya tenías. Puedes reintentar o contactar a soporte. | **Reintentar** / **Contactar a soporte** |
| EC/CL/AR migrado a revisión | **Seguimos revisando tu solicitud** | Tu caso pasó a validación automática. Te avisamos cuando esté lista — no necesitas hacer nada más. | **Entendido** |

---

## Antes → Después (eje del replanteo)

| Antes (jerga / scope edición) | Después (momento del usuario) |
|---|---|
| field_diff / precedencia sensible | ¿Qué te falta? identidad / facturación / ambas |
| Confirma tus cambios para continuar | Completa tu identidad / facturación para continuar |
| Router C/A/B/D/E (en copy usuario) | Un enlace o dos destinos, sin nombrar el motor |
| Habilitación por entidad | ¿Puedes editar este dato ahora? (solo addendum edición) |

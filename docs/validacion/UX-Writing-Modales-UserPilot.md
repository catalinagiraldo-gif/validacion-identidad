# UX Writing — Modales y banners de UserPilot (KYC / Validación de Identidad)

> Copy mejorada para las 5 intervenciones de UserPilot descritas en `Service_Blueprint_Diagrama Fase 0.md` y `Service_Blueprint_Diagrama.html`. Idioma: español neutro LatAm, tono Dropi (directo, cercano, sin jerga legal). Cada bloque sigue el proceso de 4 fases del skill ux-writing: **purposeful → concise → conversational → clear**, más criterios de accesibilidad (WCAG AA, lectura 7°-8° grado, botones con label explícito).

---

## Mapa de coerción (de menos a más forzoso)

| Fase | Mecanismo | Puede evadirse | Frecuencia |
|---|---|---|---|
| FASE 0 | Banner lateral | Sí (botón X) | Una vez por sesión |
| FASE 0.5 | Modal interceptor | No | Reaparece en cada intento |
| FASE 1 | Modal pantalla completa | No | Persistente hasta resolución humana |
| FASE CONTINUA | Modal de estado | Depende del estado | Aprobado: desaparece · Pendiente: insiste · Rechazado: ver Fase 1 |

El tono debe subir en firmeza a medida que sube la coerción, pero **nunca cruzar a culpar al usuario** — en las 4 fases, el motivo es protegerlo a él o a la plataforma, no castigarlo.

---

## 1. FASE 0 — Banner lateral "Completa tus datos"

**Contexto:** aparece al entrar al Home/Dashboard por primera vez. Ocupa 25% de pantalla, botón X visible, 100% pedagógico (sin bono ni incentivo monetario — eso es exclusivo de la Semana de la Seguridad en Fase 0.5/Activos). El usuario puede ignorarlo y seguir comprando.

| Elemento | Copy |
|---|---|
| Headline | **Verifica tu cuenta cuando quieras** |
| Body | Es parte de tu seguridad: nos ayuda a conocerte y a mantener tu cuenta al día. |
| Botón primario | **Verificar ahora** |
| Botón secundario / cierre | Ícono X con `aria-label="Cerrar, verificar más tarde"` |

**Antes → Después**
- V1: "Completa tus datos" (genérico, no dice para qué ni qué pasa si no lo hace)
- V2: "Hacerlo ahora evita que tengas que detenerte más adelante para retirar tu dinero o pedir tu DropiCard." — mencionaba "DropiCard", un producto que un usuario recién llegado al Home todavía no conoce, porque no ha hecho ninguna venta.
- V3: "Hazlo ahora y ahórrate pasos el día que quieras sacar el dinero de tus ventas." — ya no menciona DropiCard, pero seguía dando por hecho que el usuario *va a* vender y *va a* querer retirar. Un usuario nuevo no sabe todavía si eso le va a pasar.
- V4 (actual): quita cualquier promesa sobre el futuro del usuario. El motivo ya no es "esto te va a servir después", sino algo que es verdad hoy mismo: es parte de su seguridad y le sirve a Dropi para conocerlo. No presupone comportamiento futuro del usuario.

**Justificación de tono:** es un nudge, no un bloqueo — el usuario puede seguir navegando y comprando sin fricción. El tono es invitacional y de bajo riesgo ("cuando quieras" en vez de "ahora mismo"). Nada de urgencia artificial: sería inconsistente con que el propio flujo permita ignorarlo. Al ser el primer contacto del usuario con Dropi, el copy no debe asumir vocabulario de producto ("DropiCard") ni comportamientos futuros que el usuario no puede confirmar todavía ("vas a necesitar esto para retirar") — en su lugar, el motivo se ancla en dos hechos ciertos hoy: seguridad y que Dropi lo conozca.

**Nota importante — este banner no reemplaza el interceptor de Fase 0.5:** si el usuario Nuevo hace clic en "Transferir Wallet", "Registro de Datos Bancarios" o "Solicitud DropiCard" antes de verificarse (es decir, sí intenta una de esas acciones), recibe el mismo modal interceptor recurrente que un usuario Activo — ver sección 2. El banner de Fase 0 es solo un nudge pasivo mientras el usuario no toca esos botones; en el momento en que los toca, el disparador es la acción, no su antigüedad como usuario.

---

## 2. FASE 0.5 — Modal interceptor recurrente (Persona Natural / Empresa)

**Contexto:** se dispara al hacer clic en "Transferir Wallet", "Registro de Datos Bancarios" o "Solicitud DropiCard" — sin importar si quien hace clic es un usuario Activo o uno Nuevo que todavía está en Fase 0. El disparador es la acción, no la antigüedad de la cuenta. Sin botón X ni "Continuar". Reaparece indefinidamente si el usuario intenta evadirlo. Robusto ante AdBlockers.

| Elemento | Copy |
|---|---|
| Headline | **Verifica tu identidad para continuar** |
| Body | Antes de mover fondos necesitamos confirmar quién eres. Elige el tipo de cuenta que tienes en Dropi para seguir con la verificación. |
| Botón A | **Soy persona natural** |
| Botón B | **Soy una empresa** |
| Microcopy de refuerzo (si reaparece tras cerrar con Alt+F4 / navegación forzada) | Mismo mensaje, sin variación — repetir el motivo genera confianza; cambiarlo cada vez genera sospecha de manipulación. |

**Antes → Después**
- Antes: sin headline ni body definidos, solo la bifurcación "Persona Natural / Empresa" sin contexto.
- Después: se agrega el "por qué" (mover fondos requiere confirmar identidad) antes de pedir la decisión — el usuario nunca debe adivinar por qué el modal apareció.

**Justificación de tono:** es inescapable, así que el copy tiene que ganarse la cooperación explicando la causa-efecto de inmediato ("antes de mover fondos"), en vez de solo bloquear. Evita cualquier palabra que suene a castigo ("no puedes", "está prohibido") — en su lugar usa lenguaje de siguiente paso ("elige", "sigue"). Al ser recurrente, la copy debe mantenerse **idéntica en cada reaparición**: variar el mensaje para "suavizar" la insistencia rompe la consistencia terminológica y puede leerse como manipulación (dark pattern), justo lo que Legal necesita evitar documentar.

---

## 3. FASE 1 — Modal de bloqueo pantalla completa

**Contexto:** salta al intentar retiro o envío desde una cuenta con saldo negativo o marcada por fraude. Sin botón de cierre. Permanece hasta que Legal/Financiero resuelvan el caso manualmente. No es un freeze de saldo a nivel de código — es UserPilot interceptando la pantalla.

| Elemento | Copy |
|---|---|
| Headline | **Bloqueamos esta operación por seguridad** |
| Body | Estamos revisando tu cuenta para proteger tus fondos. No podrás hacer retiros ni envíos mientras dure la revisión. |
| Botón único | **Contactar a soporte** |

**Antes → Después**
- Antes: "Por seguridad hemos bloqueado tu operación" — informa el bloqueo pero es un callejón sin salida: no ofrece ninguna acción posible.
- Después: mismo hecho, pero se agrega una vía de contacto. Un modal sin ninguna acción disponible es el error de UX más grave de la lista ("dead end") — agregar "Contactar a soporte" no rompe el bloqueo (Soporte sigue resolviendo con Legal/Financiero por fuera), pero le da al usuario algo que hacer en vez de quedarse mirando una pantalla muerta.

**Justificación de tono:** es el nivel más alto de coerción — persistente, sin fecha de resolución visible, sin salida por diseño. Aun así el copy evita el modo "amenaza" (nada de mayúsculas, nada de "cuenta suspendida permanentemente"): usa "revisando" en vez de "bloqueada indefinidamente", porque para el ~90%+ de los casos (falsos positivos, ver Fase Continua) esto se resuelve. Reservar el lenguaje más severo ("baneo", "cuenta cerrada") para el caso real de fraude confirmado evita generar pánico innecesario en usuarios que serán desbloqueados en días.

---

## 4. FASE CONTINUA — Estados Aprobado / Pendiente / Rechazado

**Contexto:** el estado real vive en un Google Sheet actualizado a mano por Legal; Admin apaga el pop-up manualmente cuando ve "Aprobado". El SLA documentado para que el modal deje de aparecer es de 48–72 horas hábiles tras la aprobación real en Sumsub.

### 4a. Aprobado (el modal desaparece)

| Elemento | Copy |
|---|---|
| Headline (confirmación breve antes de desaparecer) | **¡Cuenta verificada!** |
| Body | Ya puedes transferir tu wallet, registrar tus datos bancarios y pedir tu DropiCard. |
| Duración | Auto-dismiss a los 4-5 segundos, sin requerir clic. |

**Justificación:** el blueprint actual dice que el modal "desaparece" sin más — eso es un final silencioso para algo que el usuario esperó potencialmente días. Un mensaje de éxito breve y específico (qué puede hacer ahora, no solo "aprobado") convierte el fin de una espera ansiosa en una confirmación satisfactoria, sin agregar fricción (desaparece solo).

### 4b. Pendiente (insiste pidiendo reintento)

| Elemento | Copy |
|---|---|
| Headline | **Tu verificación sigue en proceso** |
| Body | Puede tardar hasta 72 horas hábiles. Te avisaremos por correo apenas esté lista — no necesitas hacer nada más. |
| Botón | **Entendido** |

**Antes → Después**
- Antes: "insiste pidiendo reintento" — si el usuario ya completó Sumsub, pedirle "reintentar" sin explicar que la demora es humana (no un error suyo) genera confusión y repetición innecesaria de pasos ya hechos.
- Después: el copy es honesto sobre el cuello de botella (revisión manual) usando el SLA que Soporte ya comunica (48-72h), y aclara que **no se requiere ninguna acción** del usuario — evita que reintente un formulario ya enviado.

**Justificación de tono:** paciente y transparente. El usuario no hizo nada mal; anticipar la pregunta obvia ("¿tengo que hacer algo?") con "no necesitas hacer nada más" reduce contactos a soporte y ansiedad. Dar el rango de horas exacto (ya validado en el blueprint, línea de Soporte SLA) es más honesto que un "pronto" vago.

### 4c. Rechazado (expulsión — ver Fase 1)

| Elemento | Copy |
|---|---|
| Headline | **No pudimos verificar tu identidad** |
| Body | Por seguridad, restringimos las operaciones de esta cuenta. Si crees que es un error, contáctanos y lo revisamos. |
| Botón único | **Contactar a soporte** |

**Justificación de tono:** mismo principio que Fase 1 (nunca dead-end, nunca lenguaje acusatorio), pero distingue "no verificamos" (falla del proceso) de "bloqueamos por fraude" (falla del usuario) — son causas distintas y mezclarlas generaría desconfianza en usuarios legítimos rechazados por error (falso positivo, ya contemplado en Fase Continua punto 3: "Soporte desbanea cuenta si es falso positivo"). Por eso el body ofrece explícitamente la vía de apelación.

---

## Resumen de decisiones transversales

1. **Ningún modal queda sin acción disponible** — incluso los bloqueos "sin salida" a nivel de UI llevan un botón a Soporte. Un dead-end es el error de UX writing más grave de esta lista completa.
2. **La firmeza del tono escala con la coerción**, pero el respeto por el usuario no baja nunca — cero lenguaje de culpa o amenaza en ningún estado.
3. **Los modales recurrentes (Fase 0.5) no varían su texto entre reapariciones** — variarlo generaría apariencia de manipulación, justo lo que Legal necesita evitar.
4. **Toda mención de tiempos de espera usa el SLA real documentado** (48-72h hábiles) en vez de frases vagas tipo "pronto" o "en breve".
5. **Botones con label explícito y verbo de acción** ("Verificar ahora", "Contactar a soporte") en vez de genéricos ("OK", "Aceptar", "Cerrar") para cumplir accesibilidad de lectores de pantalla y claridad de intención.

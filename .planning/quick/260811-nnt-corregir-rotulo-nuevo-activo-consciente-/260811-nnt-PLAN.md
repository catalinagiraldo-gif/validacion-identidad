---
phase: quick-260811-nnt
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/common/models/identity-flow-v2.models.ts
  - src/app/common/services/identity-demo-state-v2.service.ts
  - src/app/layout/layout-new/demo-panel/prototype-demo-panel.component.ts
  - src/app/layout/layout-new/demo-panel/prototype-demo-panel.component.html
  - src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.ts
  - src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.html
  - src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.scss
autonomous: true
requirements: [QUICK-260811-NNT]

must_haves:
  truths:
    - "Con el demo panel en 'Prototipo 2 · Fases 1-5', el control TIPO DE USUARIO dice 'Nuevo' / 'Activo (20+ ordenes)' — nunca 'Etapa 0' ni 'Etapa 0.5'"
    - "Con el demo panel en 'Prototipo 0 · Fase 0', el mismo control sigue diciendo 'Nuevo (Etapa 0.5)' / 'Activo (Etapa 0)' (cero cambio de comportamiento en Fase 0)"
    - "El texto de ayuda bajo el toggle muestra solo la explicacion de la fase activa, no las dos concatenadas"
    - "El switcher 'Casos Fase 1-5' tiene una seccion TIPO DE USUARIO arriba de todo que cambia el mismo estado que el panel superior"
    - "Cada uno de los 5 chips de ESTADO DE IDENTIDAD del switcher Fase 1-5 tiene una bolita '!' que explica que significa ese estado en Truora/Sumsub"
    - "A 1024px el panel flotante del switcher no rompe layout ni provoca scroll horizontal"
  artifacts:
    - path: "src/app/common/models/identity-flow-v2.models.ts"
      provides: "FASE15_TIPO_USUARIO_LABELS exportada"
      contains: "FASE15_TIPO_USUARIO_LABELS"
    - path: "src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.ts"
      provides: "tipoUsuarioOptions / tipoUsuarioActual / tipoUsuarioLabel / setTipoUsuario + nota por estado + import del backstage-dot"
      contains: "IdentityFase0BackstageDotComponent"
    - path: "src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.html"
      provides: "Seccion Tipo de usuario + backstage-dots en los chips de estado"
      contains: "app-fase0-backstage-dot"
  key_links:
    - from: "src/app/layout/layout-new/demo-panel/prototype-demo-panel.component.ts"
      to: "FASE15_TIPO_USUARIO_LABELS"
      via: "fase0TipoUsuarioLabel() ramifica por faseProyecto()"
      pattern: "FASE15_TIPO_USUARIO_LABELS"
    - from: "src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.ts"
      to: "IdentityDemoStateV2Service.setFase0TipoUsuario"
      via: "setter compartido, sin estado nuevo"
      pattern: "setFase0TipoUsuario"
---

<objective>
Corregir el rotulo Nuevo/Activo para que sea consciente de la fase del prototipo, y exponer ese eje dentro del switcher de Fase 1-5 (junto con notas backstage que explican los 5 estados de identidad en terminos de Truora/Sumsub).

Purpose: El usuario miro el prototipo en modo "Fases 1-5" y no reconocio la diferenciacion Nuevo/Activo — si existe, pero esta mal comunicada. El toggle dice literalmente "Etapa 0" / "Etapa 0.5" (vocabulario exclusivo de Fase 0), y el eje no vive dentro del switcher de Fase 1-5, aunque el switcher hermano de Fase 0 ya resolvio exactamente este problema una vez.

Output: Etiquetas por fase, texto de ayuda simplificado, seccion "Tipo de usuario" nueva en el switcher Fase 1-5, y backstage-dots que aterrizan cada estado de identidad en el proceso real.

NO se toca `docs/validacion/Service_Blueprint_Diagrama_Fase_5.md` ni su `.html` — ya se verifico que el diamante `id="nuevo-vs-activo"` esta correcto y siempre visible (no dentro de un accordion colapsado). El problema no esta en el diagrama, esta en que el prototipo usa otro vocabulario para el mismo concepto.
</objective>

<execution_context>
@D:/validacion-identidad/.claude/get-shit-done/workflows/execute-plan.md
@D:/validacion-identidad/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.planning/STATE.md

Fuente de verdad del alcance (plan ya aprobado por el usuario):
@C:/Users/USER/.claude/plans/necesito-que-diagrama-fase-wiggly-fairy.md

Archivos a modificar:
@src/app/common/models/identity-flow-v2.models.ts
@src/app/common/services/identity-demo-state-v2.service.ts
@src/app/layout/layout-new/demo-panel/prototype-demo-panel.component.ts
@src/app/layout/layout-new/demo-panel/prototype-demo-panel.component.html
@src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.ts
@src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.html
@src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.scss

Referencia de patron (NO modificar):
@src/app/common/components/identity-fase0-state-switcher/identity-fase0-state-switcher.component.ts
@src/app/common/components/identity-fase0-state-switcher/identity-fase0-state-switcher.component.html
@src/app/common/components/identity-fase0-backstage-dot/identity-fase0-backstage-dot.component.ts

<interfaces>
<!-- Fuente exacta ya leida durante la planificacion. NO hace falta explorar el codebase. -->
<!-- Los numeros de linea son del estado actual del repo al momento de planear. -->

**`identity-flow-v2.models.ts` lineas 549-563 (estado actual):**

```typescript
// ---------------------------------------------------------------------------
// Nuevos vs Activos — vocabulario textual del blueprint (columnas ETAPA 0 y
// ETAPA 0.5). Es un eje propio de Fase 0, distinto de `MomentoUsuario`
// (Setup/Activación/Hábito/...), que es del eje Fase 1-5 (Plan2.md). Solo
// gatilla el Panel Lateral (Etapa 0, exclusivo de usuarios Activos con
// historial en Dropi) — el Modal Interceptor de Etapa 0.5 trata a Nuevos y
// Activos IGUAL ante un clic financiero ("el disparador es la acción, no la
// antigüedad").
// ---------------------------------------------------------------------------
export type Fase0TipoUsuario = 'nuevo' | 'activo';

export const FASE0_TIPO_USUARIO_LABELS: Record<Fase0TipoUsuario, string> = {
  nuevo: 'Nuevo (Etapa 0.5)',
  activo: 'Activo (Etapa 0)',
};
```

**`identity-demo-state-v2.service.ts` lineas 74-81 (comentario espejo, estado actual):**

```typescript
  /**
   * Fase 0 — "Activos" (ETAPA 0, con historial en Dropi, ven el Panel
   * Lateral en Home) vs "Nuevos" (ETAPA 0.5, sin historial). Eje propio del
   * blueprint, distinto de `momentoUsuario` (eje Fase 1-5): solo gatilla el
   * Panel Lateral en Home — el Modal Interceptor trata a ambos igual ante un
   * clic financiero.
   */
  private readonly _fase0TipoUsuario = signal<Fase0TipoUsuario>(this.loadFase0TipoUsuario());
```

**`prototype-demo-panel.component.ts` lineas 364-370 (estado actual):**

```typescript
  fase0TipoUsuarioLabel(t: Fase0TipoUsuario): string {
    return FASE0_TIPO_USUARIO_LABELS[t];
  }

  setFase0TipoUsuario(t: Fase0TipoUsuario): void {
    this.stateV2.setFase0TipoUsuario(t);
  }
```

`FASE0_TIPO_USUARIO_LABELS` se importa en la linea 34 del mismo bloque de import.
`readonly faseProyecto = this.stateV2.faseProyecto;` ya existe en la linea 109 — reutilizarla, no crear otra.

**`prototype-demo-panel.component.html` lineas 139-154 (estado actual):**

```html
        <!-- Tipo de usuario — gobierna los soft touchpoints en TODAS las fases -->
        <div class="demo-control" data-tour="fase0-tipo-usuario">
          <span class="demo-control__label">TIPO DE USUARIO</span>
          <div class="demo-control__chips">
            @for (t of fase0TipoUsuarioOptions; track t) {
              <button class="chip chip--sm" [class.chip--active]="fase0TipoUsuario() === t" (click)="setFase0TipoUsuario(t)">
                {{ fase0TipoUsuarioLabel(t) }}
              </button>
            }
          </div>
          <span class="demo-panel__mecanismo">
            {{ fase0TipoUsuario() === 'activo'
              ? 'Activo: en Fase 0 ve el Panel Lateral "Verifica tu cuenta" al entrar al Home (Etapa 0); en Fase 1-5 ve el panel de ganancias en la esquina inferior derecha del Home.'
              : 'Nuevo: en Home no ve ningún aviso de identidad, en ninguna fase — solo un clic financiero dispara el Modal Interceptor (Etapa 0.5), igual que a un Activo.' }}
          </span>
        </div>
```

**`identity-fase0-state-switcher.component.ts` lineas 83-96 — EL PATRON A COPIAR:**

```typescript
  // Corrección (feedback 23-jul): el toggle Nuevo/Activo vivía solo en el
  // panel superior MODO PROTOTIPO — quedaba oculto detrás de overlays
  // full-screen (interceptor, Sumsub, bloqueo). Se expone también aquí,
  // en el escape hatch que siempre flota por encima de todo.
  readonly tipoUsuarioOptions: Fase0TipoUsuario[] = ['nuevo', 'activo'];
  readonly tipoUsuarioActual = this.stateV2.fase0TipoUsuario;

  tipoUsuarioLabel(t: Fase0TipoUsuario): string {
    return FASE0_TIPO_USUARIO_LABELS[t];
  }

  setTipoUsuario(t: Fase0TipoUsuario): void {
    this.stateV2.setFase0TipoUsuario(t);
  }
```

**`identity-fase0-state-switcher.component.html` lineas 15-29 — EL MARKUP A COPIAR:**

```html
        <div class="fase0-switcher__section">
          <span class="fase0-switcher__label">Tipo de usuario en Home (Etapa 0 vs 0.5)</span>
          <div class="fase0-switcher__states">
            @for (t of tipoUsuarioOptions; track t) {
              <button
                type="button"
                class="fase0-switcher__state"
                [class.fase0-switcher__state--active]="tipoUsuarioActual() === t"
                (click)="setTipoUsuario(t)"
              >
                {{ tipoUsuarioLabel(t) }}
              </button>
            }
          </div>
        </div>
```

**API exacta de `IdentityFase0BackstageDotComponent` (`app-fase0-backstage-dot`):**

```typescript
export class IdentityFase0BackstageDotComponent {
  /** Nota interna de negocio (Back stage) a mostrar en el tooltip — no es copy de usuario. */
  @Input({ required: true }) texto = '';
  /** aria-label del botón, describe qué etapa/intervención explica esta bolita. */
  @Input() label = 'Qué pasa por dentro (backstage)';
  /** Variante visual — 'light' para overlays claros, 'dark' para el bloqueo full-screen oscuro. */
  @Input() variante: 'light' | 'dark' = 'light';
}
```

`texto` es `@Input({ required: true })` — SIEMPRE debe pasarse. El componente es standalone (`imports: [CommonModule]`), asi que se agrega al array `imports` del switcher.
Ruta de import: `'../identity-fase0-backstage-dot/identity-fase0-backstage-dot.component'`.
El componente es generico pese al nombre `fase0` — no tiene ninguna logica atada a Fase 0. Confirmado reutilizable.
En el panel del switcher (fondo blanco) corresponde `variante="light"`, que ya es el default: no pasar el input.

**Ejemplo de uso real ya existente (`prototype-demo-panel.component.html` lineas 190-199) — boton + dot como par flex:**

```html
            <div class="fase0-stepper">
              @for (e of fase0Etapas; track e) {
                <div class="fase0-stepper__step" [class.fase0-stepper__step--active]="fase0EtapaActual() === e">
                  <button type="button" class="fase0-stepper__btn" (click)="reproducirEtapa(e)">
                    {{ fase0EtapaLabel(e) }}
                  </button>
                  <app-fase0-backstage-dot [texto]="fase0EtapaNota(e)" label="Qué pasa por dentro en esta etapa" />
                </div>
              }
            </div>
```

Su SCSS acompanante (`prototype-demo-panel.component.scss` lineas 160-164):

```scss
.fase0-stepper__step {
  display: flex;
  align-items: center;
  gap: $space-1;
}
```

**`identity-fase15-state-switcher.component.ts` — estado actual relevante:**

Imports actuales (lineas 1-7): `Component, inject, signal, computed` de `@angular/core`; `CommonModule`; `Router`; `IdentityDemoStateV2Service`; `IdentityDemoStateService, ResultadoModal`; `IdentityModalService, StartScreen`; `IdentitySatelliteStatus`.
NO importa nada de `identity-flow-v2.models` todavia — hay que agregar el import.
`private readonly stateV2 = inject(IdentityDemoStateV2Service);` ya existe (linea 45).
`imports: [CommonModule]` (linea 40).

```typescript
interface EstadoOption {
  status: IdentitySatelliteStatus;
  label: string;
  danger?: boolean;
}
```

```typescript
  readonly estados: EstadoOption[] = [
    { status: 'sin_validar', label: 'Sin validar' },
    { status: 'pendiente', label: 'Pendiente' },
    { status: 'en_revision', label: 'En revisión' },
    { status: 'rechazado', label: 'Rechazado', danger: true },
    { status: 'aprobado', label: 'Aprobado' },
  ];
```

**`identity-fase15-state-switcher.component.html` lineas 14-45 — estado actual:**

```html
      <div class="fase15-switcher__panel">
        <div class="fase15-switcher__section">
          <span class="fase15-switcher__label">Ir a la página</span>
          <div class="fase15-switcher__states">
            @for (p of paginas; track p.ruta) {
              <button
                type="button"
                class="fase15-switcher__state"
                (click)="irAPagina(p.ruta)"
              >
                {{ p.label }}
              </button>
            }
          </div>
        </div>

        <div class="fase15-switcher__section">
          <span class="fase15-switcher__label">Estado de identidad</span>
          <div class="fase15-switcher__states">
            @for (e of estados; track e.status) {
              <button
                type="button"
                class="fase15-switcher__state"
                [class.fase15-switcher__state--danger]="e.danger"
                [class.fase15-switcher__state--active]="statusActual() === e.status"
                (click)="setEstado(e.status)"
              >
                {{ e.label }}
              </button>
            }
          </div>
        </div>
```

**Clases SCSS ya disponibles en `identity-fase15-state-switcher.component.scss`:**
`.fase15-switcher__section` (flex column, gap `$space-2`), `.fase15-switcher__label` (uppercase, `$font-xs`, `$gray-500`), `.fase15-switcher__states` (flex, `flex-wrap: wrap`, gap `$space-2`), `.fase15-switcher__state` (chip pill con `--active` y `--danger`).
El `.fase15-switcher__panel` es `width: 340px; max-width: calc(100vw - #{$space-6}); overflow-y: auto` y ya tiene breakpoints en `$bp-md` y `$bp-sm`. La seccion nueva hereda ese comportamiento — no hace falta breakpoint nuevo, pero SI hace falta una clase wrapper para el par chip+dot (ver Task 2f).
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Etiquetas Nuevo/Activo conscientes de la fase (modelo + servicio + demo panel)</name>
  <files>src/app/common/models/identity-flow-v2.models.ts, src/app/common/services/identity-demo-state-v2.service.ts, src/app/layout/layout-new/demo-panel/prototype-demo-panel.component.ts, src/app/layout/layout-new/demo-panel/prototype-demo-panel.component.html</files>
  <action>
Cuatro ediciones. El texto exacto actual de cada bloque esta en `<interfaces>` arriba — usalo para localizar, no explores el codebase.

**1a. `identity-flow-v2.models.ts`** — justo debajo de `FASE0_TIPO_USUARIO_LABELS` (lineas ~560-563), agregar una constante hermana con el vocabulario del propio diagrama de Fase 5:

`export const FASE15_TIPO_USUARIO_LABELS: Record<Fase0TipoUsuario, string>` con `nuevo: 'Nuevo'` y `activo: 'Activo (20+ órdenes)'`.

El umbral "20+ ordenes" viene de `docs/validacion/Service_Blueprint_Diagrama_Fase_5.md` (regla Nuevo vs Activo) y del diamante `id="nuevo-vs-activo"` del `.html`. Copiar ese texto literal — no reformular, no cambiar el numero. Respetar la tilde en "órdenes".

Agregar sobre la constante nueva un comentario corto de una o dos lineas explicando que Fase 1-5 define "activo" por volumen de ordenes (regla del blueprint de Fase 5), no por posicion en el journey como Fase 0.

**1b. `identity-flow-v2.models.ts`** — reescribir el comentario de bloque de las lineas ~549-557. Hoy afirma "Es un eje propio de Fase 0", y eso dejo de ser cierto desde la sesion `260811-bf9`, cuando el mismo eje paso a gobernar el panel de ganancias de Home en Fase 1-5. El comentario nuevo debe decir: el eje aplica a TODAS las fases, con dos definiciones distintas de "activo" segun la fase — en Fase 0 es posicion en el journey (ETAPA 0 = con historial, ve el Panel Lateral; ETAPA 0.5 = sin historial), y en Fase 1-5 es volumen (20+ ordenes, regla del blueprint de Fase 5); por eso hay dos Records de etiquetas y no uno. Conservar la nota de que sigue siendo distinto de `MomentoUsuario` y la nota de que el Modal Interceptor trata a Nuevos y Activos igual ante un clic financiero ("el disparador es la accion, no la antiguedad"). La frase literal "eje propio de Fase 0" debe desaparecer del archivo.

**1c. `identity-demo-state-v2.service.ts`** — mismo ajuste en el comentario espejo del signal `_fase0TipoUsuario` (lineas ~74-80). Hoy dice "Eje propio del blueprint... solo gatilla el Panel Lateral en Home". Actualizar: el eje aplica en todas las fases; en Fase 0 gatilla el Panel Lateral (Etapa 0) y en Fase 1-5 gatilla el panel de ganancias flotante de Home; "activo" significa cosas distintas en cada fase (ver `FASE0_TIPO_USUARIO_LABELS` / `FASE15_TIPO_USUARIO_LABELS`). Solo comentario — NO renombrar el signal ni el setter `setFase0TipoUsuario` (lo consumen el demo panel, el switcher de Fase 0, `IdentityFase0PanelComponent` y el panel de Home; renombrar rompe todo eso sin ganancia).

**1d. `prototype-demo-panel.component.ts`** — agregar `FASE15_TIPO_USUARIO_LABELS` al bloque de import existente (junto a `FASE0_TIPO_USUARIO_LABELS`, linea ~34) y hacer que `fase0TipoUsuarioLabel(t)` (lineas ~364-366) ramifique por fase: cuando `this.faseProyecto() === 'fase0'` devuelve `FASE0_TIPO_USUARIO_LABELS[t]`, en cualquier otro caso devuelve `FASE15_TIPO_USUARIO_LABELS[t]`. Reutilizar la senal `readonly faseProyecto` que ya existe en la linea ~109 — no inyectar ni declarar nada nuevo. NO tocar `setFase0TipoUsuario`.

**1e. `prototype-demo-panel.component.html`** — simplificar el `<span class="demo-panel__mecanismo">` de las lineas ~149-153. Hoy un unico ternario concatena la explicacion de Fase 0 y la de Fase 1-5 en la misma frase, y eso es justo lo que confunde. Reemplazar por bloques `@if` sobre `faseProyecto() === 'fase0'` de modo que se muestre UNA sola frase, la de la fase activa:

- Fase 0 + activo: ve el Panel Lateral "Verifica tu cuenta" al entrar al Home (Etapa 0).
- Fase 0 + nuevo: en Home no ve ningun aviso de identidad — solo un clic financiero dispara el Modal Interceptor (Etapa 0.5), igual que a un Activo.
- Fase 1-5 + activo: usuario con 20+ ordenes; ve el panel de ganancias en la esquina inferior derecha del Home.
- Fase 1-5 + nuevo: en Home no ve ningun aviso de identidad — solo un clic financiero (retiro, wallet, DropiCard, facturacion, cuenta) dispara el gate de verificacion.

Redactar en el mismo registro de las frases actuales (tono descriptivo de mecanismo), con tildes correctas. Mantener la clase `demo-panel__mecanismo` y el atributo `data-tour="fase0-tipo-usuario"` del contenedor intactos.

Fuera de alcance en esta task: los archivos del switcher de Fase 1-5 (Task 2) y cualquier archivo bajo `docs/validacion/`.
  </action>
  <verify>
    <automated>cd D:/validacion-identidad && grep -q "FASE15_TIPO_USUARIO_LABELS" src/app/common/models/identity-flow-v2.models.ts && grep -q "20+ órdenes" src/app/common/models/identity-flow-v2.models.ts && grep -q "FASE15_TIPO_USUARIO_LABELS" src/app/layout/layout-new/demo-panel/prototype-demo-panel.component.ts && ! grep -q "eje propio de Fase 0" src/app/common/models/identity-flow-v2.models.ts && ! grep -q "Eje propio del" src/app/common/services/identity-demo-state-v2.service.ts && yarn build 2>&1 | tail -20</automated>
  </verify>
  <done>
`FASE15_TIPO_USUARIO_LABELS` existe y se exporta con `{ nuevo: 'Nuevo', activo: 'Activo (20+ órdenes)' }`. Los dos comentarios (modelo + servicio) ya no afirman que el eje es exclusivo de Fase 0. `fase0TipoUsuarioLabel()` ramifica por `faseProyecto()`. El texto de ayuda del demo panel muestra una sola frase, la de la fase activa. `yarn build` compila sin errores nuevos.
  </done>
</task>

<task type="auto">
  <name>Task 2: Seccion Tipo de usuario + backstage-dots en el switcher de Fase 1-5</name>
  <files>src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.ts, src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.html, src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component.scss</files>
  <action>
Depende de `FASE15_TIPO_USUARIO_LABELS` (Task 1). El codigo fuente exacto tanto del patron a copiar (switcher de Fase 0) como del destino (switcher de Fase 1-5) esta completo en `<interfaces>` arriba — no hace falta abrir el switcher de Fase 0 ni el backstage-dot para derivar su API.

**2a. `.component.ts` — imports.** Agregar al bloque de imports existente (lineas 1-7):
- `Fase0TipoUsuario, FASE15_TIPO_USUARIO_LABELS` desde `'../../models/identity-flow-v2.models'` (el archivo no importa nada de ahi todavia).
- `IdentityFase0BackstageDotComponent` desde `'../identity-fase0-backstage-dot/identity-fase0-backstage-dot.component'`.

Agregar `IdentityFase0BackstageDotComponent` al array `imports` del decorador `@Component` (hoy `imports: [CommonModule]`, linea ~40) — es standalone.

**2b. `.component.ts` — bloque Tipo de usuario.** Copiar el bloque de las lineas 83-96 del switcher de Fase 0 (transcrito completo en `<interfaces>`), adaptando dos cosas:
- `tipoUsuarioLabel(t)` devuelve `FASE15_TIPO_USUARIO_LABELS[t]` (NO el de Fase 0).
- El comentario de justificacion se adapta: aqui el control no queda oculto detras de overlays full-screen (ese era el problema de Fase 0), sino que el panel superior MODO PROTOTIPO no es obvio como "el lugar donde controlo Nuevo/Activo para Fase 1-5" — se expone tambien aqui para que el switcher sea un solo lugar donde ver y cambiar todos los ejes de Fase 1-5. Mencionar que reutiliza la senal existente `stateV2.fase0TipoUsuario` / `setFase0TipoUsuario`, sin estado nuevo, asi los dos controles siempre estan sincronizados.

Miembros a agregar: `readonly tipoUsuarioOptions: Fase0TipoUsuario[] = ['nuevo', 'activo'];`, `readonly tipoUsuarioActual = this.stateV2.fase0TipoUsuario;`, `tipoUsuarioLabel(t)`, `setTipoUsuario(t)`. Colocarlos cerca de las otras listas de opciones (despues de `modales`, antes de `statusActual`) para que se lea agrupado.

Nota: `stateV2` esta declarado `private readonly` (linea 45). Como `tipoUsuarioActual` y `setTipoUsuario` son miembros publicos que envuelven el acceso, el template nunca toca `stateV2` directamente — igual que en el switcher de Fase 0. No cambiar la visibilidad de `stateV2`.

**2c. `.component.ts` — notas backstage de los 5 estados.** Extender la interfaz `EstadoOption` con un campo `nota: string` (requerido, sin `?`) y llenarlo en las 5 entradas del array `estados`. Textos literales, copiar tal cual:

| status | nota |
|---|---|
| `sin_validar` | El usuario nunca abrió el formulario de Truora (Colombia) o Sumsub (resto de países) |
| `pendiente` | Empezó el formulario pero no lo terminó — mismo dato que Truora "2.3 Proceso abandonado" / Sumsub incompleto |
| `en_revision` | Ya envió todo; Truora/Sumsub está evaluando. Camino automático (>92%) resuelve en segundos, cola de excepciones (≤8%) hasta 24h |
| `rechazado` | Truora o Sumsub no pudo confirmar los datos — el usuario conserva lo que ya tenía aprobado antes |
| `aprobado` | Truora/Sumsub confirmó — mismo resultado final para Colombia (Truora) y el resto de países (Sumsub), aunque el proveedor nunca se nombra al usuario |

Estos textos son notas backstage (para PM/diseno/stakeholders viendo el prototipo), NO copy de usuario — por eso si nombran a Truora y Sumsub, a diferencia del copy de cara al usuario, que nunca los nombra. Respetar tildes, las comillas dobles internas de la nota de `pendiente`, y los simbolos `>` y `≤`. Van dentro de strings TypeScript: usar comillas simples externas (`>` no necesita escape ahi); si algun texto rompe el string, escapar en vez de reescribir el texto.

**2d. `.component.html` — seccion Tipo de usuario.** Insertar una `<div class="fase15-switcher__section">` nueva como PRIMER hijo de `.fase15-switcher__panel`, arriba de "Ir a la página" (o sea, entre la linea 14 y la linea 15 actuales). Mismo markup que el bloque de Fase 0 transcrito en `<interfaces>`, con las clases `fase15-*` en lugar de `fase0-*`. Label de la seccion: `Tipo de usuario`. Nada de "(Etapa 0 vs 0.5)" — ese sufijo es lo que estamos corrigiendo.

Agregar un `<app-fase0-backstage-dot>` al lado del label de la seccion, envuelto junto al label en una fila flex `<div class="fase15-switcher__label-row">` (ver 2f) para que quede a la derecha del texto y no debajo. Su `texto`: en Fase 1-5 "activo" significa 20+ ordenes segun la regla del blueprint de Fase 5, y ese eje decide si el usuario ve el panel de ganancias flotante en Home. `label="Qué significa Nuevo vs Activo en Fase 1-5"`.

**2e. `.component.html` — backstage-dots en los 5 chips de estado.** En la seccion "Estado de identidad" (lineas ~30-45), el `@for` hoy emite un `<button>` suelto por estado. Envolver el cuerpo de la iteracion en `<div class="fase15-switcher__state-row">` que contiene el boton (sin cambios en sus clases, bindings ni `(click)`) mas `<app-fase0-backstage-dot [texto]="e.nota" label="Qué significa este estado en Truora/Sumsub" />`. Mismo patron que `.fase0-stepper__step` del demo panel (transcrito en `<interfaces>`). `texto` es `@Input({ required: true })` — siempre viene de `e.nota` del 2c, nunca vacio.

NO agregar dots a las secciones "Ir a la página" ni "Abrir modal de verificación" — solo a los 5 chips de Estado de identidad y al label de Tipo de usuario. El resultado esperado en el template son exactamente 2 ocurrencias literales de `<app-fase0-backstage-dot` (una dentro del `@for` de estados, que renderiza 5 en runtime; otra en el label de Tipo de usuario).

**2f. `.component.scss`.** Agregar dos clases nuevas al final del archivo, antes del bloque `// Responsive`:
- `.fase15-switcher__state-row` — `display: flex; align-items: center; gap: $space-1;` (par chip + dot, igual que `.fase0-stepper__step`).
- `.fase15-switcher__label-row` — `display: flex; align-items: center; gap: $space-1;` (par label + dot de la seccion Tipo de usuario).

Usar tokens (`$space-1`, `$space-2`) del DS — nunca valores en px hardcodeados. `.fase15-switcher__states` ya tiene `flex-wrap: wrap`, asi que las filas envuelven solas cuando no caben en los 340px del panel; verificar que asi sea a 1024px y que no aparezca scroll horizontal. Si a `$bp-sm` el par chip+dot desborda, agregar el ajuste dentro del `@media (max-width: $bp-sm)` que ya existe al final del archivo — no crear un breakpoint nuevo.

Fuera de alcance: cualquier otro archivo (los de Task 1 ya estan hechos), `docs/validacion/**`, y el switcher de Fase 0 (es solo referencia — NO modificarlo).
  </action>
  <verify>
    <automated>cd D:/validacion-identidad && SW=src/app/common/components/identity-fase15-state-switcher/identity-fase15-state-switcher.component && grep -q "IdentityFase0BackstageDotComponent" $SW.ts && grep -q "FASE15_TIPO_USUARIO_LABELS" $SW.ts && grep -q "setFase0TipoUsuario" $SW.ts && grep -q "nunca abrió el formulario de Truora" $SW.ts && grep -q "2.3 Proceso abandonado" $SW.ts && grep -q "cola de excepciones" $SW.ts && grep -q "conserva lo que ya tenía aprobado" $SW.ts && grep -q "nunca se nombra al usuario" $SW.ts && [ "$(grep -c '<app-fase0-backstage-dot' $SW.html)" = "2" ] && grep -q 'fase15-switcher__state-row' $SW.scss && grep -q 'fase15-switcher__label-row' $SW.scss && yarn build 2>&1 | tail -20</automated>
    <human-check>
`yarn start`. Con el demo panel en "Prototipo 2 · Fases 1-5":
1. El control TIPO DE USUARIO del panel superior dice "Nuevo" / "Activo (20+ órdenes)" — ya no "Etapa 0"/"Etapa 0.5" — y el texto de ayuda debajo muestra UNA sola frase.
2. Cambiar a "Prototipo 0 · Fase 0": el mismo control vuelve a decir "Nuevo (Etapa 0.5)" / "Activo (Etapa 0)", sin ningun otro cambio de comportamiento.
3. De vuelta en Fases 1-5, abrir el switcher "Casos Fase 1-5": la seccion "Tipo de usuario" aparece arriba de todo y cambia el mismo estado que el panel superior (cambiar en uno se refleja en el otro).
4. Los 5 chips de "Estado de identidad" muestran su bolita "!"; al hacer clic sale la nota correspondiente de Truora/Sumsub.
5. A 1024px de ancho de viewport, el panel flotante del switcher no desborda ni provoca scroll horizontal.
    </human-check>
  </verify>
  <done>
El switcher de Fase 1-5 tiene la seccion "Tipo de usuario" como primera seccion del panel, funcional y sincronizada con el panel superior via `setFase0TipoUsuario` (sin estado nuevo). Los 5 chips de Estado de identidad tienen backstage-dot con su nota. `yarn build` compila sin errores nuevos. Sin regresion visual a 1024px.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| *(ninguna nueva)* | Cambio 100% de presentacion en un prototipo client-side: constantes de etiquetas, comentarios, markup y SCSS. No entra input no confiable, no hay red, no hay persistencia nueva, no hay dependencias nuevas. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-NNT-01 | Information disclosure | `app-fase0-backstage-dot` en el switcher Fase 1-5 | accept | Las notas nombran a Truora/Sumsub, pero el backstage-dot es por diseno una nota interna para quien mira el prototipo (PM/diseno/stakeholders), no copy de usuario final — mismo tratamiento que los dots ya existentes en Fase 0. La regla "el copy de usuario nunca nombra el validador" se mantiene: ningun texto de cara al usuario cambia en esta task. |
| T-NNT-SC | Tampering | npm/yarn installs | n/a | No se instala ningun paquete. `IdentityFase0BackstageDotComponent` ya existe en el repo; no se crea ni se descarga nada. |
</threat_model>

<verification>
- `yarn build` sin errores nuevos (gate automatizado en ambas tasks).
- Ningun archivo bajo `docs/validacion/` modificado — confirmar con `git status` que solo aparecen los 7 archivos de `files_modified`.
- El switcher de Fase 0 (`identity-fase0-state-switcher.component.*`) NO aparece en el diff: es referencia, no destino.
- El signal `_fase0TipoUsuario` y el setter `setFase0TipoUsuario` conservan su nombre (los consumen el demo panel, el switcher de Fase 0, `IdentityFase0PanelComponent` y el panel de Home).
</verification>

<success_criteria>
- En modo "Fases 1-5" el toggle Nuevo/Activo usa el vocabulario del diagrama de Fase 5 ("Activo (20+ órdenes)"), nunca el de Fase 0.
- En modo "Fase 0" el toggle no cambia: "Nuevo (Etapa 0.5)" / "Activo (Etapa 0)".
- El texto de ayuda del demo panel muestra solo la explicacion de la fase activa.
- El switcher "Casos Fase 1-5" expone Tipo de usuario como primera seccion, sincronizado con el panel superior.
- Los 5 chips de Estado de identidad explican su equivalente real en Truora/Sumsub via backstage-dot.
- Sin regresion de layout a 1024px.
</success_criteria>

<output>
Create `.planning/quick/260811-nnt-corregir-rotulo-nuevo-activo-consciente-/260811-nnt-SUMMARY.md` when done
</output>

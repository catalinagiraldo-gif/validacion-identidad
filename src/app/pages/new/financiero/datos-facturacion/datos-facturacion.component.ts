import { Component, inject, effect, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdentityDemoStateService } from '../../../../common/services/identity-demo-state.service';
import { IdentityModalService } from '../../../../common/services/identity-modal.service';
import { IdentityFase0Service } from '../../../../common/services/identity-fase0.service';
import { IdentityDemoStateV2Service } from '../../../../common/services/identity-demo-state-v2.service';
import { IdentityGateComponent } from '../../../../common/components/identity-gate/identity-gate.component';
import { PAIS_BILLING_FIELDS, NOMBRE_TIPO_PERSONA, PAISES_9, Pais9, TipoPersonaV2, ESTADO_FORMULARIO_CONFIG, PaisBillingConfig } from '../../../../common/models/identity-flow-v2.models';

const BILLING_CONFIG_FALLBACK: PaisBillingConfig = {
  documentoPrincipal: 'Documento de identidad',
  regimenFiscalOpciones: [],
  documentosASubir: [],
  gapEnFuente: 'Esta combinación de país y tipo de persona todavía no está definida — pendiente de Legal/PO.',
};

const FLAG_CO = 'https://www.figma.com/api/mcp/asset/0aabaf73-3af0-43f5-94f6-6db627b8f389';
const ICON_TOOLTIP = 'https://www.figma.com/api/mcp/asset/1ce765f3-b9db-4f9a-83b1-be1c7989342b';
const ICON_CHEVRON = 'https://www.figma.com/api/mcp/asset/438517bd-cdef-4d02-8e77-91725eda6ace';

// Formulario fiscal por país (Plan2.md Parte 4, Hallazgo 3 líneas 89-97):
// reglas de comportamiento C-01/C-02/C-05/C-06-09, iguales para los 9 países,
// aplicadas sobre los datos por país transcritos en PAIS_BILLING_FIELDS
// (identity-flow-v2.models.ts, Parte 1). Los nombres de localidad y las
// listas de ciudades son referencia de prototipo -- la fuente de verdad para
// el detalle exacto por país sigue siendo el Excel.

const NOMBRE_PAIS: Record<Pais9, string> = {
  CO: 'Colombia', MX: 'México', AR: 'Argentina', PE: 'Perú',
  GT: 'Guatemala', CR: 'Costa Rica', EC: 'Ecuador', CL: 'Chile', PY: 'Paraguay',
};

/** C-01: etiqueta de localidad varía por país (municipio/provincia/cantón/comuna). */
const LOCALIDAD_LABEL: Record<Pais9, string> = {
  CO: 'Municipio', MX: 'Municipio', AR: 'Provincia', PE: 'Provincia',
  GT: 'Municipio', CR: 'Cantón', EC: 'Cantón', CL: 'Comuna', PY: 'Departamento',
};

const PHONE_CODE: Record<Pais9, string> = {
  CO: '57', MX: '52', AR: '54', PE: '51', GT: '502', CR: '506', EC: '593', CL: '56', PY: '595',
};

const LOCALIDADES_MOCK: Record<Pais9, string[]> = {
  CO: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'],
  MX: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
  AR: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata'],
  PE: ['Lima', 'Arequipa', 'Trujillo', 'Cusco', 'Piura'],
  GT: ['Ciudad de Guatemala', 'Quetzaltenango', 'Escuintla'],
  CR: ['San José', 'Alajuela', 'Heredia', 'Cartago'],
  EC: ['Quito', 'Guayaquil', 'Cuenca', 'Manta'],
  CL: ['Santiago', 'Valparaíso', 'Concepción', 'Antofagasta'],
  PY: ['Asunción', 'Ciudad del Este', 'Encarnación'],
};

function limpiarNumeroDocumento(v: string): string {
  return v.replace(/[-.\s]/g, '');
}

/**
 * Plan2.md Parte 8 — estado 'parcial': datos que un usuario antiguo ya había
 * guardado en el formulario manual viejo (pre-Sumsub). Nunca fueron
 * certificados por ningún motor real, por eso siguen bloqueados hasta que se
 * verifique con Sumsub/Truora — pero sí se muestran, en vez del vacío que ve
 * un usuario que nunca tocó nada (sin_validar).
 */
const DATOS_FORMULARIO_ANTIGUO_MOCK = {
  municipio: 'Bogotá',
  direccion: 'Calle 45 # 12-34',
  email: 'contacto@negocioviejo.com',
  telefono: '3009876543',
  razonSocial: 'Laura Martínez López',
  tipoDocumento: 'CC',
  numDocumento: '1023456789',
  regimenFiscal: 'Régimen Ordinario',
};

@Component({
  selector: 'app-datos-facturacion-new',
  standalone: true,
  imports: [CommonModule, FormsModule, IdentityGateComponent],
  styleUrls: ['./datos-facturacion.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="bc-home"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item">Financiero</span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item">Wallet</span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item bc-active">Datos de facturación</span>
      </nav>

      <!-- Page title -->
      <div class="page-header">
        <h1 class="page-title">Datos de facturación</h1>
        @if (isAprobado()) {
          <span class="tag-completo"><i class="pi pi-check-circle"></i> Completado por {{ motorLabel() }}</span>
        } @else if (statusV2() === 'en_revision') {
          <span class="tag-revision"><i class="pi pi-clock"></i> En revisión</span>
        } @else if (statusV2() === 'rechazado') {
          <span class="tag-rechazado"><i class="pi pi-times-circle"></i> Rechazado</span>
        } @else if (statusV2() === 'pj_pendiente') {
          <span class="tag-pj-pendiente"><i class="pi pi-clock"></i> Empresa pendiente</span>
        } @else if (esParcial()) {
          <span class="tag-parcial"><i class="pi pi-info-circle"></i> Datos sin certificar</span>
        } @else if (statusV2() === 'pendiente') {
          <span class="tag-pendiente"><i class="pi pi-hourglass"></i> Verificación en curso</span>
        } @else {
          <span class="tag-sin-iniciar">Sin iniciar</span>
        }
        <button class="link-tutorial" type="button">Ver tutorial</button>
      </div>

      <!-- Estado vacío: nunca ha hecho nada (sin_validar, sin datos previos) — Plan2.md Parte 8 -->
      @if (esVacio()) {
        <div class="empty-state">
          <i class="pi pi-shield empty-state__icon"></i>
          <p class="empty-state__text">Aún no tienes datos de facturación configurados.</p>
          <p class="empty-state__subtext">Verifica tu identidad y {{ motorLabel() }} completará estos datos por ti.</p>
          <button class="btn-identity-cta" type="button" (click)="abrirModal()">
            <i class="pi pi-shield"></i> Verificar identidad
          </button>
        </div>
      } @else {

      <!-- Banner según estado -->
      @if (isAprobado()) {
        <div class="alert-sumsub">
          <i class="pi pi-check-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">{{ motorLabel() }} completó tu información de entidad automáticamente. </span>
              <span>Los campos de entidad están bloqueados. Completa los datos fiscales y guarda.</span>
            </p>
          </div>
        </div>
      } @else if (esFase0()) {
        <!-- Mismo banner/gate que Wallet, DropiCard, cuenta — CTA directo a Sumsub. -->
        <app-identity-gate contexto="facturacion" />
      } @else {
        <div class="alert-warning">
          <i class="pi pi-info-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">{{ estadoFormularioConfig().banner }}. </span>
              <span>Los datos de entidad quedarán completados automáticamente por {{ motorLabel() }}.</span>
            </p>
            @if (estadoFormularioConfig().ctaLabel) {
              <button class="btn-identity-cta" type="button" (click)="abrirModal()">
                <i class="pi pi-shield"></i> {{ estadoFormularioConfig().ctaLabel }}
              </button>
            }
          </div>
        </div>
      }

      <!-- Form content -->
      <div class="form-content">

        <!-- Sección 1: Información de Contacto -->
        <section class="form-section">
          <h2 class="section-title">Información de Contacto</h2>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">País</label>
              <div class="select-wrap">
                <select class="field-select" [class.field-locked]="!isAprobado()" [ngModel]="pais()" (ngModelChange)="onPaisChange($event)" [disabled]="!isAprobado()">
                  @for (p of paises; track p) {
                    <option [value]="p">{{ nombrePais(p) }}</option>
                  }
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">{{ localidadLabel() }}</label>
              <div class="select-wrap">
                <select class="field-select" [class.field-locked]="!isAprobado()" [(ngModel)]="municipio" [disabled]="!isAprobado()">
                  <option value="">Seleccionar {{ localidadLabel().toLowerCase() }}</option>
                  @for (loc of localidadesDisponibles(); track loc) {
                    <option [value]="loc">{{ loc }}</option>
                  }
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Dirección</label>
              <input type="text" class="field-input" [class.field-locked]="!isAprobado()" placeholder="Escribe la dirección" [(ngModel)]="direccion" [readonly]="!isAprobado()" />
            </div>
            <div class="field-group">
              <label class="field-label">Email para facturacion</label>
              <input type="email" class="field-input" [class.field-locked]="!isAprobado()" placeholder="ejemplo@empresa.com" [(ngModel)]="email" [readonly]="!isAprobado()" />
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Número de télefono</label>
              <div class="phone-row">
                <div class="phone-prefix">
                  <img class="flag" [src]="flagCo" alt="" />
                  <span class="phone-code-text">{{ phoneCode() }}</span>
                </div>
                <input type="tel" class="field-input phone-number" [class.field-locked]="!isAprobado()" placeholder="310 123 4567" [(ngModel)]="telefono" [readonly]="!isAprobado()" />
              </div>
            </div>
            <div class="field-group"></div>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- Sección 2: Entidad de facturación (locked hasta aprobado) -->
        <section class="form-section" [class.form-section--locked]="!isAprobado()" data-tour="facturacion-sensibles">
          <div class="section-header-row">
            <h2 class="section-title">Entidad de facturación</h2>
            @if (isAprobado()) {
              <span class="section-lock-badge">🔒 Completado por {{ motorLabel() }} · No editable</span>
            }
          </div>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Nombre o razón social</label>
              <input type="text" class="field-input" [class.field-locked]="!isAprobado()" placeholder="Nombre de tu empresa" [(ngModel)]="razonSocial" [readonly]="!isAprobado()" />
            </div>
            <div class="field-group">
              <label class="field-label">Tipo de persona</label>
              <div class="select-wrap">
                <select class="field-select" [class.field-locked]="!isAprobado()" [ngModel]="tipoPersona()" (ngModelChange)="onTipoPersonaChange($event)" [disabled]="!isAprobado()">
                  <option value="">Seleccionar tipo de persona</option>
                  <option value="natural">{{ nombreTipoPersona().natural }}</option>
                  <option value="juridica">{{ nombreTipoPersona().juridica }}</option>
                  @if (nombreTipoPersona().extranjera) {
                    <option value="extranjera">{{ nombreTipoPersona().extranjera }}</option>
                  }
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
              @if (!nombreTipoPersona().extranjera) {
                <p class="field-gap-note">{{ billingConfig().gapEnFuente }}</p>
              }
            </div>
          </div>

          <!-- C-02: tipo/número de documento deshabilitados hasta elegir tipo de persona -->
          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Tipo de documento</label>
              <div class="select-wrap">
                <select class="field-select" [class.field-locked]="!isAprobado() || !tipoPersona()" [ngModel]="tipoDocumento" (ngModelChange)="tipoDocumento = $event" [disabled]="!isAprobado() || !tipoPersona()">
                  <option value="">Seleccionar documento</option>
                  @for (doc of tiposDocumentoDisponibles(); track doc) {
                    <option [value]="doc">{{ doc }}</option>
                  }
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Número de documento</label>
              <input
                type="text"
                class="field-input"
                [class.field-locked]="!isAprobado() || !tipoDocumento"
                placeholder="Escribe el número"
                [ngModel]="numDocumento"
                (ngModelChange)="numDocumento = $event"
                (blur)="numDocumento = limpiarNumero(numDocumento)"
                [readonly]="!isAprobado() || !tipoDocumento"
              />
            </div>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- Sección 3: Información Tributaria -->
        <section class="form-section">
          <h2 class="section-title">Información Tributaria</h2>
          <p class="section-body">
            <strong>¡Revisa tu documento fiscal!</strong>
            Verifica cuál de estos regímenes aplica según {{ nombrePais(pais()) }}.
          </p>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">
                Régimen fiscal
                <img class="tooltip-icon" [src]="iconTooltip" alt="Ayuda" />
              </label>
              <div class="select-wrap">
                <select class="field-select" [class.field-locked]="!isAprobado() || !tipoPersona()" [(ngModel)]="regimenFiscal" [disabled]="!isAprobado() || !tipoPersona()">
                  <option value="">Seleccionar régimen fiscal</option>
                  @for (r of billingConfig().regimenFiscalOpciones; track r) {
                    <option [value]="r">{{ r }}</option>
                  }
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
            <div class="field-group"></div>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- Sección 4: Documentos a subir (por país, C-02) -->
        <section class="form-section">
          <h2 class="section-title">Documentos a subir</h2>
          @if (!isAprobado()) {
            <p class="section-body">Verifica tu identidad para habilitar la carga de documentos.</p>
          } @else if (!tipoPersona()) {
            <p class="section-body">Elige el tipo de persona para habilitar la carga de documentos.</p>
          }
          <div class="docs-list">
            @for (doc of billingConfig().documentosASubir; track doc; let i = $index) {
              <div class="docs-list__item" [class.docs-list__item--disabled]="!isAprobado() || !tipoPersona()">
                <span class="docs-list__icon">📎</span>
                <span class="docs-list__name">{{ doc }}</span>
                @if (documentosSubidos()[i]) {
                  <span class="docs-list__done"><i class="pi pi-check-circle"></i> Cargado</span>
                } @else {
                  <button type="button" class="docs-list__btn" [disabled]="!isAprobado() || !tipoPersona()" (click)="marcarDocumentoCargado(i)">Cargar</button>
                }
              </div>
            }
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- Consentimientos (C-08/C-09) -->
        <section class="form-section">
          <div class="consent-row" [class.consent-row--disabled]="!isAprobado()" (click)="isAprobado() && aceptaTerminos.set(!aceptaTerminos())">
            <span class="consent-checkbox" [class.consent-checkbox--checked]="aceptaTerminos()">
              @if (aceptaTerminos()) { <i class="pi pi-check"></i> }
            </span>
            <span class="consent-text">Acepto los términos y condiciones</span>
          </div>
          <div class="consent-row" [class.consent-row--disabled]="!isAprobado()" (click)="isAprobado() && aceptaTratamiento.set(!aceptaTratamiento())">
            <span class="consent-checkbox" [class.consent-checkbox--checked]="aceptaTratamiento()">
              @if (aceptaTratamiento()) { <i class="pi pi-check"></i> }
            </span>
            <span class="consent-text">Acepto la política de tratamiento de datos</span>
          </div>
        </section>

        <!-- RN-14: confirmación de guardado directo de campos no sensibles -->
        @if (guardadoNoSensibleVisible()) {
          <div class="webhook-gate webhook-gate--success">
            <i class="pi pi-check-circle"></i>
            <p class="webhook-gate__title">Datos de contacto guardados — no requieren nueva validación</p>
          </div>
        }

        <!-- RN-15 + Fase 4 (Caso Ecuador) — Gate de webhook: nunca se guarda sin confirmación real -->
        @if (guardarEstado() === 'confirmando') {
          <div class="webhook-gate webhook-gate--pending">
            <span class="webhook-gate__spinner">⏳</span>
            <div>
              <p class="webhook-gate__title">Confirmando tus datos con la autoridad fiscal…</p>
              <p class="webhook-gate__subtitle">Esto puede tardar unos minutos. No cierres esta ventana todavía.</p>
            </div>
          </div>
        }
        @if (guardarEstado() === 'rechazado') {
          <div class="webhook-gate webhook-gate--error">
            <i class="pi pi-exclamation-circle"></i>
            <div>
              <p class="webhook-gate__title">No pudimos confirmar estos datos</p>
              <p class="webhook-gate__subtitle">Revisa que el número de documento/NIT sea correcto e inténtalo de nuevo. No se guardó ninguna información.</p>
            </div>
            <button class="btn-outline-danger" type="button" (click)="reintentarGuardado()">Volver a intentar</button>
          </div>
        }
        @if (guardarEstado() === 'guardado') {
          <div class="webhook-gate webhook-gate--success">
            <i class="pi pi-check-circle"></i>
            <div>
              <p class="webhook-gate__title">Datos fiscales confirmados — quedaron en revisión</p>
              <p class="webhook-gate__subtitle">Cambiaste un campo sensible (razón social, tipo de persona o documento). Mientras se revisa, tus retiros, transferencias y DropiCard quedan bloqueados.</p>
            </div>
          </div>
        }

        <!-- RN-14/15: dos acciones de guardado independientes, deliberadamente separadas (wiretext 5-B) -->
        <div class="form-actions">
          <button class="btn-secondary" type="button" [disabled]="!isAprobado()" (click)="onGuardarNoSensibles()">Guardar cambios no sensibles</button>
          <button class="btn-save" type="button" [disabled]="!isAprobado() || !formValido() || guardarEstado() === 'confirmando'" (click)="onGuardarSensibles()">Guardar y re-validar campos sensibles</button>
        </div>

      </div>
      }
    </div>
  `,
})
export class DatosFacturacionNewComponent {
  private stateSvc = inject(IdentityDemoStateService);
  private modalSvc = inject(IdentityModalService);
  private fase0    = inject(IdentityFase0Service);
  private stateV2  = inject(IdentityDemoStateV2Service);

  readonly flagCo      = FLAG_CO;
  readonly iconTooltip = ICON_TOOLTIP;
  readonly iconChevron = ICON_CHEVRON;

  /** Plan2.md Parte 8: el gate ahora lee de stateV2 (sincronizado por el modal), no solo de stateSvc. */
  readonly statusV2 = this.stateV2.status;
  readonly isAprobado = computed(() => this.statusV2() === 'aprobado');
  /**
   * Fase 0 (blueprint "Datos de Facturación": editar exige verificarse
   * primero, pero el formulario sigue visible) nunca usa el empty-state de
   * ícono — se ve el formulario bloqueado con un banner grande arriba. El
   * empty-state solo aplica fuera de Fase 0.
   */
  readonly esFase0 = computed(() => this.stateV2.faseProyecto() === 'fase0');
  readonly esVacio = computed(() => this.statusV2() === 'sin_validar' && !this.esFase0());
  readonly esParcial = computed(() => this.statusV2() === 'parcial');
  readonly estadoFormularioConfig = computed(() => ESTADO_FORMULARIO_CONFIG[this.statusV2()]);
  readonly motorLabel = computed(() => (this.stateV2.motorValidacion() === 'truora' ? 'Truora' : 'Sumsub'));

  readonly paises = PAISES_9;

  pais = signal<Pais9>(this.stateV2.pais());
  municipio           = '';
  direccion           = '';
  email               = '';
  telefono            = '';
  razonSocial         = '';
  tipoDocumento       = '';
  numDocumento        = '';
  regimenFiscal       = '';

  private tipoPersonaSig = signal<TipoPersonaV2 | ''>('');
  tipoPersona = this.tipoPersonaSig.asReadonly();

  documentosSubidos = signal<boolean[]>([]);
  aceptaTerminos    = signal(false);
  aceptaTratamiento = signal(false);

  /** RN-15 + Fase 4 — estado del gate de webhook al guardar campos sensibles (Caso Ecuador). */
  guardarEstado = signal<'idle' | 'confirmando' | 'guardado' | 'rechazado'>('idle');
  /** RN-14 — confirmación visual efímera al guardar campos no sensibles (sin gate, sin re-validación). */
  guardadoNoSensibleVisible = signal(false);

  /** Hallazgo 1: la config fiscal ahora depende de país Y tipo de persona (9×3, no solo 9×1). */
  readonly billingConfig = computed(() =>
    PAIS_BILLING_FIELDS[this.pais()][this.tipoPersona() || 'natural'] ?? BILLING_CONFIG_FALLBACK
  );
  readonly nombreTipoPersona = computed(() => NOMBRE_TIPO_PERSONA[this.pais()]);
  readonly phoneCode = computed(() => PHONE_CODE[this.pais()]);
  readonly localidadLabel = computed(() => LOCALIDAD_LABEL[this.pais()]);
  readonly localidadesDisponibles = computed(() => LOCALIDADES_MOCK[this.pais()]);

  /** C-06: opciones de tipo de documento derivadas del documento principal del país (ej. "CC / NIT" -> ["CC","NIT"]). */
  readonly tiposDocumentoDisponibles = computed(() =>
    this.billingConfig().documentoPrincipal.split('/').map(s => s.trim())
  );

  readonly formValido = computed(() =>
    !!this.tipoPersona() &&
    !!this.tipoDocumento &&
    !!this.numDocumento &&
    !!this.regimenFiscal &&
    this.aceptaTerminos() &&
    this.aceptaTratamiento()
  );

  constructor() {
    effect(() => {
      // Estado 'parcial' (Plan2.md Parte 8): usuario antiguo con datos del
      // formulario manual viejo (pre-Sumsub) — se muestran de solo lectura,
      // nunca certificados todavía, en vez del vacío que ve alguien que
      // nunca tocó nada.
      if (this.esParcial()) {
        const d = DATOS_FORMULARIO_ANTIGUO_MOCK;
        this.municipio = d.municipio;
        this.direccion = d.direccion;
        this.email = d.email;
        this.telefono = d.telefono;
        this.razonSocial = d.razonSocial;
        this.tipoPersonaSig.set('natural');
        this.tipoDocumento = d.tipoDocumento;
        this.numDocumento = d.numDocumento;
        this.regimenFiscal = d.regimenFiscal;
        return;
      }

      if (this.isAprobado()) {
        // Precarga real desde el KYC (Reglasvalidacion.md §3, "1 sola
        // validación" cuando factura con los mismos datos) — si el usuario
        // pasó por la vía "mis-datos" del modal, no se le vuelve a pedir
        // correo/teléfono/documento: se reutiliza lo que ya verificó.
        const kyc = this.stateV2.datosCapturadosKyc();
        const tp = this.stateSvc.tipoPersona();
        if (tp === 'juridica') {
          this.razonSocial = 'TechStore SAS';
          this.tipoPersonaSig.set('juridica');
          this.numDocumento = '900123456-7';
        } else {
          this.razonSocial = kyc?.nombreCompleto ?? 'Laura Martínez López';
          this.tipoPersonaSig.set('natural');
          this.numDocumento = kyc?.numeroDocumento ?? '1023456789';
        }
        this.tipoDocumento = this.tiposDocumentoDisponibles()[0] ?? '';

        // Datos fiscales del cuestionario Sumsub (si el usuario completó el modal)
        const fiscal = this.stateSvc.datosFiscales();
        if (kyc) {
          this.email    = kyc.email;
          this.telefono = kyc.telefono;
        }
        if (fiscal) {
          this.email     = fiscal.emailFacturacion;
          this.municipio = fiscal.municipio;
        } else if (!kyc) {
          // Fallback si se aprobó vía demo panel sin pasar por el modal
          this.email    = 'facturacion@email.com';
          this.telefono = '3101234567';
        }
      }
    }, { allowSignalWrites: true });
  }

  nombrePais(p: Pais9): string { return NOMBRE_PAIS[p]; }

  onPaisChange(p: Pais9): void {
    this.pais.set(p);
    this.municipio = '';
    this.regimenFiscal = '';
    this.tipoDocumento = '';
  }

  /** C-02: cambiar tipo de persona reinicia régimen/documento/documentos a subir. */
  onTipoPersonaChange(tp: TipoPersonaV2): void {
    this.tipoPersonaSig.set(tp);
    this.regimenFiscal = '';
    this.tipoDocumento = '';
    this.numDocumento = '';
    this.documentosSubidos.set(this.billingConfig().documentosASubir.map(() => false));
  }

  /** C-07: el número de documento se limpia (sin guiones/puntos/espacios) antes de validar formato. */
  limpiarNumero(v: string): string { return limpiarNumeroDocumento(v); }

  marcarDocumentoCargado(i: number): void {
    const arr = [...this.documentosSubidos()];
    arr[i] = true;
    this.documentosSubidos.set(arr);
  }

  abrirModal(): void {
    // Banner / CTA suave en Fase 0 → directo a Sumsub (sin interceptor).
    if (this.fase0.invitarDesdeBanner('facturacion')) return;
    this.modalSvc.open('facturacion', 'screen0');
  }

  /**
   * RN-14 (Plan2.md wiretext 5-B): correo de facturación, dirección, ciudad y
   * teléfono se guardan directo, sin re-validar — evita pagar validaciones
   * redundantes a Sumsub/Truora. Deliberadamente independiente del botón de
   * campos sensibles: nunca espera a que el usuario decida tocar esos.
   */
  onGuardarNoSensibles(): void {
    this.guardadoNoSensibleVisible.set(true);
    setTimeout(() => this.guardadoNoSensibleVisible.set(false), 2500);
  }

  /**
   * RN-15 + Fricción Intencional Defensiva (Reglasvalidacion.md §1) + Fase 4
   * "Caso Ecuador" (Plan2.md líneas 1078, 1093-1113): cambiar razón social,
   * tipo de persona o tipo/número de documento siempre dispara una
   * re-validación — nunca se guarda nada hasta que el webhook de la
   * autoridad fiscal confirme el dato real, y una vez confirmado el estado
   * pasa a 'en_revision', bloqueando retiros/transferencias/DropiCard
   * (IdentityGateComponent ya reacciona a status !== 'aprobado') hasta que
   * termine la re-validación.
   */
  onGuardarSensibles(): void {
    this.guardarEstado.set('confirmando');
    setTimeout(() => {
      if (this.stateV2.webhookConfirmed()) {
        this.guardarEstado.set('guardado');
        this.stateV2.setStatus('en_revision');
      } else {
        this.guardarEstado.set('rechazado');
      }
    }, 1400);
  }

  reintentarGuardado(): void {
    this.guardarEstado.set('idle');
  }
}

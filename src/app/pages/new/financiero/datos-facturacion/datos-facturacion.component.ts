import { Component, inject, effect, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdentityDemoStateService } from '../../../../common/services/identity-demo-state.service';
import { IdentityModalService } from '../../../../common/services/identity-modal.service';
import { IdentityDemoStateV2Service } from '../../../../common/services/identity-demo-state-v2.service';
import { PAIS_BILLING_FIELDS, PAISES_9, Pais9, TipoPersonaV2 } from '../../../../common/models/identity-flow-v2.models';

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

@Component({
  selector: 'app-datos-facturacion-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        } @else {
          <span class="tag-pendiente">Pendiente</span>
        }
        <button class="link-tutorial" type="button">Ver tutorial</button>
      </div>

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
      } @else {
        <div class="alert-warning">
          <i class="pi pi-info-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">Para que tus facturas sean válidas, primero valida tu identidad. </span>
              <span>Los datos de entidad quedarán completados automáticamente por {{ motorLabel() }}.</span>
            </p>
            <button class="btn-identity-cta" type="button" (click)="abrirModal()">
              <i class="pi pi-shield"></i> Validar identidad ahora
            </button>
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
                <select class="field-select" [ngModel]="pais()" (ngModelChange)="onPaisChange($event)">
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
                <select class="field-select" [(ngModel)]="municipio">
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
              <input type="text" class="field-input" placeholder="Escribe la dirección" [(ngModel)]="direccion" />
            </div>
            <div class="field-group">
              <label class="field-label">Email para facturacion</label>
              <input type="email" class="field-input" placeholder="ejemplo@empresa.com" [(ngModel)]="email" />
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
                <input type="tel" class="field-input phone-number" placeholder="310 123 4567" [(ngModel)]="telefono" />
              </div>
            </div>
            <div class="field-group"></div>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- Sección 2: Entidad de facturación (locked post-Sumsub) -->
        <section class="form-section" [class.form-section--locked]="isAprobado()">
          <div class="section-header-row">
            <h2 class="section-title">Entidad de facturación</h2>
            @if (isAprobado()) {
              <span class="section-lock-badge">🔒 Completado por {{ motorLabel() }} · No editable</span>
            }
          </div>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Nombre o razón social</label>
              <input type="text" class="field-input" [class.field-locked]="isAprobado()" placeholder="Nombre de tu empresa" [(ngModel)]="razonSocial" [readonly]="isAprobado()" />
            </div>
            <div class="field-group">
              <label class="field-label">Tipo de persona</label>
              <div class="select-wrap">
                <select class="field-select" [class.field-locked]="isAprobado()" [ngModel]="tipoPersona()" (ngModelChange)="onTipoPersonaChange($event)" [disabled]="isAprobado()">
                  <option value="">Seleccionar tipo de persona</option>
                  <option value="natural">{{ billingConfig().nombrePersonaNatural }}</option>
                  <option value="juridica">{{ billingConfig().nombrePersonaJuridica }}</option>
                  @if (billingConfig().nombrePersonaExtranjera) {
                    <option value="extranjera">{{ billingConfig().nombrePersonaExtranjera }}</option>
                  }
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
              @if (!billingConfig().nombrePersonaExtranjera) {
                <p class="field-gap-note">{{ billingConfig().gapEnFuente }}</p>
              }
            </div>
          </div>

          <!-- C-02: tipo/número de documento deshabilitados hasta elegir tipo de persona -->
          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Tipo de documento</label>
              <div class="select-wrap">
                <select class="field-select" [class.field-locked]="isAprobado() || !tipoPersona()" [ngModel]="tipoDocumento" (ngModelChange)="tipoDocumento = $event" [disabled]="isAprobado() || !tipoPersona()">
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
                [class.field-locked]="isAprobado() || !tipoDocumento"
                placeholder="Escribe el número"
                [ngModel]="numDocumento"
                (ngModelChange)="numDocumento = $event"
                (blur)="numDocumento = limpiarNumero(numDocumento)"
                [readonly]="isAprobado() || !tipoDocumento"
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
                <select class="field-select" [class.field-locked]="!tipoPersona()" [(ngModel)]="regimenFiscal" [disabled]="!tipoPersona()">
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
          @if (!tipoPersona()) {
            <p class="section-body">Elige el tipo de persona para habilitar la carga de documentos.</p>
          }
          <div class="docs-list">
            @for (doc of billingConfig().documentosASubir; track doc; let i = $index) {
              <div class="docs-list__item" [class.docs-list__item--disabled]="!tipoPersona()">
                <span class="docs-list__icon">📎</span>
                <span class="docs-list__name">{{ doc }}</span>
                @if (documentosSubidos()[i]) {
                  <span class="docs-list__done"><i class="pi pi-check-circle"></i> Cargado</span>
                } @else {
                  <button type="button" class="docs-list__btn" [disabled]="!tipoPersona()" (click)="marcarDocumentoCargado(i)">Cargar</button>
                }
              </div>
            }
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- Consentimientos (C-08/C-09) -->
        <section class="form-section">
          <div class="consent-row" (click)="aceptaTerminos.set(!aceptaTerminos())">
            <span class="consent-checkbox" [class.consent-checkbox--checked]="aceptaTerminos()">
              @if (aceptaTerminos()) { <i class="pi pi-check"></i> }
            </span>
            <span class="consent-text">Acepto los términos y condiciones</span>
          </div>
          <div class="consent-row" (click)="aceptaTratamiento.set(!aceptaTratamiento())">
            <span class="consent-checkbox" [class.consent-checkbox--checked]="aceptaTratamiento()">
              @if (aceptaTratamiento()) { <i class="pi pi-check"></i> }
            </span>
            <span class="consent-text">Acepto la política de tratamiento de datos</span>
          </div>
        </section>

        <!-- Fase 4 — Gate de webhook, "Caso Ecuador": nunca se guarda sin confirmación real -->
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
            <p class="webhook-gate__title">Datos de facturación guardados y confirmados</p>
          </div>
        }

        <!-- CTA -->
        <div class="form-actions">
          <button class="btn-save" type="button" [disabled]="!formValido() || guardarEstado() === 'confirmando'" (click)="onGuardar()">Guardar facturación</button>
        </div>

      </div>
    </div>
  `,
})
export class DatosFacturacionNewComponent {
  private stateSvc = inject(IdentityDemoStateService);
  private modalSvc = inject(IdentityModalService);
  private stateV2  = inject(IdentityDemoStateV2Service);

  readonly flagCo      = FLAG_CO;
  readonly iconTooltip = ICON_TOOLTIP;
  readonly iconChevron = ICON_CHEVRON;

  readonly isAprobado = this.stateSvc.isApproved;
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

  /** Fase 4 — estado del gate de webhook al guardar (Caso Ecuador). */
  guardarEstado = signal<'idle' | 'confirmando' | 'guardado' | 'rechazado'>('idle');

  readonly billingConfig = computed(() => PAIS_BILLING_FIELDS[this.pais()]);
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
      if (this.isAprobado()) {
        // Identidad bloqueada — capturada por Sumsub/Truora según tipo de persona
        const tp = this.stateSvc.tipoPersona();
        if (tp === 'juridica') {
          this.razonSocial = 'TechStore SAS';
          this.tipoPersonaSig.set('juridica');
          this.numDocumento = '900123456-7';
        } else {
          this.razonSocial = 'Laura Martínez López';
          this.tipoPersonaSig.set('natural');
          this.numDocumento = '1023456789';
        }
        this.tipoDocumento = this.tiposDocumentoDisponibles()[0] ?? '';

        // Datos fiscales del cuestionario Sumsub (si el usuario completó el modal)
        const fiscal = this.stateSvc.datosFiscales();
        if (fiscal) {
          this.email     = fiscal.emailFacturacion;
          this.municipio = fiscal.municipio;
        } else {
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
    this.modalSvc.open('facturacion', 'screen0');
  }

  /**
   * Fase 4 — Prevención del "Caso Ecuador" (Plan2.md líneas 1078, 1093-1113):
   * el formulario de datos fiscales nunca guarda nada hasta que el webhook de
   * la autoridad fiscal confirme el estado real. Si no confirma, no se
   * persiste ningún dato ingresado — el usuario vuelve a intentar sin perder
   * lo que ya escribió en pantalla.
   */
  onGuardar(): void {
    this.guardarEstado.set('confirmando');
    setTimeout(() => {
      this.guardarEstado.set(this.stateV2.webhookConfirmed() ? 'guardado' : 'rechazado');
    }, 1400);
  }

  reintentarGuardado(): void {
    this.guardarEstado.set('idle');
  }
}

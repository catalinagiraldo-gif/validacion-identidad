import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TipoPersona } from '../../../../common/models/identity-flow.models';
import {
  DatosPersonaNatural,
  IdentityProfileService,
  ResponsableTributarioState,
} from '../../../../common/services/identity-profile.service';
import { ToastService } from '../../../../common/services/toast.service';
import { DropiTagComponent, DropiTagSeverity } from '../../../../common/components/dropi-tag/dropi-tag.component';
import { DropiAlertComponent, DropiAlertSeverity } from '../../../../common/components/dropi-alert/dropi-alert.component';
import { DropiModalComponent } from '../../../../common/components/dropi-modal/dropi-modal.component';
import {
  SumsubModalConfig,
  SumsubResult,
  SumsubVerificationModalComponent,
} from '../../../../common/components/sumsub-verification-modal/sumsub-verification-modal.component';

interface DatosFacturacionForm {
  pais: string;
  municipio: string;
  direccion: string;
  email: string;
  indicativo: string;
  telefono: string;
  razonSocial: string;
  tipoPersona: TipoPersona;
  tipoDocumento: string;
  numeroDocumento: string;
  tipoRegimen: string;
  tipoResponsabilidad: string;
  impuesto: string;
}

@Component({
  selector: 'app-datos-facturacion-new',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTagComponent,
    DropiAlertComponent,
    DropiModalComponent,
    SumsubVerificationModalComponent,
  ],
  styleUrls: ['./datos-facturacion.component.scss'],
  template: `
    <div class="facturacion-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-down"></i></span>
        <span class="breadcrumb-item muted">Financiero</span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-down"></i></span>
        <span class="breadcrumb-item muted">Wallet</span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-down"></i></span>
        <span class="breadcrumb-item">Datos de facturación</span>
      </nav>

      <!-- Title row -->
      <div class="title-row">
        <h1 class="page-title">Datos de facturación</h1>
        <app-dropi-tag [label]="statusLabel" [severity]="statusSeverity"></app-dropi-tag>
        <a class="tutorial-link" href="javascript:void(0)">Ver tutorial</a>
      </div>

      <!-- Alert -->
      <app-dropi-alert [message]="topAlertMessage" [severity]="topAlertSeverity" [closable]="false"></app-dropi-alert>

      <div class="form-card">
        <!-- Mismos datos del dueño -->
        <section class="form-section">
          <div class="mismos-datos-toggle">
            <div class="mismos-datos-toggle__text">
              <h2 class="section-title">¿Vas a facturar con los mismos datos de tu cuenta?</h2>
              <p class="section-description">
                Si activas esta opción, usamos automáticamente los datos que ya validaste en Información de cuenta.
              </p>
            </div>
            <button
              type="button"
              class="switch"
              [class.switch--on]="mismosDatosDueno"
              role="switch"
              [attr.aria-checked]="mismosDatosDueno"
              (click)="toggleMismosDatos()"
            >
              <span class="switch__knob"></span>
            </button>
          </div>
        </section>

        <hr class="section-divider" />

        <!-- Información de Contacto -->
        <section class="form-section">
          <h2 class="section-title">Información de Contacto</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="pais">País</label>
              <select id="pais" [(ngModel)]="datos.pais" name="pais">
                @for (p of paises; track p) {
                  <option [value]="p">{{ p }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label for="municipio">Municipio</label>
              <input type="text" id="municipio" [(ngModel)]="datos.municipio" name="municipio" placeholder="Escribe el municipio" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="direccion">Dirección</label>
              <input type="text" id="direccion" [(ngModel)]="datos.direccion" name="direccion" placeholder="Escribe la dirección" />
            </div>
            <div class="form-group">
              <label for="email">Email para facturacion</label>
              <input type="email" id="email" [(ngModel)]="datos.email" name="email" placeholder="ejemplo&#64;empresa.com" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="telefono">Número de télefono</label>
              <div class="phone-group">
                <div class="phone-prefix">
                  <span class="flag-co" aria-hidden="true"></span>
                  <span>{{ datos.indicativo }}</span>
                </div>
                <input type="text" id="telefono" [(ngModel)]="datos.telefono" name="telefono" placeholder="310 123 4567" />
              </div>
            </div>
            <div class="form-group spacer"></div>
          </div>
        </section>

        <hr class="section-divider" />

        <!-- Información de Empresa -->
        <section class="form-section">
          <h2 class="section-title">Información de Empresa</h2>

          @if (mismosDatosDueno) {
            <app-dropi-alert
              message="Estos datos vienen de tu Información de cuenta. Para cambiarlos, edítalos allá."
              severity="info"
              [closable]="false"
            ></app-dropi-alert>
          }

          <div class="form-row">
            <div class="form-group">
              <label for="razonSocial">Nombre o razón social</label>
              <input
                type="text"
                id="razonSocial"
                [(ngModel)]="datos.razonSocial"
                name="razonSocial"
                placeholder="Nombre de tu empresa"
                [disabled]="mismosDatosDueno"
                [class.form-input--fill]="mismosDatosDueno"
                (focus)="onFocusSensitiveField()"
              />
            </div>
            <div class="form-group">
              <label for="tipoPersona">Tipo de persona</label>
              <select
                id="tipoPersona"
                [(ngModel)]="datos.tipoPersona"
                name="tipoPersona"
                [disabled]="mismosDatosDueno"
                (focus)="onFocusSensitiveField()"
              >
                <option value="natural">Persona natural</option>
                <option value="juridica">Persona jurídica</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="tipoDocumento">Tipo de documento</label>
              <select
                id="tipoDocumento"
                [(ngModel)]="datos.tipoDocumento"
                name="tipoDocumento"
                [disabled]="mismosDatosDueno"
                (focus)="onFocusSensitiveField()"
              >
                <option value="" disabled selected>Seleccionar documento</option>
                @for (t of tiposDocumento; track t) {
                  <option [value]="t">{{ t }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label for="numeroDocumento">Número de documento</label>
              <input
                type="text"
                id="numeroDocumento"
                [(ngModel)]="datos.numeroDocumento"
                name="numeroDocumento"
                placeholder="Escribe el número"
                [disabled]="mismosDatosDueno"
                [class.form-input--fill]="mismosDatosDueno"
                (focus)="onFocusSensitiveField()"
              />
            </div>
          </div>

          @if (!mismosDatosDueno && !responsableValidado) {
            <button type="button" class="btn-secondary" (click)="iniciarValidacionResponsable()">
              Validar responsable tributario con Sumsub
            </button>
          }
        </section>

        <hr class="section-divider" />

        <!-- Información Tributaria -->
        <section class="form-section">
          <div class="section-heading">
            <h2 class="section-title">Información Tributaria</h2>
            <p class="section-description">
              <strong>¡Revisa en tu RUT!</strong> En la sección "Responsabilidades, Calidades y Atributos", si aplican las siguientes obligaciones tributarias.
            </p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="tipoRegimen">Tipo de regimen <i class="pi pi-question-circle tooltip-icon"></i></label>
              <select id="tipoRegimen" [(ngModel)]="datos.tipoRegimen" name="tipoRegimen">
                <option value="" disabled selected>Seleccionar tipo de régimen</option>
                @for (t of tiposRegimen; track t) {
                  <option [value]="t">{{ t }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label for="tipoResponsabilidad">Tipo de responsabilidad <i class="pi pi-question-circle tooltip-icon"></i></label>
              <select id="tipoResponsabilidad" [(ngModel)]="datos.tipoResponsabilidad" name="tipoResponsabilidad">
                <option value="" disabled selected>Seleccionar la responsabilidad</option>
                @for (t of tiposResponsabilidad; track t) {
                  <option [value]="t">{{ t }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="impuesto">Impuesto <i class="pi pi-question-circle tooltip-icon"></i></label>
              <select id="impuesto" [(ngModel)]="datos.impuesto" name="impuesto">
                <option value="" disabled selected>Seleccionar el impuesto</option>
                @for (t of impuestos; track t) {
                  <option [value]="t">{{ t }}</option>
                }
              </select>
            </div>
            <div class="form-group spacer"></div>
          </div>
        </section>

        <div class="form-actions">
          <button class="btn-primary" (click)="onSaveDatos()">Guardar facturación</button>
        </div>
      </div>

      <!-- Toast -->
      <div class="toast" *ngIf="showToast" [ngClass]="toastType">
        <i class="pi" [ngClass]="{
          'pi-check-circle': toastType === 'success',
          'pi-info-circle': toastType === 'info'
        }"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </div>

    <app-dropi-modal
      header="Esto requiere una nueva validación"
      [visible]="confirmRevalidationVisible"
      width="440px"
      (visibleChange)="confirmRevalidationVisible = $event"
    >
      <p class="confirm-text">
        Vas a cambiar a quién le facturas. Por seguridad, esto invalida tu validación actual del responsable
        tributario y deberás volver a verificarlo con Sumsub antes de poder retirar saldo.
      </p>
      <div footer>
        <button type="button" class="btn-secondary" (click)="confirmRevalidationVisible = false">Cancelar</button>
        <button type="button" class="btn-primary" (click)="confirmRevalidation()">Sí, continuar</button>
      </div>
    </app-dropi-modal>

    <app-sumsub-verification-modal
      [visible]="modalVisible"
      [config]="modalConfig"
      (visibleChange)="modalVisible = $event"
      (success)="onValidacionExitosa($event)"
      (cancelled)="onValidacionCancelada()"
    ></app-sumsub-verification-modal>
  `,
})
export class DatosFacturacionNewComponent {
  private identity = inject(IdentityProfileService);
  private toast = inject(ToastService);

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' = 'success';

  private readonly defaults: DatosFacturacionForm = {
    pais: 'Colombia',
    municipio: '',
    direccion: '',
    email: '',
    indicativo: '57',
    telefono: '',
    razonSocial: '',
    tipoPersona: 'natural',
    tipoDocumento: '',
    numeroDocumento: '',
    tipoRegimen: '',
    tipoResponsabilidad: '',
    impuesto: '',
  };

  datos: DatosFacturacionForm = { ...this.defaults };

  paises = ['Colombia', 'México', 'Argentina', 'Chile', 'Ecuador'];
  tiposDocumento = ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'NIT'];
  tiposRegimen = ['Simplificado', 'Común'];
  tiposResponsabilidad = ['No responsable de IVA', 'Responsable de IVA', 'Agente retenedor IVA'];
  impuestos = ['IVA', 'INC', 'Ninguno'];

  modalVisible = false;
  modalConfig: SumsubModalConfig = { origen: 'configuraciones', para: 'responsable-tributario', tipoPersona: 'natural' };

  confirmRevalidationVisible = false;
  private revalidationConfirmedThisSession = false;

  constructor() {
    effect(() => {
      this.syncFromService(this.identity.responsable());
    });
  }

  get mismosDatosDueno(): boolean {
    return this.identity.responsable().mismosDatosDueno;
  }

  get responsableValidado(): boolean {
    return this.identity.responsableValidado();
  }

  get statusLabel(): string {
    switch (this.identity.responsableStatusEfectivo()) {
      case 'aprobado': return 'Validado';
      case 'pendiente': return 'Pendiente';
      case 'en_revision': return 'En revisión';
      case 'rechazado': return 'Rechazado';
      default: return 'Sin validar';
    }
  }

  get statusSeverity(): DropiTagSeverity {
    switch (this.identity.responsableStatusEfectivo()) {
      case 'aprobado': return 'success';
      case 'pendiente': return 'warning';
      case 'en_revision': return 'info';
      case 'rechazado': return 'error';
      default: return 'secondary';
    }
  }

  get topAlertMessage(): string {
    if (this.mismosDatosDueno) {
      return this.identity.duenoValidado()
        ? 'Facturas con los mismos datos de tu cuenta validada. No necesitas otra verificación.'
        : 'Vas a facturar con los mismos datos de tu cuenta. Primero valida tu identidad en Información de cuenta.';
    }
    const r = this.identity.responsable();
    if (r.status === 'rechazado' && r.motivoRechazo) {
      return `No pudimos validar al responsable tributario: ${r.motivoRechazo.label}. ${r.motivoRechazo.description}`;
    }
    if (r.status === 'aprobado') {
      return 'El responsable tributario está validado.';
    }
    return 'Evita confusiones en tu factura: declara y valida quién es el responsable tributario.';
  }

  get topAlertSeverity(): DropiAlertSeverity {
    if (this.mismosDatosDueno) return this.identity.duenoValidado() ? 'success' : 'warning';
    const status = this.identity.responsable().status;
    if (status === 'aprobado') return 'success';
    if (status === 'rechazado') return 'error';
    return 'warning';
  }

  toggleMismosDatos(): void {
    this.identity.setResponsableMismosDatos(!this.mismosDatosDueno);
  }

  onFocusSensitiveField(): void {
    if (this.mismosDatosDueno) return;
    if (this.identity.responsableStatusEfectivo() !== 'aprobado') return;
    if (this.revalidationConfirmedThisSession) return;
    this.confirmRevalidationVisible = true;
  }

  confirmRevalidation(): void {
    this.revalidationConfirmedThisSession = true;
    this.confirmRevalidationVisible = false;
    this.identity.invalidateResponsableForRevalidation();
    this.toast.warning('Tu responsable tributario quedó pendiente de re-validación.');
  }

  iniciarValidacionResponsable(): void {
    this.modalConfig = {
      origen: 'configuraciones',
      para: 'responsable-tributario',
      tipoPersona: this.datos.tipoPersona,
      paisSugerido: this.datos.pais,
    };
    this.modalVisible = true;
  }

  onValidacionExitosa(result: SumsubResult): void {
    this.identity.setResponsableValidado(result.applicantId, result.tipoPersona, result.datos);
    this.revalidationConfirmedThisSession = false;
    this.notify('Responsable tributario validado correctamente', 'success');
  }

  onValidacionCancelada(): void {
    this.notify('Puedes retomar la validación cuando quieras', 'info');
  }

  onSaveDatos(): void {
    this.identity.setResponsableDatosFacturacion({
      pais: this.datos.pais,
      municipio: this.datos.municipio,
      direccion: this.datos.direccion,
      email: this.datos.email,
      indicativo: this.datos.indicativo,
      telefono: this.datos.telefono,
      tipoRegimen: this.datos.tipoRegimen,
      tipoResponsabilidad: this.datos.tipoResponsabilidad,
      impuesto: this.datos.impuesto,
    });
    this.notify('Datos de facturacion guardados correctamente', 'success');
  }

  onDiscard(): void {
    this.datos = { ...this.defaults };
    this.notify('Cambios descartados', 'info');
  }

  private notify(msg: string, type: 'success' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }

  private syncFromService(r: ResponsableTributarioState): void {
    if (r.mismosDatosDueno) {
      const d = this.identity.dueno();
      if (d.tipoPersona === 'natural' && d.natural) {
        this.applyNatural(d.natural);
      } else if (d.tipoPersona === 'juridica' && d.juridica) {
        this.datos.razonSocial = d.juridica.razonSocial;
        this.datos.tipoPersona = 'juridica';
        this.datos.tipoDocumento = 'NIT';
        this.datos.numeroDocumento = d.juridica.nit;
      }
    } else {
      if (r.tipoPersona) this.datos.tipoPersona = r.tipoPersona;
      if (r.tipoPersona === 'natural' && r.natural) {
        this.applyNatural(r.natural);
      } else if (r.tipoPersona === 'juridica' && r.juridica) {
        this.datos.razonSocial = r.juridica.razonSocial;
        this.datos.tipoDocumento = 'NIT';
        this.datos.numeroDocumento = r.juridica.nit;
      }
    }

    if (r.datosFacturacion) {
      this.datos.pais = r.datosFacturacion.pais || this.datos.pais;
      this.datos.municipio = r.datosFacturacion.municipio;
      this.datos.direccion = r.datosFacturacion.direccion;
      this.datos.email = r.datosFacturacion.email;
      this.datos.indicativo = r.datosFacturacion.indicativo || '57';
      this.datos.telefono = r.datosFacturacion.telefono;
      this.datos.tipoRegimen = r.datosFacturacion.tipoRegimen;
      this.datos.tipoResponsabilidad = r.datosFacturacion.tipoResponsabilidad;
      this.datos.impuesto = r.datosFacturacion.impuesto;
    }
  }

  private applyNatural(n: DatosPersonaNatural): void {
    this.datos.razonSocial = `${n.primerNombre} ${n.primerApellido}`.trim();
    this.datos.tipoPersona = 'natural';
    this.datos.tipoDocumento = n.tipoDocumento;
    this.datos.numeroDocumento = n.numeroDocumento;
    if (!this.datos.email) this.datos.email = n.email;
    if (!this.datos.telefono) this.datos.telefono = n.telefono;
  }
}

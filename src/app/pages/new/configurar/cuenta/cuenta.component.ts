import { Component, inject, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdentityDemoStateService } from '../../../../common/services/identity-demo-state.service';
import { IdentityModalService } from '../../../../common/services/identity-modal.service';
import { IdentityFase0Service } from '../../../../common/services/identity-fase0.service';
import { IdentityDemoStateV2Service } from '../../../../common/services/identity-demo-state-v2.service';
import { ESTADO_FORMULARIO_CONFIG } from '../../../../common/models/identity-flow-v2.models';

/** Plan2.md Parte 8: datos del formulario manual viejo (pre-Sumsub), usuario antiguo estado 'parcial'. */
const DATOS_CUENTA_ANTIGUOS_MOCK = {
  primerNombre: 'Laura',
  primerApellido: 'Martínez',
  segundoApellido: 'López',
  emailContacto: 'contacto@negocioviejo.com',
  telefono: '3009876543',
  direccion: 'Calle 45 # 12-34',
};

const AVATAR_ICON = 'https://www.figma.com/api/mcp/asset/7e9163eb-de22-4728-845a-0e2ffbf9b37d';
const ICON_CALENDAR = 'https://www.figma.com/api/mcp/asset/18dc5cd0-37c6-440e-992a-c36bd2132906';
const FLAG_CO = 'https://www.figma.com/api/mcp/asset/634fbf8a-aef1-4fd6-9336-3ddada33124f';
const ICON_CHEVRON = 'https://www.figma.com/api/mcp/asset/438517bd-cdef-4d02-8e77-91725eda6ace';

@Component({
  selector: 'app-cuenta-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./cuenta.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="bc-home"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item">Configurar</span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item">Cuenta</span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item bc-active">Información de cuenta</span>
      </nav>

      <!-- Title row -->
      <div class="page-header">
        <h1 class="page-title">Información de cuenta</h1>
        @if (isAprobado()) {
          <span class="tag-aprobado"><i class="pi pi-shield"></i> Identidad verificada</span>
        } @else if (statusV2() === 'en_revision') {
          <span class="tag-revision"><i class="pi pi-clock"></i> En revisión</span>
        } @else if (statusV2() === 'rechazado') {
          <span class="tag-rechazado"><i class="pi pi-times-circle"></i> Rechazado</span>
        } @else if (esParcial()) {
          <span class="tag-parcial"><i class="pi pi-info-circle"></i> Datos sin certificar</span>
        } @else if (statusV2() === 'pendiente') {
          <span class="tag-pendiente"><i class="pi pi-hourglass"></i> Verificación en curso</span>
        } @else {
          <span class="tag-sin-iniciar">Sin iniciar</span>
        }
      </div>

      <!-- Estado vacío: nunca ha hecho nada (sin_validar, sin datos previos) — Plan2.md Parte 8 -->
      @if (esVacio()) {
        <div class="empty-state">
          <i class="pi pi-shield empty-state__icon"></i>
          <p class="empty-state__text">Aún no has completado la información de tu cuenta.</p>
          <p class="empty-state__subtext">Verifica tu identidad para configurar tus datos.</p>
          <button class="btn-identity-cta" type="button" (click)="abrirModal('screen0')">
            <i class="pi pi-shield"></i> Verificar identidad
          </button>
        </div>
      } @else {

      <!-- Alert / CTA según estado -->
      @if (isAprobado()) {
        <div class="alert-success">
          <i class="pi pi-check-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">Tu identidad fue verificada por Sumsub. </span>
              <span>Los campos marcados con 🔒 no son editables por 6 meses.</span>
            </p>
          </div>
        </div>
      } @else if (statusV2() === 'en_revision') {
        <div class="alert-review">
          <i class="pi pi-clock alert-icon"></i>
          <p class="alert-text">
            <span class="alert-bold">Tu verificación está siendo revisada. </span>
            <span>En 1-3 días hábiles te notificaremos por email.</span>
          </p>
        </div>
      } @else if (statusV2() === 'rechazado') {
        <div class="alert-top alert-top--error">
          <i class="pi pi-times-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">Tu verificación fue rechazada. </span>
              <span>El documento no fue legible. Puedes reintentar.</span>
            </p>
            <button class="btn-identity-cta btn-identity-cta--sm" type="button" (click)="abrirModal('screen2')">
              <i class="pi pi-refresh"></i> Reintentar verificación
            </button>
          </div>
        </div>
      } @else if (esFase0() && statusV2() === 'sin_validar') {
        <!-- Fase 0 (blueprint Etapa 0.5, "Tarea" paso 2): "Información de
             Cuenta" ES uno de los 6 triggers estándar → Modal Interceptor
             UserPilot, "editar exige verificarse primero" — mismo trato que
             Transferir Wallet. Este banner estático NO reemplaza al Modal
             Interceptor: solo evita ocultar el formulario detrás de un
             empty-state antes del clic — el CTA sí abre el interceptor. -->
        <div class="alert-top alert-top--fase0-estatico" data-tour="cuenta-banner-fase0">
          <i class="pi pi-shield alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">¿Cuándo se completan tus datos? </span>
              <span>Puedes ver el formulario ya mismo, pero queda bloqueado hasta que verifiques tu identidad — es necesaria para poder retirar tus ganancias. Toma ~5 min.</span>
            </p>
            <button class="btn-identity-cta" type="button" (click)="abrirModal('screen0')">
              <i class="pi pi-shield"></i> Verificar identidad
            </button>
          </div>
        </div>
      } @else {
        <div class="alert-top">
          <i class="pi pi-exclamation-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">{{ estadoFormularioConfig().banner }}. </span>
              <span>Es necesaria para poder retirar tus ganancias. Toma ~5 min.</span>
            </p>
            @if (estadoFormularioConfig().ctaLabel) {
              <button class="btn-identity-cta" type="button" (click)="abrirModal('screen0')">
                <i class="pi pi-shield"></i> {{ estadoFormularioConfig().ctaLabel }}
              </button>
            }
          </div>
        </div>
      }

      <!-- Main layout: avatar + form -->
      <div class="cuenta-layout">

        <!-- Avatar column -->
        <div class="avatar-col">
          <div class="avatar-circle">
            <img [src]="avatarIcon" alt="Avatar" class="avatar-icon-img" />
          </div>
          <button class="btn-cambiar-foto" type="button">Cambiar foto</button>
        </div>

        <!-- Form column -->
        <div class="form-col">

          <!-- Inner alert -->
          <div class="alert-inner">
            <i class="pi pi-exclamation-circle alert-icon-sm"></i>
            <p class="alert-text-sm">
              <span class="alert-bold">Revisa bien tus datos. </span>
              <span>Tras validarte, no podrás cambiarlos por 6 meses. ¿Dudas? </span>
              <span class="alert-link">Escríbenos a soporte.</span>
            </p>
          </div>

          <!-- Instruction text -->
          <p class="instruction-text">
            <strong>Si eres persona natural</strong>, ingresa tus datos según tu documento de identidad.
            <strong>Si eres persona jurídica </strong>(empresa), ingresa únicamente los datos personales del representante legal, no los datos de la empresa.
          </p>

          <!-- RN-11: bloqueo de 6 meses del Dueño de cuenta -->
          @if (isAprobado() && duenoBloqueado()) {
            <div class="alert-lock-rn11" data-tour="cuenta-lock-rn11">
              <i class="pi pi-lock alert-icon"></i>
              <p class="alert-text">
                <span class="alert-bold">Datos bloqueados hasta {{ fechaDesbloqueo() }}. </span>
                <span>Por seguridad no puedes modificar tu nombre, documento ni fecha de nacimiento hasta cumplir 6 meses desde tu última validación (prevención de fraude y lavado de activos).</span>
              </p>
            </div>
          }

          <!-- Datos personales -->
          <div class="form-block">
            <div class="form-row">
              <div class="field-group">
                <label class="field-label">
                  Primer nombre
                  @if (isAprobado()) {
                    <span class="lock-badge" [title]="duenoBloqueado() ? tooltipBloqueoRN11() : 'Puedes editar — cualquier cambio pedirá verificarte de nuevo'">
                      {{ duenoBloqueado() ? '🔒 Bloqueado 6 meses' : '✏️ Editable' }}
                    </span>
                  }
                </label>
                <input type="text" class="field-input" [class.field-locked]="!isAprobado() || duenoBloqueado()" placeholder="" [(ngModel)]="primerNombre" [readonly]="!isAprobado() || duenoBloqueado()" [title]="duenoBloqueado() ? tooltipBloqueoRN11() : ''" />
              </div>
              <div class="field-group">
                <label class="field-label">
                  Segundo nombre (Opcional)
                  @if (isAprobado()) { <span class="lock-badge">{{ duenoBloqueado() ? '🔒 Bloqueado 6 meses' : '✏️ Editable' }}</span> }
                </label>
                <input type="text" class="field-input" [class.field-locked]="!isAprobado() || duenoBloqueado()" placeholder="" [(ngModel)]="segundoNombre" [readonly]="!isAprobado() || duenoBloqueado()" />
              </div>
            </div>
            <div class="form-row">
              <div class="field-group">
                <label class="field-label">
                  Primer apellido
                  @if (isAprobado()) { <span class="lock-badge" [title]="duenoBloqueado() ? tooltipBloqueoRN11() : ''">{{ duenoBloqueado() ? '🔒 Bloqueado 6 meses' : '✏️ Editable' }}</span> }
                </label>
                <input type="text" class="field-input" [class.field-locked]="!isAprobado() || duenoBloqueado()" placeholder="" [(ngModel)]="primerApellido" [readonly]="!isAprobado() || duenoBloqueado()" [title]="duenoBloqueado() ? tooltipBloqueoRN11() : ''" />
              </div>
              <div class="field-group">
                <label class="field-label">
                  Segundo apellido (Opcional)
                  @if (isAprobado()) { <span class="lock-badge">{{ duenoBloqueado() ? '🔒 Bloqueado 6 meses' : '✏️ Editable' }}</span> }
                </label>
                <input type="text" class="field-input" [class.field-locked]="!isAprobado() || duenoBloqueado()" placeholder="" [(ngModel)]="segundoApellido" [readonly]="!isAprobado() || duenoBloqueado()" />
              </div>
            </div>
            <div class="form-row">
              <div class="field-group field-date">
                <label class="field-label">Fecha de nacimiento</label>
                <div class="date-input-wrap">
                  <img class="cal-icon" [src]="iconCalendar" alt="" />
                  <input type="text" class="field-input" [class.field-locked]="!isAprobado() || duenoBloqueado()" placeholder="DD/MM/AAAA" [(ngModel)]="fechaNacimiento" [readonly]="!isAprobado() || duenoBloqueado()" [title]="duenoBloqueado() ? tooltipBloqueoRN11() : ''" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Nacionalidad</label>
                <div class="select-wrap">
                  <select class="field-select" [class.field-locked]="!isAprobado()" [(ngModel)]="nacionalidad" [disabled]="!isAprobado()">
                    <option value="">Seleccionar</option>
                    <option value="co">Colombiana</option>
                    <option value="mx">Mexicana</option>
                    <option value="ec">Ecuatoriana</option>
                    <option value="ve">Venezolana</option>
                    <option value="pe">Peruana</option>
                  </select>
                  <img class="chevron-icon" [src]="iconChevron" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div class="section-divider"></div>

          <!-- Identificación -->
          <div class="form-block">
            <h2 class="section-title">Identificación</h2>
            <div class="form-row">
              <div class="field-group">
                <label class="field-label">Tipo de documento</label>
                <div class="select-wrap">
                  <select class="field-select field-disabled" [(ngModel)]="tipoDocumento" disabled>
                    <option value="">Seleccionar</option>
                    <option value="cc">Cédula de ciudadanía</option>
                    <option value="nit">NIT</option>
                    <option value="ce">Cédula de extranjería</option>
                    <option value="pasaporte">Pasaporte</option>
                  </select>
                  <img class="chevron-icon" [src]="iconChevron" alt="" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Documento</label>
                <input type="text" class="field-input field-disabled" placeholder="" [(ngModel)]="documento" [disabled]="true" />
              </div>
            </div>
          </div>

          <div class="section-divider"></div>

          <!-- Contacto -->
          <div class="form-block">
            <h2 class="section-title">Contacto</h2>
            <div class="form-row">
              <div class="field-group">
                <label class="field-label">Email de contacto</label>
                <input type="email" class="field-input" [class.field-locked]="!isAprobado()" placeholder="" [(ngModel)]="emailContacto" [readonly]="!isAprobado()" />
              </div>
              <div class="field-group">
                <label class="field-label">Teléfono celular</label>
                <div class="phone-row">
                  <div class="phone-prefix">
                    <img class="flag" [src]="flagCo" alt="Colombia" />
                    <span class="phone-code-text">57</span>
                  </div>
                  <input type="tel" class="field-input phone-number" [class.field-locked]="!isAprobado()" placeholder="" [(ngModel)]="telefono" [readonly]="!isAprobado()" />
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="field-group field-full">
                <label class="field-label">Dirección</label>
                <input type="text" class="field-input" [class.field-locked]="!isAprobado()" placeholder="" [(ngModel)]="direccion" [readonly]="!isAprobado()" />
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="form-actions">
            <button class="btn-save" type="button" [disabled]="!isAprobado()" (click)="onGuardar()">Guardar información de cuenta</button>
          </div>

        </div>
      </div>
      }
    </div>
  `,
})
export class CuentaNewComponent {
  private stateSvc = inject(IdentityDemoStateService);
  private modalSvc = inject(IdentityModalService);
  private fase0 = inject(IdentityFase0Service);
  private stateV2  = inject(IdentityDemoStateV2Service);

  readonly avatarIcon = AVATAR_ICON;
  readonly iconCalendar = ICON_CALENDAR;
  readonly flagCo = FLAG_CO;
  readonly iconChevron = ICON_CHEVRON;

  /** Plan2.md Parte 8: el gate ahora lee de stateV2 (sincronizado por el modal), no solo de stateSvc. */
  readonly statusV2 = this.stateV2.status;
  readonly isAprobado = computed(() => this.statusV2() === 'aprobado');
  /**
   * Fase 0 (blueprint "Información de Cuenta": editar exige verificarse
   * primero, pero no es un movimiento financiero) nunca usa el empty-state
   * de ícono — se ve el formulario bloqueado con un banner estático arriba,
   * sin Modal Interceptor. El empty-state solo aplica fuera de Fase 0.
   */
  readonly esFase0 = computed(() => this.stateV2.faseProyecto() === 'fase0');
  readonly esVacio = computed(() => this.statusV2() === 'sin_validar' && !this.esFase0());
  readonly esParcial = computed(() => this.statusV2() === 'parcial');
  readonly estadoFormularioConfig = computed(() => ESTADO_FORMULARIO_CONFIG[this.statusV2()]);

  /** RN-11: bloqueo de 6 meses sobre los campos sensibles del Dueño de cuenta (nombre, apellidos, fecha de nacimiento). */
  readonly duenoBloqueado = this.stateV2.duenoBloqueadoPorTiempo;
  readonly fechaDesbloqueo = computed(() => {
    const fecha = this.stateV2.lastValidatedAt();
    if (!fecha) return '';
    const d = new Date(fecha);
    d.setMonth(d.getMonth() + 6);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  });
  tooltipBloqueoRN11(): string {
    return `Por seguridad no puedes modificar estos datos hasta cumplir 6 meses desde tu última validación (${this.fechaDesbloqueo()}) — prevención de fraude y lavado de activos.`;
  }

  primerNombre    = '';
  segundoNombre   = '';
  primerApellido  = '';
  segundoApellido = '';
  fechaNacimiento = '';
  nacionalidad    = '';
  tipoDocumento   = '';
  documento       = '';
  emailContacto   = '';
  telefono        = '';
  direccion       = '';

  constructor() {
    effect(() => {
      // Estado 'parcial' (Plan2.md Parte 8): usuario antiguo con datos del
      // formulario manual viejo (pre-Sumsub) — se muestran de solo lectura,
      // nunca certificados todavía.
      if (this.esParcial()) {
        const d = DATOS_CUENTA_ANTIGUOS_MOCK;
        this.primerNombre = d.primerNombre;
        this.primerApellido = d.primerApellido;
        this.segundoApellido = d.segundoApellido;
        this.emailContacto = d.emailContacto;
        this.telefono = d.telefono;
        this.direccion = d.direccion;
        return;
      }

      if (this.isAprobado()) {
        this.primerNombre   = 'Laura';
        this.primerApellido = 'Martínez';
        this.segundoApellido = 'López';
        this.tipoDocumento  = 'cc';
        this.documento      = '1.023.456.789';
        this.emailContacto  = 'laura.martinez@email.com';
        this.telefono       = '3101234567';
      }
    }, { allowSignalWrites: true });
  }

  abrirModal(screen: 'screen0' | 'screen2' | 'screen3'): void {
    // Fase 0: editar información de cuenta es un trigger de Etapa 0.5 (interceptor). fase1+ intacto.
    if (this.fase0.tryIntercept('cuenta', false)) return;
    this.modalSvc.open('cuenta', screen);
  }

  /**
   * RN-11 (Plan2.md wiretext 5-A): pasados los 6 meses, los campos del Dueño
   * quedan editables — pero cualquier cambio dispara una re-validación
   * completa (no se guarda directo). Mientras sigue bloqueado, este botón
   * está deshabilitado por el template y no debería poder llamarse.
   */
  onGuardar(): void {
    if (this.isAprobado() && !this.duenoBloqueado()) {
      this.modalSvc.open('cuenta', 'screen2');
    }
  }
}

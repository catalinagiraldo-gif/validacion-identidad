import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { OrigenValidacion, SumsubScreenPhase, TipoPersona } from '../../models/identity-flow.models';
import { DatosPersonaJuridica, DatosPersonaNatural, RejectionReason } from '../../services/identity-profile.service';
import { DropiModalComponent } from '../dropi-modal/dropi-modal.component';
import { DropiStepsComponent, DropiStepItem } from '../dropi-steps/dropi-steps.component';
import { DropiAlertComponent } from '../dropi-alert/dropi-alert.component';

export type SumsubFor = 'dueno' | 'responsable-tributario';
export type ModalPhase = SumsubScreenPhase | 'success' | 'rechazo';

export interface SumsubModalConfig {
  origen: OrigenValidacion;
  para: SumsubFor;
  tipoPersona: TipoPersona;
  paisSugerido?: string;
}

export interface SumsubResult {
  applicantId: string;
  tipoPersona: TipoPersona;
  datos: DatosPersonaNatural | DatosPersonaJuridica;
}

interface KybCompany {
  id: string;
  razonSocial: string;
  nit: string;
  pais: string;
  representanteLegal: string;
}

const REJECTION_REASONS: RejectionReason[] = [
  { code: 'documento_ilegible', label: 'Documento ilegible', description: 'La foto del documento está borrosa, con reflejos o le falta información. Vuelve a intentarlo con buena luz.' },
  { code: 'rostro_no_coincide', label: 'El rostro no coincide', description: 'La selfie no coincide con la foto del documento. Asegúrate de que tu rostro esté bien iluminado y centrado.' },
  { code: 'documento_vencido', label: 'Documento vencido', description: 'El documento que cargaste ya no es válido. Usa un documento de identidad vigente.' },
  { code: 'datos_inconsistentes', label: 'Datos inconsistentes', description: 'La información que ingresaste no coincide con la del documento.' },
];

const PAISES = ['Colombia', 'México', 'Argentina', 'Chile', 'Ecuador'];
const TIPOS_DOCUMENTO = ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte'];

@Component({
  selector: 'app-sumsub-verification-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiModalComponent, DropiStepsComponent, DropiAlertComponent],
  templateUrl: './sumsub-verification-modal.component.html',
  styleUrls: ['./sumsub-verification-modal.component.scss'],
})
export class SumsubVerificationModalComponent implements OnChanges {
  @Input() visible = false;
  @Input({ required: true }) config!: SumsubModalConfig;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<SumsubResult>();
  @Output() cancelled = new EventEmitter<void>();

  private http = inject(HttpClient);

  readonly fase = signal<ModalPhase>('warning');
  readonly procesando = signal(false);
  readonly simularRechazo = signal(false);
  readonly motivoRechazo = signal<RejectionReason | null>(null);

  readonly paises = PAISES;
  readonly tiposDocumento = TIPOS_DOCUMENTO;

  paisSeleccionado = '';
  tipoDocumentoSeleccionado = '';

  natural: DatosPersonaNatural = this.emptyNatural();

  kybBusqueda = '';
  kybResultados: KybCompany[] = [];
  kybBuscando = false;
  kybSeleccionada: KybCompany | null = null;
  kybRepNombre = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.resetState();
    }
  }

  get header(): string {
    return this.config?.para === 'dueno' ? 'Verificación de identidad — Dueño de cuenta' : 'Verificación de identidad — Responsable tributario';
  }

  get esJuridica(): boolean {
    return this.config?.tipoPersona === 'juridica';
  }

  get steps(): DropiStepItem[] {
    const labels = this.esJuridica
      ? ['Inicio', 'Empresa', 'Representante', 'Verificación']
      : ['Inicio', 'Documento', 'Captura', 'Verificación'];
    const bucket = this.faseBucket();
    return labels.map((label, i) => ({
      label,
      state: i < bucket ? 'completed' : i === bucket ? 'focus' : 'pending',
    }));
  }

  private faseBucket(): number {
    const f = this.fase();
    if (f === 'warning' || f === 'welcome' || f === 'instructions') return 0;
    if (f === 'kyb-empresa' || f === 'document') return 1;
    if (f === 'kyb-rep' || f === 'capture-front' || f === 'capture-back') return 2;
    if (f === 'selfie' || f === 'processing') return 3;
    return 4;
  }

  // --- Navegación entre fases ---
  irA(fase: ModalPhase): void {
    this.fase.set(fase);
  }

  comenzar(): void {
    this.fase.set('welcome');
  }

  continuarWelcome(): void {
    if (!this.paisSeleccionado) return;
    this.fase.set('instructions');
  }

  continuarInstructions(): void {
    this.fase.set(this.esJuridica ? 'kyb-empresa' : 'document');
  }

  // --- Rama persona natural ---
  continuarDocumento(): void {
    if (!this.tipoDocumentoSeleccionado) return;
    this.natural.tipoDocumento = this.tipoDocumentoSeleccionado;
    this.natural.nacionalidad = this.paisSeleccionado;
    this.fase.set('capture-front');
  }

  simularCapturaFrontal(): void {
    this.fase.set('capture-back');
  }

  simularCapturaTrasera(): void {
    this.fase.set('selfie');
  }

  confirmarDatosYSelfie(): void {
    if (!this.natural.primerNombre || !this.natural.primerApellido || !this.natural.numeroDocumento || !this.natural.email) return;
    this.iniciarProcesamiento();
  }

  // --- Rama persona jurídica (KYB) ---
  buscarEmpresa(): void {
    const nombre = this.kybBusqueda.trim();
    if (!nombre) return;
    this.kybBuscando = true;
    this.kybResultados = [];
    this.http
      .get<KybCompany[]>('/api/sumsub/kyb-search', { params: { nombre, pais: this.paisSeleccionado } })
      .subscribe({
        next: (res) => {
          this.kybResultados = res;
          this.kybBuscando = false;
        },
        error: () => {
          this.kybBuscando = false;
        },
      });
  }

  seleccionarEmpresa(empresa: KybCompany): void {
    this.kybSeleccionada = empresa;
    this.kybRepNombre = empresa.representanteLegal;
    this.fase.set('kyb-rep');
  }

  confirmarRepresentanteYSelfie(): void {
    if (!this.kybSeleccionada) return;
    this.iniciarProcesamiento();
  }

  // --- Procesamiento y resultado ---
  private iniciarProcesamiento(): void {
    this.fase.set('processing');
    this.procesando.set(true);
    this.http.post<{ sessionToken: string; applicantId: string }>('/api/sumsub/session', {}).subscribe((res) => {
      setTimeout(() => this.resolverResultado(res.applicantId), 1400);
    });
  }

  private resolverResultado(applicantId: string): void {
    this.procesando.set(false);
    if (this.simularRechazo()) {
      const motivo = REJECTION_REASONS[Math.floor(Math.random() * REJECTION_REASONS.length)];
      this.motivoRechazo.set(motivo);
      this.fase.set('rechazo');
      return;
    }

    const tipoPersona = this.config.tipoPersona;
    if (tipoPersona === 'juridica' && this.kybSeleccionada) {
      const datos: DatosPersonaJuridica = {
        razonSocial: this.kybSeleccionada.razonSocial,
        nit: this.kybSeleccionada.nit,
        representante: { ...this.emptyNatural(), primerNombre: this.kybRepNombre, nacionalidad: this.paisSeleccionado },
      };
      this.fase.set('success');
      this.success.emit({ applicantId, tipoPersona, datos });
    } else {
      const datos: DatosPersonaNatural = { ...this.natural };
      this.fase.set('success');
      this.success.emit({ applicantId, tipoPersona: 'natural', datos });
    }
  }

  reintentar(): void {
    this.motivoRechazo.set(null);
    this.fase.set(this.esJuridica ? 'kyb-empresa' : 'document');
  }

  cerrarTrasExito(): void {
    this.close();
  }

  cerrarModal(): void {
    if (this.fase() === 'processing') return;
    this.close();
    this.cancelled.emit();
  }

  private close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  private resetState(): void {
    this.fase.set('warning');
    this.procesando.set(false);
    this.motivoRechazo.set(null);
    this.simularRechazo.set(false);
    this.paisSeleccionado = this.config?.paisSugerido ?? '';
    this.tipoDocumentoSeleccionado = '';
    this.natural = this.emptyNatural();
    this.kybBusqueda = '';
    this.kybResultados = [];
    this.kybSeleccionada = null;
    this.kybRepNombre = '';
  }

  private emptyNatural(): DatosPersonaNatural {
    return {
      primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
      fechaNacimiento: '', nacionalidad: '', tipoDocumento: '', numeroDocumento: '',
      email: '', telefono: '', direccion: '',
    };
  }
}

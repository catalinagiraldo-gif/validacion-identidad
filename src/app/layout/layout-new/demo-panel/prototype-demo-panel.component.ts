import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IdentityDemoStateService,
  FASES,
  FaseUsuario,
  ResultadoModal,
} from '../../../common/services/identity-demo-state.service';
import { PaisPersona } from '../../../common/models/identity-flow.models';

type PaisCode = 'CO' | 'MX' | 'AR' | 'CL' | 'EC';

const PAIS_NATURAL_MAP: Record<PaisCode, PaisPersona> = {
  CO: 'co-natural',
  MX: 'mx-natural',
  AR: 'ar-natural',
  CL: 'cl',
  EC: 'ec',
};

const PAIS_JURIDICA_MAP: Record<PaisCode, PaisPersona> = {
  CO: 'co-juridica',
  MX: 'mx-juridica',
  AR: 'ar-juridica',
  CL: 'cl',
  EC: 'ec',
};

@Component({
  selector: 'app-prototype-demo-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prototype-demo-panel.component.html',
  styleUrls: ['./prototype-demo-panel.component.scss'],
})
export class PrototypeDemoPanelComponent {
  private stateSvc = inject(IdentityDemoStateService);

  collapsed = signal(false);

  readonly fases = FASES;

  readonly currentFase    = this.stateSvc.fase;
  readonly currentStatus  = this.stateSvc.status;
  readonly currentPais    = this.stateSvc.pais;
  readonly currentTipo    = this.stateSvc.tipoPersona;
  readonly primeraOrden   = this.stateSvc.primeraOrdenEntregada;
  readonly resultadoModal = this.stateSvc.resultadoModal;

  readonly statusOptions: Array<{ value: ResultadoModal; label: string }> = [
    { value: 'aprobado',    label: 'Aprobado' },
    { value: 'en_revision', label: 'En revisión' },
    { value: 'rechazado',   label: 'Rechazado' },
  ];

  readonly paisOptions: PaisCode[] = ['CO', 'MX', 'AR', 'CL', 'EC'];

  readonly identityStatusLabel = computed(() => {
    const map: Record<string, string> = {
      sin_validar: 'Sin iniciar',
      pendiente:   'Pendiente',
      en_revision: 'En revisión',
      rechazado:   'Rechazado',
      aprobado:    'Aprobado',
    };
    return map[this.currentStatus()] ?? this.currentStatus();
  });

  readonly statusClass = computed(() => {
    const s = this.currentStatus();
    if (s === 'aprobado')    return 'status--approved';
    if (s === 'en_revision') return 'status--review';
    if (s === 'rechazado')   return 'status--rejected';
    return 'status--none';
  });

  setFase(fase: FaseUsuario): void {
    this.stateSvc.setFase(fase);
  }

  setIdentidadStatus(resultado: ResultadoModal): void {
    this.stateSvc.setResultadoModal(resultado);
    if (resultado === 'aprobado') {
      this.stateSvc.setStatus('aprobado');
    } else if (resultado === 'en_revision') {
      this.stateSvc.setStatus('en_revision');
    } else {
      this.stateSvc.setStatus('rechazado');
    }
  }

  setPais(pais: PaisCode): void {
    const tipo = this.currentTipo();
    const pp = tipo === 'juridica' ? PAIS_JURIDICA_MAP[pais] : PAIS_NATURAL_MAP[pais];
    this.stateSvc.setPaisPersona(pp);
  }

  setTipo(tipo: 'natural' | 'juridica'): void {
    const pais = this.currentPais();
    const pp = tipo === 'juridica' ? PAIS_JURIDICA_MAP[pais] : PAIS_NATURAL_MAP[pais];
    this.stateSvc.setPaisPersona(pp);
  }

  toggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}

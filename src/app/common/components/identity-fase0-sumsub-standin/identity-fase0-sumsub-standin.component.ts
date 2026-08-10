import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityFase0Service } from '../../services/identity-fase0.service';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { IdentityFase0BackstageDotComponent } from '../identity-fase0-backstage-dot/identity-fase0-backstage-dot.component';
import { Fase0SumsubBloque, FASE0_BLOQUE_LABELS, NOMBRE_PAIS_COMPLETO } from '../../models/identity-flow-v2.models';

// "Salir de Dropi" del Service Blueprint Fase 0 (Etapa 0.5 → flecha "Ir a
// Etapa 1" del diagrama = salir a Sumsub). Plan2.md: un leave-SPA real no es
// posible en el prototipo, así que este full-screen hace de "stand-in" —
// simula estar fuera de Dropi y deja elegir cómo vuelve el usuario (blueprint
// Etapa Continua: Incompleta / Pendiente-Financiero / Aprobado / Rechazado).
// Los botones de resultado son controles de DEMO, nunca UI real de Sumsub.

interface StandinPaso {
  titulo: string;
  detalle: string;
}

const PASO_TYC: StandinPaso = {
  titulo: 'Aceptación de Términos y Condiciones',
  detalle: 'Antes de continuar, Sumsub pide aceptar TyC y Política de Privacidad de Dropi',
};

const PASOS_POR_BLOQUE_NATURAL: Record<Fase0SumsubBloque, StandinPaso[]> = {
  A: [
    PASO_TYC,
    { titulo: 'Prueba de vida (selfie)', detalle: 'Liveness check' },
    { titulo: 'Documento de identidad', detalle: 'Frente y reverso' },
    { titulo: 'Datos fiscales', detalle: 'Formulario largo' },
  ],
  B: [
    PASO_TYC,
    { titulo: 'Prueba de vida (selfie)', detalle: 'Liveness check' },
    { titulo: 'Documento de identidad', detalle: 'Frente y reverso' },
  ],
  C: [
    PASO_TYC,
    { titulo: 'Identidad → Truora', detalle: 'Fuera de este enlace — ya vigente en Datos personales de Dropi' },
    { titulo: 'Facturación → Sumsub', detalle: 'Datos fiscales + documento' },
  ],
  D: [
    PASO_TYC,
    { titulo: 'Soporte te comparte el enlace', detalle: 'WhatsApp o Intercom, sin pop-up de UserPilot' },
  ],
  E: [
    PASO_TYC,
    { titulo: 'Enlace enviado al teléfono del tercero', detalle: '"Continuar en el teléfono"' },
    { titulo: 'El tercero hace su prueba de vida', detalle: 'Biometría del tercero, no la tuya' },
  ],
};

const PASOS_POR_BLOQUE_JURIDICA: Record<Fase0SumsubBloque, StandinPaso[]> = {
  A: [
    PASO_TYC,
    { titulo: 'Prueba de vida del representante legal', detalle: 'Liveness check' },
    { titulo: 'Búsqueda de la empresa', detalle: 'Autocompleta por nombre — Regla de Cero Fricción' },
    { titulo: 'Datos fiscales', detalle: 'Formulario largo' },
  ],
  B: [
    PASO_TYC,
    { titulo: 'Prueba de vida del representante legal', detalle: 'Liveness check' },
    { titulo: 'Documento de la empresa', detalle: 'Sin autocompletado' },
  ],
  C: [
    PASO_TYC,
    { titulo: 'Identidad → Truora', detalle: 'Representante legal, fuera de este enlace' },
    { titulo: 'KYB/facturación → Sumsub', detalle: 'Cédula + razón social + NIT + RUT + cámara de comercio' },
  ],
  D: PASOS_POR_BLOQUE_NATURAL.D,
  E: PASOS_POR_BLOQUE_NATURAL.E,
};

@Component({
  selector: 'app-identity-fase0-sumsub-standin',
  standalone: true,
  imports: [CommonModule, IdentityFase0BackstageDotComponent],
  templateUrl: './identity-fase0-sumsub-standin.component.html',
  styleUrls: ['./identity-fase0-sumsub-standin.component.scss'],
})
export class IdentityFase0SumsubStandinComponent {
  readonly fase0 = inject(IdentityFase0Service);
  private readonly stateV2 = inject(IdentityDemoStateV2Service);

  readonly bloque = this.fase0.sumsubBloque;
  readonly bloqueLabel = computed(() => FASE0_BLOQUE_LABELS[this.bloque()]);
  readonly paisLabel = computed(() => NOMBRE_PAIS_COMPLETO[this.stateV2.pais()]);

  readonly pasos = computed<StandinPaso[]>(() => {
    const tipo = this.stateV2.tipoPersona();
    const tabla = tipo === 'juridica' ? PASOS_POR_BLOQUE_JURIDICA : PASOS_POR_BLOQUE_NATURAL;
    return tabla[this.bloque()];
  });

  readonly backstageNota = computed(() => {
    const tyc =
      'Durante este flujo fuera de Dropi, Sumsub pide aceptar los Términos y Condiciones y la Política de Privacidad de Dropi antes de continuar (ya no van en el modal interceptor de UserPilot cuando el usuario llega desde el panel/banner pedagógico). ';
    const b = this.bloque();
    if (b === 'C') {
      return (
        tyc +
        'Colombia: KYC/identidad va por Truora desde Datos personales (no este enlace). Facturación (natural o jurídica) va por Sumsub. UserPilot muestra alertas separadas para completar la validación de facturación/KYB.'
      );
    }
    if (b === 'D') {
      return (
        tyc +
        'Marca blanca: enlace de Sumsub sin branding de Dropi. Soporte/Comercial es responsable de enviarlo durante la atención — no hay pop-up automático de UserPilot para este caso.'
      );
    }
    return (
      tyc +
      'La pregunta "Persona Natural / Empresa" ya no vive en UserPilot — Sumsub la resuelve dentro de su propio formulario (Back stage → DOC ENLACES).'
    );
  });

  /** Botón "Dejar incompleto (salir)" — igual que cerrar el stand-in sin terminar. */
  dejarIncompleto(): void {
    this.fase0.resolverSumsub('incompleta');
  }

  enviarARevision(): void {
    this.fase0.resolverSumsub('revision-financiero');
  }

  simularAprobacion(): void {
    this.fase0.resolverSumsub('aprobado');
  }

  simularRechazo(): void {
    this.fase0.resolverSumsub('rechazado');
  }
}

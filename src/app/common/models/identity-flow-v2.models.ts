// Identity flow v2 — additive types for Plan2.md (docs/validacion/Plan2.md), Parte 1.
// This file NEVER modifies identity-flow.models.ts — it is consumed only by /new/*
// pages and by identity-demo-state-v2.service.ts. /old/* pages keep using the
// original IdentityDemoStateService + identity-flow.models.ts untouched.

import type { IdentitySatelliteStatus } from './identity-flow.models';

export type { IdentitySatelliteStatus };

// ---------------------------------------------------------------------------
// Hallazgo 1 (Plan2.md líneas 65-83): 3 tipos de persona por país, no 2.
// ---------------------------------------------------------------------------
export type TipoPersonaV2 = 'natural' | 'juridica' | 'extranjera';

// ---------------------------------------------------------------------------
// 9 países del Excel "Copia de Información Datos de Facturación LATAM.xlsx"
// (Plan2.md líneas 61-113).
// ---------------------------------------------------------------------------
export type Pais9 = 'CO' | 'MX' | 'AR' | 'PE' | 'GT' | 'CR' | 'EC' | 'CL' | 'PY';

export const PAISES_9: Pais9[] = ['CO', 'MX', 'AR', 'PE', 'GT', 'CR', 'EC', 'CL', 'PY'];

// ---------------------------------------------------------------------------
// Fase de entrega del proyecto (rollout acumulativo — Historia.md) vs.
// Momento del usuario / Etapa del journey PLG (StartUser.md).
// Ejes ortogonales pero acumulativos — ver "Cómo leer las Fases" (líneas 25-42)
// y Matriz maestra (líneas 251-267).
// ---------------------------------------------------------------------------
export type FaseProyecto = 'fase0' | 'fase1' | 'fase2' | 'fase3' | 'fase4' | 'fase5';

export const FASES_PROYECTO: FaseProyecto[] = ['fase0', 'fase1', 'fase2', 'fase3', 'fase4', 'fase5'];

export type MomentoUsuario = 'setup' | 'activacion' | 'habito' | 'profesional' | 'legacy';

export const MOMENTOS_USUARIO: MomentoUsuario[] = ['setup', 'activacion', 'habito', 'profesional', 'legacy'];

export type SegmentoUsuario =
  | 'dropshipper-natural'
  | 'proveedor-juridica'
  | 'baneado-cross-country'
  | 'migrado-legacy';

export const SEGMENTOS_USUARIO: SegmentoUsuario[] = [
  'dropshipper-natural',
  'proveedor-juridica',
  'baneado-cross-country',
  'migrado-legacy',
];

// ---------------------------------------------------------------------------
// Mecanismo vigente por celda Fase × Etapa. Nunca 'n/a' — toda combinación
// tiene un mecanismo vigente, nativo de esta Fase o heredado de una anterior
// (Plan2.md línea 265: "Ninguna celda es N/A").
// ---------------------------------------------------------------------------
export type MecanismoTipo = 'nativo' | 'heredado';

export interface MecanismoVigente {
  tipo: MecanismoTipo;
  descripcion: string;
}

/** Matriz maestra (Plan2.md líneas 255-262), transcrita celda por celda. */
export const MECANISMO_MATRIZ: Record<FaseProyecto, Record<MomentoUsuario, MecanismoVigente>> = {
  fase0: {
    setup: { tipo: 'nativo', descripcion: 'Regla de Validación Nula, cero campos (permanente)' },
    activacion: { tipo: 'nativo', descripcion: 'Soft touchpoint tras 1ra venta (0-A)' },
    habito: { tipo: 'nativo', descripcion: 'Gestión manual — Backoffice (WhatsApp/Intercom, sin SLA)' },
    profesional: { tipo: 'nativo', descripcion: 'KYB ad-hoc — "proveedores exclusivos" validados caso por caso' },
    legacy: { tipo: 'nativo', descripcion: 'Segmentación por riesgo/volumen + campaña "Semana de la seguridad" (0-B)' },
  },
  fase1: {
    setup: { tipo: 'heredado', descripcion: 'Regla de Validación Nula sin cambios; se agrega cruce de correo contra lista negra global (1-A)' },
    activacion: { tipo: 'heredado', descripcion: 'Sigue solo el soft touchpoint de Fase 0' },
    habito: { tipo: 'heredado', descripcion: 'Sigue 100% manual vía Backoffice; se suma cruce si hay reincidencia cross-country' },
    profesional: { tipo: 'heredado', descripcion: 'Sigue el KYB ad-hoc; cruce relevante para operadores cross-border reincidentes' },
    legacy: { tipo: 'heredado', descripcion: 'Sigue la segmentación/campaña; cruce aplica igual a legacy migrando de país' },
  },
  fase2: {
    setup: { tipo: 'heredado', descripcion: 'Regla de Validación Nula sin cambios (permanente)' },
    activacion: { tipo: 'nativo', descripcion: 'Formulario unificado (2-B/2-C) en el Aha Moment — solo CO-natural; el resto sigue con soft touchpoint' },
    habito: { tipo: 'nativo', descripcion: 'Hard gate con Truora (2-A) — solo CO-natural; el resto sigue 100% manual' },
    profesional: { tipo: 'heredado', descripcion: 'Fase 2 es exclusiva de CO-natural, no toca jurídicas ni cross-border — sigue el KYB ad-hoc' },
    legacy: { tipo: 'heredado', descripcion: 'Sigue la segmentación/campaña; legacy CO-natural que se active usa el formulario unificado' },
  },
  fase3: {
    setup: { tipo: 'heredado', descripcion: 'Sin cambios (permanente)' },
    activacion: { tipo: 'heredado', descripcion: 'Sin cambios frente a Fase 2: CO-natural con Truora, resto con soft touchpoint' },
    habito: { tipo: 'nativo', descripcion: 'Hard gate con WebSDK completo de Sumsub (3-A a 3-F) para todo el resto (≠ CO-natural); CO-natural sigue con Truora' },
    profesional: { tipo: 'nativo', descripcion: 'KYB fricción cero + RN-20 + RN-23 + ruteo dual RN-03 + KYT en USDT (3-G a 3-J)' },
    legacy: { tipo: 'heredado', descripcion: 'Sigue la segmentación/campaña; legacy que se activa ya usa Truora/Sumsub, sin migración masiva sistemática' },
  },
  fase4: {
    setup: { tipo: 'heredado', descripcion: 'Sin cambios (permanente)' },
    activacion: { tipo: 'heredado', descripcion: 'Sin cambios frente a Fase 3' },
    habito: { tipo: 'heredado', descripcion: 'Sin cambios frente a Fase 3' },
    profesional: { tipo: 'heredado', descripcion: 'Sin cambios frente a Fase 3' },
    legacy: { tipo: 'nativo', descripcion: 'Migración masiva sistemática ZIP Truora→Sumsub, ventanas pedagógicas por cohorte (4-A), gate de webhook "Caso Ecuador" (4-B)' },
  },
  fase5: {
    setup: { tipo: 'heredado', descripcion: 'Sin cambios (permanente)' },
    activacion: { tipo: 'heredado', descripcion: 'Sin cambios (recién se valida por primera vez, no aplica edición)' },
    habito: { tipo: 'nativo', descripcion: 'Bloqueo de 6 meses del Dueño de cuenta (RN-11, 5-A)' },
    profesional: { tipo: 'nativo', descripcion: 'Re-validación inteligente por campo sensible/no sensible (RN-14/15, 5-B)' },
    legacy: { tipo: 'nativo', descripcion: 'Monitoreo periódico por score de riesgo (RN-10, 5-C) para recién migrados en Fase 4' },
  },
};

// ---------------------------------------------------------------------------
// Motor de validación — depende de Fase + país + tipo de persona
// (Fase 2: Truora solo CO-natural; Fase 3+: Sumsub para el resto).
// ---------------------------------------------------------------------------
export type MotorValidacion = 'truora' | 'sumsub' | 'manual-backoffice' | 'ninguno';

// ---------------------------------------------------------------------------
// RN-23: si el KYB falla, el estado queda pj_pendiente — nunca se degrada
// al usuario a persona natural, y no se pierden los datos ya ingresados.
// ---------------------------------------------------------------------------
export type EstadoKyb = 'no_iniciado' | 'en_progreso' | 'aprobado' | 'pj_pendiente' | 'rechazado';

// ---------------------------------------------------------------------------
// Hallazgo 3 (Plan2.md líneas 89-97): reglas de comportamiento del
// formulario fiscal, iguales para los 9 países.
// ---------------------------------------------------------------------------
export interface PaisBillingConfig {
  pais: Pais9;
  /** Etiqueta exacta de "Persona Natural/Física" para este país (Hallazgo 1). */
  nombrePersonaNatural: string;
  nombrePersonaJuridica: string;
  /** null cuando el Excel no define la categoría — ver Hallazgo 2 (solo Paraguay). */
  nombrePersonaExtranjera: string | null;
  documentoPrincipal: string;
  regimenFiscalOpciones: string[];
  documentosASubir: string[];
  /** Nota explícita de gap real en la fuente (Excel), si aplica. */
  gapEnFuente?: string;
}

/**
 * Tabla resumen por país, solo Persona Natural/Física (Plan2.md tabla líneas 99-113).
 * El detalle completo de las 3 personas × 9 países vive en el Excel original —
 * esta transcripción es la referencia rápida que consume el prototipo.
 */
export const PAIS_BILLING_FIELDS: Record<Pais9, PaisBillingConfig> = {
  CO: {
    pais: 'CO',
    nombrePersonaNatural: 'Persona Natural',
    nombrePersonaJuridica: 'Persona Jurídica',
    nombrePersonaExtranjera: 'Persona Extranjera',
    documentoPrincipal: 'CC / NIT',
    regimenFiscalOpciones: ['Régimen Ordinario', 'Simple (RST)', 'No responsable de IVA'],
    documentosASubir: ['Cédula', 'RUT actualizado'],
  },
  MX: {
    pais: 'MX',
    nombrePersonaNatural: 'Persona Física',
    nombrePersonaJuridica: 'Persona Moral',
    nombrePersonaExtranjera: 'Persona Extranjera',
    documentoPrincipal: 'CSF (Constancia de Situación Fiscal)',
    regimenFiscalOpciones: ['Actividad empresarial', 'Física Resico', 'Sueldos y salarios'],
    documentosASubir: ['Constancia de Situación Fiscal'],
  },
  AR: {
    pais: 'AR',
    nombrePersonaNatural: 'Persona Física',
    nombrePersonaJuridica: 'Persona Jurídica',
    nombrePersonaExtranjera: 'Persona Extranjera',
    documentoPrincipal: 'CUIT / CUIL / DNI',
    regimenFiscalOpciones: ['Monotributista', 'Responsable Inscripto', 'Exento'],
    documentosASubir: ['Constancia de Inscripción ARCA', 'DNI'],
  },
  PE: {
    pais: 'PE',
    nombrePersonaNatural: 'Persona Natural',
    nombrePersonaJuridica: 'Persona Jurídica',
    nombrePersonaExtranjera: 'Persona Extranjera',
    documentoPrincipal: 'DNI / RUC Persona Natural',
    regimenFiscalOpciones: ['NRUS', 'RER/MYPE Tributario', 'Régimen General'],
    documentosASubir: ['Ficha RUC (SUNAT)', 'DNI'],
  },
  GT: {
    pais: 'GT',
    nombrePersonaNatural: 'Persona Individual',
    nombrePersonaJuridica: 'Persona Jurídica',
    nombrePersonaExtranjera: 'Persona Extranjera',
    documentoPrincipal: 'NIT / DPI',
    regimenFiscalOpciones: ['Pequeño Contribuyente', 'Régimen Opcional Simplificado', 'Régimen General'],
    documentosASubir: ['Constancia de RTU', 'DPI'],
  },
  CR: {
    pais: 'CR',
    nombrePersonaNatural: 'Persona Física',
    nombrePersonaJuridica: 'Persona Jurídica',
    nombrePersonaExtranjera: 'Persona Extranjera',
    documentoPrincipal: 'Cédula de Identidad Física / NITE',
    regimenFiscalOpciones: ['Régimen Simplificado', 'Régimen Tradicional'],
    documentosASubir: ['Cédula (ambos lados)'],
  },
  EC: {
    pais: 'EC',
    nombrePersonaNatural: 'Persona Natural',
    nombrePersonaJuridica: 'Persona Jurídica',
    nombrePersonaExtranjera: 'Persona Extranjera',
    documentoPrincipal: 'RUC / Cédula',
    regimenFiscalOpciones: ['Régimen RIMPE (Popular)', 'Régimen RIMPE (Emprendedor)', 'Régimen General'],
    documentosASubir: ['Cédula', 'RUC (si aplica)'],
  },
  CL: {
    pais: 'CL',
    nombrePersonaNatural: 'Persona Natural',
    nombrePersonaJuridica: 'Persona Jurídica',
    nombrePersonaExtranjera: 'Persona Extranjera',
    documentoPrincipal: 'RUN / RUT',
    regimenFiscalOpciones: ['Afecto a IVA', 'No afecto a IVA (2ª categoría)'],
    documentosASubir: ['Cédula', 'Carpeta Tributaria SII (si emite facturas)'],
  },
  PY: {
    pais: 'PY',
    nombrePersonaNatural: 'Persona Física',
    nombrePersonaJuridica: 'Persona Jurídica',
    nombrePersonaExtranjera: null,
    documentoPrincipal: 'RUC / Cédula',
    regimenFiscalOpciones: ['General'],
    documentosASubir: ['Constancia del RUC', 'Cédula (frente y dorso)'],
    gapEnFuente:
      'El Excel fuente no define "Persona Extranjera" para Paraguay ni tiene hoja propia de país (Hallazgo 2, Plan2.md líneas 85-87) — pendiente de definición por Legal/PO.',
  },
};

// ---------------------------------------------------------------------------
// Formulario de Cuenta/Facturación — bloqueado, nunca oculto (Plan2.md
// líneas 208-249). Estado → texto de banner + si hay CTA.
// ---------------------------------------------------------------------------
export interface EstadoFormularioConfig {
  bloqueado: boolean;
  banner: string;
  ctaLabel: string | null;
}

export const ESTADO_FORMULARIO_CONFIG: Record<IdentitySatelliteStatus, EstadoFormularioConfig> = {
  sin_validar: {
    bloqueado: true,
    banner: 'Verifica tu identidad para poder guardar esta información',
    ctaLabel: 'Verificar identidad',
  },
  pendiente: {
    bloqueado: true,
    banner: 'Ya empezaste tu verificación — termínala para continuar',
    ctaLabel: 'Continuar verificación',
  },
  en_revision: {
    bloqueado: true,
    banner: 'Tu verificación está en revisión, te avisamos cuando termine',
    ctaLabel: null,
  },
  rechazado: {
    bloqueado: true,
    banner: 'No pudimos validar tu identidad — vuelve a intentarlo',
    ctaLabel: 'Reintentar verificación',
  },
  aprobado: {
    bloqueado: false,
    banner: '',
    ctaLabel: null,
  },
};

// ---------------------------------------------------------------------------
// Facturación — 3 vías (Plan2.md líneas 806-813).
// ---------------------------------------------------------------------------
export type ViaFacturacion = 'mis-datos' | 'otra-persona-natural' | 'persona-juridica';

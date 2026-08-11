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

/** Nombre completo del país — Parte D hallazgo 6: los chips/selects solo mostraban el código ISO, forzando a recordar/decodificar (viola "Recognition Rather Than Recall"). */
export const NOMBRE_PAIS_COMPLETO: Record<Pais9, string> = {
  CO: 'Colombia', MX: 'México', AR: 'Argentina', PE: 'Perú',
  GT: 'Guatemala', CR: 'Costa Rica', EC: 'Ecuador', CL: 'Chile', PY: 'Paraguay',
};

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
// Plan2.md Parte 8 — corrección de estados. Aditivo sobre IdentitySatelliteStatus
// (mismo patrón que pj_pendiente): agrega 'parcial' para usuarios antiguos que
// ya llenaron el formulario manual viejo (pre-Sumsub) pero nunca fueron
// certificados por ningún motor real. Nunca se edita IdentitySatelliteStatus
// base — las 9 páginas /old/ no lo reconocerían.
// ---------------------------------------------------------------------------
export type IdentitySatelliteStatusV2 = IdentitySatelliteStatus | 'pj_pendiente' | 'parcial';

/** Datos capturados durante el KYC del dueño de cuenta (pasos 1-5 del modal), listos para precargar "Datos de facturación" en la vía "mis-datos" (Reglasvalidacion.md §3: 1 sola validación). */
export interface DatosCapturadosKyc {
  email: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompleto: string;
}

/** Datos del formulario manual viejo (pre-Sumsub) para usuarios en estado 'parcial'. */
export interface DatosFormularioAntiguo {
  email: string;
  pais: Pais9;
  municipio: string;
  razonSocial: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

// ---------------------------------------------------------------------------
// Hallazgo 3 (Plan2.md líneas 89-97): reglas de comportamiento del
// formulario fiscal, iguales para los 9 países.
// ---------------------------------------------------------------------------
export interface PaisBillingConfig {
  documentoPrincipal: string;
  regimenFiscalOpciones: string[];
  documentosASubir: string[];
  /** Nota explícita de gap real en la fuente (Excel), si aplica. */
  gapEnFuente?: string;
}

/** Etiqueta exacta de cada categoría de persona, por país (Hallazgo 1, Plan2.md líneas 65-83). */
export interface NombresTipoPersona {
  natural: string;
  juridica: string;
  /** null cuando el Excel no define la categoría — ver Hallazgo 2 (solo Paraguay). */
  extranjera: string | null;
}

export const NOMBRE_TIPO_PERSONA: Record<Pais9, NombresTipoPersona> = {
  CO: { natural: 'Persona Natural', juridica: 'Persona Jurídica', extranjera: 'Persona Extranjera' },
  MX: { natural: 'Persona Física', juridica: 'Persona Moral', extranjera: 'Persona Extranjera' },
  AR: { natural: 'Persona Física', juridica: 'Persona Jurídica', extranjera: 'Persona Extranjera' },
  PE: { natural: 'Persona Natural', juridica: 'Persona Jurídica', extranjera: 'Persona Extranjera' },
  GT: { natural: 'Persona Individual', juridica: 'Persona Jurídica', extranjera: 'Persona Extranjera' },
  CR: { natural: 'Persona Física', juridica: 'Persona Jurídica', extranjera: 'Persona Extranjera' },
  EC: { natural: 'Persona Natural', juridica: 'Persona Jurídica', extranjera: 'Persona Extranjera' },
  CL: { natural: 'Persona Natural', juridica: 'Persona Jurídica', extranjera: 'Persona Extranjera' },
  PY: { natural: 'Persona Física', juridica: 'Persona Jurídica', extranjera: null },
};

/**
 * Tabla completa por país × tipo de persona (9 × 3 = 27 celdas, Hallazgo 1 y
 * Hallazgo 3, Plan2.md líneas 65-113). `null` únicamente en `PY.extranjera`
 * porque el Excel fuente no define esa categoría ni tiene hoja propia de país
 * (Hallazgo 2, líneas 85-87) — pendiente de definición por Legal/PO, no se
 * inventa. El detalle exacto celda por celda sigue viviendo en el Excel
 * original; esta transcripción es la referencia rápida que consume el
 * prototipo.
 */
export const PAIS_BILLING_FIELDS: Record<Pais9, Record<TipoPersonaV2, PaisBillingConfig | null>> = {
  CO: {
    natural: {
      documentoPrincipal: 'CC / NIT',
      regimenFiscalOpciones: ['Régimen Ordinario', 'Simple (RST)', 'No responsable de IVA'],
      documentosASubir: ['Cédula', 'RUT actualizado'],
    },
    juridica: {
      documentoPrincipal: 'NIT',
      regimenFiscalOpciones: ['Régimen Ordinario', 'Simple (RST)'],
      documentosASubir: ['Cámara de Comercio (vigencia < 30 días)', 'RUT actualizado'],
    },
    extranjera: {
      documentoPrincipal: 'Pasaporte / Cédula de Extranjería',
      regimenFiscalOpciones: ['No domiciliado'],
      documentosASubir: ['Pasaporte', 'Cédula de Extranjería (si aplica)'],
    },
  },
  MX: {
    natural: {
      documentoPrincipal: 'CSF (Constancia de Situación Fiscal)',
      regimenFiscalOpciones: ['Actividad empresarial', 'Física Resico', 'Sueldos y salarios'],
      documentosASubir: ['Constancia de Situación Fiscal'],
    },
    juridica: {
      documentoPrincipal: 'RFC Persona Moral',
      regimenFiscalOpciones: ['Régimen General de Ley Personas Morales', 'Resico Personas Morales'],
      documentosASubir: ['Constancia de Situación Fiscal', 'Acta Constitutiva'],
    },
    extranjera: {
      documentoPrincipal: 'Tax ID / Pasaporte',
      regimenFiscalOpciones: ['No residente'],
      documentosASubir: ['Pasaporte', 'Comprobante de domicilio en el extranjero'],
    },
  },
  AR: {
    natural: {
      documentoPrincipal: 'CUIT / CUIL / DNI',
      regimenFiscalOpciones: ['Monotributista', 'Responsable Inscripto', 'Exento'],
      documentosASubir: ['Constancia de Inscripción ARCA', 'DNI'],
    },
    juridica: {
      documentoPrincipal: 'CUIT',
      regimenFiscalOpciones: ['Responsable Inscripto', 'Exento'],
      documentosASubir: ['Constancia de Inscripción ARCA', 'Estatuto social'],
    },
    extranjera: {
      documentoPrincipal: 'Pasaporte / CDI (Clave de Identificación)',
      regimenFiscalOpciones: ['No residente'],
      documentosASubir: ['Pasaporte'],
    },
  },
  PE: {
    natural: {
      documentoPrincipal: 'DNI / RUC Persona Natural',
      regimenFiscalOpciones: ['NRUS', 'RER/MYPE Tributario', 'Régimen General'],
      documentosASubir: ['Ficha RUC (SUNAT)', 'DNI'],
    },
    juridica: {
      documentoPrincipal: 'RUC Persona Jurídica',
      regimenFiscalOpciones: ['RER/MYPE Tributario', 'Régimen General'],
      documentosASubir: ['Ficha RUC (SUNAT)', 'Vigencia de poder del representante'],
    },
    extranjera: {
      documentoPrincipal: 'Carné de Extranjería / Pasaporte',
      regimenFiscalOpciones: ['No domiciliado'],
      documentosASubir: ['Pasaporte'],
    },
  },
  GT: {
    natural: {
      documentoPrincipal: 'NIT / DPI',
      regimenFiscalOpciones: ['Pequeño Contribuyente', 'Régimen Opcional Simplificado', 'Régimen General'],
      documentosASubir: ['Constancia de RTU', 'DPI'],
    },
    juridica: {
      documentoPrincipal: 'NIT de la empresa',
      regimenFiscalOpciones: ['Régimen Opcional Simplificado', 'Régimen General'],
      documentosASubir: ['Patente de Comercio', 'Constancia de RTU'],
    },
    extranjera: {
      documentoPrincipal: 'Pasaporte',
      regimenFiscalOpciones: ['No domiciliado'],
      documentosASubir: ['Pasaporte'],
    },
  },
  CR: {
    natural: {
      documentoPrincipal: 'Cédula de Identidad Física / NITE',
      regimenFiscalOpciones: ['Régimen Simplificado', 'Régimen Tradicional'],
      documentosASubir: ['Cédula (ambos lados)'],
    },
    juridica: {
      documentoPrincipal: 'Cédula Jurídica',
      regimenFiscalOpciones: ['Régimen Tradicional'],
      documentosASubir: ['Personería Jurídica', 'Cédula Jurídica'],
    },
    extranjera: {
      documentoPrincipal: 'DIMEX / Pasaporte',
      regimenFiscalOpciones: ['No domiciliado'],
      documentosASubir: ['Pasaporte'],
    },
  },
  EC: {
    natural: {
      documentoPrincipal: 'RUC / Cédula',
      regimenFiscalOpciones: ['Régimen RIMPE (Popular)', 'Régimen RIMPE (Emprendedor)', 'Régimen General'],
      documentosASubir: ['Cédula', 'RUC (si aplica)'],
    },
    juridica: {
      documentoPrincipal: 'RUC Sociedades',
      regimenFiscalOpciones: ['Régimen RIMPE (Emprendedor)', 'Régimen General'],
      documentosASubir: ['RUC Sociedades', 'Nombramiento del representante legal'],
    },
    extranjera: {
      documentoPrincipal: 'Pasaporte',
      regimenFiscalOpciones: ['No domiciliado'],
      documentosASubir: ['Pasaporte'],
    },
  },
  CL: {
    natural: {
      documentoPrincipal: 'RUN / RUT',
      regimenFiscalOpciones: ['Afecto a IVA', 'No afecto a IVA (2ª categoría)'],
      documentosASubir: ['Cédula', 'Carpeta Tributaria SII (si emite facturas)'],
    },
    juridica: {
      documentoPrincipal: 'RUT de la empresa',
      regimenFiscalOpciones: ['Afecto a IVA (1ª categoría)', 'Renta presunta'],
      documentosASubir: ['Carpeta Tributaria SII', 'Escritura de constitución'],
    },
    extranjera: {
      documentoPrincipal: 'Pasaporte / RUT provisorio',
      regimenFiscalOpciones: ['No domiciliado'],
      documentosASubir: ['Pasaporte'],
    },
  },
  PY: {
    natural: {
      documentoPrincipal: 'RUC / Cédula',
      regimenFiscalOpciones: ['General'],
      documentosASubir: ['Constancia del RUC', 'Cédula (frente y dorso)'],
    },
    juridica: {
      documentoPrincipal: 'RUC de la empresa',
      regimenFiscalOpciones: ['General'],
      documentosASubir: ['Constancia del RUC', 'Estatuto social'],
    },
    extranjera: null,
  },
};

/**
 * Hallazgo 3, Plan2.md líneas 89-97 (hojas "Flujo Condicional"/"Campos del
 * Formulario"): reglas de comportamiento del formulario, idénticas para los
 * 9 países — no varían por país, es una sola tabla.
 */
export interface ReglaFormularioFiscal {
  codigo: string;
  descripcion: string;
}

export const PAIS_FORM_BEHAVIOR: ReglaFormularioFiscal[] = [
  { codigo: 'C-01', descripcion: 'Cascada País → Localidad: al elegir país, el campo de localidad (municipio/provincia/cantón/comuna) se habilita y muestra solo las opciones de ese país.' },
  { codigo: 'C-02', descripcion: 'Tipo de persona desbloquea el resto: Régimen fiscal, Tipo de documento y "Documentos a subir" quedan deshabilitados hasta elegir Natural/Jurídica/Extranjera.' },
  { codigo: 'C-05', descripcion: 'Régimen fiscal es un selector dependiente del país — las opciones cambian completamente según el país elegido.' },
  { codigo: 'C-06', descripcion: 'Tipo de documento deshabilita el campo de número hasta que se elige un tipo.' },
  { codigo: 'C-07', descripcion: 'El número de documento se limpia automáticamente (quita guiones, puntos y espacios) antes de validar el formato.' },
  { codigo: 'C-08', descripcion: 'Checkbox de términos y condiciones obligatorio para habilitar "Guardar/Continuar".' },
  { codigo: 'C-09', descripcion: 'Checkbox de tratamiento de datos obligatorio, junto con C-08, para habilitar "Guardar/Continuar" — además de todos los campos válidos.' },
];

// ---------------------------------------------------------------------------
// Formulario de Cuenta/Facturación — bloqueado, nunca oculto (Plan2.md
// líneas 208-249). Estado → texto de banner + si hay CTA.
// ---------------------------------------------------------------------------
export interface EstadoFormularioConfig {
  bloqueado: boolean;
  banner: string;
  ctaLabel: string | null;
}

export const ESTADO_FORMULARIO_CONFIG: Record<IdentitySatelliteStatusV2, EstadoFormularioConfig> = {
  sin_validar: {
    bloqueado: true,
    banner: 'Verifica tu identidad para poder guardar esta información',
    ctaLabel: 'Verificar identidad',
  },
  parcial: {
    bloqueado: true,
    banner: 'Detectamos datos guardados antes de nuestro nuevo proceso de verificación — confírmalos verificando tu identidad',
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
  pj_pendiente: {
    bloqueado: true,
    banner: 'No pudimos validar tu empresa — tus datos quedaron guardados, puedes reintentar',
    ctaLabel: 'Reintentar validación',
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

// ---------------------------------------------------------------------------
// Fase 0 — Service Blueprint Fase 0 (docs/validacion/Service_Blueprint_Diagrama Fase 0.md).
// Tipos aditivos para el flujo NO-CODE de Fase 0 (Panel Lateral / Interceptor /
// Bloqueo / Etapa Continua / CRM). No modifican los tipos existentes.
// ---------------------------------------------------------------------------

/** Motivo de un estado "pendiente" en Etapa Continua (blueprint: dos motivos distintos). */
export type MotivoPendiente = 'revision-financiero' | 'incompleta' | null;

/** Los 4 modales de resultado de Etapa Continua (blueprint). */
export type Fase0ResultKind = 'aprobado' | 'revision-financiero' | 'incompleta' | 'rechazado';

/**
 * Los mensajes CRM (burbuja WhatsApp) simulados en Fase 0 (blueprint): los 4
 * de siempre (recordatorio Etapa 0 + los 3 seguimientos de Etapa Continua) más
 * 'marca-blanca' (Bloque D: Soporte envía el enlace a mano, sin UserPilot).
 */
export type Fase0CrmKind = 'recordatorio' | 'aprobado' | 'revision-financiero' | 'incompleta' | 'marca-blanca';

// ---------------------------------------------------------------------------
// Modo Prototipo 0 — recorrido guiado del Service Blueprint Fase 0 completo
// (Panel Lateral → Interceptor → Sumsub → Etapa Continua → CRM), separado del
// Modo Prototipo 2 (Fases 1/2/3/4/5, gates/motores nativos). Ver
// `docs/validacion/Service_Blueprint_Diagrama Fase 0.md`.
// ---------------------------------------------------------------------------

/** Etapa activa del recorrido guiado (stepper del demo-panel en Modo Prototipo 0). Solo estado de UI/demo, no persiste entre sesiones. */
export type Fase0Etapa = 'pre' | 'etapa0' | 'etapa05' | 'en-sumsub' | 'continua' | 'bloqueado';

export const FASE0_ETAPAS: Fase0Etapa[] = ['pre', 'etapa0', 'etapa05', 'en-sumsub', 'continua', 'bloqueado'];

export const FASE0_ETAPA_LABELS: Record<Fase0Etapa, string> = {
  pre: 'PRE — Setup',
  etapa0: 'Etapa 0 — Onboarding suave',
  etapa05: 'Etapa 0.5 — Interceptor',
  'en-sumsub': 'En Sumsub (fuera de Dropi)',
  continua: 'Etapa Continua — Resultado',
  bloqueado: 'Etapa 1 — Bloqueo',
};

/** Nota de backstage (Back stage del blueprint) por etapa, para las bolitas "!" del prototipo — nunca copy de usuario. */
export const FASE0_ETAPA_BACKSTAGE: Record<Fase0Etapa, string> = {
  pre: 'Setup manual: Google Sheets + campañas UserPilot. Arranque real del MVP: Guatemala, Panamá, Paraguay y Perú primero — el resto (MX, VE, CR, Europa) se solicita a Sumsub en el setup pero entra de forma gradual. Se regula el volumen para que Legal/Financiero puedan auditar a mano.',
  etapa0: 'Segmentación visual en UserPilot por historial de actividad para aislar a los Activos sin verificar. Sin incentivo monetario aquí — el bono de "Semana de la Seguridad" (fletes, masterclasses, Kit Dropi) es exclusivo de Activos-Riesgo en Etapa 0.5+.',
  etapa05: 'DOC ENLACES A-E: el bloque de formulario depende del país (y de si es marca blanca). El pop-up es ineludible — UserPilot no permite cerrarlo hasta que Sumsub confirme, y el copy no varía entre reapariciones (evita apariencia de manipulación). Robusto ante AdBlockers.',
  'en-sumsub': 'La pregunta "Persona Natural / Empresa" ya no vive en UserPilot — Sumsub la hace dentro de su propio formulario. Salir de Dropi es real: no hay vuelta atrás hasta que Sumsub confirme o el usuario abandone (Incompleto).',
  continua: 'Legal descarga los estados desde el backoffice de Sumsub, actualiza a mano un Google Sheet, Admin apaga el pop-up de los Aprobados y CRM notifica. SLA operativo: 48–72 horas hábiles tras la aprobación real — el prototipo puede lucir "atrasado" a propósito.',
  bloqueado: 'Cartera corre un script en Python que cruza saldo negativo/fraude por país (y correo + DNI para baneos multipaís) y lanza campañas focalizadas en UserPilot. No es un freeze de saldo por código — es UserPilot interceptando la pantalla hasta que Legal/Financiero resuelvan.',
};

/**
 * Progreso real del usuario en Sumsub (Etapa Continua del blueprint). Se
 * deriva siempre de `IdentityDemoStateV2Service.status` + `motivoPendiente` —
 * nunca es una segunda fuente de verdad independiente. 'nunca' significa que
 * no existe caso en Sumsub todavía (blueprint: "nunca no es lo mismo que
 * Pendiente en el Sheet").
 */
export type Fase0ProgresoSumsub = 'nunca' | 'incompleta' | 'pendiente-financiero' | 'aprobado' | 'rechazado';

export const FASE0_PROGRESO_LABELS: Record<Fase0ProgresoSumsub, string> = {
  nunca: 'Nunca inició Sumsub',
  incompleta: 'Incompleta en Sumsub',
  'pendiente-financiero': 'Completa — esperando Financiero',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

/** Bloque de formulario Sumsub según país/canal (blueprint Etapa 0.5, Back stage → DOC ENLACES A-E). */
export type Fase0SumsubBloque = 'A' | 'B' | 'C' | 'D' | 'E';

export const FASE0_BLOQUE_LABELS: Record<Fase0SumsubBloque, string> = {
  A: 'Bloque A — Formulario largo (liveness + documento + datos fiscales)',
  B: 'Bloque B — Formulario corto (liveness + documento, sin datos fiscales)',
  C: 'Bloque C — Colombia (KYC Truora + facturación Sumsub)',
  D: 'Bloque D — Marca blanca (enlace manual de Soporte, sin UserPilot)',
  E: 'Bloque E — Facturación a un tercero (link enviado al teléfono del tercero)',
};

/** Bloque A del blueprint: países con formulario largo (liveness + documento + datos fiscales) — MVP real GT/PY/PE, resto gradual. */
const FASE0_BLOQUE_A_PAISES: Pais9[] = ['GT', 'PY', 'PE', 'MX', 'CR'];
/** Bloque B del blueprint: países con formulario corto (liveness + documento, sin datos fiscales). */
const FASE0_BLOQUE_B_PAISES: Pais9[] = ['CL', 'EC', 'AR'];

/**
 * Determina el bloque Sumsub vigente según país + marca blanca (blueprint
 * Etapa 0.5, Back stage → DOC ENLACES). Colombia siempre es Bloque C sin
 * importar el tipo de persona (KYC Truora + facturación Sumsub, natural y
 * jurídica). Marca blanca siempre gana — esos usuarios no ven UserPilot.
 */
export function resolverBloqueSumsub(pais: Pais9, marcaBlanca: boolean): Fase0SumsubBloque {
  if (marcaBlanca) return 'D';
  if (pais === 'CO') return 'C';
  if (FASE0_BLOQUE_B_PAISES.includes(pais)) return 'B';
  // Resto cae en Bloque A (arranque real GT/PY/PE; MX/CR entran gradual, misma UI de formulario largo).
  return 'A';
}

// ---------------------------------------------------------------------------
// Log de eventos — hace visible "cada interacción que hay en el blueprint" en
// tiempo real (por qué: en Etapa 0.5/Continua muchas cosas pasan detrás sin
// feedback en pantalla — recordatorios, redirecciones, actualizaciones de
// Sheet — y el stakeholder no las nota). Usa el mismo código de color del
// diagrama original (Service_Blueprint_Diagrama Fase 0.md líneas 19-20).
// ---------------------------------------------------------------------------

/** Carril del blueprint que originó el evento — mismo color-coding del diagrama original. */
export type Fase0EventoTag = 'backstage' | 'userpilot' | 'redirect' | 'crm';

export const FASE0_EVENTO_TAG_ICON: Record<Fase0EventoTag, string> = {
  backstage: '🟣',
  userpilot: '🔵',
  redirect: '🔴',
  crm: '🟢',
};

export const FASE0_EVENTO_TAG_LABEL: Record<Fase0EventoTag, string> = {
  backstage: 'Back stage',
  userpilot: 'UserPilot',
  redirect: 'Redirección',
  crm: 'CRM',
};

export interface Fase0Evento {
  id: number;
  tag: Fase0EventoTag;
  texto: string;
  ts: number;
}

// ---------------------------------------------------------------------------
// Nuevos vs Activos — este eje ya NO es exclusivo de Fase 0: desde la sesión
// 260811-bf9 también gobierna el panel de ganancias de Home en Fase 1-5. Lo
// que cambia entre tracks es el VOCABULARIO, no el eje:
// - Fase 0 (columnas ETAPA 0 / ETAPA 0.5 del blueprint): "activo" = tiene
//   historial en Dropi → ve el Panel Lateral en Home. El Modal Interceptor de
//   Etapa 0.5 trata a Nuevos y Activos IGUAL ante un clic financiero ("el
//   disparador es la acción, no la antigüedad").
// - Fase 1-5 (`Service_Blueprint_Diagrama_Fase_5.md`, diamante "¿Ya es
//   activo?"): "activo" = 20+ órdenes (valor de trabajo confirmado,
//   REUCONTI.md) → ve el panel de ganancias en la esquina inferior derecha
//   del Home. Distinto de `MomentoUsuario` (Setup/Activación/Hábito/...),
//   que es otro eje de Fase 1-5 (Plan2.md).
// Por eso hay dos tablas de etiquetas — mismo `Fase0TipoUsuario`/misma señal
// compartida, texto distinto según `faseProyecto()` (ver
// `prototype-demo-panel.component.ts`, `fase0TipoUsuarioLabel()`).
// ---------------------------------------------------------------------------
export type Fase0TipoUsuario = 'nuevo' | 'activo';

export const FASE0_TIPO_USUARIO_LABELS: Record<Fase0TipoUsuario, string> = {
  nuevo: 'Nuevo (Etapa 0.5)',
  activo: 'Activo (Etapa 0)',
};

export const FASE15_TIPO_USUARIO_LABELS: Record<Fase0TipoUsuario, string> = {
  nuevo: 'Nuevo',
  activo: 'Activo (20+ órdenes)',
};

/** Motivo del bloqueo full-screen de Etapa 1 — mismo componente, dos copys reales del blueprint. */
export type Fase0BlockMotivo = 'fraude' | 'rechazado';

// ---------------------------------------------------------------------------
// Taxonomía de 12 motivos de rechazo, portada de
// pages/old/flujo-identidad/flujo-identidad.component.ts (rejectionReasonsList)
// sin tocar el archivo original — Parte D hallazgo 2: el modal v2 mostraba
// siempre el mismo texto fijo ("foto borrosa") sin importar la causa real.
// ---------------------------------------------------------------------------
export type RejectionReasonCode =
  | 'DOCUMENT_BLURRY'
  | 'FACE_NOT_VISIBLE'
  | 'DOCUMENT_EXPIRED'
  | 'DOCUMENT_COPY'
  | 'FACE_COVERED'
  | 'SELFIE_MISMATCH'
  | 'DOCUMENT_NOT_READABLE'
  | 'LIGHTING_ISSUE'
  | 'DOCUMENT_FRONT_MISSING'
  | 'DOCUMENT_BACK_MISSING'
  | 'MULTIPLE_FACES'
  | 'DOCUMENT_INVALID';

export interface RejectionReasonCopy {
  label: string;
  description: string;
}

export const REJECTION_REASON_COPY: Record<RejectionReasonCode, RejectionReasonCopy> = {
  DOCUMENT_BLURRY:        { label: 'Documento borroso',           description: 'La imagen del documento no es legible. Ubícate en un lugar bien iluminado y sin reflejos.' },
  FACE_NOT_VISIBLE:       { label: 'Rostro no visible',           description: 'Tu rostro no aparece claramente en la selfie o está cubierto parcialmente.' },
  DOCUMENT_EXPIRED:       { label: 'Documento vencido',           description: 'El documento que usaste ya no está vigente. Solo aceptamos documentos en vigencia.' },
  DOCUMENT_COPY:          { label: 'No se aceptan copias',        description: 'Solo documentos originales. No fotocopias ni capturas de pantalla del documento.' },
  FACE_COVERED:           { label: 'Rostro cubierto',             description: 'Retira gafas de sol, gorras o cualquier elemento que cubra tu cara.' },
  SELFIE_MISMATCH:        { label: 'Selfie no coincide',          description: 'La selfie no corresponde a la persona en el documento de identidad.' },
  DOCUMENT_NOT_READABLE:  { label: 'Datos ilegibles',             description: 'La información en el documento no se puede leer con claridad. Revisa la resolución de la foto.' },
  LIGHTING_ISSUE:         { label: 'Mala iluminación',            description: 'Ubícate donde haya luz directa, sin sombras sobre el documento o tu rostro.' },
  DOCUMENT_FRONT_MISSING: { label: 'Falta cara frontal',          description: 'No se cargó la parte delantera del documento.' },
  DOCUMENT_BACK_MISSING:  { label: 'Falta reverso del documento', description: 'No se cargó el reverso del documento.' },
  MULTIPLE_FACES:         { label: 'Más de un rostro',            description: 'En la selfie solo debe aparecer la persona que se está validando.' },
  DOCUMENT_INVALID:       { label: 'Tipo de documento inválido',  description: 'El tipo de documento seleccionado no es válido para tu país de residencia.' },
};

export const REJECTION_REASON_CODES: RejectionReasonCode[] = [
  'DOCUMENT_BLURRY', 'FACE_NOT_VISIBLE', 'DOCUMENT_EXPIRED', 'DOCUMENT_COPY',
  'FACE_COVERED', 'SELFIE_MISMATCH', 'DOCUMENT_NOT_READABLE', 'LIGHTING_ISSUE',
  'DOCUMENT_FRONT_MISSING', 'DOCUMENT_BACK_MISSING', 'MULTIPLE_FACES', 'DOCUMENT_INVALID',
];

// ---------------------------------------------------------------------------
// Mock de un tercero — persona natural distinta al dueño de cuenta, para la
// vía "otra-persona-natural" (Plan2.md líneas 806-813, tabla de vistas #11).
// ---------------------------------------------------------------------------
export interface MockThirdPartyPersona {
  nombreCompleto: string;
  email: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export const MOCK_THIRD_PARTY_PERSONS: MockThirdPartyPersona[] = [
  { nombreCompleto: 'Andrés Felipe Gómez', email: 'andres.gomez@email.com', telefono: '3115557788', tipoDocumento: 'CC', numeroDocumento: '1098765432' },
  { nombreCompleto: 'Camila Restrepo Vélez', email: 'camila.restrepo@email.com', telefono: '3227784411', tipoDocumento: 'CC', numeroDocumento: '1076543210' },
];

// ---------------------------------------------------------------------------
// Extensión por composición de MockUserData (identity-flow.models.ts) — nunca
// se edita la interfaz original, que /old/* sigue consumiendo sin estos
// campos (Hallazgo de auditoría, Plan2.md líneas 1358-1374).
// ---------------------------------------------------------------------------
export interface RepresentanteLegalMock {
  nombreCompleto: string;
  yaValidadoEnDropi: boolean;
}

export interface MockUserDataV2 {
  /** RN-11: fecha de la última validación aprobada, para el bloqueo de 6 meses del Dueño de cuenta. */
  lastValidatedAt: Date | null;
  /** RN-10: score de riesgo asignado en la primera validación — 'medio' dispara monitoreo periódico. */
  riskScore: 'bajo' | 'medio' | 'alto';
  /** RN-20: representante legal declarado en el KYB, si aplica. */
  representanteLegal?: RepresentanteLegalMock;
}

/** Representantes legales mock por empresa (EMPRESAS_MOCK_V2 en el modal), para RN-20 realista (Parte D hallazgo 3). */
export const REPRESENTANTES_LEGALES_MOCK: Record<string, RepresentanteLegalMock> = {
  'TechStore SAS': { nombreCompleto: 'Juan Pérez Rodríguez', yaValidadoEnDropi: true },
  'Distribuidora Sur SAS': { nombreCompleto: 'María Fernanda Ocampo', yaValidadoEnDropi: false },
  'Comercial Norte Ltda.': { nombreCompleto: 'Carlos Andrés Ríos', yaValidadoEnDropi: true },
  'Comercial MX SA de CV': { nombreCompleto: 'Ana Lucía Torres', yaValidadoEnDropi: false },
  'Distribuidora Bajío SA': { nombreCompleto: 'Roberto Salinas Cruz', yaValidadoEnDropi: true },
  'Tech Solutions SAPI': { nombreCompleto: 'Diego Hernández Paz', yaValidadoEnDropi: false },
};

/** Representante legal por defecto cuando la empresa buscada no tiene un mock específico (resto de países/empresas). */
export const REPRESENTANTE_LEGAL_DEFAULT: RepresentanteLegalMock = { nombreCompleto: 'Representante legal', yaValidadoEnDropi: false };

// Shared identity flow types, mock data, and billing helpers (old + new prototypes)

export type OrigenValidacion = 'configuraciones' | 'retiro' | 'dropicard';
export type UserType = 'nuevo-sin-datos' | 'antiguo-completo' | 'antiguo-campos-nuevos' | 'cross-country';
export type IdentitySatelliteStatus = 'sin_validar' | 'pendiente' | 'en_revision' | 'rechazado' | 'aprobado';

export type EstadoId =
  | 'inicial'
  | 'guardado-sin-comenzar'
  | 'incompleta'
  | 'en-revision'
  | 'aprobada'
  | 'recien-aprobada'
  | 'aprobado-bloqueado'
  | 'aprobado-listo-editar'
  | 'rechazada-espera'
  | 'rechazada-reintentar'
  | 'baneada'
  | 'email-baneado';

export type PaisPersona =
  | 'co-natural'
  | 'co-juridica'
  | 'mx-natural'
  | 'mx-juridica'
  | 'ar-natural'
  | 'ar-juridica'
  | 'cl'
  | 'ec';

export type Pais = 'CO' | 'MX' | 'AR' | 'CL' | 'EC';
export type TipoPersona = 'natural' | 'juridica';

export interface SelectorOption<T> {
  id: T;
  label: string;
  color: 'neutral' | 'success' | 'warning' | 'error';
}

export interface FormNucleo {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  nacionalidad: string;
  tipoPersona: TipoPersona;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  emailFacturacion: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  razonSocial: string;
}

export interface FormFiscal {
  co_tipoRegimen: string;
  co_tipoResponsabilidad: string;
  co_impuesto: string;
  actividadEconomica: string;
  codigoActividadEconomica: string;
  mx_codigoPostal: string;
  mx_regimenFiscal: string;
  mx_sujetoImpuestos: boolean;
  ar_condicionIVA: string;
  ar_provincia: string;
}

export interface MockUserData {
  billingId: string;
  pais: Pais;
  tipoPersona: TipoPersona;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  nacionalidad: string;
  tipoDocumento: string;
  numeroDocumento: string;
  digitoVerificacion?: string;
  razonSocial: string;
  email: string;
  emailFacturacion: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  co_tipoRegimen: string;
  co_tipoResponsabilidad: string;
  co_impuesto: string;
  actividadEconomica: string;
  codigoActividadEconomica: string;
  mx_codigoPostal: string;
  mx_regimenFiscal: string;
  mx_sujetoImpuestos: boolean;
  ar_condicionIVA: string;
  ar_provincia: string;
  camposNuevos: string[];
  paisAnterior: Pais;
}

export interface SumsubCustomizationConfig {
  skipWarning: boolean;
  skipWelcome: boolean;
  skipInstructions: boolean;
  hideProgressBar: boolean;
  hideWidgetBorder: boolean;
  forceMobile: boolean;
}

export const DEFAULT_SUMSUB_CUSTOMIZATION: SumsubCustomizationConfig = {
  skipWarning: false,
  skipWelcome: false,
  skipInstructions: false,
  hideProgressBar: false,
  hideWidgetBorder: false,
  forceMobile: false,
};

export const ACTIVIDAD_ECONOMICA_OPTIONS = [
  { label: 'Comercio al por menor por internet', codigo: '4791' },
  { label: 'Comercio al por menor de productos diversos', codigo: '4799' },
  { label: 'Comercio al por mayor de productos diversos', codigo: '4690' },
  { label: 'Comercio al por menor de prendas de vestir', codigo: '4771' },
  { label: 'Comercio al por menor de productos cosméticos', codigo: '4772' },
  { label: 'Actividades de intermediación comercial', codigo: '4610' },
];

export const MOCK_USERS: Record<PaisPersona, MockUserData> = {
  'co-natural': {
    billingId: 'FID-CO-NAT-001',
    pais: 'CO', tipoPersona: 'natural',
    primerNombre: 'Laura', segundoNombre: 'Isabel',
    primerApellido: 'Martínez', segundoApellido: 'Suárez',
    fechaNacimiento: '1992-04-15', nacionalidad: 'Colombiana',
    tipoDocumento: 'Cédula de ciudadanía', numeroDocumento: '1023456789',
    razonSocial: '',
    email: 'laura.martinez@gmail.com', emailFacturacion: 'facturacion.laura@gmail.com',
    telefono: '3001234567',
    direccion: 'Calle 45 # 32-10, Apto 502', ciudad: 'Bogotá', departamento: 'Cundinamarca',
    co_tipoRegimen: 'Simplificado', co_tipoResponsabilidad: 'No responsable de IVA', co_impuesto: '',
    actividadEconomica: 'Comercio al por menor por internet', codigoActividadEconomica: '4791',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: ['co_impuesto'],
    paisAnterior: 'MX',
  },
  'co-juridica': {
    billingId: 'FID-CO-JUR-002',
    pais: 'CO', tipoPersona: 'juridica',
    primerNombre: 'Carlos', segundoNombre: 'Andrés',
    primerApellido: 'Gómez', segundoApellido: 'Ríos',
    fechaNacimiento: '1985-07-22', nacionalidad: 'Colombiana',
    tipoDocumento: 'NIT', numeroDocumento: '901234567', digitoVerificacion: '3',
    razonSocial: 'TechStore SAS',
    email: 'admin@techstore.co', emailFacturacion: 'contabilidad@techstore.co',
    telefono: '3114567890',
    direccion: 'Carrera 7 # 71-21, Piso 3', ciudad: 'Bogotá', departamento: 'Cundinamarca',
    co_tipoRegimen: 'Común', co_tipoResponsabilidad: 'Agente retenedor IVA', co_impuesto: 'IVA',
    actividadEconomica: 'Comercio al por menor por internet', codigoActividadEconomica: '4791',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: ['co_tipoResponsabilidad'],
    paisAnterior: 'EC',
  },
  'mx-natural': {
    billingId: 'FID-MX-NAT-003',
    pais: 'MX', tipoPersona: 'natural',
    primerNombre: 'Sofía', segundoNombre: 'Valentina',
    primerApellido: 'Hernández', segundoApellido: 'Torres',
    fechaNacimiento: '1995-11-03', nacionalidad: 'Mexicana',
    tipoDocumento: 'INE', numeroDocumento: 'HETS951103MDFRRN09',
    razonSocial: '',
    email: 'sofia.hernandez@gmail.com', emailFacturacion: 'sofia.hernandez@gmail.com',
    telefono: '5512345678',
    direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle', ciudad: 'Ciudad de México', departamento: 'CDMX',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    actividadEconomica: '', codigoActividadEconomica: '',
    mx_codigoPostal: '03100', mx_regimenFiscal: 'Régimen simplificado de confianza', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: ['mx_codigoPostal'],
    paisAnterior: 'CO',
  },
  'mx-juridica': {
    billingId: 'FID-MX-JUR-004',
    pais: 'MX', tipoPersona: 'juridica',
    primerNombre: 'Miguel', segundoNombre: 'Ángel',
    primerApellido: 'López', segundoApellido: 'Mendoza',
    fechaNacimiento: '1980-03-15', nacionalidad: 'Mexicana',
    tipoDocumento: 'RFC', numeroDocumento: 'LOMM800315HDF',
    razonSocial: 'Inversiones XYZ SA de CV',
    email: 'miguel.lopez@inversionesxyz.mx', emailFacturacion: 'facturacion@inversionesxyz.mx',
    telefono: '3398765432',
    direccion: 'Blvd. Manuel Ávila Camacho 88', ciudad: 'Ciudad de México', departamento: 'CDMX',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    actividadEconomica: '', codigoActividadEconomica: '',
    mx_codigoPostal: '11000', mx_regimenFiscal: 'General de ley personas morales', mx_sujetoImpuestos: true,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: ['mx_regimenFiscal'],
    paisAnterior: 'AR',
  },
  'ar-natural': {
    billingId: 'FID-AR-NAT-005',
    pais: 'AR', tipoPersona: 'natural',
    primerNombre: 'Nicolás', segundoNombre: 'Rodrigo',
    primerApellido: 'Fernández', segundoApellido: 'Díaz',
    fechaNacimiento: '1990-08-28', nacionalidad: 'Argentina',
    tipoDocumento: 'DNI', numeroDocumento: '32456789',
    razonSocial: '',
    email: 'nico.fernandez@hotmail.com', emailFacturacion: 'nico.fernandez@hotmail.com',
    telefono: '1134567890',
    direccion: 'Av. Corrientes 1234, Piso 2', ciudad: 'Buenos Aires', departamento: 'Buenos Aires',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    actividadEconomica: '', codigoActividadEconomica: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: 'Responsable Monotributo', ar_provincia: 'Buenos Aires',
    camposNuevos: ['ar_provincia'],
    paisAnterior: 'CL',
  },
  'ar-juridica': {
    billingId: 'FID-AR-JUR-006',
    pais: 'AR', tipoPersona: 'juridica',
    primerNombre: 'María', segundoNombre: 'José',
    primerApellido: 'Rodríguez', segundoApellido: 'Pereyra',
    fechaNacimiento: '1978-12-05', nacionalidad: 'Argentina',
    tipoDocumento: 'CUIT', numeroDocumento: '30712345678',
    razonSocial: 'E-Commerce Argentina SRL',
    email: 'mrodriguez@ecommerce-ar.com', emailFacturacion: 'facturacion@ecommerce-ar.com',
    telefono: '1156789012',
    direccion: 'Calle Florida 234, Piso 5', ciudad: 'Buenos Aires', departamento: 'CABA',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    actividadEconomica: '', codigoActividadEconomica: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: 'IVA Responsable Inscripto', ar_provincia: 'CABA',
    camposNuevos: ['ar_condicionIVA'],
    paisAnterior: 'EC',
  },
  cl: {
    billingId: 'FID-CL-NAT-007',
    pais: 'CL', tipoPersona: 'natural',
    primerNombre: 'Javiera', segundoNombre: 'Alejandra',
    primerApellido: 'Pino', segundoApellido: 'Araya',
    fechaNacimiento: '1993-02-14', nacionalidad: 'Chilena',
    tipoDocumento: 'RUT', numeroDocumento: '18234567-K',
    razonSocial: '',
    email: 'javiera.pino@gmail.com', emailFacturacion: 'javiera.pino@gmail.com',
    telefono: '987654321',
    direccion: 'Av. Providencia 2345, Depto 104', ciudad: 'Santiago', departamento: 'Región Metropolitana',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    actividadEconomica: '', codigoActividadEconomica: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: [],
    paisAnterior: 'CO',
  },
  ec: {
    billingId: 'FID-EC-NAT-008',
    pais: 'EC', tipoPersona: 'natural',
    primerNombre: 'Andrés', segundoNombre: 'Felipe',
    primerApellido: 'Vega', segundoApellido: 'Castillo',
    fechaNacimiento: '1997-06-19', nacionalidad: 'Ecuatoriana',
    tipoDocumento: 'Cédula', numeroDocumento: '1705345678',
    razonSocial: '',
    email: 'andres.vega@gmail.com', emailFacturacion: 'andres.vega@gmail.com',
    telefono: '991234567',
    direccion: 'Av. 6 de Diciembre N25-12 y Foch, Of. 301', ciudad: 'Quito', departamento: 'Pichincha',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    actividadEconomica: '', codigoActividadEconomica: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: [],
    paisAnterior: 'MX',
  },
};

export const PAIS_PERSONA_TO_BILLING_ID: Record<PaisPersona, string> = Object.fromEntries(
  Object.entries(MOCK_USERS).map(([k, v]) => [k, v.billingId])
) as Record<PaisPersona, string>;

export function emptyFormNucleo(): FormNucleo {
  return {
    primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
    fechaNacimiento: '', nacionalidad: '', tipoPersona: 'natural',
    tipoDocumento: '', numeroDocumento: '', email: '', emailFacturacion: '',
    telefono: '', direccion: '', ciudad: '', departamento: '', razonSocial: '',
  };
}

export function emptyFormFiscal(): FormFiscal {
  return {
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    actividadEconomica: '', codigoActividadEconomica: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
  };
}

export function mapEstadoToSatelliteStatus(estado: EstadoId): IdentitySatelliteStatus {
  switch (estado) {
    case 'inicial':
    case 'guardado-sin-comenzar':
      return 'sin_validar';
    case 'incompleta':
      return 'pendiente';
    case 'en-revision':
      return 'en_revision';
    case 'rechazada-espera':
    case 'rechazada-reintentar':
    case 'baneada':
    case 'email-baneado':
      return 'rechazado';
    case 'recien-aprobada':
    case 'aprobada':
    case 'aprobado-bloqueado':
    case 'aprobado-listo-editar':
      return 'aprobado';
    default:
      return 'sin_validar';
  }
}

export function deriveResponsableIVA(user: MockUserData | FormFiscal, pais: Pais): boolean {
  if (pais === 'CO') {
    const resp = 'co_tipoResponsabilidad' in user ? user.co_tipoResponsabilidad : '';
    return resp.includes('IVA') && !resp.includes('No responsable');
  }
  if (pais === 'MX') {
    return 'mx_sujetoImpuestos' in user ? !!user.mx_sujetoImpuestos : false;
  }
  return false;
}

export function getRegimenTributarioExport(user: MockUserData): string {
  if (user.pais === 'CO') return user.co_tipoRegimen;
  if (user.pais === 'MX') return user.mx_regimenFiscal;
  if (user.pais === 'AR') return user.ar_condicionIVA;
  return '';
}

export interface DemoScenarioPreset {
  id: string;
  label: string;
  userType: UserType;
  estado: EstadoId;
  pais: PaisPersona;
  origen: OrigenValidacion;
  vista?: string;
}

export const DEMO_SCENARIO_PRESETS: DemoScenarioPreset[] = [
  { id: 'happy-co', label: 'Happy path · CO natural', userType: 'nuevo-sin-datos', estado: 'inicial', pais: 'co-natural', origen: 'configuraciones', vista: 'v-nueva-formulario' },
  { id: 'retiro', label: 'Retiro bloqueado', userType: 'nuevo-sin-datos', estado: 'inicial', pais: 'co-natural', origen: 'retiro' },
  { id: 'revision', label: 'En revisión', userType: 'nuevo-sin-datos', estado: 'en-revision', pais: 'co-natural', origen: 'configuraciones' },
  { id: 'rechazo', label: 'Rechazo reintentable', userType: 'nuevo-sin-datos', estado: 'rechazada-reintentar', pais: 'mx-natural', origen: 'configuraciones' },
  { id: 'incompleta', label: 'Sumsub incompleta', userType: 'nuevo-sin-datos', estado: 'incompleta', pais: 'ec', origen: 'configuraciones' },
  { id: 'cross', label: 'Cross-country', userType: 'cross-country', estado: 'inicial', pais: 'co-natural', origen: 'configuraciones' },
  { id: 'campos-nuevos', label: 'Campos nuevos AR', userType: 'antiguo-campos-nuevos', estado: 'aprobada', pais: 'ar-juridica', origen: 'configuraciones' },
  { id: 'excel-proveedor', label: 'Ver Excel proveedor', userType: 'antiguo-completo', estado: 'aprobada', pais: 'co-natural', origen: 'configuraciones' },
];

export type SumsubScreenPhase =
  | 'warning'
  | 'welcome'
  | 'instructions'
  | 'kyb-empresa'
  | 'kyb-rep'
  | 'document'
  | 'capture-front'
  | 'capture-back'
  | 'selfie'
  | 'processing';

export const SUMSUB_CAPTURE_STEPS = [
  'Seleccionar documento',
  'Captura frontal',
  'Captura trasera',
  'Selfie / Verificación',
];

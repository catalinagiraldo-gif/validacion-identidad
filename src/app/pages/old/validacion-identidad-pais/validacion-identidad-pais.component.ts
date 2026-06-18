import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type Pais = 'CO' | 'MX' | 'AR' | 'CL' | 'EC';
type TipoPersona = 'natural' | 'juridica';
type Proveedor = 'Truora' | 'Sumsub';
type OrigenCampo = 'usuario' | 'registro' | 'sdk';

interface Campo {
  label: string;
  valorDemo: string;
  origen: OrigenCampo;
  seccion: 'contacto' | 'empresa' | 'fiscal';
}

interface PasoProveedor {
  numero: number;
  titulo: string;
  descripcion: string;
  soloJuridica?: boolean;
}

interface PaisConfig {
  codigo: Pais;
  nombre: string;
  bandera: string;
  formularioEditable: boolean;
  notaEdicion: string;
  proveedor: { natural: Proveedor; juridica: Proveedor };
  camposGeo: Campo[];
  camposFiscales: Campo[];
  camposEmpresaExtra: Campo[];
}

const CAMPOS_BASE_CONTACTO: Campo[] = [
  { label: 'Primer nombre', valorDemo: 'María', origen: 'sdk', seccion: 'contacto' },
  { label: 'Segundo nombre', valorDemo: 'Fernanda', origen: 'sdk', seccion: 'contacto' },
  { label: 'Primer apellido', valorDemo: 'García', origen: 'sdk', seccion: 'contacto' },
  { label: 'Segundo apellido', valorDemo: 'López', origen: 'sdk', seccion: 'contacto' },
  { label: 'Fecha de nacimiento', valorDemo: '15/03/1990', origen: 'sdk', seccion: 'contacto' },
  { label: 'Nacionalidad', valorDemo: 'Colombiana', origen: 'sdk', seccion: 'contacto' },
  { label: 'Tipo de documento', valorDemo: 'Cédula de ciudadanía', origen: 'sdk', seccion: 'contacto' },
  { label: 'Número de documento', valorDemo: '1.023.456.789', origen: 'sdk', seccion: 'contacto' },
  { label: 'Correo de contacto', valorDemo: 'maria.garcia@gmail.com', origen: 'registro', seccion: 'contacto' },
  { label: 'Número de télefono', valorDemo: '+57 312 345 6789', origen: 'registro', seccion: 'contacto' },
  { label: 'Dirección', valorDemo: 'Calle 123 # 45-67', origen: 'usuario', seccion: 'contacto' },
];

const CAMPOS_BASE_EMPRESA: Campo[] = [
  { label: 'Tipo de persona', valorDemo: 'Persona natural', origen: 'usuario', seccion: 'empresa' },
  { label: 'Nombre o razón social', valorDemo: 'María García', origen: 'sdk', seccion: 'empresa' },
  { label: 'Email para facturación', valorDemo: 'maria.garcia@gmail.com', origen: 'registro', seccion: 'empresa' },
  { label: 'Tipo de documento (empresa)', valorDemo: 'Cédula de ciudadanía', origen: 'sdk', seccion: 'empresa' },
  { label: 'Documento (empresa)', valorDemo: '1.023.456.789', origen: 'sdk', seccion: 'empresa' },
];

const PASOS_KYC: PasoProveedor[] = [
  { numero: 1, titulo: 'Seleccionar documento', descripcion: 'El usuario elige el tipo de documento (CC, DNI, Pasaporte, RUT, etc.) según su país.' },
  { numero: 2, titulo: 'Fotografiar documento', descripcion: 'Captura del documento por ambas caras. No se aceptan capturas de pantalla ni fotocopias.' },
  { numero: 3, titulo: 'Selfie con documento', descripcion: 'Foto del usuario sosteniendo su documento. Debe estar en lugar bien iluminado, sin gafas de sol.' },
  { numero: 4, titulo: 'Verificación biométrica', descripcion: 'El proveedor contrasta la selfie y el documento con las bases de datos internacionales. Tiempo: ~5 minutos.' },
];

const PASOS_KYB_EXTRA: PasoProveedor[] = [
  { numero: 5, titulo: 'Documentos de la empresa', descripcion: 'Adjunta los documentos que confirman la existencia legal de la empresa (escrituras, Cámara de Comercio, etc.).', soloJuridica: true },
  { numero: 6, titulo: 'Verificación del representante', descripcion: 'Se verifica la identidad de las personas con control sobre la empresa (KYC del representante legal).', soloJuridica: true },
];

const PAISES_CONFIG: Record<Pais, PaisConfig> = {
  CO: {
    codigo: 'CO',
    nombre: 'Colombia',
    bandera: '🇨🇴',
    formularioEditable: true,
    notaEdicion: 'En Colombia, tú llenas todos los campos directamente en Dropi antes de la verificación. Truora (persona natural) o Sumsub (persona jurídica) confirman que los datos coincidan con tu documento.',
    proveedor: { natural: 'Truora', juridica: 'Sumsub' },
    camposGeo: [
      { label: 'Municipio', valorDemo: 'Bogotá', origen: 'usuario', seccion: 'contacto' },
    ],
    camposFiscales: [
      { label: 'Tipo de régimen', valorDemo: 'Simplificado', origen: 'usuario', seccion: 'fiscal' },
      { label: 'Tipo de responsabilidad', valorDemo: 'No responsable de IVA', origen: 'usuario', seccion: 'fiscal' },
      { label: 'Impuesto', valorDemo: 'IVA', origen: 'usuario', seccion: 'fiscal' },
    ],
    camposEmpresaExtra: [],
  },
  MX: {
    codigo: 'MX',
    nombre: 'México',
    bandera: '🇲🇽',
    formularioEditable: false,
    notaEdicion: 'En México, el formulario personal está deshabilitado. Sumsub extrae los datos de tu documento mediante OCR y los pre-carga automáticamente en Dropi después de la verificación.',
    proveedor: { natural: 'Sumsub', juridica: 'Sumsub' },
    camposGeo: [
      { label: 'Ciudad', valorDemo: 'Ciudad de México', origen: 'usuario', seccion: 'contacto' },
      { label: 'Código Postal', valorDemo: '06600', origen: 'usuario', seccion: 'contacto' },
    ],
    camposFiscales: [
      { label: 'Régimen fiscal', valorDemo: 'Asalariado', origen: 'usuario', seccion: 'fiscal' },
      { label: 'Sujeto a impuestos', valorDemo: 'Sí', origen: 'usuario', seccion: 'fiscal' },
    ],
    camposEmpresaExtra: [
      { label: 'Número de documento (empresa)', valorDemo: 'GALO900101ABC', origen: 'sdk', seccion: 'empresa' },
    ],
  },
  AR: {
    codigo: 'AR',
    nombre: 'Argentina',
    bandera: '🇦🇷',
    formularioEditable: false,
    notaEdicion: 'En Argentina, el formulario personal está deshabilitado. Sumsub extrae los datos de tu documento mediante OCR y los pre-carga automáticamente en Dropi después de la verificación.',
    proveedor: { natural: 'Sumsub', juridica: 'Sumsub' },
    camposGeo: [
      { label: 'Provincia', valorDemo: 'Buenos Aires', origen: 'usuario', seccion: 'contacto' },
      { label: 'Ciudad / Localidad', valorDemo: 'Palermo', origen: 'usuario', seccion: 'contacto' },
    ],
    camposFiscales: [
      { label: 'Condición frente al IVA', valorDemo: 'Consumidor Final', origen: 'usuario', seccion: 'fiscal' },
    ],
    camposEmpresaExtra: [
      { label: 'Número de documento (empresa)', valorDemo: '20-12345678-9', origen: 'sdk', seccion: 'empresa' },
    ],
  },
  CL: {
    codigo: 'CL',
    nombre: 'Chile',
    bandera: '🇨🇱',
    formularioEditable: false,
    notaEdicion: 'En Chile, el formulario personal está deshabilitado. Sumsub extrae los datos de tu documento mediante OCR y los pre-carga automáticamente en Dropi después de la verificación.',
    proveedor: { natural: 'Sumsub', juridica: 'Sumsub' },
    camposGeo: [
      { label: 'Región', valorDemo: 'Región Metropolitana', origen: 'usuario', seccion: 'contacto' },
      { label: 'Comuna', valorDemo: 'Providencia', origen: 'usuario', seccion: 'contacto' },
    ],
    camposFiscales: [],
    camposEmpresaExtra: [],
  },
  EC: {
    codigo: 'EC',
    nombre: 'Ecuador',
    bandera: '🇪🇨',
    formularioEditable: false,
    notaEdicion: 'En Ecuador, el formulario personal está deshabilitado. Sumsub extrae los datos de tu documento mediante OCR y los pre-carga automáticamente en Dropi después de la verificación.',
    proveedor: { natural: 'Sumsub', juridica: 'Sumsub' },
    camposGeo: [
      { label: 'Ciudad', valorDemo: 'Quito', origen: 'usuario', seccion: 'contacto' },
    ],
    camposFiscales: [],
    camposEmpresaExtra: [
      { label: 'Número de documento (empresa)', valorDemo: '1234567890001', origen: 'sdk', seccion: 'empresa' },
    ],
  },
};

const ORIGEN_LABELS: Record<OrigenCampo, string> = {
  usuario: 'Tú lo llenas',
  registro: 'Del registro',
  sdk: 'Lo completa el SDK',
};

@Component({
  selector: 'app-validacion-identidad-pais',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validacion-identidad-pais.component.html',
  styleUrl: './validacion-identidad-pais.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ValidacionIdentidadPaisComponent {
  readonly paisesOrdenados: Pais[] = ['CO', 'MX', 'AR', 'CL', 'EC'];
  readonly paisesConfig = PAISES_CONFIG;

  paisActual: Pais = 'CO';
  tipoPersona: TipoPersona = 'natural';
  mostrarResultado = false;

  get config(): PaisConfig {
    return PAISES_CONFIG[this.paisActual];
  }

  get proveedor(): Proveedor {
    return this.config.proveedor[this.tipoPersona];
  }

  get camposContacto(): Campo[] {
    return [...CAMPOS_BASE_CONTACTO, ...this.config.camposGeo.filter(c => c.seccion === 'contacto')];
  }

  get camposEmpresa(): Campo[] {
    return [...CAMPOS_BASE_EMPRESA, ...this.config.camposEmpresaExtra];
  }

  get camposFiscales(): Campo[] {
    return this.config.camposFiscales;
  }

  get pasosProveedor(): PasoProveedor[] {
    return this.tipoPersona === 'juridica'
      ? [...PASOS_KYC, ...PASOS_KYB_EXTRA]
      : PASOS_KYC;
  }

  get camposAutocompletados(): Campo[] {
    if (this.config.formularioEditable) return [];
    const todos = [...this.camposContacto, ...this.camposEmpresa];
    return todos.filter(c => c.origen === 'sdk');
  }

  // En Colombia, el usuario llena lo que en otros países hace el SDK
  origenEfectivo(campo: Campo): OrigenCampo {
    if (this.config.formularioEditable && campo.origen === 'sdk') return 'usuario';
    return campo.origen;
  }

  origenLabel(campo: Campo): string {
    return ORIGEN_LABELS[this.origenEfectivo(campo)];
  }

  getPaisNombre(codigo: Pais): string {
    return PAISES_CONFIG[codigo].nombre;
  }

  getPaisBandera(codigo: Pais): string {
    return PAISES_CONFIG[codigo].bandera;
  }

  cambiarPais(pais: Pais): void {
    this.paisActual = pais;
    this.mostrarResultado = false;
  }

  verResultado(): void {
    this.mostrarResultado = true;
    setTimeout(() => {
      document.querySelector('.resultado-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  resetear(): void {
    this.mostrarResultado = false;
  }
}

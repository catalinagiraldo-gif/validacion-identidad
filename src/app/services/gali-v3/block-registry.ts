export type BlockId =
  | 'starter-tour'
  | 'pedidos'
  | 'integraciones'
  | 'landings'
  | 'cartera'
  | 'productos'
  | 'novedades'
  | 'memoria'
  | 'misiones'
  | 'metricas'
  | 'proyecto-activo'
  | 'vigilante-logistico'
  | 'rentabilidad';

export type BlockSize = '1x1' | '2x1' | '2x2' | '3x1' | '3x2' | 'full';

export interface BlockManifest {
  id: BlockId;
  label: string;
  hint: string;
  icon: string;             // glyph key, igual a los del sidebar
  sizes: BlockSize[];
  defaultSize: BlockSize;
  datasource: 'mock' | 'live' | 'local';
  niveles: Array<'aprendiz' | 'operador' | 'estratega'>;
  expandRuta?: string;
}

export const BLOCK_REGISTRY: Record<BlockId, BlockManifest> = {
  'starter-tour': {
    id: 'starter-tour',
    label: 'Tu primera semana',
    hint: 'Misiones guiadas para arrancar tu operación',
    icon: 'home',
    sizes: ['full', '3x2'],
    defaultSize: 'full',
    datasource: 'mock',
    niveles: ['aprendiz'],
  },
  pedidos: {
    id: 'pedidos',
    label: 'Pedidos del día',
    hint: 'Estado, novedades y etiquetas',
    icon: 'pedidos',
    sizes: ['2x1', '2x2', '3x2'],
    defaultSize: '3x2',
    datasource: 'live',
    niveles: ['aprendiz', 'operador', 'estratega'],
    expandRuta: '/gali-v3/pedidos',
  },
  integraciones: {
    id: 'integraciones',
    label: 'Integraciones',
    hint: 'Tiendas, anuncios y mensajería',
    icon: 'integraciones',
    sizes: ['2x1', '2x2'],
    defaultSize: '2x1',
    datasource: 'mock',
    niveles: ['aprendiz', 'operador', 'estratega'],
    expandRuta: '/gali-v3/integraciones',
  },
  landings: {
    id: 'landings',
    label: 'Mis landings',
    hint: 'Páginas de venta y conversión',
    icon: 'landings',
    sizes: ['2x1', '2x2'],
    defaultSize: '2x1',
    datasource: 'mock',
    niveles: ['operador', 'estratega'],
    expandRuta: '/gali-v3/landings',
  },
  cartera: {
    id: 'cartera',
    label: 'Cartera',
    hint: 'Saldo disponible y proyección',
    icon: 'cartera',
    sizes: ['1x1', '2x1'],
    defaultSize: '1x1',
    datasource: 'live',
    niveles: ['aprendiz', 'operador', 'estratega'],
    expandRuta: '/gali-v3/cartera',
  },
  productos: {
    id: 'productos',
    label: 'Productos sugeridos',
    hint: 'Filtrados para tu perfil',
    icon: 'catalogo',
    sizes: ['2x2', '3x2'],
    defaultSize: '2x2',
    datasource: 'live',
    niveles: ['aprendiz', 'operador', 'estratega'],
    expandRuta: '/gali-v3/catalogo',
  },
  novedades: {
    id: 'novedades',
    label: 'Novedades',
    hint: 'Críticas, en proceso y resueltas',
    icon: 'soporte',
    sizes: ['2x1', '2x2'],
    defaultSize: '2x1',
    datasource: 'mock',
    niveles: ['operador', 'estratega'],
    expandRuta: '/gali-v3/novedades',
  },
  memoria: {
    id: 'memoria',
    label: 'Gali recuerda',
    hint: 'Lo que sé de ti, editable',
    icon: 'vistas',
    sizes: ['2x2', 'full'],
    defaultSize: '2x2',
    datasource: 'local',
    niveles: ['operador', 'estratega'],
  },
  misiones: {
    id: 'misiones',
    label: 'Tu misión actual',
    hint: 'Lo que Gali te sugiere ahora',
    icon: 'vistas',
    sizes: ['1x1', '2x1'],
    defaultSize: '1x1',
    datasource: 'local',
    niveles: ['aprendiz', 'operador'],
  },
  metricas: {
    id: 'metricas',
    label: 'Métricas',
    hint: 'ROAS, ventas, conversión semanal',
    icon: 'metricas',
    sizes: ['2x1', '3x1', '3x2'],
    defaultSize: '3x1',
    datasource: 'live',
    niveles: ['operador', 'estratega'],
    expandRuta: '/gali-v3/metricas',
  },
  'proyecto-activo': {
    id: 'proyecto-activo',
    label: 'Proyecto activo',
    hint: 'Producto en curso y siguiente acción',
    icon: 'proyectos',
    sizes: ['2x2', '3x2'],
    defaultSize: '2x2',
    datasource: 'local',
    niveles: ['operador', 'estratega'],
    expandRuta: '/gali-v3/proyectos',
  },
  'vigilante-logistico': {
    id: 'vigilante-logistico',
    label: 'Vigilante Logístico',
    hint: 'Novedades críticas y transportadoras',
    icon: 'soporte',
    sizes: ['2x2', '3x2', 'full'],
    defaultSize: '3x2',
    datasource: 'mock',
    niveles: ['operador', 'estratega'],
    expandRuta: '/gali-v3/dropi/pedidos',
  },
  'rentabilidad': {
    id: 'rentabilidad',
    label: 'Rentabilidad Real',
    hint: 'P&L 5 líneas · ganancia neta vs ROAS',
    icon: 'metricas',
    sizes: ['2x2', '3x2', 'full'],
    defaultSize: '3x2',
    datasource: 'mock',
    niveles: ['operador', 'estratega'],
    expandRuta: '/gali-v3/vista/rentabilidad-semana',
  },
};

export const BLOCK_IDS = Object.keys(BLOCK_REGISTRY) as BlockId[];

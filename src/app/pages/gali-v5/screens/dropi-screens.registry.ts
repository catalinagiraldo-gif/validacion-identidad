/** Dropi baseline screen configs — Figma Re-arquitectura UI Oficial */

export type DropiScreenLayout =
  | 'list'
  | 'list-orders'
  | 'list-cas'
  | 'list-logistics'
  | 'list-etiquetas'
  | 'list-descargas'
  | 'wallet'
  | 'bank-table'
  | 'account-form'
  | 'settings-form'
  | 'security-tabs'
  | 'store-config'
  | 'referidos-config'
  | 'usuarios-config'
  | 'kpi-dashboard'
  | 'academy-grid'
  | 'plans'
  | 'dropicard'
  | 'marketing-grid'
  | 'report-metrics'
  | 'orders-table'
  | 'garantias-table'
  | 'carrier-preferences'
  | 'publications-grid'
  | 'report-dashboard';

export type DropiToolbarVariant = 'default' | 'novedades' | 'bulk-export';

export interface DropiTableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  multiline?: boolean;
  type?: 'text' | 'actions' | 'checkbox';
}

export interface DropiTableRow {
  id: string;
  cells: Record<string, string | number | boolean | null | string[]>;
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export interface DropiScreenAction {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface DropiScreenConfig {
  id: string;
  figmaNode: string;
  title: string;
  breadcrumbs: string[];
  layout: DropiScreenLayout;
  toolbarVariant?: DropiToolbarVariant;
  primaryAction?: DropiScreenAction;
  secondaryAction?: DropiScreenAction;
  exportAction?: DropiScreenAction;
  bulkAction?: DropiScreenAction;
  historialAction?: DropiScreenAction;
  searchPlaceholder?: string;
  searchGuia?: boolean;
  showCheckbox?: boolean;
  columns?: DropiTableColumn[];
  getMockRows: () => DropiTableRow[];
}

// ── Seeds ────────────────────────────────────────────────────────────────────

const S = {
  cities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'],
  clients: ['Olga Camacho', 'Carlos Mendoza', 'María Fernanda López', 'Andrea Gutiérrez', 'Juan Pablo Ruiz', 'Laura Torres', 'Diego Herrera', 'Valentina Ruiz', 'Sebastián Moreno', 'Camila Ortiz', 'Fernando López', 'Isabel Navarro'],
  products: ['Collar GPS para mascotas', 'Audífonos Bluetooth Pro Max', 'Faja Colombiana Cintura Avispa', 'Reloj Inteligente Tw8 Smartwatch', 'Cámara WiFi 360°', 'Kit uñas gel premium', 'Organizador de cocina 12 pzs', 'Lámpara LED recargable', 'Mini proyector HD', 'Set skincare coreano', 'Báscula digital bluetooth', 'Mochila antirrobo USB'],
  providers: ['ADMA', 'Suppli', 'PUNTO BARATO', 'Resiland', 'Importados y más', 'Shopi Pauta'],
  statusPedido: ['PENDIENTE', 'GUÍA GENERADA', 'EN TRÁNSITO', 'ENTREGADO', 'NOVEDAD', 'CANCELADO'],
  statusNov: ['Dirección errada', 'Rechazado', 'Devuelto', 'En investigación', 'Reprogramado', 'Contactar cliente'],
  transport: ['ENVIA', 'COORDINADORA', 'INTERRAPIDISIMO', 'SERVIENTREGA', 'VELOCES', 'TCC'],
  prices: ['$ 45.900', '$ 62.500', '$ 28.990', '$ 89.000', '$ 15.750', '$ 134.500'],
  margins: ['38%', '42%', '55%', '29%', '61%', '33%'],
  stock: ['Disponible', 'Bajo stock', 'Disponible', 'Agotado', 'Disponible', 'Pre-orden'],
  dates: ['27/05/2026', '26/05/2026', '25/05/2026', '24/05/2026'],
  estados: ['Abierto', 'En proceso', 'Resuelto', 'Pendiente', 'Escalado', 'Cerrado'],
  montos: ['$ 45.900', '$ 89.000', '$ 32.500', '$ 67.200', '$ 124.000', '$ 500.000'],
};

const BADGE_VARIANTS: DropiTableRow['badgeVariant'][] = ['success', 'warning', 'error', 'info', 'neutral'];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function genRows(count: number, columns: DropiTableColumn[], seeds: Record<string, (string | number | string[])[]>, idPrefix: string, badgeKey?: string): DropiTableRow[] {
  const n = Math.min(12, Math.max(8, count));
  return Array.from({ length: n }, (_, i) => {
    const cells: Record<string, string | number | boolean | null | string[]> = {};
    for (const col of columns) {
      if (col.type === 'actions' || col.type === 'checkbox') continue;
      cells[col.key] = seeds[col.key] ? pick(seeds[col.key], i) : '—';
    }
    const row: DropiTableRow = { id: `${idPrefix}-${i + 1}`, cells };
    if (badgeKey && cells[badgeKey]) { row.badge = String(cells[badgeKey]); row.badgeVariant = pick(BADGE_VARIANTS, i); }
    return row;
  });
}

const NOVEDADES_TIENDA = [
  ['Usuario ID: 56486', 'Usuario: Maria Ossa', 'Cel Usuaruo: 31523665526', 'Email: maria@gmail.com', 'DROPSHIPPER'],
  ['Usuario ID: 48201', 'Usuario: Carlos Mendoza', 'Cel Usuaruo: 31044556677', 'Email: carlos@dropitienda.co', 'DROPSHIPPER'],
  ['Usuario ID: 39102', 'Usuario: Andrea Gutiérrez', 'Cel Usuaruo: 32099887766', 'Email: andrea@gmail.com', 'DROPSHIPPER'],
];

const NOVEDADES_DATOS = [
  ['Paola Angulo', 'Teléfono: 3205233232', 'Novedad: No se localiza dirección del destinatario', 'Transportadora: ENVIA'],
  ['Juan Pablo Ruiz', 'Teléfono: 31566778899', 'Novedad: Rechazado por el destinatario', 'Transportadora: COORDINADORA'],
  ['Laura Torres', 'Teléfono: 30011223344', 'Novedad: Devuelto en bodega origen', 'Transportadora: SERVIENTREGA'],
];

function novedadesRows(): DropiTableRow[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `novedades-${i + 1}`,
    cells: {
      num: String(1236589 + i),
      fecha: pick(['08/03/2026 6:20 pm', '07/03/2026 3:15 pm', '06/03/2026 11:40 am'], i),
      tienda: pick(NOVEDADES_TIENDA, i),
      datos: pick(NOVEDADES_DATOS, i),
    },
  }));
}

function garantiasRecoleccionesRows(): DropiTableRow[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `gar-rec-${i + 1}`,
    cells: {
      id: String(50028 + i),
      adminId: pick(['wendy.rojas@dropi.co', 'admin@dropitienda.co', 'ops@dropi.co'], i),
      garantiaId: String(301 + i),
      ordenId: String(160604 + i),
      fechaCreacion: pick(S.dates, i),
      transportadora: pick(S.transport, i),
      fechaRecoleccion: pick(S.dates, i),
      numeroOrden: String(160604 + i),
      estatusOrden: pick(S.statusPedido, i),
      numeroGuia: pick(['1123266584698', '8876543210123', '5544332211009'], i),
      estatusGuia: pick(['En tránsito', 'Entregada', 'Novedad', 'Generada'], i),
    },
  }));
}

type ListDef = {
  id: string; figma: string; title: string; bc: string[];
  cols: DropiTableColumn[]; seeds?: Record<string, (string | number | string[])[]>;
  search?: string; badge?: string; primary?: DropiScreenAction; secondary?: DropiScreenAction;
  export?: DropiScreenAction; bulk?: DropiScreenAction; historial?: DropiScreenAction;
  toolbar?: DropiToolbarVariant; checkbox?: boolean; guia?: boolean; rows?: number;
  getMockRows?: () => DropiTableRow[];
};

function toList(d: ListDef, layout: DropiScreenLayout = 'list'): DropiScreenConfig {
  return {
    id: d.id, figmaNode: d.figma, title: d.title, breadcrumbs: d.bc, layout,
    toolbarVariant: d.toolbar ?? 'default',
    columns: d.cols, searchPlaceholder: d.search,
    primaryAction: d.primary, secondaryAction: d.secondary,
    exportAction: d.export, bulkAction: d.bulk, historialAction: d.historial,
    searchGuia: d.guia, showCheckbox: d.checkbox,
    getMockRows: d.getMockRows ?? (() => genRows(d.rows ?? 10, d.cols, d.seeds ?? {}, d.id, d.badge)),
  };
}

function toForm(d: Pick<DropiScreenConfig, 'id' | 'figmaNode' | 'title' | 'breadcrumbs' | 'primaryAction'>, layout: DropiScreenLayout = 'settings-form'): DropiScreenConfig {
  return { ...d, layout, getMockRows: () => [] };
}

function toCards(d: Pick<DropiScreenConfig, 'id' | 'figmaNode' | 'title' | 'breadcrumbs'>, labels: string[], layout: DropiScreenLayout = 'kpi-dashboard'): DropiScreenConfig {
  return {
    ...d, layout,
    getMockRows: () => labels.map((titulo, i) => ({
      id: `${d.id}-card-${i + 1}`,
      cells: { titulo, valor: pick(['$ 2.4M', '847', '94%', '12.5K', '$ 890K', '156'], i), delta: pick(['+12%', '+8%', '-3%', '+24%'], i) },
    })),
  };
}

// ── List screen definitions (compact) ────────────────────────────────────────

const LIST_DEFS: ListDef[] = [
  { id: 'proveedores', figma: '12401:40084', title: 'Proveedores', bc: ['Productos', 'Catálogo'], search: 'Buscar proveedor…', primary: { label: 'Ver catálogo', variant: 'primary' }, badge: 'tipo',
    cols: [{ key: 'nombre', label: 'Proveedor' }, { key: 'productos', label: 'Productos', align: 'center' }, { key: 'ciudad', label: 'Ciudad' }, { key: 'tipo', label: 'Tipo' }, { key: 'rating', label: 'Calificación', align: 'center' }],
    seeds: { nombre: S.providers, productos: [545, 210, 19, 41, 87, 9], ciudad: S.cities, tipo: ['Premium', 'Premium', 'Verificado', 'Estándar', 'Estándar', 'Nuevo'], rating: ['4.8', '4.6', '4.2', '3.9', '4.1', '4.5'] } },
  { id: 'negociaciones', figma: '12401:40448', title: 'Negociaciones', bc: ['Productos'], search: 'Buscar negociación o proveedor…', primary: { label: 'Nueva negociación', icon: 'pi-plus', variant: 'primary' }, badge: 'estado',
    cols: [{ key: 'producto', label: 'Producto' }, { key: 'proveedor', label: 'Proveedor' }, { key: 'precioActual', label: 'Precio actual', align: 'right' }, { key: 'precioPropuesto', label: 'Propuesta', align: 'right' }, { key: 'estado', label: 'Estado' }],
    seeds: { producto: S.products, proveedor: S.providers, precioActual: ['$ 32.000', '$ 45.500', '$ 18.900'], precioPropuesto: ['$ 28.500', '$ 41.200', '$ 16.500'], estado: ['En revisión', 'Aceptada', 'Pendiente', 'Rechazada', 'Contraoferta'] } },
  { id: 'cas-bandeja', figma: '12401:44291', title: 'CAS · Bandeja', bc: ['CAS'], search: 'Buscar ticket o pedido…', guia: true,
    primary: { label: 'Nuevo ticket', icon: 'pi-plus', variant: 'primary' }, badge: 'prioridad',
    cols: [{ key: 'ticket', label: 'Ticket' }, { key: 'pedido', label: 'Pedido' }, { key: 'cliente', label: 'Cliente' }, { key: 'motivo', label: 'Motivo' }, { key: 'prioridad', label: 'Prioridad' }, { key: 'estado', label: 'Estado' }],
    seeds: { ticket: ['CAS-1042', 'CAS-1043', 'CAS-1044', 'CAS-1045'], pedido: ['#160604', '#160605', '#160608', '#160612'], cliente: S.clients, motivo: ['Novedad en entrega', 'Producto dañado', 'Guía no generada', 'Reembolso'], prioridad: ['Alta', 'Media', 'Baja'], estado: S.estados } },
  { id: 'mis-pedidos', figma: '12401:41175', title: 'Ordenes', bc: ['Pedidos'], search: 'Buscar por ID, cliente o guía…', guia: true,
    primary: { label: 'Orden manual', icon: 'pi-plus', variant: 'primary' }, badge: 'estado',
    cols: [{ key: 'id', label: 'ID', width: '90px' }, { key: 'producto', label: 'Producto' }, { key: 'cliente', label: 'Cliente' }, { key: 'ciudad', label: 'Ciudad destino' }, { key: 'transportadora', label: 'Transportadora' }, { key: 'estado', label: 'Estado' }, { key: 'acciones', label: 'Acciones', width: '120px', type: 'actions' }],
    seeds: { id: ['160604', '160605', '160606', '160607', '160608', '160609'], producto: S.products, cliente: S.clients, ciudad: S.cities, transportadora: S.transport, estado: S.statusPedido } },
  { id: 'novedades', figma: '12401:41657', title: 'Novedades', bc: ['Pedidos'], search: 'Buscar novedad', guia: true,
    toolbar: 'novedades', historial: { label: 'Ir al Historial de Novedades', icon: 'pi-history', variant: 'secondary' },
    cols: [
      { key: 'num', label: '#', width: '90px' },
      { key: 'fecha', label: 'Fecha de Novedad', width: '211px' },
      { key: 'tienda', label: 'Datos de la tienda', multiline: true },
      { key: 'datos', label: 'Datos', multiline: true },
      { key: 'acciones', label: 'Acciones', width: '120px', type: 'actions' },
    ],
    getMockRows: novedadesRows,
  },
  { id: 'carritos-abandonados', figma: '12401:41051', title: 'Carritos abandonados', bc: ['Pedidos'], search: 'Buscar cliente o producto…',
    cols: [{ key: 'cliente', label: 'Cliente' }, { key: 'producto', label: 'Producto' }, { key: 'valor', label: 'Valor carrito', align: 'right' }, { key: 'tienda', label: 'Tienda' }, { key: 'abandonado', label: 'Abandonado hace' }],
    seeds: { cliente: S.clients, producto: S.products, valor: S.montos, tienda: ['Shopify · Dropi Tienda', 'Tienda Nube · ModaFit', 'WooCommerce · TechStore'], abandonado: ['2 h', '5 h', '1 d', '3 d', '6 h'] } },
  { id: 'etiquetas', figma: '12401:41093', title: 'Etiquetas', bc: ['Pedidos', 'Preferencias'], search: 'Buscar pedido o guía…', guia: true,
    primary: { label: 'Generar etiquetas', icon: 'pi-tag', variant: 'primary' }, badge: 'estado',
    cols: [
      { key: 'pedido', label: 'Pedido', width: '100px' },
      { key: 'cliente', label: 'Cliente' },
      { key: 'guia', label: 'Guía', width: '160px' },
      { key: 'transportadora', label: 'Transportadora', width: '140px' },
      { key: 'destino', label: 'Destino' },
      { key: 'estado', label: 'Estado etiqueta', width: '140px' },
      { key: 'acciones', label: 'Acciones', width: '120px', type: 'actions' },
    ],
    seeds: { pedido: ['#160604', '#160605', '#160607', '#160608', '#160609', '#160610'], cliente: S.clients, guia: ['1123266584698', '8876543210123', '—'], transportadora: S.transport, destino: S.cities, estado: ['Generada', 'Pendiente', 'Impresa', 'Error PDF'] },
    rows: 12,
  },
  { id: 'configuracion-de-pedidos', figma: '12401:41175', title: 'Configuración de pedidos', bc: ['Pedidos'],
    cols: [{ key: 'regla', label: 'Regla' }, { key: 'valor', label: 'Valor' }, { key: 'modulo', label: 'Módulo' }, { key: 'actualizado', label: 'Última actualización' }],
    seeds: { regla: ['Recaudo automático', 'Validación dirección', 'Notif. WhatsApp', 'Etiqueta auto'], valor: ['Activado', 'Desactivado', 'ENVIA', 'Dropi bodega'], modulo: ['Pedidos', 'Logística', 'Marketing', 'Inventario'], actualizado: S.dates } },
  { id: 'tickets', figma: '12401:44291', title: 'CAS · Tickets', bc: ['CAS'], search: 'Buscar ticket…', badge: 'estado',
    cols: [{ key: 'ticket', label: 'Ticket' }, { key: 'asunto', label: 'Asunto' }, { key: 'categoria', label: 'Categoría' }, { key: 'agente', label: 'Agente' }, { key: 'estado', label: 'Estado' }],
    seeds: { ticket: ['TK-8821', 'TK-8822', 'TK-8823', 'TK-8824'], asunto: ['Guía rechazada', 'Reembolso pendiente', 'Producto incorrecto', 'Demora en entrega'], categoria: ['Logística', 'Financiero', 'Producto', 'Administrativo'], agente: ['Laura CAS', 'Michael CAS', 'Diana CAS', 'Sin asignar'], estado: S.estados } },
  { id: 'ordenes-de-despacho', figma: '12401:40794', title: 'Órdenes de despacho', bc: ['Pedidos', 'Garantías'], search: 'Buscar orden de despacho…', badge: 'estado',
    cols: [{ key: 'orden', label: 'Orden' }, { key: 'bodega', label: 'Bodega' }, { key: 'pedidos', label: 'Pedidos', align: 'center' }, { key: 'transportadora', label: 'Transportadora' }, { key: 'fecha', label: 'Fecha despacho' }, { key: 'estado', label: 'Estado' }],
    seeds: { orden: ['OD-2026-041', 'OD-2026-042', 'OD-2026-043'], bodega: ['Dropi bodega Bogotá', 'Dropi bodega Medellín', 'Dropi bodega Cali'], pedidos: [24, 18, 31, 12], transportadora: S.transport, fecha: S.dates, estado: ['Programado', 'Despachado', 'En preparación', 'Cancelado'] } },
  { id: 'garantias', figma: '12401:40664', title: 'Garantías', bc: ['Pedidos', 'Garantías'], search: 'Buscar garantía…', badge: 'estado',
    cols: [{ key: 'garantia', label: 'Garantía' }, { key: 'pedido', label: 'Pedido' }, { key: 'producto', label: 'Producto' }, { key: 'motivo', label: 'Motivo' }, { key: 'estado', label: 'Estado' }],
    seeds: { garantia: ['GAR-301', 'GAR-302', 'GAR-303'], pedido: ['#160604', '#160608', '#160612'], producto: S.products, motivo: ['Producto defectuoso', 'No entregado', 'Daño en transporte', 'Talla incorrecta'], estado: ['Abierta', 'Aprobada', 'Rechazada', 'En recolección', 'Cerrada'] } },
  { id: 'garantias-recolecciones', figma: '12401:40954', title: 'Garantías recolecciones', bc: ['Pedidos', 'Garantías'],
    toolbar: 'bulk-export', checkbox: true,
    export: { label: 'Exportar', icon: 'pi-download', variant: 'primary' },
    bulk: { label: 'Actualización masiva', icon: 'pi-upload', variant: 'outline' },
    cols: [
      { key: 'id', label: 'Id', width: '90px' },
      { key: 'adminId', label: 'Admin Id', width: '200px' },
      { key: 'garantiaId', label: 'Garantia Id', width: '200px' },
      { key: 'ordenId', label: 'Orden Id', width: '160px' },
      { key: 'fechaCreacion', label: 'Fecha de Creacion', width: '188px' },
      { key: 'transportadora', label: 'Transportadora', width: '141px' },
      { key: 'fechaRecoleccion', label: 'Fecha de recoleccion', width: '141px' },
      { key: 'numeroOrden', label: 'Numero de orden', width: '141px' },
      { key: 'estatusOrden', label: 'Estatus de la Orden', width: '141px' },
      { key: 'numeroGuia', label: 'Numero de la guia', width: '141px' },
      { key: 'estatusGuia', label: 'Estatus de la guia', width: '141px' },
      { key: 'acciones', label: 'Acciones', width: '150px', type: 'actions' },
    ],
    getMockRows: garantiasRecoleccionesRows,
  },
  { id: 'devoluciones-garantia', figma: '12401:46550', title: 'Devoluciones', bc: ['Logística', 'Garantías'], badge: 'estado',
    cols: [{ key: 'devolucion', label: 'Devolución' }, { key: 'pedido', label: 'Pedido' }, { key: 'cliente', label: 'Cliente' }, { key: 'monto', label: 'Monto', align: 'right' }, { key: 'estado', label: 'Estado' }],
    seeds: { devolucion: ['DEV-501', 'DEV-502', 'DEV-503'], pedido: ['#160604', '#160610'], cliente: S.clients, monto: S.montos, estado: ['Pendiente', 'Aprobada', 'Rechazada', 'Procesada'] } },
  { id: 'reclamaciones-logistica', figma: '12401:46812', title: 'Reclamaciones transportadora', bc: ['Logística'], badge: 'estado',
    cols: [{ key: 'reclamo', label: 'Reclamo' }, { key: 'guia', label: 'Guía' }, { key: 'transportadora', label: 'Transportadora' }, { key: 'tipo', label: 'Tipo' }, { key: 'estado', label: 'Estado' }],
    seeds: { reclamo: ['RCL-201', 'RCL-202', 'RCL-203'], guia: ['1123266584698', '8876543210123'], transportadora: S.transport, tipo: ['Pérdida', 'Demora', 'Daño', 'Cobro indebido'], estado: ['Radicado', 'En revisión', 'A favor', 'Rechazado'] } },
  { id: 'seguimiento-guias', figma: '12401:44862', title: 'Seguimiento de guías', bc: ['Logística'], search: 'Buscar guía o pedido…', badge: 'estado',
    cols: [{ key: 'guia', label: 'Guía' }, { key: 'pedido', label: 'Pedido' }, { key: 'destino', label: 'Destino' }, { key: 'ultimoEvento', label: 'Último evento' }, { key: 'estado', label: 'Estado' }],
    seeds: { guia: ['1123266584698', '8876543210123', '5544332211009'], pedido: ['#160604', '#160605', '#160607'], destino: S.cities, ultimoEvento: ['En bodega destino', 'En tránsito', 'Entregado', 'Novedad reportada'], estado: S.statusPedido } },
  { id: 'historial-de-cartera', figma: '12401:46928', title: 'Historial de wallet', bc: ['Financiero', 'Wallet'], search: 'Buscar transacción…', badge: 'tipo',
    cols: [{ key: 'id', label: 'ID' }, { key: 'fecha', label: 'Fecha' }, { key: 'tipo', label: 'Tipo' }, { key: 'descripcion', label: 'Descripción' }, { key: 'monto', label: 'Monto', align: 'right' }],
    seeds: { id: ['95424078', '95423199', '95423047', '95422806'], fecha: ['27/05/2026 2:37 p.m.', '27/05/2026 2:22 p.m.'], tipo: ['ENTRADA', 'SALIDA'], descripcion: ['RECARGA SPEI', 'Recarga cartera usuario', 'Comisión pedido #160604', 'Retiro saldo'], monto: ['+ $ 92.000', '- $ 50.000', '+ $ 150.000', '- $ 11.000'] } },
  { id: 'transacciones', figma: '12401:47293', title: 'Transacciones en billetera', bc: ['Financiero'], search: 'Filtrar transacciones…',
    cols: [{ key: 'referencia', label: 'Referencia' }, { key: 'fecha', label: 'Fecha' }, { key: 'concepto', label: 'Concepto' }, { key: 'saldo', label: 'Saldo resultante', align: 'right' }, { key: 'monto', label: 'Monto', align: 'right' }],
    seeds: { referencia: ['TXN-88421', 'TXN-88422', 'TXN-88423'], fecha: S.dates, concepto: ['Recarga SPEI', 'Pago pedido #160604', 'Comisión Dropi', 'Retiro bancario'], saldo: ['$ 1.245.900', '$ 1.195.900', '$ 960.400'], monto: ['+ $ 200.000', '- $ 50.000', '- $ 250.000'] } },
  { id: 'depositos-manuales', figma: '12401:47385', title: 'Depósitos manuales', bc: ['Financiero'], primary: { label: 'Registrar depósito', variant: 'primary' }, badge: 'estado',
    cols: [{ key: 'deposito', label: 'Depósito' }, { key: 'fecha', label: 'Fecha' }, { key: 'banco', label: 'Banco' }, { key: 'referencia', label: 'Referencia' }, { key: 'monto', label: 'Monto', align: 'right' }, { key: 'estado', label: 'Estado' }],
    seeds: { deposito: ['DEP-1201', 'DEP-1202', 'DEP-1203'], fecha: S.dates, banco: ['Bancolombia', 'Davivienda', 'BBVA', 'Nequi'], referencia: ['REF-8844221', 'REF-7733110'], monto: S.montos, estado: ['Aprobado', 'En revisión', 'Rechazado'] } },
  { id: 'movimientos-billetera', figma: '12401:47439', title: 'Movimientos de billetera', bc: ['Financiero'],
    cols: [{ key: 'movimiento', label: 'Movimiento' }, { key: 'fecha', label: 'Fecha' }, { key: 'origen', label: 'Origen' }, { key: 'destino', label: 'Destino' }, { key: 'monto', label: 'Monto', align: 'right' }],
    seeds: { movimiento: ['MOV-501', 'MOV-502', 'MOV-503'], fecha: S.dates, origen: ['Billetera', 'Cartera', 'Dropi Card'], destino: ['Cartera', 'Retiro bancario', 'Pago proveedor'], monto: S.montos } },
  { id: 'facturas-pendientes', figma: '12401:47555', title: 'Facturas', bc: ['Financiero', 'Facturación'], badge: 'estado',
    cols: [{ key: 'factura', label: 'Factura' }, { key: 'periodo', label: 'Periodo' }, { key: 'concepto', label: 'Concepto' }, { key: 'vencimiento', label: 'Vencimiento' }, { key: 'monto', label: 'Monto', align: 'right' }, { key: 'estado', label: 'Estado' }],
    seeds: { factura: ['FAC-2026-05', 'FAC-2026-04'], periodo: ['Mayo 2026', 'Abril 2026'], concepto: ['Comisiones Dropi', 'Servicios logísticos', 'Plan Pro'], vencimiento: ['05/06/2026', '05/05/2026'], monto: ['$ 245.000', '$ 198.500'], estado: ['Pendiente', 'Pagada', 'Vencida'] } },
  { id: 'campanas', figma: '12401:41729', title: 'Campañas masivas', bc: ['Marketing'], primary: { label: 'Nueva campaña', variant: 'primary' }, badge: 'estado',
    cols: [{ key: 'campana', label: 'Campaña' }, { key: 'canal', label: 'Canal' }, { key: 'audiencia', label: 'Audiencia' }, { key: 'enviados', label: 'Enviados', align: 'center' }, { key: 'estado', label: 'Estado' }],
    seeds: { campana: ['Recuperación carrito Mayo', 'Promo Collar GPS', 'Reactivación clientes'], canal: ['WhatsApp', 'SMS', 'Email'], audiencia: ['Carritos abandonados', 'Compradores 30d', 'Inactivos 60d'], enviados: [1240, 856, 2340], estado: ['Activa', 'Programada', 'Finalizada', 'Pausada'] } },
  { id: 'automatizacion', figma: '12401:41834', title: 'Automatización', bc: ['Marketing'], primary: { label: 'Crear flujo', variant: 'primary' }, badge: 'estado',
    cols: [{ key: 'flujo', label: 'Flujo' }, { key: 'trigger', label: 'Disparador' }, { key: 'accion', label: 'Acción' }, { key: 'ejecuciones', label: 'Ejecuciones', align: 'center' }, { key: 'estado', label: 'Estado' }],
    seeds: { flujo: ['Post-compra WhatsApp', 'Carrito abandonado 2h', 'Review request 7d'], trigger: ['Pedido entregado', 'Carrito abandonado', '7 días post-entrega'], accion: ['Enviar mensaje', 'Enviar cupón', 'Solicitar reseña'], ejecuciones: [342, 128, 89], estado: ['Activo', 'Activo', 'Pausado'] } },
  { id: 'configuraciones', figma: '12401:41896', title: 'Marketing · Configuraciones', bc: ['Marketing'],
    cols: [{ key: 'parametro', label: 'Parámetro' }, { key: 'valor', label: 'Valor' }, { key: 'modulo', label: 'Módulo' }],
    seeds: { parametro: ['Remitente WhatsApp', 'Horario envíos', 'Opt-out automático'], valor: ['Dropi Tienda', '8:00 – 20:00', 'Activado'], modulo: ['WhatsApp', 'General', 'Compliance'] } },
  { id: 'audiencias', figma: '12401:41956', title: 'Chatea Pro', bc: ['Marketing'],
    cols: [{ key: 'audiencia', label: 'Audiencia' }, { key: 'contactos', label: 'Contactos', align: 'center' }, { key: 'criterio', label: 'Criterio' }, { key: 'actualizado', label: 'Actualizado' }],
    seeds: { audiencia: ['Compradores recurrentes', 'Carritos abandonados', 'Clientes Cali'], contactos: [1842, 624, 412], criterio: ['≥ 2 compras', 'Abandono < 7d', 'Ciudad = Cali'], actualizado: S.dates } },
  { id: 'plantillas-campanas', figma: '12401:42100', title: 'Informes ROAX', bc: ['Marketing', 'ROAX'],
    cols: [{ key: 'plantilla', label: 'Plantilla' }, { key: 'canal', label: 'Canal' }, { key: 'categoria', label: 'Categoría' }, { key: 'usos', label: 'Usos', align: 'center' }],
    seeds: { plantilla: ['Bienvenida tienda', 'Carrito olvidado', 'Promo flash'], canal: ['WhatsApp', 'Email', 'SMS'], categoria: ['Onboarding', 'Recuperación', 'Promoción'], usos: [45, 128, 32] } },
  { id: 'creador-de-paginas', figma: '12401:43387', title: 'Creador de páginas', bc: ['Marketing'], primary: { label: 'Crear página', variant: 'primary' }, badge: 'estado',
    cols: [{ key: 'pagina', label: 'Página' }, { key: 'url', label: 'URL' }, { key: 'visitas', label: 'Visitas', align: 'center' }, { key: 'conversion', label: 'Conversión' }, { key: 'estado', label: 'Estado' }],
    seeds: { pagina: ['Landing Collar GPS', 'Promo skincare', 'Oferta reloj smart'], url: ['/collar-gps', '/skincare-kit', '/smartwatch-tw8'], visitas: [4520, 2180, 890], conversion: ['3.2%', '2.8%', '4.1%'], estado: ['Publicada', 'Publicada', 'Borrador'] } },
  { id: 'descargas', figma: '12401:43387', title: 'Descargas', bc: ['Reportes'], search: 'Buscar reporte…', badge: 'estado',
    cols: [
      { key: 'reporte', label: 'Reporte' },
      { key: 'periodo', label: 'Periodo', width: '140px' },
      { key: 'formato', label: 'Formato', width: '100px' },
      { key: 'generado', label: 'Generado', width: '180px' },
      { key: 'estado', label: 'Estado', width: '120px' },
      { key: 'acciones', label: 'Acciones', width: '120px', type: 'actions' },
    ],
    seeds: { reporte: ['Ventas por producto', 'Novedades logísticas', 'Comisiones', 'Productos vendidos', 'Clientes activos', 'Guías generadas', 'Retiros wallet', 'Facturas emitidas', 'Campañas marketing', 'Inventario bodega', 'Torre logística SLA', 'Garantías abiertas'], periodo: ['Mayo 2026', 'Abril 2026', 'Q1 2026'], formato: ['Excel', 'CSV', 'PDF'], generado: ['27/05/2026 10:00', '26/05/2026 18:30', '25/05/2026 09:15'], estado: ['Listo', 'Procesando', 'Expirado', 'Listo', 'Listo'] },
    rows: 12,
  },
  { id: 'productos-vendidos', figma: '12401:46812', title: 'Productos vendidos', bc: ['Reportes'], search: 'Buscar producto…',
    cols: [{ key: 'producto', label: 'Producto' }, { key: 'unidades', label: 'Unidades', align: 'center' }, { key: 'ingresos', label: 'Ingresos', align: 'right' }, { key: 'margen', label: 'Margen', align: 'right' }, { key: 'tendencia', label: 'Tendencia' }],
    seeds: { producto: S.products, unidades: [842, 624, 412, 289], ingresos: ['$ 38.6M', '$ 24.1M', '$ 12.8M'], margen: S.margins, tendencia: ['↑ 12%', '↑ 8%', '↓ 3%', '↑ 24%'] } },
  { id: 'torre-logistica', figma: '12401:44862', title: 'Torre logística', bc: ['Logística'],
    cols: [{ key: 'transportadora', label: 'Transportadora' }, { key: 'pedidos', label: 'Pedidos', align: 'center' }, { key: 'entregados', label: 'Entregados', align: 'center' }, { key: 'novedades', label: 'Novedades', align: 'center' }, { key: 'sla', label: 'SLA' }],
    seeds: { transportadora: S.transport, pedidos: [1240, 856, 624, 412], entregados: [1180, 810, 590, 380], novedades: [42, 28, 18, 22], sla: ['95.2%', '94.6%', '94.5%', '92.2%'] } },
  { id: 'integraciones-marketing', figma: '12401:44291', title: 'Integraciones marketing', bc: ['Marketing', 'Reportes'], badge: 'estado',
    cols: [{ key: 'integracion', label: 'Integración' }, { key: 'plataforma', label: 'Plataforma' }, { key: 'estado', label: 'Estado' }, { key: 'ultimaSync', label: 'Última sync' }],
    seeds: { integracion: ['Meta Pixel', 'Google Analytics', 'TikTok Ads', 'Klaviyo'], plataforma: ['Facebook', 'Google', 'TikTok', 'Email'], estado: ['Conectado', 'Conectado', 'Desconectado'], ultimaSync: ['27/05/2026 08:00', '27/05/2026 07:30', '—'] } },
  { id: 'metricas-campanas', figma: '12401:44508', title: 'Métricas de campañas', bc: ['Marketing', 'Reportes'],
    cols: [{ key: 'campana', label: 'Campaña' }, { key: 'aperturas', label: 'Aperturas', align: 'center' }, { key: 'clics', label: 'Clics', align: 'center' }, { key: 'conversiones', label: 'Conversiones', align: 'center' }, { key: 'roas', label: 'ROAS' }],
    seeds: { campana: ['Recuperación carrito Mayo', 'Promo Collar GPS', 'Flash sale skincare'], aperturas: [8420, 6240, 4120], clics: [1240, 890, 620], conversiones: [186, 142, 98], roas: ['4.2x', '3.8x', '5.1x'] } },
  { id: 'retiros-de-saldo', figma: '12401:43803', title: 'Retiros de saldo', bc: ['Financiero', 'Wallet'], primary: { label: 'Solicitar retiro', variant: 'primary' }, badge: 'estado',
    cols: [{ key: 'retiro', label: 'Retiro' }, { key: 'fecha', label: 'Fecha' }, { key: 'banco', label: 'Cuenta destino' }, { key: 'monto', label: 'Monto', align: 'right' }, { key: 'estado', label: 'Estado' }],
    seeds: { retiro: ['RET-901', 'RET-902', 'RET-903'], fecha: S.dates, banco: ['Bancolombia ****4521', 'Nequi ****8832', 'Davivienda ****1102'], monto: S.montos, estado: ['Procesado', 'En revisión', 'Rechazado'] } },
  { id: 'mis-sesiones', figma: '12401:43862', title: 'Mis Sesiones', bc: ['Configuraciones'], badge: 'estado',
    cols: [{ key: 'dispositivo', label: 'Dispositivo' }, { key: 'navegador', label: 'Navegador' }, { key: 'ubicacion', label: 'Ubicación' }, { key: 'ultimoAcceso', label: 'Último acceso' }, { key: 'estado', label: 'Estado' }],
    seeds: { dispositivo: ['MacBook Pro', 'iPhone 15', 'Windows PC', 'iPad Air'], navegador: ['Chrome 136', 'Safari 18', 'Edge 136'], ubicacion: ['Bogotá, CO', 'Medellín, CO', 'Cali, CO'], ultimoAcceso: ['27/05/2026 14:32', '26/05/2026 09:15'], estado: ['Activa', 'Activa', 'Cerrada'] } },
  { id: 'historial-de-actividades', figma: '12401:43994', title: 'Historial de Actividades', bc: ['Configuraciones'], search: 'Filtrar actividad…',
    cols: [{ key: 'fecha', label: 'Fecha' }, { key: 'accion', label: 'Acción' }, { key: 'modulo', label: 'Módulo' }, { key: 'ip', label: 'IP' }],
    seeds: { fecha: ['27/05/2026 14:32', '27/05/2026 12:10', '26/05/2026 18:40'], accion: ['Inicio de sesión', 'Generó etiquetas', 'Actualizó datos bancarios', 'Creó campaña'], modulo: ['Auth', 'Pedidos', 'Configuraciones', 'Marketing'], ip: ['190.85.xx.xx', '181.49.xx.xx', '200.24.xx.xx'] } },
  { id: 'usuarios-equipo', figma: '12401:44055', title: 'Usuarios del equipo', bc: ['Configuraciones'], primary: { label: 'Invitar usuario', variant: 'primary' }, badge: 'estado',
    cols: [{ key: 'usuario', label: 'Usuario' }, { key: 'email', label: 'Email' }, { key: 'rol', label: 'Rol' }, { key: 'ultimoAcceso', label: 'Último acceso' }, { key: 'estado', label: 'Estado' }],
    seeds: { usuario: ['María Ops', 'Carlos Fulfillment', 'Laura Marketing', 'Asistente virtual'], email: ['maria@dropitienda.co', 'carlos@dropitienda.co', 'laura@dropitienda.co'], rol: ['Admin', 'Operador', 'Marketing', 'Solo lectura'], ultimoAcceso: S.dates, estado: ['Activo', 'Activo', 'Invitado'] } },
];

// ── Registry assembly ────────────────────────────────────────────────────────

const listRegistry = Object.fromEntries([
  ...LIST_DEFS.filter(d => !['mis-pedidos', 'novedades', 'garantias-recolecciones', 'cas-bandeja', 'tickets', 'historial-de-cartera', 'garantias', 'ordenes-de-despacho', 'devoluciones-garantia', 'reclamaciones-logistica', 'seguimiento-guias', 'campanas', 'automatizacion', 'creador-de-paginas', 'etiquetas', 'descargas', 'usuarios-equipo'].includes(d.id))
    .map(d => [d.id, toList(d)]),
  ['mis-pedidos', toList(LIST_DEFS.find(d => d.id === 'mis-pedidos')!, 'orders-table')],
  ['novedades', toList(LIST_DEFS.find(d => d.id === 'novedades')!, 'list')],
  ['garantias-recolecciones', toList(LIST_DEFS.find(d => d.id === 'garantias-recolecciones')!, 'garantias-table')],
  ['etiquetas', toList(LIST_DEFS.find(d => d.id === 'etiquetas')!, 'list-etiquetas')],
  ['descargas', toList(LIST_DEFS.find(d => d.id === 'descargas')!, 'list-descargas')],
  ['cas-bandeja', toList(LIST_DEFS.find(d => d.id === 'cas-bandeja')!, 'list-cas')],
  ['tickets', toList(LIST_DEFS.find(d => d.id === 'tickets')!, 'list-cas')],
  ['historial-de-cartera', toList(LIST_DEFS.find(d => d.id === 'historial-de-cartera')!, 'wallet')],
  ['garantias', toList(LIST_DEFS.find(d => d.id === 'garantias')!, 'list-logistics')],
  ['ordenes-de-despacho', toList(LIST_DEFS.find(d => d.id === 'ordenes-de-despacho')!, 'list-logistics')],
  ['devoluciones-garantia', toList(LIST_DEFS.find(d => d.id === 'devoluciones-garantia')!, 'list-logistics')],
  ['reclamaciones-logistica', toList(LIST_DEFS.find(d => d.id === 'reclamaciones-logistica')!, 'list-logistics')],
  ['seguimiento-guias', toList(LIST_DEFS.find(d => d.id === 'seguimiento-guias')!, 'list-logistics')],
  ['campanas', toList(LIST_DEFS.find(d => d.id === 'campanas')!, 'marketing-grid')],
  ['automatizacion', toList(LIST_DEFS.find(d => d.id === 'automatizacion')!, 'marketing-grid')],
  ['creador-de-paginas', toList(LIST_DEFS.find(d => d.id === 'creador-de-paginas')!, 'marketing-grid')],
]);

export const DROPI_SCREEN_REGISTRY: Record<string, DropiScreenConfig> = {
  ...listRegistry,

  'transacciones': { ...toList(LIST_DEFS.find(d => d.id === 'transacciones')!, 'wallet'), title: 'Transacciones en billetera' },
  'movimientos-billetera': toList(LIST_DEFS.find(d => d.id === 'movimientos-billetera')!, 'wallet'),
  'productos-vendidos': toList(LIST_DEFS.find(d => d.id === 'productos-vendidos')!, 'report-metrics'),
  'torre-logistica': toList(LIST_DEFS.find(d => d.id === 'torre-logistica')!, 'report-metrics'),

  preferencias: toForm({
    id: 'preferencias', figmaNode: '12401:44548', title: 'Transportadoras',
    breadcrumbs: ['Logística'], primaryAction: { label: 'Guardar cambios', variant: 'primary' },
  }, 'carrier-preferences'),

  'datos-bancarios': {
    id: 'datos-bancarios', figmaNode: '12401:43425', title: 'Datos bancarios',
    breadcrumbs: ['Financiero', 'Wallet'], layout: 'bank-table',
    primaryAction: { label: 'Agregar', icon: 'pi-plus', variant: 'primary' },
    getMockRows: () => [
      { id: 'b1', cells: { pais: 'Colombia', banco: 'Bancolombia', cuenta: '*****3031', tipo: 'Ahorro', identificacion: 'CC: 11142536363' } },
      { id: 'b2', cells: { pais: 'Colombia', banco: 'Bancolombia', cuenta: '*****3012', tipo: 'Ahorro', identificacion: 'CC: 11142536363' } },
    ],
  },

  'configuracion-de-tienda': toForm({
    id: 'configuracion-de-tienda', figmaNode: '12401:44002', title: 'Configuración de tienda',
    breadcrumbs: ['Configurar'], primaryAction: { label: 'Guardar configuración', variant: 'primary' },
  }, 'store-config'),

  'datos-personales': toForm({
    id: 'datos-personales', figmaNode: '12401:43635', title: 'Información de cuenta',
    breadcrumbs: ['Configurar', 'Cuenta'], primaryAction: { label: 'Guardar información de cuenta', variant: 'primary' },
  }, 'account-form'),

  'preferencias-cuenta': toForm({
    id: 'preferencias-cuenta', figmaNode: '12401:44203', title: 'Preferencias de cuenta',
    breadcrumbs: ['Configuraciones'], primaryAction: { label: 'Guardar', variant: 'primary' },
  }),

  planes: toCards(
    { id: 'planes', figmaNode: '12401:43541', title: 'Planes', breadcrumbs: ['Configuraciones'] },
    ['Starter', 'Pro', 'Enterprise'],
    'plans',
  ),

  'validador-direcciones': toForm({
    id: 'validador-direcciones', figmaNode: '12401:47829', title: 'Validador de direcciones',
    breadcrumbs: ['Pedidos', 'Preferencias'], primaryAction: { label: 'Agregar dirección', variant: 'primary' },
  }),

  'reportes-clientes': toList({
    id: 'reportes-clientes', figma: '12401:46264', title: 'Clientes', bc: ['Reportes'],
    cols: [{ key: 'cliente', label: 'Cliente' }, { key: 'email', label: 'Email' }, { key: 'pedidos', label: 'Pedidos', align: 'center' }, { key: 'valor', label: 'Valor total', align: 'right' }],
    seeds: { cliente: S.clients, email: ['maria@gmail.com', 'carlos@dropitienda.co'], pedidos: [12, 8, 24], valor: S.montos },
  }),

  'reportes-calendario': toCards(
    { id: 'reportes-calendario', figmaNode: '12401:46550', title: 'Calendario', breadcrumbs: ['Reportes'] },
    ['Eventos hoy', 'Despachos programados', 'Cierres de mes'],
  ),

  'datos-facturacion': toForm({
    id: 'datos-facturacion', figmaNode: '12401:47555', title: 'Datos de facturación',
    breadcrumbs: ['Financiero', 'Facturación'], primaryAction: { label: 'Guardar', variant: 'primary' },
  }),

  'notas-credito': toList({
    id: 'notas-credito', figma: '12401:47555', title: 'Notas crédito', bc: ['Financiero', 'Facturación'], badge: 'estado',
    cols: [{ key: 'nota', label: 'Nota' }, { key: 'factura', label: 'Factura' }, { key: 'fecha', label: 'Fecha' }, { key: 'monto', label: 'Monto', align: 'right' }, { key: 'estado', label: 'Estado' }],
    seeds: { nota: ['NC-101', 'NC-102'], factura: ['FAC-2026-05'], fecha: S.dates, monto: ['$ 45.000', '$ 12.000'], estado: ['Aplicada', 'Pendiente'] },
  }),

  'configuraciones-marketing': toList(LIST_DEFS.find(d => d.id === 'configuraciones')!),

  'chatea-pro': toList({
    id: 'chatea-pro', figma: '12401:41956', title: 'Chatea pro', bc: ['Marketing'],
    cols: [{ key: 'canal', label: 'Canal' }, { key: 'agente', label: 'Agente' }, { key: 'conversaciones', label: 'Conversaciones', align: 'center' }, { key: 'estado', label: 'Estado' }],
    seeds: { canal: ['WhatsApp', 'Instagram'], agente: ['Bot ventas', 'Bot soporte'], conversaciones: [842, 624], estado: ['Activo', 'Pausado'] },
  }, 'marketing-grid'),

  'roax-informes': toList({
    id: 'roax-informes', figma: '12401:42100', title: 'Informes ROAX', bc: ['Marketing', 'ROAX'],
    cols: [{ key: 'informe', label: 'Informe' }, { key: 'periodo', label: 'Periodo' }, { key: 'roas', label: 'ROAS' }],
    seeds: { informe: ['Performance Mayo', 'Atribución Q2'], periodo: ['Mayo 2026', 'Q2 2026'], roas: ['4.2x', '3.8x'] },
  }, 'report-metrics'),

  'roax-lanzador': toList({
    id: 'roax-lanzador', figma: '12401:42708', title: 'Lanzador de campañas', bc: ['Marketing', 'ROAX'], primary: { label: 'Nueva campaña', variant: 'primary' }, badge: 'estado',
    cols: [{ key: 'campana', label: 'Campaña' }, { key: 'presupuesto', label: 'Presupuesto', align: 'right' }, { key: 'estado', label: 'Estado' }],
    seeds: { campana: ['Flash Collar GPS', 'Retargeting skincare'], presupuesto: ['$ 500.000', '$ 200.000'], estado: ['Activa', 'Programada'] },
  }, 'marketing-grid'),

  seguridad: toForm({
    id: 'seguridad', figmaNode: '12401:43549', title: 'Seguridad',
    breadcrumbs: ['Configurar', 'Cuenta'], primaryAction: { label: 'Guardar datos de registro', variant: 'primary' },
  }, 'security-tabs'),

  'integraciones-config': toList({
    id: 'integraciones-config', figma: '12401:44291', title: 'Integraciones', bc: ['Configuraciones'], badge: 'estado',
    cols: [{ key: 'integracion', label: 'Integración' }, { key: 'estado', label: 'Estado' }, { key: 'ultimaSync', label: 'Última sync' }],
    seeds: { integracion: ['Shopify', 'Tienda Nube', 'WooCommerce'], estado: ['Conectado', 'Conectado', 'Desconectado'], ultimaSync: S.dates },
  }),

  referidos: {
    id: 'referidos', figmaNode: '12401:43862', title: 'Referidos',
    breadcrumbs: ['Configurar'],
    layout: 'referidos-config',
    primaryAction: { label: 'Exportar', icon: 'pi-download', variant: 'primary' },
    getMockRows: () => [
      { id: 'r1', cells: { id: '176293', nombre: 'Dream Shop', correo: 'diana@gmail.com', telefono: '3145256365', estado: 'Activo' } },
      { id: 'r2', cells: { id: '59296', nombre: 'Magic Shop', correo: 'paola@gmail.com', telefono: '3002568965', estado: 'Activo' } },
      { id: 'r3', cells: { id: '88412', nombre: 'Tech Store', correo: 'carlos@gmail.com', telefono: '3114567890', estado: 'Activo' } },
      { id: 'r4', cells: { id: '12564', nombre: 'Moda Fit', correo: 'laura@gmail.com', telefono: '3209876543', estado: 'Inactivo' } },
    ],
  },

  'dropi-testers': toList({
    id: 'dropi-testers', figma: '12401:44055', title: 'Dropi testers', bc: ['Configuraciones'], badge: 'estado',
    cols: [{ key: 'tester', label: 'Tester' }, { key: 'feature', label: 'Feature' }, { key: 'estado', label: 'Estado' }],
    seeds: { tester: S.clients, feature: ['Nueva UI', 'Beta Caza'], estado: ['Activo', 'Invitado'] },
  }),

  'usuarios-equipo': {
    id: 'usuarios-equipo', figmaNode: '12401:44055', title: 'Usuarios',
    breadcrumbs: ['Configurar'],
    layout: 'usuarios-config',
    primaryAction: { label: 'Agregar', icon: 'pi-plus', variant: 'primary' },
    getMockRows: () => [
      { id: 'u1', cells: { id: '176293', nombre: 'Paola Angulo', correo: 'paola@gmail.com', estado: 'Activo', fechaCreacion: '08/03/2024 17:45 pm', ultimoLogin: '08/03/2024 17:45 pm', parent: 'Usuario ID: 74525\nCel: 315236255\nEmail: alejandra@gmail.com', initials: 'PA' } },
      { id: 'u2', cells: { id: '176293', nombre: 'Diana Aldana', correo: 'Diana@gmail.com', estado: 'Activo', fechaCreacion: '08/03/2024 17:45 pm', ultimoLogin: '08/03/2024 17:45 pm', parent: 'Usuario ID: 74525\nCel: 315236255\nEmail: alejandra@gmail.com', initials: 'DA' } },
      { id: 'u3', cells: { id: '176293', nombre: 'Maria Ossa', correo: 'maria@gmail.com', estado: 'Activo', fechaCreacion: '08/03/2024 17:45 pm', ultimoLogin: '08/03/2024 17:45 pm', parent: 'Usuario ID: 74525\nCel: 315236255\nEmail: alejandra@gmail.com', initials: 'MO' } },
      { id: 'u4', cells: { id: '176293', nombre: 'Michael Martínez', correo: 'michael@gmail.com', estado: 'Activo', fechaCreacion: '08/03/2024 17:45 pm', ultimoLogin: '08/03/2024 17:45 pm', parent: 'Usuario ID: 74525\nCel: 315236255\nEmail: alejandra@gmail.com', initials: 'MG' } },
    ],
  },

  dropicard: {
    id: 'dropicard', figmaNode: '12401:47829', title: 'Dropicard', breadcrumbs: [],
    layout: 'dropicard',
    getMockRows: () => [
      { id: 'dc1', cells: { titulo: 'Saldo disponible', valor: '$ 1.245.900', delta: '+$ 45.000 este mes' } },
      { id: 'dc2', cells: { titulo: 'Cashback del mes', valor: '$ 12.450', delta: '3% acumulado' } },
    ],
  },

  academy: {
    id: 'academy', figmaNode: '12401:41051', title: 'Academy', breadcrumbs: [],
    layout: 'academy-grid',
    getMockRows: () => [
      { id: 'a1', cells: { titulo: 'Fundamentos del dropshipping', valor: '85%', delta: '12 lecciones' } },
      { id: 'a2', cells: { titulo: 'Marketing con Dropi', valor: '60%', delta: '8 lecciones' } },
      { id: 'a3', cells: { titulo: 'Logística avanzada', valor: '100%', delta: 'Certificado' } },
      { id: 'a4', cells: { titulo: 'Escalando tu tienda', valor: '30%', delta: '5 lecciones' } },
    ],
  },
};

/** Resuelve config de pantalla por id (segmento de ruta o clave registry) */
export function getScreenConfig(screenId: string): DropiScreenConfig | null {
  return DROPI_SCREEN_REGISTRY[screenId] ?? null;
}

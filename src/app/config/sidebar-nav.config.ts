/**
 * Sidebar Navigation Config — Source of truth: Figma DS (ONiVQJJ2qrJ6tmJnpNrrKE)
 * Node: 243:14156 (Componente nuevo > Sidebar)
 * Icons: Custom SVGs from Figma at assets/icons/sidebar/
 * DO NOT modify without updating from Figma first.
 */

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: { label: string; route: string }[];
}

export type UserRole = 'dropshipper' | 'proveedor' | 'admin';

const IC = 'assets/icons/sidebar/';

const dropshipperNav: NavItem[] = [
  { label: 'Inicio', icon: IC + 'home.svg', route: '/old/home' },
  { label: 'Dashboard', icon: IC + 'signal.svg', route: '/old/dashboard' },
  {
    label: 'Productos',
    icon: IC + 'search.svg',
    children: [
      { label: 'Catálogo', route: '/old/productos/catalogo' },
      { label: 'Proveedores', route: '/old/productos/proveedores' },
      { label: 'Caza productos', route: '/old/productos/caza-productos' },
    ],
  },
  {
    label: 'Mis pedidos',
    icon: IC + 'shopping-cart.svg',
    children: [
      { label: 'Mis Pedidos', route: '/old/mis-pedidos/mis-pedidos' },
      { label: 'Novedades', route: '/old/mis-pedidos/novedades' },
      { label: 'Carritos abandonados', route: '/old/mis-pedidos/carritos-abandonados' },
      { label: 'Etiquetas', route: '/old/mis-pedidos/etiquetas' },
      { label: 'Configuración de pedidos', route: '/old/mis-pedidos/configuracion-de-pedidos' },
    ],
  },
  {
    label: 'Mis Garantías',
    icon: IC + 'certificated.svg',
    children: [
      { label: 'Garantías', route: '/old/mis-garantias/garantias' },
      { label: 'Ordenes de Despacho', route: '/old/mis-garantias/ordenes-de-despacho' },
      { label: 'Garantías Recolecciones', route: '/old/mis-garantias/garantias-recolecciones' },
    ],
  },
  { label: 'Clientes', icon: IC + 'user-check.svg', route: '/old/clientes' },
  { label: 'Mis integraciones', icon: IC + 'shop.svg', route: '/old/mis-integraciones' },
  { label: 'Historial de cartera', icon: IC + 'time-past.svg', route: '/old/historial-de-cartera' },
  { label: 'Mis usuarios', icon: IC + 'user-group.svg', route: '/old/mis-usuarios' },
  { label: 'Mis referidos', icon: IC + 'user-add.svg', route: '/old/mis-referidos' },
  {
    label: 'Configuraciones',
    icon: IC + 'settings.svg',
    children: [
      { label: 'Datos Bancarios', route: '/old/configuraciones/datos-bancarios' },
      { label: 'Planes', route: '/old/configuraciones/planes' },
      { label: 'Configuración de tienda', route: '/old/configuraciones/configuracion-de-tienda' },
      { label: 'Datos Personales', route: '/old/configuraciones/datos-personales' },
      { label: 'Retiros de Saldo', route: '/old/configuraciones/retiros-de-saldo' },
      { label: 'Mis Sesiones', route: '/old/configuraciones/mis-sesiones' },
      { label: 'Historial de Actividades', route: '/old/configuraciones/historial-de-actividades' },
    ],
  },
  { label: 'Calendario', icon: IC + 'calendar.svg', route: '/old/calendario' },
  {
    label: 'Marketing',
    icon: IC + 'megaphone.svg',
    children: [
      { label: 'Campañas', route: '/old/marketing/campanas' },
      { label: 'Automatización', route: '/old/marketing/automatizacion' },
      { label: 'Configuraciones', route: '/old/marketing/configuraciones' },
      { label: 'Creador de páginas', route: '/old/marketing/creador-de-paginas' },
    ],
  },
  {
    label: 'Reportes',
    icon: IC + 'chat-arrow-grow.svg',
    children: [
      { label: 'Descargas', route: '/old/reportes/descargas' },
      { label: 'Productos vendidos', route: '/old/reportes/productos-vendidos' },
      { label: 'Torre logística', route: '/old/reportes/torre-logistica' },
    ],
  },
  {
    label: 'Facturas',
    icon: IC + 'receipt.svg',
    children: [
      { label: 'Facturas', route: '/old/facturas/facturas' },
      { label: 'Notas de credito', route: '/old/facturas/notas-de-credito' },
    ],
  },
  {
    label: 'Transportadora',
    icon: IC + 'truck-side.svg',
    children: [
      { label: 'Preferencias', route: '/old/transportadora/preferencias' },
    ],
  },
  {
    label: 'Dropi Card',
    icon: IC + 'card.svg',
    children: [
      { label: 'Cards', route: '/old/dropi-card/cards' },
    ],
  },
  {
    label: 'CAS',
    icon: IC + 'comments-dots.svg',
    children: [
      { label: 'Bandeja', route: '/old/cas/bandeja' },
      { label: 'Tickets', route: '/old/cas/tickets' },
    ],
  },
  { label: 'Academy', icon: IC + 'book.svg', route: '/old/academy' },
];

const proveedorNav: NavItem[] = [
  { label: 'Inicio', icon: IC + 'home.svg', route: '/old/home' },
  { label: 'Dashboard', icon: IC + 'signal.svg', route: '/old/dashboard' },
  {
    label: 'Productos',
    icon: IC + 'search.svg',
    children: [
      { label: 'Productos', route: '/old/productos/productos' },
      { label: 'Caza productos', route: '/old/productos/caza-productos' },
      { label: 'Negociaciones', route: '/old/productos/negociaciones' },
    ],
  },
  {
    label: 'Mis pedidos',
    icon: IC + 'shopping-cart.svg',
    children: [
      { label: 'Mis Pedidos', route: '/old/pedidos/mis-pedidos-proveedor' },
      { label: 'Novedades', route: '/old/mis-pedidos/novedades' },
      { label: 'Carritos abandonados', route: '/old/mis-pedidos/carritos-abandonados' },
      { label: 'Etiquetas', route: '/old/mis-pedidos/etiquetas' },
      { label: 'Configuración de pedidos', route: '/old/mis-pedidos/configuracion-de-pedidos' },
    ],
  },
  {
    label: 'Mis Garantías',
    icon: IC + 'certificated.svg',
    children: [
      { label: 'Garantías', route: '/old/mis-garantias/garantias' },
      { label: 'Ordenes de despacho', route: '/old/mis-garantias/ordenes-de-despacho' },
      { label: 'Garantías recolecciones', route: '/old/mis-garantias/garantias-recolecciones' },
    ],
  },
  { label: 'Clientes', icon: IC + 'user-check.svg', route: '/old/clientes' },
  { label: 'Mis integraciones', icon: IC + 'shop.svg', route: '/old/mis-integraciones' },
  { label: 'Historial de cartera', icon: IC + 'time-past.svg', route: '/old/historial-de-cartera' },
  { label: 'Mis usuarios', icon: IC + 'user-group.svg', route: '/old/mis-usuarios' },
  { label: 'Mis referidos', icon: IC + 'user-add.svg', route: '/old/mis-referidos' },
  {
    label: 'Configuraciones',
    icon: IC + 'settings.svg',
    children: [
      { label: 'Datos Bancarios', route: '/old/configuraciones/datos-bancarios' },
      { label: 'Planes', route: '/old/configuraciones/planes' },
      { label: 'Configuración de tienda', route: '/old/configuraciones/configuracion-de-tienda' },
      { label: 'Datos Personales', route: '/old/configuraciones/datos-personales' },
      { label: 'Retiro de Saldo', route: '/old/configuraciones/retiro-de-saldo' },
      { label: 'Mis sesiones', route: '/old/configuraciones/mis-sesiones' },
      { label: 'Historial de Actividades', route: '/old/configuraciones/historial-de-actividades' },
    ],
  },
  { label: 'Calendario', icon: IC + 'calendar.svg', route: '/old/calendario' },
  {
    label: 'Marketing',
    icon: IC + 'megaphone.svg',
    children: [
      { label: 'Campañas', route: '/old/marketing/campanas' },
      { label: 'Automatización', route: '/old/marketing/automatizacion' },
      { label: 'Configuraciones', route: '/old/marketing/configuraciones' },
    ],
  },
  {
    label: 'Reportes',
    icon: IC + 'chat-arrow-grow.svg',
    children: [
      { label: 'Descargas', route: '/old/reportes/descargas' },
      { label: 'Productos vendidos', route: '/old/reportes/productos-vendidos' },
      { label: 'Desempeño proveeduría', route: '/old/reportes/desempeno-proveeduria' },
    ],
  },
  {
    label: 'Facturas',
    icon: IC + 'receipt.svg',
    children: [
      { label: 'Facturas', route: '/old/facturas/facturas' },
      { label: 'Notas de credito', route: '/old/facturas/notas-de-credito' },
    ],
  },
  {
    label: 'Transportadora',
    icon: IC + 'truck-side.svg',
    children: [
      { label: 'Preferencias', route: '/old/transportadora/preferencias' },
    ],
  },
  { label: 'Dropi Card', icon: IC + 'card.svg', route: '/old/dropi-card' },
  {
    label: 'CAS',
    icon: IC + 'comments-dots.svg',
    children: [
      { label: 'Bandeja', route: '/old/cas/bandeja' },
      { label: 'Tickets', route: '/old/cas/tickets' },
    ],
  },
];

const adminNav: NavItem[] = [
  { label: 'Inicio', icon: IC + 'home.svg', route: '/old/home' },
  { label: 'Dashboard', icon: IC + 'signal.svg', route: '/old/dashboard' },
  { label: 'Retiro de Saldo', icon: IC + 'money-hand.svg', route: '/old/retiro-de-saldo' },
  {
    label: 'Usuarios',
    icon: IC + 'user-group.svg',
    children: [
      { label: 'Administradores', route: '/old/usuarios/administradores' },
      { label: 'Proveedores', route: '/old/usuarios/proveedores' },
      { label: 'Dropshippers', route: '/old/usuarios/dropshippers' },
      { label: 'Vendedores', route: '/old/usuarios/vendedores' },
      { label: 'Colaboradores CAS', route: '/old/usuarios/colaboradores-cas' },
      { label: 'Usuarios Logísticos', route: '/old/usuarios/usuarios-logisticos' },
    ],
  },
  {
    label: 'Transportadora',
    icon: IC + 'truck-side.svg',
    children: [
      { label: 'Recolecciones', route: '/old/transportadora/recolecciones' },
    ],
  },
  { label: 'Categorías de product...', icon: IC + 'grid-alt.svg', route: '/old/categorias-de-productos' },
  { label: 'Productos', icon: IC + 'bookmark.svg', route: '/old/productos' },
  {
    label: 'Órdenes',
    icon: IC + 'shopping-cart.svg',
    children: [
      { label: 'Órdenes', route: '/old/ordenes/ordenes' },
      { label: 'Novedades', route: '/old/ordenes/novedades' },
      { label: 'Manifiesto', route: '/old/ordenes/manifiesto' },
    ],
  },
  {
    label: 'Garantías',
    icon: IC + 'certificated.svg',
    children: [
      { label: 'Garantías', route: '/old/garantias/garantias' },
      { label: 'Ordenes de despacho', route: '/old/garantias/ordenes-de-despacho' },
      { label: 'Garantías recolecciones', route: '/old/garantias/garantias-recolecciones' },
    ],
  },
  {
    label: 'Logistic',
    icon: IC + 'truck-move.svg',
    children: [
      { label: 'Salidas', route: '/old/logistic/salidas' },
      { label: 'Devolutions Reception', route: '/old/logistic/devolutions-reception' },
      { label: 'Recogidas', route: '/old/logistic/recogidas' },
      { label: 'Logistic Management', route: '/old/logistic/logistic-management' },
    ],
  },
  { label: 'Clientes', icon: IC + 'user-check.svg', route: '/old/clientes' },
  { label: 'Reel Management', icon: IC + 'tickets.svg', route: '/old/reel-management' },
  {
    label: 'Configuraciones',
    icon: IC + 'settings.svg',
    children: [
      { label: 'Marca blanca', route: '/old/configuraciones/marca-blanca' },
      { label: 'Bancos', route: '/old/configuraciones/bancos' },
      { label: 'Integration Types', route: '/old/configuraciones/integration-types' },
      { label: 'Categoría de Usuario', route: '/old/configuraciones/categoria-de-usuario' },
      { label: 'Parametrizar Tarifas', route: '/old/configuraciones/parametrizar-tarifas' },
    ],
  },
  { label: 'Auditorias', icon: IC + 'book-admin.svg', route: '/old/auditorias' },
  { label: 'Historial de cartera', icon: IC + 'time-past.svg', route: '/old/historial-de-cartera' },
  { label: 'Bodegas', icon: IC + 'warehouse.svg', route: '/old/bodegas' },
  { label: 'Calendario', icon: IC + 'calendar.svg', route: '/old/calendario' },
  {
    label: 'Reportes',
    icon: IC + 'chat-arrow-grow.svg',
    children: [
      { label: 'Descargas', route: '/old/reportes/descargas' },
      { label: 'Órdenes sin despachar', route: '/old/reportes/ordenes-sin-despachar' },
      { label: 'Order costs', route: '/old/reportes/order-costs' },
      { label: 'Collections', route: '/old/reportes/collections' },
    ],
  },
  {
    label: 'Marca blanca',
    icon: IC + 'page.svg',
    children: [
      { label: 'Brands', route: '/old/marca-blanca/brands' },
    ],
  },
  { label: 'Ciudades', icon: IC + 'marker.svg', route: '/old/ciudades' },
  {
    label: 'Soporte',
    icon: IC + 'user-headset.svg',
    children: [
      { label: 'Soporte', route: '/old/soporte/soporte' },
      { label: 'Topic', route: '/old/soporte/topic' },
    ],
  },
  {
    label: 'Facturas',
    icon: IC + 'receipt.svg',
    children: [
      { label: 'Facturas', route: '/old/facturas/facturas' },
      { label: 'Notas de credito', route: '/old/facturas/notas-de-credito' },
    ],
  },
  {
    label: 'Marketing',
    icon: IC + 'megaphone.svg',
    children: [
      { label: 'Campañas', route: '/old/marketing/campanas' },
      { label: 'Automatización', route: '/old/marketing/automatizacion' },
      { label: 'Configuraciones', route: '/old/marketing/configuraciones' },
      { label: 'Buscador de anuncios', route: '/old/marketing/buscador-de-anuncios' },
    ],
  },
  { label: 'Comunidades', icon: IC + 'user-community.svg', route: '/old/comunidades' },
  {
    label: 'CAS',
    icon: IC + 'comments-dots.svg',
    children: [
      { label: 'Bandeja', route: '/old/cas/bandeja' },
      { label: 'Tickets', route: '/old/cas/tickets' },
    ],
  },
];

export const SIDEBAR_NAV: Record<UserRole, NavItem[]> = {
  dropshipper: dropshipperNav,
  proveedor: proveedorNav,
  admin: adminNav,
};

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
  { label: 'Inicio', icon: IC + 'home.svg', route: '/home' },
  { label: 'Dashboard', icon: IC + 'signal.svg', route: '/dashboard' },
  {
    label: 'Productos',
    icon: IC + 'search.svg',
    children: [
      { label: 'Catálogo', route: '/productos/catalogo' },
      { label: 'Proveedores', route: '/productos/proveedores' },
      { label: 'Caza productos', route: '/productos/caza-productos' },
    ],
  },
  {
    label: 'Mis pedidos',
    icon: IC + 'shopping-cart.svg',
    children: [
      { label: 'Órdenes', route: '/mis-pedidos/ordenes' },
      { label: 'Novedades', route: '/mis-pedidos/novedades' },
      { label: 'Carritos abandonados', route: '/mis-pedidos/carritos-abandonados' },
      { label: 'Etiquetas', route: '/mis-pedidos/etiquetas' },
      { label: 'Configuración de pedidos', route: '/mis-pedidos/configuracion-de-pedidos' },
    ],
  },
  {
    label: 'Mis Garantías',
    icon: IC + 'certificated.svg',
    children: [
      { label: 'Garantías', route: '/mis-garantias/garantias' },
      { label: 'Ordenes de Despacho', route: '/mis-garantias/ordenes-de-despacho' },
      { label: 'Garantías Recolecciones', route: '/mis-garantias/garantias-recolecciones' },
    ],
  },
  { label: 'Clientes', icon: IC + 'user-check.svg', route: '/clientes' },
  { label: 'Mis integraciones', icon: IC + 'shop.svg', route: '/mis-integraciones' },
  { label: 'Historial de cartera', icon: IC + 'time-past.svg', route: '/historial-de-cartera' },
  { label: 'Mis usuarios', icon: IC + 'user-group.svg', route: '/mis-usuarios' },
  { label: 'Mis referidos', icon: IC + 'user-add.svg', route: '/mis-referidos' },
  {
    label: 'Configuraciones',
    icon: IC + 'settings.svg',
    children: [
      { label: 'Datos Bancarios', route: '/configuraciones/datos-bancarios' },
      { label: 'Planes', route: '/configuraciones/planes' },
      { label: 'Configuración de tienda', route: '/configuraciones/configuracion-de-tienda' },
      { label: 'Datos Personales', route: '/configuraciones/datos-personales' },
      { label: 'Retiros de Saldo', route: '/configuraciones/retiros-de-saldo' },
      { label: 'Mis Sesiones', route: '/configuraciones/mis-sesiones' },
      { label: 'Historial de Actividades', route: '/configuraciones/historial-de-actividades' },
    ],
  },
  { label: 'Calendario', icon: IC + 'calendar.svg', route: '/calendario' },
  {
    label: 'Marketing',
    icon: IC + 'megaphone.svg',
    children: [
      { label: 'Campañas', route: '/marketing/campanas' },
      { label: 'Automatización', route: '/marketing/automatizacion' },
      { label: 'Configuraciones', route: '/marketing/configuraciones' },
      { label: 'Creador de páginas', route: '/marketing/creador-de-paginas' },
    ],
  },
  {
    label: 'Reportes',
    icon: IC + 'chat-arrow-grow.svg',
    children: [
      { label: 'Descargas', route: '/reportes/descargas' },
      { label: 'Productos vendidos', route: '/reportes/productos-vendidos' },
      { label: 'Torre logística', route: '/reportes/torre-logistica' },
    ],
  },
  {
    label: 'Facturas',
    icon: IC + 'receipt.svg',
    children: [
      { label: 'Facturas', route: '/facturas/facturas' },
      { label: 'Notas de credito', route: '/facturas/notas-de-credito' },
    ],
  },
  {
    label: 'Transportadora',
    icon: IC + 'truck-side.svg',
    children: [
      { label: 'Preferencias', route: '/transportadora/preferencias' },
    ],
  },
  {
    label: 'Dropi Card',
    icon: IC + 'card.svg',
    children: [
      { label: 'Cards', route: '/dropi-card/cards' },
    ],
  },
  {
    label: 'CAS',
    icon: IC + 'comments-dots.svg',
    children: [
      { label: 'Bandeja', route: '/cas/bandeja' },
      { label: 'Tickets', route: '/cas/tickets' },
    ],
  },
  { label: 'Academy', icon: IC + 'book.svg', route: '/academy' },
];

const proveedorNav: NavItem[] = [
  { label: 'Inicio', icon: IC + 'home.svg', route: '/home' },
  { label: 'Dashboard', icon: IC + 'signal.svg', route: '/dashboard' },
  {
    label: 'Productos',
    icon: IC + 'search.svg',
    children: [
      { label: 'Productos', route: '/productos/productos' },
      { label: 'Caza productos', route: '/productos/caza-productos' },
      { label: 'Negociaciones', route: '/productos/negociaciones' },
    ],
  },
  {
    label: 'Mis pedidos',
    icon: IC + 'shopping-cart.svg',
    children: [
      { label: 'Órdenes', route: '/mis-pedidos/ordenes' },
      { label: 'Novedades', route: '/mis-pedidos/novedades' },
      { label: 'Carritos abandonados', route: '/mis-pedidos/carritos-abandonados' },
      { label: 'Etiquetas', route: '/mis-pedidos/etiquetas' },
      { label: 'Configuración de pedidos', route: '/mis-pedidos/configuracion-de-pedidos' },
    ],
  },
  {
    label: 'Mis Garantías',
    icon: IC + 'certificated.svg',
    children: [
      { label: 'Garantías', route: '/mis-garantias/garantias' },
      { label: 'Ordenes de despacho', route: '/mis-garantias/ordenes-de-despacho' },
      { label: 'Garantías recolecciones', route: '/mis-garantias/garantias-recolecciones' },
    ],
  },
  { label: 'Clientes', icon: IC + 'user-check.svg', route: '/clientes' },
  { label: 'Mis integraciones', icon: IC + 'shop.svg', route: '/mis-integraciones' },
  { label: 'Historial de cartera', icon: IC + 'time-past.svg', route: '/historial-de-cartera' },
  { label: 'Mis usuarios', icon: IC + 'user-group.svg', route: '/mis-usuarios' },
  { label: 'Mis referidos', icon: IC + 'user-add.svg', route: '/mis-referidos' },
  {
    label: 'Configuraciones',
    icon: IC + 'settings.svg',
    children: [
      { label: 'Datos Bancarios', route: '/configuraciones/datos-bancarios' },
      { label: 'Planes', route: '/configuraciones/planes' },
      { label: 'Configuración de tienda', route: '/configuraciones/configuracion-de-tienda' },
      { label: 'Datos Personales', route: '/configuraciones/datos-personales' },
      { label: 'Retiro de Saldo', route: '/configuraciones/retiro-de-saldo' },
      { label: 'Mis sesiones', route: '/configuraciones/mis-sesiones' },
      { label: 'Historial de Actividades', route: '/configuraciones/historial-de-actividades' },
    ],
  },
  { label: 'Calendario', icon: IC + 'calendar.svg', route: '/calendario' },
  {
    label: 'Marketing',
    icon: IC + 'megaphone.svg',
    children: [
      { label: 'Campañas', route: '/marketing/campanas' },
      { label: 'Automatización', route: '/marketing/automatizacion' },
      { label: 'Configuraciones', route: '/marketing/configuraciones' },
    ],
  },
  {
    label: 'Reportes',
    icon: IC + 'chat-arrow-grow.svg',
    children: [
      { label: 'Descargas', route: '/reportes/descargas' },
      { label: 'Productos vendidos', route: '/reportes/productos-vendidos' },
      { label: 'Desempeño proveeduría', route: '/reportes/desempeno-proveeduria' },
    ],
  },
  {
    label: 'Facturas',
    icon: IC + 'receipt.svg',
    children: [
      { label: 'Facturas', route: '/facturas/facturas' },
      { label: 'Notas de credito', route: '/facturas/notas-de-credito' },
    ],
  },
  {
    label: 'Transportadora',
    icon: IC + 'truck-side.svg',
    children: [
      { label: 'Preferencias', route: '/transportadora/preferencias' },
    ],
  },
  { label: 'Dropi Card', icon: IC + 'card.svg', route: '/dropi-card' },
  {
    label: 'CAS',
    icon: IC + 'comments-dots.svg',
    children: [
      { label: 'Bandeja', route: '/cas/bandeja' },
      { label: 'Tickets', route: '/cas/tickets' },
    ],
  },
];

const adminNav: NavItem[] = [
  { label: 'Inicio', icon: IC + 'home.svg', route: '/home' },
  { label: 'Dashboard', icon: IC + 'signal.svg', route: '/dashboard' },
  { label: 'Retiro de Saldo', icon: IC + 'money-hand.svg', route: '/retiro-de-saldo' },
  {
    label: 'Usuarios',
    icon: IC + 'user-group.svg',
    children: [
      { label: 'Administradores', route: '/usuarios/administradores' },
      { label: 'Proveedores', route: '/usuarios/proveedores' },
      { label: 'Dropshippers', route: '/usuarios/dropshippers' },
      { label: 'Vendedores', route: '/usuarios/vendedores' },
      { label: 'Colaboradores CAS', route: '/usuarios/colaboradores-cas' },
      { label: 'Usuarios Logísticos', route: '/usuarios/usuarios-logisticos' },
    ],
  },
  {
    label: 'Transportadora',
    icon: IC + 'truck-side.svg',
    children: [
      { label: 'Recolecciones', route: '/transportadora/recolecciones' },
    ],
  },
  { label: 'Categorías de product...', icon: IC + 'grid-alt.svg', route: '/categorias-de-productos' },
  { label: 'Productos', icon: IC + 'bookmark.svg', route: '/productos' },
  {
    label: 'Órdenes',
    icon: IC + 'shopping-cart.svg',
    children: [
      { label: 'Órdenes', route: '/ordenes/ordenes' },
      { label: 'Novedades', route: '/ordenes/novedades' },
      { label: 'Manifiesto', route: '/ordenes/manifiesto' },
    ],
  },
  {
    label: 'Garantías',
    icon: IC + 'certificated.svg',
    children: [
      { label: 'Garantías', route: '/garantias/garantias' },
      { label: 'Ordenes de despacho', route: '/garantias/ordenes-de-despacho' },
      { label: 'Garantías recolecciones', route: '/garantias/garantias-recolecciones' },
    ],
  },
  {
    label: 'Logistic',
    icon: IC + 'truck-move.svg',
    children: [
      { label: 'Salidas', route: '/logistic/salidas' },
      { label: 'Devolutions Reception', route: '/logistic/devolutions-reception' },
      { label: 'Recogidas', route: '/logistic/recogidas' },
      { label: 'Logistic Management', route: '/logistic/logistic-management' },
    ],
  },
  { label: 'Clientes', icon: IC + 'user-check.svg', route: '/clientes' },
  { label: 'Reel Management', icon: IC + 'tickets.svg', route: '/reel-management' },
  {
    label: 'Configuraciones',
    icon: IC + 'settings.svg',
    children: [
      { label: 'Marca blanca', route: '/configuraciones/marca-blanca' },
      { label: 'Bancos', route: '/configuraciones/bancos' },
      { label: 'Integration Types', route: '/configuraciones/integration-types' },
      { label: 'Categoría de Usuario', route: '/configuraciones/categoria-de-usuario' },
    ],
  },
  { label: 'Auditorias', icon: IC + 'book-admin.svg', route: '/auditorias' },
  { label: 'Historial de cartera', icon: IC + 'time-past.svg', route: '/historial-de-cartera' },
  { label: 'Bodegas', icon: IC + 'warehouse.svg', route: '/bodegas' },
  { label: 'Calendario', icon: IC + 'calendar.svg', route: '/calendario' },
  {
    label: 'Reportes',
    icon: IC + 'chat-arrow-grow.svg',
    children: [
      { label: 'Descargas', route: '/reportes/descargas' },
      { label: 'Órdenes sin despachar', route: '/reportes/ordenes-sin-despachar' },
      { label: 'Order costs', route: '/reportes/order-costs' },
      { label: 'Collections', route: '/reportes/collections' },
    ],
  },
  {
    label: 'Marca blanca',
    icon: IC + 'page.svg',
    children: [
      { label: 'Brands', route: '/marca-blanca/brands' },
    ],
  },
  { label: 'Ciudades', icon: IC + 'marker.svg', route: '/ciudades' },
  {
    label: 'Soporte',
    icon: IC + 'user-headset.svg',
    children: [
      { label: 'Soporte', route: '/soporte/soporte' },
      { label: 'Topic', route: '/soporte/topic' },
    ],
  },
  {
    label: 'Facturas',
    icon: IC + 'receipt.svg',
    children: [
      { label: 'Facturas', route: '/facturas/facturas' },
      { label: 'Notas de credito', route: '/facturas/notas-de-credito' },
    ],
  },
  {
    label: 'Marketing',
    icon: IC + 'megaphone.svg',
    children: [
      { label: 'Campañas', route: '/marketing/campanas' },
      { label: 'Automatización', route: '/marketing/automatizacion' },
      { label: 'Configuraciones', route: '/marketing/configuraciones' },
      { label: 'Buscador de anuncios', route: '/marketing/buscador-de-anuncios' },
    ],
  },
  { label: 'Comunidades', icon: IC + 'user-community.svg', route: '/comunidades' },
  {
    label: 'CAS',
    icon: IC + 'comments-dots.svg',
    children: [
      { label: 'Bandeja', route: '/cas/bandeja' },
      { label: 'Tickets', route: '/cas/tickets' },
    ],
  },
];

export const SIDEBAR_NAV: Record<UserRole, NavItem[]> = {
  dropshipper: dropshipperNav,
  proveedor: proveedorNav,
  admin: adminNav,
};

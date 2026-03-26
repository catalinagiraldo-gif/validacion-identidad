export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: { label: string; route: string }[];
}

export type UserRole = 'dropshipper' | 'proveedor' | 'admin';

const dropshipperNav: NavItem[] = [
  { label: 'Inicio', icon: 'pi-home', route: '/home' },
  { label: 'Dashboard', icon: 'pi-chart-bar', route: '/dashboard' },
  {
    label: 'Productos',
    icon: 'pi-search',
    children: [
      { label: 'Catálogo', route: '/productos/catalogo' },
      { label: 'Proveedores', route: '/productos/proveedores' },
      { label: 'Negociaciones', route: '/productos/negociaciones' },
      { label: 'Caza productos', route: '/productos/caza-productos' },
      { label: 'Print on demand', route: '/productos/print-on-demand' },
    ],
  },
  {
    label: 'Pedidos',
    icon: 'pi-shopping-cart',
    children: [
      { label: 'Todos los pedidos', route: '/pedidos/todos' },
      { label: 'Novedades', route: '/pedidos/novedades' },
      { label: 'Carritos abandonados', route: '/pedidos/carritos' },
      { label: 'Etiquetas', route: '/pedidos/etiquetas' },
    ],
  },
  {
    label: 'Reportes',
    icon: 'pi-chart-line',
    children: [
      { label: 'Ventas', route: '/reportes/ventas' },
      { label: 'Envíos', route: '/reportes/envios' },
    ],
  },
  {
    label: 'Financiero',
    icon: 'pi-dollar',
    children: [
      { label: 'Wallet', route: '/financiero/wallet' },
      { label: 'Facturas', route: '/financiero/facturas' },
      { label: 'Historial de cartera', route: '/financiero/historial' },
    ],
  },
  {
    label: 'Marketing',
    icon: 'pi-megaphone',
    children: [
      { label: 'Campañas', route: '/marketing/campanas' },
      { label: 'Audiencias', route: '/marketing/audiencias' },
    ],
  },
  { label: 'Dropi Card', icon: 'pi-credit-card', route: '/dropi-card' },
  { label: 'CAS', icon: 'pi-comments', route: '/cas' },
  { label: 'Academy', icon: 'pi-book', route: '/academy' },
  {
    label: 'Configurar',
    icon: 'pi-cog',
    children: [
      { label: 'Mi tienda', route: '/configurar/tienda' },
      { label: 'Integraciones', route: '/configurar/integraciones' },
      { label: 'Notificaciones', route: '/configurar/notificaciones' },
    ],
  },
];

const proveedorNav: NavItem[] = [
  { label: 'Inicio', icon: 'pi-home', route: '/home' },
  { label: 'Dashboard', icon: 'pi-chart-bar', route: '/dashboard' },
  {
    label: 'Productos',
    icon: 'pi-search',
    children: [
      { label: 'Mis productos', route: '/productos/mis-productos' },
      { label: 'Categorías', route: '/productos/categorias' },
    ],
  },
  {
    label: 'Mis pedidos',
    icon: 'pi-shopping-cart',
    children: [
      { label: 'Mis pedidos', route: '/pedidos/mis-pedidos' },
      { label: 'Novedades', route: '/pedidos/novedades' },
      { label: 'Carritos abandonados', route: '/pedidos/carritos' },
      { label: 'Etiquetas', route: '/pedidos/etiquetas' },
      { label: 'Configuración de pedidos', route: '/pedidos/configuracion' },
    ],
  },
  {
    label: 'Mis Garantías',
    icon: 'pi-verified',
    children: [
      { label: 'Garantías activas', route: '/garantias/activas' },
      { label: 'Historial', route: '/garantias/historial' },
    ],
  },
  { label: 'Clientes', icon: 'pi-user-edit', route: '/clientes' },
  { label: 'Mis integraciones', icon: 'pi-shop', route: '/integraciones' },
  { label: 'Historial de cartera', icon: 'pi-history', route: '/historial-cartera' },
  { label: 'Mis usuarios', icon: 'pi-users', route: '/mis-usuarios' },
  { label: 'Mis referidos', icon: 'pi-user-plus', route: '/mis-referidos' },
  {
    label: 'Configuraciones',
    icon: 'pi-cog',
    children: [
      { label: 'General', route: '/configuraciones/general' },
      { label: 'Pasarela de pago', route: '/configuraciones/pasarela' },
    ],
  },
  { label: 'Calendario', icon: 'pi-calendar', route: '/calendario' },
  {
    label: 'Marketing',
    icon: 'pi-megaphone',
    children: [
      { label: 'Campañas', route: '/marketing/campanas' },
      { label: 'Audiencias', route: '/marketing/audiencias' },
    ],
  },
  {
    label: 'Reportes',
    icon: 'pi-chart-line',
    children: [
      { label: 'Ventas', route: '/reportes/ventas' },
      { label: 'Envíos', route: '/reportes/envios' },
    ],
  },
  {
    label: 'Facturas',
    icon: 'pi-receipt',
    children: [
      { label: 'Mis facturas', route: '/facturas/mis-facturas' },
      { label: 'Historial', route: '/facturas/historial' },
    ],
  },
  {
    label: 'Transportadora',
    icon: 'pi-truck',
    children: [
      { label: 'Mis transportadoras', route: '/transportadora/mis-transportadoras' },
      { label: 'Tarifas', route: '/transportadora/tarifas' },
    ],
  },
  { label: 'Dropi Card', icon: 'pi-credit-card', route: '/dropi-card' },
  {
    label: 'CAS',
    icon: 'pi-comments',
    children: [
      { label: 'Tickets', route: '/cas/tickets' },
      { label: 'Chat', route: '/cas/chat' },
    ],
  },
];

const adminNav: NavItem[] = [
  { label: 'Inicio', icon: 'pi-home', route: '/home' },
  { label: 'Dashboard', icon: 'pi-chart-bar', route: '/dashboard' },
  { label: 'Retiro de Saldo', icon: 'pi-money-bill', route: '/retiro-saldo' },
  {
    label: 'Usuarios',
    icon: 'pi-users',
    children: [
      { label: 'Dropshippers', route: '/usuarios/dropshippers' },
      { label: 'Proveedores', route: '/usuarios/proveedores' },
      { label: 'Administradores', route: '/usuarios/admins' },
    ],
  },
  {
    label: 'Transportadora',
    icon: 'pi-truck',
    children: [
      { label: 'Empresas', route: '/transportadora/empresas' },
      { label: 'Tarifas', route: '/transportadora/tarifas' },
      { label: 'Cobertura', route: '/transportadora/cobertura' },
    ],
  },
  { label: 'Categorías de productos', icon: 'pi-th-large', route: '/categorias' },
  { label: 'Productos', icon: 'pi-bookmark', route: '/productos' },
  {
    label: 'Órdenes',
    icon: 'pi-shopping-cart',
    children: [
      { label: 'Todas las órdenes', route: '/ordenes/todas' },
      { label: 'Novedades', route: '/ordenes/novedades' },
      { label: 'Devoluciones', route: '/ordenes/devoluciones' },
    ],
  },
  {
    label: 'Garantías',
    icon: 'pi-verified',
    children: [
      { label: 'Solicitudes', route: '/garantias/solicitudes' },
      { label: 'Historial', route: '/garantias/historial' },
    ],
  },
  {
    label: 'Logistic',
    icon: 'pi-car',
    children: [
      { label: 'Gestión de envíos', route: '/logistic/envios' },
      { label: 'Rutas', route: '/logistic/rutas' },
    ],
  },
  { label: 'Clientes', icon: 'pi-user-edit', route: '/clientes' },
  { label: 'Reel Management', icon: 'pi-ticket', route: '/reel-management' },
  {
    label: 'Configuraciones',
    icon: 'pi-cog',
    children: [
      { label: 'General', route: '/configuraciones/general' },
      { label: 'Plataforma', route: '/configuraciones/plataforma' },
      { label: 'Notificaciones', route: '/configuraciones/notificaciones' },
    ],
  },
  { label: 'Auditorias', icon: 'pi-book', route: '/auditorias' },
  { label: 'Historial de cartera', icon: 'pi-history', route: '/historial-cartera' },
  { label: 'Bodegas', icon: 'pi-warehouse', route: '/bodegas' },
  { label: 'Calendario', icon: 'pi-calendar', route: '/calendario' },
  {
    label: 'Reportes',
    icon: 'pi-chart-line',
    children: [
      { label: 'Ventas', route: '/reportes/ventas' },
      { label: 'Envíos', route: '/reportes/envios' },
      { label: 'Financiero', route: '/reportes/financiero' },
    ],
  },
  {
    label: 'Marca blanca',
    icon: 'pi-file',
    children: [
      { label: 'Configuración', route: '/marca-blanca/configuracion' },
      { label: 'Dominios', route: '/marca-blanca/dominios' },
    ],
  },
  { label: 'Ciudades', icon: 'pi-map-marker', route: '/ciudades' },
  {
    label: 'Soporte',
    icon: 'pi-headphones',
    children: [
      { label: 'Tickets', route: '/soporte/tickets' },
      { label: 'Chat', route: '/soporte/chat' },
    ],
  },
  {
    label: 'Facturas',
    icon: 'pi-receipt',
    children: [
      { label: 'Todas las facturas', route: '/facturas/todas' },
      { label: 'Pendientes', route: '/facturas/pendientes' },
    ],
  },
  {
    label: 'Marketing',
    icon: 'pi-megaphone',
    children: [
      { label: 'Campañas', route: '/marketing/campanas' },
      { label: 'Banners', route: '/marketing/banners' },
    ],
  },
  { label: 'Comunidades', icon: 'pi-globe', route: '/comunidades' },
  {
    label: 'CAS',
    icon: 'pi-comments',
    children: [
      { label: 'Tickets', route: '/cas/tickets' },
      { label: 'Chat', route: '/cas/chat' },
    ],
  },
];

export const SIDEBAR_NAV: Record<UserRole, NavItem[]> = {
  dropshipper: dropshipperNav,
  proveedor: proveedorNav,
  admin: adminNav,
};

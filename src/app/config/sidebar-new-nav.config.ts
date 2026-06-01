/**
 * Sidebar New Architecture — Navigation Config
 * Source of truth: Figma DS (ONiVQJJ2qrJ6tmJnpNrrKE) node 10766:30631
 * Role: Dropshipper
 * DO NOT modify without updating from Figma first.
 */

export interface NewNavChild {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  badge?: 'nuevo' | 'beta';
  children?: NewNavChild[];
}

export interface NewNavItem {
  id: string;
  label: string;
  icon: string;
  iconSvg?: string;
  route?: string;
  badge?: 'nuevo' | 'beta';
  notificationDot?: boolean;
  children?: NewNavChild[];
  section?: 'main' | 'secondary';
}

export const SIDEBAR_NEW_NAV: NewNavItem[] = [
  // --- Main modules ---
  {
    id: 'home',
    label: 'Home',
    icon: 'pi pi-home',
    iconSvg: 'assets/icons/sidebar-new/home.svg',
    section: 'main',
    children: [
      { id: 'prototipos', label: 'Prototipos', icon: 'pi pi-th-large', route: '/new/prototipos' },
      { id: 'home-inicio', label: 'Inicio', icon: 'pi pi-home', route: '/new/home' },
    ],
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'pi pi-chart-bar',
    iconSvg: 'assets/icons/sidebar-new/dashboard.svg',
    section: 'main',
    children: [
      { id: 'dashboard-main', label: 'Dashboard', icon: 'pi pi-chart-bar', route: '/new/dashboard' },
      { id: 'dashboard-productos', label: 'Productos', icon: 'pi pi-box', route: '/new/dashboard/productos' },
      { id: 'dashboard-clientes', label: 'Clientes', icon: 'pi pi-users', route: '/new/dashboard/clientes' },
      { id: 'dashboard-calendario', label: 'Calendario', icon: 'pi pi-calendar', route: '/new/dashboard/calendario' },
      { id: 'dashboard-descargas', label: 'Descargas', icon: 'pi pi-download', route: '/new/dashboard/descargas' },
    ],
  },
  {
    id: 'productos',
    label: 'Productos',
    icon: 'pi pi-search',
    iconSvg: 'assets/icons/sidebar-new/productos.svg',
    notificationDot: true,
    section: 'main',
    children: [
      {
        id: 'catalogo',
        label: 'Catalogo',
        icon: 'pi pi-th-large',
        children: [
          { id: 'catalogo-productos', label: 'Productos', route: '/new/productos/catalogo' },
          { id: 'catalogo-proveedores', label: 'Proveedores', route: '/new/productos/proveedores' },
        ],
      },
      {
        id: 'negociaciones',
        label: 'Negociaciones',
        icon: 'pi pi-link',
        route: '/new/productos/negociaciones',
        badge: 'nuevo',
      },
      {
        id: 'cazaproductos',
        label: 'Cazaproductos',
        icon: 'pi pi-bullseye',
        route: '/new/productos/caza-productos',
        badge: 'beta',
      },
    ],
  },
  {
    id: 'pedidos',
    label: 'Pedidos',
    icon: 'pi pi-shopping-cart',
    iconSvg: 'assets/icons/sidebar-new/pedidos.svg',
    section: 'main',
    children: [
      { id: 'ordenes', label: 'Ordenes', icon: 'pi pi-list', route: '/new/mis-pedidos/mis-pedidos' },
      { id: 'novedades', label: 'Novedades', icon: 'pi pi-bell', route: '/new/mis-pedidos/novedades' },
      {
        id: 'garantias-group',
        label: 'Garantias',
        icon: 'pi pi-shield',
        children: [
          { id: 'garantias', label: 'Garantias', route: '/new/mis-garantias/garantias' },
          { id: 'ordenes-despacho', label: 'Ordenes de despacho', route: '/new/mis-garantias/ordenes-de-despacho' },
          { id: 'garantias-recolecciones', label: 'Garantias recolecciones', route: '/new/mis-garantias/garantias-recolecciones' },
        ],
      },
      {
        id: 'preferencias-group',
        label: 'Preferencias',
        icon: 'pi pi-sliders-h',
        children: [
          { id: 'validador-direcciones', label: 'Validador de direcciones', route: '/new/mis-pedidos/validador-direcciones' },
          { id: 'etiquetas', label: 'Etiquetas', route: '/new/mis-pedidos/etiquetas' },
        ],
      },
    ],
  },
  {
    id: 'logistica',
    label: 'Logistica',
    icon: 'pi pi-box',
    iconSvg: 'assets/icons/sidebar-new/logistica.svg',
    section: 'main',
    children: [
      { id: 'transportadoras', label: 'Transportadoras', icon: 'pi pi-truck', route: '/new/transportadora/preferencias' },
      { id: 'torre-logistica', label: 'Torre logistica', icon: 'pi pi-building', route: '/new/reportes/torre-logistica' },
    ],
  },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: 'pi pi-chart-line',
    iconSvg: 'assets/icons/sidebar-new/reportes.svg',
    route: '/new/reportes',
    section: 'main',
  },
  {
    id: 'financiero',
    label: 'Financiero',
    icon: 'pi pi-dollar',
    iconSvg: 'assets/icons/sidebar-new/financiero.svg',
    route: '/new/historial-de-cartera',
    section: 'main',
  },
  {
    id: 'dropicard',
    label: 'Dropicard',
    icon: 'pi pi-credit-card',
    iconSvg: 'assets/icons/sidebar-new/dropicard.svg',
    route: '/new/dropi-card/cards',
    section: 'main',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: 'pi pi-megaphone',
    iconSvg: 'assets/icons/sidebar-new/marketing.svg',
    route: '/new/marketing',
    section: 'main',
  },
  // --- Secondary modules (below separator) ---
  {
    id: 'cas',
    label: 'CAS',
    icon: 'pi pi-headphones',
    iconSvg: 'assets/icons/sidebar-new/cas.svg',
    route: '/new/cas/bandeja',
    section: 'secondary',
  },
  {
    id: 'academy',
    label: 'Academy',
    icon: 'pi pi-book',
    iconSvg: 'assets/icons/sidebar-new/academy.svg',
    route: '/new/academy',
    section: 'secondary',
  },
  {
    id: 'configurar',
    label: 'Configurar',
    icon: 'pi pi-cog',
    iconSvg: 'assets/icons/sidebar-new/configurar.svg',
    route: '/new/configuraciones',
    section: 'secondary',
  },
];

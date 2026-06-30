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
    // icon asset reused from the old "Dashboard" shortcut (Figma calls it chart-bars-grow);
    // swap for the real chart-bars-grow SVG once pulled from Figma
    id: 'reportes',
    label: 'Reportes',
    icon: 'pi pi-chart-bar',
    iconSvg: 'assets/icons/sidebar-new/dashboard.svg',
    section: 'main',
    children: [
      { id: 'reportes-dashboard', label: 'Dashboard', icon: 'pi pi-chart-bar', route: '/new/dashboard' },
      { id: 'reportes-productos', label: 'Productos', icon: 'pi pi-box', route: '/new/dashboard/productos' },
      { id: 'reportes-clientes', label: 'Clientes', icon: 'pi pi-users', route: '/new/dashboard/clientes' },
      { id: 'reportes-calendario', label: 'Calendario', icon: 'pi pi-calendar', route: '/new/dashboard/calendario' },
      { id: 'reportes-descargas', label: 'Descargas', icon: 'pi pi-download', route: '/new/dashboard/descargas' },
    ],
  },
  {
    id: 'financiero',
    label: 'Financiero',
    icon: 'pi pi-dollar',
    iconSvg: 'assets/icons/sidebar-new/financiero.svg',
    section: 'main',
    children: [
      {
        id: 'fin-wallet',
        label: 'Wallet',
        icon: 'pi pi-wallet',
        children: [
          { id: 'fin-historial-wallet', label: 'Historial de wallet', route: '/new/historial-de-cartera' },
          { id: 'fin-datos-bancarios', label: 'Datos bancarios', route: '/new/financiero/datos-bancarios' },
          { id: 'fin-retiros-saldo', label: 'Retiros de saldo', route: '/new/financiero/retiros-de-saldo' },
        ],
      },
      {
        id: 'fin-facturacion',
        label: 'Facturación Dropi',
        icon: 'pi pi-receipt',
        children: [
          { id: 'fin-datos-facturacion', label: 'Datos de facturación', route: '/new/financiero/datos-facturacion' },
          { id: 'fin-facturas', label: 'Facturas', route: '/new/financiero/facturas' },
          { id: 'fin-notas-credito', label: 'Notas crédito', route: '/new/financiero/notas-credito' },
        ],
      },
      { id: 'fin-dropicard', label: 'Dropicard', icon: 'pi pi-credit-card', route: '/new/dropi-card/cards' },
    ],
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
    section: 'main',
    children: [
      {
        id: 'mkt-sms-correo',
        label: 'SMS y Correo',
        icon: 'pi pi-envelope',
        children: [
          { id: 'mkt-campanas-masivas', label: 'Campañas masivas', route: '/new/marketing/campanas' },
          { id: 'mkt-automatizacion', label: 'Automatización', route: '/new/marketing/automatizacion' },
          { id: 'mkt-configuraciones', label: 'Configuraciones', route: '/new/marketing/configuraciones' },
        ],
      },
      { id: 'mkt-chatea-pro', label: 'Chatea Pro', icon: 'pi pi-comments', route: '/new/marketing/chatea-pro' },
      {
        id: 'mkt-roax',
        label: 'Roax',
        icon: 'pi pi-sparkles',
        children: [
          { id: 'mkt-informes', label: 'Informes', route: '/new/marketing/informes' },
          { id: 'mkt-lanzador-campanas', label: 'Lanzador de campañas', route: '/new/marketing/lanzador-campanas' },
        ],
      },
      { id: 'mkt-creador-paginas', label: 'Creador de páginas', icon: 'pi pi-file', route: '/new/marketing/creador-paginas' },
    ],
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
    section: 'secondary',
    children: [
      {
        id: 'config-cuenta-group',
        label: 'Cuenta',
        icon: 'pi pi-user',
        children: [
          { id: 'config-info-cuenta', label: 'Información de cuenta', route: '/new/configuraciones/cuenta' },
          { id: 'config-seguridad', label: 'Seguridad', route: '/new/configuraciones/seguridad' },
        ],
      },
      { id: 'config-integraciones', label: 'Integraciones', icon: 'pi pi-th-large', route: '/new/configuraciones/integraciones' },
      { id: 'config-referidos', label: 'Referidos', icon: 'pi pi-user-plus', route: '/new/configuraciones/referidos' },
      { id: 'config-tiendas', label: 'Tiendas', icon: 'pi pi-shop', route: '/new/configuraciones/tienda' },
      { id: 'config-usuarios', label: 'Usuarios', icon: 'pi pi-id-card', route: '/new/configuraciones/usuarios' },
      { id: 'config-dropitesters', label: 'Dropi Testers', icon: 'pi pi-shield', route: '/new/configuraciones/dropitesters' },
    ],
  },
];

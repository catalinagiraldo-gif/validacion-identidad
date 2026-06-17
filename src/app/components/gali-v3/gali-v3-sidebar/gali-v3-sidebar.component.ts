import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type IconKey = 'home' | 'catalogo' | 'pedidos' | 'integraciones' | 'landings' |
               'cartera' | 'metricas' | 'soporte' | 'config' | 'academy' |
               'proyectos' | 'vistas' | 'objetivo' | 'comunidad' | 'stack' | 'constructor';

interface NavItem {
  ruta: string;
  label: string;
  icon: IconKey;
  exact?: boolean;
}

@Component({
  selector: 'gali-v3-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './gali-v3-sidebar.component.html',
  styleUrls: ['./gali-v3-sidebar.component.scss'],
})
export class GaliV3SidebarComponent {
  // Sección operación Dropi (alineada al Figma oficial)
  readonly itemsOperacion: NavItem[] = [
    { ruta: '/gali-v3',                 label: 'Inicio',         icon: 'home', exact: true },
    { ruta: '/gali-v3/catalogo',        label: 'Catálogo',       icon: 'catalogo' },
    { ruta: '/gali-v3/pedidos',         label: 'Pedidos',        icon: 'pedidos' },
    { ruta: '/gali-v3/integraciones',   label: 'Integraciones',  icon: 'integraciones' },
    { ruta: '/gali-v3/landings',        label: 'Landings',       icon: 'landings' },
    { ruta: '/gali-v3/cartera',         label: 'Cartera',        icon: 'cartera' },
    { ruta: '/gali-v3/metricas',        label: 'Métricas',       icon: 'metricas' },
  ];

  // Sección Gali (✦ memoria + vistas guardadas + objetivos + comunidad + mi stack)
  readonly itemsGali: NavItem[] = [
    { ruta: '/gali-v3/objetivo',        label: 'Mi Objetivo',  icon: 'objetivo' },
    { ruta: '/gali-v3/comunidad',       label: 'Comunidad',    icon: 'comunidad' },
    { ruta: '/gali-v3/mi-stack',        label: 'Mi Stack',     icon: 'stack' },
    { ruta: '/gali-v3/bloque-builder',  label: 'Constructor',  icon: 'constructor' },
    { ruta: '/gali-v3/proyectos',       label: 'Proyectos',    icon: 'proyectos' },
    { ruta: '/gali-v3/vistas',          label: 'Vistas',       icon: 'vistas' },
  ];

  // Sección footer
  readonly itemsFooter: NavItem[] = [
    { ruta: '/gali-v3/academy', label: 'Academy', icon: 'academy' },
    { ruta: '/gali-v3/soporte', label: 'Soporte', icon: 'soporte' },
    { ruta: '/gali-v3/config',  label: 'Ajustes', icon: 'config' },
  ];
}

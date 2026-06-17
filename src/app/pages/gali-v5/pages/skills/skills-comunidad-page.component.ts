import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface CommunitySkill {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'Operación' | 'Lanzamiento' | 'Experto' | 'Premium';
  secciones: string[];
  uses: string;
  rating: number;
  forks: number;
  comments: number;
  autor: string;
  handle?: string;
  autorBio?: string;
  autorAvatar: string;
  autorColor: string;
  verificado: boolean;
  tag?: string;
}

@Component({
  selector: 'app-skills-comunidad-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './skills-comunidad-page.component.html',
  styleUrl: './skills-comunidad-page.component.scss',
})
export class SkillsComunidadPageComponent {
  private router = inject(Router);

  readonly activeTab = signal<'populares' | 'por-seccion' | 'expertos' | 'nuevas'>('populares');
  readonly activeSectionFilter = signal<string | null>(null);
  readonly searchQuery = signal('');
  readonly showShareModal = signal(false);
  readonly shareDone = signal(false);

  readonly sectionFilters = ['Pedidos', 'Marketing', 'Finanzas', 'Logística', 'Productos', 'CAS'];

  readonly allSkills: CommunitySkill[] = [
    {
      id: 'pop-1', nombre: 'Auto-pausa CTR bajo', tipo: 'Operación',
      secciones: ['Marketing'], uses: '3.4k', rating: 4.9, forks: 312, comments: 48,
      descripcion: 'Pausa la campaña activa cuando el CTR cae por debajo del 0.8% durante 48h y notifica con diagnóstico.',
      autor: 'Dropi Team', autorAvatar: 'DT', autorColor: '#f49a3d', verificado: true, tag: 'Top usado',
    },
    {
      id: 'pop-2', nombre: 'P&L real vs ROAS declarado', tipo: 'Operación',
      secciones: ['Finanzas', 'Marketing'], uses: '2.1k', rating: 4.8, forks: 189, comments: 37,
      descripcion: 'Detecta discrepancias entre el ROAS reportado en Meta y el P&L real descontando flete, novedades y COGS.',
      autor: 'Dropi Team', autorAvatar: 'DT', autorColor: '#f49a3d', verificado: true,
    },
    {
      id: 'pop-3', nombre: 'Smart routing novedad Cali', tipo: 'Operación',
      secciones: ['Logística', 'Pedidos'], uses: '1.8k', rating: 4.7, forks: 134, comments: 22,
      descripcion: 'Reasigna pedidos automáticamente a la transportadora con menor novedad cuando un umbral regional supera el 10%.',
      autor: 'Dropi Team', autorAvatar: 'DT', autorColor: '#f49a3d', verificado: true,
    },
    {
      id: 'pop-4', nombre: 'Auto-confirmación pedidos verdes', tipo: 'Operación',
      secciones: ['Pedidos'], uses: '4.5k', rating: 4.9, forks: 401, comments: 67,
      descripcion: 'Confirma automáticamente pedidos con huella verde sin intervención del dropshipper. Ahorra 30-45 min/día.',
      autor: 'Dropi Team', autorAvatar: 'DT', autorColor: '#f49a3d', verificado: true, tag: 'Más popular',
    },
    {
      id: 'exp-1', nombre: 'Scaling vertical — 20% cada 48h', tipo: 'Experto',
      secciones: ['Marketing'], uses: '847', rating: 4.9, forks: 203, comments: 34,
      descripcion: 'Escala presupuesto +20% cada 48h si el ROAS se mantiene sobre el objetivo. Con límites inteligentes y rollback automático.',
      autor: 'Alejandro Torres', handle: '@AlejandroTorres',
      autorBio: 'Dropshipper top · 1.200+ ventas/mes · 3 años en Dropi',
      autorAvatar: 'AT', autorColor: '#f97316', verificado: true,
    },
    {
      id: 'exp-2', nombre: 'P&L simplificado para declarar', tipo: 'Experto',
      secciones: ['Finanzas'], uses: '623', rating: 4.7, forks: 118, comments: 19,
      descripcion: 'Calcula automáticamente tu utilidad real descontando flete, novedad, pauta y COGS. Compatible con declaración de renta.',
      autor: 'Carlos Pérez CPA', handle: '@ContadorDropi',
      autorBio: 'Contador certificado · especialista en dropshipping',
      autorAvatar: 'CP', autorColor: '#3b82f6', verificado: true,
    },
    {
      id: 'exp-3', nombre: 'Bundle mascotas: 5 productos ganadores', tipo: 'Experto',
      secciones: ['Productos'], uses: '412', rating: 4.6, forks: 76, comments: 12,
      descripcion: 'Alerta cuando los 5 productos clave del nicho mascotas tienen ventana simultánea. Incluye configuración de scoring.',
      autor: 'María Gómez', handle: '@PetDropper',
      autorBio: 'Nicho mascotas · Top seller noviembre 2025',
      autorAvatar: 'MG', autorColor: '#10b981', verificado: false,
    },
    {
      id: 'exp-4', nombre: 'CAS → Recuperación carrito abandonado', tipo: 'Experto',
      secciones: ['CAS', 'Marketing'], uses: '389', rating: 4.8, forks: 91, comments: 27,
      descripcion: 'Secuencia de 3 mensajes WhatsApp: recordatorio suave → urgencia → oferta final. Personalizado con nombre del producto.',
      autor: 'Luis Vargas', handle: '@ChateaProLuis',
      autorBio: 'Chatea Pro power user · tasa recuperación 38%',
      autorAvatar: 'LV', autorColor: '#8b5cf6', verificado: true,
    },
    {
      id: 'new-1', nombre: 'Confirmación inteligente pedidos', tipo: 'Operación',
      secciones: ['Pedidos'], uses: '312', rating: 4.5, forks: 28, comments: 8,
      descripcion: 'Confirma pedidos con huella verde automáticamente en el horario que configures.',
      autor: 'Dropi Team', autorAvatar: 'DT', autorColor: '#f49a3d', verificado: true, tag: 'Nuevo',
    },
    {
      id: 'new-2', nombre: 'Detector de productos trending', tipo: 'Operación',
      secciones: ['Productos'], uses: '198', rating: 4.4, forks: 14, comments: 5,
      descripcion: 'Detecta productos con tendencia creciente en Dropi LATAM antes de que saturen el mercado.',
      autor: 'Equipo ADA Spy', autorAvatar: 'AS', autorColor: '#818cf8', verificado: true, tag: 'Nuevo',
    },
    {
      id: 'new-3', nombre: 'Anti-fatiga de audiencia', tipo: 'Operación',
      secciones: ['Marketing'], uses: '445', rating: 4.6, forks: 39, comments: 11,
      descripcion: 'Rota creativos automáticamente cuando la frecuencia supera 2.5x para evitar saturación.',
      autor: 'Roax Team', autorAvatar: 'RX', autorColor: '#f97316', verificado: true, tag: 'Nuevo',
    },
  ];

  readonly filteredSkills = computed(() => {
    const tab = this.activeTab();
    const section = this.activeSectionFilter();
    const q = this.searchQuery().toLowerCase();

    let skills = this.allSkills;

    if (q) {
      skills = skills.filter(s =>
        s.nombre.toLowerCase().includes(q) ||
        s.descripcion.toLowerCase().includes(q) ||
        s.secciones.some(sec => sec.toLowerCase().includes(q))
      );
    }

    if (section) {
      skills = skills.filter(s => s.secciones.includes(section));
    }

    if (tab === 'populares') {
      return skills.filter(s => s.tipo === 'Operación').sort((a, b) => parseInt(b.uses) - parseInt(a.uses));
    }
    if (tab === 'expertos') {
      return skills.filter(s => s.tipo === 'Experto');
    }
    if (tab === 'nuevas') {
      return skills.filter(s => s.tag === 'Nuevo');
    }
    // por-seccion: all
    return skills;
  });

  setSection(section: string | null): void {
    this.activeSectionFilter.set(section);
    this.activeTab.set('por-seccion');
  }

  activateSkill(id: string): void {
    this.router.navigate(['/gali-v5/skills/nueva'], { queryParams: { base: id } });
  }

  forkSkill(id: string): void {
    this.router.navigate(['/gali-v5/skills/nueva'], { queryParams: { fork: id } });
  }

  openShareModal(): void {
    this.showShareModal.set(true);
  }

  confirmShare(): void {
    this.showShareModal.set(false);
    this.shareDone.set(true);
    setTimeout(() => this.shareDone.set(false), 4000);
  }

  goToMySkills(): void {
    this.router.navigate(['/gali-v5/skills']);
  }
}

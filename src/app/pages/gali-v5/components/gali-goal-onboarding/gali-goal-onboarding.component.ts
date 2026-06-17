import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

const STORAGE_KEY = 'gali_goal_configured';

interface GoalOption {
  id: string;
  label: string;
  icon: string;
  agente: 'vigilante' | 'roax' | 'chatea' | 'ada';
}

const GOAL_OPTIONS: GoalOption[] = [
  { id: 'primer-millon', label: 'Llegar a mi primer millón en ganancias este mes', icon: '💰', agente: 'roax' },
  { id: 'escalar-pedidos', label: 'Escalar de 20 a 50 pedidos por semana', icon: '📈', agente: 'vigilante' },
  { id: 'primer-producto', label: 'Lanzar mi primer producto ganador', icon: '🚀', agente: 'ada' },
  { id: 'automatizar', label: 'Automatizar mi operación para trabajar menos horas', icon: '⚡', agente: 'vigilante' },
];

const AGENT_MAP: Record<string, { nombre: string; color: string; desc: string }> = {
  vigilante: { nombre: 'Vigilante', color: '#fbbf24', desc: 'protege tus pedidos y detecta novedades antes de que te dañen' },
  roax: { nombre: 'Roax', color: '#f97316', desc: 'gestiona tus campañas en Meta para que tu producto llegue a las personas correctas' },
  ada: { nombre: 'ADA Spy', color: '#818cf8', desc: 'analiza el mercado y encuentra el producto con mayor oportunidad de éxito' },
  chatea: { nombre: 'Chatea Pro', color: '#34d399', desc: 'responde a tus clientes automáticamente y cierra más ventas' },
};

interface DayOneStep {
  num: string;
  title: string;
  desc: string;
  cta: string;
  route: string;
}

export function shouldShowOnboarding(): boolean {
  return !localStorage.getItem(STORAGE_KEY);
}

@Component({
  selector: 'gali-goal-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali-goal-onboarding.component.html',
  styleUrl: './gali-goal-onboarding.component.scss',
})

export class GaliGoalOnboardingComponent {
  private readonly ws = inject(GaliWorkspaceService);
  private readonly router = inject(Router);

  readonly closed = output<void>();

  readonly step = signal<1 | 2 | 3 | 4>(1);
  readonly selectedGoal = signal<GoalOption | null>(null);
  readonly pedidosPerWeek = signal(20);
  readonly mesesOperando = signal<string>('1-6');
  readonly customGoal = signal('');
  readonly showCustom = signal(false);

  readonly goalOptions = GOAL_OPTIONS;

  get recommendedAgent(): { nombre: string; color: string; desc: string } | null {
    const g = this.selectedGoal();
    return g ? AGENT_MAP[g.agente] : null;
  }

  get pedidosLabel(): string {
    const v = this.pedidosPerWeek();
    if (v <= 5) return '0–5 pedidos';
    if (v <= 20) return `~${v} pedidos`;
    if (v <= 50) return `~${v} pedidos`;
    if (v <= 100) return `~${v} pedidos`;
    return '100+ pedidos';
  }

  selectGoal(g: GoalOption): void {
    this.selectedGoal.set(g);
    this.showCustom.set(false);
  }

  selectCustom(): void {
    this.selectedGoal.set(null);
    this.showCustom.set(true);
  }

  goToStep2(): void {
    if (this.selectedGoal() || this.customGoal().trim()) {
      this.step.set(2);
    }
  }

  goToStep3(): void {
    this.step.set(3);
  }

  goToStep4(): void {
    this.step.set(4);
  }

  get dayOneSteps(): DayOneStep[] {
    const g = this.selectedGoal();
    if (!g || g.id === 'primer-producto' || g.id === 'primer-millon') {
      return [
        { num: '1', title: 'Busca tu primer producto ganador', desc: 'ADA Spy analiza tendencias del mercado colombiano y te muestra los 3 mejores productos ahora mismo.', cta: 'Abrir ADA Spy →', route: '/gali-v5/productos/caza-productos' },
        { num: '2', title: 'Crea tu primer proyecto', desc: 'Define precio, costo y objetivo de pedidos. Gali calcula el ROAS mínimo y activa las skills de protección.', cta: 'Nuevo proyecto →', route: '/gali-v5/proyectos/nuevo' },
        { num: '3', title: 'Activa Modo Operar', desc: 'Vigilante monitorea tus pedidos 24/7. Cuando algo requiera tu atención, te llegará una señal en el Hub.', cta: 'Ver Hub →', route: '/gali-v5' },
      ];
    }
    if (g.id === 'escalar-pedidos') {
      return [
        { num: '1', title: 'Revisa el P&L real de tus campañas', desc: 'Antes de escalar, necesitas saber tu ROAS real (no el declarado). Gali ya tiene los datos — solo abre el dashboard.', cta: 'Ver P&L →', route: '/gali-v5/reportes/dashboard-financiero' },
        { num: '2', title: 'Activa las reglas de escalamiento de Roax', desc: 'ROAS > objetivo × 1.3 por 48h → escalar +20%. Están listas — solo actívalas en la página de Reglas.', cta: 'Ver reglas →', route: '/gali-v5/reglas' },
        { num: '3', title: 'Configura Smart Routing en Logística', desc: 'Vigilante sugiere automáticamente la mejor transportadora por ciudad. Actívalo una vez y olvídate.', cta: 'Torre logística →', route: '/gali-v5/logistica/torre-logistica' },
      ];
    }
    return [
      { num: '1', title: 'Activa las reglas de automatización', desc: 'Confirmación automática, WhatsApp inteligente y routing de novedades. 3 reglas que ahorran 2h/día.', cta: 'Ver reglas →', route: '/gali-v5/reglas' },
      { num: '2', title: 'Configura el alcance del Autopilot', desc: 'Dile a Gali exactamente qué puede hacer sin pedirte permiso. Presupuesto máx, transportadora segura, WhatsApp.', cta: 'Configurar Autopilot →', route: '/gali-v5' },
      { num: '3', title: 'Crea tu primera Skill personalizada', desc: 'Si una regla se queda corta, una Skill tiene historial, métricas de impacto y puede afectar múltiples módulos.', cta: 'Crear Skill →', route: '/gali-v5/skills/nueva' },
    ];
  }

  goToDayOneStep(step: DayOneStep): void {
    this.finish();
    this.router.navigate([step.route]);
  }

  activateAgent(): void {
    this.finish();
  }

  skip(): void {
    this.finish();
  }

  private finish(): void {
    localStorage.setItem(STORAGE_KEY, '1');
    const g = this.selectedGoal();
    if (g) {
      localStorage.setItem('gali_goal_label', g.label);
      localStorage.setItem('gali_goal_pedidos_target', String(this.pedidosPerWeek()));
    }
    this.closed.emit();
  }
}

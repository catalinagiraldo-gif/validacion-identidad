import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AwakenOverlayComponent, AwakenSuggestion } from '../../../components/gali-v3/shared/awaken-overlay.component';

interface LegacyConfig {
  section: 'CAS' | 'Academy' | 'Dropi Card';
  icon: string;
  title: string;
  intro: string;
  resumen: string;
  suggestions: AwakenSuggestion[];
  preview: { tipo: 'cas' | 'academy' | 'dropi-card' };
}

const CONFIGS: Record<string, LegacyConfig> = {
  cas: {
    section: 'CAS',
    icon: '💬',
    title: 'Bandeja CAS · soporte',
    intro: 'Esta sección sigue como la conoces. Gali no la reemplaza — la acompaña con un asistente que vive a la derecha.',
    resumen: 'Tienes 3 tickets abiertos: 1 con cliente (Carolina · Bogotá) que pide cambio de talla, 1 con proveedor por novedad logística, 1 espera tu respuesta hace 4 horas.',
    suggestions: [
      { icon: '⚡', label: 'Triagear tickets con Gali', meta: 'agente clasifica por urgencia', prompt: 'Triagea mis tickets CAS por urgencia', route: '/gali-v3/mercado/agente/ag-2' },
      { icon: '✍️', label: 'Borrador respuesta cliente Carolina', meta: 'usa tono empático histórico', prompt: 'Redacta respuesta empática para Carolina sobre cambio de talla' },
      { icon: '📊', label: 'Resumen semanal CAS', meta: 'tickets resueltos · tiempo promedio', prompt: 'Genera reporte semanal de CAS' },
    ],
    preview: { tipo: 'cas' },
  },
  academy: {
    section: 'Academy',
    icon: '🎓',
    title: 'Centro de formación',
    intro: 'Academy sigue siendo la fuente del contenido. Gali te sugiere lo que más sirve a tu momento, no a todos.',
    resumen: 'Tu nivel actual: operador. Recomiendo 3 cursos basados en tu nicho (mascotas) y tu meta (ROAS 3x). El más urgente: "Escalar campañas Meta sin baneos" — 18 min.',
    suggestions: [
      { icon: '🚀', label: 'Curso: Escalar Meta sin baneos', meta: '18 min · alta prioridad para ti', prompt: 'Inscríbeme al curso "Escalar Meta sin baneos"' },
      { icon: '✍️', label: 'Curso: Copies con data LATAM', meta: '12 min · clave para tu nicho', prompt: 'Inscríbeme al curso de copies LATAM' },
      { icon: '🎯', label: 'Mentor virtual', meta: 'agente Líder de Comunidad', prompt: 'Activa el agente Líder de Comunidad' },
    ],
    preview: { tipo: 'academy' },
  },
  'dropi-card': {
    section: 'Dropi Card',
    icon: '💳',
    title: 'Tarjetas Dropi Card',
    intro: 'Gestión sigue igual. Gali analiza tu uso y sugiere si te conviene cambiar de plan o pedir aumento de cupo.',
    resumen: 'Has usado el 78% de tu cupo este mes. Tu patrón: gastos altos jueves-viernes. Calificas para aumento de cupo +50% si tu wallet sostiene ingresos > $3M/mes (estás en $3.68M).',
    suggestions: [
      { icon: '📈', label: 'Solicitar aumento de cupo', meta: 'calificas con tu patrón actual', prompt: 'Inicia solicitud de aumento de cupo Dropi Card' },
      { icon: '🛡', label: 'Alerta gasto inusual', meta: 'flow auto · te avisa si gasto > histórico', prompt: 'Crea flow de alerta de gasto inusual en Dropi Card', route: '/gali-v3/builder' },
      { icon: '💡', label: 'Comparar planes', meta: 'cuál te sirve más', prompt: 'Compara planes de Dropi Card según mi uso' },
    ],
    preview: { tipo: 'dropi-card' },
  },
};

@Component({
  selector: 'app-gali-v3-legacy-host',
  standalone: true,
  imports: [CommonModule, RouterModule, AwakenOverlayComponent],
  templateUrl: './legacy-host.component.html',
  styleUrls: ['./legacy-host.component.scss'],
})
export class GaliV3LegacyHostComponent {
  private route = inject(ActivatedRoute);

  configKey = toSignal(
    this.route.data.pipe(map(d => d['legacy'] as keyof typeof CONFIGS)),
    { initialValue: this.route.snapshot.data['legacy'] as keyof typeof CONFIGS },
  );

  config = computed<LegacyConfig | null>(() => {
    const k = this.configKey();
    return k ? CONFIGS[k] : null;
  });
}

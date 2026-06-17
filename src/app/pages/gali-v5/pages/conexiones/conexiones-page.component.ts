import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type NodeStatus = 'connected' | 'disconnected' | 'pending';

interface GraphNode {
  id: string;
  label: string;
  emoji: string;
  status: NodeStatus;
  agente?: string;
  agenteColor?: string;
  categoria: string;
  // Detail panel data
  desc: string;
  metricas?: Array<{ label: string; val: string }>;
  permisos?: string[];
  impacto: string;
  ctaLabel: string;
  ctaRoute?: string;
  urgente?: boolean;
}

@Component({
  selector: 'app-conexiones-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './conexiones-page.component.html',
  styleUrl: './conexiones-page.component.scss',
})
export class ConexionesPageComponent {
  readonly selectedNode = signal<GraphNode | null>(null);

  readonly agentNodes: GraphNode[] = [
    {
      id: 'roax',
      label: 'Roax',
      emoji: '📣',
      status: 'connected',
      agenteColor: '#f97316',
      categoria: 'Agente',
      desc: 'Agente especializado en media buying. Gestiona tus campañas en Meta Ads automáticamente.',
      metricas: [
        { label: 'ROAS promedio', val: '2.9x' },
        { label: 'Campañas activas', val: '3' },
        { label: 'Acciones esta semana', val: '18' },
      ],
      permisos: ['leer campañas', 'crear campañas', 'modificar presupuesto', 'pausar anuncios'],
      impacto: 'El 40% de tus novedades absorben la diferencia ROAS Meta vs. Dropi.',
      ctaLabel: 'Ver Roax →',
      ctaRoute: '/gali-v5/marketing/roax-informes',
    },
    {
      id: 'vigilante',
      label: 'Vigilante',
      emoji: '🛡️',
      status: 'connected',
      agenteColor: '#fbbf24',
      categoria: 'Agente',
      desc: 'Monitorea tus pedidos 24/7. Detecta novedades y cambia transportadoras automáticamente.',
      metricas: [
        { label: 'Pedidos protegidos', val: '47' },
        { label: 'Redireccionamientos', val: '12' },
        { label: 'Novedades resueltas', val: '8' },
      ],
      permisos: ['leer pedidos', 'reasignar transportadora', 'enviar alertas'],
      impacto: 'Reducción del 60% en pérdidas por novedades no atendidas.',
      ctaLabel: 'Ver logística →',
      ctaRoute: '/gali-v5/logistica/novedades',
    },
    {
      id: 'chatea',
      label: 'Chatea Pro',
      emoji: '💬',
      status: 'connected',
      agenteColor: '#34d399',
      categoria: 'Agente',
      desc: 'Gestiona la comunicación con clientes por WhatsApp. Confirma pedidos, recupera carritos.',
      metricas: [
        { label: 'Mensajes hoy', val: '47' },
        { label: 'Tasa respuesta', val: '89%' },
        { label: 'Novedades resueltas', val: '8' },
      ],
      permisos: ['enviar mensajes', 'leer conversaciones', 'crear plantillas'],
      impacto: 'La confirmación automática reduce 60% del tiempo operativo.',
      ctaLabel: 'Ver Chatea Pro →',
      ctaRoute: '/gali-v5/marketing/chatea-pro',
    },
    {
      id: 'ada',
      label: 'ADA Spy',
      emoji: '🔍',
      status: 'connected',
      agenteColor: '#818cf8',
      categoria: 'Agente',
      desc: 'Monitorea tendencias, nichos y saturación de mercado en LATAM en tiempo real.',
      metricas: [
        { label: 'Oportunidades activas', val: '3' },
        { label: 'Score promedio', val: '78/100' },
        { label: 'Ventana detectada', val: '10–28 días' },
      ],
      permisos: ['leer datos de mercado', 'analizar tendencias', 'enviar alertas'],
      impacto: 'Identifica el producto correcto antes que la competencia.',
      ctaLabel: 'Ver oportunidades →',
      ctaRoute: '/gali-v5/productos/caza-productos',
    },
  ];

  readonly platformNodes: GraphNode[] = [
    {
      id: 'meta-ads',
      label: 'Meta Ads',
      emoji: '📘',
      status: 'connected',
      agente: 'roax',
      agenteColor: '#f97316',
      categoria: 'Publicidad',
      desc: 'Roax lanza, pausa y optimiza campañas directamente en Meta Ads.',
      metricas: [
        { label: 'ROAS Meta', val: '3.1x' },
        { label: 'ROAS Gali real', val: '2.9x' },
        { label: 'Discrepancia', val: '-0.2x' },
      ],
      permisos: ['leer campañas', 'crear campañas', 'modificar presupuesto', 'pausar'],
      impacto: 'El 40% de la diferencia ROAS se explica por novedades en Cali los lunes.',
      ctaLabel: 'Ver análisis de discrepancia →',
      ctaRoute: '/gali-v5/marketing/roax-informes',
    },
    {
      id: 'tiktok-ads',
      label: 'TikTok Ads',
      emoji: '🎵',
      status: 'disconnected',
      agente: 'roax',
      agenteColor: '#f97316',
      categoria: 'Publicidad',
      desc: 'Conecta TikTok para que Roax gestione campañas en el canal de mayor crecimiento LATAM.',
      impacto: 'Acceso a audiencias más jóvenes y menor CPA que Meta.',
      ctaLabel: 'Conectar TikTok',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Business',
      emoji: '💚',
      status: 'connected',
      agente: 'chatea',
      agenteColor: '#34d399',
      categoria: 'Comunicación',
      desc: 'Chatea Pro confirma pedidos, gestiona novedades y recupera carritos automáticamente.',
      metricas: [
        { label: 'Número activo', val: '+57 310 XXX XXXX' },
        { label: 'Mensajes hoy', val: '47' },
        { label: 'Reglas activas', val: '3' },
      ],
      permisos: ['enviar mensajes', 'leer conversaciones'],
      impacto: 'Confirmación automática reduce 60% del tiempo operativo.',
      ctaLabel: 'Ver flujos activos →',
      ctaRoute: '/gali-v5/marketing/chatea-pro',
    },
    {
      id: 'google-drive',
      label: 'Google Drive',
      emoji: '📁',
      status: 'disconnected',
      categoria: 'Archivos',
      desc: 'Conecta Drive para que Gali acceda a tus creativos, fichas de producto y contratos.',
      impacto: 'Roax puede seleccionar creativos directamente al lanzar una campaña.',
      ctaLabel: 'Conectar Google Drive',
    },
    {
      id: 'page-pilot',
      label: 'Page Pilot',
      emoji: '🌐',
      status: 'pending',
      agente: 'roax',
      agenteColor: '#f97316',
      categoria: 'Landing Pages',
      desc: 'Conecta Page Pilot para que Gali genere y publique landing pages automáticamente.',
      impacto: 'Gali crea la landing page en segundos al lanzar un nuevo producto.',
      ctaLabel: 'Configurar Page Pilot',
    },
    {
      id: 'siigo',
      label: 'Siigo',
      emoji: '🧾',
      status: 'disconnected',
      categoria: 'Contabilidad',
      desc: 'Gali te guía paso a paso: conecta Siigo, define reglas (solo Entregado) y automatiza facturación masiva.',
      impacto: '28 pedidos entregados esta semana sin facturar. Riesgo de incumplimiento fiscal.',
      ctaLabel: 'Conectar Siigo paso a paso →',
      ctaRoute: '/gali-v5/financiero/datos-facturacion',
      urgente: true,
    },
  ];

  selectNode(node: GraphNode): void {
    if (this.selectedNode()?.id === node.id) {
      this.selectedNode.set(null);
    } else {
      this.selectedNode.set(node);
    }
  }

  get connectedCount(): number {
    return [...this.agentNodes, ...this.platformNodes].filter(n => n.status === 'connected').length;
  }

  get urgentCount(): number {
    return this.platformNodes.filter(n => n.urgente && n.status !== 'connected').length;
  }

  statusLabel(status: NodeStatus): string {
    if (status === 'connected') return '● Conectado';
    if (status === 'pending') return '⚠ Pendiente';
    return '○ Desconectado';
  }

  statusColor(status: NodeStatus): string {
    if (status === 'connected') return '#22c55e';
    if (status === 'pending') return '#f59e0b';
    return '#9ca3af';
  }
}

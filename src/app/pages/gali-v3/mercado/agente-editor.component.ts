import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GaliMarketplaceService } from '../../../services/gali-v3/marketplace.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { GaliFlowService } from '../../../services/gali-v3/flow.service';
import { ProximosPasosComponent } from '../../../components/gali-v3/shared/proximos-pasos.component';

interface Tool { id: string; label: string; icon: string; connected: boolean; }

@Component({
  selector: 'app-gali-v3-agente-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent],
  templateUrl: './agente-editor.component.html',
  styleUrls: ['./agente-editor.component.scss'],
})
export class GaliV3AgenteEditorComponent {
  private marketSvc = inject(GaliMarketplaceService);
  private chatSvc = inject(GaliChatService);
  private flowSvc = inject(GaliFlowService);
  private router = inject(Router);

  // Form state
  nombre = signal('');
  tagline = signal('');
  descripcion = signal('');
  icon = signal('🤖');
  color = signal<'rust' | 'sage' | 'terracota' | 'amber'>('terracota');
  triggerKey = signal<string>('');
  promptTemplate = signal('');
  outputTemplate = signal('');
  tools = signal<Tool[]>([
    { id: 'meta', label: 'Meta Ads', icon: '📘', connected: true },
    { id: 'tiktok', label: 'TikTok Ads', icon: '🎵', connected: true },
    { id: 'wa', label: 'WhatsApp Business', icon: '💬', connected: false },
    { id: 'shopify', label: 'Shopify', icon: '🛍', connected: false },
    { id: 'tiendanube', label: 'Tienda Nube', icon: '☁️', connected: true },
    { id: 'claude', label: 'Claude', icon: '✦', connected: false },
  ]);
  selectedTools = signal<Set<string>>(new Set());

  iconOptions = ['🤖', '🛡', '✍️', '⚡', '💬', '📊', '🔍', '👥', '🎯', '🧠'];
  colorOptions: Array<{ id: 'rust' | 'sage' | 'terracota' | 'amber'; label: string }> = [
    { id: 'rust', label: 'Crítico' },
    { id: 'sage', label: 'Análisis' },
    { id: 'terracota', label: 'Creativo' },
    { id: 'amber', label: 'Operativo' },
  ];

  step = signal<1 | 2 | 3 | 4>(1);
  saved = signal(false);

  progress = computed(() => {
    const s = this.step();
    return s === 1 ? 25 : s === 2 ? 50 : s === 3 ? 75 : 100;
  });

  // Step 1 valid: nombre + tagline + icon + color
  step1Valid = computed(() => !!this.nombre().trim() && !!this.tagline().trim());
  // Step 2 valid: trigger seleccionado
  step2Valid = computed(() => !!this.triggerKey());
  // Step 3 valid: prompt template no vacío
  step3Valid = computed(() => !!this.promptTemplate().trim());

  // Test preview
  testRunning = signal(false);
  testLog = signal<string[]>([]);

  triggers = computed(() => this.flowSvc.catalog.triggers);

  toggleTool(id: string) {
    const next = new Set(this.selectedTools());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.selectedTools.set(next);
  }

  next() {
    const s = this.step();
    if (s === 1 && this.step1Valid()) this.step.set(2);
    else if (s === 2 && this.step2Valid()) this.step.set(3);
    else if (s === 3 && this.step3Valid()) this.step.set(4);
  }

  prev() {
    const s = this.step();
    if (s > 1) this.step.set((s - 1) as 1 | 2 | 3);
  }

  async testAgent() {
    this.testRunning.set(true);
    this.testLog.set([]);
    const steps = [
      `▸ Inicializando agente "${this.nombre()}"...`,
      `  ✓ Color ${this.color()} · ícono ${this.icon()}`,
      `▸ Conectando con trigger: ${this.triggers().find(t => t.id === this.triggerKey())?.label}`,
      `  ✓ Trigger armado`,
      `▸ Cargando herramientas (${this.selectedTools().size})...`,
      ...Array.from(this.selectedTools()).map(id => `  ✓ ${this.tools().find(t => t.id === id)?.label} conectada`),
      `▸ Aplicando prompt template (${this.promptTemplate().length} chars)`,
      `  ✓ Template parseado`,
      `▸ Generando salida mock...`,
      `  ✓ Salida generada: "${this.outputTemplate().slice(0, 60) || 'Sin plantilla — usa default'}..."`,
      `▸ Test completado en 1.3s. Agente listo para guardar.`,
    ];
    for (const line of steps) {
      await new Promise(r => setTimeout(r, 200));
      this.testLog.set([...this.testLog(), line]);
    }
    this.testRunning.set(false);
  }

  save() {
    // Crear nuevo agente y persistirlo
    const newAgent = {
      id: `ag-custom-${Date.now()}`,
      name: this.nombre(),
      icon: this.icon(),
      color: this.color(),
      tagline: this.tagline(),
      descripcion: this.descripcion() || this.tagline(),
      creado_por: 'Tú',
      instalaciones: 1,
      rating: 0,
      prerequisites: Array.from(this.selectedTools()).map(id => this.tools().find(t => t.id === id)?.label || id),
      que_hace: [
        this.tagline(),
        `Trigger: ${this.triggers().find(t => t.id === this.triggerKey())?.label}`,
        `Herramientas conectadas: ${this.selectedTools().size}`,
      ],
      instalado: true,
    };
    // Lo agregamos al servicio (es signal así que mutamos)
    const current = this.marketSvc.agentes();
    this.marketSvc['agentes'].set([newAgent, ...current]);
    this.saved.set(true);
    this.chatSvc.send(`Acabo de crear el agente "${this.nombre()}". ¿Puedes ejecutarlo sobre mi negocio?`);
  }

  finish() {
    this.router.navigateByUrl('/gali-v3/mercado?tab=agentes');
  }
}

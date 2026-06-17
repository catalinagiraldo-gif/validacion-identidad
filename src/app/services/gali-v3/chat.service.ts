import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import chatHistoryCollarData from '../../../../mocks/gali-v3/chat-history-collar-gps.json';
import chatPromptsData from '../../../../mocks/gali-v3/chat-prompts.json';
import { ChatMessage, SlashCommand } from './types';

const STORAGE_KEY = 'gali_v3_chat_threads';
const STREAM_TICK_MS = 28;

interface ChatThread {
  id: string;
  messages: ChatMessage[];
}

@Injectable({ providedIn: 'root' })
export class GaliChatService {
  private router = inject(Router);

  readonly threads = signal<Record<string, ChatThread>>(this.load());
  readonly activeThreadId = signal<string>('inicio');
  readonly isStreaming = signal<boolean>(false);
  readonly contextRoute = signal<string>('inicio');

  readonly slashCommands: SlashCommand[] = chatPromptsData.global as SlashCommand[];

  readonly messages = computed<ChatMessage[]>(() => {
    const t = this.threads();
    const id = this.activeThreadId();
    return t[id]?.messages ?? [];
  });

  readonly contextualSuggestions = computed<string[]>(() => {
    const route = this.contextRoute();
    const prompts = chatPromptsData as unknown as Record<string, string[]>;
    return prompts[route] ?? prompts['inicio'] ?? [];
  });

  setActiveThread(id: string) {
    this.activeThreadId.set(id);
    if (!this.threads()[id]) {
      this.threads.set({ ...this.threads(), [id]: { id, messages: [] } });
      this.persist();
    }
  }

  setContextRoute(route: string) {
    this.contextRoute.set(route);
  }

  loadProjectHistory(projectId: string) {
    if (this.threads()[projectId]) return;
    if (projectId === 'collar-gps-2026') {
      this.threads.set({
        ...this.threads(),
        [projectId]: { id: projectId, messages: chatHistoryCollarData.messages as ChatMessage[] },
      });
      this.persist();
    }
  }

  send(content: string, opts: { projectId?: string } = {}) {
    const threadId = opts.projectId ?? this.activeThreadId();
    this.setActiveThread(threadId);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toISOString(),
      content,
      context: { projectId: opts.projectId, route: this.contextRoute() },
    };
    this.appendMessage(threadId, userMsg);
    this.handleSlashNavigation(content);
    this.respondMock(threadId, content);
  }

  private handleSlashNavigation(content: string) {
    const trimmed = content.trim();
    if (!trimmed.startsWith('/')) return;
    const [cmd] = trimmed.split(/\s+/);
    const map: Record<string, string> = {
      '/proyecto-nuevo': '/gali-v3/proyecto/nuevo',
      '/automatiza': '/gali-v3/builder',
      '/vista': '/gali-v3/vista/nueva',
      '/bloque-nuevo': '/gali-v3/bloque-builder',
      '/recuerda': '/gali-v3', // open inicio donde se ve panel de memoria
    };
    const target = map[cmd];
    if (target) {
      setTimeout(() => this.router.navigateByUrl(target), 400);
    }
  }

  private appendMessage(threadId: string, msg: ChatMessage) {
    const all = { ...this.threads() };
    const thread = all[threadId] ?? { id: threadId, messages: [] };
    all[threadId] = { ...thread, messages: [...thread.messages, msg] };
    this.threads.set(all);
    this.persist();
  }

  private updateMessage(threadId: string, msgId: string, patch: Partial<ChatMessage>) {
    const all = { ...this.threads() };
    const thread = all[threadId];
    if (!thread) return;
    all[threadId] = {
      ...thread,
      messages: thread.messages.map(m => (m.id === msgId ? { ...m, ...patch } : m)),
    };
    this.threads.set(all);
  }

  private respondMock(threadId: string, userText: string) {
    const reply = this.pickMockReply(userText);
    const msgId = `msg-${Date.now() + 1}`;
    const partial: ChatMessage = {
      id: msgId,
      role: 'gali',
      timestamp: new Date().toISOString(),
      content: '',
      streaming: true,
    };
    this.appendMessage(threadId, partial);
    this.isStreaming.set(true);
    const words = reply.split(' ');
    let i = 0;
    const tick = () => {
      if (i >= words.length) {
        this.updateMessage(threadId, msgId, { streaming: false });
        this.isStreaming.set(false);
        this.persist();
        return;
      }
      i++;
      const content = words.slice(0, i).join(' ');
      this.updateMessage(threadId, msgId, { content });
      setTimeout(tick, STREAM_TICK_MS);
    };
    setTimeout(tick, 120);
  }

  private pickMockReply(userText: string): string {
    const t = userText.toLowerCase();
    if (t.includes('renueva') || t.includes('renovar')) {
      return 'Detecté que tus creatives del Collar GPS llevan 14 días — fatiga visual cerca. Voy a generar 3 variaciones manteniendo el ángulo "Mamá / seguridad emocional" pero con hooks distintos. Toma 30 segundos. Te las muestro como artifact en el canvas cuando estén listas.';
    }
    if (t.includes('analiza') || t.includes('producto')) {
      return 'Analicé ese producto contra mi base de 47k vendedores LATAM. Margen 71%, ventana 14 días antes de saturación en tu ciudad. Te despliego la ficha completa con ángulos sugeridos a la derecha. ¿Lo añadimos como proyecto?';
    }
    if (t.includes('escala') || t.includes('escalar')) {
      return 'Tu campaña tiene ROAS 2.8x sostenido 72h — buena candidata. Comparé con 312 campañas similares: el p75 dobló presupuesto en día 18 y llegó a 4.2x. Te propongo escalar a $160k/día con tope semanal de $1.5M. ¿Lo aplico?';
    }
    if (t.includes('arma') || t.includes('vista') || t.includes('dashboard')) {
      return 'Listo, armo una vista con pedidos del día + novedades pendientes + campañas activas + saldo. Quedará guardada en tu menú como "Mi operación de hoy". ¿La fijo como vista por defecto al abrir?';
    }
    if (t.includes('automat') || t.includes('flow') || t.includes('flujo')) {
      return 'Te abro el Builder con un flujo precargado: Trigger CTR<2% en 24h → Pausar campaña → Notificar por WhatsApp. Puedes editar cualquier bloque y agregar pasos. Lo verás como artifact en el canvas.';
    }
    if (t.includes('whats') || t.includes('wa')) {
      return 'Para conectar WhatsApp necesito que añadas la conexión desde Mercado → Conexiones. Una vez vinculada, puedo: notificarte resúmenes, contestar clientes 24/7 y crear órdenes desde conversaciones. ¿Te llevo al Mercado?';
    }
    if (t.includes('hola') || t.includes('buenos') || t.includes('buenas')) {
      return 'Hola Alejandra. Recuerdo que vendes mascotas con tono emocional y tu objetivo es ROAS 3x. Hoy hay 3 señales para ti: tu campaña puede escalar, hay un producto en alza compatible con tu perfil, y los creatives del Collar GPS necesitan renovación. ¿Por dónde quieres ir?';
    }
    return 'Listo, lo proceso. Voy a usar lo que sé de tu negocio (mascotas, tono emocional, ROAS objetivo 3x) para darte la respuesta más precisa. Te muestro el resultado como artifact en el canvas.';
  }

  private load(): Record<string, ChatThread> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      inicio: {
        id: 'inicio',
        messages: [
          {
            id: 'm-init',
            role: 'gali',
            timestamp: new Date().toISOString(),
            content:
              'Hola Alejandra. Llevo 8 meses contigo y recuerdo todo lo que hemos construido. ¿Qué quieres hacer hoy? Puedo armar algo nuevo, revisar lo que ya tienes, o sugerirte una próxima acción.',
          },
        ],
      },
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.threads()));
    } catch {}
  }
}

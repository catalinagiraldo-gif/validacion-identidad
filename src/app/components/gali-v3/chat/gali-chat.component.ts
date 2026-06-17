import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { GaliMemoryService } from '../../../services/gali-v3/memory.service';
import { GaliProjectService } from '../../../services/gali-v3/project.service';
import { GaliVoiceService } from '../../../services/gali-v3/voice.service';

interface ChatAttachment {
  type: 'image' | 'url' | 'product';
  label: string;
  thumb?: string;
  meta?: string;
}

@Component({
  selector: 'gali-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-chat.component.html',
  styleUrls: ['./gali-chat.component.scss'],
})
export class GaliChatComponent {
  private chatSvc = inject(GaliChatService);
  private memorySvc = inject(GaliMemoryService);
  private projectSvc = inject(GaliProjectService);
  private voiceSvc = inject(GaliVoiceService);

  @ViewChild('messagesEnd') messagesEnd?: ElementRef<HTMLDivElement>;
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  draft = signal('');
  isExpanded = signal(false);
  slashOpen = signal(false);
  attachOpen = signal(false);
  attachments = signal<ChatAttachment[]>([]);
  urlPasteOpen = signal(false);
  urlDraft = signal('');

  messages = this.chatSvc.messages;
  isStreaming = this.chatSvc.isStreaming;
  contextRoute = this.chatSvc.contextRoute;
  contextualSuggestions = this.chatSvc.contextualSuggestions;
  slashCommands = this.chatSvc.slashCommands;
  memoria = this.memorySvc.memory;
  activeProject = this.projectSvc.activeProject;

  // Voice signals
  recording = this.voiceSvc.isRecording;
  voiceTranscript = this.voiceSvc.transcript;
  voiceInterim = this.voiceSvc.interimTranscript;
  voiceWaveform = this.voiceSvc.waveformLevels;
  voiceAvailable = this.voiceSvc.available;
  voiceError = this.voiceSvc.error;

  contextLabel = computed(() => {
    const route = this.contextRoute();
    const active = this.activeProject();
    if (active) return `Proyecto: ${active.name}`;
    const labels: Record<string, string> = {
      inicio: 'Inicio',
      proyecto: 'Proyecto activo',
      catalogo: 'Catálogo despertado',
      campanas: 'Campañas',
      builder: 'Builder de flujos',
      mercado: 'Mercado',
      pedidos: 'Pedidos',
    };
    return labels[route] ?? 'Inicio';
  });

  constructor() {
    effect(() => {
      this.messages();
      queueMicrotask(() => this.scrollToBottom());
    });

    // Cuando termina la grabación de voz, volcar transcript al draft
    effect(() => {
      const t = this.voiceSvc.transcript();
      const interim = this.voiceSvc.interimTranscript();
      if (t || interim) {
        const combined = (t + ' ' + interim).trim();
        this.draft.set(combined);
      }
    });
  }

  send() {
    const text = this.draft().trim();
    const atts = this.attachments();
    if (!text && atts.length === 0) return;
    if (this.isStreaming()) return;
    const projectId = this.activeProject()?.id;
    const attachSummary = atts.length
      ? ` [adjuntos: ${atts.map(a => a.label).join(', ')}]`
      : '';
    this.chatSvc.send(text + attachSummary, { projectId });
    this.draft.set('');
    this.attachments.set([]);
    this.slashOpen.set(false);
    this.isExpanded.set(true);
  }

  onInput(value: string) {
    this.draft.set(value);
    this.slashOpen.set(value.startsWith('/'));
  }

  pickSuggestion(s: string) {
    this.draft.set(s);
    setTimeout(() => this.send(), 50);
  }

  pickSlash(cmd: string) {
    this.draft.set(cmd + ' ');
    this.slashOpen.set(false);
    this.inputEl?.nativeElement.focus();
  }

  toggleExpand() {
    this.isExpanded.update(v => !v);
  }

  // --- Voice ---

  toggleRecord() {
    if (this.recording()) {
      this.voiceSvc.stop();
    } else {
      this.voiceSvc.start();
    }
  }

  // --- Attach ---

  toggleAttach() {
    this.attachOpen.update(v => !v);
    this.urlPasteOpen.set(false);
  }

  closeAttach() {
    this.attachOpen.set(false);
    this.urlPasteOpen.set(false);
  }

  removeAttachment(idx: number) {
    this.attachments.set(this.attachments().filter((_, i) => i !== idx));
  }

  pickFileUpload() {
    this.fileInput?.nativeElement.click();
    this.closeAttach();
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const thumb = reader.result as string;
      const sizeKb = Math.round(file.size / 1024);
      this.attachments.set([
        ...this.attachments(),
        { type: 'image', label: file.name, thumb, meta: `${sizeKb}KB · ${file.type.split('/')[1] || 'image'}` },
      ]);
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  openUrlPaste() {
    this.urlPasteOpen.set(true);
    this.attachOpen.set(false);
  }

  closeUrlPaste() {
    this.urlPasteOpen.set(false);
    this.urlDraft.set('');
  }

  attachUrl() {
    const url = this.urlDraft().trim();
    if (!url) return;
    let host = url;
    try { host = new URL(url).hostname; } catch {}
    this.attachments.set([
      ...this.attachments(),
      { type: 'url', label: host, meta: url.length > 50 ? url.slice(0, 50) + '…' : url },
    ]);
    this.closeUrlPaste();
  }

  attachProduct(name: string, meta: string) {
    this.attachments.set([
      ...this.attachments(),
      { type: 'product', label: name, meta },
    ]);
    this.closeAttach();
  }

  attachArtifact() {
    this.attachments.set([
      ...this.attachments(),
      { type: 'product', label: 'Landing Collar GPS v2', meta: 'artifact previo · editable' },
    ]);
    this.closeAttach();
  }

  private scrollToBottom() {
    this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}

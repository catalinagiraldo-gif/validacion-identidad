import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Conversation {
  id: string;
  type: string;
  badgeLabel: string | null;
  timestamp: string;
  avatarUrl: string;
  name: string;
  preview: string;
  tags: string[];
  unreadCount: number;
  status: string;
  selected: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  content: string;
  type: 'text' | 'info' | 'images';
  images?: string[];
}

interface HeaderTag {
  label: string;
  color: 'gray' | 'success';
}

@Component({
  selector: 'app-cas-bandeja-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./bandeja.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">CAS</span>
      </nav>

      <!-- Split panel container -->
      <div class="cas-split">
        <!-- LEFT PANEL: Conversation list -->
        <aside class="panel-left">
          <!-- Search -->
          <div class="panel-search">
            <i class="pi pi-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar"
              [(ngModel)]="searchQuery"
              class="search-input"
            />
          </div>

          <!-- Tabs -->
          <div class="panel-tabs">
            <button
              class="tab-btn"
              [class.active]="activeTab === 'enviadas'"
              (click)="setTab('enviadas')"
            >
              Enviadas
              <span class="tab-count">{{ enviadasCount }}</span>
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'activas'"
              (click)="setTab('activas')"
            >
              Activas
              <span class="tab-count">{{ activasCount }}</span>
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'resueltas'"
              (click)="setTab('resueltas')"
            >
              Resueltas
            </button>
          </div>

          <!-- Filters -->
          <div class="panel-filters">
            <button class="filter-dropdown">
              <span>Motivos de consulta</span>
              <i class="pi pi-chevron-down"></i>
            </button>
            <button class="filter-dropdown">
              <span>Transportadora</span>
              <i class="pi pi-chevron-down"></i>
            </button>
          </div>

          <!-- Toggle + Sort -->
          <div class="panel-toggle-sort">
            <div class="toggle-group">
              <div
                class="toggle-switch"
                [class.active]="showUnreadOnly"
                (click)="showUnreadOnly = !showUnreadOnly"
              >
                <div class="toggle-knob"></div>
              </div>
              <span class="toggle-label">No leidos</span>
            </div>
            <button class="sort-link">
              <span>Ordenar por</span>
              <i class="pi pi-chevron-down"></i>
            </button>
          </div>

          <!-- Conversation list -->
          <div class="conv-list">
            <div
              class="conv-card"
              *ngFor="let conv of filteredConversations; let i = index"
              [class.selected]="conv.selected"
              [style.animation-delay]="i * 30 + 'ms'"
              (click)="selectConversation(conv)"
            >
              <!-- Blue left border for selected -->
              <div class="conv-card__body">
                <div class="conv-card__avatar">
                  <img [src]="conv.avatarUrl" [alt]="conv.name" />
                </div>
                <div class="conv-card__content">
                  <!-- Badge + timestamp row -->
                  <div class="conv-card__header">
                    <span class="conv-badge" *ngIf="conv.badgeLabel">{{ conv.badgeLabel }}</span>
                    <span class="conv-timestamp">{{ conv.timestamp }}</span>
                  </div>
                  <!-- Name + unread -->
                  <div class="conv-card__name-row">
                    <span class="conv-name">{{ conv.name }}</span>
                    <span class="conv-unread" *ngIf="conv.unreadCount > 0">{{ conv.unreadCount }}</span>
                  </div>
                  <!-- Preview -->
                  <span class="conv-preview">{{ conv.preview }}</span>
                  <!-- Tags -->
                  <div class="conv-tags">
                    <span class="conv-tag" *ngFor="let tag of conv.tags">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- RIGHT PANEL: Chat -->
        <section class="panel-right">
          <!-- Chat header -->
          <div class="chat-header">
            <div class="chat-header__info">
              <h2 class="chat-header__name">{{ chatHeader.name }}</h2>
              <div class="chat-header__tags">
                <span
                  class="header-tag"
                  *ngFor="let tag of chatHeader.tags"
                  [class.tag-success]="tag.color === 'success'"
                >
                  {{ tag.label }}
                </span>
              </div>
              <div class="chat-header__meta">
                <span class="meta-link">
                  ORDEN ID <strong>{{ chatHeader.ordenId }}</strong>
                  <i class="pi pi-external-link"></i>
                </span>
                <span class="meta-sep"></span>
                <span class="meta-text">Estado: {{ chatHeader.estado }}</span>
                <span class="meta-sep"></span>
                <span class="meta-text">GUIA: {{ chatHeader.guia }}</span>
              </div>
            </div>
            <div class="chat-header__actions">
              <button class="icon-btn" aria-label="Historial">
                <i class="pi pi-history"></i>
              </button>
            </div>
          </div>

          <!-- Chat body -->
          <div class="chat-body">
            <!-- Info bar -->
            <div class="chat-info-bar">
              <span><strong>Inicio de conversacion </strong>#78980 01/18/2025 11:11AM</span>
            </div>

            <!-- Message bubble -->
            <div class="chat-message">
              <div class="message-content">
                <p class="message-line">
                  <span class="message-label">Descripcion: </span>
                  <span class="message-value">No tengo informacion sobre el estado actual de este pedido. El cliente reporta que no ha recibido actualizaciones desde hace 5 dias. Solicito verificacion del estado de la guia y seguimiento con la transportadora.</span>
                </p>
                <p class="message-line">
                  <span class="message-label">Fecha estimada: </span>
                  <span class="message-value">12/03/2024 8:00AM</span>
                </p>

                <!-- Product photos (colored placeholder rectangles) -->
                <div class="message-photos">
                  <div class="photo-placeholder photo-placeholder--blue"></div>
                  <div class="photo-placeholder photo-placeholder--coral"></div>
                  <div class="photo-placeholder photo-placeholder--teal"></div>
                </div>

                <!-- Sender -->
                <div class="message-sender">
                  <span class="sender-info"><strong>Carolina Herrera</strong> 09:26 AM</span>
                </div>
              </div>
              <div class="message-avatar">
                <img src="assets/images/cas/avatar-carolina.png" alt="Carolina Herrera" />
              </div>
            </div>
          </div>

          <!-- Chat input -->
          <div class="chat-input">
            <button class="clip-btn" aria-label="Adjuntar archivo">
              <i class="pi pi-paperclip"></i>
            </button>
            <div class="input-wrapper">
              <input
                type="text"
                placeholder="Ingresar mensaje"
                [(ngModel)]="messageText"
                (keyup.enter)="sendMessage()"
              />
            </div>
            <button class="send-btn" (click)="sendMessage()">
              <i class="pi pi-comments"></i>
              <span>Enviar</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class CasBandejaNewComponent implements OnInit {
  searchQuery = '';
  activeTab: 'enviadas' | 'activas' | 'resueltas' = 'activas';
  showUnreadOnly = false;
  messageText = '';

  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;

  chatHeader = {
    name: 'ENVIA',
    tags: [
      { label: 'Proveedor', color: 'gray' as const },
      { label: 'Cancelar guia', color: 'gray' as const },
      { label: 'Chat', color: 'gray' as const },
      { label: 'Activa', color: 'success' as const },
    ],
    ordenId: '8652267',
    estado: 'Guia generada',
    guia: '34455878',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Conversation[]>('/api/cas').subscribe((data) => {
      this.conversations = data;
      this.selectedConversation = data.find((c) => c.selected) || data[0] || null;
    });
  }

  get filteredConversations(): Conversation[] {
    let filtered = this.conversations.filter((c) => c.status === this.statusMap[this.activeTab]);

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.preview.toLowerCase().includes(q) ||
          (c.badgeLabel && c.badgeLabel.toLowerCase().includes(q))
      );
    }

    if (this.showUnreadOnly) {
      filtered = filtered.filter((c) => c.unreadCount > 0);
    }

    return filtered;
  }

  get enviadasCount(): number {
    return this.conversations.filter((c) => c.status === 'enviada').length;
  }

  get activasCount(): number {
    return this.conversations.filter((c) => c.status === 'activa').length;
  }

  private statusMap: Record<string, string> = {
    enviadas: 'enviada',
    activas: 'activa',
    resueltas: 'resuelta',
  };

  setTab(tab: 'enviadas' | 'activas' | 'resueltas'): void {
    this.activeTab = tab;
  }

  selectConversation(conv: Conversation): void {
    this.conversations.forEach((c) => (c.selected = false));
    conv.selected = true;
    this.selectedConversation = conv;
  }

  sendMessage(): void {
    if (!this.messageText.trim()) return;
    this.messageText = '';
  }
}

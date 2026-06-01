import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  from: 'user' | 'ai';
  text: string;
  time: string;
}

@Component({
  selector: 'app-roax-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./roax.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Marketing</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Roax</span>
      </nav>

      <!-- Page title -->
      <h1 class="page-title">Roax</h1>

      <div class="roax-layout">
        <!-- Chat interface -->
        <div class="chat-panel">
          <div class="chat-header">
            <div class="chat-header__avatar">
              <i class="pi pi-sparkles"></i>
            </div>
            <div class="chat-header__info">
              <span class="chat-header__name">Roax AI</span>
              <span class="chat-header__desc">Tu asistente de marketing inteligente</span>
            </div>
            <button class="chat-header__btn" aria-label="Nuevo chat">
              <i class="pi pi-plus"></i>
              <span>Nuevo chat</span>
            </button>
          </div>

          <div class="chat-messages">
            <div
              *ngFor="let msg of messages; let i = index"
              class="chat-msg"
              [ngClass]="msg.from === 'ai' ? 'chat-msg--ai' : 'chat-msg--user'"
              [style.animation-delay]="i * 100 + 'ms'"
            >
              <div class="chat-msg__avatar" *ngIf="msg.from === 'ai'">
                <i class="pi pi-sparkles"></i>
              </div>
              <div class="chat-msg__bubble">
                <p class="chat-msg__text">{{ msg.text }}</p>
                <span class="chat-msg__time">{{ msg.time }}</span>
              </div>
            </div>
          </div>

          <div class="chat-input-area">
            <div class="suggestions-row">
              <button class="suggestion-chip" *ngFor="let s of suggestions" (click)="inputText = s">
                {{ s }}
              </button>
            </div>
            <div class="chat-input-bar">
              <input
                type="text"
                placeholder="Pregunta algo a Roax..."
                [(ngModel)]="inputText"
              />
              <button class="send-btn" [disabled]="!inputText.trim()">
                <i class="pi pi-send"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Quick actions -->
        <div class="actions-sidebar">
          <h3 class="sidebar-title">Acciones rapidas</h3>
          <div class="action-cards">
            <div *ngFor="let action of quickActions; let i = index"
                 class="quick-action-card"
                 [style.animation-delay]="i * 80 + 'ms'">
              <div class="quick-action-card__icon" [style.background]="action.bgColor">
                <i [class]="action.icon"></i>
              </div>
              <div class="quick-action-card__content">
                <span class="quick-action-card__title">{{ action.title }}</span>
                <span class="quick-action-card__desc">{{ action.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RoaxNewComponent {
  inputText = '';

  messages: ChatMessage[] = [
    { from: 'ai', text: 'Hola! Soy Roax, tu asistente de marketing con inteligencia artificial. Puedo ayudarte a crear campanas, analizar resultados y optimizar tu estrategia de ventas.', time: '10:00 a.m.' },
    { from: 'user', text: 'Quiero crear una campana para el Dia de la Madre', time: '10:01 a.m.' },
    { from: 'ai', text: 'Excelente idea! El Dia de la Madre es una fecha clave. Te sugiero una campana con estos elementos:\n\n1. Asunto: "El regalo perfecto para mama esta aqui"\n2. Segmento: Clientes que compraron en los ultimos 60 dias\n3. Descuento: 15% en categorias Hogar y Belleza\n4. Canal: Email + SMS de recordatorio\n\nQuieres que genere el contenido completo?', time: '10:01 a.m.' },
    { from: 'user', text: 'Si, genera el contenido para email', time: '10:02 a.m.' },
    { from: 'ai', text: 'Aqui tienes un borrador para tu email:\n\nAsunto: "Mama merece lo mejor - 15% de descuento especial"\n\nCuerpo: Celebra el amor incondicional de mama con un regalo unico. Aprovecha nuestro 15% de descuento en productos seleccionados de Hogar y Belleza.\n\nOferta valida hasta el 10 de mayo. Envio gratis en compras mayores a $80.000.', time: '10:02 a.m.' },
  ];

  suggestions = [
    'Crear campana SMS',
    'Analizar rendimiento',
    'Sugerir segmentos',
    'Optimizar horarios',
  ];

  quickActions = [
    { icon: 'pi pi-envelope', title: 'Generar email', description: 'Crea un email con IA', bgColor: 'rgba(80, 165, 241, 0.12)' },
    { icon: 'pi pi-chart-bar', title: 'Analizar metricas', description: 'Revisa el rendimiento', bgColor: 'rgba(10, 187, 135, 0.12)' },
    { icon: 'pi pi-users', title: 'Segmentar audiencia', description: 'Agrupa tus clientes', bgColor: 'rgba(244, 106, 107, 0.12)' },
    { icon: 'pi pi-calendar', title: 'Programar envio', description: 'Elige el mejor horario', bgColor: 'rgba(241, 180, 76, 0.12)' },
  ];
}

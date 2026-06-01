import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  time: string;
}

interface AutomationFlow {
  id: number;
  name: string;
  trigger: string;
  status: 'Activo' | 'Inactivo';
  responses: number;
}

@Component({
  selector: 'app-chatea-pro-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./chatea-pro.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Marketing</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Chatea Pro</span>
      </nav>

      <!-- Page title -->
      <h1 class="page-title">Chatea Pro</h1>

      <div class="chatea-layout">
        <!-- Left: Automation Flows -->
        <div class="flows-panel">
          <div class="panel-header">
            <h2 class="panel-title">Flujos de automatizacion</h2>
            <button class="btn-add-flow">
              <i class="pi pi-plus"></i>
            </button>
          </div>

          <div class="flows-list">
            <div
              *ngFor="let flow of flows; let i = index"
              class="flow-card"
              [class.flow-card--active]="selectedFlowId === flow.id"
              (click)="selectedFlowId = flow.id"
              [style.animation-delay]="i * 60 + 'ms'"
            >
              <div class="flow-card__header">
                <span class="flow-card__name">{{ flow.name }}</span>
                <span class="flow-status" [ngClass]="flow.status === 'Activo' ? 'flow-status--active' : 'flow-status--inactive'">
                  {{ flow.status }}
                </span>
              </div>
              <div class="flow-card__meta">
                <span class="flow-card__trigger">
                  <i class="pi pi-bolt"></i>
                  {{ flow.trigger }}
                </span>
                <span class="flow-card__responses">{{ flow.responses }} respuestas</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: WhatsApp Preview -->
        <div class="preview-panel">
          <div class="wa-phone-frame">
            <div class="wa-header">
              <div class="wa-header__back">
                <i class="pi pi-arrow-left"></i>
              </div>
              <div class="wa-header__avatar">
                <i class="pi pi-user"></i>
              </div>
              <div class="wa-header__info">
                <span class="wa-header__name">Mi Tienda Dropi</span>
                <span class="wa-header__status">en linea</span>
              </div>
              <div class="wa-header__actions">
                <i class="pi pi-video"></i>
                <i class="pi pi-phone"></i>
                <i class="pi pi-ellipsis-v"></i>
              </div>
            </div>

            <div class="wa-chat-area">
              <div class="wa-date-divider">
                <span>Hoy</span>
              </div>
              <div
                *ngFor="let msg of previewMessages"
                class="wa-message"
                [ngClass]="msg.from === 'bot' ? 'wa-message--bot' : 'wa-message--user'"
              >
                <p class="wa-message__text">{{ msg.text }}</p>
                <span class="wa-message__time">{{ msg.time }}</span>
              </div>
            </div>

            <div class="wa-input-bar">
              <button class="wa-input-btn">
                <i class="pi pi-face-smile"></i>
              </button>
              <input type="text" placeholder="Escribe un mensaje..." readonly />
              <button class="wa-input-btn">
                <i class="pi pi-paperclip"></i>
              </button>
              <button class="wa-send-btn">
                <i class="pi pi-microphone"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ChateaProNewComponent {
  selectedFlowId = 1;

  flows: AutomationFlow[] = [
    { id: 1, name: 'Bienvenida automatica', trigger: 'Primer mensaje', status: 'Activo', responses: 342 },
    { id: 2, name: 'Consulta de precio', trigger: 'Palabra clave: precio', status: 'Activo', responses: 1205 },
    { id: 3, name: 'Estado del pedido', trigger: 'Palabra clave: pedido', status: 'Activo', responses: 876 },
    { id: 4, name: 'Horario de atencion', trigger: 'Fuera de horario', status: 'Inactivo', responses: 154 },
    { id: 5, name: 'Promociones del mes', trigger: 'Palabra clave: promo', status: 'Activo', responses: 432 },
  ];

  previewMessages: ChatMessage[] = [
    { from: 'user', text: 'Hola, quiero saber el precio del reloj inteligente', time: '10:30 a.m.' },
    { from: 'bot', text: 'Hola! Gracias por escribirnos. El reloj inteligente Y68 tiene un precio de $120.000 COP con envio gratis.', time: '10:30 a.m.' },
    { from: 'bot', text: 'Deseas realizar tu pedido? Responde SI para continuar.', time: '10:30 a.m.' },
    { from: 'user', text: 'SI', time: '10:31 a.m.' },
    { from: 'bot', text: 'Excelente! Por favor enviame tu nombre completo y direccion de envio.', time: '10:31 a.m.' },
  ];
}

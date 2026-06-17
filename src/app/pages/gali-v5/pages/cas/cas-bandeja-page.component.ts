import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropiSearchOficialComponent, DropiTagComponent } from '../../components/shared';
import { GaliChipComponent } from '../../components/gali-chip/gali-chip.component';
import { DropiGaliBarComponent, GaliBarStat } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import casData from '../../../../../../mocks/gali-v5/cas-tickets.json';
import pqrPatternsData from '../../../../../../mocks/gali-v5/pqr-patterns.json';

type GaliTicketStatus = 'managing' | 'human' | 'resolved' | 'pending';

interface Ticket {
  id: string;
  subject: string;
  client: string;
  order: string;
  status: string;
  priority: string;
  agent: string;
  updated: string;
  preview: string;
  galiStatus: GaliTicketStatus;
}

interface PqrPattern {
  id: string;
  producto: string;
  tipo: string;
  motivo: string;
  count: number;
  pct: string;
  tendencia: string;
  umbral: string | null;
  galiInsight: string;
  accionSugerida: string;
  impacto: string;
}

@Component({
  selector: 'app-cas-bandeja-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiSearchOficialComponent, DropiTagComponent, GaliChipComponent, DropiGaliBarComponent],
  templateUrl: './cas-bandeja-page.component.html',
  styleUrl: './cas-bandeja-page.component.scss',
})
export class CasBandejaPageComponent {
  private router = inject(Router);

  showExplainer = true;
  searchQuery = '';
  activeFilter = signal<'todos' | 'abiertos' | 'mios'>('todos');

  readonly tickets: Ticket[] = casData.tickets as Ticket[];
  readonly pqrPatterns: PqrPattern[] = pqrPatternsData as PqrPattern[];

  selectedId = signal(this.tickets.find(t => t.galiStatus === 'human')?.id ?? this.tickets[0]?.id ?? '');

  chatMessages = signal([...casData.messages]);
  newMessage = signal('');

  // Chatea Pro suggested response — editable before sending
  readonly suggestedResponse = signal('Hola, revisamos tu caso y notamos que la guía de tu pedido está en proceso de actualización con la transportadora. Te confirmaremos el estado exacto en las próximas 2 horas. Disculpa la espera y muchas gracias por tu paciencia.');
  readonly isEditingSuggested = signal(false);
  readonly suggestedSent = signal(false);

  sendSuggested(): void {
    const text = this.suggestedResponse().trim();
    if (!text) return;
    this.chatMessages.update(msgs => [...msgs, { from: 'agent', text, time: 'ahora' }]);
    this.suggestedSent.set(true);
    this.isEditingSuggested.set(false);
  }

  get urgentTickets(): Ticket[] {
    return this.sortedTickets.filter(t => t.galiStatus === 'human');
  }

  get waitingTickets(): Ticket[] {
    return this.sortedTickets.filter(t => t.galiStatus === 'managing' || t.galiStatus === 'pending');
  }

  get resolvedTickets(): Ticket[] {
    return this.sortedTickets.filter(t => t.galiStatus === 'resolved');
  }

  get galiBarStats(): GaliBarStat[] {
    const s = this.galiStats;
    return [
      { value: s.managing, label: 'gestionando', variant: 'ok' },
      { value: s.human, label: 'requieren decisión', variant: 'warn' },
      { value: s.resolved, label: 'resueltos hoy', variant: 'neutral' },
      { value: s.total, label: 'tickets totales' },
    ];
  }

  get galiStats() {
    return {
      managing: this.tickets.filter(t => t.galiStatus === 'managing').length,
      human: this.tickets.filter(t => t.galiStatus === 'human').length,
      resolved: this.tickets.filter(t => t.galiStatus === 'resolved').length,
      total: this.tickets.length,
    };
  }

  get sortedTickets(): Ticket[] {
    const priority: Record<GaliTicketStatus, number> = { human: 0, managing: 1, pending: 2, resolved: 3 };
    return [...this.tickets].sort((a, b) => (priority[a.galiStatus] ?? 4) - (priority[b.galiStatus] ?? 4));
  }

  selectedTicket(): Ticket | undefined {
    return this.tickets.find(t => t.id === this.selectedId()) ?? this.tickets[0];
  }

  chipLabel(status: GaliTicketStatus): string {
    const labels: Record<GaliTicketStatus, string> = {
      managing: '✦ Gali gestionando',
      human: '⚠ Requiere humano',
      resolved: '✓ Resuelto por Gali',
      pending: '○ Pendiente',
    };
    return labels[status] ?? '';
  }

  statusVariant(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      Abierto: 'warning',
      'En proceso': 'info',
      Resuelto: 'success',
      Cerrado: 'neutral',
      Escalado: 'error',
      Pendiente: 'warning',
    };
    return map[status] ?? 'neutral';
  }

  sendMessage(): void {
    const text = this.newMessage().trim();
    if (!text) return;
    this.chatMessages.update(msgs => [...msgs, { from: 'agent', text, time: 'ahora' }]);
    this.newMessage.set('');

    setTimeout(() => {
      this.chatMessages.update(msgs => [
        ...msgs,
        { from: 'client', text: 'Gracias, lo revisamos.', time: 'ahora' },
      ]);
    }, 600);
  }

  goToChateaPro(): void {
    this.router.navigate(['/gali-v5/marketing/chatea-pro']);
  }

  goToSkills(): void {
    this.router.navigate(['/gali-v5/skills']);
  }

  goToProject(): void {
    this.router.navigate(['/gali-v5/proyecto/collar-gps-2026']);
  }

  scrollToPqr(): void {
    document.getElementById('pqr-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  pqrSeverity(tipo: string): string {
    if (tipo === 'fraude-sospechoso') return 'critical';
    if (tipo === 'queja-calidad' || tipo === 'expectativa') return 'warn';
    return 'ok';
  }

  ejecutarAccion(patron: PqrPattern): void {
    if (patron.accionSugerida.includes('script')) {
      this.goToSkills();
    } else if (patron.accionSugerida.includes('proveedor')) {
      return;
    } else if (patron.accionSugerida.includes('Bloquear')) {
      return;
    } else if (patron.accionSugerida.includes('ángulo')) {
      this.goToProject();
    }
  }
}

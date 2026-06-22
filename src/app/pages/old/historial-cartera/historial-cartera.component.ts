import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import transactionsData from '../../../../../mocks/historial-cartera.json';

interface Transaction {
  id: string;
  fecha: string;
  tipo: 'ENTRADA' | 'SALIDA';
  monto: number;
  montoDisplay: string;
  descripcion: string;
  usuario: string;
  currency: string;
}

@Component({
  selector: 'app-historial-cartera',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-cartera.component.html',
  styleUrls: ['./historial-cartera.component.scss'],
})
export class HistorialCarteraComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  activeTab: 'billetera' | 'depositos' = 'billetera';

  demoIdentityStatus = 'sin_validar';
  readonly identityStatusOptions = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];

  private readonly alertsMap: Record<string, { type: string; icon: string; text: string; cta: string }> = {
    sin_validar: { type: 'warning', icon: 'pi-shield',                text: 'Para retirar fondos y ver tu historial completo, verifica tu identidad. Sin validar, solo puedes consultar movimientos.', cta: 'Verificar identidad' },
    pendiente:   { type: 'warning', icon: 'pi-exclamation-triangle',  text: 'Tienes una verificación incompleta. Termínala para desbloquear retiros desde tu historial.', cta: 'Continuar verificación' },
    en_revision: { type: 'info',    icon: 'pi-clock',                 text: 'Tus datos están en revisión. Los retiros quedan habilitados en cuanto aprobemos tu validación.', cta: 'Ver estado' },
    rechazado:   { type: 'error',   icon: 'pi-times-circle',          text: 'Tu verificación fue rechazada. Reintenta para recuperar el acceso a retiros y extractos.', cta: 'Reintentar' },
  };

  get identityAlert() {
    return this.demoIdentityStatus !== 'aprobado' ? this.alertsMap[this.demoIdentityStatus] : null;
  }

  fechaDesde = '23/1/2025';
  fechaHasta = '23/1/2025';
  filtroPorTipo = '';
  filtroPorCodigo = '';
  idTransaccion = '';
  searchQuery = '';

  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;

  ngOnInit(): void {
    this.transactions = transactionsData as Transaction[];
    this.totalRecords = this.transactions.length;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.transactions];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.descripcion.toLowerCase().includes(q) ||
          t.usuario.toLowerCase().includes(q)
      );
    }

    if (this.filtroPorTipo) {
      result = result.filter((t) => t.tipo === this.filtroPorTipo);
    }

    if (this.idTransaccion.trim()) {
      result = result.filter((t) => t.id.includes(this.idTransaccion.trim()));
    }

    this.totalRecords = result.length;
    this.filteredTransactions = result;
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTransactions.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  get totalMonto(): string {
    const total = this.filteredTransactions.reduce((sum, t) => sum + t.monto, 0);
    return '$ ' + Math.abs(total).toLocaleString('es-CO');
  }

  setActiveTab(tab: 'billetera' | 'depositos'): void {
    this.activeTab = tab;
  }

  getMontoClass(transaction: Transaction): string {
    if (transaction.tipo === 'ENTRADA') return 'monto-entrada';
    if (transaction.monto < 0) return 'monto-salida';
    return 'monto-entrada';
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= Math.min(this.totalPages, 10); i++) {
      pages.push(i);
    }
    return pages;
  }
}

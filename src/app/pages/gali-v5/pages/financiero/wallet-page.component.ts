import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
  DropiPaginatorComponent,
} from '../../components/shared';
import walletData from '../../../../../../mocks/gali-v5/wallet-transactions.json';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';

interface WalletTransaction {
  num: string;
  fecha: string;
  tipo: string;
  monto: string;
  montoPrevio: string;
  descripcion: string;
}

@Component({
  selector: 'app-wallet-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
    DropiPaginatorComponent,
    DropiGaliBarComponent,
  ],
  templateUrl: './wallet-page.component.html',
  styleUrl: './wallet-page.component.scss',
})
export class WalletPageComponent {
  searchQuery = '';
  activeTab = signal<'transacciones' | 'depositos'>('transacciones');
  readonly breadcrumbs = ['Financiero', 'Wallet', 'Historial de wallet'];
  readonly alertMessage = walletData.alertMessage;
  readonly transactions: WalletTransaction[] = walletData.transactions;

  filteredTransactions(): WalletTransaction[] {
    if (!this.searchQuery) return this.transactions;
    const q = this.searchQuery.toLowerCase();
    return this.transactions.filter(t =>
      t.num.includes(q) || t.descripcion.toLowerCase().includes(q),
    );
  }
}

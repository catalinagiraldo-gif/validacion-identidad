import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
  DropiTagComponent,
} from '../../components/shared';
import cardsData from '../../../../../../mocks/gali-v5/dropicard-cards.json';

interface DropicardItem {
  id: string;
  idDisplay: string;
  holder: string;
  type: string;
  typeLabel: string;
  status: string;
  statusLabel: string;
  balance: string;
  balanceVisible: boolean;
  image: string;
}

@Component({
  selector: 'app-dropicard-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
    DropiTagComponent,
  ],
  templateUrl: './dropicard-page.component.html',
  styleUrl: './dropicard-page.component.scss',
})
export class DropicardPageComponent {
  searchQuery = '';
  typeFilter = '';
  statusFilter = '';
  readonly hiddenStars = [0, 1, 2, 3, 4, 5];
  readonly breadcrumbs = ['Financiero', 'Facturación Dropi', 'Dropicard'];
  readonly cards: DropicardItem[] = cardsData.cards.map(card => ({ ...card }));

  get filteredCards(): DropicardItem[] {
    return this.cards.filter(c => {
      if (this.typeFilter && c.type !== this.typeFilter) return false;
      if (this.statusFilter && c.status !== this.statusFilter) return false;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        if (!c.holder.toLowerCase().includes(q) && !c.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  toggleBalance(card: DropicardItem): void {
    card.balanceVisible = !card.balanceVisible;
  }

  copyId(id: string): void {
    void navigator.clipboard?.writeText(id);
  }
}

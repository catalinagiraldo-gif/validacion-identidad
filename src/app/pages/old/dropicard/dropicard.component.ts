import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropicard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropicard.component.html',
  styleUrls: ['./dropicard.component.scss'],
})
export class DropicardComponent {
  showBanner = true;
  tipoTarjeta = 'Todas';
  estado = 'Seleccionar';
  searchQuery = '';
  hasCards = false;

  closeBanner(): void {
    this.showBanner = false;
  }

  solicitarTarjeta(): void {
    // placeholder action
  }

  aplicarFiltros(): void {
    // placeholder action
  }

  verBeneficios(): void {
    // placeholder action
  }
}

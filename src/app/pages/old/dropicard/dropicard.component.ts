import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import { IdentityActivationCardComponent } from '../../../common/components/identity-activation-card/identity-activation-card.component';

@Component({
  selector: 'app-dropicard',
  standalone: true,
  imports: [CommonModule, FormsModule, IdentityActivationCardComponent],
  templateUrl: './dropicard.component.html',
  styleUrls: ['./dropicard.component.scss'],
})
export class DropicardComponent {
  showBanner = true;
  tipoTarjeta = 'Todas';

  private identityDemo = inject(IdentityDemoStateService);

  get demoIdentityStatus() {
    return this.identityDemo.status();
  }
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

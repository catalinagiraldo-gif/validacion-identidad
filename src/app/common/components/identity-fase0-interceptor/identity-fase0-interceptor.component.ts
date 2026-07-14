import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityFase0Service } from '../../services/identity-fase0.service';

// Etapa 0.5 del Service Blueprint Fase 0: Modal Interceptor Recurrente (Spam
// Visual / No-Code). Sin botón 'X' — obliga a ir a Sumsub. El texto no varía
// entre reapariciones. "Continuar a verificación" dispara la redirección
// automática ("Redirigiendo a Sumsub…") y luego devuelve a la página de origen.

@Component({
  selector: 'app-identity-fase0-interceptor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-fase0-interceptor.component.html',
  styleUrls: ['./identity-fase0-interceptor.component.scss'],
})
export class IdentityFase0InterceptorComponent {
  readonly fase0 = inject(IdentityFase0Service);

  continuar(): void {
    this.fase0.continueToSumsub();
  }
}

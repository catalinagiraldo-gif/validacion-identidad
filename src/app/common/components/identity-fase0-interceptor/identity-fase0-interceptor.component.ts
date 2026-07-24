import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityFase0Service } from '../../services/identity-fase0.service';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { IdentityFase0BackstageDotComponent } from '../identity-fase0-backstage-dot/identity-fase0-backstage-dot.component';

// Etapa 0.5 del Service Blueprint Fase 0: Modal Interceptor Recurrente (Spam
// Visual / No-Code). Sin botón 'X' — obliga a ir a Sumsub. El texto no varía
// entre reapariciones. "Continuar a verificación" dispara la redirección
// automática ("Redirigiendo a Sumsub…") y luego pasa al stand-in de Sumsub.
//
// GT/PA (blueprint: "Registro de Datos Bancarios"): el modal real es nativo
// de cuentas bancarias, no UserPilot — aquí se aproxima con una variante de
// copy orientada al titular de la cuenta cuando el país es GT y el origen es
// "cuenta" (mínimo viable del plan, sin inventar una página nueva).

@Component({
  selector: 'app-identity-fase0-interceptor',
  standalone: true,
  imports: [CommonModule, IdentityFase0BackstageDotComponent],
  templateUrl: './identity-fase0-interceptor.component.html',
  styleUrls: ['./identity-fase0-interceptor.component.scss'],
})
export class IdentityFase0InterceptorComponent {
  readonly fase0 = inject(IdentityFase0Service);
  private readonly stateV2 = inject(IdentityDemoStateV2Service);

  /**
   * Blueprint: bifurcación GT/PA — modal nativo de cuentas bancarias,
   * orientado al titular. Discrepancia conocida: el selector País del demo
   * (Pais9) no incluye Panamá — solo cubre los 9 países que sí modela el
   * resto del prototipo. Se aproxima con GT como único disparador real.
   */
  readonly esVarianteBancariaGtPa = computed(
    () => this.stateV2.pais() === 'GT' && this.fase0.interceptorOrigen() === 'cuenta'
  );

  readonly backstageNota = computed(() =>
    this.esVarianteBancariaGtPa()
      ? 'GT/PA: este paso no pasa por UserPilot — es el modal nativo de cuentas bancarias de Dropi, que redirige al enlace Sumsub del país (Bloque A). Si el documento ya fue validado, el sistema rechaza duplicados del mismo tipo+número (regla anti-fraude).'
      : 'URLs finales de TyC/Privacidad pendientes de Legal por país. Este pop-up es ineludible — UserPilot no permite cerrarlo hasta que Sumsub confirme, y el copy no varía entre reapariciones (evita apariencia de manipulación ante Legal).'
  );

  continuar(): void {
    this.fase0.continueToSumsub();
  }
}

import { Component } from '@angular/core';
import { MisPedidosComponent } from '../../old/mis-pedidos/mis-pedidos.component';

@Component({
  selector: 'app-gali-v3-pedidos',
  standalone: true,
  imports: [MisPedidosComponent],
  template: `
    <div class="wrap">
      <header class="wrap__head">
        <span class="wrap__crumb">tu operación / pedidos</span>
        <h1 class="wrap__title">Pedidos.</h1>
        <p class="wrap__sub">Estás viendo el componente operativo conectado al mock interceptor. Mismo dato que el bloque del lienzo.</p>
      </header>
      <div class="wrap__inner">
        <app-mis-pedidos></app-mis-pedidos>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; width: 100%; height: 100%; overflow: hidden; font-family: $gv3-font-body; color: $gv3-text-primary; }
    .wrap { height: 100%; display: flex; flex-direction: column; @include gv3-bg-cream-radial; overflow: hidden; }
    .wrap__head { padding: $gv3-space-6 $gv3-space-8 $gv3-space-4; }
    .wrap__crumb { font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: $gv3-orange-hover; }
    .wrap__title { @include gv3-display-tight; font-size: clamp(28px, 4vw, 44px); font-weight: 400; margin: 4px 0 $gv3-space-2; }
    .wrap__sub { font-size: $gv3-text-base; color: $gv3-text-secondary; margin: 0; max-width: 60ch; }
    .wrap__inner { flex: 1; min-height: 0; overflow: hidden; background: $gv3-bg-surface; }
  `],
})
export class GaliV3PedidosWrapperComponent {}

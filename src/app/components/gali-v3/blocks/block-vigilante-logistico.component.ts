import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import vigilanteData from '../../../../../mocks/gali-v3/vigilante-logistico.json';
import { AgentOrchestratorService } from '../../../services/gali-v3/agent-orchestrator.service';

interface Alerta {
  pedido_id: string;
  dias_sin_actualizacion: number;
  transportadora: string;
  estado: string;
  titulo: string;
}

interface Transportadora {
  nombre: string;
  tasa_novedad_semana: number;
  tasa_semana_anterior: number;
  umbral: number;
  estado: 'ok' | 'atencion' | 'critico';
}

@Component({
  selector: 'block-vigilante-logistico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bvl">
      <header class="bvl__head">
        <span class="bvl__badge bvl__badge--activo">activo</span>
        <h4>🚛 Vigilante Logístico</h4>
      </header>

      <section class="bvl__alertas">
        <div *ngFor="let a of alertas" class="bvl__alerta" [attr.data-estado]="a.estado">
          <span class="bvl__alerta-dot" aria-hidden="true"></span>
          <div>
            <strong>{{ a.titulo }}</strong>
            <span>{{ a.pedido_id }} · {{ a.dias_sin_actualizacion }}d sin update · {{ a.transportadora }}</span>
          </div>
        </div>
      </section>

      <div class="bvl__actions">
        <a routerLink="/gali-v3/dropi/pedidos" [queryParams]="{ filtro: 'novedad' }" class="bvl__btn">Ver pedidos</a>
        <button type="button" class="bvl__btn bvl__btn--gali" (click)="iniciarReclamo()">Gali, inicia reclamo</button>
      </div>

      <section class="bvl__carriers">
        <div *ngFor="let t of transportadoras" class="bvl__carrier" [attr.data-estado]="t.estado">
          <span class="bvl__carrier-dot"></span>
          <div>
            <strong>{{ t.nombre }}</strong>
            <span *ngIf="t.estado !== 'ok'">
              {{ t.tasa_novedad_semana }}% novedad (umbral {{ t.umbral }}%) · sem. ant. {{ t.tasa_semana_anterior }}%
            </span>
            <span *ngIf="t.estado === 'ok'">funcionando normal</span>
          </div>
        </div>
      </section>

      <footer class="bvl__foot">
        <span class="bvl__foot-label">Receta activa:</span>
        <a [routerLink]="receta.route" class="bvl__foot-link">"{{ receta.label }}"</a>
        <span class="bvl__foot-meta">Última alerta: {{ receta.ultima_alerta }}</span>
      </footer>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bvl { height: 100%; display: flex; flex-direction: column; gap: $gv3-space-3; }
    .bvl__head { display: flex; align-items: center; gap: $gv3-space-2; }
    .bvl__head h4 { margin: 0; font-size: $gv3-text-sm; font-weight: 600; color: $gv3-text-primary; }
    .bvl__badge {
      font-family: $gv3-font-mono; font-size: 9px; letter-spacing: 0.08em;
      text-transform: uppercase; padding: 2px 6px; border-radius: $gv3-radius-sm;
      &--activo { background: $gv3-terracota-tint; color: $gv3-terracota; border: 1px solid rgba(184, 89, 58, 0.25); }
    }
    .bvl__alertas { display: flex; flex-direction: column; gap: $gv3-space-2; }
    .bvl__alerta {
      display: grid; grid-template-columns: 10px 1fr; gap: $gv3-space-2; align-items: start;
      padding: $gv3-space-2 $gv3-space-3; border-radius: $gv3-radius-sm;
      background: $gv3-rust-tint; border-left: 3px solid $gv3-rust;
      &[data-estado="critico"] .bvl__alerta-dot { background: $gv3-rust; }
    }
    .bvl__alerta-dot { width: 8px; height: 8px; border-radius: 50%; background: $gv3-rust; margin-top: 4px; }
    .bvl__alerta strong { display: block; font-size: $gv3-text-sm; color: $gv3-text-primary; }
    .bvl__alerta span { font-size: $gv3-text-xs; color: $gv3-text-secondary; }
    .bvl__actions { display: flex; flex-wrap: wrap; gap: $gv3-space-2; }
    .bvl__btn {
      font-family: $gv3-font-mono; font-size: 11px; padding: 6px 10px;
      border-radius: $gv3-radius-sm; border: 1px solid $gv3-border-default;
      background: $gv3-bg-surface; color: $gv3-text-secondary; cursor: pointer; text-decoration: none;
      &--gali { background: $gv3-terracota-tint; border-color: rgba(184, 89, 58, 0.3); color: $gv3-terracota; }
      &:hover { border-color: $gv3-orange; }
    }
    .bvl__carriers { display: flex; flex-direction: column; gap: 4px; flex: 1; min-height: 0; overflow-y: auto; }
    .bvl__carrier {
      display: grid; grid-template-columns: 10px 1fr; gap: $gv3-space-2; padding: 4px 0;
      &[data-estado="atencion"] .bvl__carrier-dot { background: $gv3-amber; }
      &[data-estado="ok"] .bvl__carrier-dot { background: $gv3-sage; }
    }
    .bvl__carrier-dot { width: 8px; height: 8px; border-radius: 50%; background: $gv3-text-muted; margin-top: 4px; }
    .bvl__carrier strong { display: block; font-size: $gv3-text-sm; }
    .bvl__carrier span { font-size: $gv3-text-xs; color: $gv3-text-tertiary; }
    .bvl__foot {
      border-top: 1px solid $gv3-border-whisper; padding-top: $gv3-space-2;
      font-size: $gv3-text-xs; color: $gv3-text-tertiary;
    }
    .bvl__foot-label { font-family: $gv3-font-mono; text-transform: uppercase; letter-spacing: 0.06em; }
    .bvl__foot-link { color: $gv3-terracota; text-decoration: none; margin-left: 4px; }
    .bvl__foot-meta { display: block; margin-top: 2px; }
  `],
})
export class BlockVigilanteLogisticoComponent {
  private agentSvc = inject(AgentOrchestratorService);
  private router = inject(Router);

  private data = vigilanteData as {
    alertas: Alerta[];
    transportadoras: Transportadora[];
    receta_activa: { label: string; ultima_alerta: string; route: string };
  };

  alertas = this.data.alertas;
  transportadoras = this.data.transportadoras;
  receta = this.data.receta_activa;

  iniciarReclamo() {
    this.agentSvc.activarAgenteLogistico();
    this.router.navigate(['/gali-v3/vista/operacion-hoy'], { queryParams: { panel: 'open' } });
  }
}

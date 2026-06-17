import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GaliMarketplaceService } from '../../../services/gali-v3/marketplace.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';

@Component({
  selector: 'app-gali-v3-agente-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agente-detail.component.html',
  styleUrls: ['./agente-detail.component.scss'],
})
export class GaliV3AgenteDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private marketSvc = inject(GaliMarketplaceService);
  private chatSvc = inject(GaliChatService);

  paramId = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  agente = computed(() => {
    const id = this.paramId().get('id');
    return id ? this.marketSvc.getAgente(id) : undefined;
  });

  relacionados = computed(() => {
    const a = this.agente();
    if (!a) return [];
    return this.marketSvc.agentes().filter(x => x.id !== a.id && x.color === a.color).slice(0, 3);
  });

  install() {
    const a = this.agente();
    if (!a) return;
    this.marketSvc.toggleAgenteInstalado(a.id);
    if (!a.instalado) {
      this.chatSvc.send(`Acabo de instalar el agente ${a.name}. ¿Qué puedo hacer ahora con él?`);
    }
  }

  invocar() {
    const a = this.agente();
    if (!a) return;
    this.chatSvc.send(`Invoca el agente ${a.name} sobre mi negocio ahora`);
  }

  back() {
    this.router.navigateByUrl('/gali-v3/mercado?tab=agentes');
  }
}

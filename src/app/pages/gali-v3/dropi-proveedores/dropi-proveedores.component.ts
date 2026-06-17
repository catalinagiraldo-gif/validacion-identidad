import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import provData from '../../../../../mocks/gali-v3/dropi-proveedores.json';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { ProximosPasosComponent } from '../../../components/gali-v3/shared/proximos-pasos.component';

interface AwakeProveedor {
  id: string; nombre: string; ciudad: string; categoria: string; productos: number;
  score_gali: number; entrega: string; devoluciones_pct: number; fit_perfil: number;
  destacados: string[]; alerta: string | null;
}

@Component({
  selector: 'app-gali-v3-dropi-proveedores',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent],
  templateUrl: './dropi-proveedores.component.html',
  styleUrls: ['./dropi-proveedores.component.scss'],
})
export class GaliV3DropiProveedoresComponent {
  private chatSvc = inject(GaliChatService);
  proveedores = signal<AwakeProveedor[]>(provData.proveedores as AwakeProveedor[]);
  awakeId = signal<string | null>(null);

  toggleAwake(id: string) {
    this.awakeId.set(this.awakeId() === id ? null : id);
  }

  analizar(p: AwakeProveedor) {
    this.chatSvc.send(`Analiza al proveedor ${p.nombre} contra mi nicho`);
  }

  verCatalogo(p: AwakeProveedor) {
    this.chatSvc.send(`Muéstrame los productos top de ${p.nombre}`);
  }

  fitColor(fit: number): string {
    if (fit >= 80) return 'high';
    if (fit >= 60) return 'mid';
    return 'low';
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { GaliRetosService, RetoDiario, RetoSemanal, MisionLarga } from '../../../services/gali-v3/retos.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { ProximosPasosComponent } from '../../../components/gali-v3/shared/proximos-pasos.component';

@Component({
  selector: 'app-gali-v3-retos',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent],
  templateUrl: './retos.component.html',
  styleUrls: ['./retos.component.scss'],
})
export class GaliV3RetosComponent {
  private retosSvc = inject(GaliRetosService);
  private chatSvc = inject(GaliChatService);
  private router = inject(Router);

  perfil = this.retosSvc.perfilJugador;
  insignias = this.retosSvc.insigniasGanadas;
  insigniasProx = this.retosSvc.insigniasProximas;
  diarios = this.retosSvc.retosDiarios;
  semanales = this.retosSvc.retosSemanales;
  misiones = this.retosSvc.misionesLargas;
  lider = this.retosSvc.liderComunidad;
  cohorte = this.retosSvc.cohorteTop;
  progresoDiario = this.retosSvc.progresoDiario;
  diariosDone = this.retosSvc.diariosCompletados;
  diariosTotal = this.retosSvc.diariosTotal;
  puntosHoy = this.retosSvc.puntosHoy;

  selectedMision = signal<string | null>(null);

  toggleReto(r: RetoDiario) {
    this.retosSvc.completarReto(r.id);
  }

  toggleSemanal(r: RetoSemanal) {
    this.retosSvc.completarSemanal(r.id);
  }

  iniciarReto(r: RetoDiario | RetoSemanal) {
    if (r.ruta) this.router.navigateByUrl(r.ruta);
  }

  expandirMision(m: MisionLarga) {
    this.selectedMision.set(this.selectedMision() === m.id ? null : m.id);
  }

  activarLider() {
    this.retosSvc.activarLider();
    if (!this.lider().activo) {
      // se acaba de activar
      this.chatSvc.send(`Activé al Líder de Comunidad virtual. ¿Qué me recomienda hoy?`);
    }
  }

  preguntarLider() {
    this.chatSvc.send(`Líder virtual, ¿qué harías tú en mi situación con el Collar GPS?`);
  }
}

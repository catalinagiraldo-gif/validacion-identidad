import { Injectable, signal, computed } from '@angular/core';
import plantillasData from '../../../../mocks/gali-v3/mercado/plantillas.json';
import agentesData from '../../../../mocks/gali-v3/mercado/agentes.json';
import conexionesData from '../../../../mocks/gali-v3/mercado/conexiones.json';
import { PlantillaMercado, AgenteMercado, ConexionMercado } from './types';

@Injectable({ providedIn: 'root' })
export class GaliMarketplaceService {
  readonly plantillas = signal<PlantillaMercado[]>(
    (plantillasData as { plantillas: PlantillaMercado[] }).plantillas,
  );
  readonly agentes = signal<AgenteMercado[]>(
    (agentesData as { agentes: AgenteMercado[] }).agentes,
  );
  readonly conexiones = signal<ConexionMercado[]>(
    (conexionesData as { conexiones: ConexionMercado[] }).conexiones,
  );

  readonly agentesInstalados = computed(() => this.agentes().filter(a => a.instalado));
  readonly conexionesActivas = computed(() => this.conexiones().filter(c => c.conectado));

  toggleAgenteInstalado(id: string) {
    this.agentes.set(
      this.agentes().map(a => (a.id === id ? { ...a, instalado: !a.instalado } : a)),
    );
  }

  toggleConexion(id: string) {
    this.conexiones.set(
      this.conexiones().map(c =>
        c.id === id
          ? { ...c, conectado: !c.conectado, estado: !c.conectado ? 'Activo · recién conectado' : 'No conectado' }
          : c,
      ),
    );
  }

  getAgente(id: string): AgenteMercado | undefined {
    return this.agentes().find(a => a.id === id);
  }
}

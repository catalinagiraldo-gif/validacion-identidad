import { Injectable, signal, computed } from '@angular/core';
import comunidadData from '../../../../mocks/gali-v3/comunidad.json';
import {
  AlertaComunidad,
  CasoTop,
  FiltroComunidad,
  FiltroComunidadId,
  ProductoTendencia,
  ResumenLiderVirtual,
  SenalComunidad,
} from './types';

const FILTRO_KEY = 'gali_v3_comunidad_filtro';
const MENTOR_KEY = 'gali_v3_comunidad_mentor';

interface ComunidadFile {
  resumen_lider_virtual: ResumenLiderVirtual;
  modo_mentor_intro: string;
  filtros_disponibles: FiltroComunidad[];
  senales: SenalComunidad[];
  productos_tendencia: ProductoTendencia[];
  casos_top: CasoTop[];
  alertas_comunidad: AlertaComunidad[];
}

@Injectable({ providedIn: 'root' })
export class GaliComunidadService {
  private data = comunidadData as ComunidadFile;

  readonly resumenLider = signal<ResumenLiderVirtual>(this.data.resumen_lider_virtual);
  readonly modoMentorIntro = signal<string>(this.data.modo_mentor_intro);
  readonly filtros = signal<FiltroComunidad[]>(this.data.filtros_disponibles);

  readonly senalesRaw = signal<SenalComunidad[]>(this.data.senales);
  readonly productos = signal<ProductoTendencia[]>(this.data.productos_tendencia);
  readonly casos = signal<CasoTop[]>(this.data.casos_top);
  readonly alertas = signal<AlertaComunidad[]>(this.data.alertas_comunidad);

  readonly filtroActivo = signal<FiltroComunidadId>(this.loadFiltro());
  readonly modoMentor = signal<boolean>(this.loadMentor());

  readonly senalesFiltradas = computed<SenalComunidad[]>(() => {
    const filtro = this.filtroActivo();
    const todas = this.senalesRaw();
    if (filtro === 'perfil') {
      return [...todas]
        .filter(s => s.relevancia_perfil >= 0.5)
        .sort((a, b) => b.relevancia_perfil - a.relevancia_perfil);
    }
    if (filtro === 'nicho') {
      // Mock: filtrar las relevantes a mascotas/bienestar
      return todas.filter(s =>
        ['mascotas', 'bienestar', 'skincare', 'operacion', 'escala'].includes(s.categoria),
      );
    }
    // ecosistema = todas
    return [...todas].sort((a, b) => b.confianza - a.confianza);
  });

  readonly senalesTendencia = computed<SenalComunidad[]>(() =>
    this.senalesFiltradas().filter(s => s.tipo === 'tendencia'),
  );

  readonly senalesEstrategia = computed<SenalComunidad[]>(() =>
    this.senalesFiltradas().filter(s => s.tipo === 'estrategia'),
  );

  readonly senalesOportunidad = computed<SenalComunidad[]>(() =>
    this.senalesFiltradas().filter(s => s.tipo === 'oportunidad'),
  );

  readonly alertasOrdenadas = computed<AlertaComunidad[]>(() => {
    const orden = { alta: 0, media: 1, baja: 2 };
    return [...this.alertas()].sort((a, b) => orden[a.severidad] - orden[b.severidad]);
  });

  readonly top3Movimientos = computed<SenalComunidad[]>(() =>
    [...this.senalesFiltradas()]
      .filter(s => s.tipo === 'estrategia')
      .sort((a, b) => b.confianza - a.confianza)
      .slice(0, 3),
  );

  readonly totalVendedoresVistos = computed(() => this.resumenLider().vendedores_analizados);

  setFiltro(f: FiltroComunidadId) {
    this.filtroActivo.set(f);
    try {
      localStorage.setItem(FILTRO_KEY, f);
    } catch {}
  }

  toggleMentor() {
    const next = !this.modoMentor();
    this.modoMentor.set(next);
    try {
      localStorage.setItem(MENTOR_KEY, next ? '1' : '0');
    } catch {}
  }

  confianzaTexto(valor: number): string {
    if (valor >= 0.8) return 'Alta';
    if (valor >= 0.65) return 'Media-alta';
    if (valor >= 0.5) return 'Media';
    return 'Baja — datos limitados';
  }

  confianzaColor(valor: number): 'sage' | 'amber' | 'rust' {
    if (valor >= 0.8) return 'sage';
    if (valor >= 0.65) return 'amber';
    return 'rust';
  }

  private loadFiltro(): FiltroComunidadId {
    try {
      const raw = localStorage.getItem(FILTRO_KEY);
      if (raw === 'perfil' || raw === 'nicho' || raw === 'ecosistema') return raw;
    } catch {}
    return 'perfil';
  }

  private loadMentor(): boolean {
    try {
      return localStorage.getItem(MENTOR_KEY) === '1';
    } catch {
      return false;
    }
  }
}

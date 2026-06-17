import { BlockId, BlockSize } from './block-registry';

export interface LayoutItem {
  blockId: BlockId;
  size: BlockSize;
}

export interface StarterPack {
  id: 'primer-dia' | 'operacion-diaria' | 'centro-mando';
  label: string;
  hint: string;
  layout: LayoutItem[];
}

export const STARTER_PACKS: StarterPack[] = [
  {
    id: 'primer-dia',
    label: 'Primer día',
    hint: 'Lo esencial para arrancar — misiones, productos, integraciones.',
    layout: [
      { blockId: 'starter-tour', size: 'full' },
      { blockId: 'productos', size: '2x2' },
      { blockId: 'integraciones', size: '2x1' },
      { blockId: 'misiones', size: '1x1' },
      { blockId: 'cartera', size: '1x1' },
    ],
  },
  {
    id: 'operacion-diaria',
    label: 'Operación diaria',
    hint: 'Para quien ya tiene producto que vende y operación en marcha.',
    layout: [
      { blockId: 'pedidos', size: '3x2' },
      { blockId: 'novedades', size: '2x1' },
      { blockId: 'cartera', size: '1x1' },
      { blockId: 'proyecto-activo', size: '2x2' },
      { blockId: 'metricas', size: '2x1' },
    ],
  },
  {
    id: 'centro-mando',
    label: 'Centro de mando',
    hint: 'Densidad alta para operación multi-producto.',
    layout: [
      { blockId: 'metricas', size: '3x1' },
      { blockId: 'pedidos', size: '2x2' },
      { blockId: 'novedades', size: '1x1' },
      { blockId: 'cartera', size: '1x1' },
      { blockId: 'integraciones', size: '2x1' },
      { blockId: 'landings', size: '2x1' },
      { blockId: 'memoria', size: 'full' },
    ],
  },
];

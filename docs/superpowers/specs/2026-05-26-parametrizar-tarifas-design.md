# Parametrizar Tarifas - Design Spec

**Module:** configuraciones > parametrizar-tarifas
**Role:** admin only
**Jira:** PROD-237 (epic PROD-235)
**Figma:** PDeeZVQMyF3i6SUFCWyuQa (nodes 56:10813, 2093:83705)

## Overview

Admin panel for configuring carrier shipping rates. Two views: a card grid listing all carriers, and a detail page with tabbed configuration per carrier. Priority: functional clarity over visual complexity. Code should be straightforward for the dev team to implement in production.

## Architecture

### File Structure

```
src/app/pages/parametrizar-tarifas/
  parametrizar-tarifas.component.ts/html/scss   # List view
  carrier-detail.component.ts/html/scss          # Detail view (tabs + simulator)
  meta.json                                       # RPP card metadata
mocks/
  carriers.json                                   # 3 carriers with full data
  audit-log.json                                  # Audit trail mock
```

### Routes (no /admin/ prefix - consistent with repo pattern)

```
configuraciones/parametrizar-tarifas              # List
configuraciones/parametrizar-tarifas/:carrierId   # Detail
```

Both lazy-loaded standalone components under the existing auth-guarded children array in `app.routes.ts`.

### Navigation Map

New module in `navigation-map.json`:
- Parent: Configuraciones
- Label: "Parametrizar Tarifas"
- Role: admin
- Position: after "Categoría de Usuario" in sidebar submenu

Update `sidebar-nav.config.ts` admin section to add the new subitem.

## Vista 1: Lista de Carriers

### Layout

- Breadcrumb: Configuraciones > Parametrizar Tarifas
- Page header: title + subtitle describing the module purpose
- 2 select filters: País (all/AR/CO/GT) + Tipo (all/express/industrial)
- Responsive card grid (CSS Grid, `min(320px, 100%)` per card)

### Card Content

Each card shows:
- Carrier name (bold) + country/code (right-aligned, secondary text)
- Badge(s): "Paquetería Express" (warning variant) and/or "Mercancía Industrial" (info variant)
- 3 stats row: Trayectos count | IVA % | Servicios count
- Click navigates to detail via `router.navigate`

## Vista 2: Detalle del Carrier

### Header

- Back button (tertiary dropi-button with left arrow)
- Carrier name as heading
- Type badges
- Meta line (right): "País - Código | IVA: X% | Trayectos: N"
- Breadcrumb: Configuraciones > Parametrizar Tarifas > [Carrier Name]

### Tabs (conditional)

Shown only if data exists:
1. "Paquetería Express" - if `tipos` includes 'express'
2. "Mercancía Industrial" - if `tipos` includes 'industrial'
3. "Descuentos Volumen" - if `volumen.length > 0`
4. "Auditoría" - always shown

### Tab: Paquetería Express

Title + subtitle explaining the section.

**Accordion of trayectos** (single-open, HTML `[hidden]` toggle):
- Collapsed: number + name + type badge | preview text "Flete: $X | Incr: $X | N rangos" | chevron
- Expanded: sub-tabs

**Sub-tab "Variables Financieras":**
- 2-column grid of cards
- Card 1 "QUE COBRA DROPI": tasa sobreflete (%), min sobreflete ($), seguro (%), incremento ($)
- Card 2 "QUE COBRA LA TRANSPORTADORA": tasa sobreflete (%), min sobreflete ($), seguro (%), COD (%), devolucion ($)
- All inputs: type=number, font-mono, right-aligned, unit suffix (% or $)
- Note text below card 1 about minimum logic

**Sub-tab "Rangos de Peso":**
- Editable table: Desde (kg) | Hasta (kg) | Precio base ($) | KG adicional ($/kg) | Modo | Acciones
- Modes: fijo, adicional, minimo, por kg (each with a badge variant)
- Hasta = null displays as infinity symbol
- Click cell value -> input appears, Enter saves, Escape cancels (blur also saves)
- "+ Agregar rango" dashed button at bottom
- Delete button per row (disabled if only 1 row)

"+ Agregar trayecto" dashed full-width button at bottom of the accordion list.

### Tab: Mercancia Industrial

**Section 1 - Peso Volumetrico:**
- Title + description
- 2 cards: "Territorial" (PV = L x A x H x 400) and "Internacional" (PV = L x A x H / 2500)
- Warning alert: "Se cobra el MAYOR entre peso volumetrico y peso bruto"

**Section 2 - Tabla Origen-Destino:**
- Title + description
- Action buttons: Importar Excel (success) | Exportar (secondary) | + Origen (secondary) | + Destino (secondary)
- Table: first column sticky (origins), headers = destinations, cells = currency values (mono font)
- Diagonal cells (same city) highlighted with success variant
- Click cell for inline edit

**Section 3 - Remesas:**
- Info alert explaining remesa logic

**Empty state** (if carrier has no O-D data):
- Centered message + "Configurar Mercancia Industrial" primary button

### Tab: Descuentos Volumen

- Editable table: Rango guias/mes | Descuento % | Factor % | Accion
- Active range: highlighted row + "VIGENTE" disabled primary button
- Other ranges: "Aplicar" secondary button

### Tab: Auditoria

- Read-only table: Fecha | Usuario | Trayecto | Campo | Anterior | Nuevo
- "Anterior" values: strikethrough, danger color
- "Nuevo" values: bold, success color
- 4 mock entries with realistic data

### Simulator (floating panel)

- FAB button (fixed, bottom-right): calculator icon, only visible in detail view
- Click toggles a floating panel (320px, bottom-right, with shadow)
- Panel content:
  - Header: "Simulador de rentabilidad" + close button
  - Inputs: Valor de la orden (number), Peso kg (number), Trayecto (select from active carrier)
  - Separator
  - "TARIFA SELLER" section: flete, sobreflete, seguro, incremento, IVA, total
  - "COSTO TRANSPORTADORA" section: flete, sobreflete, seguro, IVA, total
  - "Utilidad Dropi" result: green if margin >15%, red if <15%
  - Margin percentage

**Calculation logic** (exact implementation):

```
calcFlete(tiers, peso):
  iterate tiers, apply mode logic (fijo/minimo/adicional/por kg)

Seller:
  flete = calcFlete(tiers, peso)
  sobre = max(valor * sob_tasa/100, sob_min)
  seg = valor * seg/100
  sub = flete + sobre + seg + dropi_increment
  iva = sub * iva_pais/100
  total_seller = sub + iva

Costo:
  costSobre = max(valor * sob_tasa_co/100, sob_min_co)
  costSeg = valor * seg_co/100
  costSub = flete + costSobre + costSeg
  costIva = costSub * iva_pais/100
  total_costo = costSub + costIva

utilidad = total_seller - total_costo
margen = (utilidad / total_seller) * 100
```

## DS Registry Usage

| Component | Source | Notes |
|---|---|---|
| dropi-button | DS Registry | All variants: primary, secondary, tertiary, dashed, float-button |
| dropi-input | DS Registry | Number type, mono font for currency |
| dropi-card | DS Registry | For carrier cards and variable sections |
| dropi-badge | DS Registry | Type badges on cards |
| dropi-alert | DS Registry | Info and warning alerts |
| dropi-tabs | DS Registry | Main tabs and sub-tabs |
| dropi-breadcrumb | DS Registry | Navigation trail |
| Select | Custom SCSS | Same styling as dropi-input (border, radius, font) |
| Table | Custom SCSS | orders-provider pattern (.table-container white + shadow) |
| Accordion | Custom SCSS | Simple [hidden] toggle + chevron rotation |
| Empty state | Custom SCSS | Centered with DS tokens |
| FAB | dropi-button float-button variant | Fixed positioning |
| Panel | Custom SCSS | Fixed position, shadow, 320px |
| Page header | Custom SCSS | Title + subtitle pattern |

## Mock Data

3 carriers with complete data:
1. **Urbano** (AR) - 5 trayectos, express only, volume discounts
2. **FiXi** (AR) - 4 trayectos, express only, no volume discounts
3. **Envia** (CO) - 2 trayectos, express + industrial, O-D matrix, volume discounts

## Design Principles

- Functional clarity over visual complexity
- Easy for dev team to translate to production Angular
- All DS tokens used consistently (colors, spacing, typography, radius)
- No over-engineering: no state management library, no complex services
- Inline editing: simple click-to-edit pattern
- Currency format: toLocaleString('es-CO') throughout
- Orange primary (#f49a3d) per DS, not green/blue
- Font stack: Inter primary, IBM Plex Sans secondary, JetBrains Mono for numbers

## Out of Scope (MVP)

- Real persistence (mock/localStorage only)
- Functional Excel import/export (buttons present, no implementation)
- Editable audit log (read-only)
- Real auth/role guard (uses existing mock auth)

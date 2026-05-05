# Dropi Prototypes — RPP Pipeline Rules

## DS Registry (MANDATORY)

Before writing ANY UI code (components, pages, templates, styles), you MUST:

1. Read `ds-registry/index.json` to understand available components and tokens
2. Read the relevant component spec(s) from `ds-registry/components/` for whatever you're building
3. Read the relevant token file(s) from `ds-registry/tokens/` if you need color, spacing, typography, radius, or shadow values
4. Apply all `designRules` from each component spec — these are non-negotiable constraints from the real Dropi Design System

### What to check per task:

| Building... | Read these specs first |
|---|---|
| Any page with buttons | `dropi-button.json` |
| Any page with forms/inputs | `dropi-input.json` |
| Sidebar changes | `dropi-sidebar.json` |
| Header changes | `dropi-header.json` |
| Pages with status indicators | `dropi-badge.json`, `dropi-tag.json` |
| Modal/dialog flows | `dropi-modal.json` |
| Multi-step flows | `dropi-steps.json`, `dropi-tabs.json` |
| Data cards | `dropi-card.json` |
| Feedback/alerts | `dropi-alert.json` |
| Colors, spacing, fonts | `tokens/colors.json`, `tokens/spacing.json`, `tokens/typography.json` |

### Rules:

- **Never hardcode** values that exist as DS tokens — use SCSS variables from `src/styles/_variables.scss`
- **Never invent** component styles — if a DS Registry spec exists, follow it exactly
- **Primary color is ORANGE (#f49a3d)**, not green, not blue
- **Font stack**: Inter (primary), IBM Plex Sans (menu items), Montserrat (avatars only)
- **Buttons**: Always use "New" type for new flows, never "Old" (legacy DS 1.0)
- **Sidebar**: White background, 250px wide, shadow `0.5px 4px 8px rgba(0,0,0,0.08)`

## Project Stack

- Angular 17.3 (Standalone components)
- SCSS with design tokens in `src/styles/_variables.scss`
- PrimeNG 17 + PrimeIcons
- Mock API via HTTP interceptor (`src/app/common/interceptors/mock-api.interceptor.ts`)
- Yarn 1.22, Node 22.7 (use nvm: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use`)

## Navigation Context Map (MANDATORY)

Before generating any prototype, read `navigation-map.json` at the repo root. It maps:
- **Modules** with defaultView, roles, figmaSource
- **Views** with route, type (page/modal), prototype status, layout description, CTAs
- **Origin points** — where users come from to reach each view
- **Post-action flows** — what happens after success/cancel

Rules:
- **Never create a prototype in a route that doesn't match the module** in the navigation map
- **Always update the `prototype` field** in `navigation-map.json` when a wireframe is created
- **Match sidebar labels exactly** — the sidebar config (`src/app/config/sidebar-nav.config.ts`) is sourced from Figma DS node 243:14156

## Sidebar (Source of Truth: Figma)

- Config: `src/app/config/sidebar-nav.config.ts` — labels, icons, subitems per role
- Icons: Custom SVGs from Figma at `src/assets/icons/sidebar/` (30 icons, 20x20px)
- Rendered as `<img>` tags, NOT PrimeIcons `<i>` tags
- 3 roles with distinct nav: dropshipper (21 items), proveedor (20 items), admin (23 items)
- **DO NOT modify sidebar without Figma context** — labels, icons, and subitems must match exactly
- Figma source: `ONiVQJJ2qrJ6tmJnpNrrKE` node `243:14156`

## Auth System

- 3 user roles: `dropshipper`, `proveedor`, `admin`
- Each role has a distinct sidebar navigation (see `src/app/config/sidebar-nav.config.ts`)
- Mock users in `mocks/users.json`
- Auth service manages session via localStorage
- Login page at `/login`, protected routes via `authGuard`

## Frontend Design Quality (MANDATORY)

Apply production-grade design quality to every interface. Focus on:

- **Spatial Composition**: Intentional layouts, asymmetry where it adds value, generous negative space, grid-breaking elements when appropriate
- **Motion & Microinteractions**: CSS transitions for hover states, staggered reveals on page load (animation-delay), scroll-triggered effects. Prioritize CSS-only solutions. High-impact moments over scattered animations
- **Backgrounds & Depth**: Atmosphere through subtle gradients, layered transparencies, shadows with purpose. Avoid flat solid-color backgrounds when depth improves the experience
- **Visual Details**: Decorative borders, custom iconography placement, grain overlays, and textures that match the Dropi brand personality

### What this does NOT override:

- **Typography**: Always use the DS Registry fonts (Inter, IBM Plex Sans, Montserrat). Never substitute with other fonts
- **Colors**: Always use DS tokens from `_variables.scss`. Never invent new colors
- **Component styles**: Always follow DS Registry specs exactly. Never redesign existing components
- **Spacing & Radius**: Always use DS tokens ($size-N, $radius-N)

The DS Registry is the source of truth for all design tokens and component specs. Frontend design quality enhances the experience within those constraints — it does not replace them.

## Wireframe Generation Protocol (MANDATORY)

### Step 0: Receive the Wireframe Prompt

Every wireframe request MUST include at minimum:
- **Vista**: nombre, módulo, rol de usuario
- **Figma URL**: con node-id (obligatorio)
- **Tipo**: page o modal (si modal: vista padre, CTA que lo abre, on_success, on_cancel)
- **Datos mock**: entidad, cantidad mínima de items, propiedades

See `docs/wireframe-prompt-template.md` for the full template any designer can use.

### Step 1: Read Before Writing (NO CODE YET)

Before writing a single line of code, complete this checklist IN ORDER:

1. ☐ **Navigation Map** — Read `navigation-map.json`, locate the module/view, verify type (page/modal), origin_points, on_success
2. ☐ **Figma Design Context** — Call `get_design_context` for EACH section of the design (filters, cards, forms, headers, etc.). If a node is too large, drill into sub-nodes. NEVER assume any UI element.
3. ☐ **DS Registry** — Read specs for every component you'll use (`ds-registry/components/` + `ds-registry/tokens/`)
4. ☐ **Download Assets** — Download ALL images, icons, and badges from Figma to `src/assets/images/[module]/` BEFORE coding
5. ☐ **Mock Data** — Create rich mock data (20+ items minimum) with ALL properties the design needs, saved in `mocks/`

### Step 2: Build

6. ☐ Create Angular standalone component with SCSS using tokens from `src/styles/_variables.scss`
7. ☐ Add lazy-loaded route in `src/app/app.routes.ts` as a child of the module
8. ☐ If **modal**: implement as overlay (`position: fixed`, backdrop blur, animation) on top of the parent view. NEVER navigate to a separate route for modals. Scroll must be INSIDE the modal container, with header/footer fixed.
9. ☐ If **page**: implement as a routed component with proper breadcrumb

### Step 3: Verify

10. ☐ Verify compilation without errors
11. ☐ Update `prototype` field in `navigation-map.json` with the component route
12. ☐ Verify images load correctly via dev server

### Anti-Hallucination Rules

| NEVER do this | ALWAYS do this |
|---|---|
| Invent UI controls (button vs switch vs dropdown) | Copy exactly what Figma shows |
| Add labels above inputs if Figma only has placeholders | Respect if it's label, placeholder, or both |
| Use generic placeholder images | Download real images from Figma |
| Navigate to a route when navigation-map says "modal" | Stack as modal overlay on parent view |
| Create 5-8 mock items | Create 20+ items for natural scroll |
| Translate or rename texts from the design | Copy exact texts from Figma (e.g. "Número de télefono" not "Teléfono") |
| Assume form field structure | Read the form node in Figma field by field |
| Fill in gaps with guesses | Ask the designer before proceeding |
| Read Figma once, then code from memory | Call `get_design_context` per sub-section BEFORE coding each piece |
| Use DS token colors when Figma shows different ones | Use the EXACT hex from Figma, document the discrepancy |
| Use PrimeIcons `<i>` tags for action icons | Download real SVGs from Figma, fix `preserveAspectRatio` and CSS vars |
| Hardcode `preserveAspectRatio="none"` in SVGs | Always set `preserveAspectRatio="xMidYMid meet"` |
| Leave `var(--fill-0, COLOR)` in downloaded SVGs | Replace CSS variable syntax with hardcoded color (img tags don't support CSS vars) |

### Figma-to-Code Extraction Process (MANDATORY per sub-section)

For EACH section of a wireframe (action bar, table row, cell, badge, icon group, card, filter bar):

1. Call `get_design_context` on that specific sub-node
2. From the response, extract exact values: hex colors, font-family, font-weight, font-size, line-height, gap, padding, border-radius, width, height
3. Write those values directly into SCSS — never interpolate or "close enough"
4. If a Figma value differs from DS tokens, use the Figma value and add a comment with the discrepancy

### SVG Asset Protocol

After downloading any SVG from Figma:

```python
# Fix all SVGs in a directory
import re, glob
for f in glob.glob('*.svg'):
    with open(f) as fh: content = fh.read()
    content = re.sub(r'var\(--fill-0,\s*([^)]+)\)', r'\1', content)  # Remove CSS vars
    content = content.replace('preserveAspectRatio="none"', 'preserveAspectRatio="xMidYMid meet"')
    content = content.replace('width="100%" height="100%"', '')
    with open(f, 'w') as fh: fh.write(content)
```

### Responsive Layout Rules

Every new page component MUST follow this pattern:

```scss
:host {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.page-wrapper {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: $size-4 $size-8;
}
```

- The app shell constrains content to `height: calc(100vh - 70px)` with `overflow-y: auto`
- Each module scrolls internally — never cause page-level scroll
- Tables go inside `.table-scroll { overflow-x: auto; }`
- Fixed-width inputs add `max-width: 100%`
- Filter rows add `flex-wrap: wrap`
- Images add `max-width: 100%`

### Prototype Inventory

| Module | View | Route | Type | Status |
|---|---|---|---|---|
| productos | catálogo | /productos/catalogo | page | WORKING |
| productos | caza-productos | /productos/caza-productos | page | WORKING |
| productos | proveedores | /productos/proveedores | page | WORKING |
| pedidos | orden-manual | (modal on catálogo) | modal | WORKING |
| pedidos | mis-pedidos | /mis-pedidos/mis-pedidos | page | WORKING |
| financiero | historial-cartera | /historial-de-cartera | page | WORKING |
| standalone | dropicard | /dropi-card/cards | page | WORKING |
| standalone | academy | /academy | page | WORKING |
| cas | bandeja | /cas/bandeja | page | WORKING |

<!-- GSD:project-start source:PROJECT.md -->
## Project

**RPP Hub — Dropi Prototyping Hub**

A private web portal at `dropitesters.co` where stakeholders (sponsors, board members, Product Designers, devs, external testers) can browse and interact with live Angular prototypes built by the RPP pipeline. Users log in with Google, select a profile (Dropshipper, Proveedor, or Marca Blanca), and see only the prototypes relevant to that role.

**Core Value:** Stakeholders enter the Hub, pick their profile, and access any live prototype in one click — no setup, no git, no local environment needed.

### Constraints

- **Timeline**: Hub + login must be functional today (2026-05-05)
- **Tech stack**: Angular 17.3 (existing), no framework migration
- **Auth**: Google Identity Services + Firebase Auth (free tier, 10K users/month)
- **Hosting**: Vercel (free Hobby tier initially)
- **Budget**: Zero — all free-tier services
- **No backend**: Everything client-side, JSON-based configuration
- **DS Registry**: All UI must follow Dropi Design System specs in `ds-registry/`
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

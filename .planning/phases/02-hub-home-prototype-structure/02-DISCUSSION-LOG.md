# Phase 2: Hub Home + Prototype Structure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 02-hub-home-prototype-structure
**Areas discussed:** Card design, meta.json schema, Search behavior, Registry script

---

## Hub Location & Sidebar (pre-discussion)

Decided before formal discussion, during strategic analysis:

**User's input:** "Para cualquier tipo de usuario, cuando ingrese el módulo Inicio va a contener los prototipos. INICIO=HUB"
**Decision:** Hub lives at /home as the Inicio module. Sidebar stays complete per role.

---

## Thumbnails

| Option | Description | Selected |
|--------|-------------|----------|
| Screenshot manual | Each prototype includes a thumbnail.png, generated manually | |
| Icono por módulo | Generic icon per module, no real screenshot | |
| Placeholder genérico | Same placeholder for all cards | |
| Playwright en Phase 2 | User moved Playwright from Phase 3 to Phase 2 | ✓ |

**User's choice:** Playwright thumbnails must be in Phase 2, not Phase 3. Cards need real screenshots from day 1.

Follow-up — when to capture:

| Option | Description | Selected |
|--------|-------------|----------|
| Script manual (yarn generate-thumbnails) | Run locally when needed | ✓ |
| Pre-build automático | Part of yarn build, adds ~30s | |
| En CI (GitHub Action) | Only in pipeline | |

**User's choice:** Script manual.

---

## Card Design

| Option | Description | Selected |
|--------|-------------|----------|
| Título + módulo + fecha | Essential info on card surface | ✓ |
| Owner (quién lo hizo) | Name of creator | ✓ |
| Descripción corta | 1-2 lines on card surface | |
| Ticket Jira | Reference to Jira ticket | |

**User's choice:** Title, module, date, owner visible on card. Description as tooltip on hover (user's own suggestion — not in original options).
**Notes:** User specifically wanted description as "hover con descripción super corta tipo tooltip", not visible on card surface.

---

## meta.json Schema — Owner

| Option | Description | Selected |
|--------|-------------|----------|
| Nombre libre | Free string like "Ana García" | |
| Email @dropi.co | Corporate email format | ✓ |
| Nombre + email | Both fields | |

**User's choice:** Email @dropi.co format.

## meta.json Schema — Date

| Option | Description | Selected |
|--------|-------------|----------|
| Manual en meta.json | Designer/Claude writes date at creation time | ✓ |
| Auto del git | Extracted from first commit of directory | |

**User's choice:** Manual in meta.json.

---

## Search Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Filtro instantáneo | Real-time filter as user types, no debounce | ✓ |
| Filtro con debounce 300ms | Waits 300ms after typing stops | |
| Botón buscar | User presses Enter or clicks search | |

**User's choice:** Instant filter.

## Empty State

| Option | Description | Selected |
|--------|-------------|----------|
| Mensaje + limpiar filtro | Message with clear button | ✓ |
| Solo mensaje | Text only, no action | |

**User's choice:** Message with "Limpiar búsqueda" button.

---

## Registry Script

| Option | Description | Selected |
|--------|-------------|----------|
| src/app/config/ | Next to sidebar config | ✓ |
| src/app/prototypes/ | Dedicated prototypes directory | |
| Raíz del proyecto | Root level | |

**User's choice:** src/app/config/prototypes.registry.ts

## Registry Git Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Se commitea | Generated file committed to repo | ✓ |
| En .gitignore | Generated at build time, never committed | |

**User's choice:** Committed. Designers don't run scripts — Claude Code handles it.

---

## Claude's Discretion

- Card grid layout (responsive columns, gap, card dimensions)
- Playwright viewport size and screenshot resolution
- Search algorithm (simple includes vs fuzzy)
- Registry script language (Node.js vs ts-node)

## Deferred Ideas

- Physical migration to src/app/prototypes/ — Phase 3
- CI validation of meta.json — Phase 3
- Auto-PR on prototype branches — Phase 3

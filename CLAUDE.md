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

## Auth System

- 3 user roles: `dropshipper`, `proveedor`, `admin`
- Each role has a distinct sidebar navigation (see `src/app/config/sidebar-nav.config.ts`)
- Mock users in `mocks/users.json`
- Auth service manages session via localStorage
- Login page at `/login`, protected routes via `authGuard`

## Prototype Generation Pattern

When generating a new prototype wireframe from a Jira ticket:

1. Read DS Registry specs for all components you'll use
2. Create the page component in `src/app/pages/<ticket-slug>/`
3. Add lazy-loaded route in `src/app/app.routes.ts` (inside the auth-guarded children)
4. Use SCSS variables, PrimeNG components, and DS design rules
5. Wire up mock data through the interceptor if needed

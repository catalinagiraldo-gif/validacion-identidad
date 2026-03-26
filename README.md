# dropi-prototypes

Angular 17 prototype repository for the Dropi RPP (Rapid Prototyping Pipeline). Product Designers use Claude Code to generate interactive wireframes that follow Dropi's real codebase conventions.

## Stack

| Technology | Version |
|---|---|
| Angular CLI | 17 |
| Node.js | 22.7.0 (use `nvm use`) |
| Yarn | 1.22.x |
| PrimeNG | 17.x |
| Styles | SCSS |
| Components | Standalone |

## Quick Start

```bash
nvm use
yarn install
yarn start
```

Open [http://localhost:4200](http://localhost:4200) to see the Prototype Gallery.

## Project Structure

```
src/app/
  ui/                    # Atoms (dropi-button, dropi-card, etc.)
  components/            # Molecules, Organisms, Templates
  pages/                 # Full page views per prototype
  services/              # HTTP services (intercepted by mock layer)
  models/                # TypeScript interfaces
  layout/                # App shell (sidebar, header)
  common/interceptors/   # Mock API interceptor

ds-registry/             # Design System component specs + tokens (JSON)
mocks/                   # Mock data (JSON) — replaces database
prototypes/              # Prototype documentation index
```

## How It Works

- **No backend needed** — an Angular HTTP interceptor responds with mock JSON data
- **No database** — all data lives in `mocks/*.json`, mutable in memory per session
- **Services call `/api/*`** — identical patterns to the production codebase
- **DS Registry** — JSON specs for each Design System component, consumed by Claude Code

## Branching Model

| Type | Format | Example |
|---|---|---|
| Wireframe | `wireframe/DROPI-XXXX-name` | `wireframe/DROPI-1234-bulk-actions` |
| DS Registry | `registry/name` | `registry/add-dropi-table` |
| Mock data | `mocks/name` | `mocks/add-wallet-data` |
| Infra | `infra/name` | `infra/fix-routing` |

## Roles

| Role | Responsibility |
|---|---|
| **Product Designer** | Generates wireframes with Claude Code |
| **UX Engineer** | Reviews PRs, maintains DS Registry, merges |
| **FE Champion** | Evaluates technical feasibility |

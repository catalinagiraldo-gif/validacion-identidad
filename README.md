# dropi-prototypes

Angular 17 prototype repository for the Dropi RPP (Rapid Prototyping Pipeline). Product Designers use Claude Code to generate interactive wireframes that follow Dropi's real codebase conventions.

> **Primera vez?** Si nunca has usado este repo, sigue la guía completa en [`docs/git-workflow-designers.md`](docs/git-workflow-designers.md). Ahí se explica desde instalar las herramientas hasta abrir tu primer PR.

## Pre-requisitos

| Herramienta | Para qué | Instalación |
|---|---|---|
| **nvm** | Manejar versiones de Node.js | `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh \| bash` |
| **Node.js 22.7.0** | Runtime del proyecto | `nvm install 22.7.0` (o `nvm use` dentro del repo) |
| **Yarn** | Instalar dependencias | `npm install -g yarn` |
| **Git** | Control de versiones | `brew install git` |
| **GitHub CLI** | Clonar, crear PRs | `brew install gh` + `gh auth login` |
| **Claude Code** | Generar wireframes con IA | `npm install -g @anthropic-ai/claude-code` |

> En Mac, si no tienes Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

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

Abre [http://localhost:4200](http://localhost:4200). Deberías ver la pantalla de login de Dropi.

### Verificar que funciona

1. En la pantalla de login, selecciona un rol (Dropshipper, Proveedor, o Admin)
2. El email se llena automáticamente. El password es decorativo (es un prototipo)
3. Click en "Ingresar"
4. Deberías ver el sidebar con la navegación del rol seleccionado

| Rol | Usuario mock | Qué ves |
|---|---|---|
| Dropshipper | Valentina Mejía | 21 items en sidebar |
| Proveedor | Camila Duarte | 20 items en sidebar |
| Admin | Michel Pino | 23 items en sidebar |

## Generar un wireframe con Claude Code

```bash
# 1. Crea tu rama de trabajo
git checkout -b wireframe/DROP-XXXX-nombre-de-tu-vista

# 2. Abre Claude Code
claude

# 3. Pega el prompt template (ver docs/wireframe-prompt-template.md)
```

Claude Code lee automáticamente `CLAUDE.md` y sigue el protocolo del pipeline: consulta Figma, lee el DS Registry, descarga assets, genera el componente Angular, y actualiza el navigation map.

Para la plantilla completa del prompt, ver [`docs/wireframe-prompt-template.md`](docs/wireframe-prompt-template.md).

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
| Wireframe | `wireframe/DROP-XXXX-name` | `wireframe/DROP-1234-bulk-actions` |
| DS Registry | `registry/name` | `registry/add-dropi-table` |
| Mock data | `mocks/name` | `mocks/add-wallet-data` |
| Infra | `infra/name` | `infra/fix-routing` |

## Roles

| Role | Responsibility |
|---|---|
| **Product Designer** | Generates wireframes with Claude Code |
| **UX Engineer** | Reviews PRs, maintains DS Registry, merges |
| **FE Champion** | Evaluates technical feasibility |

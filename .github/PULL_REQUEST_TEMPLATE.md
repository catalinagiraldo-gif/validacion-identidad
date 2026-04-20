## Wireframe: [DROP-XXXX] — [Feature Name]

### Contexto
- **Ticket Jira**: [link]
- **Modulo**: [orders / catalog / wallet / dashboard / checkout]
- **OKR**: [O1-KR2 / O2-KR1 / etc.]
- **Problema que resuelve**: [1-2 lineas]

### Atomic Design
- **Atomos usados** (ui/): dropi-button, dropi-card, dropi-input...
- **Moleculas creadas** (components/molecules/): [listar si aplica]
- **Organismos creados** (components/organisms/): [listar si aplica]
- **Template usado** (components/templates/): [listar si aplica]
- **Page creada** (pages/): [ruta]

### Checklist UX Engineer
- [ ] Solo standalone components
- [ ] Atomos usan prefijo `dropi-`
- [ ] Props matchean Storybook ([ui.dropi.co](https://ui.dropi.co))
- [ ] Tokens SCSS correctos (no valores hardcodeados)
- [ ] ui/ solo tiene estructura y estilos, sin logica de negocio
- [ ] pages/ solo renderiza templates/componentes, sin logica
- [ ] Mock data representativa del caso real
- [ ] Prettier aplicado

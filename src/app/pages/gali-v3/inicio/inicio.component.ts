import { Component } from '@angular/core';
import { WelcomeArtifactComponent } from '../../../components/gali-v3/artifacts/welcome-artifact.component';

@Component({
  selector: 'app-gali-v3-inicio',
  standalone: true,
  imports: [WelcomeArtifactComponent],
  template: `<welcome-artifact></welcome-artifact>`,
})
export class GaliV3InicioComponent {}

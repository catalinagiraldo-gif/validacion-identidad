import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
} from '../../components/shared';

@Component({
  selector: 'app-configuraciones-marketing-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
  ],
  templateUrl: './configuraciones-marketing-page.component.html',
  styleUrl: './configuraciones-marketing-page.component.scss',
})
export class ConfiguracionesMarketingPageComponent {
  readonly breadcrumbs = ['Marketing', 'SMS y Correo', 'Configuraciones'];
  requireAuth = false;

  form = {
    servidor: '',
    port: '',
    security: '',
    formName: '',
    formEmail: '',
    usuario: '',
    contrasena: '',
  };
}

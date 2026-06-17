import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './report-dashboard-page.component.html',
  styleUrl: './report-dashboard-page.component.scss',
})
export class ReportDashboardPageComponent {
  searchQuery = '';
  readonly breadcrumbs = ['Reportes', 'Dashboard'];

  readonly rows = Array.from({ length: 8 }, (_, i) => ({
    id: String(160604 + i),
    fecha: '27/05/2026',
    cliente: ['Olga Camacho', 'Carlos Mendoza', 'María López'][i % 3],
    producto: ['Collar GPS', 'Audífonos', 'Faja'][i % 3],
    ciudad: ['Bogotá', 'Medellín', 'Cali'][i % 3],
    transportadora: ['ENVIA', 'COORDINADORA'][i % 2],
    estado: ['ENTREGADO', 'EN TRÁNSITO', 'NOVEDAD'][i % 3],
    monto: ['$ 45.900', '$ 62.500', '$ 28.990'][i % 3],
  }));
}

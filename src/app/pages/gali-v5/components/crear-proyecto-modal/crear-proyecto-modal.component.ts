import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'crear-proyecto-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crear-proyecto-modal.component.html',
  styleUrl: './crear-proyecto-modal.component.scss',
})
export class CrearProyectoModalComponent {
  private router = inject(Router);
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<string>();

  readonly step = signal<1 | 2 | 3>(1);
  readonly productQuery = signal('');
  readonly projectName = signal('');
  readonly selectedProduct = signal<{ id: string; name: string; stock: number; proveedor: string; score: number } | null>(null);

  readonly suggestedProducts = [
    { id: 'collar', name: 'Collar GPS para mascotas', stock: 847, proveedor: 'PetStore Colombia', score: 87 },
    { id: 'difusor', name: 'Difusor Aromaterapia Premium', stock: 312, proveedor: 'HomeStore', score: 74 },
    { id: 'reloj', name: 'Reloj Smartwatch Pro X7', stock: 156, proveedor: 'TechDropper', score: 61 },
  ];

  close(): void {
    this.closed.emit();
  }

  /** Navega a la pantalla completa de nuevo proyecto */
  goToNuevoProyecto(): void {
    this.closed.emit();
    this.router.navigate(['/gali-v5/proyectos/nuevo']);
  }

  launchNow(): void {
    this.goToNuevoProyecto();
  }

  saveDraft(): void {
    this.closed.emit();
  }
}

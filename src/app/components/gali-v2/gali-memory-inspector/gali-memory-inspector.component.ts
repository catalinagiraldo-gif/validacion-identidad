import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GaliMarkComponent } from '../gali-mark/gali-mark.component';
import { Aprendizaje } from '../../../services/gali-v2/memoria.service';

@Component({
  selector: 'gali-memory-inspector',
  standalone: true,
  imports: [CommonModule, FormsModule, GaliMarkComponent],
  templateUrl: './gali-memory-inspector.component.html',
  styleUrls: ['./gali-memory-inspector.component.scss'],
})
export class GaliMemoryInspectorComponent {
  @Input() aprendizaje!: Aprendizaje;
  @Output() guardar = new EventEmitter<string>();
  @Output() obsoleto = new EventEmitter<void>();
  @Output() borrar = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  editando = false;
  borrador = '';

  iniciarEdicion() {
    this.borrador = this.aprendizaje.texto;
    this.editando = true;
  }

  confirmarEdicion() {
    if (this.borrador.trim()) {
      this.guardar.emit(this.borrador.trim());
    }
    this.editando = false;
  }

  cancelarEdicion() {
    this.editando = false;
  }
}

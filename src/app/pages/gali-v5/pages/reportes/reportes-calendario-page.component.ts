import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
} from '../../components/shared';

interface CalendarEvent {
  orders: number;
  sold: string;
  profit: string;
  estimated: string;
  more?: number;
}

interface CalendarCell {
  key: string;
  day?: number;
  muted?: boolean;
  event?: CalendarEvent;
}

@Component({
  selector: 'app-reportes-calendario-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiTitulosComponent, DropiButtonNewComponent],
  templateUrl: './reportes-calendario-page.component.html',
  styleUrl: './reportes-calendario-page.component.scss',
})
export class ReportesCalendarioPageComponent {
  readonly breadcrumbs = ['Reportes', 'Calendario'];
  monthLabel = signal('Enero 2026');
  readonly weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  readonly days: CalendarCell[] = this.buildJanuary2026();

  private buildJanuary2026(): CalendarCell[] {
    const cells: CalendarCell[] = [];
    // Enero 2026 starts on Thursday — pad 3 empty cells (Mon-Wed)
    for (let i = 0; i < 3; i++) {
      cells.push({ key: `pad-${i}`, muted: true });
    }
    for (let day = 1; day <= 31; day++) {
      const event = day === 15 || day === 16
        ? {
            orders: 1,
            sold: '$60.000',
            profit: '$3.000',
            estimated: '$3.000',
            more: 19,
          }
        : day === 8 || day === 22
          ? {
              orders: 2,
              sold: '$120.000',
              profit: '$8.500',
              estimated: '$9.200',
            }
          : undefined;
      cells.push({ key: `day-${day}`, day, event });
    }
    // Pad end to complete grid
    while (cells.length % 7 !== 0) {
      cells.push({ key: `end-${cells.length}`, muted: true });
    }
    return cells;
  }
}

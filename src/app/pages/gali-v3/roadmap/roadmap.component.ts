import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import roadmapData from '../../../../../mocks/gali-v3/roadmap-post-v4.json';

@Component({
  selector: 'app-gali-v3-roadmap',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss'],
})
export class GaliV3RoadmapComponent {
  data = roadmapData;
}

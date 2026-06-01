import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  tagLabel: string;
  tagColor: string;
  modules: string;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
}

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss'],
})
export class AcademyComponent implements OnInit {
  courses: Course[] = [];
  scrollPosition = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Course[]>('/api/academy').subscribe((data) => {
      this.courses = data;
    });
  }

  scrollCourses(direction: 'left' | 'right'): void {
    const container = document.querySelector('.courses-scroll') as HTMLElement;
    if (!container) return;
    const scrollAmount = 259; // card width + gap
    if (direction === 'right') {
      container.scrollLeft += scrollAmount;
    } else {
      container.scrollLeft -= scrollAmount;
    }
  }

  getTagClass(tagColor: string): string {
    switch (tagColor) {
      case 'primary':
        return 'tag-primary';
      case 'secondary':
        return 'tag-secondary';
      case 'info':
        return 'tag-info';
      default:
        return 'tag-primary';
    }
  }
}

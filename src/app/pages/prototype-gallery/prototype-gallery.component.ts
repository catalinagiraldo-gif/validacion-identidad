import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PROTOTYPE_REGISTRY } from '../../config/prototypes.registry';
import { PrototypeMeta } from '../../models/prototype-meta.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-prototype-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="hub">
      <div class="hub__header">
        <div class="hub__title-row">
          <h2>Prototipos</h2>
          <span class="hub__count">{{ filteredPrototypes.length }} prototipos</span>
        </div>
        <div class="hub__search">
          <i class="pi pi-search"></i>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
            placeholder="Buscar por titulo o modulo..."
            class="hub__search-input"
          />
        </div>
      </div>

      <!-- Empty state: no prototypes match search -->
      <div class="hub__empty" *ngIf="filteredPrototypes.length === 0 && searchQuery">
        <i class="pi pi-search"></i>
        <h3>No se encontraron prototipos para '{{ searchQuery }}'</h3>
        <button class="hub__clear-btn" (click)="clearSearch()">Limpiar busqueda</button>
      </div>

      <!-- Empty state: no prototypes for profile (no search active) -->
      <div class="hub__empty" *ngIf="filteredPrototypes.length === 0 && !searchQuery">
        <i class="pi pi-inbox"></i>
        <h3>No hay prototipos para este perfil</h3>
      </div>

      <!-- Card grid -->
      <div class="hub__grid" *ngIf="filteredPrototypes.length > 0">
        <a
          *ngFor="let proto of filteredPrototypes; let i = index"
          [routerLink]="'/' + currentArch + proto.route"
          class="hub__card"
          [title]="proto.description"
          [style.animation-delay]="(i * 60) + 'ms'"
        >
          <!-- Thumbnail -->
          <div class="hub__card-thumbnail">
            <img
              [src]="getThumbnailPath(proto)"
              [alt]="proto.title"
              (load)="onThumbnailLoad(proto.slug)"
              (error)="onThumbnailError($event, proto)"
              loading="lazy"
            />
            <div class="hub__card-placeholder" *ngIf="!isThumbnailLoaded(proto.slug)">
              <i class="pi pi-image"></i>
            </div>
            <span class="hub__badge-nuevo" *ngIf="isNew(proto)">Nuevo</span>
          </div>

          <!-- Card body -->
          <div class="hub__card-body">
            <h3 class="hub__card-title">{{ proto.title }}</h3>
            <div class="hub__card-meta">
              <span class="hub__card-module">{{ proto.module }}</span>
              <span class="hub__card-separator">|</span>
              <span class="hub__card-owner">{{ getOwnerName(proto.owner) }}</span>
            </div>
            <div class="hub__card-date">{{ proto.dateAdded }}</div>
          </div>
        </a>
      </div>
    </div>
  `,
  styleUrl: './prototype-gallery.component.scss',
})
export class PrototypeGalleryComponent implements OnInit, OnDestroy {
  allPrototypes: PrototypeMeta[] = [];
  filteredPrototypes: PrototypeMeta[] = [];
  searchQuery = '';
  currentProfile: string | null = null;
  currentArch: 'old' | 'new' = 'old';
  private loadedThumbnails = new Set<string>();
  private subscription!: Subscription;

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.currentArch = (localStorage.getItem('dropi.selectedArch') as 'old' | 'new') || 'old';
    this.allPrototypes = PROTOTYPE_REGISTRY.filter(p => p.architecture === this.currentArch);
    this.subscription = this.profileService.currentProfile$.subscribe(
      (profile) => {
        this.currentProfile = profile;
        this.filterPrototypes();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  filterPrototypes(): void {
    let result = this.allPrototypes;

    // Filter by profile
    if (this.currentProfile) {
      result = result.filter((proto) =>
        proto.profiles.includes(this.currentProfile!)
      );
    }

    // Filter by search query (title or module, per D-18)
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(
        (proto) =>
          proto.title.toLowerCase().includes(query) ||
          proto.module.toLowerCase().includes(query)
      );
    }

    // Sort by dateAdded descending (newest first, per HUB-03)
    result = result.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));

    this.filteredPrototypes = result;
  }

  onSearchChange(): void {
    this.filterPrototypes();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterPrototypes();
  }

  isNew(proto: PrototypeMeta): boolean {
    const added = new Date(proto.dateAdded);
    const now = new Date();
    const diffDays =
      (now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }

  getOwnerName(email: string): string {
    const local = email.split('@')[0];
    return local
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  getThumbnailPath(proto: PrototypeMeta): string {
    return `assets/thumbnails/${proto.slug}.png`;
  }

  onThumbnailLoad(slug: string): void {
    this.loadedThumbnails.add(slug);
  }

  onThumbnailError(event: Event, proto: PrototypeMeta): void {
    // Hide the broken image so the placeholder shows
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  isThumbnailLoaded(slug: string): boolean {
    return this.loadedThumbnails.has(slug);
  }
}

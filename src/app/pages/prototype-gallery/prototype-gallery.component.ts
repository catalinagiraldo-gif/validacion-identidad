import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PROTOTYPE_REGISTRY } from '../../config/prototypes.registry';
import { PrototypeMeta } from '../../models/prototype-meta.model';
import { ProfileService } from '../../services/profile.service';

interface FolderGroup {
  folder: string;
  label: string;
  count: number;
  icon: string;
  description: string;
}

const FOLDER_META: Record<string, { label: string; icon: string; description: string }> = {
  gali: {
    label: 'Gali ✦',
    icon: '✦',
    description: 'Plataforma AI de Dropi — V2, V3 y V5',
  },
};

@Component({
  selector: 'app-prototype-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="hub">
      <div class="hub__header">
        <div class="hub__title-row">
          <button *ngIf="activeFolder" class="hub__back-btn" (click)="closeFolder()">
            <i class="pi pi-arrow-left"></i>
          </button>
          <h2>{{ activeFolder ? getFolderLabel(activeFolder) : 'Prototipos' }}</h2>
          <span class="hub__count">
            {{ activeFolder ? folderPrototypes.length + ' versiones' : totalCount + ' prototipos' }}
          </span>
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

      <!-- Breadcrumb dentro de carpeta -->
      <div class="hub__breadcrumb" *ngIf="activeFolder && !searchQuery">
        <span class="hub__breadcrumb-root" (click)="closeFolder()">Prototipos</span>
        <span class="hub__breadcrumb-sep">/</span>
        <span class="hub__breadcrumb-current">{{ getFolderLabel(activeFolder) }}</span>
      </div>

      <!-- Empty state: no prototypes match search -->
      <div class="hub__empty" *ngIf="isEmpty && searchQuery">
        <i class="pi pi-search"></i>
        <h3>No se encontraron prototipos para '{{ searchQuery }}'</h3>
        <button class="hub__clear-btn" (click)="clearSearch()">Limpiar busqueda</button>
      </div>

      <!-- Empty state: no prototypes for profile -->
      <div class="hub__empty" *ngIf="isEmpty && !searchQuery">
        <i class="pi pi-inbox"></i>
        <h3>No hay prototipos para este perfil</h3>
      </div>

      <!-- ── Vista DENTRO de carpeta ── -->
      <ng-container *ngIf="activeFolder">
        <div class="hub__grid">
          <a
            *ngFor="let proto of folderPrototypes; let i = index"
            [routerLink]="getRoute(proto)"
            class="hub__card"
            [title]="proto.description"
            [style.animation-delay]="(i * 60) + 'ms'"
          >
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
            <div class="hub__card-body">
              <h3 class="hub__card-title">{{ proto.title }}</h3>
              <p class="hub__card-desc">{{ proto.description }}</p>
              <div class="hub__card-date">{{ proto.dateAdded }}</div>
            </div>
          </a>
        </div>
      </ng-container>

      <!-- ── Vista principal (sin carpeta activa) ── -->
      <ng-container *ngIf="!activeFolder">

        <!-- Búsqueda activa: mostrar todos los resultados -->
        <div class="hub__grid" *ngIf="searchQuery && filteredPrototypes.length > 0">
          <ng-container *ngFor="let proto of filteredPrototypes; let i = index">
            <!-- Folder card en resultados de búsqueda -->
            <div
              *ngIf="proto.folder && !proto.absoluteRoute; else regularSearchCard"
              class="hub__card hub__card--folder"
              (click)="openFolder(proto.folder!)"
              [style.animation-delay]="(i * 60) + 'ms'"
            >
              <div class="hub__card-thumbnail hub__card-thumbnail--folder">
                <span class="hub__folder-glyph">{{ FOLDER_META[proto.folder!]?.icon ?? '📁' }}</span>
              </div>
              <div class="hub__card-body">
                <h3 class="hub__card-title">{{ getFolderLabel(proto.folder!) }}</h3>
                <div class="hub__card-meta">
                  <span class="hub__card-module hub__card-module--folder">{{ proto.folder }}</span>
                </div>
              </div>
            </div>
            <ng-template #regularSearchCard>
              <a
                [routerLink]="getRoute(proto)"
                class="hub__card"
                [title]="proto.description"
                [style.animation-delay]="(i * 60) + 'ms'"
              >
                <div class="hub__card-thumbnail">
                  <img [src]="getThumbnailPath(proto)" [alt]="proto.title"
                    (load)="onThumbnailLoad(proto.slug)" (error)="onThumbnailError($event, proto)" loading="lazy" />
                  <div class="hub__card-placeholder" *ngIf="!isThumbnailLoaded(proto.slug)">
                    <i class="pi pi-image"></i>
                  </div>
                  <span class="hub__badge-nuevo" *ngIf="isNew(proto)">Nuevo</span>
                </div>
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
            </ng-template>
          </ng-container>
        </div>

        <!-- Sin búsqueda: carpetas + prototipos separados -->
        <ng-container *ngIf="!searchQuery">

          <!-- Carpetas como tarjetas del mismo tamaño -->
          <div class="hub__grid" *ngIf="folderGroups.length > 0">
            <div
              *ngFor="let fg of folderGroups; let i = index"
              class="hub__card hub__card--folder"
              (click)="openFolder(fg.folder)"
              [style.animation-delay]="(i * 60) + 'ms'"
            >
              <div class="hub__card-thumbnail hub__card-thumbnail--folder">
                <span class="hub__folder-glyph">{{ fg.icon }}</span>
                <span class="hub__folder-count">{{ fg.count }} versiones</span>
              </div>
              <div class="hub__card-body">
                <h3 class="hub__card-title">{{ fg.label }}</h3>
                <div class="hub__card-meta">
                  <span class="hub__card-module hub__card-module--folder">espacio de diseño</span>
                </div>
                <p class="hub__card-desc">{{ fg.description }}</p>
              </div>
            </div>
          </div>

          <!-- Separador si hay ambos -->
          <div class="hub__section-sep" *ngIf="folderGroups.length > 0 && nonFolderPrototypes.length > 0">
            <span>Prototipos</span>
          </div>

          <!-- Prototipos individuales -->
          <div class="hub__grid" *ngIf="nonFolderPrototypes.length > 0">
            <a
              *ngFor="let proto of nonFolderPrototypes; let i = index"
              [routerLink]="'/' + currentArch + proto.route"
              class="hub__card"
              [title]="proto.description"
              [style.animation-delay]="(i * 60) + 'ms'"
            >
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
        </ng-container>

      </ng-container>
    </div>
  `,
  styleUrl: './prototype-gallery.component.scss',
})
export class PrototypeGalleryComponent implements OnInit, OnDestroy {
  readonly FOLDER_META = FOLDER_META;

  allPrototypes: PrototypeMeta[] = [];
  filteredPrototypes: PrototypeMeta[] = [];
  nonFolderPrototypes: PrototypeMeta[] = [];
  folderPrototypes: PrototypeMeta[] = [];
  folderGroups: FolderGroup[] = [];

  searchQuery = '';
  currentProfile: string | null = null;
  currentArch: 'old' | 'new' = 'old';
  activeFolder: string | null = null;

  private loadedThumbnails = new Set<string>();
  private subscription!: Subscription;

  private folderQuerySub?: Subscription;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentArch = (localStorage.getItem('dropi.selectedArch') as 'old' | 'new') || 'old';
    this.allPrototypes = PROTOTYPE_REGISTRY.filter(p => p.architecture === this.currentArch);
    this.subscription = this.profileService.currentProfile$.subscribe((profile) => {
      this.currentProfile = profile;
      this.filterPrototypes();
    });
    this.folderQuerySub = this.route.queryParamMap.subscribe((params) => {
      const folder = params.get('folder');
      const nextFolder = folder && FOLDER_META[folder] ? folder : null;
      if (this.activeFolder !== nextFolder) {
        this.activeFolder = nextFolder;
        this.filterPrototypes();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.folderQuerySub?.unsubscribe();
  }

  get totalCount(): number {
    return this.nonFolderPrototypes.length + this.folderGroups.length;
  }

  get isEmpty(): boolean {
    if (this.activeFolder) return this.folderPrototypes.length === 0;
    if (this.searchQuery) return this.filteredPrototypes.length === 0;
    return this.nonFolderPrototypes.length === 0 && this.folderGroups.length === 0;
  }

  filterPrototypes(): void {
    let all = this.allPrototypes;

    if (this.currentProfile) {
      all = all.filter(p => p.profiles.includes(this.currentProfile!));
    }

    all = all.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      this.filteredPrototypes = all.filter(
        p => p.title.toLowerCase().includes(q) || p.module.toLowerCase().includes(q)
      );
      this.nonFolderPrototypes = [];
      this.folderGroups = [];
      this.folderPrototypes = [];
      return;
    }

    this.nonFolderPrototypes = all.filter(p => !p.folder);

    const byFolder = new Map<string, PrototypeMeta[]>();
    for (const p of all.filter(prot => !!prot.folder)) {
      const key = p.folder!;
      if (!byFolder.has(key)) byFolder.set(key, []);
      byFolder.get(key)!.push(p);
    }

    this.folderGroups = Array.from(byFolder.entries()).map(([folder, items]) => ({
      folder,
      label: FOLDER_META[folder]?.label ?? folder,
      icon: FOLDER_META[folder]?.icon ?? '📁',
      description: FOLDER_META[folder]?.description ?? '',
      count: items.length,
    }));

    this.folderPrototypes = this.activeFolder
      ? all.filter(p => p.folder === this.activeFolder)
      : [];

    this.filteredPrototypes = [];
  }

  openFolder(folder: string): void {
    this.activeFolder = folder;
    this.filterPrototypes();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { folder },
      queryParamsHandling: 'merge',
    });
  }

  closeFolder(): void {
    this.activeFolder = null;
    this.filterPrototypes();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { folder: null },
      queryParamsHandling: 'merge',
    });
  }

  getFolderLabel(folder: string): string {
    return FOLDER_META[folder]?.label ?? folder;
  }

  getRoute(proto: PrototypeMeta): string {
    return proto.absoluteRoute ?? ('/' + this.currentArch + proto.route);
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
    const diffDays = (now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24);
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

  onThumbnailError(event: Event, _proto: PrototypeMeta): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  isThumbnailLoaded(slug: string): boolean {
    return this.loadedThumbnails.has(slug);
  }
}

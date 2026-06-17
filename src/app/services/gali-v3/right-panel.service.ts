import { Injectable, computed, signal } from '@angular/core';

export type RightPanelTab = 'chat' | 'bloques';

interface RightPanelState {
  open: boolean;
  tab: RightPanelTab;
  businessExpanded: boolean;
}

const STORAGE_KEY = 'gali_v3_rpanel';

const DEFAULT: RightPanelState = {
  open: true,
  tab: 'chat',
  businessExpanded: false,
};

@Injectable({ providedIn: 'root' })
export class GaliRightPanelService {
  private state = signal<RightPanelState>(this.load());

  readonly open = computed(() => this.state().open);
  readonly tab = computed(() => this.state().tab);
  readonly businessExpanded = computed(() => this.state().businessExpanded);

  toggle() {
    this.state.update(s => ({ ...s, open: !s.open }));
    this.persist();
  }

  setOpen(open: boolean) {
    if (this.state().open === open) return;
    this.state.update(s => ({ ...s, open }));
    this.persist();
  }

  setTab(tab: RightPanelTab) {
    this.state.update(s => ({ ...s, tab, open: true }));
    this.persist();
  }

  toggleBusiness() {
    this.state.update(s => ({ ...s, businessExpanded: !s.businessExpanded }));
    this.persist();
  }

  private load(): RightPanelState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT };
      const parsed = JSON.parse(raw) as Partial<RightPanelState>;
      return { ...DEFAULT, ...parsed };
    } catch {
      return { ...DEFAULT };
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
    } catch {
      // no-op
    }
  }
}

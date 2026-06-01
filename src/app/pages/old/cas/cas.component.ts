import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Conversation {
  id: string;
  type: string;
  badgeLabel: string | null;
  timestamp: string;
  avatarUrl: string;
  name: string;
  preview: string;
  tags: string[];
  unreadCount: number;
  status: string;
  selected: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  content: string;
  type: 'text' | 'info' | 'images';
  images?: string[];
}

@Component({
  selector: 'app-cas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cas.component.html',
  styleUrls: ['./cas.component.scss'],
})
export class CasComponent implements OnInit {
  conversations: Conversation[] = [];
  activeTab: 'enviadas' | 'activas' | 'resueltas' = 'activas';
  searchQuery = '';
  showUnreadOnly = false;
  messageText = '';

  selectedConversation: Conversation | null = null;

  chatMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'system',
      senderAvatar: '',
      timestamp: '',
      content: 'Inicio de conversación #78980 01/18/2025 11:11AM',
      type: 'info',
    },
    {
      id: 'msg-2',
      sender: 'Carolina Herrera',
      senderAvatar: 'assets/images/cas/perfiles.svg',
      timestamp: '09:26 AM',
      content: '',
      type: 'text',
    },
  ];

  // Chat header info
  chatHeader = {
    name: 'Laacourier',
    tags: [
      { label: 'Dropshipper', color: 'gray' },
      { label: 'Cancelar guía', color: 'gray' },
      { label: 'Chat', color: 'gray' },
      { label: 'Activa', color: 'orange' },
    ],
    ordenId: '8652267',
    estado: 'Guía generada',
    guia: '344556778',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Conversation[]>('/api/cas').subscribe((data) => {
      this.conversations = data;
      this.selectedConversation = data.find((c) => c.selected) || data[0] || null;
    });
  }

  get filteredConversations(): Conversation[] {
    let filtered = this.conversations.filter((c) => c.status === this.activeTab);

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.preview.toLowerCase().includes(q) ||
          (c.badgeLabel && c.badgeLabel.toLowerCase().includes(q))
      );
    }

    if (this.showUnreadOnly) {
      filtered = filtered.filter((c) => c.unreadCount > 0);
    }

    return filtered;
  }

  get activeCount(): number {
    return this.conversations.filter((c) => c.status === 'activa').length;
  }

  selectConversation(conv: Conversation): void {
    this.conversations.forEach((c) => (c.selected = false));
    conv.selected = true;
    this.selectedConversation = conv;
  }

  setTab(tab: 'enviadas' | 'activas' | 'resueltas'): void {
    this.activeTab = tab;
  }

  sendMessage(): void {
    if (!this.messageText.trim()) return;
    this.messageText = '';
  }
}

import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"

interface ChatSession {
  id: string
  title: string
  date: Date
  preview: string
}

@Component({
  selector: "app-chat-history",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full bg-gray-800 text-white">
      <div class="p-4 border-b border-gray-700">
        <button 
          (click)="createNewChat()"
          class="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Chat
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div class="p-2">
          <h3 class="text-sm font-medium text-gray-400 mb-2 px-2">Recent Chats</h3>
          <div class="space-y-1">
            <div 
              *ngFor="let chat of chatSessions"
              (click)="selectChat(chat.id)"
              class="p-2 rounded cursor-pointer transition-colors duration-200"
              [ngClass]="{'bg-gray-700': chat.id === selectedChatId, 'hover:bg-gray-700': chat.id !== selectedChatId}"
            >
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ chat.title }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ chat.preview }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(chat.date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-4 border-t border-gray-700">
        <div class="flex items-center text-sm text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          <span>AI Dev Environment v1.0</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
  `,
  ],
})
export class ChatHistoryComponent {
  @Input() selectedChatId = ""
  @Output() newChat = new EventEmitter<void>()
  @Output() chatSelected = new EventEmitter<string>()

  // Sample chat sessions (would come from a service in a real app)
  chatSessions: ChatSession[] = [
    {
      id: "1",
      title: "Angular Component Help",
      date: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      preview: "How do I create a reusable component?",
    },
    {
      id: "2",
      title: "TypeScript Types",
      date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      preview: "Can you explain generics in TypeScript?",
    },
    {
      id: "3",
      title: "RxJS Observables",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      preview: "How do I use switchMap operator?",
    },
    {
      id: "4",
      title: "Kafka Integration",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      preview: "Setting up Kafka with Angular",
    },
    {
      id: "5",
      title: "gRPC Services",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      preview: "How to implement gRPC in my app?",
    },
  ]

  createNewChat(): void {
    this.newChat.emit()
  }

  selectChat(chatId: string): void {
    this.chatSelected.emit(chatId)
  }

  formatDate(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }
}


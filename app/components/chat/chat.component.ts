import {
  Component,
  type OnInit,
  ViewChild,
  type ElementRef,
  Input,
  type SimpleChanges,
  type OnChanges,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import type { CommunicationService } from "../../services/communication.service"
import type { AiService } from "../../services/ai.service"
import type { Message } from "../../models/message.model"

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full">
      <!-- Chat Header -->
      <div class="bg-primary text-white p-4 shadow-md">
        <h2 class="text-xl font-semibold">AI Assistant</h2>
      </div>
      
      <!-- Chat Messages -->
      <div #chatContainer class="flex-1 p-4 overflow-y-auto">
        <div *ngFor="let message of messages" 
             class="mb-4" 
             [ngClass]="{'flex justify-end': message.sender === 'user'}">
          <div class="max-w-3/4 p-3 rounded-lg" 
               [ngClass]="message.sender === 'user' ? 
                         'bg-primary text-white rounded-br-none' : 
                         'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'">
            <div class="font-semibold mb-1">
              {{ message.sender === 'user' ? 'You' : 'AI Assistant' }}
            </div>
            <div [innerHTML]="formatMessage(message.content)"></div>
          </div>
        </div>
        <div *ngIf="isLoading" class="flex items-center space-x-2 text-gray-500">
          <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>
      
      <!-- Chat Input -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <input 
            type="text" 
            [(ngModel)]="currentMessage" 
            (keyup.enter)="sendMessage()"
            placeholder="Type a message... (Use @code, @shell, or @chart to interact)"
            class="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            (click)="sendMessage()" 
            class="bg-primary text-white p-3 rounded-r-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      height: 100%;
    }
  `,
  ],
})
export class ChatComponent implements OnInit, OnChanges {
  @ViewChild("chatContainer") private chatContainer!: ElementRef
  @Input() currentChatId = ""

  messages: Message[] = []
  currentMessage = ""
  isLoading = false

  constructor(
    private communicationService: CommunicationService,
    private aiService: AiService,
  ) {}

  ngOnInit(): void {
    // Add welcome message
    this.messages.push({
      id: Date.now().toString(),
      content:
        "Hello! I'm your AI assistant. How can I help you today? You can use @code, @shell, or @chart commands to interact with the development environment.",
      sender: "assistant",
      timestamp: new Date(),
    })

    // Subscribe to incoming messages from other components
    this.communicationService.incomingMessages$.subscribe((message) => {
      this.messages.push(message)
      this.scrollToBottom()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["currentChatId"] && !changes["currentChatId"].firstChange) {
      // If this is a new chat (ID starts with "new-"), clear the messages
      if (this.currentChatId.startsWith("new-")) {
        this.clearChat()
      } else {
        // In a real app, you would load messages for this chat ID from a service
        // For now, we'll just simulate different messages for different chats
        this.simulateLoadChat(this.currentChatId)
      }
    }
  }

  clearChat(): void {
    this.messages = [
      {
        id: Date.now().toString(),
        content:
          "Hello! I'm your AI assistant. How can I help you today? You can use @code, @shell, or @chart commands to interact with the development environment.",
        sender: "assistant",
        timestamp: new Date(),
      },
    ]
    this.scrollToBottom()
  }

  private simulateLoadChat(chatId: string): void {
    // Clear current messages
    this.messages = []

    // Add a welcome message
    this.messages.push({
      id: Date.now().toString(),
      content: "Chat history loaded. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    })

    // Simulate different messages based on chat ID
    if (chatId === "1") {
      this.messages.push({
        id: "prev-1",
        content: "How do I create a reusable component in Angular?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
      })
      this.messages.push({
        id: "prev-2",
        content:
          "To create a reusable component in Angular, you can use the @Component decorator and make it standalone. Here's an example:\n\n```typescript\n@Component({\n  selector: 'app-my-component',\n  standalone: true,\n  imports: [CommonModule],\n  template: `<div>My Component</div>`,\n})\nexport class MyComponent {}\n```\n\nYou can then import and use this component in other components.",
        sender: "assistant",
        timestamp: new Date(Date.now() - 1000 * 60 * 59),
      })
    } else if (chatId === "2") {
      this.messages.push({
        id: "prev-1",
        content: "Can you explain generics in TypeScript?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
      })
      this.messages.push({
        id: "prev-2",
        content:
          'Generics in TypeScript allow you to create reusable components that can work with a variety of types rather than a single one. They help you create type-safe code while maintaining flexibility.\n\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\n// Usage\nlet output = identity<string>("myString");\n```\n\nIn this example, `T` is a type variable that gets replaced with the actual type when the function is called.',
        sender: "assistant",
        timestamp: new Date(Date.now() - 1000 * 60 * 179),
      })
    }

    this.scrollToBottom()
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: this.currentMessage,
      sender: "user",
      timestamp: new Date(),
    }

    this.messages.push(userMessage)
    const messageText = this.currentMessage
    this.currentMessage = ""
    this.scrollToBottom()

    // Check for special commands
    if (messageText.includes("@code") || messageText.includes("@shell") || messageText.includes("@chart")) {
      this.handleCommand(messageText)
    } else {
      // Process with AI
      this.isLoading = true
      this.aiService.sendMessage(messageText).subscribe({
        next: (response) => {
          this.isLoading = false
          this.messages.push({
            id: Date.now().toString(),
            content: response,
            sender: "assistant",
            timestamp: new Date(),
          })
          this.scrollToBottom()
        },
        error: (error) => {
          this.isLoading = false
          this.messages.push({
            id: Date.now().toString(),
            content: "Sorry, there was an error processing your request.",
            sender: "assistant",
            timestamp: new Date(),
          })
          this.scrollToBottom()
          console.error("AI service error:", error)
        },
      })
    }
  }

  handleCommand(message: string): void {
    if (message.includes("@code")) {
      const codeContent = message.replace("@code", "").trim()
      this.communicationService.sendToCodeEditor(codeContent)

      // Add assistant response
      this.messages.push({
        id: Date.now().toString(),
        content: "I've sent your code to the editor.",
        sender: "assistant",
        timestamp: new Date(),
      })
    }

    if (message.includes("@shell")) {
      const shellCommand = message.replace("@shell", "").trim()
      this.communicationService.sendToShell(shellCommand)

      // Add assistant response
      this.messages.push({
        id: Date.now().toString(),
        content: "I've sent your command to the shell.",
        sender: "assistant",
        timestamp: new Date(),
      })
    }

    if (message.includes("@chart")) {
      const chartData = message.replace("@chart", "").trim()
      this.communicationService.sendToVisualization(chartData)

      // Add assistant response
      this.messages.push({
        id: Date.now().toString(),
        content: "I've updated the visualization with your data.",
        sender: "assistant",
        timestamp: new Date(),
      })
    }

    this.scrollToBottom()
  }

  formatMessage(content: string): string {
    // Highlight code blocks
    let formattedContent = content.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-800 text-gray-200 p-2 rounded my-2 overflow-x-auto">$1</pre>',
    )

    // Highlight inline code
    formattedContent = formattedContent.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</code>',
    )

    // Convert URLs to links
    formattedContent = formattedContent.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" class="text-blue-500 hover:underline">$1</a>',
    )

    // Convert line breaks to <br>
    formattedContent = formattedContent.replace(/\n/g, "<br>")

    return formattedContent
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight
      }
    }, 100)
  }
}


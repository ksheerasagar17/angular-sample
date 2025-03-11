import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { ChatComponent } from "./components/chat/chat.component"
import { CodeEditorComponent } from "./components/code-editor/code-editor.component"
import { ShellComponent } from "./components/shell/shell.component"
import { VisualizationComponent } from "./components/visualization/visualization.component"
import { ChatHistoryComponent } from "./components/chat-history/chat-history.component"
import { DataSourceSelectorComponent } from "./components/data-source-selector/data-source-selector.component"

interface DataSource {
  id: string
  name: string
  description: string
  connectionString?: string
  apiEndpoint?: string
  filePath?: string
  icon: string
}

interface Widget {
  id: string
  name: string
  icon: string
  enabled: boolean
  required: boolean
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ChatComponent,
    CodeEditorComponent,
    ShellComponent,
    VisualizationComponent,
    ChatHistoryComponent,
    DataSourceSelectorComponent,
  ],
  template: `
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <!-- Chat History Sidebar -->
      <div class="w-64 h-full border-r border-gray-200 dark:border-gray-700">
        <app-chat-history 
          [selectedChatId]="currentChatId" 
          (newChat)="showDataSourceSelector()" 
          (chatSelected)="selectChat($event)"
        ></app-chat-history>
      </div>
      
      <!-- Chat Interface -->
      <div class="w-1/3 h-full border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <app-chat [currentChatId]="currentChatId"></app-chat>
      </div>
      
      <!-- Development Tools -->
      <div class="flex-1 h-full flex flex-col">
        <!-- Code Editor (top section) -->
        <div class="h-1/2 border-b border-gray-200 dark:border-gray-700">
          <app-code-editor></app-code-editor>
        </div>
        
        <!-- Bottom Section - Shell and Visualization -->
        <div class="h-1/2 flex">
          <!-- Command Shell -->
          <div class="w-1/2 border-r border-gray-200 dark:border-gray-700">
            <app-shell></app-shell>
          </div>
          
          <!-- Visualization Widgets -->
          <div class="w-1/2">
            <app-visualization></app-visualization>
          </div>
        </div>
      </div>
      
      <!-- Data Source Selector Modal -->
      <app-data-source-selector 
        *ngIf="showingDataSourceSelector"
        (confirmed)="createNewChat($event)"
        (cancelled)="cancelDataSourceSelection()"
      ></app-data-source-selector>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  currentChatId = "1" // Default selected chat
  showingDataSourceSelector = false
  activeDataSource: DataSource | null = null
  activeWidgets: Widget[] = []

  showDataSourceSelector(): void {
    this.showingDataSourceSelector = true
  }

  cancelDataSourceSelection(): void {
    this.showingDataSourceSelector = false
  }

  createNewChat(config: { dataSource: DataSource; widgets: Widget[] }): void {
    // In a real app, you would create a new chat session with the selected data source and widgets
    this.activeDataSource = config.dataSource
    this.activeWidgets = config.widgets

    // Generate a new chat ID
    this.currentChatId = "new-" + Date.now().toString()

    // Hide the data source selector
    this.showingDataSourceSelector = false

    // You would also need to clear the chat messages in the ChatComponent
    // This would be done through a service in a real application

    console.log("Created new chat with data source:", config.dataSource.name)
    console.log("Active widgets:", config.widgets.map((w) => w.name).join(", "))
  }

  selectChat(chatId: string): void {
    this.currentChatId = chatId

    // In a real app, you would load the chat messages for this chat ID
    // This would be done through a service
  }
}


import { Component, EventEmitter, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface DataSourceCategory {
  id: string
  name: string
  icon: string
  sources: DataSource[]
  expanded: boolean
}

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
  selector: "app-data-source-selector",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-3/4 max-w-4xl max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Configure New Chat</h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Select a data source and configure widgets for your AI assistant
          </p>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-auto p-4">
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-3">Select Data Source</h3>
            
            <!-- Data Source Categories -->
            <div class="space-y-4">
              <div *ngFor="let category of dataSourceCategories" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <!-- Category Header -->
                <div 
                  (click)="category.expanded = !category.expanded"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 cursor-pointer"
                >
                  <div class="flex items-center">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary bg-opacity-10 text-primary mr-3">
                      <i class="{{category.icon}}"></i>
                    </span>
                    <span class="font-medium text-gray-800 dark:text-white">{{category.name}}</span>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200"
                    [ngClass]="{'transform rotate-180': category.expanded}"
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
                
                <!-- Category Content -->
                <div *ngIf="category.expanded" class="p-3 bg-white dark:bg-gray-800">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div 
                      *ngFor="let source of category.sources" 
                      (click)="selectDataSource(source)"
                      class="border border-gray-200 dark:border-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      [ngClass]="{'ring-2 ring-primary': selectedDataSource?.id === source.id}"
                    >
                      <div class="flex items-start">
                        <span class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 mr-3">
                          <i class="{{source.icon}}"></i>
                        </span>
                        <div>
                          <h4 class="font-medium text-gray-800 dark:text-white">{{source.name}}</h4>
                          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{source.description}}</p>
                          
                          <!-- Connection details based on source type -->
                          <div *ngIf="source.connectionString" class="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                            {{source.connectionString}}
                          </div>
                          <div *ngIf="source.apiEndpoint" class="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                            {{source.apiEndpoint}}
                          </div>
                          <div *ngIf="source.filePath" class="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                            {{source.filePath}}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Widget Selection -->
          <div>
            <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-3">Configure Widgets</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Select which widgets to include in your development environment
            </p>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div 
                *ngFor="let widget of widgets"
                class="border border-gray-200 dark:border-gray-700 rounded-md p-3 text-center"
                [ngClass]="{
                  'bg-primary bg-opacity-10 border-primary': widget.enabled,
                  'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700': !widget.required,
                  'opacity-50': widget.required && widget.id !== 'chat'
                }"
                (click)="toggleWidget(widget)"
              >
                <div class="flex flex-col items-center">
                  <span class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 mb-2">
                    <i class="{{widget.icon}}"></i>
                  </span>
                  <span class="font-medium text-gray-800 dark:text-white">{{widget.name}}</span>
                  <span *ngIf="widget.required" class="text-xs text-gray-500 dark:text-gray-400 mt-1">(Required)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button 
            (click)="cancel()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button 
            (click)="confirm()"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            [disabled]="!selectedDataSource"
            [ngClass]="{'opacity-50 cursor-not-allowed': !selectedDataSource}"
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
    }
  `,
  ],
})
export class DataSourceSelectorComponent {
  @Output() confirmed = new EventEmitter<{ dataSource: DataSource; widgets: Widget[] }>()
  @Output() cancelled = new EventEmitter<void>()

  selectedDataSource: DataSource | null = null

  dataSourceCategories: DataSourceCategory[] = [
    {
      id: "databases",
      name: "Databases",
      icon: "fa-solid fa-database",
      expanded: true,
      sources: [
        {
          id: "postgres",
          name: "PostgreSQL",
          description: "Connect to a PostgreSQL database",
          connectionString: "postgresql://username:password@localhost:5432/dbname",
          icon: "fa-solid fa-database",
        },
        {
          id: "mysql",
          name: "MySQL",
          description: "Connect to a MySQL database",
          connectionString: "mysql://username:password@localhost:3306/dbname",
          icon: "fa-solid fa-database",
        },
        {
          id: "mongodb",
          name: "MongoDB",
          description: "Connect to a MongoDB database",
          connectionString: "mongodb://username:password@localhost:27017/dbname",
          icon: "fa-solid fa-database",
        },
        {
          id: "redis",
          name: "Redis",
          description: "Connect to a Redis database",
          connectionString: "redis://username:password@localhost:6379",
          icon: "fa-solid fa-database",
        },
      ],
    },
    {
      id: "apis",
      name: "APIs",
      icon: "fa-solid fa-cloud",
      expanded: false,
      sources: [
        {
          id: "rest",
          name: "REST API",
          description: "Connect to a REST API endpoint",
          apiEndpoint: "https://api.example.com/v1/data",
          icon: "fa-solid fa-cloud",
        },
        {
          id: "graphql",
          name: "GraphQL",
          description: "Connect to a GraphQL API",
          apiEndpoint: "https://api.example.com/graphql",
          icon: "fa-solid fa-cloud",
        },
        {
          id: "grpc",
          name: "gRPC",
          description: "Connect to a gRPC service",
          apiEndpoint: "grpc://api.example.com:50051",
          icon: "fa-solid fa-cloud",
        },
        {
          id: "websocket",
          name: "WebSocket",
          description: "Connect to a WebSocket endpoint",
          apiEndpoint: "ws://api.example.com/socket",
          icon: "fa-solid fa-cloud",
        },
      ],
    },
    {
      id: "files",
      name: "Files",
      icon: "fa-solid fa-file",
      expanded: false,
      sources: [
        {
          id: "csv",
          name: "CSV File",
          description: "Connect to a CSV file",
          filePath: "/path/to/data.csv",
          icon: "fa-solid fa-file-csv",
        },
        {
          id: "json",
          name: "JSON File",
          description: "Connect to a JSON file",
          filePath: "/path/to/data.json",
          icon: "fa-solid fa-file-code",
        },
        {
          id: "excel",
          name: "Excel File",
          description: "Connect to an Excel file",
          filePath: "/path/to/data.xlsx",
          icon: "fa-solid fa-file-excel",
        },
        {
          id: "parquet",
          name: "Parquet File",
          description: "Connect to a Parquet file",
          filePath: "/path/to/data.parquet",
          icon: "fa-solid fa-file",
        },
      ],
    },
    {
      id: "streaming",
      name: "Streaming",
      icon: "fa-solid fa-stream",
      expanded: false,
      sources: [
        {
          id: "kafka",
          name: "Kafka",
          description: "Connect to a Kafka topic",
          connectionString: "kafka://broker:9092/topic",
          icon: "fa-solid fa-stream",
        },
        {
          id: "rabbitmq",
          name: "RabbitMQ",
          description: "Connect to a RabbitMQ queue",
          connectionString: "amqp://username:password@localhost:5672/vhost",
          icon: "fa-solid fa-stream",
        },
        {
          id: "kinesis",
          name: "AWS Kinesis",
          description: "Connect to an AWS Kinesis stream",
          connectionString: "kinesis://region/stream",
          icon: "fa-brands fa-aws",
        },
      ],
    },
  ]

  widgets: Widget[] = [
    {
      id: "chat",
      name: "Chat",
      icon: "fa-solid fa-comments",
      enabled: true,
      required: true,
    },
    {
      id: "code",
      name: "Code Editor",
      icon: "fa-solid fa-code",
      enabled: true,
      required: false,
    },
    {
      id: "shell",
      name: "Shell",
      icon: "fa-solid fa-terminal",
      enabled: true,
      required: false,
    },
    {
      id: "chart",
      name: "Chart",
      icon: "fa-solid fa-chart-pie",
      enabled: true,
      required: false,
    },
    {
      id: "dashboard",
      name: "Dashboard",
      icon: "fa-solid fa-tachometer-alt",
      enabled: false,
      required: false,
    },
    {
      id: "alerts",
      name: "Alerts",
      icon: "fa-solid fa-bell",
      enabled: false,
      required: false,
    },
    {
      id: "logs",
      name: "Logs",
      icon: "fa-solid fa-list",
      enabled: false,
      required: false,
    },
    {
      id: "query",
      name: "Query Editor",
      icon: "fa-solid fa-search",
      enabled: false,
      required: false,
    },
  ]

  selectDataSource(source: DataSource): void {
    this.selectedDataSource = source
  }

  toggleWidget(widget: Widget): void {
    if (!widget.required) {
      widget.enabled = !widget.enabled
    }
  }

  confirm(): void {
    if (this.selectedDataSource) {
      this.confirmed.emit({
        dataSource: this.selectedDataSource,
        widgets: this.widgets.filter((w) => w.enabled),
      })
    }
  }

  cancel(): void {
    this.cancelled.emit()
  }
}


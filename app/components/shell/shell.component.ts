import { Component, type OnInit, ViewChild, type ElementRef, type AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import type { CommunicationService } from "../../services/communication.service"

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full bg-black text-green-400">
      <div class="bg-gray-800 text-white p-2">
        <span class="font-semibold">Command Shell</span>
      </div>
      <div #terminalOutput class="flex-1 p-2 overflow-y-auto font-mono text-sm whitespace-pre-wrap"></div>
      <div class="p-2 border-t border-gray-700 flex">
        <span class="mr-2">$</span>
        <input 
          type="text" 
          [(ngModel)]="command" 
          (keyup.enter)="executeCommand()"
          class="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
          placeholder="Enter command..."
        />
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
export class ShellComponent implements OnInit, AfterViewInit {
  @ViewChild("terminalOutput") terminalOutput!: ElementRef

  command = ""

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    // Subscribe to shell commands from other components
    this.communicationService.shellCommands$.subscribe((command) => {
      this.appendToTerminal(`$ ${command}\n`)
      this.simulateCommandExecution(command)
    })

    // Subscribe to execution results
    this.communicationService.executionResults$.subscribe((result) => {
      this.appendToTerminal(result + "\n")
    })
  }

  ngAfterViewInit(): void {
    // Add welcome message
    this.appendToTerminal("Welcome to the AI Development Environment Terminal\n")
    this.appendToTerminal('Type "help" for available commands\n\n')
  }

  executeCommand(): void {
    if (!this.command.trim()) return

    this.appendToTerminal(`$ ${this.command}\n`)
    this.simulateCommandExecution(this.command)
    this.command = ""
  }

  private simulateCommandExecution(command: string): void {
    // In a real app, you would send this to your backend for execution
    // For now, we'll simulate some basic commands

    const cmd = command.trim().toLowerCase()

    if (cmd === "help") {
      this.appendToTerminal(`
Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  echo [text]   - Echo text back to the terminal
  date          - Show current date and time
  ls            - List files (simulated)
  python        - Run Python code (simulated)
  kafka         - Interact with Kafka (simulated)
  grpc          - Interact with gRPC services (simulated)
\n`)
    } else if (cmd === "clear") {
      if (this.terminalOutput) {
        this.terminalOutput.nativeElement.innerHTML = ""
      }
    } else if (cmd.startsWith("echo ")) {
      const text = command.substring(5)
      this.appendToTerminal(text + "\n")
    } else if (cmd === "date") {
      this.appendToTerminal(new Date().toString() + "\n")
    } else if (cmd === "ls") {
      this.appendToTerminal(`
app/
├── components/
│   ├── chat/
│   ├── code-editor/
│   ├── shell/
│   └── visualization/
├── services/
│   ├── ai.service.ts
│   └── communication.service.ts
├── models/
│   └── message.model.ts
└── app.component.ts
\n`)
    } else if (cmd.startsWith("python")) {
      this.appendToTerminal("Python 3.9.0 (default, Oct 5 2020, 17:52:02)\n")
      this.appendToTerminal("[GCC 9.3.0] on linux\n")
      this.appendToTerminal('Type "help", "copyright", "credits" or "license" for more information.\n')
      this.appendToTerminal('>>> print("Hello from Python!")\n')
      this.appendToTerminal("Hello from Python!\n")
      this.appendToTerminal(">>>\n")
    } else if (cmd.startsWith("kafka")) {
      this.appendToTerminal("Connecting to Kafka broker...\n")
      setTimeout(() => {
        this.appendToTerminal("Connected to Kafka broker at localhost:9092\n")
        this.appendToTerminal("Available topics: ai-events, code-updates, visualization-data\n")
      }, 1000)
    } else if (cmd.startsWith("grpc")) {
      this.appendToTerminal("Initializing gRPC client...\n")
      setTimeout(() => {
        this.appendToTerminal("Connected to gRPC server at localhost:50051\n")
        this.appendToTerminal("Available services: AIService, CodeService, DataService\n")
      }, 1000)
    } else {
      this.appendToTerminal(`Command not found: ${command}\n`)
    }
  }

  private appendToTerminal(text: string): void {
    if (this.terminalOutput) {
      this.terminalOutput.nativeElement.innerHTML += text
      this.terminalOutput.nativeElement.scrollTop = this.terminalOutput.nativeElement.scrollHeight
    }
  }
}


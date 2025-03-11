import { Component, type OnInit, type AfterViewInit, type ElementRef, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { CommunicationService } from "../../services/communication.service"
import * as monaco from "monaco-editor"

@Component({
  selector: "app-code-editor",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full">
      <div class="bg-gray-800 text-white p-2 flex justify-between items-center">
        <div class="flex items-center">
          <span class="font-semibold">Code Editor</span>
          <select 
            #languageSelect
            (change)="changeLanguage(languageSelect.value)"
            class="ml-4 bg-gray-700 text-white px-2 py-1 rounded text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>
        </div>
        <div>
          <button 
            (click)="runCode()" 
            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Run
          </button>
          <button 
            (click)="saveCode()" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm ml-2"
          >
            Save
          </button>
        </div>
      </div>
      <div #editorContainer class="flex-1"></div>
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
export class CodeEditorComponent implements OnInit, AfterViewInit {
  @ViewChild("editorContainer") editorContainer!: ElementRef
  @ViewChild("languageSelect") languageSelect!: ElementRef

  private editor: monaco.editor.IStandaloneCodeEditor | null = null
  private currentLanguage = "javascript"

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    // Subscribe to messages from the chat component
    this.communicationService.codeEditorCommands$.subscribe((content) => {
      if (this.editor) {
        // Try to detect language from content
        const language = this.detectLanguage(content)
        if (language) {
          this.currentLanguage = language
          if (this.languageSelect) {
            this.languageSelect.nativeElement.value = language
          }
          monaco.editor.setModelLanguage(this.editor.getModel()!, language)
        }

        // Set the content in the editor
        this.editor.setValue(content)
      }
    })
  }

  ngAfterViewInit(): void {
    this.initMonaco()
  }

  private initMonaco(): void {
    if (!this.editorContainer) return

    this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
      value: "// Start coding here",
      language: this.currentLanguage,
      theme: "vs-dark",
      automaticLayout: true,
      minimap: {
        enabled: true,
      },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      wordWrap: "on",
      tabSize: 2,
    })
  }

  changeLanguage(language: string): void {
    if (this.editor) {
      this.currentLanguage = language
      monaco.editor.setModelLanguage(this.editor.getModel()!, language)
    }
  }

  runCode(): void {
    if (!this.editor) return

    const code = this.editor.getValue()

    // Send the code to be executed
    this.communicationService.sendToShell(`Running ${this.currentLanguage} code...`)

    // In a real app, you would send this to your backend for execution
    // For now, we'll just echo it to the shell
    this.communicationService.sendExecutionResult(code)
  }

  saveCode(): void {
    if (!this.editor) return

    const code = this.editor.getValue()

    // In a real app, you would save this to a file or database
    // For now, we'll just show a message
    this.communicationService.sendToChat({
      id: Date.now().toString(),
      content: "Code saved successfully!",
      sender: "system",
      timestamp: new Date(),
    })
  }

  private detectLanguage(content: string): string | null {
    // Simple language detection based on content
    if (content.includes("import tensorflow") || content.includes("def ") || content.includes("print(")) {
      return "python"
    } else if (content.includes("function") || content.includes("const ") || content.includes("let ")) {
      return "javascript"
    } else if (content.includes("interface") || content.includes("class") || content.includes(":")) {
      return "typescript"
    } else if (content.includes("<html") || content.includes("</div>")) {
      return "html"
    } else if (content.includes("{") && content.includes("}") && content.includes(":")) {
      return "json"
    }

    return null
  }
}


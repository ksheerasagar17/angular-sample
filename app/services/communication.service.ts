import { Injectable } from "@angular/core"
import { Subject } from "rxjs"
import type { Message } from "../models/message.model"

@Injectable({
  providedIn: "root",
})
export class CommunicationService {
  // Chat messages
  private incomingMessagesSubject = new Subject<Message>()
  incomingMessages$ = this.incomingMessagesSubject.asObservable()

  // Code editor commands
  private codeEditorCommandsSubject = new Subject<string>()
  codeEditorCommands$ = this.codeEditorCommandsSubject.asObservable()

  // Shell commands
  private shellCommandsSubject = new Subject<string>()
  shellCommands$ = this.shellCommandsSubject.asObservable()

  // Visualization commands
  private visualizationCommandsSubject = new Subject<any>()
  visualizationCommands$ = this.visualizationCommandsSubject.asObservable()

  // Execution results
  private executionResultsSubject = new Subject<string>()
  executionResults$ = this.executionResultsSubject.asObservable()

  constructor() {}

  // Methods to send messages between components

  sendToChat(message: Message): void {
    this.incomingMessagesSubject.next(message)
  }

  sendToCodeEditor(content: string): void {
    this.codeEditorCommandsSubject.next(content)
  }

  sendToShell(command: string): void {
    this.shellCommandsSubject.next(command)
  }

  sendToVisualization(data: any): void {
    this.visualizationCommandsSubject.next(data)
  }

  sendExecutionResult(result: string): void {
    this.executionResultsSubject.next(result)
  }
}


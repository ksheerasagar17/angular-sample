export interface Message {
  id: string
  content: string
  sender: "user" | "assistant" | "system"
  timestamp: Date
}


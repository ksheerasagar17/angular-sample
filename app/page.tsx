"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Message type definition
type Message = {
  id: string
  content: string
  sender: "user" | "assistant" | "system"
}

// Chat session type definition
type ChatSession = {
  id: string
  title: string
  date: Date
  preview: string
}

// Data source types
type DataSource = {
  id: string
  name: string
  description: string
  connectionString?: string
  apiEndpoint?: string
  filePath?: string
  icon: string
}

type DataSourceCategory = {
  id: string
  name: string
  icon: string
  sources: DataSource[]
  expanded: boolean
}

type Widget = {
  id: string
  name: string
  icon: string
  enabled: boolean
  required: boolean
}

export default function AIDevEnvironment() {
  // State for current chat ID
  const [currentChatId, setCurrentChatId] = useState("1")

  // State for data source selector
  const [showDataSourceSelector, setShowDataSourceSelector] = useState(false)
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null)

  // Sample chat sessions
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
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
  ])

  // Data source categories
  const [dataSourceCategories, setDataSourceCategories] = useState<DataSourceCategory[]>([
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
  ])

  // Widgets
  const [widgets, setWidgets] = useState<Widget[]>([
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
  ])

  // State for chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant. You can use @code, @terminal, or @chart commands to interact with the widgets.",
      sender: "assistant",
    },
  ])

  // State for input message
  const [inputMessage, setInputMessage] = useState("")

  // State for code editor
  const [code, setCode] = useState(`// Write your code here
function helloWorld() {
  console.log("Hello, World!");
}

helloWorld();`)

  // State for terminal
  const [terminalOutput, setTerminalOutput] = useState(
    "$ Welcome to the terminal\n$ Type commands directly or use @terminal in chat\n$",
  )

  // State for terminal input
  const [terminalInput, setTerminalInput] = useState("")

  // State for chart data
  const [chartData, setChartData] = useState({
    labels: ["Angular", "React", "Vue", "Svelte", "Ember"],
    values: [35, 30, 20, 10, 5],
  })

  // State for code language
  const [codeLanguage, setCodeLanguage] = useState("javascript")

  // Refs for scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const terminalContainerRef = useRef<HTMLDivElement>(null)

  // Function to toggle data source category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setDataSourceCategories(
      dataSourceCategories.map((category) =>
        category.id === categoryId ? { ...category, expanded: !category.expanded } : category,
      ),
    )
  }

  // Function to select a data source
  const selectDataSource = (source: DataSource) => {
    setSelectedDataSource(source)
  }

  // Function to toggle widget selection
  const toggleWidget = (widgetId: string) => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === widgetId && !widget.required ? { ...widget, enabled: !widget.enabled } : widget,
      ),
    )
  }

  // Function to create a new chat
  const createNewChat = () => {
    if (selectedDataSource) {
      const newChatId = "new-" + Date.now().toString()
      setCurrentChatId(newChatId)

      // Add new chat to sessions
      setChatSessions([
        {
          id: newChatId,
          title: `${selectedDataSource.name} Chat`,
          date: new Date(),
          preview: `Connected to ${selectedDataSource.name}`,
        },
        ...chatSessions,
      ])

      // Clear messages for new chat
      setMessages([
        {
          id: "1",
          content: `Connected to ${selectedDataSource.name}. How can I help you today? You can use @code, @terminal, or @chart commands to interact with the widgets.`,
          sender: "assistant",
        },
      ])

      // Hide data source selector
      setShowDataSourceSelector(false)
      setSelectedDataSource(null)
    }
  }

  // Function to select a chat
  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId)

    // Load messages for selected chat
    if (chatId === "1") {
      setMessages([
        {
          id: "welcome",
          content: "Chat history loaded. How can I help you today?",
          sender: "assistant",
        },
        {
          id: "prev-1",
          content: "How do I create a reusable component in Angular?",
          sender: "user",
        },
        {
          id: "prev-2",
          content:
            "To create a reusable component in Angular, you can use the @Component decorator and make it standalone. Here's an example:\n\n```typescript\n@Component({\n  selector: 'app-my-component',\n  standalone: true,\n  imports: [CommonModule],\n  template: `<div>My Component</div>`,\n})\nexport class MyComponent {}\n```\n\nYou can then import and use this component in other components.",
          sender: "assistant",
        },
      ])
    } else if (chatId === "2") {
      setMessages([
        {
          id: "welcome",
          content: "Chat history loaded. How can I help you today?",
          sender: "assistant",
        },
        {
          id: "prev-1",
          content: "Can you explain generics in TypeScript?",
          sender: "user",
        },
        {
          id: "prev-2",
          content:
            'Generics in TypeScript allow you to create reusable components that can work with a variety of types rather than a single one. They help you create type-safe code while maintaining flexibility.\n\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\n// Usage\nlet output = identity<string>("myString");\n```\n\nIn this example, `T` is a type variable that gets replaced with the actual type when the function is called.',
          sender: "assistant",
        },
      ])
    } else {
      setMessages([
        {
          id: "welcome",
          content: "Chat history loaded. How can I help you today?",
          sender: "assistant",
        },
      ])
    }
  }

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])

    // Process commands
    processCommand(inputMessage)

    // Clear input
    setInputMessage("")
  }

  // Function to process commands
  const processCommand = (message: string) => {
    // Handle @code command
    if (message.includes("@code")) {
      const codeContent = message.replace("@code", "").trim()
      setCode(codeContent)

      // Add system message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Code updated in the editor.",
          sender: "system",
        },
      ])
    }

    // Handle @terminal command
    else if (message.includes("@terminal")) {
      const command = message.replace("@terminal", "").trim()
      executeTerminalCommand(command)
    }

    // Handle @chart command
    else if (message.includes("@chart")) {
      try {
        const chartContent = message.replace("@chart", "").trim()
        // Try to parse JSON data
        const chartJson = JSON.parse(chartContent)

        if (
          chartJson.labels &&
          Array.isArray(chartJson.labels) &&
          chartJson.values &&
          Array.isArray(chartJson.values)
        ) {
          setChartData({
            labels: chartJson.labels,
            values: chartJson.values,
          })

          // Add system message
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content: "Chart updated with new data.",
              sender: "system",
            },
          ])
        } else {
          throw new Error("Invalid chart data format")
        }
      } catch (error) {
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: `Error updating chart: ${error instanceof Error ? error.message : "Invalid format"}. Use format: @chart {"labels": ["A", "B"], "values": [1, 2]}`,
            sender: "system",
          },
        ])
      }
    }

    // Handle regular message
    else {
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: getAIResponse(message),
            sender: "assistant",
          },
        ])
      }, 500)
    }
  }

  // Function to execute terminal command
  const executeTerminalCommand = (command: string) => {
    setTerminalOutput((prev) => `${prev}\n$ ${command}`)

    // Simulate command execution
    setTimeout(() => {
      let output = ""

      if (command === "help") {
        output =
          "\nAvailable commands:\n  help - Show this help message\n  clear - Clear the terminal\n  echo [text] - Echo text\n  date - Show current date and time\n  ls - List files\n  run - Run the code from the editor\n"
      } else if (command === "clear") {
        setTerminalOutput("$ ")
        return
      } else if (command.startsWith("echo ")) {
        output = `\n${command.substring(5)}\n`
      } else if (command === "date") {
        output = `\n${new Date().toString()}\n`
      } else if (command === "ls") {
        output = "\napp/\n├── components/\n├── services/\n├── models/\n└── page.tsx\n"
      } else if (command === "run" || command.startsWith("run ")) {
        output = "\nRunning code...\n"
        output += "Hello, World!\n"
      } else if (command.startsWith("build ")) {
        const target = command.substring(6).trim()
        output = `\nBuilding ${target}...\n`
        output += `Build successful! Compiled with 0 errors and 0 warnings.\n`
      } else {
        output = `\nCommand not found: ${command}\n`
      }

      setTerminalOutput((prev) => `${prev}${output}$`)

      // Add system message if command was from chat
      if (!command.startsWith("__INTERNAL__")) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: `Command executed: ${command}`,
            sender: "system",
          },
        ])
      }
    }, 300)
  }

  // Function to get AI response
  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I help you today?"
    }

    if (lowerMessage.includes("code") || lowerMessage.includes("javascript") || lowerMessage.includes("python")) {
      return `I can help with code. Try sending:

@code function calculateSum(a, b) {
  return a + b;
}

console.log(calculateSum(5, 10));

Or you can directly edit the code in the editor and use the buttons to beautify, build, or run your code.`
    }

    if (lowerMessage.includes("terminal") || lowerMessage.includes("command") || lowerMessage.includes("shell")) {
      return `You can run terminal commands in two ways:

1. Type directly in the terminal input at the bottom of the terminal panel
2. Use @terminal followed by your command in this chat

Try commands like: help, ls, date, echo Hello, run, clear`
    }

    if (lowerMessage.includes("chart") || lowerMessage.includes("graph") || lowerMessage.includes("visualization")) {
      return `I can update the chart with new data. Try:

@chart {"labels": ["Mon", "Tue", "Wed", "Thu", "Fri"], "values": [12, 19, 3, 5, 2]}`
    }

    return `I'm your AI assistant. You can:
- Use @code to update the code editor (or edit directly)
- Use @terminal to run commands (or use the terminal input)
- Use @chart to update the visualization

What would you like to do?`
  }

  // Format date for chat history
  const formatDate = (date: Date): string => {
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

  // Function to format message content with code blocks
  const formatMessage = (content: string): string => {
    // Replace code blocks
    let formatted = content.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-800 text-gray-200 p-2 rounded my-2 overflow-x-auto">$1</pre>',
    )

    // Replace inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</code>')

    // Convert URLs to links
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" class="text-blue-500 hover:underline">$1</a>',
    )

    return formatted
  }

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Auto-scroll terminal to bottom when output changes
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight
    }
  }, [terminalOutput])

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Chat History Sidebar */}
      <div className="w-64 h-full border-r border-gray-200 dark:border-gray-700 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={() => setShowDataSourceSelector(true)}
            className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-400 mb-2 px-2">Recent Chats</h3>
            <div className="space-y-1">
              {chatSessions.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`p-2 rounded cursor-pointer transition-colors duration-200 ${
                    chat.id === currentChatId ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-400 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <p className="text-xs text-gray-400 truncate">{chat.preview}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(chat.date)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center text-sm text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <span>AI Dev Environment v1.0</span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="w-1/3 h-full border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="bg-primary text-white p-4 shadow-md">
          <h2 className="text-xl font-semibold">AI Assistant</h2>
        </div>

        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.sender === "user" ? "flex justify-end" : ""}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : message.sender === "system"
                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                }`}
              >
                <div className="font-semibold mb-1">
                  {message.sender === "user" ? "You" : message.sender === "system" ? "System" : "AI Assistant"}
                </div>
                <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message... (Use @code, @terminal, or @chart to interact)"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-primary text-white p-3 rounded-r-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Development Tools */}
      <div className="flex-1 h-full flex flex-col">
        {/* Code Editor (top section) */}
        <div className="h-1/2 border-b border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-semibold">Code Editor</span>
              <select
                className="ml-4 bg-gray-700 text-white px-2 py-1 rounded text-sm"
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">
                Beautify
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm">Build</button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Run</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">Save</button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-gray-900 p-4 font-mono text-sm text-green-400 resize-none outline-none"
            spellCheck="false"
          />
        </div>

        {/* Bottom Section - Shell and Visualization */}
        <div className="h-1/2 flex">
          {/* Command Shell */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="bg-gray-800 text-white p-2">
              <span className="font-semibold">Terminal</span>
            </div>
            <div
              ref={terminalContainerRef}
              className="flex-1 bg-black p-2 font-mono text-sm text-green-400 overflow-auto whitespace-pre"
            >
              {terminalOutput}
            </div>
            <div className="bg-gray-900 p-2 flex items-center">
              <span className="text-green-400 mr-2">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && executeTerminalCommand(terminalInput)}
                className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
                placeholder="Enter command..."
              />
            </div>
          </div>

          {/* Visualization Widgets */}
          <div className="w-1/2 flex flex-col">
            <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
              <span className="font-semibold">Visualization</span>
              <select className="bg-gray-700 text-white px-2 py-1 rounded text-sm" defaultValue="pie">
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 p-4 flex items-center justify-center">
              <Card className="w-full h-full flex items-center justify-center p-4">
                <div className="w-full h-full">
                  {/* Pie Chart Visualization */}
                  <div className="relative w-64 h-64 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Pie chart segments */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="rgba(255, 99, 132, 0.7)"
                        strokeWidth="1"
                        stroke="#fff"
                        transform="rotate(-90 50 50)"
                        strokeDasharray="251.2 251.2"
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="rgba(54, 162, 235, 0.7)"
                        strokeWidth="1"
                        stroke="#fff"
                        transform="rotate(-90 50 50)"
                        strokeDasharray="251.2 251.2"
                        strokeDashoffset="62.8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="rgba(255, 206, 86, 0.7)"
                        strokeWidth="1"
                        stroke="#fff"
                        transform="rotate(-90 50 50)"
                        strokeDasharray="251.2 251.2"
                        strokeDashoffset="125.6"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="rgba(75, 192, 192, 0.7)"
                        strokeWidth="1"
                        stroke="#fff"
                        transform="rotate(-90 50 50)"
                        strokeDasharray="251.2 251.2"
                        strokeDashoffset="188.4"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="rgba(153, 102, 255, 0.7)"
                        strokeWidth="1"
                        stroke="#fff"
                        transform="rotate(-90 50 50)"
                        strokeDasharray="251.2 251.2"
                        strokeDashoffset="213.52"
                      />
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center mt-4 gap-4">
                    {chartData.labels.map((label, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-4 h-4 mr-2"
                          style={{
                            backgroundColor: [
                              "rgba(255, 99, 132, 0.7)",
                              "rgba(54, 162, 235, 0.7)",
                              "rgba(255, 206, 86, 0.7)",
                              "rgba(75, 192, 192, 0.7)",
                              "rgba(153, 102, 255, 0.7)",
                            ][index % 5],
                          }}
                        ></div>
                        <span className="text-sm">
                          {label}: {chartData.values[index]}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source Selector Modal */}
      {showDataSourceSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-3/4 max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Configure New Chat</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Select a data source and configure widgets for your AI assistant
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Select Data Source</h3>

                {/* Data Source Categories */}
                <div className="space-y-4">
                  {dataSourceCategories.map((category) => (
                    <div
                      key={category.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      {/* Category Header */}
                      <div
                        onClick={() => toggleCategoryExpansion(category.id)}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary bg-opacity-10 text-primary mr-3">
                            <i className={category.icon}></i>
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">{category.name}</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                            category.expanded ? "transform rotate-180" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      {/* Category Content */}
                      {category.expanded && (
                        <div className="p-3 bg-white dark:bg-gray-800">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {category.sources.map((source) => (
                              <div
                                key={source.id}
                                onClick={() => selectDataSource(source)}
                                className={`border border-gray-200 dark:border-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                  selectedDataSource?.id === source.id ? "ring-2 ring-primary" : ""
                                }`}
                              >
                                <div className="flex items-start">
                                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 mr-3">
                                    <i className={source.icon}></i>
                                  </span>
                                  <div>
                                    <h4 className="font-medium text-gray-800 dark:text-white">{source.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                      {source.description}
                                    </p>

                                    {/* Connection details based on source type */}
                                    {source.connectionString && (
                                      <div className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                        {source.connectionString}
                                      </div>
                                    )}
                                    {source.apiEndpoint && (
                                      <div className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                        {source.apiEndpoint}
                                      </div>
                                    )}
                                    {source.filePath && (
                                      <div className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                        {source.filePath}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Configure Widgets</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Select which widgets to include in your development environment
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className={`border border-gray-200 dark:border-gray-700 rounded-md p-3 text-center ${
                        widget.enabled ? "bg-primary bg-opacity-10 border-primary" : ""
                      } ${!widget.required ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} ${
                        widget.required && widget.id !== "chat" ? "opacity-50" : ""
                      }`}
                      onClick={() => !widget.required && toggleWidget(widget.id)}
                    >
                      <div className="flex flex-col items-center">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 mb-2">
                          <i className={widget.icon}></i>
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">{widget.name}</span>
                        {widget.required && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">(Required)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowDataSourceSelector(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={createNewChat}
                className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary ${
                  !selectedDataSource ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!selectedDataSource}
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import { type Observable, of } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class AiService {
  private apiUrl = "http://localhost:5000/api" // Flask API URL

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<string> {
    // In a real application, this would call your Flask backend
    // For now, we'll simulate a response

    if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
      return of("Hello! How can I assist you with your development today?")
    }

    if (message.toLowerCase().includes("python")) {
      return of(`Here's a simple Python function:
      
\`\`\`
def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))
\`\`\`

You can send this to the code editor with @code followed by the code.`)
    }

    if (message.toLowerCase().includes("chart") || message.toLowerCase().includes("graph")) {
      return of(`I can help you create a chart. Try sending this to the visualization:
      
@chart {"labels": ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"], "data": [12, 19, 3, 5, 2, 3], "label": "Sample Colors"}

This will create a bar chart with the specified data.`)
    }

    if (message.toLowerCase().includes("kafka")) {
      return of(`To interact with Kafka, you can use the shell:
      
@shell kafka --list-topics

This will show you the available Kafka topics.`)
    }

    if (message.toLowerCase().includes("grpc")) {
      return of(`For gRPC services, you can use the shell:
      
@shell grpc --list-services

This will show you the available gRPC services.`)
    }

    // Default response for other queries
    return of(`I'm your AI assistant for development tasks. You can:
    
1. Ask me to generate code with @code
2. Run commands in the shell with @shell
3. Create visualizations with @chart

What would you like to work on today?`)

    // In a real app, you would call your Flask API like this:
    /*
    return this.http.post<any>(`${this.apiUrl}/chat`, { message })
      .pipe(
        map(response => response.reply),
        catchError(error => {
          console.error('Error calling AI service:', error);
          return of('Sorry, there was an error processing your request.');
        })
      );
    */
  }
}


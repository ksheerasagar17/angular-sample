import { Component, type OnInit, type ElementRef, ViewChild, type AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { CommunicationService } from "../../services/communication.service"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

@Component({
  selector: "app-visualization",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full">
      <div class="bg-gray-800 text-white p-2 flex justify-between items-center">
        <span class="font-semibold">Visualization</span>
        <div>
          <select 
            #chartType
            (change)="changeChartType(chartType.value)"
            class="bg-gray-700 text-white px-2 py-1 rounded text-sm"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie" selected>Pie Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>
      </div>
      <div class="flex-1 p-4 flex items-center justify-center">
        <canvas #chartCanvas></canvas>
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
export class VisualizationComponent implements OnInit, AfterViewInit {
  @ViewChild("chartCanvas") chartCanvas!: ElementRef<HTMLCanvasElement>
  @ViewChild("chartType") chartTypeSelect!: ElementRef

  private chart: Chart | null = null
  private currentChartType = "pie"
  private chartData = {
    labels: ["Angular", "React", "Vue", "Svelte", "Ember"],
    datasets: [
      {
        label: "Framework Popularity",
        data: [35, 30, 20, 10, 5],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    // Subscribe to visualization commands
    this.communicationService.visualizationCommands$.subscribe((data) => {
      try {
        // Try to parse the data if it's a string
        if (typeof data === "string") {
          const parsedData = JSON.parse(data)
          this.updateChartData(parsedData)
        } else {
          this.updateChartData(data)
        }
      } catch (error) {
        console.error("Error parsing visualization data:", error)
        // If parsing fails, try to extract data using regex
        this.tryExtractDataFromText(data.toString())
      }
    })
  }

  ngAfterViewInit(): void {
    this.initChart()
  }

  private initChart(): void {
    if (!this.chartCanvas) return

    const ctx = this.chartCanvas.nativeElement.getContext("2d")
    if (!ctx) return

    this.chart = new Chart(ctx, {
      type: this.currentChartType as any,
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  changeChartType(type: string): void {
    this.currentChartType = type

    if (this.chart) {
      this.chart.destroy()
      this.initChart()
    }
  }

  private updateChartData(data: any): void {
    // Update chart data based on the received data
    if (data.labels) {
      this.chartData.labels = data.labels
    }

    if (data.datasets) {
      this.chartData.datasets = data.datasets
    } else if (data.data) {
      this.chartData.datasets[0].data = data.data

      if (data.label) {
        this.chartData.datasets[0].label = data.label
      }
    }

    // Update the chart
    if (this.chart) {
      this.chart.data = this.chartData
      this.chart.update()
    }
  }

  private tryExtractDataFromText(text: string): void {
    // Try to extract numeric data from text
    const numbers = text.match(/\d+(\.\d+)?/g)

    if (numbers && numbers.length > 0) {
      const data = numbers.map((num) => Number.parseFloat(num))

      // Create labels based on the number of data points
      const labels = Array.from({ length: data.length }, (_, i) => `Point ${i + 1}`)

      this.updateChartData({
        labels,
        data,
        label: "Extracted Data",
      })
    }
  }
}


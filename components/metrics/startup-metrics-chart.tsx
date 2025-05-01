"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

// Регистрируем необходимые компоненты Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type FinancialMetric = {
  metric_date: string
  revenue?: number | null
  burn_rate?: number | null
  runway_months?: number | null
  active_users?: number | null
  conversion_rate?: number | null
  customer_acquisition_cost?: number | null
  lifetime_value?: number | null
  monthly_recurring_revenue?: number | null
  year_over_year_growth?: number | null
}

type MetricsHistory = {
  metric_type: string
  metric_name: string
  metric_value: number | null
  record_date: string
}

interface FinancialChartProps {
  data: FinancialMetric[]
  metricType: string // "revenue", "active_users", "monthly_recurring_revenue", etc.
  title: string
  color?: string
}

export function FinancialMetricChart({
  data,
  metricType,
  title,
  color = "rgb(75, 192, 192)"
}: FinancialChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Нет данных для отображения</p>
        </CardContent>
      </Card>
    )
  }

  // Сортируем данные по дате
  const sortedData = [...data].sort((a, b) => 
    new Date(a.metric_date).getTime() - new Date(b.metric_date).getTime()
  )

  // Формируем данные для графика
  const chartData = {
    labels: sortedData.map(item => {
      const date = new Date(item.metric_date)
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    }),
    datasets: [
      {
        label: title,
        data: sortedData.map(item => {
          // @ts-ignore - доступ к свойству по строке
          return item[metricType] || 0
        }),
        borderColor: color,
        backgroundColor: `${color}33`, // Добавляем прозрачность
        tension: 0.3,
        fill: true,
      },
    ],
  }

  // Опции графика
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <Line data={chartData} options={options} />
      </CardContent>
    </Card>
  )
}

interface MetricsHistoryChartProps {
  data: MetricsHistory[]
  metricName: string
  title: string
  color?: string
}

export function MetricsHistoryChart({
  data,
  metricName,
  title,
  color = "rgb(153, 102, 255)"
}: MetricsHistoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No data</p>
        </CardContent>
      </Card>
    )
  }

  // Фильтруем по названию метрики
  const filteredData = data.filter(item => item.metric_name === metricName)

  if (filteredData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No data for metric {metricName}</p>
        </CardContent>
      </Card>
    )
  }

  // Сортируем данные по дате
  const sortedData = [...filteredData].sort((a, b) => 
    new Date(a.record_date).getTime() - new Date(b.record_date).getTime()
  )

  // Формируем данные для графика
  const chartData = {
    labels: sortedData.map(item => {
      const date = new Date(item.record_date)
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    }),
    datasets: [
      {
        label: title,
        data: sortedData.map(item => item.metric_value || 0),
        borderColor: color,
        backgroundColor: `${color}33`,
        tension: 0.3,
        fill: true,
      },
    ],
  }

  // Опции графика
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <Line data={chartData} options={options} />
      </CardContent>
    </Card>
  )
}

interface SocialMetricsChartProps {
  platformData: any[]
  metric: string // "followers_count", "engagement_rate", etc.
  title: string
  color?: string
}

export function SocialMetricsChart({
  platformData,
  metric,
  title,
  color = "rgb(54, 162, 235)"
}: SocialMetricsChartProps) {
  if (!platformData || platformData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Нет данных о социальных сетях</p>
        </CardContent>
      </Card>
    )
  }

  // Формируем данные для графика
  const chartData = {
    labels: platformData.map(item => item.platform),
    datasets: [
      {
        label: title,
        data: platformData.map(item => item[metric] || 0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  )
}

export function FounderSocialMetricsChart({
  founderMetrics,
  title = "Social metrics of founders"
}: {
  founderMetrics: any[]
  title?: string
}) {
  if (!founderMetrics || founderMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No data about founders social networks</p>
        </CardContent>
      </Card>
    )
  }

  // Преобразуем данные для отображения по основателям
  const platforms = Array.from(new Set(
    founderMetrics.flatMap(fm => 
      fm.metrics?.map((m: any) => m.platform) || []
    )
  )).sort()

  const founders = founderMetrics.map(fm => fm.founderName)

  const datasets = platforms.map((platform, index) => {
    const colors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
    ]
    
    return {
      label: platform as string,
      data: founderMetrics.map(fm => {
        const metric = fm.metrics?.find((m: any) => m.platform === platform)
        return metric?.followers_count || 0
      }),
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace('0.6', '1'),
      borderWidth: 1,
    }
  })

  const chartData = {
    labels: founders,
    datasets,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of followers'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Founders'
        }
      }
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  )
}

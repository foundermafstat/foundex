"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line } from "react-chartjs-2"
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
} from "chart.js"

// Регистрируем необходимые компоненты Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface SocialMetric {
  id: number
  startup_id: number
  founder_id: number | null
  platform: string
  followers_count: number
  engagement_rate: string
  post_frequency: string
  sentiment_score: string
  collected_at: string
}

interface SocialMetricsTimelineProps {
  metrics: SocialMetric[]
  metric: 'followers_count' | 'engagement_rate' | 'post_frequency' | 'sentiment_score'
  title: string
  colorMap?: {[key: string]: string}
}

export function SocialMetricsTimeline({
  metrics,
  metric,
  title,
  colorMap = {
    'Twitter': 'rgb(29, 161, 242)',
    'LinkedIn': 'rgb(0, 119, 181)',
    'Facebook': 'rgb(66, 103, 178)',
    'Instagram': 'rgb(225, 48, 108)',
    'TikTok': 'rgb(105, 201, 208)',
    'GitHub': 'rgb(51, 51, 51)'
  }
}: SocialMetricsTimelineProps) {
  if (!metrics || metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  // Получаем уникальные платформы
  const platforms = Array.from(new Set(metrics.map(m => m.platform)))
  
  // Получаем все даты и сортируем их
  const dates = Array.from(new Set(metrics.map(m => {
    const date = new Date(m.collected_at)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }))).sort()
  
  // Форматируем даты для отображения
  const formattedDates = dates.map(dateStr => {
    const date = new Date(dateStr)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  })
  
  // Создаем наборы данных для каждой платформы
  const datasets = platforms.map(platform => {
    // Фильтруем метрики для текущей платформы и сортируем по дате
    const platformMetrics = metrics
      .filter(m => m.platform === platform)
      .sort((a, b) => new Date(a.collected_at).getTime() - new Date(b.collected_at).getTime())
    
    // Получаем значения метрик для каждой даты
    const data = dates.map(date => {
      const metricForDate = platformMetrics.find(m => {
        const metricDate = new Date(m.collected_at)
        const formattedMetricDate = `${metricDate.getFullYear()}-${String(metricDate.getMonth() + 1).padStart(2, '0')}-${String(metricDate.getDate()).padStart(2, '0')}`
        return formattedMetricDate === date
      })
      
      if (!metricForDate) return null
      
      if (metric === 'followers_count') {
        return metricForDate.followers_count
      } else {
        return parseFloat(metricForDate[metric] as string)
      }
    })
    
    return {
      label: platform,
      data,
      borderColor: colorMap[platform] || `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
      backgroundColor: (colorMap[platform] || `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`) + '20',
      tension: 0.3,
      fill: false,
    }
  })
  
  const chartData = {
    labels: formattedDates,
    datasets,
  }
  
  // Определяем максимальные значения для оси Y
  let yAxisLabel = ''
  
  switch (metric) {
    case 'followers_count':
      yAxisLabel = 'Followers'
      break
    case 'engagement_rate':
      yAxisLabel = 'Engagement, %'
      break
    case 'post_frequency':
      yAxisLabel = 'Posts per day'
      break
    case 'sentiment_score':
      yAxisLabel = 'Sentiment (0-10)'
      break
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              switch (metric) {
                case 'followers_count':
                  label += new Intl.NumberFormat('en-US').format(context.parsed.y);
                  break;
                case 'engagement_rate':
                  label += context.parsed.y.toFixed(1) + '%';
                  break;
                case 'post_frequency':
                  label += context.parsed.y.toFixed(1) + ' posts/day';
                  break;
                case 'sentiment_score':
                  label += context.parsed.y.toFixed(1) + '/10';
                  break;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisLabel
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date'
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
        <Line data={chartData} options={options} />
      </CardContent>
    </Card>
  )
}

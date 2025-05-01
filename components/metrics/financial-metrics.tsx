"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, TrendingUp, Clock, CreditCard, BarChart, LineChart } from "lucide-react"

type FinancialMetric = {
  id: number
  startup_id: number
  metric_date: string
  revenue: number | null
  burn_rate: number | null
  runway_months: number | null
  active_users: number | null
  conversion_rate: number | null
  customer_acquisition_cost: number | null
  lifetime_value: number | null
  monthly_recurring_revenue: number | null
  year_over_year_growth: number | null
  created_at: string
  updated_at: string
}

type MetricsHistory = {
  id: number
  startup_id: number
  metric_type: string
  metric_name: string
  metric_value: number | null
  record_date: string
  created_at: string
}

interface FinancialMetricsCardProps {
  financialMetrics: FinancialMetric[]
}

export function FinancialMetricsCard({ financialMetrics }: FinancialMetricsCardProps) {
  if (!financialMetrics || financialMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No financial metrics data available</p>
        </CardContent>
      </Card>
    )
  }

  // Получаем самые последние метрики
  const latestMetric = [...financialMetrics].sort(
    (a, b) => new Date(b.metric_date).getTime() - new Date(a.metric_date).getTime()
  )[0]

  // Форматируем дату
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Форматируем валюту
  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '—'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Форматируем процент
  const formatPercent = (value: number | null | undefined) => {
    if (value == null) return '—'
    
    // Убедимся, что value - число, прежде чем вызывать toFixed
    const numValue = typeof value === 'number' ? value : parseFloat(String(value));
    if (isNaN(numValue)) return '—'
    
    return `${numValue.toFixed(2)}%`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Financial Metrics</CardTitle>
        <Badge variant="outline">
          as of {formatDate(latestMetric.metric_date)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latestMetric.revenue != null && (
            <div className="p-4 border rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <span className="text-2xl font-bold">{formatCurrency(latestMetric.revenue)}</span>
            </div>
          )}
          
          {latestMetric.burn_rate != null && (
            <div className="p-4 border rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Burn Rate</span>
              </div>
              <span className="text-2xl font-bold">{formatCurrency(latestMetric.burn_rate)}</span>
            </div>
          )}
          
          {latestMetric.runway_months != null && (
            <div className="p-4 border rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Runway</span>
              </div>
              <span className="text-2xl font-bold">{latestMetric.runway_months} mo.</span>
            </div>
          )}
          
          {latestMetric.active_users != null && (
            <div className="p-4 border rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <span className="text-2xl font-bold">
                {latestMetric.active_users.toLocaleString()}
              </span>
            </div>
          )}
          
          {latestMetric.conversion_rate != null && (
            <div className="p-4 border rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Conversion</span>
              </div>
              <span className="text-2xl font-bold">{formatPercent(latestMetric.conversion_rate)}</span>
            </div>
          )}
          
          {latestMetric.customer_acquisition_cost != null && (
            <div className="p-4 border rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">CAC</span>
              </div>
              <span className="text-2xl font-bold">{formatCurrency(latestMetric.customer_acquisition_cost)}</span>
            </div>
          )}
          
          {latestMetric.lifetime_value != null && (
            <div className="p-4 border rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">LTV</span>
              </div>
              <span className="text-2xl font-bold">{formatCurrency(latestMetric.lifetime_value)}</span>
            </div>
          )}
          
          {latestMetric.monthly_recurring_revenue != null && (
            <div className="p-4 border rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">MRR</span>
              </div>
              <span className="text-2xl font-bold">{formatCurrency(latestMetric.monthly_recurring_revenue)}</span>
            </div>
          )}
          
          {latestMetric.year_over_year_growth != null && (
            <div className="p-4 border rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">YoY Growth</span>
              </div>
              <span className="text-2xl font-bold">{formatPercent(latestMetric.year_over_year_growth)}</span>
            </div>
          )}
        </div>
        
        {financialMetrics.length > 1 && (
          <p className="text-xs text-muted-foreground mt-4">
            Metrics history available for {financialMetrics.length} periods
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface MetricsHistoryCardProps {
  metricsHistory: MetricsHistory[]
}

export function MetricsHistoryCard({ metricsHistory }: MetricsHistoryCardProps) {
  if (!metricsHistory || metricsHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Metrics History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No historical data available</p>
        </CardContent>
      </Card>
    )
  }

  // Группируем метрики по типу
  const metricsByType = metricsHistory.reduce((acc, metric) => {
    if (!acc[metric.metric_type]) {
      acc[metric.metric_type] = []
    }
    acc[metric.metric_type].push(metric)
    return acc
  }, {} as Record<string, MetricsHistory[]>)

  const metricTypes = Object.keys(metricsByType)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metrics History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={metricTypes[0]} className="w-full">
          <TabsList className="w-full justify-start mb-4">
            {metricTypes.map(type => (
              <TabsTrigger key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {metricTypes.map(type => {
            const metrics = metricsByType[type]
            // Получаем уникальные названия метрик
            const metricNames = Array.from(new Set(metrics.map(m => m.metric_name)))
            
            return (
              <TabsContent key={type} value={type} className="space-y-4">
                {metricNames.map(name => {
                  // Фильтруем метрики по имени и сортируем по дате
                  const metricData = metrics
                    .filter(m => m.metric_name === name)
                    .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())
                  
                  // Форматируем название метрики для отображения
                  const formattedName = name
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                  
                  return (
                    <div key={name} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <LineChart className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{formattedName}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {metricData.map((metric, index) => (
                          <div key={index} className="flex justify-between p-2 bg-secondary/50 rounded">
                            <span className="text-sm">
                              {new Date(metric.record_date).toLocaleDateString()}
                            </span>
                            <span className="font-medium">
                              {metric.metric_value != null ? metric.metric_value.toLocaleString() : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}

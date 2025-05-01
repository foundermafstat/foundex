"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, PieChart, ArrowUpCircle, ArrowDownCircle, Banknote, Clock, TrendingUp } from "lucide-react"

interface FinancialMetricsDisplayProps {
  financialMetrics: any[] | null
}

export function FinancialMetricsDisplay({ financialMetrics }: FinancialMetricsDisplayProps) {
  // Get latest metrics if available
  const latestMetrics = financialMetrics && financialMetrics.length > 0 
    ? financialMetrics.sort((a, b) => new Date(b.metric_date).getTime() - new Date(a.metric_date).getTime())[0]
    : null

  // Format currency values
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'No data'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  // Format percentage values
  const formatPercentage = (value: number | null | undefined | any) => {
    if (value === null || value === undefined) return 'No data'
    
    // Проверка и преобразование значения в число
    const numValue = typeof value === 'number' ? value : 
                     !isNaN(parseFloat(value)) ? parseFloat(value) : null
    
    // Если значение не является числом после преобразования
    if (numValue === null) return 'No data'
    
    return `${numValue.toFixed(1)}%`
  }

  // Format user count values
  const formatUserCount = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'No data'
    return new Intl.NumberFormat('en-US').format(value)
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Key Financial Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Users */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-sm">Active Users</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatUserCount(latestMetrics?.active_users)}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Recurring Revenue */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <CardTitle className="text-sm">MRR</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(latestMetrics?.monthly_recurring_revenue)}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <ArrowUpCircle className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-sm">Conversion Rate</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(latestMetrics?.conversion_rate)}
              </div>
            </CardContent>
          </Card>

          {/* Churn Rate */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <ArrowDownCircle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-sm">Customer Churn</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(latestMetrics?.churn_rate)}
              </div>
            </CardContent>
          </Card>

          {/* Customer Acquisition Cost */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Banknote className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-sm">CAC</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(latestMetrics?.customer_acquisition_cost)}
              </div>
            </CardContent>
          </Card>

          {/* Customer Lifetime Value */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-sm">LTV</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(latestMetrics?.lifetime_value)}
              </div>
            </CardContent>
          </Card>

          {/* Runway */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-cyan-500" />
                <CardTitle className="text-sm">Runway</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestMetrics?.runway_months ? `${latestMetrics.runway_months} months` : 'No data'}
              </div>
            </CardContent>
          </Card>

          {/* Year-over-Year Growth */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-sm">YoY Growth</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(latestMetrics?.year_over_year_growth)}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

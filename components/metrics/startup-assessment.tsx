"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react"

type AssessmentResult = {
  id: number
  startup_id: number
  success_score: number
  overall_score?: number
  strengths: string | null
  weaknesses: string | null
  opportunities: string | null
  threats: string | null
  recommendations: string | null
  created_at: string
}

interface StartupAssessmentProps {
  assessment: AssessmentResult | null
  founderMetricsScore?: number
  startupMetricsScore?: number
  financialMetricsScore?: number
}

export function StartupAssessment({ 
  assessment, 
  founderMetricsScore, 
  startupMetricsScore, 
  financialMetricsScore 
}: StartupAssessmentProps) {
  if (!assessment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Startup Potential Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No assessment data available</p>
        </CardContent>
      </Card>
    )
  }

  const { success_score, strengths, weaknesses, opportunities, threats, recommendations } = assessment
  
  // Преобразуем строковое значение success_score в число
  const successScoreNum = typeof success_score === 'string' ? parseFloat(success_score) : success_score
  
  // Используем success_score напрямую без умножения на 10, так как шкала теперь не ограничена
  const score = assessment.overall_score ? 
    (typeof assessment.overall_score === 'string' ? parseFloat(assessment.overall_score) : assessment.overall_score) : 
    successScoreNum
  
  // Убедимся, что score - число
  const numericScore = typeof score === 'number' && !isNaN(score) ? score : 0
  
  // Определяем цвет оценки с учетом неограниченной шкалы
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }
  
  // Определяем категорию оценки с учетом неограниченной шкалы
  const getScoreCategory = (score: number) => {
    if (score >= 80) return "High Potential"
    if (score >= 60) return "Medium Potential"
    return "Low Potential"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Startup Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Final Score</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {typeof score === 'number' && !isNaN(score) ? numericScore.toFixed(1) : 'N/A'}
              </span>
              <Badge 
                variant={numericScore >= 80 ? "default" : numericScore >= 60 ? "outline" : "destructive"}
                className={`text-sm py-1 ${
                  numericScore >= 80 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : 
                  numericScore >= 60 ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100" : ""
                }`}
              >
                {getScoreCategory(numericScore)}
              </Badge>
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <h3 className="text-md font-medium">Score Breakdown</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Founders metrics score card - always show */}
              <div className="border rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Founders</span>
                  <span className={`text-sm font-bold ${typeof founderMetricsScore === 'number' && !isNaN(founderMetricsScore) ? getScoreColor(founderMetricsScore || 0) : ''}`}>
                    {typeof founderMetricsScore === 'number' && !isNaN(founderMetricsScore) ? founderMetricsScore.toFixed(1) : 'N/A'}
                  </span>
                </div>
                {typeof founderMetricsScore === 'number' && !isNaN(founderMetricsScore) ? (
                  <Progress 
                    value={founderMetricsScore > 100 ? 100 : founderMetricsScore} 
                    className="h-2" 
                  />
                ) : (
                  <div className="h-2 bg-gray-100 rounded-full mt-1"></div>
                )}
              </div>
              
              {/* Social metrics score card - always show */}
              <div className="border rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Social Metrics</span>
                  <span className={`text-sm font-bold ${typeof startupMetricsScore === 'number' && !isNaN(startupMetricsScore) ? getScoreColor(startupMetricsScore || 0) : ''}`}>
                    {typeof startupMetricsScore === 'number' && !isNaN(startupMetricsScore) ? startupMetricsScore.toFixed(1) : 'N/A'}
                  </span>
                </div>
                {typeof startupMetricsScore === 'number' && !isNaN(startupMetricsScore) ? (
                  <Progress 
                    value={startupMetricsScore > 100 ? 100 : startupMetricsScore} 
                    className="h-2" 
                  />
                ) : (
                  <div className="h-2 bg-gray-100 rounded-full mt-1"></div>
                )}
              </div>
              
              {/* Financial metrics score card - always show */}
              <div className="border rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Finances</span>
                  <span className={`text-sm font-bold ${typeof financialMetricsScore === 'number' && !isNaN(financialMetricsScore) ? getScoreColor(financialMetricsScore || 0) : ''}`}>
                    {typeof financialMetricsScore === 'number' && !isNaN(financialMetricsScore) ? financialMetricsScore.toFixed(1) : 'N/A'}
                  </span>
                </div>
                {typeof financialMetricsScore === 'number' && !isNaN(financialMetricsScore) ? (
                  <Progress 
                    value={financialMetricsScore > 100 ? 100 : financialMetricsScore} 
                    className="h-2" 
                  />
                ) : (
                  <div className="h-2 bg-gray-100 rounded-full mt-1"></div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strengths && (
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Strengths</AlertTitle>
              <AlertDescription>
                {strengths}
              </AlertDescription>
            </Alert>
          )}
          
          {weaknesses && (
            <Alert>
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertTitle>Weaknesses</AlertTitle>
              <AlertDescription>
                {weaknesses}
              </AlertDescription>
            </Alert>
          )}
          
          {opportunities && (
            <Alert>
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <AlertTitle>Opportunities</AlertTitle>
              <AlertDescription>
                {opportunities}
              </AlertDescription>
            </Alert>
          )}
          
          {threats && (
            <Alert>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Threats</AlertTitle>
              <AlertDescription>
                {threats}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {recommendations && (
          <Alert className="bg-primary/10 border-primary/20">
            <Lightbulb className="h-4 w-4 text-primary" />
            <AlertTitle>Recommendations</AlertTitle>
            <AlertDescription>
              {recommendations}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

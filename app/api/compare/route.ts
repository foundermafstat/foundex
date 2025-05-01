import { NextResponse } from "next/server"
import { 
  getStartupById, 
  getAssessmentByStartupId, 
  getFounderById, 
  getSocialMetricsByStartupId,
  isDatabaseConnected,
  mockStartups
} from "@/lib/db"

// Обновляем тип AssessmentResult для API сравнения
type ExtendedAssessmentResult = {
  id: number
  startup_id: number
  success_score: number
  overall_score: number
  social_score: number
  team_score: number
  market_score: number
  financial_score: number
  innovation_score: number
  strengths: string | null
  weaknesses: string | null
  opportunities: string | null
  threats: string | null
  recommendations: string | null
  created_at: string
}

// Функция для расширения результата оценки дополнительными метриками
function extendAssessment(assessment: any): ExtendedAssessmentResult {
  // Если это уже расширенная оценка, возвращаем её
  if (assessment?.social_score !== undefined) {
    return assessment
  }
  
  // Генерируем общий балл, если его нет
  const overall_score = assessment?.overall_score || assessment?.success_score || Math.floor(Math.random() * 70) + 30
  
  // Генерируем недостающие баллы по категориям с некоторой корреляцией с общим баллом
  return {
    ...assessment,
    overall_score,
    social_score: calculateCategoryScore(overall_score),
    team_score: calculateCategoryScore(overall_score),
    market_score: calculateCategoryScore(overall_score),
    financial_score: calculateCategoryScore(overall_score),
    innovation_score: calculateCategoryScore(overall_score),
  }
}

// Генерирует балл категории с некоторой корреляцией с общим баллом
function calculateCategoryScore(overallScore: number): number {
  // Добавляем случайное отклонение ±20 от общего балла
  const variance = Math.floor(Math.random() * 40) - 20
  const score = overallScore + variance
  // Ограничиваем значение в диапазоне 0-100
  return Math.max(0, Math.min(100, score))
}

export async function GET(request: Request) {
  try {
    // Получаем параметры запроса
    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'startups'
    const idsParam = url.searchParams.get('ids')
    
    if (!idsParam) {
      return NextResponse.json(
        { error: "No IDs specified for comparison" },
        { status: 400 }
      )
    }
    
    const ids = idsParam.split(',').map(id => parseInt(id, 10))
    
    // Проверяем доступность базы данных
    const isDbConnected = isDatabaseConnected()
    
    // Проверяем тип запроса (стартапы или основатели)
    if (type === 'startups') {
      // Если база данных недоступна, используем моковые данные
      if (!isDbConnected) {
        console.log("Database not connected, using mock data for comparison")
        const filteredStartups = mockStartups.filter(startup => ids.includes(startup.id))
        
        // Добавляем оценки для моковых стартапов
        const startupWithAssessments = filteredStartups.map(startup => {
          // Генерируем случайную оценку успешности на основе ID
          const baseScore = ((startup.id * 17) % 30) + 60 // От 60 до 90
          
          const mockAssessment = {
            id: startup.id * 10,
            startup_id: startup.id,
            success_score: baseScore,
            overall_score: baseScore,
            strengths: "Strong founding team with industry experience",
            weaknesses: "Limited market validation",
            opportunities: "Expanding into international markets",
            threats: "Increasing competition in the space",
            recommendations: "Focus on core value proposition",
            created_at: new Date().toISOString()
          }
          
          // Добавляем расширенные метрики
          const extendedAssessment = extendAssessment(mockAssessment)
          
          return {
            ...startup,
            assessment: extendedAssessment,
            socialMetrics: []
          }
        })
        
        return NextResponse.json({ 
          type: 'startups',
          items: startupWithAssessments 
        })
      }
      
      // Если база данных доступна, получаем данные из неё
      const startupsWithData = await Promise.all(ids.map(async (id) => {
        const startup = await getStartupById(id)
        if (!startup) return null
        
        const assessment = await getAssessmentByStartupId(id)
        const extendedAssessment = extendAssessment(assessment)
        const socialMetrics = await getSocialMetricsByStartupId(id)
        
        return {
          ...startup,
          assessment: extendedAssessment,
          socialMetrics
        }
      }))
      
      // Фильтруем отсутствующие стартапы
      const validStartups = startupsWithData.filter(item => item !== null)
      
      return NextResponse.json({ 
        type: 'startups',
        items: validStartups 
      })
    } 
    else if (type === 'founders') {
      // Для основателей также можно добавить моковые данные при необходимости
      if (!isDbConnected) {
        // Здесь можно добавить моковые данные для основателей, если потребуется
        return NextResponse.json({ 
          type: 'founders',
          items: [] 
        })
      }
      
      // Получаем данные всех основателей из базы данных
      const foundersWithData = await Promise.all(ids.map(async (id) => {
        const founder = await getFounderById(id)
        if (!founder) return null
        
        return founder
      }))
      
      // Фильтруем отсутствующие данные
      const validFounders = foundersWithData.filter(item => item !== null)
      
      return NextResponse.json({ 
        type: 'founders',
        items: validFounders 
      })
    }
    
    return NextResponse.json(
      { error: "Invalid comparison type" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error in compare API:", error)
    return NextResponse.json(
      { error: "Error retrieving comparison data" },
      { status: 500 }
    )
  }
}

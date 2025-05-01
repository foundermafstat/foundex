"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  DollarSign, 
  Lightbulb, 
  CheckCircle2, 
  Trophy, 
  AlertTriangle
} from "lucide-react"
import ResizableLayout from "@/components/resizable-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Radar, Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js"

// Register all required Chart.js components
ChartJS.register(
  RadialLinearScale, 
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend
)

// Типы для API сравнения
interface Startup {
  id: number
  name: string
  description?: string
  industry?: string
  funding_stage?: string
  founding_date?: string
  total_funding?: number
  github_url?: string
  twitter_url?: string
  linkedin_url?: string
  instagram_url?: string
  facebook_url?: string
  assessment?: Assessment
  socialMetrics?: SocialMetrics
}

interface SocialMetrics {
  startup_id: number
  instagram_followers?: number
  twitter_followers?: number
  facebook_likes?: number
  linkedin_followers?: number
  youtube_subscribers?: number
  [key: string]: any
}

interface Assessment {
  id: number
  startup_id: number
  success_score: number
  overall_score?: number
  social_score?: number
  team_score?: number
  market_score?: number
  financial_score?: number
  innovation_score?: number
  strengths: string | null
  weaknesses: string | null
  opportunities: string | null
  threats: string | null
  recommendations: string | null
  [key: string]: any
}

interface CompareAPIResponse {
  type: string
  items: Startup[]
}

// Интерфейс для результатов сравнения метрик
interface MetricComparisonResult {
  winner: number; // Индекс выигрывающего стартапа
  metricName: string;
  values: number[];
  difference: number;
  percentageDifference: number;
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const ids = searchParams.get("ids")?.split(",") || []
  const type = searchParams.get("type") || "startups"
  const byName = searchParams.get("byName") === "true"
  const name1 = searchParams.get("name1") || ""
  const name2 = searchParams.get("name2") || ""
  
  const [data, setData] = useState<CompareAPIResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchedIds, setSearchedIds] = useState<string[]>([])
  const [metricComparisons, setMetricComparisons] = useState<MetricComparisonResult[]>([])
  const [overallWinner, setOverallWinner] = useState<number | null>(null)
  
  // Используем useRef для отслеживания, был ли выполнен запрос
  const fetchedRef = useRef(false)

  useEffect(() => {
    // Функция для поиска стартапов по именам
    const searchStartupsByName = async () => {
      try {
        // Поиск первого стартапа
        const response1 = await fetch(`/api/search?q=${encodeURIComponent(name1)}&type=startup`)
        if (!response1.ok) {
          throw new Error(`Error finding startup "${name1}"`)
        }
        const data1 = await response1.json()
        
        // Поиск второго стартапа
        const response2 = await fetch(`/api/search?q=${encodeURIComponent(name2)}&type=startup`)
        if (!response2.ok) {
          throw new Error(`Error finding startup "${name2}"`)
        }
        const data2 = await response2.json()
        
        // Проверяем, что нашли оба стартапа
        if (!data1.results || data1.results.length === 0) {
          throw new Error(`Startup "${name1}" not found`)
        }
        
        if (!data2.results || data2.results.length === 0) {
          throw new Error(`Startup "${name2}" not found`)
        }
        
        // Берем первое совпадение из результатов поиска
        const startup1 = data1.results[0]
        const startup2 = data2.results[0]
        
        // Создаем массив найденных ID
        const foundIds = [startup1.id.toString(), startup2.id.toString()]
        setSearchedIds(foundIds)
        
        return foundIds
      } catch (err) {
        console.error("Error searching startups by name:", err)
        throw err
      }
    }

    async function fetchData() {
      // Проверяем, был ли уже выполнен запрос
      if (fetchedRef.current) return
      
      try {
        setLoading(true)
        
        // Устанавливаем флаг, что запрос выполняется
        fetchedRef.current = true
        
        // Определяем, какие ID использовать
        let idsToCompare = ids
        
        // Если задан режим поиска по именам, ищем ID
        if (byName && name1 && name2) {
          idsToCompare = await searchStartupsByName()
        }
        
        if (idsToCompare.length === 0) {
          setLoading(false)
          setError("No IDs provided for comparison")
          return
        }
        
        // Делаем запрос к API сравнения
        const response = await fetch(`/api/compare?ids=${idsToCompare.join(',')}&type=${type}`)
        
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error("Error loading comparison data:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ids, type, byName, name1, name2])

  useEffect(() => {
    if (!data || !data.items || data.items.length < 2) return;
    
    const startups = data.items;
    
    // Define metrics to compare
    const metricsToCompare = [
      { name: 'Overall Score', key: 'overall_score', accessor: (s: Startup) => s.assessment?.overall_score || 0 },
      { name: 'Social Score', key: 'social_score', accessor: (s: Startup) => s.assessment?.social_score || 0 },
      { name: 'Team Score', key: 'team_score', accessor: (s: Startup) => s.assessment?.team_score || 0 },
      { name: 'Market Score', key: 'market_score', accessor: (s: Startup) => s.assessment?.market_score || 0 },
      { name: 'Financial Score', key: 'financial_score', accessor: (s: Startup) => s.assessment?.financial_score || 0 },
      { name: 'Innovation Score', key: 'innovation_score', accessor: (s: Startup) => s.assessment?.innovation_score || 0 },
      { name: 'Social Media Followers', key: 'social_followers', accessor: (s: Startup) => {
        const sm = s.socialMetrics || {};
        return (sm.instagram_followers || 0) + (sm.twitter_followers || 0) + 
               (sm.facebook_likes || 0) + (sm.linkedin_followers || 0) + 
               (sm.youtube_subscribers || 0);
      }},
      { name: 'Total Funding', key: 'total_funding', accessor: (s: Startup) => s.total_funding || 0 }
    ];
    
    // Compare each metric
    const comparisons = metricsToCompare.map(metric => {
      const values = startups.map(startup => metric.accessor(startup));
      
      // Find the highest value
      const maxValue = Math.max(...values);
      const winnerIndex = values.indexOf(maxValue);
      
      // Calculate difference
      let difference = 0;
      let percentageDifference = 0;
      
      if (startups.length === 2) {
        difference = Math.abs(values[0] - values[1]);
        
        // Calculate percentage difference
        if (values[1] !== 0 && values[0] !== 0) {
          const avg = (values[0] + values[1]) / 2;
          percentageDifference = (difference / avg) * 100;
        }
      }
      
      return {
        metricName: metric.name,
        winner: maxValue > 0 ? winnerIndex : -1, // -1 means no winner (tied or all zero)
        values,
        difference,
        percentageDifference
      };
    });
    
    setMetricComparisons(comparisons);
    
    // Calculate overall winner
    if (startups.length === 2) {
      const startup1Wins = comparisons.filter(comp => comp.winner === 0).length;
      const startup2Wins = comparisons.filter(comp => comp.winner === 1).length;
      
      if (startup1Wins > startup2Wins) {
        setOverallWinner(0);
      } else if (startup2Wins > startup1Wins) {
        setOverallWinner(1);
      } else {
        setOverallWinner(null); // Tie
      }
    }
  }, [data]);

  // Prepare data for the radar chart
  const startups = data?.items || []
  const radarChartData = {
    labels: ["Social", "Team", "Market", "Finance", "Innovation"],
    datasets: startups.map((startup: Startup, index: number) => {
      const assessment = startup.assessment || {
        social_score: 0,
        team_score: 0,
        market_score: 0,
        financial_score: 0,
        innovation_score: 0
      }
      
      return {
        label: startup.name,
        data: [
          assessment.social_score || 0,
          assessment.team_score || 0,
          assessment.market_score || 0,
          assessment.financial_score || 0,
          assessment.innovation_score || 0,
        ],
        backgroundColor: `rgba(${(index * 100) % 255}, ${(255 - index * 50) % 255}, ${(150 + index * 30) % 255}, 0.2)`,
        borderColor: `rgba(${(index * 100) % 255}, ${(255 - index * 50) % 255}, ${(150 + index * 30) % 255}, 1)`,
        borderWidth: 2
      }
    })
  }

  // Prepare data for bar charts
  const getBarChartData = (metricName: string, values: number[]) => {
    return {
      labels: startups.map(s => s.name),
      datasets: [
        {
          label: metricName,
          data: values,
          backgroundColor: startups.map((_s, i) => 
            `rgba(${(i * 100) % 255}, ${(255 - i * 50) % 255}, ${(150 + i * 30) % 255}, 0.6)`
          ),
          borderColor: startups.map((_s, i) => 
            `rgba(${(i * 100) % 255}, ${(255 - i * 50) % 255}, ${(150 + i * 30) % 255}, 1)`
          ),
          borderWidth: 1,
        }
      ]
    };
  };

  // Prepare data for social media distribution chart
  const getSocialMediaDistributionData = (startupIndex: number) => {
    const startup = startups[startupIndex];
    const sm = startup.socialMetrics || {};
    
    return {
      labels: ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'YouTube'],
      datasets: [
        {
          data: [
            sm.instagram_followers || 0,
            sm.twitter_followers || 0,
            sm.facebook_likes || 0,
            sm.linkedin_followers || 0,
            sm.youtube_subscribers || 0
          ],
          backgroundColor: [
            'rgba(195, 40, 96, 0.6)',
            'rgba(29, 161, 242, 0.6)',
            'rgba(59, 89, 152, 0.6)',
            'rgba(0, 119, 181, 0.6)',
            'rgba(255, 0, 0, 0.6)'
          ],
          borderColor: [
            'rgba(195, 40, 96, 1)',
            'rgba(29, 161, 242, 1)',
            'rgba(59, 89, 152, 1)',
            'rgba(0, 119, 181, 1)',
            'rgba(255, 0, 0, 1)'
          ],
          borderWidth: 1,
        }
      ]
    };
  };

  // Helper function to render metric comparison with winner highlight
  const renderMetricComparison = (comparison: MetricComparisonResult, index: number) => {
    return (
      <Card key={`metric-${index}`} className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            {comparison.metricName}
            {comparison.winner !== -1 && (
              <Trophy className="h-4 w-4 text-yellow-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              {startups.map((startup: Startup, i: number) => (
                <div key={`${startup.id}-metric-${index}`} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="font-medium flex items-center gap-2">
                      {startup.name}
                      {comparison.winner === i && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Leader
                        </Badge>
                      )}
                    </div>
                    <div className={`font-bold ${comparison.winner === i ? 'text-green-600' : ''}`}>
                      {comparison.values[i].toLocaleString()}
                    </div>
                  </div>
                  <Progress 
                    value={comparison.values[i]}
                    max={Math.max(...comparison.values) || 100}
                    className={`h-2 ${comparison.winner === i ? 'bg-green-100' : ''}`}
                  />
                </div>
              ))}
            </div>
            
            {startups.length === 2 && comparison.difference > 0 && (
              <div className="text-sm text-muted-foreground pt-2 border-t">
                <span className="font-medium">Difference:</span> {comparison.difference.toLocaleString()} 
                {comparison.percentageDifference > 0 && (
                  <span> ({comparison.percentageDifference.toFixed(1)}%)</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Проверки для разных состояний
  if (loading) {
    return (
      <ResizableLayout>
        <div className="py-6 px-4 md:px-6 space-y-8">
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </ResizableLayout>
    )
  }

  if (error) {
    return (
      <ResizableLayout>
        <div className="py-6 px-4 md:px-6 space-y-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <p className="text-destructive">Error: {error}</p>
            </CardContent>
          </Card>
        </div>
      </ResizableLayout>
    )
  }

  if (!data || !data.items || data.items.length === 0) {
    return (
      <ResizableLayout>
        <div className="py-6 px-4 md:px-6 space-y-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No data available for comparison</p>
            </CardContent>
          </Card>
        </div>
      </ResizableLayout>
    )
  }

  return (
    <ResizableLayout>
      <div className="py-6 px-4 md:px-6 space-y-8">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold">
          Comparing {startups.length} Startups
        </h1>
        
        {/* Basic metrics comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Success Score Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {startups.map((startup: Startup) => (
                <div key={startup.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{startup.name}</div>
                    <div className="font-bold">{startup.assessment?.overall_score || startup.assessment?.success_score || "N/A"}/100</div>
                  </div>
                  <Progress 
                    value={startup.assessment?.overall_score || startup.assessment?.success_score || 0}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Radar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Radar 
              data={radarChartData} 
              options={{
                scales: {
                  r: {
                    min: 0,
                    max: 100,
                    beginAtZero: true,
                    ticks: {
                      stepSize: 20
                    }
                  }
                },
                elements: {
                  line: {
                    tension: 0.2
                  }
                },
                responsive: true,
                maintainAspectRatio: false
              }} 
            />
          </CardContent>
        </Card>

        {/* Detailed comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {startups.map((startup: Startup) => (
            <Card key={startup.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Link href={`/startups/${startup.id}`} className="hover:underline">
                  <CardTitle className="text-lg">{startup.name}</CardTitle>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {startup.description || "No description available"}
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Funding:</div>
                    <div className="text-sm">{startup.funding_stage || "Unknown"}</div>

                    <div className="text-sm font-medium">Industry:</div>
                    <div className="text-sm">{startup.industry || "Unknown"}</div>
                    
                    <div className="text-sm font-medium">Founding date:</div>
                    <div className="text-sm">
                      {startup.founding_date 
                        ? new Date(startup.founding_date).toLocaleDateString('en-US') 
                        : "Unknown"}
                    </div>
                  </div>
                  
                  {startup.assessment && (
                    <div className="border-t pt-3">
                      <h4 className="font-medium mb-2">Startup assessment:</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Strengths:</span> {startup.assessment.strengths || "No data"}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Weaknesses:</span> {startup.assessment.weaknesses || "No data"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Metric comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {metricComparisons
            .filter(comp => ['Social Score', 'Team Score', 'Market Score', 'Financial Score', 'Innovation Score']
            .includes(comp.metricName))
            .map((comp, index) => renderMetricComparison(comp, index))}
        </div>

        {/* Social media presence */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Presence</CardTitle>
            <CardDescription>Distribution of followers across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {startups.map((startup, index) => (
                <div key={`social-${startup.id}`} className="space-y-4">
                  <h3 className="font-medium text-center">{startup.name}</h3>
                  <div className="h-[250px]">
                    <Doughnut
                      data={getSocialMediaDistributionData(index)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right'
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* SWOT Analysis Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>SWOT Analysis Comparison</CardTitle>
            <CardDescription>Strengths, Weaknesses, Opportunities, and Threats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {startups.map((startup: Startup) => (
                <Card key={`swot-${startup.id}`} className="overflow-hidden border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{startup.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2 border-l-4 border-green-400 pl-3">
                        <h4 className="font-medium text-green-700">Strengths</h4>
                        <p className="text-sm">{startup.assessment?.strengths || "No data available"}</p>
                      </div>
                      
                      <div className="space-y-2 border-l-4 border-red-400 pl-3">
                        <h4 className="font-medium text-red-700">Weaknesses</h4>
                        <p className="text-sm">{startup.assessment?.weaknesses || "No data available"}</p>
                      </div>
                      
                      <div className="space-y-2 border-l-4 border-blue-400 pl-3">
                        <h4 className="font-medium text-blue-700">Opportunities</h4>
                        <p className="text-sm">{startup.assessment?.opportunities || "No data available"}</p>
                      </div>
                      
                      <div className="space-y-2 border-l-4 border-orange-400 pl-3">
                        <h4 className="font-medium text-orange-700">Threats</h4>
                        <p className="text-sm">{startup.assessment?.threats || "No data available"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Final recommendation */}
        {startups.length === 2 && (
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Conclusion and Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overallWinner !== null ? (
                  <div className="space-y-2">
                    <p className="font-medium">
                      Based on the comparison, <span className="text-green-600">{startups[overallWinner].name}</span> shows stronger performance in {metricComparisons.filter(c => c.winner === overallWinner).length} out of {metricComparisons.length} evaluated metrics.
                    </p>
                    
                    <div className="pt-2">
                      <h4 className="font-medium">Key advantages of {startups[overallWinner].name}:</h4>
                      <ul className="list-disc pl-5 pt-2 space-y-1">
                        {metricComparisons
                          .filter(comp => comp.winner === overallWinner)
                          .map((comp, i) => (
                            <li key={`advantage-${i}`}>
                              <span className="font-medium">{comp.metricName}:</span> {comp.percentageDifference.toFixed(1)}% higher
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="font-medium">Areas for improvement:</h4>
                      <ul className="list-disc pl-5 pt-2 space-y-1">
                        {metricComparisons
                          .filter(comp => comp.winner !== overallWinner && comp.winner !== -1)
                          .map((comp, i) => (
                            <li key={`improvement-${i}`}>
                              <span className="font-medium">{comp.metricName}:</span> {comp.percentageDifference.toFixed(1)}% lower than {startups[comp.winner].name}
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p>
                    The comparison shows that both startups have similar overall performance. Each has specific strengths in different areas.
                  </p>
                )}
                
                <div className="pt-2 border-t">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Important note
                  </h4>
                  <p className="text-sm text-muted-foreground pt-1">
                    This comparison is based on available data and should be used as a starting point for further analysis. Consider more specific industry factors and latest market trends when making important decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ResizableLayout>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Startup } from "@/lib/db"
import EmptyState from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import DatabaseError from "@/components/database-error"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  CheckIcon, 
  XIcon, 
  ArrowUpDown, 
  TrendingUp, 
  Users, 
  LineChart, 
  DollarSign,
  Lightbulb
} from "lucide-react"

// Типы для сортировки и фильтрации
type SortOrder = "alphabetical" | "score" | "newest"
type MetricKey = "social_score" | "team_score" | "market_score" | "financial_score" | "innovation_score" | "overall_score"

export default function StartupList({ searchQuery = "" }: { searchQuery?: string }) {
  const [startups, setStartups] = useState<Startup[]>([])
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>("alphabetical")
  const [industryFilter, setIndustryFilter] = useState<string>("all")
  const [industries, setIndustries] = useState<string[]>([])

  // Функция для получения метрик стартапа
  const getMetricStatus = (startup: Startup, metricKey: MetricKey): boolean => {
    // Если у стартапа нет объекта assessment, возвращаем false
    if (!startup.assessment) return false;
    
    // Проверяем наличие специфичных полей
    switch(metricKey) {
      case "social_score":
        // Проверяем любые метрики, связанные с социальными сетями
        return startup.instagram_url !== null || 
               startup.twitter_url !== null || 
               startup.facebook_url !== null ||
               startup.linkedin_url !== null;
      case "team_score":
        // Для team_score проверяем наличие оценки success_score
        return startup.assessment.success_score !== undefined && 
               startup.assessment.success_score !== null;
      case "market_score":
        // Для market_score проверяем наличие отрасли и фазы финансирования
        return startup.industry !== null || startup.funding_stage !== null;
      case "financial_score":
        // Для financial_score проверяем total_funding
        return startup.total_funding !== null;
      case "innovation_score":
        // Для innovation_score можно проверить github_url или strengths
        return startup.github_url !== null || 
              (startup.assessment.strengths !== null && 
               startup.assessment.strengths !== "");
      case "overall_score":
        // Для overall_score просто проверяем его наличие
        return startup.assessment.overall_score !== undefined && 
               startup.assessment.overall_score !== null;
      default:
        return false;
    }
  }

  // Загрузка списка стартапов
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(false)

        // Формируем URL API с параметрами поиска, если они есть
        const apiUrl = searchQuery 
          ? `/api/startups?query=${encodeURIComponent(searchQuery)}`
          : '/api/startups'
        
        // Выполняем запрос к API
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error('Error retrieving data')
        }
        
        const data = await response.json()
        setStartups(data)
        
        // Извлекаем уникальные отрасли для фильтрации
        const uniqueIndustries = Array.from(
          new Set(data.map((s: Startup) => s.industry).filter(Boolean))
        ) as string[];
        setIndustries(uniqueIndustries);
        
      } catch (err) {
        console.error('Error loading startups:', err)
        setError(true)
        // Очищаем стартапы в случае ошибки
        setStartups([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [searchQuery])

  // Эффект для фильтрации и сортировки
  useEffect(() => {
    let results = [...startups];
    
    // Применяем фильтр по отрасли
    if (industryFilter !== "all") {
      results = results.filter((startup) => startup.industry === industryFilter);
    }
    
    // Применяем сортировку
    results.sort((a, b) => {
      if (sortOrder === "alphabetical") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (sortOrder === "score") {
        const scoreA = a.assessment?.overall_score || 0;
        const scoreB = b.assessment?.overall_score || 0;
        return scoreB - scoreA; // По убыванию оценки
      } else {
        // Сортировка по ID (предполагая, что более новые имеют более высокий ID)
        return (b.id || 0) - (a.id || 0);
      }
    });
    
    setFilteredStartups(results);
  }, [startups, sortOrder, industryFilter]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={`startup-skeleton-${i}`} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex flex-wrap gap-2 mt-4">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <DatabaseError />
  }

  if (startups.length === 0) {
    return (
      <EmptyState
        title="No startups found"
        description={
          searchQuery
            ? `No startups found matching '${searchQuery}'`
            : "There are no startups in the system yet. Add your first startup."
        }
      >
        <div className="mt-4">
          <Link href="/startups/new">
            <Button>Add startup</Button>
          </Link>
        </div>
      </EmptyState>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Startups {searchQuery && `matching "${searchQuery}"`}</h2>
        <div className="flex gap-2">
          {/* Industry Filter */}
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Sort Order */}
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="score">By Score</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStartups.map((startup) => (
          <Link href={`/startups/${startup.id}`} key={startup.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{startup.name}</CardTitle>
                  <Badge variant="outline">ID: {startup.id}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {startup.description || "No description available"}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex flex-wrap gap-2">
                    {startup.industry && <Badge variant="outline">{startup.industry}</Badge>}
                    {startup.funding_stage && <Badge variant="secondary">{startup.funding_stage}</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-lg">{startup.assessment?.overall_score || "N/A"}</span>
                    <span className="text-sm text-muted-foreground">score</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <div className="flex gap-2 w-full justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1" title="Social Score">
                    <TrendingUp size={16} />
                    {getMetricStatus(startup, "social_score") ? (
                      <CheckIcon size={14} className="text-green-500" />
                    ) : (
                      <XIcon size={14} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1" title="Team Score">
                    <Users size={16} />
                    {getMetricStatus(startup, "team_score") ? (
                      <CheckIcon size={14} className="text-green-500" />
                    ) : (
                      <XIcon size={14} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1" title="Market Score">
                    <LineChart size={16} />
                    {getMetricStatus(startup, "market_score") ? (
                      <CheckIcon size={14} className="text-green-500" />
                    ) : (
                      <XIcon size={14} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1" title="Financial Score">
                    <DollarSign size={16} />
                    {getMetricStatus(startup, "financial_score") ? (
                      <CheckIcon size={14} className="text-green-500" />
                    ) : (
                      <XIcon size={14} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1" title="Innovation Score">
                    <Lightbulb size={16} />
                    {getMetricStatus(startup, "innovation_score") ? (
                      <CheckIcon size={14} className="text-green-500" />
                    ) : (
                      <XIcon size={14} className="text-red-500" />
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

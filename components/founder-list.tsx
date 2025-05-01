"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Founder, Startup } from "@/lib/db"
import { ExternalLink } from "lucide-react"
import EmptyState from "@/components/empty-state"
import DatabaseError from "@/components/database-error"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function FounderList({ searchQuery = "" }: { searchQuery?: string }) {
  const [founders, setFounders] = useState<Founder[]>([])
  const [startups, setStartups] = useState<Record<number, Startup | null>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(false)
        
        // Формируем URL API с параметрами поиска, если они есть
        const apiUrl = searchQuery 
          ? `/api/founders?query=${encodeURIComponent(searchQuery)}`
          : '/api/founders'
        
        // Выполняем запрос к API
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error('Ошибка при получении данных')
        }
        
        const founderData = await response.json()
        setFounders(founderData)
        
        // Получаем уникальные ID стартапов
        const uniqueStartupIds = Array.from(
          new Set(founderData.map((f: Founder) => f.startup_id).filter(Boolean))
        ) as number[]
        
        // Создаем объект для хранения стартапов
        const startupMap: Record<number, Startup | null> = {}
        
        // Получаем информацию о каждом стартапе
        await Promise.all(
          uniqueStartupIds.map(async (id) => {
            try {
              const res = await fetch(`/api/startups/${id}`)
              if (res.ok) {
                const startup = await res.json()
                startupMap[id] = startup
              } else {
                startupMap[id] = null
              }
            } catch (e) {
              console.error(`Ошибка при получении данных стартапа ${id}:`, e)
              startupMap[id] = null
            }
          })
        )
        
        setStartups(startupMap)
      } catch (err) {
        console.error('Ошибка загрузки основателей:', err)
        setError(true)
        // Очищаем данные в случае ошибки
        setFounders([])
        setStartups({})
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [searchQuery])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Card key={`founder-loading-skeleton-${num}`} className="overflow-hidden">
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

  if (founders.length === 0) {
    return (
      <EmptyState
        title="Founders not found"
        description={
          searchQuery
            ? `No founders found matching the query '${searchQuery}'`
            : "No founders found in the system. Add the first founder."
        }
      >
        <div className="mt-4">
          <Link href="/founders/new">
            <Button>Добавить основателя</Button>
          </Link>
        </div>
      </EmptyState>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Founders {searchQuery && `matching the query "${searchQuery}"`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {founders.map((founder) => {
          const startup = founder.startup_id ? startups[founder.startup_id] : null
          
          return (
            <Card 
              key={`founder-item-${founder.id}`}
              className="h-full hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                window.location.href = `/founders/${founder.id}`;
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{founder.name}</CardTitle>
                {startup && <p className="text-sm text-muted-foreground">{startup.name}</p>}
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{founder.bio || "No bio available"}</p>
                <div className="flex gap-3 mt-3">
                  {founder.linkedin_url && (
                    <a
                      href={founder.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      LinkedIn <ExternalLink className="inline h-3 w-3" />
                    </a>
                  )}
                  {founder.twitter_url && (
                    <a
                      href={founder.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Twitter <ExternalLink className="inline h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function FounderListSkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Founders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((num) => (
          <Card key={`founder-list-skeleton-item-${num}`} className="h-full">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-1" />
              <div className="flex gap-3 mt-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

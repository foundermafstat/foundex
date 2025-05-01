"use client"

import { useState, useEffect } from "react"
import ResizableLayout from "@/components/resizable-layout"
import StartupList from "@/components/startup-list"
import FounderList from "@/components/founder-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import DatabaseError from "@/components/database-error"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const type = searchParams.get("type") || "startup"
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [activeType, setActiveType] = useState(type)

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        setLoading(true)
        setError(false)
        
        // Выполняем поиск через API
        const searchUrl = `/api/search?q=${encodeURIComponent(query)}&type=${activeType}`
        const response = await fetch(searchUrl)
        
        if (!response.ok) {
          throw new Error('Error fetching search results')
        }
        
        const data = await response.json()
        setResults(data.results || [])
      } catch (err) {
        console.error('Error during search:', err)
        setError(true)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchSearchResults()
  }, [query, activeType])

  const handleTabChange = (value: string) => {
    setActiveType(value)
  }

  return (
    <ResizableLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {query ? `Search results: "${query}"` : "All results"}
          </h1>
        </div>

        <Tabs defaultValue={activeType} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="startup">Startups</TabsTrigger>
            <TabsTrigger value="founder">Founders</TabsTrigger>
          </TabsList>

          <TabsContent value="startup">
            {loading ? (
              <SearchSkeleton />
            ) : error ? (
              <DatabaseError />
            ) : (
              <StartupList searchQuery={query} />
            )}
          </TabsContent>

          <TabsContent value="founder">
            {loading ? (
              <SearchSkeleton />
            ) : error ? (
              <DatabaseError />
            ) : (
              <FounderList searchQuery={query} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ResizableLayout>
  )
}

function SearchSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={`search-skeleton-${i}`} className="border rounded-lg p-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

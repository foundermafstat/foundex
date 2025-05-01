"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import ResizableLayout from "@/components/resizable-layout"

export default function CompareByNamePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const name1 = searchParams.get("name1") || ""
  const name2 = searchParams.get("name2") || ""
  const type = searchParams.get("type") || "startups"
  
  useEffect(() => {
    async function findAndCompare() {
      try {
        if (!name1 || !name2) {
          setError("Missing startup names to compare")
          setLoading(false)
          return
        }
        
        // Находим ID первого стартапа
        const response1 = await fetch(`/api/search?q=${encodeURIComponent(name1)}&type=startup`)
        if (!response1.ok) {
          throw new Error(`Error finding startup "${name1}"`)
        }
        const data1 = await response1.json()
        
        // Находим ID второго стартапа
        const response2 = await fetch(`/api/search?q=${encodeURIComponent(name2)}&type=startup`)
        if (!response2.ok) {
          throw new Error(`Error finding startup "${name2}"`)
        }
        const data2 = await response2.json()
        
        // Проверяем, что нашли оба стартапа
        if (!data1.length) {
          throw new Error(`Startup "${name1}" not found`)
        }
        if (!data2.length) {
          throw new Error(`Startup "${name2}" not found`)
        }
        
        // Берем первое совпадение из результатов поиска
        const startup1 = data1[0]
        const startup2 = data2[0]
        
        // Перенаправляем на страницу сравнения с ID
        router.push(`/compare?ids=${startup1.id},${startup2.id}&type=${type}`)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error processing comparison")
        setLoading(false)
      }
    }
    
    findAndCompare()
  }, [name1, name2, type, router])
  
  return (
    <ResizableLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          {loading ? (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg">
                {name1 && name2 
                  ? `Finding and comparing "${name1}" and "${name2}"...` 
                  : "Processing comparison..."}
              </p>
            </div>
          ) : error ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
              <p>{error}</p>
              <button 
                onClick={() => router.back()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Go Back
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </ResizableLayout>
  )
}

import ResizableLayout from "@/components/resizable-layout"
import StartupList from "@/components/startup-list"
import CompareInterface from "@/components/compare-interface"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function StartupsPage() {
  return (
    <ResizableLayout>
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<StartupListSkeleton />}>
          <StartupList />
        </Suspense>
        
        {/* Добавляем интерфейс сравнения */}
        <CompareInterface />
      </div>
    </ResizableLayout>
  )
}

function StartupListSkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Startups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`skeleton-item-${i}`} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-full mt-1" />
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

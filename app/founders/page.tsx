import ResizableLayout from "@/components/resizable-layout"
import FounderList from "@/components/founder-list"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function FoundersPage() {
  return (
    <ResizableLayout>
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<FounderListSkeleton />}>
          <FounderList />
        </Suspense>
      </div>
    </ResizableLayout>
  )
}

function FounderListSkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Founders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-1" />
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-full mt-1" />
            <div className="flex gap-3 mt-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

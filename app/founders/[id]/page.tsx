import ResizableLayout from "@/components/resizable-layout"
import FounderDetails from "@/components/founder-details"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default async function FounderPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (Number.isNaN(id)) {
    notFound()
  }

  return (
    <ResizableLayout>
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<FounderDetailsSkeleton />}>
          <FounderDetails id={id} />
        </Suspense>
      </div>
    </ResizableLayout>
  )
}

function FounderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-48 mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <Skeleton className="h-6 w-20 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  )
}

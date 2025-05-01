import ResizableLayout from "@/components/resizable-layout"
import StartupDetails from "@/components/startup-details"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default async function StartupPage({ params }: { params: { id: string } }) {
  // params.id уже доступен, не нужно использовать await
  const idParam = params.id;
  const id = Number.parseInt(idParam);

  if (Number.isNaN(id)) {
    notFound();
  }

  return (
    <ResizableLayout>
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<StartupDetailsSkeleton />}>
          <StartupDetails id={id} />
        </Suspense>
      </div>
    </ResizableLayout>
  );
}

function StartupDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-48 mt-2" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`startup-metric-skeleton-${i}`} className="border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-4">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  )
}

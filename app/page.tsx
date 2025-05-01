"use client"

import ResizableLayout from "@/components/resizable-layout"
import DashboardNavigation from "@/components/dashboard-navigation"

export default function Home() {
  return (
    <ResizableLayout>
      <div className="max-w-4xl mx-auto">
        <DashboardNavigation />
      </div>
    </ResizableLayout>
  )
}

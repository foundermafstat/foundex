"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import PersistentChat from "@/components/persistent-chat"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

export default function ResizableLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const [chatPanelSize, setChatPanelSize] = useState(25) // Дефолтный размер 25%

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
    
    // Загружаем сохраненное значение из localStorage
    const savedSize = localStorage.getItem('chatPanelSize')
    if (savedSize) {
      setChatPanelSize(Number.parseInt(savedSize, 10))
    }
  }, [])

  // Функция для обработки изменения размера панели
  const handleResizeEnd = (sizes: number[]) => {
    // Сохраняем новый размер левой панели
    const newSize = sizes[0]
    setChatPanelSize(newSize)
    localStorage.setItem('chatPanelSize', newSize.toString())
  }

  // Return a simple loading state or null until client-side rendering is ready
  if (!isClient) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <div className="w-1/4 p-4 border-r">
          {/* Chat placeholder */}
          <div className="h-full bg-muted/30 rounded-lg animate-pulse" />
        </div>
        <div className="w-3/4 p-6">
          {/* Content placeholder */}
          <div className="h-full">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-full"
        onLayout={handleResizeEnd}
      >
        <ResizablePanel 
          defaultSize={chatPanelSize} 
          minSize={20} 
          maxSize={40}
        >
          <div className="h-full p-4">
            <PersistentChat />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel defaultSize={100 - chatPanelSize}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full p-6 overflow-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { Building2, User2, RefreshCw, BarChart3, Search } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useChatStore } from "@/lib/store/chat-store"

export function SiteHeader() {
  const pathname = usePathname()
  const [refreshing, setRefreshing] = useState(false)
  const clearMessages = useChatStore((state) => state.clearMessages)
  
  const handleRefresh = () => {
    setRefreshing(true)
    
    // Очистка чата
    clearMessages()
    
    // Имитация завершения процесса через короткое время
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="m-6 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Foundex
            </span>
          </Link>
          <nav className="flex items-center space-x-2 text-sm font-medium">
            <Link href="/startups">
              <Button 
                variant={pathname.startsWith("/startups") ? "default" : "ghost"} 
                size="sm" 
                className="h-8"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Startups
              </Button>
            </Link>
            <Link href="/founders">
              <Button 
                variant={pathname.startsWith("/founders") ? "default" : "ghost"} 
                size="sm" 
                className="h-8"
              >
                <User2 className="mr-2 h-4 w-4" />
                Founders
              </Button>
            </Link>
            <Link href="/search">
              <Button 
                variant={pathname.startsWith("/search") ? "default" : "ghost"} 
                size="sm" 
                className="h-8"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            className={refreshing ? "animate-spin" : ""}
            title="Refresh Chat Status"
          >
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">Refresh status</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useChatStore } from "@/lib/store/chat-store"
import { format } from "date-fns"
import MarkdownMessage from "./markdown-message"

export default function PersistentChat() {
  const { 
    messages, 
    addMessage, 
    isLoading, 
    setIsLoading, 
    sessionId,
    shouldScroll,
    setShouldScroll,
    clearMessages,
    inputText,
    setInputText
  } = useChatStore();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (lastMessageRef.current && shouldScroll) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
      setShouldScroll(false)
    }
  }, [messages, shouldScroll, setShouldScroll])

  // Function to handle navigation based on user commands
  const handleNavigation = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase()
    let targetPath = ""
    let targetName = ""

    if (lowerCaseMessage === "show me all startups") {
      targetPath = "/startups"
      targetName = "list of all startups"
    } else if (lowerCaseMessage === "show me all founders") {
      targetPath = "/founders"
      targetName = "list of all founders"
    } else if (lowerCaseMessage.startsWith("analyze ")) {
      const startupName = userMessage.substring(8).trim()
      targetPath = `/search?q=${encodeURIComponent(startupName)}&type=startup`
      targetName = `information about startup "${startupName}"`
    } else if (lowerCaseMessage.startsWith("assess ")) {
      const founderName = userMessage.substring(7).trim()
      targetPath = `/search?q=${encodeURIComponent(founderName)}&type=founder`
      targetName = `information about founder "${founderName}"`
    } else if (lowerCaseMessage.match(/^compare startups? \d+( and|,| with)? ?\d+( and|,| with)? ?\d*$/i)) {
      // Extract startup IDs from the command (e.g., "compare startups 1 and 2" or "compare startup 1, 2, 3")
      const idMatches = lowerCaseMessage.match(/\d+/g)
      if (idMatches && idMatches.length >= 2) {
        const ids = idMatches.join(',')
        targetPath = `/compare?ids=${ids}&type=startups`
        targetName = `comparison of startups (ID: ${idMatches.join(', ')})`
      } else {
        addMessage("Please specify at least two startup IDs for comparison. Example: 'compare startups 1 and 2'", "assistant")
        return true
      }
    } else if (lowerCaseMessage.match(/^compare founders? \d+( and|,| with)? ?\d+( and|,| with)? ?\d*$/i)) {
      // Extract founder IDs from the command (e.g., "compare founders 1 and 2" or "compare founder 1, 2, 3")
      const idMatches = lowerCaseMessage.match(/\d+/g)
      if (idMatches && idMatches.length >= 2) {
        const ids = idMatches.join(',')
        targetPath = `/compare?ids=${ids}&type=founders`
        targetName = `comparison of founders (ID: ${idMatches.join(', ')})`
      } else {
        addMessage("Please specify at least two founder IDs for comparison. Example: 'compare founders 1 and 2'", "assistant")
        return true
      }
    } else {
      return false
    }

    // Add navigation message
    addMessage(`Navigating to ${targetName}...`, "assistant")
    
    // Execute navigation after a small delay
    setTimeout(() => {
      router.push(targetPath)
    }, 500)
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputText.trim() === "") return

    const userMessage = inputText.trim()
    setInputText("")

    // Add user message to chat
    addMessage(userMessage, "user")

    // Process commands for navigation
    const didNavigate = handleNavigation(userMessage)

    // If we're navigating, don't need to get AI response
    if (didNavigate) {
      return
    }

    // Get AI response
    setIsLoading(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const responseData = await response.json()

      // Add AI response to chat
      addMessage(responseData.response || "Sorry, I couldn't generate a response.", "assistant")
    } catch (error) {
      console.error("Chat error:", error)

      // Add more descriptive error message
      addMessage(
        "Sorry, I encountered a technical issue. This might be due to a server problem or configuration issue. Please try again later.",
        "assistant"
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Format timestamp to readable format
  const formatTimestamp = (isoTimestamp: string | undefined) => {
    if (!isoTimestamp) return '';
    
    try {
      const date = new Date(isoTimestamp);
      return format(date, "MMM d, yyyy • HH:mm:ss");
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return '';
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm("Are you sure you want to clear the conversation?")) {
                clearMessages()
              }
            }}
            title="Clear conversation"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-[calc(100vh-12rem)] px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pt-4">
            {messages.map((message, idx) => (
              <div
                key={message.id || idx}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full`}
                ref={idx === messages.length - 1 ? lastMessageRef : undefined}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] shadow transition-colors duration-300 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.content.toLowerCase().includes('technical issue') || message.content.toLowerCase().includes('not properly configured')
                      ? "bg-destructive/20 text-destructive border border-destructive"
                      : "bg-muted"
                  }`}
                >
                  {message.timestamp && (
                    <div className="text-xs opacity-50 mb-1">
                      {formatTimestamp(message.timestamp)}
                    </div>
                  )}
                  {message.role === "assistant" ? (
                    <MarkdownMessage content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-0">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" size="icon" disabled={isLoading || inputText.trim() === ""}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

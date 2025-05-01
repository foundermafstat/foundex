"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type ChatContextType = {
  messages: Message[]
  addMessage: (content: string, role: "user" | "assistant") => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  sessionId: string
  clearMessages: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assistant for startup assessment. How can I help you today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")

  // Initialize session ID on client side
  useEffect(() => {
    // Try to get existing session ID from localStorage
    const storedSessionId = localStorage.getItem("chatSessionId")
    if (storedSessionId) {
      setSessionId(storedSessionId)
    } else {
      // Create new session ID if none exists
      const newSessionId = uuidv4()
      localStorage.setItem("chatSessionId", newSessionId)
      setSessionId(newSessionId)
    }

    // Try to get existing messages from localStorage
    const storedMessages = localStorage.getItem("chatMessages")
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages)
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages)
        }
      } catch (error) {
        console.error("Failed to parse stored messages:", error)
      }
    }
  }, [])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 1) {
      // Only save if we have more than the initial message
      localStorage.setItem("chatMessages", JSON.stringify(messages))
    }
  }, [messages])

  const addMessage = (content: string, role: "user" | "assistant") => {
    const newMessage: Message = {
      id: uuidv4(),
      role,
      content,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const clearMessages = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AI assistant for startup assessment. How can I help you today?",
      },
    ])
    localStorage.removeItem("chatMessages")
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        isLoading,
        setIsLoading,
        sessionId,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

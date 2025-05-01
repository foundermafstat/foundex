"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import Link from "next/link"
import { useChatStore, type Message } from "@/lib/store/chat-store"
import { format } from "date-fns"
import MarkdownMessage from "./markdown-message"

export default function ChatInterface() {
  const { 
    messages, 
    addMessage, 
    isLoading, 
    setIsLoading, 
    sessionId, 
    shouldScroll,
    setShouldScroll,
    inputText,
    setInputText
  } = useChatStore();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Add event handler for filling chat input
  useEffect(() => {
    const handleFillChatInput = (e: CustomEvent) => {
      if (e.detail?.text) {
        setInputText(e.detail.text);
      }
    };

    // Add event listener
    window.addEventListener('fill-chat-input', handleFillChatInput as EventListener);

    // Remove event listener on unmount
    return () => {
      window.removeEventListener('fill-chat-input', handleFillChatInput as EventListener);
    };
  }, []);

  // Effect to scroll to the last message
  useEffect(() => {
    if (lastMessageRef.current && shouldScroll) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
      setShouldScroll(false)
    }
  }, [shouldScroll, setShouldScroll])

  // Function to handle navigation based on user commands
  const handleNavigation = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase()
    let targetPath = ""
    let targetName = ""
    let entityName = ""

    // Single startup detailed analysis commands with Context7
    if (lowerCaseMessage.startsWith("analyze startup ") || lowerCaseMessage.startsWith("analyze company ")) {
      const startupName = lowerCaseMessage.startsWith("analyze startup ") 
        ? userMessage.substring("analyze startup ".length).trim()
        : userMessage.substring("analyze company ".length).trim()
      
      if (startupName) {
        // Use Context7 to perform detailed startup analysis
        analyzeStartupWithContext7(startupName)
        return true
      }
    }
    
    // Financial analysis command for startups
    if (lowerCaseMessage.startsWith("financial analysis ") || lowerCaseMessage.startsWith("financials for ")) {
      const startupName = lowerCaseMessage.startsWith("financial analysis ") 
        ? userMessage.substring("financial analysis ".length).trim()
        : userMessage.substring("financials for ".length).trim()
      
      if (startupName) {
        // Use Context7 to perform financial analysis
        analyzeStartupFinancials(startupName)
        return true
      }
    }
    
    // Market analysis command for startups
    if (lowerCaseMessage.startsWith("market analysis ") || lowerCaseMessage.startsWith("market for ")) {
      const startupName = lowerCaseMessage.startsWith("market analysis ") 
        ? userMessage.substring("market analysis ".length).trim()
        : userMessage.substring("market for ".length).trim()
      
      if (startupName) {
        // Use Context7 to perform market analysis
        analyzeStartupMarket(startupName)
        return true
      }
    }
    
    // Technical analysis command for startups
    if (lowerCaseMessage.startsWith("tech analysis ") || lowerCaseMessage.startsWith("technology for ")) {
      const startupName = lowerCaseMessage.startsWith("tech analysis ") 
        ? userMessage.substring("tech analysis ".length).trim()
        : userMessage.substring("technology for ".length).trim()
      
      if (startupName) {
        // Use Context7 to perform technical stack analysis
        analyzeStartupTech(startupName)
        return true
      }
    }
    
    // Check for direct startup comparison by name
    if (lowerCaseMessage.includes("compare") && lowerCaseMessage.includes("startup")) {
      const words = lowerCaseMessage.split(/\s+/)
      
      // Find "and" to separate startup names
      const andIndex = words.findIndex(word => word === "and" || word === "&")
      
      if (andIndex > 2 && andIndex < words.length - 1) {
        // Extract startup names
        const firstStartupWords = words.slice(2, andIndex)
        const secondStartupWords = words.slice(andIndex + 1)
        
        const startup1 = firstStartupWords.join(" ")
        const startup2 = secondStartupWords.join(" ")
        
        if (startup1 && startup2) {
          // Call special function for comparison
          compareStartups(startup1, startup2);
          return true;
        }
      }
    }

    // List of possible commands to show all startups (only in English)
    const showStartupsCommands = ["show me all startups", "show all startups", "list startups", "display startups", "view all startups"];
    
    // List of possible commands to show all founders (only in English)
    const showFoundersCommands = ["show me all founders", "show all founders", "list founders", "display founders", "view all founders"];
    
    // Function to check command matches
    const matchesCommand = (input: string, commands: string[]): boolean => {
      return commands.some(cmd => input.includes(cmd.toLowerCase()));
    };
    
    // Determine command match
    if (matchesCommand(lowerCaseMessage, showStartupsCommands)) {
      targetPath = "/startups"
      targetName = "startups list"
    } else if (matchesCommand(lowerCaseMessage, showFoundersCommands)) {
      targetPath = "/founders"
      targetName = "founders list"
    } else if (lowerCaseMessage.startsWith("analyze ")) {
      // Extract startup name from command
      const startupName = userMessage.substring(8).trim();
      targetPath = `/search?q=${encodeURIComponent(startupName)}&type=startup`
      targetName = `startup information`
      entityName = startupName
    } else if (lowerCaseMessage.startsWith("assess ")) {
      // Extract founder name from command
      const founderName = userMessage.substring(7).trim();
      targetPath = `/search?q=${encodeURIComponent(founderName)}&type=founder`
      targetName = `founder information`
      entityName = founderName
    } else if (lowerCaseMessage.startsWith("add startup ") || 
               lowerCaseMessage.startsWith("new startup ") || 
               lowerCaseMessage.startsWith("create startup ")) {
      // Extract startup name
      let startupName = "";
      if (lowerCaseMessage.startsWith("add startup ")) {
        startupName = userMessage.substring(12).trim();
      } else if (lowerCaseMessage.startsWith("new startup ")) {
        startupName = userMessage.substring(12).trim();
      } else if (lowerCaseMessage.startsWith("create startup ")) {
        startupName = userMessage.substring(15).trim();
      }
      
      if (startupName) {
        addMessage(`Starting analysis of "${startupName}" for the database...`, "assistant");
        
        // Start the process of gathering data about the startup
        startNewStartupAnalysis(startupName);
        return true;
      } else {
        addMessage("Please specify the startup name. For example: 'Add startup TechNova'", "assistant");
        return true;
      }
    } else if (lowerCaseMessage.match(/^compare startups? \d+( and|,| with)? ?\d+( and|,| with)? ?\d*$/i)) {
      // Extract startup IDs from command
      const idMatches = lowerCaseMessage.match(/\d+/g)
      if (idMatches && idMatches.length >= 2) {
        const ids = idMatches.join(',')
        targetPath = `/compare?ids=${ids}&type=startups`
        targetName = `startups comparison`
      } else {
        addMessage("Please specify at least two startup IDs. For example: 'Compare startups 1 and 2'", "assistant")
        return true
      }
    } else if (lowerCaseMessage.match(/^compare startups? (.+?) (?:and|with) (.+?)$/i)) {
      // Compare startups by name
      const nameMatches = lowerCaseMessage.match(/^compare startups? (.+?) (?:and|with) (.+?)$/i)
      if (nameMatches && nameMatches.length >= 3) {
        const startup1 = nameMatches[1].trim()
        const startup2 = nameMatches[2].trim()
        
        // Create a special URL for direct navigation to the comparison page by name
        targetPath = `/compare?name1=${encodeURIComponent(startup1)}&name2=${encodeURIComponent(startup2)}&type=startups&byName=true`
        targetName = `startups comparison`
        entityName = `${startup1} and ${startup2}`
      } else {
        addMessage("Please specify two startup names. For example: 'Compare startups TechNova and CloudNative'", "assistant")
        return true
      }
    } else if (lowerCaseMessage.match(/^compare founders? \d+( and|,| with)? ?\d+( and|,| with)? ?\d*$/i)) {
      // Extract founder IDs from command
      const idMatches = lowerCaseMessage.match(/\d+/g)
      if (idMatches && idMatches.length >= 2) {
        const ids = idMatches.join(',')
        targetPath = `/compare?ids=${ids}&type=founders`
        targetName = `founders comparison`
      } else {
        addMessage("Please specify at least two founder IDs. For example: 'Compare founders 1 and 2'", "assistant")
        return true
      }
    } else {
      return false
    }

    // Add navigation message depending on whether an entity name was specified
    if (entityName) {
      addMessage(`Navigating to ${targetName} for "${entityName}"...`, "assistant")
    } else {
      addMessage(`Navigating to ${targetName}...`, "assistant")
    }
    
    // Navigate after a short delay
    setTimeout(() => {
      router.push(targetPath)
    }, 500)
    
    return true
  }

  // Function to start analyzing a new startup
  const startNewStartupAnalysis = async (startupName: string) => {
    setIsLoading(true);
    
    try {
      // Get initial data for analysis form
      const response = await fetch("/api/startups/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: startupName,
          sessionId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add only navigation message
      if (data.startupData) {
        addMessage(`Navigating to startup creation form...`, "assistant");
        
        // Navigate to the form with pre-filled fields
        setTimeout(() => {
          router.push(`/startups/add?name=${encodeURIComponent(startupName)}&data=${encodeURIComponent(JSON.stringify(data.startupData))}`);
        }, 500);
      } else if (data.startupExists) {
        addMessage(`Startup already exists. Navigating to startup information...`, "assistant");
        
        setTimeout(() => {
          router.push(`/startups/${data.existingStartupId}`);
        }, 500);
      } else {
        addMessage(`Could not process startup data. Please try again.`, "assistant");
      }
    } catch (error) {
      console.error("Startup analysis error:", error);
      addMessage(
        "Sorry, an error occurred while analyzing the startup. Please try again later or check your connection.",
        "assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to convert text with startup names to clickable links
  const formatMessageWithLinks = (content: string, isAssistant: boolean) => {
    if (!isAssistant) return content;
    
    // Regular expression to find startups in the format "StartupName (score: XX)"
    const startupPattern = /([A-Za-z0-9\s]+)(\s*\(Mock\))?(\s*\(score:\s*\d+\))?/g;
    
    // Split the message into parts considering possible startup names
    const parts = content.split(startupPattern);
    
    if (parts.length <= 1) return content;
    
    return (
      <>
        {parts.map((part, index) => {
          // If this is a potential startup name (odd index in the array)
          if (index % 4 === 1 && part.trim().length > 0 && !part.includes('score:')) {
            // Clean the name from "(Mock)" if it exists
            const pureName = part.replace(/\s*\(Mock\)$/, '').trim();
            
            return (
              <span key={index}>
                <a 
                  href={`/search?q=${encodeURIComponent(pureName)}&type=startup`}
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/search?q=${encodeURIComponent(pureName)}&type=startup`);
                  }}
                >
                  {part}
                </a>
                {parts[index + 1] || ''}
                {parts[index + 2] || ''}
              </span>
            );
          } else if (index % 4 !== 0) {
            // Skip parts that are processed together with the startup name
            return null;
          }
          
          return part;
        })}
      </>
    );
  };

  // Function to format message content with proper MDX support
  const formatMessageContent = (content: string, isAssistant: boolean) => {
    if (!isAssistant) return content;
    
    // Format startup links and other special content first
    const processedContent = formatMessageWithLinks(content, true);
    
    // If already processed with JSX, return as is
    if (typeof processedContent !== 'string') {
      return processedContent;
    }
    
    // Otherwise, return content (will be processed by MarkdownMessage)
    return content;
  };

  // Function to format timestamp
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

  // Function to directly navigate to startup comparison page
  function compareStartups(startup1: string, startup2: string) {
    // Add message to chat
    addMessage(`Navigating to comparison of startups "${startup1}" and "${startup2}"...`, "assistant");
    
    // The most radical way - open a new page with a redirect
    const redirectUrl = `/command?type=compare_startups&name1=${encodeURIComponent(startup1)}&name2=${encodeURIComponent(startup2)}`;
    
    // Open a new page with the API route that will perform the redirect
    window.open(redirectUrl, '_self');
  }

  // Function to analyze a startup using Context7
  const analyzeStartupWithContext7 = async (startupName: string) => {
    setIsLoading(true);
    
    try {
      // Perform a request for startup analysis using Context7
      const response = await fetch("/api/startups/context7-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: startupName,
          sessionId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add message about analysis results
      addMessage(`Analysis of startup "${startupName}" using Context7 completed.`, "assistant");
      
      // Add analysis results to chat
      addMessage(data.analysisResults, "assistant");
    } catch (error) {
      console.error("Context7 analysis error:", error);
      addMessage(
        "Sorry, an error occurred while analyzing the startup with Context7. Please try again later or check your connection.",
        "assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function for financial analysis of a startup using Context7
  const analyzeStartupFinancials = async (startupName: string) => {
    setIsLoading(true);
    
    try {
      // Perform a request for financial analysis of a startup using Context7
      const response = await fetch("/api/startups/context7-financials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: startupName,
          sessionId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add message about analysis results
      addMessage(`Financial analysis of startup "${startupName}" using Context7 completed.`, "assistant");
      
      // Add analysis results to chat
      addMessage(data.financialAnalysisResults, "assistant");
    } catch (error) {
      console.error("Context7 financial analysis error:", error);
      addMessage(
        "Sorry, an error occurred while analyzing the startup's financials with Context7. Please try again later or check your connection.",
        "assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function for market analysis of a startup using Context7
  const analyzeStartupMarket = async (startupName: string) => {
    setIsLoading(true);
    
    try {
      // Perform a request for market analysis of a startup using Context7
      const response = await fetch("/api/startups/context7-market", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: startupName,
          sessionId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add message about analysis results
      addMessage(`Market analysis of startup "${startupName}" using Context7 completed.`, "assistant");
      
      // Add analysis results to chat
      addMessage(data.marketAnalysisResults, "assistant");
    } catch (error) {
      console.error("Context7 market analysis error:", error);
      addMessage(
        "Sorry, an error occurred while analyzing the startup's market with Context7. Please try again later or check your connection.",
        "assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function for technical analysis of a startup using Context7
  const analyzeStartupTech = async (startupName: string) => {
    setIsLoading(true);
    
    try {
      // Perform a request for technical analysis of a startup using Context7
      const response = await fetch("/api/startups/context7-tech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: startupName,
          sessionId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add message about analysis results
      addMessage(`Technical analysis of startup "${startupName}" using Context7 completed.`, "assistant");
      
      // Add analysis results to chat
      addMessage(data.techAnalysisResults, "assistant");
    } catch (error) {
      console.error("Context7 tech analysis error:", error);
      addMessage(
        "Sorry, an error occurred while analyzing the startup's tech with Context7. Please try again later or check your connection.",
        "assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-[calc(100vh-10rem)] px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pt-4">
            {messages.map((message, idx) => (
              <div
                key={message.id}
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
                  <div className="whitespace-pre-wrap">
                    {message.role === "assistant" 
                      ? (typeof formatMessageWithLinks(message.content, true) !== 'string'
                          ? formatMessageWithLinks(message.content, true)
                          : <MarkdownMessage content={message.content} />)
                      : message.content}
                  </div>
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

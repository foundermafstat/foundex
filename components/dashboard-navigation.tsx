"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Search, BarChart, Database, MessageSquarePlus, List, MessageCircle, PlusCircle, ArrowRightLeft } from "lucide-react"
import { useChatStore } from "@/lib/store/chat-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardNavigation() {
  const { setInputText } = useChatStore();

  const handleCommandClick = (command: string) => {
    setInputText(command);
    const chatInput = document.querySelector('input[placeholder="Type your message..."]');
    if (chatInput) {
      (chatInput as HTMLElement).focus();
      chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Commands by category
  const commands = {
    list: [
      {
        primary: "Show me all startups",
        description: "Get a list of all startups",
        alternatives: ["List startups", "View all startups", "Display startups"]
      },
      {
        primary: "Show me all founders",
        description: "Get a list of all startup founders",
        alternatives: ["List founders", "View all founders", "Display founders"]
      }
    ],
    search: [
      {
        primary: "Analyze TechNova",
        description: "Find information about a specific startup",
        alternatives: ["Search for TechNova", "Find TechNova"]
      },
      {
        primary: "Assess Sarah Chen",
        description: "Find information about a specific founder",
        alternatives: ["Search for Sarah Chen", "Find Sarah Chen"]
      }
    ],
    add: [

    ],
    compare: [
      {
        primary: "Compare startups 80 and 78",
        description: "Compare multiple startups by ID",
        alternatives: ["Compare startups 80, 78", "Compare startups 80, 78, 77"]
      }
    ],
    analysis: [
      {
        primary: "Financial analysis TechNova",
        description: "Financial analysis of a startup using Context7",
        alternatives: ["Financials for TechNova"]
      },
      {
        primary: "Market analysis TechNova",
        description: "Market analysis of a startup using Context7",
        alternatives: ["Market for TechNova"]
      },
      {
        primary: "Tech analysis TechNova",
        description: "Technical stack analysis of a startup using Context7",
        alternatives: ["Technology for TechNova"]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/startups">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Startups</CardTitle>
              </div>
              <CardDescription>Browse and analyze startup companies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                View detailed information about startups, including funding, industry, social metrics, and AI-powered
                success assessments.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/founders">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Founders</CardTitle>
              </div>
              <CardDescription>Explore founder profiles and backgrounds</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Discover information about startup founders, including their experience, social presence, and
                connections.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/search">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <CardTitle>Search</CardTitle>
              </div>
              <CardDescription>Find specific startups or founders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Search for startups or founders by name, industry, or other criteria to quickly find the information you
                need.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/api/seed" prefetch={false}>
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Seed Database</CardTitle>
              </div>
              <CardDescription>Initialize or reset the database</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Populate the database with sample startups, founders, and metrics data for demonstration purposes.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle>Using the AI Assistant</CardTitle>
          </div>
          <CardDescription>
            The assistant can help you navigate data and analyze startups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="add">Add</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="analysis">Context7 Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {Object.values(commands).flat().map((cmd, index) => (
                  <div key={`all-${index}`} className="border-b pb-3 last:border-b-0">
                    <button 
                      type="button"
                      className="text-left text-blue-600 hover:underline cursor-pointer font-medium w-full text-base"
                      onClick={() => handleCommandClick(cmd.primary)}
                    >
                      {cmd.primary}
                    </button>
                    <p className="text-sm text-muted-foreground mt-1">{cmd.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Also works with: {cmd.alternatives.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <div className="space-y-4">
                {commands.list.map((cmd, index) => (
                  <div key={`list-${index}`} className="border-b pb-3 last:border-b-0">
                    <button 
                      type="button"
                      className="text-left text-blue-600 hover:underline cursor-pointer font-medium w-full text-base"
                      onClick={() => handleCommandClick(cmd.primary)}
                    >
                      {cmd.primary}
                    </button>
                    <p className="text-sm text-muted-foreground mt-1">{cmd.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Also works with: {cmd.alternatives.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="search" className="mt-0">
              <div className="space-y-4">
                {commands.search.map((cmd, index) => (
                  <div key={`search-${index}`} className="border-b pb-3 last:border-b-0">
                    <button 
                      type="button"
                      className="text-left text-blue-600 hover:underline cursor-pointer font-medium w-full text-base"
                      onClick={() => handleCommandClick(cmd.primary)}
                    >
                      {cmd.primary}
                    </button>
                    <p className="text-sm text-muted-foreground mt-1">{cmd.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Also works with: {cmd.alternatives.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="add" className="mt-0">
              <div className="space-y-4">
                {commands.add.map((cmd, index) => (
                  <div key={`add-${index}`} className="border-b pb-3 last:border-b-0">
                    <button 
                      type="button"
                      className="text-left text-blue-600 hover:underline cursor-pointer font-medium w-full text-base"
                      onClick={() => handleCommandClick(cmd.primary)}
                    >
                      {cmd.primary}
                    </button>
                    <p className="text-sm text-muted-foreground mt-1">{cmd.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Also works with: {cmd.alternatives.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="compare" className="mt-0">
              <div className="space-y-4">
                {commands.compare.map((cmd, index) => (
                  <div key={`compare-${index}`} className="border-b pb-3 last:border-b-0">
                    <button 
                      type="button"
                      className="text-left text-blue-600 hover:underline cursor-pointer font-medium w-full text-base"
                      onClick={() => handleCommandClick(cmd.primary)}
                    >
                      {cmd.primary}
                    </button>
                    <p className="text-sm text-muted-foreground mt-1">{cmd.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Also works with: {cmd.alternatives.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-0">
              <div className="space-y-4">
                {commands.analysis.map((cmd, index) => (
                  <div key={`analysis-${index}`} className="border-b pb-3 last:border-b-0">
                    <button 
                      type="button"
                      className="text-left text-blue-600 hover:underline cursor-pointer font-medium w-full text-base"
                      onClick={() => handleCommandClick(cmd.primary)}
                    >
                      {cmd.primary}
                    </button>
                    <p className="text-sm text-muted-foreground mt-1">{cmd.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Also works with: {cmd.alternatives.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

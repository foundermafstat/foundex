"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Plus, Trash2, Search } from "lucide-react"
import { Startup } from "@/lib/db"

// Founder data model
type Founder = {
  id: number
  name: string
  role: string
  startup_id: number
}

export default function CompareInterface() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("startups")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStartups, setSelectedStartups] = useState<number[]>([])
  const [selectedFounders, setSelectedFounders] = useState<number[]>([])
  const [startups, setStartups] = useState<Startup[]>([])
  const [founders, setFounders] = useState<Founder[]>([])
  const [loading, setLoading] = useState(true)
  
  // Fetch data from the database
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch startups from the API
        const startupsResponse = await fetch('/api/startups')
        if (!startupsResponse.ok) {
          console.error("Failed to fetch startups:", startupsResponse.statusText)
          setLoading(false)
          return
        }
        
        const startupsData = await startupsResponse.json()
        // API возвращает массив стартапов напрямую, а не в свойстве 'startups'
        setStartups(Array.isArray(startupsData) ? startupsData : [])
        
        // Fetch founders data
        // You can implement this as needed if founders comparison is used
        setFounders([])
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Filter startups and founders based on search term
  const filteredStartups = startups.filter(startup => 
    startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (startup.industry && startup.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  const filteredFounders = founders.filter(founder => 
    founder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    founder.role.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Functions to manage selected items
  const addSelection = (type: "startups" | "founders", id: number) => {
    if (type === "startups") {
      if (!selectedStartups.includes(id)) {
        setSelectedStartups([...selectedStartups, id])
      }
    } else {
      if (!selectedFounders.includes(id)) {
        setSelectedFounders([...selectedFounders, id])
      }
    }
  }
  
  const removeSelection = (type: "startups" | "founders", id: number) => {
    if (type === "startups") {
      setSelectedStartups(selectedStartups.filter(itemId => itemId !== id))
    } else {
      setSelectedFounders(selectedFounders.filter(itemId => itemId !== id))
    }
  }
  
  // Handle navigation to comparison page
  const handleCompare = () => {
    const type = activeTab
    const ids = activeTab === "startups" ? selectedStartups : selectedFounders
    
    if (ids.length < 2) {
      alert("Please select at least two items to compare")
      return
    }
    
    router.push(`/compare?ids=${ids.join(',')}&type=${type}`)
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Comparison</CardTitle>
        <CardDescription>Select startups or founders to compare</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="startups" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="startups">Startups</TabsTrigger>
            <TabsTrigger value="founders">Founders</TabsTrigger>
          </TabsList>
          
          <div className="my-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="startups" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 p-3 text-center text-muted-foreground">
                  Loading startups data...
                </div>
              ) : selectedStartups.length === 0 ? (
                <div className="col-span-2 p-3 text-center text-muted-foreground">
                  Select startups to compare
                </div>
              ) : (
                selectedStartups.map((id) => {
                  const startup = startups.find(s => s.id === id)
                  if (!startup) return null
                  
                  return (
                    <div key={`selected-startup-${id}`} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="font-medium">{startup.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {startup.industry || "Unknown industry"}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeSelection("startups", id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })
              )}
              
              {!loading && selectedStartups.length < 5 && (
                <div className="p-3 border rounded-md border-dashed flex items-center justify-between">
                  <div className="w-full">
                    <Select 
                      onValueChange={(value) => addSelection("startups", Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add startup..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStartups.length === 0 ? (
                          <div className="p-2 text-center text-muted-foreground">
                            No startups found
                          </div>
                        ) : filteredStartups
                          .filter(s => !selectedStartups.includes(s.id))
                          .map(startup => (
                            <SelectItem key={`option-startup-${startup.id}`} value={startup.id.toString()}>
                              {startup.name} {startup.industry ? `(${startup.industry})` : ''}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="founders" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 p-3 text-center text-muted-foreground">
                  Loading founders data...
                </div>
              ) : founders.length === 0 ? (
                <div className="col-span-2 p-3 text-center text-muted-foreground">
                  Founders comparison is not available yet
                </div>
              ) : selectedFounders.length === 0 ? (
                <div className="col-span-2 p-3 text-center text-muted-foreground">
                  Select founders to compare
                </div>
              ) : (
                selectedFounders.map((id) => {
                  const founder = founders.find(f => f.id === id)
                  if (!founder) return null
                  
                  // Find the startup this founder belongs to
                  const startup = startups.find(s => s.id === founder.startup_id)
                  
                  return (
                    <div key={`selected-founder-${id}`} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="font-medium">{founder.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {founder.role}, {startup?.name || "Unknown startup"}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeSelection("founders", id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })
              )}
              
              {!loading && founders.length > 0 && selectedFounders.length < 5 && (
                <div className="p-3 border rounded-md border-dashed flex items-center justify-between">
                  <div className="w-full">
                    <Select 
                      onValueChange={(value) => addSelection("founders", Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add founder..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredFounders.length === 0 ? (
                          <div className="p-2 text-center text-muted-foreground">
                            No founders found
                          </div>
                        ) : filteredFounders
                          .filter(f => !selectedFounders.includes(f.id))
                          .map(founder => {
                            const startup = startups.find(s => s.id === founder.startup_id)
                            return (
                              <SelectItem key={`option-founder-${founder.id}`} value={founder.id.toString()}>
                                {founder.name} ({founder.role}, {startup?.name || "Unknown startup"})
                              </SelectItem>
                            )
                          })
                        }
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleCompare}
          disabled={(activeTab === "startups" && selectedStartups.length < 2) || 
                   (activeTab === "founders" && selectedFounders.length < 2)}
        >
          Compare <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import ResizableLayout from "@/components/resizable-layout"
import { ScrollArea } from '@/components/ui/scroll-area'

// Схема валидации для формы добавления стартапа
const startupFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must contain at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must contain at least 10 characters' }),
  industry: z.string().min(1, { message: 'Select an industry' }),
  foundedYear: z.coerce.number().min(1900, { message: 'Year must be before 1900' }).max(new Date().getFullYear(), { message: 'Year cannot be in the future' }),
  fundingAmount: z.string().optional(),
  teamSize: z.coerce.number().min(1, { message: 'Team size must be at least 1' }).optional(),
  website: z.string().url({ message: 'Enter a valid URL' }).optional().or(z.literal('')),
  location: z.string().optional(),
  founderNames: z.string().optional(),
})

type StartupFormValues = z.infer<typeof startupFormSchema>

export default function AddStartupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Получение параметров из URL
  const nameParam = searchParams.get('name')
  const dataParam = searchParams.get('data')
  
  // Парсинг данных из параметров URL
  const parsedData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : null
  
  // Настройка формы с начальными значениями
  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      name: nameParam || '',
      description: '',
      industry: '',
      foundedYear: new Date().getFullYear(),
      fundingAmount: '',
      teamSize: 1,
      website: '',
      location: '',
      founderNames: '',
    },
  })
  
  // Заполнение формы данными, если они есть
  useEffect(() => {
    if (parsedData) {
      form.reset({
        name: parsedData.name || nameParam || '',
        description: parsedData.description || '',
        industry: parsedData.industry || '',
        foundedYear: parsedData.foundedYear || new Date().getFullYear(),
        fundingAmount: parsedData.fundingAmount || '',
        teamSize: parsedData.teamSize || 1,
        website: parsedData.website || '',
        location: parsedData.location || '',
        founderNames: parsedData.founderNames || '',
      })
    }
  }, [parsedData, nameParam, form])
  
  // Обработка отправки формы
  async function onSubmit(data: StartupFormValues) {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/startups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save startup')
      }
      
      const result = await response.json()
      
      toast({
        title: 'Startup added',
        description: `"${data.name}" successfully added to the database.`,
      })
      
      // Переход на страницу деталей стартапа
      router.push(`/startups/${result.id}`)
    } catch (error) {
      console.error('Error adding startup:', error)
      toast({
        title: 'Error',
        description: 'Failed to add startup. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const industries = [
    "FinTech", "AI/ML", "HealthTech", "EdTech", "CleanTech", "Retail", 
    "E-commerce", "SaaS", "Cybersecurity", "Biotech", "Logistics", 
    "FoodTech", "Blockchain", "PropTech", "Gaming", "Другое"
  ]
  
  // Функция для возврата к чату
  const handleReturn = () => {
    router.push('/')
  }
  
  return (
    <ResizableLayout>
      <div className="container max-w-2xl py-8">
        <Button variant="outline" onClick={handleReturn} className="mb-4">
          &larr; Back to Chat
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Add New Startup</CardTitle>
            <CardDescription>
              Fill in the startup information to add it to the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-18rem)] pr-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Startup Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter startup name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter description" 
                            {...field} 
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry*</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="foundedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Founded Year*</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fundingAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Funding Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="$1M - $5M" {...field} />
                          </FormControl>
                          <FormDescription>
                            Example: $500K - $1M, $10M+, Bootstrap
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="teamSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Size</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="founderNames"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Founders</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe, Jane Smith" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter founder names separated by commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert>
                    <AlertTitle>Attention</AlertTitle>
                    <AlertDescription>
                      Fields marked with an asterisk (*) are required.
                    </AlertDescription>
                  </Alert>
                  
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Add Startup'
                    )}
                  </Button>
                </form>
              </Form>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReturn}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ResizableLayout>
  )
}

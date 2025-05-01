"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, Instagram, Facebook } from "lucide-react"
import Link from "next/link"

type FounderSocialMetric = {
  platform: string
  followers_count: number | null
  posts_count: number | null
  engagement_rate: number | null
  influence_score: number | null
  last_activity_date: string | null
}

type Founder = {
  id: number
  name: string
  email: string | null
  linkedin_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  github_url: string | null
  facebook_url: string | null
  bio: string | null
}

interface FounderMetricsProps {
  founder: Founder
  metrics: FounderSocialMetric[]
}

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github className="h-4 w-4" />
    case 'linkedin':
      return <Linkedin className="h-4 w-4" />
    case 'twitter':
      return <Twitter className="h-4 w-4" />
    case 'instagram':
      return <Instagram className="h-4 w-4" />
    case 'facebook':
      return <Facebook className="h-4 w-4" />
    default:
      return null
  }
}

function getSocialColor(platform: string) {
  switch (platform.toLowerCase()) {
    case 'github':
      return 'bg-gray-900 hover:bg-gray-800'
    case 'linkedin':
      return 'bg-blue-600 hover:bg-blue-700'
    case 'twitter':
      return 'bg-blue-400 hover:bg-blue-500'
    case 'instagram':
      return 'bg-pink-600 hover:bg-pink-700'
    case 'facebook':
      return 'bg-blue-800 hover:bg-blue-900'
    default:
      return 'bg-gray-500 hover:bg-gray-600'
  }
}

export function FounderSocialLinks({ founder }: { founder: Founder }) {
  const socialLinks = [
    { url: founder.github_url, platform: 'github' },
    { url: founder.linkedin_url, platform: 'linkedin' },
    { url: founder.twitter_url, platform: 'twitter' },
    { url: founder.instagram_url, platform: 'instagram' },
    { url: founder.facebook_url, platform: 'facebook' },
  ].filter(link => link.url)

  if (socialLinks.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {socialLinks.map((link, index) => (
        <Link 
          key={index} 
          href={link.url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Badge 
            variant="secondary" 
            className={`flex items-center gap-1 ${getSocialColor(link.platform)}`}
          >
            {getSocialIcon(link.platform)}
            <span className="text-white">{link.platform}</span>
          </Badge>
        </Link>
      ))}
    </div>
  )
}

export function FounderMetricsCard({ founder, metrics }: FounderMetricsProps) {
  // Группируем метрики по платформам
  const metricsByPlatform: Record<string, FounderSocialMetric> = {}
  
  metrics.forEach(metric => {
    // Берем только самую последнюю метрику для каждой платформы
    if (!metricsByPlatform[metric.platform] || 
        (metric.last_activity_date && metricsByPlatform[metric.platform].last_activity_date && 
         new Date(metric.last_activity_date) > new Date(metricsByPlatform[metric.platform].last_activity_date!))) {
      metricsByPlatform[metric.platform] = metric
    }
  })

  const platforms = Object.keys(metricsByPlatform)

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{founder.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{founder.bio || 'Информация отсутствует'}</p>
        <FounderSocialLinks founder={founder} />
      </CardHeader>
      <CardContent>
        {platforms.length > 0 ? (
          <Tabs defaultValue={platforms[0]} className="w-full">
            <TabsList className="w-full justify-start">
              {platforms.map(platform => (
                <TabsTrigger key={platform} value={platform} className="flex items-center gap-1">
                  {getSocialIcon(platform)} {platform}
                </TabsTrigger>
              ))}
            </TabsList>
            {platforms.map(platform => {
              const metric = metricsByPlatform[platform]
              return (
                <TabsContent key={platform} value={platform} className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Подписчики</p>
                      <p className="text-2xl font-bold">{metric.followers_count?.toLocaleString() || '—'}</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Публикации</p>
                      <p className="text-2xl font-bold">{metric.posts_count?.toLocaleString() || '—'}</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Вовлеченность</p>
                      <p className="text-2xl font-bold">{metric.engagement_rate ? `${metric.engagement_rate}%` : '—'}</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Влияние</p>
                      <p className="text-2xl font-bold">{metric.influence_score || '—'}</p>
                    </div>
                  </div>
                  {metric.last_activity_date && (
                    <p className="text-xs text-muted-foreground">
                      Последняя активность: {new Date(metric.last_activity_date).toLocaleDateString()}
                    </p>
                  )}
                </TabsContent>
              )
            })}
          </Tabs>
        ) : (
          <p className="text-muted-foreground">Нет данных о социальных метриках</p>
        )}
      </CardContent>
    </Card>
  )
}

interface FoundersMetricsProps {
  founders: Founder[]
  founderSocialMetrics: Array<{
    founderId: number
    founderName: string
    metrics: FounderSocialMetric[]
  }>
}

export function FoundersMetrics({ founders, founderSocialMetrics }: FoundersMetricsProps) {
  if (!founders || founders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Founders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No founders found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Founders and their social metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {founders.map(founder => {
          const founderMetrics = founderSocialMetrics.find(fm => fm.founderId === founder.id)
          return (
            <FounderMetricsCard 
              key={founder.id} 
              founder={founder} 
              metrics={founderMetrics?.metrics || []} 
            />
          )
        })}
      </CardContent>
    </Card>
  )
}

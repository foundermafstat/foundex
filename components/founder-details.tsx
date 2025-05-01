"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Founder, type Startup, type SocialMetric } from "@/lib/db"
import Link from "next/link"
import { ExternalLink, Briefcase, Mail } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import DatabaseError from "@/components/database-error"
import { Skeleton } from "@/components/ui/skeleton"

export default function FounderDetails({ id }: { id: number }) {
  const [founder, setFounder] = useState<Founder | null>(null)
  const [startup, setStartup] = useState<Startup | null>(null)
  const [socialMetrics, setSocialMetrics] = useState<SocialMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(false)
        
        // Получаем данные через API
        const response = await fetch(`/api/founders/${id}`)
        
        if (response.status === 404) {
          setNotFound(true)
          setLoading(false)
          return
        }
        
        if (!response.ok) {
          throw new Error('Ошибка при получении данных')
        }
        
        const data = await response.json()
        
        setFounder(data.founder)
        setStartup(data.startup)
        setSocialMetrics(data.socialMetrics || [])
        
      } catch (err) {
        console.error('Ошибка загрузки данных об основателе:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return <FounderDetailsSkeleton />
  }

  if (error) {
    return <DatabaseError />
  }

  if (notFound || !founder) {
    return <div>Founder not found</div>
  }

  // Group metrics by platform
  const metricsByPlatform: Record<string, SocialMetric[]> = {}
  socialMetrics.forEach((metric) => {
    if (!metricsByPlatform[metric.platform]) {
      metricsByPlatform[metric.platform] = []
    }
    metricsByPlatform[metric.platform].push(metric)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{founder.name}</h1>
        {startup && (
          <Link
            href={`/startups/${startup.id}`}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
          >
            <Briefcase className="h-4 w-4" /> {startup.name}
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {founder.email && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href={`mailto:${founder.email}`} className="text-blue-600 hover:text-blue-800">
                    {founder.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{founder.bio || "No bio available"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {founder.linkedin_url && (
              <a
                href={founder.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                LinkedIn <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {founder.twitter_url && (
              <a
                href={founder.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                Twitter <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {founder.instagram_url && (
              <a
                href={founder.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                Instagram <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {Object.keys(metricsByPlatform).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Social Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(metricsByPlatform).map(([platform, metrics]) => {
                // Get the most recent metric
                const latestMetric = metrics[0]
                return (
                  <div key={platform} className="space-y-2">
                    <h3 className="font-medium">{platform}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Followers</p>
                        <p className="font-medium">{latestMetric.followers_count?.toLocaleString() || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Engagement Rate</p>
                        <p className="font-medium">
                          {latestMetric.engagement_rate ? `${latestMetric.engagement_rate}%` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Post Frequency</p>
                        <p className="font-medium">
                          {latestMetric.post_frequency ? `${latestMetric.post_frequency}/week` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sentiment Score</p>
                        <p className="font-medium">{latestMetric.sentiment_score || "N/A"}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last updated {formatDistanceToNow(new Date(latestMetric.collected_at))} ago
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function FounderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-48 mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-1" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

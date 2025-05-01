"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Startup, type Founder, type SocialMetric, type AssessmentResult } from "@/lib/db"
import Link from "next/link"
import { ExternalLink, Calendar, DollarSign, TrendingUp, TrendingDown, Users, Mail, Globe, Github, Linkedin, Twitter, Instagram, Facebook } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import DatabaseError from "@/components/database-error"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import components for displaying metrics
import { FinancialMetricChart, MetricsHistoryChart, SocialMetricsChart, FounderSocialMetricsChart } from "@/components/metrics/startup-metrics-chart"
import { SocialMetricsTimeline } from "@/components/metrics/social-metrics-timeline"
import { FinancialMetricsDisplay } from "@/components/metrics/financial-metrics-display"
import { FoundersMetrics } from "@/components/metrics/founder-metrics"
import { FinancialMetricsCard, MetricsHistoryCard } from "@/components/metrics/financial-metrics"
import { StartupAssessment } from "@/components/metrics/startup-assessment"
import { DetailedMetricsPanel } from "@/components/metrics/detailed-metrics"
import { TechnicalMetricsPanel } from "@/components/metrics/technical-metrics"

export default function StartupDetails({ id }: { id: number }) {
  const [startup, setStartup] = useState<Startup | null>(null)
  const [founders, setFounders] = useState<Founder[]>([])
  const [socialMetrics, setSocialMetrics] = useState<SocialMetric[]>([])
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [notFound, setNotFound] = useState(false)
  
  // Add states for new data types
  const [financialMetrics, setFinancialMetrics] = useState<any[]>([])
  const [metricsHistory, setMetricsHistory] = useState<any[]>([])
  const [coinbaseData, setCoinbaseData] = useState<any | null>(null)
  const [startupSocialMetrics, setStartupSocialMetrics] = useState<any[]>([])
  const [founderSocialMetrics, setFounderSocialMetrics] = useState<any[]>([])
  
  // Calculated scores based on metrics
  const [founderMetricsScore, setFounderMetricsScore] = useState<number | undefined>(undefined)
  const [startupMetricsScore, setStartupMetricsScore] = useState<number | undefined>(undefined)
  const [financialMetricsScore, setFinancialMetricsScore] = useState<number | undefined>(undefined)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(false)
        
        // Retrieve data via API
        const response = await fetch(`/api/startups/${id}`)
        
        if (response.status === 404) {
          setNotFound(true)
          setLoading(false)
          return
        }
        
        if (!response.ok) {
          throw new Error('Error retrieving data')
        }
        
        const data = await response.json()
        
        // Set received data
        setStartup(data.startup)
        setFounders(data.founders || [])
        setSocialMetrics(data.socialMetrics || [])
        setAssessment(data.assessment)
        
        // Set new data types
        setFinancialMetrics(data.financialMetrics || [])
        setMetricsHistory(data.metricsHistory || [])
        setCoinbaseData(data.coinbaseData)
        setStartupSocialMetrics(data.startupSocialMetrics || [])
        setFounderSocialMetrics(data.founderSocialMetrics || [])
        
        // Calculate scores based on metrics
        calculateScores(
          data.founderSocialMetrics || [], 
          data.startupSocialMetrics || [], 
          data.financialMetrics || []
        )
        
      } catch (err) {
        console.error('Error loading startup data:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])
  
  // Function to calculate scores based on metrics
  function calculateScores(
    founderMetrics: any[], 
    startupMetrics: any[], 
    financialMetrics: any[]
  ) {
    let founderScore = 0;
    let socialScore = 0;
    let financialScore = 0;
    
    let hasFounderData = false;
    let hasSocialData = false;
    let hasFinancialData = false;
    
    // 1. Calculate founder score (30% of overall score)
    if (founderMetrics && founderMetrics.length > 0) {
      let totalInfluence = 0;
      let totalEngagement = 0;
      let totalReach = 0;
      let totalFounders = 0;
      
      founderMetrics.forEach(fm => {
        if (fm.metrics && fm.metrics.length > 0) {
          // Consider all platforms for each founder
          fm.metrics.forEach((m: any) => {
            // Influence indicator (weight 50%)
            if (m.influence_score !== null && m.influence_score !== undefined) {
              totalInfluence += parseFloat(m.influence_score);
            }
            
            // Audience engagement indicator (weight 30%)
            if (m.engagement_rate !== null && m.engagement_rate !== undefined) {
              totalEngagement += parseFloat(m.engagement_rate);
            }
            
            // Audience reach indicator (weight 20%)
            if (m.followers_count !== null && m.followers_count !== undefined) {
              // Normalize followers count (logarithmic scale)
              totalReach += Math.log10(Math.max(m.followers_count, 1)) / 6 * 100; // 1M followers = 100 points
            }
          });
          
          totalFounders++;
        }
      });
      
      if (totalFounders > 0) {
        // Combine indicators with their weights
        const avgInfluence = totalInfluence / (totalFounders * founderMetrics[0]?.metrics?.length || 1);
        const avgEngagement = totalEngagement / (totalFounders * founderMetrics[0]?.metrics?.length || 1);
        const avgReach = totalReach / (totalFounders * founderMetrics[0]?.metrics?.length || 1);
        
        founderScore = (avgInfluence * 0.5) + (avgEngagement * 0.3) + (avgReach * 0.2);
        hasFounderData = true;
        
        // Set score for display
        setFounderMetricsScore(founderScore);
      }
    }
    
    // 2. Calculate social metrics score for startup (30% of overall score)
    if (startupMetrics && startupMetrics.length > 0) {
      let totalSentiment = 0;
      let totalEngagement = 0;
      let totalFrequency = 0;
      let totalFollowers = 0;
      let metricsCount = 0;
      
      // Use only the latest data for each platform
      const platforms = new Set(startupMetrics.map(m => m.platform));
      const latestMetrics: any[] = [];
      
      platforms.forEach(platform => {
        const platformMetrics = startupMetrics.filter(m => m.platform === platform);
        if (platformMetrics.length > 0) {
          // Sort by date and take the latest record
          const latest = platformMetrics.sort((a, b) => 
            new Date(b.collected_at).getTime() - new Date(a.collected_at).getTime()
          )[0];
          latestMetrics.push(latest);
        }
      });
      
      latestMetrics.forEach(metric => {
        // Sentiment indicator (weight 40%)
        if (metric.sentiment_score !== null && metric.sentiment_score !== undefined) {
          totalSentiment += parseFloat(metric.sentiment_score) * 10; // Scale 0-10 --> 0-100
        }
        
        // Engagement indicator (weight 30%)
        if (metric.engagement_rate !== null && metric.engagement_rate !== undefined) {
          totalEngagement += parseFloat(metric.engagement_rate) * 10; // Assume 10% = 100 points
        }
        
        // Post frequency (weight 10%)
        if (metric.post_frequency !== null && metric.post_frequency !== undefined) {
          totalFrequency += Math.min(parseFloat(metric.post_frequency) * 10, 100); // Assume 10 posts/day = 100 points
        }
        
        // Followers count (weight 20%)
        if (metric.followers_count !== null && metric.followers_count !== undefined) {
          // Normalize followers count (logarithmic scale)
          totalFollowers += Math.log10(Math.max(metric.followers_count, 1)) / 6 * 100; // 1M followers = 100 points
        }
        
        metricsCount++;
      });
      
      if (metricsCount > 0) {
        // Combine indicators with their weights
        const avgSentiment = totalSentiment / metricsCount;
        const avgEngagement = totalEngagement / metricsCount;
        const avgFrequency = totalFrequency / metricsCount;
        const avgFollowers = totalFollowers / metricsCount;
        
        socialScore = (avgSentiment * 0.4) + (avgEngagement * 0.3) + (avgFrequency * 0.1) + (avgFollowers * 0.2);
        hasSocialData = true;
        
        // Set score for display
        setStartupMetricsScore(socialScore);
      }
    }
    
    // 3. Calculate financial score (40% of overall score)
    if (financialMetrics && financialMetrics.length > 0) {
      // Get the latest financial metrics
      const latestMetric = [...financialMetrics].sort((a, b) => 
        new Date(b.metric_date).getTime() - new Date(a.metric_date).getTime()
      )[0];
      
      // Initialize variables for each indicator
      let revenueScore = 0; // Revenue (weight 20%)
      let growthScore = 0;  // Year-over-year growth (weight 25%)
      let runwayScore = 0;  // Runway (weight 20%)
      let ltvcacScore = 0;  // LTV to CAC ratio (weight 20%)
      let mrrScore = 0;     // Monthly recurring revenue (weight 15%)
      
      let calculatedFactors = 0;
      
      // Revenue (exponential scale: $10M+ = 100 points)
      if (latestMetric.revenue !== null && latestMetric.revenue !== undefined && latestMetric.revenue > 0) {
        revenueScore = Math.min((Math.log10(latestMetric.revenue) / 7) * 100, 100);
        calculatedFactors++;
      }
      
      // Year-over-year growth (linear scale: 100%+ growth = 100 points)
      if (latestMetric.year_over_year_growth !== null && latestMetric.year_over_year_growth !== undefined) {
        growthScore = Math.min(latestMetric.year_over_year_growth, 100);
        calculatedFactors++;
      }
      
      // Runway (linear scale: 18+ months = 100 points)
      if (latestMetric.runway_months !== null && latestMetric.runway_months !== undefined) {
        runwayScore = Math.min(latestMetric.runway_months * 5.5, 100);
        calculatedFactors++;
      }
      
      // LTV to CAC ratio (exponential scale: 3+ = 100 points)
      if (latestMetric.lifetime_value !== null && latestMetric.lifetime_value !== undefined &&
          latestMetric.customer_acquisition_cost !== null && latestMetric.customer_acquisition_cost !== undefined &&
          latestMetric.customer_acquisition_cost > 0) {
        const ltvCacRatio = latestMetric.lifetime_value / latestMetric.customer_acquisition_cost;
        ltvcacScore = Math.min(ltvCacRatio * 33.3, 100);
        calculatedFactors++;
      }
      
      // Monthly recurring revenue (exponential scale: $1M+ = 100 points)
      if (latestMetric.monthly_recurring_revenue !== null && latestMetric.monthly_recurring_revenue !== undefined && latestMetric.monthly_recurring_revenue > 0) {
        mrrScore = Math.min((Math.log10(latestMetric.monthly_recurring_revenue) / 6) * 100, 100);
        calculatedFactors++;
      }
      
      if (calculatedFactors > 0) {
        // Weight scores by financial indicators
        financialScore = (
          (revenueScore * 0.2) +
          (growthScore * 0.25) +
          (runwayScore * 0.2) +
          (ltvcacScore * 0.2) +
          (mrrScore * 0.15)
        ) * (calculatedFactors / 5); // Normalize by the number of available indicators
        
        hasFinancialData = true;
        
        // Set score for display
        setFinancialMetricsScore(financialScore);
      }
    }
    
    // 4. Calculate overall score with category weights
    // Social and financial indicators have priority when data is missing
    let totalWeight = 0;
    let weightedScore = 0;
    
    if (hasFounderData) {
      weightedScore += founderScore * 0.3; // 30% weight
      totalWeight += 0.3;
    }
    
    if (hasSocialData) {
      weightedScore += socialScore * 0.3; // 30% weight
      totalWeight += 0.3;
    }
    
    if (hasFinancialData) {
      weightedScore += financialScore * 0.4; // 40% weight
      totalWeight += 0.4;
    }
    
    // If there is at least one category of data
    if (totalWeight > 0) {
      // Normalize by available data
      const overallScore = weightedScore / totalWeight;
      
      // If we have an assessment, update its score
      if (assessment) {
        assessment.overall_score = overallScore;
      }
    }
  }

  if (loading) {
    return <StartupDetailsSkeleton />
  }

  if (error) {
    return <DatabaseError />
  }

  if (notFound || !startup) {
    return <div>Startup not found</div>
  }

  // Check for data availability for charts
  const hasFinancialMetrics = financialMetrics && financialMetrics.length > 0
  const hasMetricsHistory = metricsHistory && metricsHistory.length > 0
  const hasStartupSocialMetrics = startupSocialMetrics && startupSocialMetrics.length > 0
  const hasFounderSocialMetrics = founderSocialMetrics && founderSocialMetrics.some(fm => fm.metrics && fm.metrics.length > 0)

  // Get startup social links
  const socialLinks = [
    { url: startup.github_url, icon: <Github className="h-4 w-4" />, name: 'GitHub' },
    { url: startup.linkedin_url, icon: <Linkedin className="h-4 w-4" />, name: 'LinkedIn' },
    { url: startup.twitter_url, icon: <Twitter className="h-4 w-4" />, name: 'Twitter' },
    { url: startup.instagram_url, icon: <Instagram className="h-4 w-4" />, name: 'Instagram' },
    { url: startup.facebook_url, icon: <Facebook className="h-4 w-4" />, name: 'Facebook' },
  ].filter(link => link.url)

  return (
    <div className="space-y-6 pb-10">
      {/* Header and main information */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{startup.name}</h1>
          <p className="text-muted-foreground">{startup.category || "Technology Startup"}</p>
        </div>
        <Badge variant="outline" className="text-base py-1.5 px-4">
          {startup.funding_stage || "No data"}
        </Badge>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium leading-none">Total Investment</p>
                <p className="text-xl font-bold">${startup.total_funding?.toLocaleString() || "No data"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium leading-none">Founded</p>
                <p className="text-xl font-bold">
                  {startup.founding_date 
                    ? new Date(startup.founding_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "No data"}
                </p>
                {startup.founding_date && (
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(startup.founding_date), { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium leading-none">Employees</p>
                <p className="text-xl font-bold">{startup.employee_count?.toLocaleString() || "No data"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{startup.description || "No description available"}</p>
          
          {startup.website && (
            <div className="flex items-center gap-1 mt-4">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <Link 
                href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`} 
                target="_blank" 
                className="text-sm text-blue-500 hover:underline"
              >
                {startup.website}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for organizing content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="technical">Technical Profile</TabsTrigger>
          <TabsTrigger value="founders">Founders</TabsTrigger>
          <TabsTrigger value="fulldata">Full Data</TabsTrigger>
        </TabsList>
        
        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Main financial metrics */}
          <FinancialMetricsDisplay financialMetrics={financialMetrics} />
          
          {/* Social links */}
          {(startup.github_url || startup.linkedin_url || startup.twitter_url || 
            startup.instagram_url || startup.facebook_url) && (
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {startup.github_url && (
                    <Link href={startup.github_url} target="_blank" className="text-blue-500 hover:underline">
                      <Github className="h-4 w-4 inline-block mr-1" /> GitHub
                    </Link>
                  )}
                  {startup.linkedin_url && (
                    <Link href={startup.linkedin_url} target="_blank" className="text-blue-500 hover:underline">
                      <Linkedin className="h-4 w-4 inline-block mr-1" /> LinkedIn
                    </Link>
                  )}
                  {startup.twitter_url && (
                    <Link href={startup.twitter_url} target="_blank" className="text-blue-500 hover:underline">
                      <Twitter className="h-4 w-4 inline-block mr-1" /> Twitter
                    </Link>
                  )}
                  {startup.instagram_url && (
                    <Link href={startup.instagram_url} target="_blank" className="text-blue-500 hover:underline">
                      <Instagram className="h-4 w-4 inline-block mr-1" /> Instagram
                    </Link>
                  )}
                  {startup.facebook_url && (
                    <Link href={startup.facebook_url} target="_blank" className="text-blue-500 hover:underline">
                      <Facebook className="h-4 w-4 inline-block mr-1" /> Facebook
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Chart block - display only if there is data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Social metrics */}
            {socialMetrics && socialMetrics.length > 0 && (
              <SocialMetricsChart 
                platformData={
                  Array.from(new Set(socialMetrics.map(m => m.platform)))
                    .map(platform => {
                      const latest = socialMetrics
                        .filter(m => m.platform === platform)
                        .sort((a, b) => new Date(b.collected_at).getTime() - new Date(a.collected_at).getTime())[0]
                      return {
                        platform,
                        followers_count: latest?.followers_count || 0,
                        engagement_rate: parseFloat(latest?.engagement_rate || "0"),
                        post_frequency: parseFloat(latest?.post_frequency || "0"),
                        sentiment_score: parseFloat(latest?.sentiment_score || "0")
                      }
                    })
                }
                metric="followers_count"
                title="Social Media Followers"
              />
            )}

            {/* Historical metrics */}
            {hasMetricsHistory && (
              <MetricsHistoryChart 
                data={metricsHistory}
                metricName="overall_score"
                title="Overall Score History"
              />
            )}

            {/* Financial metrics */}
            {hasFinancialMetrics && (
              <FinancialMetricChart 
                data={financialMetrics}
                metricType="revenue"
                title="Revenue"
              />
            )}

            {/* Custom metrics */}
            {hasFinancialMetrics && financialMetrics.some(m => m.active_users) && (
              <FinancialMetricChart 
                data={financialMetrics}
                metricType="active_users"
                title="Active Users"
                color="rgb(255, 159, 64)"
              />
            )}
          </div>

          {/* Founders' metrics */}
          {hasFounderSocialMetrics && (
            <div className="mt-6">
              <FounderSocialMetricsChart 
                founderMetrics={founderSocialMetrics} 
                title="Founders Social Metrics"
              />
            </div>
          )}
          
          {/* Historical metrics chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricsHistoryChart 
              data={metricsHistory} 
              metricName="active_users" 
              title="Active Users" 
              color="rgb(54, 162, 235)" 
            />
            <MetricsHistoryChart 
              data={metricsHistory} 
              metricName="mrr" 
              title="MRR (Monthly Recurring Revenue)" 
              color="rgb(75, 192, 192)" 
            />
          </div>
          
          {/* Coinbase data, if available */}
          {coinbaseData && (
            <Card>
              <CardHeader>
                <CardTitle>Coinbase Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Token</p>
                    <p className="text-xl font-bold">{coinbaseData.token_symbol}</p>
                    <p className="text-xs text-muted-foreground">{coinbaseData.token_name}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-xl font-bold">${coinbaseData.current_price?.toFixed(2) || '—'}</p>
                    <p className="text-xs text-muted-foreground">
                      {coinbaseData.price_change_24h ? (
                        <span className={coinbaseData.price_change_24h > 0 ? "text-green-500" : "text-red-500"}>
                          {coinbaseData.price_change_24h > 0 ? '+' : ''}
                          {coinbaseData.price_change_24h}% (24h)
                        </span>
                      ) : '—'}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Market Capitalization</p>
                    <p className="text-xl font-bold">${coinbaseData.market_cap?.toLocaleString() || '—'}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Volume (24h)</p>
                    <p className="text-xl font-bold">${coinbaseData.volume_24h?.toLocaleString() || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Overall assessment */}
          <StartupAssessment 
            assessment={assessment}
            founderMetricsScore={founderMetricsScore}
            startupMetricsScore={startupMetricsScore}
            financialMetricsScore={financialMetricsScore}
          />
        </TabsContent>
        
        {/* Detailed metrics tab */}
        <TabsContent value="detailed">
          <DetailedMetricsPanel
            financialMetrics={financialMetrics || []}
            metricsHistory={metricsHistory || []}
            startupSocialMetrics={startupSocialMetrics || []}
            startupName={startup.name}
          />
        </TabsContent>
        
        {/* Technical profile tab */}
        <TabsContent value="technical">
          <TechnicalMetricsPanel
            startup={startup}
            assessment={assessment}
          />
        </TabsContent>
        
        {/* Founders tab */}
        <TabsContent value="founders" className="space-y-6">
          {founders && founders.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Founders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {founders.map((founder) => (
                      <div key={founder.id} className="flex flex-col space-y-2 p-4 border rounded-lg">
                        <h3 className="font-semibold text-lg">{founder.name}</h3>
                        <p className="text-sm text-muted-foreground">{founder.title || "Co-founder"}</p>
                        {founder.bio && <p className="text-sm">{founder.bio}</p>}
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {founder.github_url && (
                            <Link href={founder.github_url} target="_blank" className="text-blue-500 hover:underline">
                              <Github className="h-4 w-4 inline-block mr-1" /> GitHub
                            </Link>
                          )}
                          {founder.linkedin_url && (
                            <Link href={founder.linkedin_url} target="_blank" className="text-blue-500 hover:underline">
                              <Linkedin className="h-4 w-4 inline-block mr-1" /> LinkedIn
                            </Link>
                          )}
                          {founder.twitter_url && (
                            <Link href={founder.twitter_url} target="_blank" className="text-blue-500 hover:underline">
                              <Twitter className="h-4 w-4 inline-block mr-1" /> Twitter
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Founders' social metrics */}
              <FounderSocialMetricsChart founderMetrics={founderSocialMetrics || []} />
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No founders found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Full data tab */}
        <TabsContent value="fulldata" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Startup Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main startup data */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Main Information</h3>
                  <div className="overflow-auto max-h-96 p-4 bg-muted rounded-md">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(startup, null, 2)}
                    </pre>
                  </div>
                </div>
                
                {/* Founders' data */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Founders</h3>
                  <div className="overflow-auto max-h-96 p-4 bg-muted rounded-md">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(founders, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Financial metrics */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Financial Metrics</h3>
                  <div className="overflow-auto max-h-96 p-4 bg-muted rounded-md">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(financialMetrics, null, 2)}
                    </pre>
                  </div>
                </div>
                
                {/* Metrics history */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Metrics History</h3>
                  <div className="overflow-auto max-h-96 p-4 bg-muted rounded-md">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(metricsHistory, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Social metrics */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Social Metrics</h3>
                  <div className="overflow-auto max-h-96 p-4 bg-muted rounded-md">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(socialMetrics, null, 2)}
                    </pre>
                  </div>
                </div>
                
                {/* Assessment data */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Assessment Data</h3>
                  <div className="overflow-auto max-h-96 p-4 bg-muted rounded-md">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(assessment, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Coinbase data */}
                {coinbaseData && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Coinbase Data</h3>
                    <div className="overflow-auto max-h-96 p-4 bg-muted rounded-md">
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(coinbaseData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                
                {/* Startup social metrics */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Startup Social Metrics</h3>
                  <div className="overflow-auto max-h-96 p-4 bg-muted rounded-md">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(startupSocialMetrics, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              
              {/* Founders' social metrics */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Founders Social Metrics</h3>
                <div className="overflow-auto max-h-96 p-4 bg-muted rounded-md">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(founderSocialMetrics, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Social metrics */}
      {socialMetrics && socialMetrics.length > 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Social Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from(new Set(socialMetrics.map(m => m.platform))).map(platform => {
                // Find the latest metric for the platform
                const latestMetric = socialMetrics
                  .filter(m => m.platform === platform)
                  .sort((a, b) => new Date(b.collected_at).getTime() - new Date(a.collected_at).getTime())[0];
                
                // Find the previous metric for comparison
                const previousMetrics = socialMetrics
                  .filter(m => m.platform === platform && m.collected_at !== latestMetric.collected_at)
                  .sort((a, b) => new Date(b.collected_at).getTime() - new Date(a.collected_at).getTime());
                
                const previousMetric = previousMetrics.length > 0 ? previousMetrics[0] : null;
                
                // Calculate changes
                let followerChange = 0;
                let followerChangePercent = 0;
                
                if (previousMetric) {
                  followerChange = latestMetric.followers_count - previousMetric.followers_count;
                  followerChangePercent = previousMetric.followers_count > 0 
                    ? (followerChange / previousMetric.followers_count) * 100 
                    : 0;
                }
                
                return (
                  <Card key={platform} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">{platform}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Followers:</span>
                          <span className="font-semibold">
                            {new Intl.NumberFormat('en-US').format(latestMetric.followers_count)}
                          </span>
                        </div>
                        {followerChange !== 0 && (
                          <div className="flex justify-end items-center text-xs mt-1">
                            <span className={followerChange > 0 ? "text-green-500" : "text-red-500"}>
                              {followerChange > 0 ? "+" : ""}
                              {new Intl.NumberFormat('en-US').format(followerChange)} 
                              ({followerChangePercent.toFixed(1)}%)
                            </span>
                            {followerChange > 0 
                              ? <TrendingUp className="h-3 w-3 ml-1 text-green-500" /> 
                              : <TrendingDown className="h-3 w-3 ml-1 text-red-500" />}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Engagement:</span>
                        <span className="font-semibold">
                          {Number.parseFloat(latestMetric.engagement_rate).toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Posts:</span>
                        <span className="font-semibold">
                          {Number.parseFloat(latestMetric.post_frequency).toFixed(1)}/day
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sentiment:</span>
                        <span className="font-semibold">
                          {Number.parseFloat(latestMetric.sentiment_score).toFixed(1)}/10
                        </span>
                      </div>
                      
                      <div className="text-xs text-right text-muted-foreground">
                        Updated: {new Date(latestMetric.collected_at).toLocaleDateString('en-US')}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Social metrics charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <SocialMetricsChart 
                platformData={
                  Array.from(new Set(socialMetrics.map(m => m.platform)))
                    .map(platform => {
                      const latest = socialMetrics
                        .filter(m => m.platform === platform)
                        .sort((a, b) => new Date(b.collected_at).getTime() - new Date(a.collected_at).getTime())[0];
                      return {
                        platform,
                        followers_count: latest?.followers_count || 0,
                        engagement_rate: Number.parseFloat(latest?.engagement_rate || "0"),
                        post_frequency: Number.parseFloat(latest?.post_frequency || "0"),
                        sentiment_score: Number.parseFloat(latest?.sentiment_score || "0")
                      }
                    })
                }
                metric="followers_count"
                title="Social Media Followers"
              />
              
              <SocialMetricsChart 
                platformData={
                  Array.from(new Set(socialMetrics.map(m => m.platform)))
                    .map(platform => {
                      const latest = socialMetrics
                        .filter(m => m.platform === platform)
                        .sort((a, b) => new Date(b.collected_at).getTime() - new Date(a.collected_at).getTime())[0];
                      return {
                        platform,
                        followers_count: latest?.followers_count || 0,
                        engagement_rate: Number.parseFloat(latest?.engagement_rate || "0"),
                        post_frequency: Number.parseFloat(latest?.post_frequency || "0"),
                        sentiment_score: Number.parseFloat(latest?.sentiment_score || "0")
                      }
                    })
                }
                metric="engagement_rate"
                title="Audience Engagement (%)"
                color="rgb(255, 99, 132)"
              />
            </div>
            
            {/* Social metrics trends */}
            <h3 className="text-xl font-bold mb-4">Metrics Trends</h3>
            <div className="grid grid-cols-1 gap-6">
              <SocialMetricsTimeline 
                metrics={socialMetrics}
                metric="followers_count"
                title="Followers Over Time"
              />
              
              <SocialMetricsTimeline 
                metrics={socialMetrics}
                metric="engagement_rate"
                title="Engagement Rate Over Time (%)"
              />
              
              <SocialMetricsTimeline 
                metrics={socialMetrics}
                metric="sentiment_score"
                title="Sentiment Score Trends (0-10)"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Social Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No social metrics data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StartupDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-48 mt-2" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
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
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-1" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-full mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}

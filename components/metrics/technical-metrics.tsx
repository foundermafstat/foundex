"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Check, Code, Server, XCircle, Zap } from "lucide-react"
import type { Startup } from "@/types/startup"

// Определение интерфейсов для типизации
interface TechStackItem {
  [category: string]: string[] | string;
}

interface MaturityMetric {
  score: string;
  description: string;
}

interface SecurityMetric {
  name: string;
  description: string;
  status: 'good' | 'warning' | 'critical';
}

interface DevelopmentMetric {
  name: string;
  value: string;
  description: string;
  icon: ReactNode;
}

export function TechnicalMetricsPanel({ startup }: { startup: Startup }) {
  // Примерный технический стек, который обычно был бы частью данных стартапа
  const techStack: TechStackItem = {
    frontend: ["React", "Next.js", "Tailwind CSS"],
    backend: ["Node.js", "Express", "Python"],
    database: ["PostgreSQL", "MongoDB"],
    devops: ["Docker", "AWS", "CI/CD"],
  }
  
  // Оценка технической зрелости на основе стадии финансирования
  const techMaturityScore = getTechMaturityScore(startup?.funding_stage || 'Seed')
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Technical Profile</CardTitle>
        <CardDescription>Analysis of technical maturity and technology stack</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Технологический стек */}
        <div>
          <h3 className="text-lg font-medium mb-3">Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {techStack ? (
              Object.entries(techStack).map(([category, techs]) => (
                <Card key={category} className="overflow-hidden">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm">{formatCategory(category)}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(techs) ? techs.map((tech: string) => (
                        <Badge key={tech} variant="outline" className="bg-muted">{tech}</Badge>
                      )) : (
                        <Badge variant="outline" className="bg-muted">{String(techs)}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center p-4 text-muted-foreground">
                Technology stack information is not available
              </div>
            )}
          </div>
        </div>
        
        {/* Техническая зрелость и безопасность */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Technical Maturity Level</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-4">
                {Object.entries(getMaturityMetrics(techMaturityScore)).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">{key}</span>
                      <span className="text-sm font-medium">{value.score}/10</span>
                    </div>
                    <Progress value={Number.parseFloat(value.score) * 10} className="h-2" />
                    <p className="text-xs text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Security and Compliance</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                {getSecurityMetrics(techMaturityScore).map((item, index) => (
                  <div key={`security-${item.name}`} className="flex items-start space-x-2 border-b pb-2 last:border-0">
                    <div className="mt-0.5">
                      {item.status === 'good' && <Check className="h-4 w-4 text-green-500" />}
                      {item.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {item.status === 'critical' && <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Метрики процесса разработки */}
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-base">Development Process Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              {getDevelopmentMetrics(startup?.funding_stage || 'Seed').map((item) => (
                <div key={`dev-${item.name}`} className="flex items-start space-x-2">
                  <div className="mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

// Вспомогательные функции

function formatCategory(category: string): string {
  const categories: { [key: string]: string } = {
    'frontend': 'Frontend',
    'backend': 'Backend',
    'database': 'Database',
    'devops': 'DevOps',
    'mobile': 'Mobile',
    'desktop': 'Desktop',
    'ai': 'AI/ML',
    'blockchain': 'Blockchain',
    'testing': 'Testing'
  }
  
  return categories[category.toLowerCase()] || category
}

function getTechMaturityScore(fundingStage: string): number {
  switch(fundingStage) {
    case 'Pre-seed':
      return 5.5
    case 'Seed': 
      return 6.5
    case 'Series A':
      return 7.5
    case 'Series B':
      return 8.5
    case 'Series C':
      return 9.5
    default:
      return 6.0
  }
}

function getMaturityMetrics(baseScore: number): Record<string, MaturityMetric> {
  const getRandomDeviation = () => (Math.random() * 0.8) - 0.4
  
  return {
    'Architecture': {
      score: Math.min(Math.max(baseScore + getRandomDeviation(), 1), 10).toFixed(1),
      description: 'Application architecture quality and scalability'
    },
    'Code Management': {
      score: Math.min(Math.max(baseScore + 0.2 + getRandomDeviation(), 1), 10).toFixed(1),
      description: 'CI/CD processes, version control, and code review'
    },
    'Testing': {
      score: Math.min(Math.max(baseScore + 0.5 + getRandomDeviation(), 1), 10).toFixed(1),
      description: 'Test coverage and automated testing quality'
    },
    'Monitoring': {
      score: Math.min(Math.max(baseScore - 0.5 + getRandomDeviation(), 1), 10).toFixed(1),
      description: 'Monitoring, logging, and alerting systems'
    }
  }
}

function getSecurityMetrics(baseScore: number): SecurityMetric[] {
  // Adjust security score slightly from base tech score
  const securityScore = Math.min(Math.max(baseScore + (Math.random() - 0.5), 1), 10)
  
  return [
    {
      name: 'Data Protection',
      description: securityScore >= 7 
        ? 'Data is securely encrypted, complies with industry standards'
        : 'Improvements needed in data encryption and protection measures',
      status: securityScore >= 7 ? 'good' : (securityScore >= 5 ? 'warning' : 'critical')
    },
    {
      name: 'Authentication',
      description: securityScore >= 6
        ? 'Using multi-factor authentication and access management'
        : 'Recommended to strengthen authentication mechanisms',
      status: securityScore >= 6 ? 'good' : (securityScore >= 4 ? 'warning' : 'critical')
    },
    {
      name: 'Compliance',
      description: securityScore >= 8
        ? 'Full compliance with industry standards and regulations'
        : 'Additional work required to meet all regulations',
      status: securityScore >= 8 ? 'good' : (securityScore >= 6 ? 'warning' : 'critical')
    },
    {
      name: 'Updates and Patches',
      description: securityScore >= 7.5
        ? 'Regular updates and vulnerability fixes'
        : 'Need to establish a regular update process',
      status: securityScore >= 7.5 ? 'good' : (securityScore >= 5.5 ? 'warning' : 'critical')
    }
  ];
}

function getDevelopmentMetrics(fundingStage: string): DevelopmentMetric[] {
  let deployFrequency: string;
  let leadTime: string;
  let timeToRecover: string;
  let changeFailRate: string;
  
  switch (fundingStage) {
    case 'Pre-seed':
      deployFrequency = 'Weekly';
      leadTime = '1-4 weeks';
      timeToRecover = '1-3 days';
      changeFailRate = '15-25%';
      break;
    case 'Seed':
      deployFrequency = 'Multiple times per week';
      leadTime = '3-7 days';
      timeToRecover = '< 1 day';
      changeFailRate = '10-20%';
      break;
    case 'Series A':
      deployFrequency = 'Daily';
      leadTime = '1-3 days';
      timeToRecover = '< 8 hours';
      changeFailRate = '5-15%';
      break;
    case 'Series B':
      deployFrequency = 'Multiple times per day';
      leadTime = '< 1 day';
      timeToRecover = '< 4 hours';
      changeFailRate = '3-7%';
      break;
    case 'Series C':
      deployFrequency = 'On demand';
      leadTime = '< 8 hours';
      timeToRecover = '< 1 hour';
      changeFailRate = '1-5%';
      break;
    default:
      deployFrequency = 'Weekly';
      leadTime = '1-2 weeks';
      timeToRecover = '< 1 day';
      changeFailRate = '5-15%';
  }
  
  return [
    {
      name: 'Deployment Frequency',
      value: deployFrequency,
      description: 'How often code is deployed to production',
      icon: <Code className="h-4 w-4 text-blue-500" />
    },
    {
      name: 'Lead Time',
      value: leadTime,
      description: 'From idea to production implementation',
      icon: <Zap className="h-4 w-4 text-amber-500" />
    },
    {
      name: 'Recovery Time',
      value: timeToRecover,
      description: 'Time to resolve production incidents',
      icon: <Server className="h-4 w-4 text-green-500" />
    },
    {
      name: 'Change Failure Rate',
      value: changeFailRate,
      description: 'Percentage of changes that lead to failures',
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  ];
}

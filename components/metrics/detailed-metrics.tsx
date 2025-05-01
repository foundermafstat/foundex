"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, TrendingUp, Users, Percent, Clock, Activity, Zap } from "lucide-react"
import { FinancialMetricChart, MetricsHistoryChart, SocialMetricsChart } from "./startup-metrics-chart"

export interface FinancialMetric {
  id?: number;
  startup_id?: number;
  created_at?: string;
  updated_at?: string;
  active_users?: number;
  monthly_recurring_revenue?: number;
  mrr?: number;
  customer_acquisition_cost?: number;
  lifetime_value?: number;
  ltv?: number;
  cac?: number;
  conversion_rate?: number;
  churn_rate?: number;
  burn_rate?: number;
  runway?: number;
  runway_months?: number;
  growth_rate?: number;
  year_over_year_growth?: number;
}

export interface SocialMetric {
  id?: number;
  startup_id?: number;
  created_at?: string;
  updated_at?: string;
  followers_count?: number;
  engagement_rate?: number;
  mentions_count?: number;
  sentiment_score?: number;
  web_traffic?: number;
  app_downloads?: number;
  posts_count?: number;
}

export interface MetricsHistory {
  id?: number;
  startup_id?: number;
  date?: string;
  metric_type?: string;
  metric_name?: string;
  metric_value?: number;
  record_date?: string;
  active_users?: number;
  monthly_recurring_revenue?: number;
  followers_count?: number;
  engagement_rate?: number;
}

export interface DetailedMetricsProps {
  financialMetrics: FinancialMetric[];
  metricsHistory: MetricsHistory[];
  startupSocialMetrics: SocialMetric[];
  startupName: string;
}

export function DetailedMetricsPanel({
  financialMetrics,
  metricsHistory,
  startupSocialMetrics,
  startupName
}: DetailedMetricsProps) {
  // Функция для безопасного форматирования чисел
  const formatNumber = (value: number | string | null | undefined, decimals = 0): string => {
    if (value == null) return '0';
    
    // Убедимся, что value - число
    const numValue = typeof value === 'number' ? value : Number.parseFloat(String(value));
    if (Number.isNaN(numValue)) return '0';
    
    return numValue.toFixed(decimals);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Detailed Metrics - {startupName}</CardTitle>
        <CardDescription>Complete overview of all historical metrics and startup performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="history">Historical Metrics</TabsTrigger>
            <TabsTrigger value="financial">Financial Indicators</TabsTrigger>
            <TabsTrigger value="social">Social Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricsHistoryChart 
                data={metricsHistory.filter(item => item.metric_name === 'active_users')} 
                metricName="active_users" 
                title="Active Users" 
                color="rgb(54, 162, 235)" 
              />
              <MetricsHistoryChart 
                data={metricsHistory.filter(item => item.metric_name === 'monthly_recurring_revenue')} 
                metricName="monthly_recurring_revenue" 
                title="MRR (Monthly Recurring Revenue)" 
                color="rgb(75, 192, 192)" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricsHistoryChart 
                data={metricsHistory.filter(item => item.metric_name === 'conversion_rate')} 
                metricName="conversion_rate" 
                title="Conversion Rate (%)" 
                color="rgb(255, 206, 86)" 
              />
              <MetricsHistoryChart 
                data={metricsHistory.filter(item => item.metric_name === 'churn_rate')} 
                metricName="churn_rate" 
                title="Customer Churn (%)" 
                color="rgb(255, 99, 132)" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricsHistoryChart 
                data={metricsHistory.filter(item => item.metric_name === 'customer_acquisition_cost')} 
                metricName="customer_acquisition_cost" 
                title="Customer Acquisition Cost (CAC)" 
                color="rgb(153, 102, 255)" 
              />
              <MetricsHistoryChart 
                data={metricsHistory.filter(item => item.metric_name === 'lifetime_value')} 
                metricName="lifetime_value" 
                title="Customer Lifetime Value (LTV)" 
                color="rgb(255, 159, 64)" 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-6">
            {financialMetrics && financialMetrics.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-indigo-500" />
                        <div>
                          <p className="text-sm font-medium leading-none">Active Users</p>
                          <p className="text-xl font-bold">{formatNumber(financialMetrics[0].active_users || 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium leading-none">Monthly Revenue</p>
                          <p className="text-xl font-bold">${formatNumber(financialMetrics[0].monthly_recurring_revenue || financialMetrics[0].mrr || 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium leading-none">Customer Acquisition Cost</p>
                          <p className="text-xl font-bold">${formatNumber(financialMetrics[0].customer_acquisition_cost || financialMetrics[0].cac || 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium leading-none">Customer Lifetime Value</p>
                          <p className="text-xl font-bold">${formatNumber(financialMetrics[0].lifetime_value || financialMetrics[0].ltv || 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Percent className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium leading-none">Conversion Rate</p>
                          <p className="text-xl font-bold">{formatNumber(financialMetrics[0].conversion_rate, 1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Percent className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium leading-none">Churn Rate</p>
                          <p className="text-xl font-bold">{formatNumber(financialMetrics[0].churn_rate, 1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium leading-none">Runway</p>
                          <p className="text-xl font-bold">{formatNumber(financialMetrics[0].runway_months || financialMetrics[0].runway || 0)} months</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium leading-none">Growth Rate</p>
                          <p className="text-xl font-bold">{formatNumber(financialMetrics[0].growth_rate || financialMetrics[0].year_over_year_growth || 0, 1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">LTV/CAC Ratio Analysis</h3>
                  <div className="bg-muted rounded-lg p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="relative w-40 h-40 flex-shrink-0">
                        <svg width="160" height="160" viewBox="0 0 160 160" aria-label="LTV/CAC Ratio Gauge">
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke={calculateLtvCacRatio(financialMetrics[0]) >= 3 ? "#22c55e" : calculateLtvCacRatio(financialMetrics[0]) >= 1 ? "#eab308" : "#ef4444"}
                            strokeWidth="12"
                            strokeDasharray="439.6"
                            strokeDashoffset={439.6 - (439.6 * Math.min(calculateLtvCacRatio(financialMetrics[0]) / 5, 1))}
                            transform="rotate(-90 80 80)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-4xl font-bold">{formatNumber(calculateLtvCacRatio(financialMetrics[0]), 1)}×</span>
                          <p className="text-sm font-medium mt-1">LTV:CAC</p>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="mb-4">
                          <h4 className="font-semibold text-lg mb-2">Assessment</h4>
                          <p className={`text-base font-medium ${
                            calculateLtvCacRatio(financialMetrics[0]) >= 4 ? "text-emerald-600 dark:text-emerald-400" : 
                            calculateLtvCacRatio(financialMetrics[0]) >= 3 ? "text-green-600 dark:text-green-400" :
                            calculateLtvCacRatio(financialMetrics[0]) >= 1 ? "text-amber-600 dark:text-amber-400" : 
                            "text-red-600 dark:text-red-400"
                          }`}>
                            {getRatingForLtvCacRatio(calculateLtvCacRatio(financialMetrics[0]))}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full">
                            <div className="flex">
                              <div className="bg-red-500 h-1.5 rounded-l-full" style={{ width: '20%' }} />
                              <div className="bg-amber-500 h-1.5" style={{ width: '20%' }} />
                              <div className="bg-green-500 h-1.5" style={{ width: '20%' }} />
                              <div className="bg-emerald-500 h-1.5 rounded-r-full" style={{ width: '40%' }} />
                            </div>
                            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                              <span>0</span>
                              <span>1.0</span>
                              <span>3.0</span>
                              <span>4.0</span>
                              <span>5.0+</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            <div className="border rounded-md p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="font-medium text-sm">Poor: &lt;1.0</span>
                              </div>
                              <p className="text-xs mt-1 text-muted-foreground">Unprofitable acquisition</p>
                            </div>
                            <div className="border rounded-md p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="font-medium text-sm">Good: 1.0-3.0</span>
                              </div>
                              <p className="text-xs mt-1 text-muted-foreground">Sustainable but needs attention</p>
                            </div>
                            <div className="border rounded-md p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="font-medium text-sm">Excellent: 3.0-4.0</span>
                              </div>
                              <p className="text-xs mt-1 text-muted-foreground">Efficient acquisition model</p>
                            </div>
                            <div className="border rounded-md p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="font-medium text-sm">Very High: &gt;4.0</span>
                              </div>
                              <p className="text-xs mt-1 text-muted-foreground">Consider increasing marketing spend</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No financial metrics available for this startup</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="social" className="space-y-6">
            {startupSocialMetrics && startupSocialMetrics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Social Media Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-blue-500" />
                          <span>Followers</span>
                        </div>
                        <span className="font-semibold">{formatNumber(startupSocialMetrics[0].followers_count) || '0'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-5 w-5 text-purple-500" />
                          <span>Posts</span>
                        </div>
                        <span className="font-semibold">{formatNumber(startupSocialMetrics[0].posts_count) || '0'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-5 w-5 text-yellow-500" />
                          <span>Engagement Rate</span>
                        </div>
                        <span className="font-semibold">{formatNumber(startupSocialMetrics[0].engagement_rate, 1)}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <span>Sentiment Score</span>
                        </div>
                        <span className="font-semibold">{formatNumber(startupSocialMetrics[0].sentiment_score, 1)}/100</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Positive Mentions</span>
                          <span className="text-right">{calculateMentionsCount(startupSocialMetrics[0], 'positive')}</span>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${calculateMentionsPercent(startupSocialMetrics[0], 'positive')}%` }} />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Neutral Mentions</span>
                          <span className="text-right">{calculateMentionsCount(startupSocialMetrics[0], 'neutral')}</span>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${calculateMentionsPercent(startupSocialMetrics[0], 'neutral')}%` }} />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Negative Mentions</span>
                          <span className="text-right">{calculateMentionsCount(startupSocialMetrics[0], 'negative')}</span>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${calculateMentionsPercent(startupSocialMetrics[0], 'negative')}%` }} />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Web Traffic</h4>
                        <div className="flex justify-between items-center">
                          <span>Monthly Visitors:</span>
                          <span className="font-medium">{formatNumber(startupSocialMetrics[0].web_traffic || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No social metrics available for this startup</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Вспомогательные функции
function calculateLtvCacRatio(financialMetrics: FinancialMetric): number {
  if (!financialMetrics) return 0;
  
  let ltv = 0;
  let cac = 1; // Предотвращаем деление на ноль
  
  try {
    ltv = Number(financialMetrics.lifetime_value || financialMetrics.ltv || 0);
    const tempCac = Number(financialMetrics.customer_acquisition_cost || financialMetrics.cac || 1);
    cac = tempCac > 0 ? tempCac : 1; // Дополнительная защита от деления на ноль
  } catch (e) {
    // В случае любой ошибки, возвращаем 0
    return 0;
  }
  
  const ratio = ltv / cac;
  return Number.isNaN(ratio) ? 0 : ratio;
}

function getRatingForLtvCacRatio(ratio: number) {
  if (ratio < 1) return "Critically low value, business model is unprofitable";
  if (ratio < 2) return "Below optimal, needs optimization";
  if (ratio < 3) return "Good value, close to optimal";
  if (ratio < 4) return "Excellent value, efficient business model";
  return "Very high value, possibly underinvesting in growth";
}

function calculateMentionsCount(metrics: SocialMetric, type: 'positive' | 'neutral' | 'negative'): number {
  if (!metrics || !metrics.mentions_count) return 0;
  
  const totalMentions = metrics.mentions_count;
  const sentimentScore = metrics.sentiment_score || 50;
  
  if (type === 'positive') {
    return Math.round(totalMentions * (sentimentScore / 100));
  } 
  
  if (type === 'negative') {
    return Math.round(totalMentions * ((100 - sentimentScore) / 200));
  } 
  
  // для neutral
  return Math.round(totalMentions * (1 - (sentimentScore / 100) - ((100 - sentimentScore) / 200)));
}

function calculateMentionsPercent(metrics: SocialMetric, type: 'positive' | 'neutral' | 'negative'): number {
  if (!metrics || !metrics.mentions_count) return 0;
  
  const positiveCount = calculateMentionsCount(metrics, 'positive');
  const neutralCount = calculateMentionsCount(metrics, 'neutral');
  const negativeCount = calculateMentionsCount(metrics, 'negative');
  const total = positiveCount + neutralCount + negativeCount;
  
  if (type === 'positive') {
    return Math.round((positiveCount / total) * 100);
  }
  
  if (type === 'negative') {
    return Math.round((negativeCount / total) * 100);
  }
  
  // для neutral
  return Math.round((neutralCount / total) * 100);
}

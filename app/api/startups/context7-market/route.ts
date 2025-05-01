import { type NextRequest, NextResponse } from 'next/server';
import { getStartupByName } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sessionId } = body;

    if (!name) {
      return NextResponse.json({ error: 'Startup name is required' }, { status: 400 });
    }

    // Получаем данные о стартапе из базы данных
    const startup = await getStartupByName(name);
    
    if (!startup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
    }

    // Здесь будет вызов Context7 для рыночного анализа стартапа
    // Симулируем ответ от Context7
    const marketAnalysisResults = `
# Market Analysis: ${startup.name}

## Industry Overview
- **Industry**: ${startup.industry}
- **Total Addressable Market**: $${(Math.random() * 900 + 100).toFixed(0)} billion
- **Market Growth Rate**: ${(Math.random() * 15 + 5).toFixed(1)}% CAGR

## Competitive Landscape
- **Market Position**: ${['Market Leader', 'Strong Challenger', 'Emerging Player', 'Niche Specialist'][Math.floor(Math.random() * 4)]}
- **Market Share**: ${(Math.random() * 15).toFixed(1)}%
- **Key Competitors**: ${['Company A', 'Company B', 'Company C'].slice(0, Math.floor(Math.random() * 3) + 1).join(', ')}

## Customer Analysis
- **Target Audience**: ${['B2B Enterprise', 'SMBs', 'B2C', 'Government', 'Mixed B2B/B2C'][Math.floor(Math.random() * 5)]}
- **User Base Growth**: ${(Math.random() * 200 + 50).toFixed(1)}% YoY
- **Customer Retention**: ${(Math.random() * 30 + 70).toFixed(1)}%

## Market Trends
- **Key Trend 1**: ${['AI Integration', 'Sustainability Focus', 'Remote Work Solutions', 'Mobile-First Approach'][Math.floor(Math.random() * 4)]}
- **Key Trend 2**: ${['Subscription Economy', 'Blockchain Adoption', 'Data Privacy', 'Low-Code Solutions'][Math.floor(Math.random() * 4)]}
- **Regulatory Impact**: ${Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'}

## Go-to-Market Strategy
- **Channel Effectiveness**: ${(Math.random() * 3 + 7).toFixed(1)}/10
- **Marketing Efficiency**: ${(Math.random() * 3 + 7).toFixed(1)}/10
- **Sales Cycle**: ${Math.floor(Math.random() * 5 + 1)} months

## Market Risk Assessment
- **Competition Risk**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}
- **Market Timing Risk**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}
- **Disruption Risk**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}

## Recommendation
${Math.random() > 0.7 
  ? 'Strong market position with significant growth potential' 
  : Math.random() > 0.4 
    ? 'Promising market dynamics but facing competitive challenges' 
    : 'Consider pivoting to address changing market conditions'}
`;

    return NextResponse.json({ marketAnalysisResults });
  } catch (error) {
    console.error('Market analysis error:', error);
    return NextResponse.json({ error: 'Failed to perform market analysis' }, { status: 500 });
  }
}

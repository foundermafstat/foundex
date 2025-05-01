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

    // Здесь будет вызов Context7 для финансового анализа стартапа
    // Симулируем ответ от Context7
    const financialAnalysisResults = `
# Financial Analysis: ${startup.name}

## Financial Overview
- **Current Valuation**: $${(startup.valuation / 1000000).toFixed(1)} million
- **Revenue**: $${(startup.valuation * (Math.random() * 0.3 + 0.05)).toFixed(2)} million
- **Burn Rate**: $${(startup.valuation * (Math.random() * 0.1 + 0.02)).toFixed(2)} million/year

## Funding History
- **Total Funding**: $${(startup.valuation * (Math.random() * 0.6 + 0.3)).toFixed(2)} million
- **Latest Round**: ${['Seed', 'Series A', 'Series B', 'Series C'][Math.floor(Math.random() * 4)]}
- **Last Funding Date**: ${new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

## Key Financial Metrics
- **Revenue Growth**: ${(Math.random() * 100 + 20).toFixed(1)}% YoY
- **Gross Margin**: ${(Math.random() * 30 + 60).toFixed(1)}%
- **CAC**: $${(Math.random() * 800 + 200).toFixed(0)}
- **LTV**: $${(Math.random() * 3000 + 1000).toFixed(0)}
- **LTV/CAC Ratio**: ${(Math.random() * 3 + 2).toFixed(1)}x

## Runway Analysis
- **Current Runway**: ${Math.floor(Math.random() * 18 + 6)} months
- **Efficiency Score**: ${(Math.random() * 4 + 6).toFixed(1)}/10

## Financial Risk Assessment
- **Cash Flow Risk**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}
- **Funding Risk**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}
- **Valuation Risk**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}

## Recommendation
${Math.random() > 0.7 
  ? 'Financially strong position with good metrics' 
  : Math.random() > 0.4 
    ? 'Acceptable financial health but monitoring required' 
    : 'Financial restructuring recommended to improve metrics'}
`;

    return NextResponse.json({ financialAnalysisResults });
  } catch (error) {
    console.error('Financial analysis error:', error);
    return NextResponse.json({ error: 'Failed to perform financial analysis' }, { status: 500 });
  }
}

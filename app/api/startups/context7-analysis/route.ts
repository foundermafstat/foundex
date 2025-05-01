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

    // Здесь будет вызов Context7 для полного анализа стартапа
    // Симулируем ответ от Context7
    const analysisResults = `
# Detailed Startup Analysis: ${startup.name}

## Overview
${startup.name} is a ${startup.industry} startup founded in ${startup.foundedYear}. 
Currently valued at $${(startup.valuation / 1000000).toFixed(1)} million.

## Team Assessment
- **Leadership**: ${Math.random() > 0.5 ? 'Strong' : 'Needs development'}
- **Technical Expertise**: ${Math.random() > 0.7 ? 'Excellent' : Math.random() > 0.4 ? 'Good' : 'Moderate'}
- **Industry Experience**: ${Math.random() > 0.6 ? 'Extensive' : 'Growing'}

## Market Position
- **Market Share**: ${(Math.random() * 15).toFixed(1)}%
- **Growth Rate**: ${(Math.random() * 30 + 5).toFixed(1)}% YoY
- **Competitive Standing**: ${Math.random() > 0.5 ? 'Leading' : Math.random() > 0.3 ? 'Strong challenger' : 'Emerging player'}

## Risk Assessment
- **Financial Risk**: ${Math.random() > 0.7 ? 'Low' : Math.random() > 0.4 ? 'Moderate' : 'High'}
- **Market Risk**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}
- **Operational Risk**: ${Math.random() > 0.5 ? 'Low' : Math.random() > 0.4 ? 'Moderate' : 'High'}

## Recommendation
${Math.random() > 0.7 ? 'Strong investment opportunity' : Math.random() > 0.4 ? 'Consider investment with monitoring' : 'Wait for further development before investing'}
`;

    return NextResponse.json({ analysisResults });
  } catch (error) {
    console.error('Startup analysis error:', error);
    return NextResponse.json({ error: 'Failed to perform startup analysis' }, { status: 500 });
  }
}

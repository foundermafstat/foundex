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

    // Здесь будет вызов Context7 для технического анализа стартапа
    // Симулируем ответ от Context7
    const techAnalysisResults = `
# Technical Analysis: ${startup.name}

## Technology Stack
- **Frontend**: ${['React', 'Angular', 'Vue.js', 'Next.js'][Math.floor(Math.random() * 4)]}
- **Backend**: ${['Node.js', 'Python/Django', 'Java Spring', 'Ruby on Rails'][Math.floor(Math.random() * 4)]}
- **Database**: ${['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase'][Math.floor(Math.random() * 5)]}
- **Infrastructure**: ${['AWS', 'Google Cloud', 'Azure', 'Hybrid Cloud'][Math.floor(Math.random() * 4)]}

## Technical Innovation
- **AI/ML Integration**: ${(Math.random() * 4 + 6).toFixed(1)}/10
- **Blockchain Usage**: ${(Math.random() * 10).toFixed(1)}/10
- **API Architecture**: ${(Math.random() * 3 + 7).toFixed(1)}/10
- **Scalability Design**: ${(Math.random() * 3 + 7).toFixed(1)}/10

## Development Practices
- **CI/CD Maturity**: ${(Math.random() * 4 + 6).toFixed(1)}/10
- **Testing Practices**: ${(Math.random() * 4 + 6).toFixed(1)}/10
- **Code Quality**: ${(Math.random() * 3 + 7).toFixed(1)}/10
- **Technical Debt**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}

## Security Assessment
- **Authentication**: ${(Math.random() * 3 + 7).toFixed(1)}/10
- **Data Protection**: ${(Math.random() * 3 + 7).toFixed(1)}/10
- **Vulnerability Management**: ${(Math.random() * 4 + 6).toFixed(1)}/10
- **Compliance Status**: ${Math.random() > 0.7 ? 'Fully Compliant' : Math.random() > 0.4 ? 'Mostly Compliant' : 'Needs Improvement'}

## Technical Team
- **Engineering Leadership**: ${Math.random() > 0.7 ? 'Strong' : Math.random() > 0.4 ? 'Adequate' : 'Needs Strengthening'}
- **Team Size**: ${Math.floor(Math.random() * 20 + 5)} engineers
- **Team Composition**: ${Math.random() > 0.6 ? 'Well-balanced' : Math.random() > 0.3 ? 'Some gaps' : 'Significant gaps'}

## Technical Risk Assessment
- **Scalability Risk**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}
- **Security Risk**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}
- **Technical Debt Risk**: ${Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Moderate' : 'High'}

## Recommendation
${Math.random() > 0.7 
  ? 'Technically sound with strong engineering practices' 
  : Math.random() > 0.4 
    ? 'Generally solid technical foundation with some areas for improvement' 
    : 'Technical restructuring recommended to address key weaknesses'}
`;

    return NextResponse.json({ techAnalysisResults });
  } catch (error) {
    console.error('Technical analysis error:', error);
    return NextResponse.json({ error: 'Failed to perform technical analysis' }, { status: 500 });
  }
}

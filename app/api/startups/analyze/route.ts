import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Имитация API для анализа стартапов
async function getStartupBasicInfo(name: string) {
  // В реальном приложении здесь был бы запрос к внешнему API
  // или к системе машинного обучения для анализа стартапа
  
  // Генерируем примерные данные для демонстрации
  const industries = ['FinTech', 'AI/ML', 'HealthTech', 'EdTech', 'CleanTech', 'Retail', 'E-commerce'];
  const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
  
  // Случайный год основания в пределах последних 10 лет
  const currentYear = new Date().getFullYear();
  const randomYear = currentYear - Math.floor(Math.random() * 10);
  
  // Случайная сумма финансирования
  const fundingRanges = ['$500K - $1M', '$1M - $5M', '$5M - $10M', '$10M+', 'Бутстрап'];
  const randomFunding = fundingRanges[Math.floor(Math.random() * fundingRanges.length)];
  
  // Генерируем описание на основе имени и индустрии
  const descriptions = [
    `${name} - стартап в сфере ${randomIndustry}, разрабатывающий инновационные решения для бизнеса.`,
    `${name} создает революционные продукты в области ${randomIndustry} с использованием передовых технологий.`,
    `${name} - молодая компания, стремящаяся изменить индустрию ${randomIndustry} своими инновационными подходами.`
  ];
  
  return {
    name,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    industry: randomIndustry,
    foundedYear: randomYear,
    fundingAmount: randomFunding,
    teamSize: Math.floor(Math.random() * 50) + 1,
    website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
    location: ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск'][Math.floor(Math.random() * 4)],
  };
}

export async function POST(request: Request) {
  try {
    const { name, sessionId } = await request.json();

    if (!name) {
      return NextResponse.json({
        error: 'Название стартапа обязательно для анализа',
      }, { status: 400 });
    }

    // Проверяем, существует ли стартап уже в базе
    const existingStartup = await prisma.startup.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    if (existingStartup) {
      return NextResponse.json({
        response: `Стартап с похожим названием "${existingStartup.name}" уже существует в базе данных. Идентификатор: ${existingStartup.id}. Вы можете просмотреть информацию о нем или создать новый с другим названием.`,
        startupExists: true,
        existingStartupId: existingStartup.id,
      });
    }

    // Получаем базовую информацию о стартапе из внешних API
    const startupData = await getStartupBasicInfo(name);

    // Формируем ответ ассистента
    const response = `
Предварительный анализ стартапа "${name}":

${startupData.description ? `Краткое описание: ${startupData.description}` : 'Описание не найдено'} 

${startupData.industry ? `Отрасль: ${startupData.industry}` : ''}
${startupData.fundingAmount ? `Предполагаемый объем инвестиций: ${startupData.fundingAmount}` : ''}
${startupData.foundedYear ? `Год основания: ${startupData.foundedYear}` : ''}
${startupData.location ? `Локация: ${startupData.location}` : ''}
${startupData.teamSize ? `Примерный размер команды: ${startupData.teamSize}` : ''}

Подготавливаю форму для добавления стартапа в базу данных. Пожалуйста, проверьте и дополните информацию на следующем экране.
    `;

    return NextResponse.json({
      response,
      startupData,
    });
  } catch (error) {
    console.error('Error analyzing startup:', error);
    return NextResponse.json({ 
      error: 'Ошибка при анализе стартапа', 
      response: 'Произошла ошибка при анализе стартапа. Пожалуйста, попробуйте позже или проверьте соединение с интернетом.'
    }, { status: 500 });
  }
}

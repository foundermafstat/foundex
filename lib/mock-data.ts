// Отдельный файл для типов и моковых данных, чтобы не импортировать функционал базы данных

export type Startup = {
  id: number;
  name: string;
  description: string | null;
  website: string | null;
  founding_date: string | null;
  industry: string | null;
  funding_stage: string | null;
  total_funding: number | null;
  created_at: string;
  updated_at: string;
  assessment?: AssessmentResult;
};

export type AssessmentResult = {
  id: number;
  startup_id: number;
  success_score: number;
  overall_score: number;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  recommendations: string;
  created_at: string;
};

// Модель данных для основателей
export type Founder = {
  id: number;
  name: string;
  bio: string | null;
  startup_id: number;
  linkedin_url: string | null;
  twitter_url: string | null;
  created_at: string;
  updated_at: string;
};

// Моковые данные для стартапов
export const mockStartups: Startup[] = [
  {
    id: 1,
    name: "TechNova",
    description: "Инновационный стартап в области искусственного интеллекта, разрабатывающий решения для автоматизации бизнес-процессов.",
    website: "https://technova.tech",
    founding_date: "2021-03-15",
    industry: "Искусственный интеллект",
    funding_stage: "Серия A",
    total_funding: 5000000,
    created_at: "2022-01-10T12:00:00Z",
    updated_at: "2022-01-10T12:00:00Z"
  },
  {
    id: 2,
    name: "GreenWave",
    description: "Экологический стартап, создающий биоразлагаемые упаковочные материалы из морских водорослей.",
    website: "https://greenwave.eco",
    founding_date: "2020-07-22",
    industry: "Экология",
    funding_stage: "Посевной раунд",
    total_funding: 750000,
    created_at: "2022-01-10T12:10:00Z",
    updated_at: "2022-01-10T12:10:00Z"
  },
  {
    id: 3,
    name: "HealthPulse",
    description: "Медицинский стартап, разрабатывающий портативные устройства для мониторинга здоровья в реальном времени.",
    website: "https://healthpulse.med",
    founding_date: "2019-11-05",
    industry: "Медицинские технологии",
    funding_stage: "Серия B",
    total_funding: 12000000,
    created_at: "2022-01-10T12:20:00Z",
    updated_at: "2022-01-10T12:20:00Z"
  },
  {
    id: 4,
    name: "UrbanMobility",
    description: "Транспортный стартап, создающий электрические скутеры и велосипеды для городской мобильности.",
    website: "https://urbanmove.city",
    founding_date: "2020-02-18",
    industry: "Транспорт",
    funding_stage: "Серия A",
    total_funding: 4500000,
    created_at: "2022-01-10T12:30:00Z",
    updated_at: "2022-01-10T12:30:00Z"
  },
  {
    id: 5,
    name: "EdTechLearn",
    description: "Образовательная платформа с адаптивными обучающими программами на основе ИИ.",
    website: "https://edtechlearn.edu",
    founding_date: "2021-09-01",
    industry: "Образование",
    funding_stage: "Посевной раунд",
    total_funding: 1200000,
    created_at: "2022-01-10T12:40:00Z",
    updated_at: "2022-01-10T12:40:00Z"
  }
];

// Моковые данные для основателей
export const mockFounders: Founder[] = [
  {
    id: 1,
    name: "Анна Петрова",
    bio: "Серийный предприниматель с опытом в AI и машинном обучении. До TechNova работала в Google и собственном стартапе в области компьютерного зрения.",
    startup_id: 1,
    linkedin_url: "https://linkedin.com/in/annapetrova",
    twitter_url: "https://twitter.com/annapetrova",
    created_at: "2022-01-10T12:05:00Z",
    updated_at: "2022-01-10T12:05:00Z"
  },
  {
    id: 2,
    name: "Иван Смирнов",
    bio: "Технический директор с 15-летним опытом разработки. Специализируется на масштабируемых архитектурах и высоконагруженных системах.",
    startup_id: 1,
    linkedin_url: "https://linkedin.com/in/ivansmirnov",
    twitter_url: null,
    created_at: "2022-01-10T12:15:00Z",
    updated_at: "2022-01-10T12:15:00Z"
  },
  {
    id: 3,
    name: "Елена Иванова",
    bio: "Эксперт по биотехнологиям и экологическим решениям. Имеет докторскую степень в области морской биологии и 5 патентов на биоразлагаемые материалы.",
    startup_id: 2,
    linkedin_url: "https://linkedin.com/in/elenaivanova",
    twitter_url: "https://twitter.com/elenaivanova",
    created_at: "2022-01-10T12:25:00Z",
    updated_at: "2022-01-10T12:25:00Z"
  },
  {
    id: 4,
    name: "Сергей Козлов",
    bio: "Специалист по материаловедению и химическим процессам. Работал над разработкой экологичных материалов в крупных международных компаниях.",
    startup_id: 2,
    linkedin_url: "https://linkedin.com/in/sergeikozlov",
    twitter_url: "https://twitter.com/sergeikozlov",
    created_at: "2022-01-10T12:35:00Z",
    updated_at: "2022-01-10T12:35:00Z"
  },
  {
    id: 5,
    name: "Мария Сидорова",
    bio: "Предприниматель в области медицинских технологий. Ранее основала два успешных стартапа в сфере цифрового здравоохранения.",
    startup_id: 3,
    linkedin_url: "https://linkedin.com/in/mariasidorova",
    twitter_url: "https://twitter.com/mariasidorova",
    created_at: "2022-01-10T12:45:00Z",
    updated_at: "2022-01-10T12:45:00Z"
  },
  {
    id: 6,
    name: "Алексей Волков",
    bio: "Маркетолог с опытом работы в медицинской индустрии. Специализируется на выводе новых продуктов на рынок и построении отношений с партнерами.",
    startup_id: 3,
    linkedin_url: "https://linkedin.com/in/alexeivolkov",
    twitter_url: null,
    created_at: "2022-01-10T12:55:00Z",
    updated_at: "2022-01-10T12:55:00Z"
  },
  {
    id: 7,
    name: "Наталья Морозова",
    bio: "Операционный директор с опытом в логистике и управлении цепочками поставок. Эксперт по оптимизации бизнес-процессов.",
    startup_id: 4,
    linkedin_url: "https://linkedin.com/in/nataliamorozova",
    twitter_url: "https://twitter.com/nataliamorozova",
    created_at: "2022-01-10T13:05:00Z",
    updated_at: "2022-01-10T13:05:00Z"
  },
  {
    id: 8,
    name: "Дмитрий Лебедев",
    bio: "Разработчик образовательных технологий. Ранее создал несколько успешных образовательных платформ и приложений для обучения.",
    startup_id: 5,
    linkedin_url: "https://linkedin.com/in/dmitrylebedev",
    twitter_url: "https://twitter.com/dmitrylebedev",
    created_at: "2022-01-10T13:15:00Z",
    updated_at: "2022-01-10T13:15:00Z"
  }
];

// Функция для создания детерминированной оценки на основе ID
export function generateAssessment(startupId: number): AssessmentResult {
  // Детерминированные значения на основе ID
  const baseScore = (startupId * 10) % 30 + 60; // От 60 до 90
  
  return {
    id: startupId,
    startup_id: startupId,
    success_score: baseScore,
    overall_score: baseScore + 2,
    strengths: "Сильная команда, перспективный рынок",
    weaknesses: "Требуется дополнительное финансирование",
    opportunities: "Выход на новые рынки, партнерства",
    threats: "Высокая конкуренция, изменение регуляций",
    recommendations: "Расширить команду, искать инвестиции",
    created_at: new Date(2023, 0, 1).toISOString()
  };
}

// Функция для создания мок-стартапа если не найден в списке
export function generateMockStartup(id: number): Startup {
  return {
    id: id,
    name: `Стартап ${id} (демо-данные)`,
    description: "Это демонстрационный стартап, созданный для примера",
    website: null,
    founding_date: null,
    industry: "ИТ",
    funding_stage: "Посевная стадия",
    total_funding: null,
    created_at: new Date(2023, 0, 1).toISOString(),
    updated_at: new Date(2023, 0, 1).toISOString(),
    assessment: generateAssessment(id)
  };
}

// Функция для создания вымышленного основателя, если он не найден
export function generateMockFounder(id: number): Founder {
  // Выбираем случайный стартап для основателя
  const startupId = (id % 5) + 1;
  
  return {
    id: id,
    name: `Основатель ${id} (демо-данные)`,
    bio: "Опытный предприниматель с богатым опытом в технологической индустрии.",
    startup_id: startupId,
    linkedin_url: "https://linkedin.com/in/demo-founder",
    twitter_url: null,
    created_at: new Date(2023, 0, 1).toISOString(),
    updated_at: new Date(2023, 0, 1).toISOString()
  };
}

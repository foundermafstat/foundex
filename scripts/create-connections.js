// Скрипт для создания связей между основателями и стартапами
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function createConnections() {
  try {
    console.log('Создание связей между основателями и стартапами...');
    
    // Получение ID существующих стартапов
    const startups = await sql`
      SELECT id, name FROM startups ORDER BY id
    `;
    
    console.log('Доступные стартапы:');
    startups.forEach(s => console.log(`ID: ${s.id}, Название: ${s.name}`));
    
    // Получение ID существующих основателей
    const founders = await sql`
      SELECT id, name, email FROM founders ORDER BY id
    `;
    
    console.log('\nДоступные основатели:');
    founders.forEach(f => console.log(`ID: ${f.id}, Имя: ${f.name}, Email: ${f.email}`));
    
    // Создание или обновление таблицы founder_startup
    console.log('\nСоздание таблицы связей founder_startup...');
    await sql`
      CREATE TABLE IF NOT EXISTS founder_startup (
        id SERIAL PRIMARY KEY,
        founder_id INTEGER REFERENCES founders(id) ON DELETE CASCADE,
        startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
        role TEXT,
        joined_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(founder_id, startup_id)
      )
    `;
    
    // Создание связей на основе имеющихся данных
    console.log('\nДобавление связей между основателями и стартапами...');
    
    // Map для поиска ID по email
    const founderEmailMap = new Map();
    founders.forEach(f => founderEmailMap.set(f.email, f.id));
    
    // Map для поиска ID стартапа по имени
    const startupNameMap = new Map();
    startups.forEach(s => startupNameMap.set(s.name.toLowerCase(), s.id));
    
    // Функция для получения ID основателя по email
    function getFounderId(email) {
      return founderEmailMap.get(email);
    }
    
    // Функция для получения ID стартапа по имени
    function getStartupId(name) {
      return startupNameMap.get(name.toLowerCase());
    }
    
    // Основные связи, уже известные из структуры
    const connections = [
      // TechNova
      { email: 'sarah@technova.io', startup: 'technova', role: 'Co-Founder & CEO', date: '2020-03-15' },
      { email: 'michael@technova.io', startup: 'technova', role: 'Co-Founder & CTO', date: '2020-03-15' },
      
      // GreenEco
      { email: 'aisha@greeneco.com', startup: 'greeneco', role: 'Co-Founder & CEO', date: '2019-07-22' },
      { email: 'david@greeneco.com', startup: 'greeneco', role: 'Co-Founder & CTO', date: '2019-07-22' },
      
      // FinEdge
      { email: 'james@finedge.io', startup: 'finedge', role: 'Founder & CEO', date: '2021-01-10' },
      { email: 'elena@finedge.io', startup: 'finedge', role: 'Co-Founder & CSO', date: '2021-01-10' },
      
      // Новые стартапы
      { email: 'jennifer@healthpulse.io', startup: 'healthpulse', role: 'Founder & CEO', date: '2020-06-18' },
      { email: 'robert@quantumcode.tech', startup: 'quantumcode', role: 'Founder & CEO', date: '2019-11-05' },
      { email: 'sophia@urbanmobility.city', startup: 'urbanmobility', role: 'Co-Founder & CEO', date: '2018-05-12' },
      { email: 'marcus@urbanmobility.city', startup: 'urbanmobility', role: 'Co-Founder & CTO', date: '2018-05-12' },
      
      // Кросс-связи и советники
      { email: 'michael@technova.io', startup: 'finedge', role: 'Advisor', date: '2021-03-20' },
      { email: 'alex@consultant.com', startup: 'technova', role: 'Advisor', date: '2020-08-15' },
      { email: 'alex@consultant.com', startup: 'healthpulse', role: 'Board Member', date: '2021-01-10' },
      { email: 'alex@consultant.com', startup: 'quantumcode', role: 'Investor', date: '2020-02-28' },
      { email: 'sarah@technova.io', startup: 'quantumcode', role: 'Technical Advisor', date: '2021-06-15' }
    ];
    
    // Проходим по списку связей и добавляем их в базу данных
    for (const conn of connections) {
      const founderId = getFounderId(conn.email);
      const startupId = getStartupId(conn.startup);
      
      if (founderId && startupId) {
        console.log(`Создание связи: ${conn.email} (ID: ${founderId}) -> ${conn.startup} (ID: ${startupId}), Роль: ${conn.role}`);
        
        await sql`
          INSERT INTO founder_startup 
            (founder_id, startup_id, role, joined_date)
          VALUES 
            (${founderId}, ${startupId}, ${conn.role}, ${conn.date})
          ON CONFLICT (founder_id, startup_id) 
          DO UPDATE SET 
            role = ${conn.role},
            joined_date = ${conn.date}
        `;
      } else {
        console.log(`Предупреждение: Не удалось найти ID для связи: ${conn.email} -> ${conn.startup}`);
      }
    }
    
    // Проверяем результаты
    const result = await sql`
      SELECT fs.id, f.name as founder_name, s.name as startup_name, fs.role, fs.joined_date
      FROM founder_startup fs
      JOIN founders f ON fs.founder_id = f.id
      JOIN startups s ON fs.startup_id = s.id
      ORDER BY s.name, f.name
    `;
    
    console.log('\nСозданные связи:');
    for (const row of result) {
      console.log(`${row.founder_name} -> ${row.startup_name} (${row.role}), с ${row.joined_date}`);
    }
    
    console.log(`\nВсего создано связей: ${result.length}`);
    
  } catch (error) {
    console.error('Ошибка при создании связей:', error);
  }
}

// Запускаем функцию создания связей
createConnections();

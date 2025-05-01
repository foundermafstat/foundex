// Скрипт для проверки существующих фаундеров в БД
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function checkFounders() {
  try {
    console.log('Проверка существующих основателей в базе данных...');
    
    const founders = await sql`
      SELECT id, name, email, startup_id 
      FROM founders 
      ORDER BY id
    `;
    
    console.log('Список основателей:');
    for (const founder of founders) {
      console.log(`ID: ${founder.id}, Имя: ${founder.name}, Email: ${founder.email}, Startup ID: ${founder.startup_id}`);
    }
    
    console.log(`Всего основателей: ${founders.length}`);
    
  } catch (error) {
    console.error('Ошибка при проверке основателей:', error);
  }
}

// Запускаем функцию проверки
checkFounders();

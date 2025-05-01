// Скрипт для обновления структуры таблицы founders
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function updateFoundersTable() {
  try {
    console.log('Проверка и обновление структуры таблицы founders...');
    
    // Проверим текущую структуру таблицы
    const foundersColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'founders'
    `;
    
    console.log('Текущие столбцы в таблице founders:');
    for (const column of foundersColumns) {
      console.log(`- ${column.column_name} (${column.data_type})`);
    }
    
    // Обновляем таблицу founders, добавляя необходимые поля
    console.log('Добавление недостающих полей в таблицу founders...');
    await sql`
      ALTER TABLE founders 
      ADD COLUMN IF NOT EXISTS github_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS bio TEXT
    `;
    
    console.log('Таблица founders успешно обновлена!');
    
    // Проверим обновленную структуру таблицы
    const updatedFoundersColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'founders'
    `;
    
    console.log('Обновленные столбцы в таблице founders:');
    for (const column of updatedFoundersColumns) {
      console.log(`- ${column.column_name} (${column.data_type})`);
    }
    
  } catch (error) {
    console.error('Ошибка при обновлении таблицы founders:', error);
  }
}

// Запускаем функцию обновления таблицы
updateFoundersTable();

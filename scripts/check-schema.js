// Скрипт для проверки структуры таблицы startups
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function checkSchema() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('Проверка структуры таблицы startups...');
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'startups'
    `;
    
    console.log('Столбцы в таблице startups:');
    for (const column of columns) {
      console.log(`- ${column.column_name} (${column.data_type})`);
    }
  } catch (error) {
    console.error('Ошибка при проверке схемы:', error);
  }
}

checkSchema();

// Скрипт для проверки структуры существующих таблиц
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function checkTables() {
  try {
    console.log('Проверка структуры таблиц...');
    
    // Проверяем таблицу startup_metrics_history
    console.log('\nСтруктура таблицы startup_metrics_history:');
    const historyColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'startup_metrics_history'
      ORDER BY ordinal_position
    `;
    
    if (historyColumns.length === 0) {
      console.log('Таблица startup_metrics_history не найдена или не содержит колонок');
      
      // Создаем таблицу с нужной структурой
      console.log('Создание таблицы startup_metrics_history...');
      await sql`
        CREATE TABLE IF NOT EXISTS startup_metrics_history (
          id SERIAL PRIMARY KEY,
          startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
          metric_date DATE NOT NULL,
          active_users INTEGER,
          mrr NUMERIC,
          cac NUMERIC,
          ltv NUMERIC,
          conversion_rate NUMERIC,
          churn_rate NUMERIC,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(startup_id, metric_date)
        )
      `;
      console.log('Таблица startup_metrics_history создана');
    } else {
      for (const column of historyColumns) {
        console.log(`- ${column.column_name} (${column.data_type})`);
      }
    }
    
    // Проверяем таблицу startup_financial_metrics
    console.log('\nСтруктура таблицы startup_financial_metrics:');
    const financialColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'startup_financial_metrics'
      ORDER BY ordinal_position
    `;
    
    for (const column of financialColumns) {
      console.log(`- ${column.column_name} (${column.data_type})`);
    }
    
    // Проверяем таблицу startup_social_metrics
    console.log('\nСтруктура таблицы startup_social_metrics:');
    const socialColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'startup_social_metrics'
      ORDER BY ordinal_position
    `;
    
    for (const column of socialColumns) {
      console.log(`- ${column.column_name} (${column.data_type})`);
    }
    
    // Проверяем таблицу founder_social_metrics
    console.log('\nСтруктура таблицы founder_social_metrics:');
    const founderSocialColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'founder_social_metrics'
      ORDER BY ordinal_position
    `;
    
    for (const column of founderSocialColumns) {
      console.log(`- ${column.column_name} (${column.data_type})`);
    }
    
  } catch (error) {
    console.error('Ошибка при проверке таблиц:', error);
  }
}

// Запускаем функцию проверки таблиц
checkTables();

// Скрипт для создания таблиц метрик
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function createTables() {
  try {
    console.log('Создание таблиц для метрик...');
    
    // 1. Создание таблицы startup_metrics_history
    console.log('Создание таблицы startup_metrics_history...');
    await sql`
      CREATE TABLE IF NOT EXISTS startup_metrics_history (
        id SERIAL PRIMARY KEY,
        startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        active_users INTEGER,
        mrr NUMERIC,
        cac NUMERIC,
        ltv NUMERIC,
        conversion_rate NUMERIC,
        churn_rate NUMERIC,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(startup_id, date)
      )
    `;
    console.log('✓ Таблица startup_metrics_history создана');
    
    // 2. Создание таблицы startup_financial_metrics
    console.log('Создание таблицы startup_financial_metrics...');
    
    // Сначала проверим, существует ли таблица
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'startup_financial_metrics'
      ) as exists
    `;
    
    if (tableExists[0]?.exists) {
      console.log('Таблица startup_financial_metrics уже существует, получаем информацию о структуре...');
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'startup_financial_metrics'
      `;
      
      console.log('Структура таблицы startup_financial_metrics:');
      for (const column of columns) {
        console.log(`- ${column.column_name} (${column.data_type})`);
      }
      
      // Добавим недостающие колонки, если они отсутствуют
      await sql`
        ALTER TABLE startup_financial_metrics 
        ADD COLUMN IF NOT EXISTS mrr NUMERIC,
        ADD COLUMN IF NOT EXISTS arr NUMERIC,
        ADD COLUMN IF NOT EXISTS cac NUMERIC,
        ADD COLUMN IF NOT EXISTS ltv NUMERIC,
        ADD COLUMN IF NOT EXISTS runway_months INTEGER,
        ADD COLUMN IF NOT EXISTS burn_rate NUMERIC,
        ADD COLUMN IF NOT EXISTS growth_rate NUMERIC,
        ADD COLUMN IF NOT EXISTS churn_rate NUMERIC
      `;
      console.log('✓ Таблица startup_financial_metrics обновлена');
    } else {
      await sql`
        CREATE TABLE startup_financial_metrics (
          id SERIAL PRIMARY KEY,
          startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
          mrr NUMERIC,
          arr NUMERIC,
          cac NUMERIC,
          ltv NUMERIC,
          runway_months INTEGER,
          burn_rate NUMERIC,
          growth_rate NUMERIC,
          churn_rate NUMERIC,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✓ Таблица startup_financial_metrics создана');
    }
    
    // 3. Создание таблицы startup_social_metrics
    console.log('Создание таблицы startup_social_metrics...');
    await sql`
      CREATE TABLE IF NOT EXISTS startup_social_metrics (
        id SERIAL PRIMARY KEY,
        startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        metric_name VARCHAR(50) NOT NULL,
        metric_value NUMERIC,
        collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Таблица startup_social_metrics создана');
    
    // 4. Создание таблицы founder_social_metrics
    console.log('Создание таблицы founder_social_metrics...');
    await sql`
      CREATE TABLE IF NOT EXISTS founder_social_metrics (
        id SERIAL PRIMARY KEY,
        founder_id INTEGER REFERENCES founders(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        metric_name VARCHAR(50) NOT NULL,
        metric_value NUMERIC,
        collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Таблица founder_social_metrics создана');
    
    // 5. Создание таблицы startup_coinbase_data
    console.log('Создание таблицы startup_coinbase_data...');
    await sql`
      CREATE TABLE IF NOT EXISTS startup_coinbase_data (
        id SERIAL PRIMARY KEY,
        startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
        token_name VARCHAR(100),
        token_symbol VARCHAR(20),
        current_price NUMERIC,
        market_cap NUMERIC,
        volume_24h NUMERIC,
        price_change_24h NUMERIC,
        price_change_7d NUMERIC,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Таблица startup_coinbase_data создана');
    
    console.log('Все таблицы успешно созданы!');
  } catch (error) {
    console.error('Ошибка при создании таблиц:', error);
  }
}

// Запускаем функцию создания таблиц
createTables();

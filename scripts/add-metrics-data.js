// Скрипт для добавления исторических и финансовых метрик в базу данных
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function addMetrics() {
  try {
    console.log('Добавление метрик и исторических данных...');
    
    // Получение ID существующих стартапов
    const startups = await sql`
      SELECT id, name, funding_stage FROM startups ORDER BY id
    `;
    
    console.log('Доступные стартапы:');
    startups.forEach(s => console.log(`ID: ${s.id}, Название: ${s.name}, Стадия: ${s.funding_stage}`));
    
    // 1. Создание таблицы startup_metrics_history
    console.log('\nСоздание таблицы startup_metrics_history...');
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
    
    // 2. Создание таблицы startup_financial_metrics
    console.log('Создание таблицы startup_financial_metrics...');
    await sql`
      CREATE TABLE IF NOT EXISTS startup_financial_metrics (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(startup_id, created_at)
      )
    `;
    
    // 3. Создание таблицы startup_social_metrics
    console.log('Создание таблицы startup_social_metrics...');
    await sql`
      CREATE TABLE IF NOT EXISTS startup_social_metrics (
        id SERIAL PRIMARY KEY,
        startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        metric_name VARCHAR(50) NOT NULL,
        metric_value NUMERIC,
        collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(startup_id, platform, metric_name, collected_at)
      )
    `;
    
    // 4. Создание таблицы founder_social_metrics
    console.log('Создание таблицы founder_social_metrics...');
    await sql`
      CREATE TABLE IF NOT EXISTS founder_social_metrics (
        id SERIAL PRIMARY KEY,
        founder_id INTEGER REFERENCES founders(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        metric_name VARCHAR(50) NOT NULL,
        metric_value NUMERIC,
        collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(founder_id, platform, metric_name, collected_at)
      )
    `;
    
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(startup_id, created_at)
      )
    `;
    
    // 6. Добавление финансовых метрик для стартапов
    console.log('\nДобавление финансовых метрик для стартапов...');
    
    for (const startup of startups) {
      // Базовые финансовые метрики, зависящие от стадии финансирования
      let mrr, arr, cac, ltv, runway, burn, growth, churn;
      
      switch(startup.funding_stage) {
        case 'Pre-seed':
          mrr = 5000 + Math.round(Math.random() * 15000);
          arr = mrr * 12;
          cac = 80 + Math.round(Math.random() * 50);
          ltv = 600 + Math.round(Math.random() * 400);
          runway = 4 + Math.round(Math.random() * 4);
          burn = 30000 + Math.round(Math.random() * 30000);
          growth = 5 + Math.random() * 10;
          churn = 6 + Math.random() * 4;
          break;
        case 'Seed':
          mrr = 20000 + Math.round(Math.random() * 40000);
          arr = mrr * 12;
          cac = 70 + Math.round(Math.random() * 50);
          ltv = 900 + Math.round(Math.random() * 500);
          runway = 8 + Math.round(Math.random() * 6);
          burn = 60000 + Math.round(Math.random() * 40000);
          growth = 8 + Math.random() * 8;
          churn = 4 + Math.random() * 3;
          break;
        case 'Series A':
          mrr = 100000 + Math.round(Math.random() * 100000);
          arr = mrr * 12;
          cac = 100 + Math.round(Math.random() * 70);
          ltv = 1800 + Math.round(Math.random() * 800);
          runway = 14 + Math.round(Math.random() * 8);
          burn = 200000 + Math.round(Math.random() * 100000);
          growth = 12 + Math.random() * 6;
          churn = 3 + Math.random() * 2;
          break;
        case 'Series B':
          mrr = 500000 + Math.round(Math.random() * 300000);
          arr = mrr * 12;
          cac = 120 + Math.round(Math.random() * 80);
          ltv = 3000 + Math.round(Math.random() * 1000);
          runway = 18 + Math.round(Math.random() * 10);
          burn = 400000 + Math.round(Math.random() * 200000);
          growth = 15 + Math.random() * 5;
          churn = 2 + Math.random() * 1;
          break;
        case 'Series C':
          mrr = 1000000 + Math.round(Math.random() * 500000);
          arr = mrr * 12;
          cac = 90 + Math.round(Math.random() * 60);
          ltv = 4000 + Math.round(Math.random() * 1500);
          runway = 24 + Math.round(Math.random() * 12);
          burn = 700000 + Math.round(Math.random() * 300000);
          growth = 18 + Math.random() * 8;
          churn = 1.5 + Math.random() * 1;
          break;
        default:
          mrr = 50000 + Math.round(Math.random() * 150000);
          arr = mrr * 12;
          cac = 100 + Math.round(Math.random() * 100);
          ltv = 1500 + Math.round(Math.random() * 1500);
          runway = 12 + Math.round(Math.random() * 12);
          burn = 150000 + Math.round(Math.random() * 150000);
          growth = 10 + Math.random() * 10;
          churn = 3 + Math.random() * 3;
          break;
      }
      
      // Добавляем финансовые метрики
      await sql`
        INSERT INTO startup_financial_metrics 
          (startup_id, mrr, arr, cac, ltv, runway_months, burn_rate, growth_rate, churn_rate, created_at)
        VALUES 
          (${startup.id}, ${mrr}, ${arr}, ${cac}, ${ltv}, ${runway}, ${burn}, ${growth}, ${churn}, CURRENT_TIMESTAMP)
        ON CONFLICT (startup_id, created_at) 
        DO UPDATE SET 
          mrr = ${mrr},
          arr = ${arr},
          cac = ${cac},
          ltv = ${ltv},
          runway_months = ${runway},
          burn_rate = ${burn},
          growth_rate = ${growth},
          churn_rate = ${churn}
      `;
      
      console.log(`Добавлены финансовые метрики для ${startup.name} (ID: ${startup.id})`);
    }
    
    // 7. Добавление исторических метрик
    console.log('\nДобавление исторических метрик за последние 12 месяцев...');
    
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const formattedDate = date.toISOString().split('T')[0];
      
      for (const startup of startups) {
        // Базовые значения для исторических метрик, зависящие от стадии
        let baseUsers, baseMRR, baseCAC, baseLTV, baseChurn;
        
        switch(startup.funding_stage) {
          case 'Pre-seed':
            baseUsers = 800;
            baseMRR = 12000;
            baseCAC = 110;
            baseLTV = 750;
            baseChurn = 8.5;
            break;
          case 'Seed':
            baseUsers = 2500;
            baseMRR = 35000;
            baseCAC = 85;
            baseLTV = 950;
            baseChurn = 5.2;
            break;
          case 'Series A':
            baseUsers = 12000;
            baseMRR = 180000;
            baseCAC = 120;
            baseLTV = 2200;
            baseChurn = 3.5;
            break;
          case 'Series B':
            baseUsers = 45000;
            baseMRR = 650000;
            baseCAC = 140;
            baseLTV = 3600;
            baseChurn = 2.2;
            break;
          case 'Series C':
            baseUsers = 120000;
            baseMRR = 1450000;
            baseCAC = 95;
            baseLTV = 4500;
            baseChurn = 1.8;
            break;
          default:
            baseUsers = 8000;
            baseMRR = 100000;
            baseCAC = 100;
            baseLTV = 1500;
            baseChurn = 4.0;
            break;
        }
        
        // Генерируем изменение метрик с течением времени и добавляем случайную вариацию
        const baselineFactor = 1 + (i * 0.05); // Более поздние месяцы имеют более высокие значения
        const randomFactor = 0.85 + (Math.random() * 0.3); // Добавляем случайность
        const growthFactor = baselineFactor * randomFactor;
        
        // Обратный расчет для исторических данных (в прошлом показатели были хуже)
        const activeUsers = Math.round(baseUsers / growthFactor);
        const mrr = Math.round(baseMRR / growthFactor);
        const cac = Math.round(baseCAC * (0.95 + (i * 0.02))); // CAC со временем растет
        const ltv = Math.round(baseLTV / (1 + (i * 0.03))); // LTV со временем увеличивается
        const conversionRate = 2.5 + (Math.random() * 1.5) - (i * 0.1); // Конверсия со временем повышается
        const churnRate = baseChurn + (i * 0.15) + (Math.random() * 0.5); // Отток со временем снижается
        
        // Добавляем исторические метрики
        await sql`
          INSERT INTO startup_metrics_history 
            (startup_id, date, active_users, mrr, cac, ltv, conversion_rate, churn_rate)
          VALUES 
            (${startup.id}, ${formattedDate}, ${activeUsers}, ${mrr}, ${cac}, ${ltv}, ${conversionRate}, ${churnRate})
          ON CONFLICT (startup_id, date) 
          DO UPDATE SET 
            active_users = ${activeUsers},
            mrr = ${mrr},
            cac = ${cac},
            ltv = ${ltv},
            conversion_rate = ${conversionRate},
            churn_rate = ${churnRate}
        `;
      }
      
      console.log(`Добавлены исторические метрики для всех стартапов за ${formattedDate}`);
    }
    
    // 8. Добавление социальных метрик для стартапов
    console.log('\nДобавление социальных метрик для стартапов...');
    
    for (const startup of startups) {
      // Базовые значения для социальных метрик, зависящие от стадии
      let twitterFollowers, linkedinFollowers, githubStars;
      
      switch(startup.funding_stage) {
        case 'Pre-seed':
          twitterFollowers = 1000 + Math.round(Math.random() * 2000);
          linkedinFollowers = 800 + Math.round(Math.random() * 1500);
          githubStars = 200 + Math.round(Math.random() * 500);
          break;
        case 'Seed':
          twitterFollowers = 3000 + Math.round(Math.random() * 3000);
          linkedinFollowers = 2000 + Math.round(Math.random() * 2000);
          githubStars = 500 + Math.round(Math.random() * 1000);
          break;
        case 'Series A':
          twitterFollowers = 8000 + Math.round(Math.random() * 5000);
          linkedinFollowers = 5000 + Math.round(Math.random() * 3000);
          githubStars = 2000 + Math.round(Math.random() * 2000);
          break;
        case 'Series B':
          twitterFollowers = 15000 + Math.round(Math.random() * 10000);
          linkedinFollowers = 10000 + Math.round(Math.random() * 5000);
          githubStars = 3000 + Math.round(Math.random() * 3000);
          break;
        case 'Series C':
          twitterFollowers = 30000 + Math.round(Math.random() * 20000);
          linkedinFollowers = 20000 + Math.round(Math.random() * 10000);
          githubStars = 5000 + Math.round(Math.random() * 5000);
          break;
        default:
          twitterFollowers = 5000 + Math.round(Math.random() * 5000);
          linkedinFollowers = 3000 + Math.round(Math.random() * 3000);
          githubStars = 1000 + Math.round(Math.random() * 2000);
          break;
      }
      
      // Добавляем социальные метрики
      await sql`
        INSERT INTO startup_social_metrics 
          (startup_id, platform, metric_name, metric_value, collected_at)
        VALUES 
          (${startup.id}, 'Twitter', 'Followers', ${twitterFollowers}, CURRENT_TIMESTAMP),
          (${startup.id}, 'LinkedIn', 'Followers', ${linkedinFollowers}, CURRENT_TIMESTAMP),
          (${startup.id}, 'GitHub', 'Stars', ${githubStars}, CURRENT_TIMESTAMP)
        ON CONFLICT DO NOTHING
      `;
      
      console.log(`Добавлены социальные метрики для ${startup.name} (ID: ${startup.id})`);
    }
    
    // 9. Добавление Coinbase данных для криптовалютных стартапов
    console.log('\nДобавление Coinbase данных для криптовалютных стартапов...');
    
    // Список стартапов с криптовалютными токенами
    const cryptoStartups = [
      { id: 27, name: 'FinEdge', token: 'FET', tokenName: 'FinEdge Token' },
      { id: 41, name: 'QuantumCode', token: 'QTM', tokenName: 'Quantum Token' }
    ];
    
    for (const crypto of cryptoStartups) {
      // Генерируем данные о токене
      const price = 0.5 + Math.random() * 10;
      const marketCap = price * (10000000 + Math.random() * 500000000);
      const volume = marketCap * (0.05 + Math.random() * 0.15);
      const priceChange24h = -5 + Math.random() * 10;
      const priceChange7d = -10 + Math.random() * 20;
      
      // Добавляем данные о токене
      await sql`
        INSERT INTO startup_coinbase_data 
          (startup_id, token_name, token_symbol, current_price, market_cap, volume_24h, price_change_24h, price_change_7d, created_at)
        VALUES 
          (${crypto.id}, ${crypto.tokenName}, ${crypto.token}, ${price}, ${marketCap}, ${volume}, ${priceChange24h}, ${priceChange7d}, CURRENT_TIMESTAMP)
        ON CONFLICT DO NOTHING
      `;
      
      console.log(`Добавлены Coinbase данные для ${crypto.name} (ID: ${crypto.id})`);
    }
    
    // 10. Получаем список основателей
    const founders = await sql`
      SELECT id, name FROM founders ORDER BY id
    `;
    
    // 11. Добавление социальных метрик для основателей
    console.log('\nДобавление социальных метрик для основателей...');
    
    for (const founder of founders) {
      // Случайные значения для социальных метрик
      const twitterFollowers = 5000 + Math.round(Math.random() * 30000);
      const githubFollowers = 500 + Math.round(Math.random() * 5000);
      const linkedinConnections = 2000 + Math.round(Math.random() * 10000);
      
      // Добавляем социальные метрики
      await sql`
        INSERT INTO founder_social_metrics 
          (founder_id, platform, metric_name, metric_value, collected_at)
        VALUES 
          (${founder.id}, 'Twitter', 'Followers', ${twitterFollowers}, CURRENT_TIMESTAMP),
          (${founder.id}, 'GitHub', 'Followers', ${githubFollowers}, CURRENT_TIMESTAMP),
          (${founder.id}, 'LinkedIn', 'Connections', ${linkedinConnections}, CURRENT_TIMESTAMP)
        ON CONFLICT DO NOTHING
      `;
      
      console.log(`Добавлены социальные метрики для ${founder.name} (ID: ${founder.id})`);
    }
    
    console.log('\nВсе метрики и исторические данные успешно добавлены!');
    
  } catch (error) {
    console.error('Ошибка при добавлении метрик:', error);
  }
}

// Запускаем функцию добавления метрик
addMetrics();

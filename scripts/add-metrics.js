// Скрипт для добавления исторических и других метрик с учетом существующей структуры БД
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function addMetricsData() {
  try {
    console.log('Добавление метрик для стартапов и основателей...');
    
    // Получение ID существующих стартапов
    const startups = await sql`
      SELECT id, name, funding_stage FROM startups ORDER BY id
    `;
    
    console.log('Доступные стартапы:');
    for (const s of startups) {
      console.log(`ID: ${s.id}, Название: ${s.name}, Стадия: ${s.funding_stage}`);
    }
    
    // 1. Добавление финансовых метрик для стартапов
    console.log('\nДобавление финансовых метрик...');
    
    for (const startup of startups) {
      // Базовые финансовые метрики, зависящие от стадии финансирования
      let revenue, burn, runway, users, conversion, cac, ltv, mrr, growth;
      
      switch(startup.funding_stage) {
        case 'Pre-seed':
          revenue = 15000 + Math.round(Math.random() * 30000);
          burn = 30000 + Math.round(Math.random() * 30000);
          runway = 4 + Math.round(Math.random() * 4);
          users = 800 + Math.round(Math.random() * 1200);
          conversion = 1.5 + Math.random() * 2;
          cac = 80 + Math.round(Math.random() * 50);
          ltv = 600 + Math.round(Math.random() * 400);
          mrr = 5000 + Math.round(Math.random() * 15000);
          growth = 5 + Math.random() * 10;
          break;
        case 'Seed':
          revenue = 50000 + Math.round(Math.random() * 100000);
          burn = 60000 + Math.round(Math.random() * 40000);
          runway = 8 + Math.round(Math.random() * 6);
          users = 2500 + Math.round(Math.random() * 3500);
          conversion = 2.5 + Math.random() * 2;
          cac = 70 + Math.round(Math.random() * 50);
          ltv = 900 + Math.round(Math.random() * 500);
          mrr = 20000 + Math.round(Math.random() * 40000);
          growth = 8 + Math.random() * 8;
          break;
        case 'Series A':
          revenue = 250000 + Math.round(Math.random() * 250000);
          burn = 200000 + Math.round(Math.random() * 100000);
          runway = 14 + Math.round(Math.random() * 8);
          users = 12000 + Math.round(Math.random() * 8000);
          conversion = 3.5 + Math.random() * 2;
          cac = 100 + Math.round(Math.random() * 70);
          ltv = 1800 + Math.round(Math.random() * 800);
          mrr = 100000 + Math.round(Math.random() * 100000);
          growth = 12 + Math.random() * 6;
          break;
        case 'Series B':
          revenue = 1000000 + Math.round(Math.random() * 800000);
          burn = 400000 + Math.round(Math.random() * 200000);
          runway = 18 + Math.round(Math.random() * 10);
          users = 45000 + Math.round(Math.random() * 25000);
          conversion = 4.5 + Math.random() * 1.5;
          cac = 120 + Math.round(Math.random() * 80);
          ltv = 3000 + Math.round(Math.random() * 1000);
          mrr = 500000 + Math.round(Math.random() * 300000);
          growth = 15 + Math.random() * 5;
          break;
        case 'Series C':
          revenue = 3000000 + Math.round(Math.random() * 2000000);
          burn = 700000 + Math.round(Math.random() * 300000);
          runway = 24 + Math.round(Math.random() * 12);
          users = 120000 + Math.round(Math.random() * 80000);
          conversion = 5.5 + Math.random() * 1.5;
          cac = 90 + Math.round(Math.random() * 60);
          ltv = 4000 + Math.round(Math.random() * 1500);
          mrr = 1000000 + Math.round(Math.random() * 500000);
          growth = 18 + Math.random() * 8;
          break;
        default:
          revenue = 150000 + Math.round(Math.random() * 150000);
          burn = 150000 + Math.round(Math.random() * 150000);
          runway = 12 + Math.round(Math.random() * 12);
          users = 8000 + Math.round(Math.random() * 8000);
          conversion = 3 + Math.random() * 2;
          cac = 100 + Math.round(Math.random() * 100);
          ltv = 1500 + Math.round(Math.random() * 1500);
          mrr = 50000 + Math.round(Math.random() * 150000);
          growth = 10 + Math.random() * 10;
          break;
      }
      
      // Проверка существования записи для данного стартапа
      const existingMetrics = await sql`
        SELECT id FROM startup_financial_metrics WHERE startup_id = ${startup.id}
      `;
      
      if (existingMetrics.length > 0) {
        // Обновляем существующую запись
        await sql`
          UPDATE startup_financial_metrics 
          SET 
            revenue = ${revenue},
            burn_rate = ${burn},
            runway_months = ${runway},
            active_users = ${users},
            conversion_rate = ${conversion},
            customer_acquisition_cost = ${cac},
            lifetime_value = ${ltv},
            monthly_recurring_revenue = ${mrr},
            year_over_year_growth = ${growth},
            updated_at = CURRENT_TIMESTAMP
          WHERE startup_id = ${startup.id}
        `;
        console.log(`Обновлены финансовые метрики для ${startup.name} (ID: ${startup.id})`);
      } else {
        // Создаем новую запись
        await sql`
          INSERT INTO startup_financial_metrics (
            startup_id, 
            revenue, 
            burn_rate, 
            runway_months, 
            active_users, 
            conversion_rate, 
            customer_acquisition_cost, 
            lifetime_value, 
            monthly_recurring_revenue, 
            year_over_year_growth, 
            created_at, 
            updated_at,
            metric_date
          )
          VALUES (
            ${startup.id}, 
            ${revenue}, 
            ${burn}, 
            ${runway}, 
            ${users}, 
            ${conversion}, 
            ${cac}, 
            ${ltv}, 
            ${mrr}, 
            ${growth}, 
            CURRENT_TIMESTAMP, 
            CURRENT_TIMESTAMP,
            CURRENT_DATE
          )
        `;
        console.log(`Добавлены финансовые метрики для ${startup.name} (ID: ${startup.id})`);
      }
    }
    
    // 2. Добавление исторических метрик
    console.log('\nДобавление исторических метрик за последние 12 месяцев...');
    
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const formattedDate = date.toISOString().split('T')[0];
      
      for (const startup of startups) {
        // Базовые значения для исторических метрик, зависящие от стадии
        let baseUsers, baseMRR, baseCAC, baseLTV, baseChurn, baseConversion;
        
        switch(startup.funding_stage) {
          case 'Pre-seed':
            baseUsers = 800;
            baseMRR = 12000;
            baseCAC = 110;
            baseLTV = 750;
            baseChurn = 8.5;
            baseConversion = 1.8;
            break;
          case 'Seed':
            baseUsers = 2500;
            baseMRR = 35000;
            baseCAC = 85;
            baseLTV = 950;
            baseChurn = 5.2;
            baseConversion = 2.4;
            break;
          case 'Series A':
            baseUsers = 12000;
            baseMRR = 180000;
            baseCAC = 120;
            baseLTV = 2200;
            baseChurn = 3.5;
            baseConversion = 3.2;
            break;
          case 'Series B':
            baseUsers = 45000;
            baseMRR = 650000;
            baseCAC = 140;
            baseLTV = 3600;
            baseChurn = 2.2;
            baseConversion = 4.5;
            break;
          case 'Series C':
            baseUsers = 120000;
            baseMRR = 1450000;
            baseCAC = 95;
            baseLTV = 4500;
            baseChurn = 1.8;
            baseConversion = 5.2;
            break;
          default:
            baseUsers = 8000;
            baseMRR = 100000;
            baseCAC = 100;
            baseLTV = 1500;
            baseChurn = 4.0;
            baseConversion = 3.0;
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
        const conversionRate = baseConversion - (i * 0.1) + (Math.random() * 0.5); // Конверсия со временем повышается
        const churnRate = baseChurn + (i * 0.15) + (Math.random() * 0.3); // Отток со временем снижается
        
        // Проверка существования записи для данной даты и стартапа
        const existingHistory = await sql`
          SELECT id FROM startup_metrics_history 
          WHERE startup_id = ${startup.id} AND date = ${formattedDate}
        `;
        
        if (existingHistory.length > 0) {
          // Обновляем существующую запись
          await sql`
            UPDATE startup_metrics_history 
            SET 
              active_users = ${activeUsers},
              mrr = ${mrr},
              cac = ${cac},
              ltv = ${ltv},
              conversion_rate = ${conversionRate},
              churn_rate = ${churnRate}
            WHERE startup_id = ${startup.id} AND date = ${formattedDate}
          `;
        } else {
          // Создаем новую запись
          await sql`
            INSERT INTO startup_metrics_history (
              startup_id, 
              date, 
              active_users, 
              mrr, 
              cac, 
              ltv, 
              conversion_rate, 
              churn_rate
            )
            VALUES (
              ${startup.id}, 
              ${formattedDate}, 
              ${activeUsers}, 
              ${mrr}, 
              ${cac}, 
              ${ltv}, 
              ${conversionRate}, 
              ${churnRate}
            )
          `;
        }
      }
      
      console.log(`Добавлены исторические метрики за ${formattedDate}`);
    }
    
    // 3. Добавление социальных метрик для стартапов
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
      const socialPlatforms = [
        { platform: 'Twitter', metricName: 'Followers', value: twitterFollowers },
        { platform: 'LinkedIn', metricName: 'Followers', value: linkedinFollowers },
        { platform: 'GitHub', metricName: 'Stars', value: githubStars }
      ];
      
      for (const social of socialPlatforms) {
        // Проверка существования записи
        const existingSocial = await sql`
          SELECT id FROM startup_social_metrics 
          WHERE startup_id = ${startup.id} 
          AND platform = ${social.platform} 
          AND metric_name = ${social.metricName}
        `;
        
        if (existingSocial.length > 0) {
          // Обновляем существующую запись
          await sql`
            UPDATE startup_social_metrics 
            SET metric_value = ${social.value}, collected_at = CURRENT_TIMESTAMP
            WHERE id = ${existingSocial[0].id}
          `;
        } else {
          // Создаем новую запись
          await sql`
            INSERT INTO startup_social_metrics (
              startup_id, platform, metric_name, metric_value, collected_at
            )
            VALUES (
              ${startup.id}, ${social.platform}, ${social.metricName}, ${social.value}, CURRENT_TIMESTAMP
            )
          `;
        }
      }
      
      console.log(`Добавлены социальные метрики для ${startup.name} (ID: ${startup.id})`);
    }
    
    // 4. Получаем список основателей
    const founders = await sql`
      SELECT id, name FROM founders ORDER BY id
    `;
    
    // 5. Добавление социальных метрик для основателей
    console.log('\nДобавление социальных метрик для основателей...');
    
    for (const founder of founders) {
      // Случайные значения для социальных метрик
      const twitterFollowers = 5000 + Math.round(Math.random() * 30000);
      const githubFollowers = 500 + Math.round(Math.random() * 5000);
      const linkedinConnections = 2000 + Math.round(Math.random() * 10000);
      
      // Социальные платформы для основателей
      const founderSocials = [
        { platform: 'Twitter', metricName: 'Followers', value: twitterFollowers },
        { platform: 'GitHub', metricName: 'Followers', value: githubFollowers },
        { platform: 'LinkedIn', metricName: 'Connections', value: linkedinConnections }
      ];
      
      for (const social of founderSocials) {
        // Проверка существования записи
        const existingSocial = await sql`
          SELECT id FROM founder_social_metrics 
          WHERE founder_id = ${founder.id} 
          AND platform = ${social.platform} 
          AND metric_name = ${social.metricName}
        `;
        
        if (existingSocial.length > 0) {
          // Обновляем существующую запись
          await sql`
            UPDATE founder_social_metrics 
            SET metric_value = ${social.value}, collected_at = CURRENT_TIMESTAMP
            WHERE id = ${existingSocial[0].id}
          `;
        } else {
          // Создаем новую запись
          await sql`
            INSERT INTO founder_social_metrics (
              founder_id, platform, metric_name, metric_value, collected_at
            )
            VALUES (
              ${founder.id}, ${social.platform}, ${social.metricName}, ${social.value}, CURRENT_TIMESTAMP
            )
          `;
        }
      }
      
      console.log(`Добавлены социальные метрики для ${founder.name} (ID: ${founder.id})`);
    }
    
    // 6. Добавление Coinbase данных для криптовалютных стартапов
    console.log('\nДобавление Coinbase данных для криптовалютных стартапов...');
    
    // Список стартапов с криптовалютными токенами
    const cryptoStartups = [
      { id: 27, name: 'FinEdge', token: 'FET', tokenName: 'FinEdge Token' },
      { id: 41, name: 'QuantumCode', token: 'QTM', tokenName: 'Quantum Token' }
    ];
    
    for (const crypto of cryptoStartups) {
      // Поиск стартапа по имени, если ID не найден
      let startupId = crypto.id;
      if (!startups.some(s => s.id === startupId)) {
        const matchingStartup = startups.find(s => 
          s.name.toLowerCase() === crypto.name.toLowerCase()
        );
        if (matchingStartup) {
          startupId = matchingStartup.id;
        } else {
          console.log(`Предупреждение: Стартап ${crypto.name} не найден в базе данных, пропускаем...`);
          continue;
        }
      }
      
      // Генерируем данные о токене
      const price = 0.5 + Math.random() * 10;
      const marketCap = price * (10000000 + Math.random() * 500000000);
      const volume = marketCap * (0.05 + Math.random() * 0.15);
      const priceChange24h = -5 + Math.random() * 10;
      const priceChange7d = -10 + Math.random() * 20;
      
      // Проверка существования записи
      const existingCoinbase = await sql`
        SELECT id FROM startup_coinbase_data WHERE startup_id = ${startupId}
      `;
      
      if (existingCoinbase.length > 0) {
        // Обновляем существующую запись
        await sql`
          UPDATE startup_coinbase_data 
          SET 
            token_name = ${crypto.tokenName},
            token_symbol = ${crypto.token},
            current_price = ${price},
            market_cap = ${marketCap},
            volume_24h = ${volume},
            price_change_24h = ${priceChange24h},
            price_change_7d = ${priceChange7d},
            created_at = CURRENT_TIMESTAMP
          WHERE id = ${existingCoinbase[0].id}
        `;
      } else {
        // Создаем новую запись
        await sql`
          INSERT INTO startup_coinbase_data (
            startup_id,
            token_name,
            token_symbol,
            current_price,
            market_cap,
            volume_24h,
            price_change_24h,
            price_change_7d,
            created_at
          )
          VALUES (
            ${startupId},
            ${crypto.tokenName},
            ${crypto.token},
            ${price},
            ${marketCap},
            ${volume},
            ${priceChange24h},
            ${priceChange7d},
            CURRENT_TIMESTAMP
          )
        `;
      }
      
      console.log(`Добавлены/обновлены Coinbase данные для ${crypto.name} (ID: ${startupId})`);
    }
    
    console.log('\nВсе метрики и исторические данные успешно добавлены!');
    
  } catch (error) {
    console.error('Ошибка при добавлении метрик:', error);
  }
}

// Запускаем функцию добавления метрик
addMetricsData();

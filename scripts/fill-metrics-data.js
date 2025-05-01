// Скрипт для добавления метрик с учетом фактической структуры таблиц
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function fillMetricsData() {
  try {
    console.log('Добавление метрик и исторических данных с учетом структуры таблиц...');
    
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
      let revenue, burn, runway, users, conversion, cac, ltv, mrr, growth, churn;
      
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
          churn = 6 + Math.random() * 4;
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
          churn = 4 + Math.random() * 3;
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
          churn = 3 + Math.random() * 2;
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
          churn = 2 + Math.random() * 1;
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
          churn = 1.5 + Math.random() * 1;
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
          churn = 3 + Math.random() * 3;
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
            cac = ${cac},
            ltv = ${ltv},
            mrr = ${mrr},
            growth_rate = ${growth},
            churn_rate = ${churn},
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
            cac,
            ltv,
            mrr,
            growth_rate,
            churn_rate,
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
            ${cac},
            ${ltv},
            ${mrr},
            ${growth},
            ${churn},
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
    const metricTypes = [
      { type: 'user', name: 'active_users' },
      { type: 'financial', name: 'mrr' },
      { type: 'financial', name: 'cac' },
      { type: 'financial', name: 'ltv' },
      { type: 'conversion', name: 'conversion_rate' },
      { type: 'retention', name: 'churn_rate' }
    ];
    
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
        
        // Используем структуру таблицы startup_metrics_history
        // - metric_type (character varying)
        // - metric_name (character varying)
        // - metric_value (numeric)
        // - record_date (date)
        
        const metricsData = [
          { type: 'user', name: 'active_users', value: activeUsers },
          { type: 'financial', name: 'mrr', value: mrr },
          { type: 'financial', name: 'cac', value: cac },
          { type: 'financial', name: 'ltv', value: ltv },
          { type: 'conversion', name: 'conversion_rate', value: conversionRate },
          { type: 'retention', name: 'churn_rate', value: churnRate }
        ];
        
        for (const metric of metricsData) {
          // Проверяем, существует ли уже такая запись
          const existingMetric = await sql`
            SELECT id FROM startup_metrics_history
            WHERE 
              startup_id = ${startup.id} 
              AND metric_type = ${metric.type}
              AND metric_name = ${metric.name}
              AND record_date = ${formattedDate}
          `;
          
          if (existingMetric.length > 0) {
            // Обновляем существующую запись
            await sql`
              UPDATE startup_metrics_history
              SET metric_value = ${metric.value}
              WHERE id = ${existingMetric[0].id}
            `;
          } else {
            // Создаем новую запись
            await sql`
              INSERT INTO startup_metrics_history (
                startup_id,
                metric_type,
                metric_name,
                metric_value,
                record_date,
                created_at
              )
              VALUES (
                ${startup.id},
                ${metric.type},
                ${metric.name},
                ${metric.value},
                ${formattedDate},
                CURRENT_TIMESTAMP
              )
            `;
          }
        }
      }
      
      console.log(`Добавлены исторические метрики за ${formattedDate}`);
    }
    
    // 3. Добавление социальных метрик для стартапов
    console.log('\nДобавление социальных метрик для стартапов...');
    
    for (const startup of startups) {
      // Базовые значения для социальных метрик, зависящие от стадии
      let followersCount, postsCount, engagementRate, mentionsCount, sentimentScore;
      
      switch(startup.funding_stage) {
        case 'Pre-seed':
          followersCount = 1000 + Math.round(Math.random() * 2000);
          postsCount = 50 + Math.round(Math.random() * 50);
          engagementRate = 1.5 + Math.random() * 1.5;
          mentionsCount = 10 + Math.round(Math.random() * 20);
          sentimentScore = 60 + Math.random() * 20;
          break;
        case 'Seed':
          followersCount = 3000 + Math.round(Math.random() * 3000);
          postsCount = 100 + Math.round(Math.random() * 100);
          engagementRate = 2.0 + Math.random() * 1.5;
          mentionsCount = 30 + Math.round(Math.random() * 40);
          sentimentScore = 65 + Math.random() * 15;
          break;
        case 'Series A':
          followersCount = 8000 + Math.round(Math.random() * 5000);
          postsCount = 200 + Math.round(Math.random() * 150);
          engagementRate = 2.5 + Math.random() * 1.5;
          mentionsCount = 80 + Math.round(Math.random() * 60);
          sentimentScore = 70 + Math.random() * 15;
          break;
        case 'Series B':
          followersCount = 15000 + Math.round(Math.random() * 10000);
          postsCount = 350 + Math.round(Math.random() * 200);
          engagementRate = 3.0 + Math.random() * 1.5;
          mentionsCount = 200 + Math.round(Math.random() * 100);
          sentimentScore = 75 + Math.random() * 15;
          break;
        case 'Series C':
          followersCount = 30000 + Math.round(Math.random() * 20000);
          postsCount = 500 + Math.round(Math.random() * 300);
          engagementRate = 3.5 + Math.random() * 1.5;
          mentionsCount = 400 + Math.round(Math.random() * 200);
          sentimentScore = 80 + Math.random() * 10;
          break;
        default:
          followersCount = 5000 + Math.round(Math.random() * 5000);
          postsCount = 150 + Math.round(Math.random() * 150);
          engagementRate = 2.5 + Math.random() * 1.5;
          mentionsCount = 50 + Math.round(Math.random() * 50);
          sentimentScore = 70 + Math.random() * 15;
          break;
      }
      
      // Проверка существования записи для данного стартапа
      const existingSocial = await sql`
        SELECT id FROM startup_social_metrics WHERE startup_id = ${startup.id}
      `;
      
      if (existingSocial.length > 0) {
        // Обновляем существующую запись
        await sql`
          UPDATE startup_social_metrics 
          SET 
            followers_count = ${followersCount},
            posts_count = ${postsCount},
            engagement_rate = ${engagementRate},
            mentions_count = ${mentionsCount},
            sentiment_score = ${sentimentScore},
            updated_at = CURRENT_TIMESTAMP
          WHERE startup_id = ${startup.id}
        `;
        console.log(`Обновлены социальные метрики для ${startup.name} (ID: ${startup.id})`);
      } else {
        // Создаем новую запись
        await sql`
          INSERT INTO startup_social_metrics (
            startup_id,
            platform,
            followers_count,
            posts_count,
            engagement_rate,
            mentions_count,
            sentiment_score,
            created_at,
            updated_at
          )
          VALUES (
            ${startup.id},
            'all', 
            ${followersCount},
            ${postsCount},
            ${engagementRate},
            ${mentionsCount},
            ${sentimentScore},
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
        `;
        console.log(`Добавлены социальные метрики для ${startup.name} (ID: ${startup.id})`);
      }
    }
    
    // 4. Получаем список основателей
    const founders = await sql`
      SELECT id, name FROM founders ORDER BY id
    `;
    
    // 5. Добавление социальных метрик для основателей
    console.log('\nДобавление социальных метрик для основателей...');
    
    for (const founder of founders) {
      // Случайные значения для социальных метрик
      const followersCount = 5000 + Math.round(Math.random() * 30000);
      const postsCount = 100 + Math.round(Math.random() * 400);
      const engagementRate = 2.0 + Math.random() * 3.0;
      const influenceScore = 60 + Math.random() * 30;
      const lastActivityDate = new Date();
      lastActivityDate.setDate(lastActivityDate.getDate() - Math.round(Math.random() * 30));
      const formattedActivityDate = lastActivityDate.toISOString().split('T')[0];
      
      // Проверка существования записи для данного основателя
      const existingSocial = await sql`
        SELECT id FROM founder_social_metrics WHERE founder_id = ${founder.id}
      `;
      
      if (existingSocial.length > 0) {
        // Обновляем существующую запись
        await sql`
          UPDATE founder_social_metrics 
          SET 
            followers_count = ${followersCount},
            posts_count = ${postsCount},
            engagement_rate = ${engagementRate},
            influence_score = ${influenceScore},
            last_activity_date = ${formattedActivityDate},
            updated_at = CURRENT_TIMESTAMP
          WHERE founder_id = ${founder.id}
        `;
        console.log(`Обновлены социальные метрики для ${founder.name} (ID: ${founder.id})`);
      } else {
        // Создаем новую запись
        await sql`
          INSERT INTO founder_social_metrics (
            founder_id,
            platform,
            followers_count,
            posts_count,
            engagement_rate,
            influence_score,
            last_activity_date,
            created_at,
            updated_at
          )
          VALUES (
            ${founder.id},
            'all',
            ${followersCount},
            ${postsCount},
            ${engagementRate},
            ${influenceScore},
            ${formattedActivityDate},
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
        `;
        console.log(`Добавлены социальные метрики для ${founder.name} (ID: ${founder.id})`);
      }
    }
    
    console.log('\nВсе метрики и исторические данные успешно добавлены!');
    
  } catch (error) {
    console.error('Ошибка при добавлении метрик:', error);
  }
}

// Запускаем функцию добавления метрик
fillMetricsData();

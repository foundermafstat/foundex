import { neon } from "@neondatabase/serverless";

export async function seedExtendedMetrics() {
  console.log("Starting extended metrics seeding...");

  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set");
      return {
        error: "DATABASE_URL environment variable is not set",
        socialMetrics: 0,
        assessments: 0,
        financialMetrics: 0,
        metricsHistory: 0,
        coinbaseData: 0
      };
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Get startups and founders to add metrics
    const startups = await sql`SELECT id, name FROM startups ORDER BY id DESC LIMIT 5`;
    
    // Get all founders for these startups using individual queries instead of IN clause
    interface Founder {
      id: number;
      name: string;
      startup_id: number;
      startup_name: string;
    }
    
    let founders: Founder[] = [];
    for (const startup of startups) {
      const startupFounders = await sql<Founder[]>`
        SELECT f.id, f.name, f.startup_id, s.name as startup_name 
        FROM founders f
        JOIN startups s ON f.startup_id = s.id
        WHERE f.startup_id = ${startup.id}
      `;
      founders = [...founders, ...startupFounders];
    }
    
    // Add startup social metrics
    let socialMetricsCount = 0;
    
    for (const startup of startups) {
      // Twitter metrics
      await sql`
        INSERT INTO startup_social_metrics (
          startup_id, 
          platform, 
          followers_count, 
          posts_count, 
          engagement_rate, 
          mentions_count, 
          sentiment_score
        )
        VALUES (
          ${startup.id}, 
          'Twitter', 
          ${Math.floor(10000 + Math.random() * 90000)}, 
          ${Math.floor(500 + Math.random() * 1500)}, 
          ${(Math.random() * 5 + 1).toFixed(2)}, 
          ${Math.floor(200 + Math.random() * 800)}, 
          ${(Math.random() * 2 + 3).toFixed(2)}
        )
      `;
      
      // LinkedIn metrics
      await sql`
        INSERT INTO startup_social_metrics (
          startup_id, 
          platform, 
          followers_count, 
          posts_count, 
          engagement_rate, 
          mentions_count, 
          sentiment_score
        )
        VALUES (
          ${startup.id}, 
          'LinkedIn', 
          ${Math.floor(5000 + Math.random() * 45000)}, 
          ${Math.floor(200 + Math.random() * 800)}, 
          ${(Math.random() * 4 + 2).toFixed(2)}, 
          ${Math.floor(100 + Math.random() * 500)}, 
          ${(Math.random() * 1.5 + 3.5).toFixed(2)}
        )
      `;
      
      // Instagram metrics
      await sql`
        INSERT INTO startup_social_metrics (
          startup_id, 
          platform, 
          followers_count, 
          posts_count, 
          engagement_rate, 
          mentions_count, 
          sentiment_score
        )
        VALUES (
          ${startup.id}, 
          'Instagram', 
          ${Math.floor(20000 + Math.random() * 80000)}, 
          ${Math.floor(100 + Math.random() * 900)}, 
          ${(Math.random() * 8 + 2).toFixed(2)}, 
          ${Math.floor(300 + Math.random() * 1200)}, 
          ${(Math.random() * 1 + 4).toFixed(2)}
        )
      `;
      
      socialMetricsCount += 3;
    }
    
    console.log(`Inserted ${socialMetricsCount} startup social metrics`);
    
    // Add founder social metrics
    let founderSocialMetricsCount = 0;
    
    for (const founder of founders) {
      // Twitter metrics
      await sql`
        INSERT INTO founder_social_metrics (
          founder_id, 
          platform, 
          followers_count, 
          posts_count, 
          engagement_rate, 
          influence_score, 
          last_activity_date
        )
        VALUES (
          ${founder.id}, 
          'Twitter', 
          ${Math.floor(5000 + Math.random() * 45000)}, 
          ${Math.floor(300 + Math.random() * 1200)}, 
          ${(Math.random() * 6 + 1).toFixed(2)}, 
          ${(Math.random() * 30 + 60).toFixed(1)}, 
          ${new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()}
        )
      `;
      
      // LinkedIn metrics
      await sql`
        INSERT INTO founder_social_metrics (
          founder_id, 
          platform, 
          followers_count, 
          posts_count, 
          engagement_rate, 
          influence_score, 
          last_activity_date
        )
        VALUES (
          ${founder.id}, 
          'LinkedIn', 
          ${Math.floor(2000 + Math.random() * 8000)}, 
          ${Math.floor(100 + Math.random() * 400)}, 
          ${(Math.random() * 5 + 2).toFixed(2)}, 
          ${(Math.random() * 25 + 65).toFixed(1)}, 
          ${new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString()}
        )
      `;
      
      founderSocialMetricsCount += 2;
    }
    
    console.log(`Inserted ${founderSocialMetricsCount} founder social metrics`);
    
    // Add financial metrics
    let financialMetricsCount = 0;
    
    for (const startup of startups) {
      // Current financial metrics
      await sql`
        INSERT INTO startup_financial_metrics (
          startup_id, 
          metric_date, 
          revenue, 
          burn_rate, 
          runway_months, 
          active_users, 
          conversion_rate, 
          customer_acquisition_cost, 
          lifetime_value, 
          monthly_recurring_revenue, 
          year_over_year_growth
        )
        VALUES (
          ${startup.id}, 
          ${new Date().toISOString().split('T')[0]}, 
          ${Math.floor(100000 + Math.random() * 900000)}, 
          ${Math.floor(50000 + Math.random() * 150000)}, 
          ${Math.floor(12 + Math.random() * 24)}, 
          ${Math.floor(10000 + Math.random() * 90000)}, 
          ${(Math.random() * 10 + 2).toFixed(2)}, 
          ${Math.floor(50 + Math.random() * 150)}, 
          ${Math.floor(500 + Math.random() * 1500)}, 
          ${Math.floor(80000 + Math.random() * 420000)}, 
          ${(Math.random() * 80 + 20).toFixed(1)}
        )
      `;
      
      // Historical financial metrics (6 months ago)
      await sql`
        INSERT INTO startup_financial_metrics (
          startup_id, 
          metric_date, 
          revenue, 
          burn_rate, 
          runway_months, 
          active_users, 
          conversion_rate, 
          customer_acquisition_cost, 
          lifetime_value, 
          monthly_recurring_revenue, 
          year_over_year_growth
        )
        VALUES (
          ${startup.id}, 
          ${new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}, 
          ${Math.floor(60000 + Math.random() * 400000)}, 
          ${Math.floor(40000 + Math.random() * 100000)}, 
          ${Math.floor(9 + Math.random() * 15)}, 
          ${Math.floor(5000 + Math.random() * 45000)}, 
          ${(Math.random() * 8 + 1).toFixed(2)}, 
          ${Math.floor(60 + Math.random() * 170)}, 
          ${Math.floor(400 + Math.random() * 1100)}, 
          ${Math.floor(50000 + Math.random() * 250000)}, 
          ${(Math.random() * 60 + 15).toFixed(1)}
        )
      `;
      
      financialMetricsCount += 2;
    }
    
    console.log(`Inserted ${financialMetricsCount} financial metrics`);
    
    // Add metrics history for various metrics
    let metricsHistoryCount = 0;
    const metricTypes = ['users', 'revenue', 'engagement'];
    const months = 12;
    
    for (const startup of startups) {
      for (const metricType of metricTypes) {
        for (let i = 0; i < months; i++) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          let metricName = '';
          let baseValue = 0;
          let growthRate = 0;
          
          if (metricType === 'users') {
            metricName = 'monthly_active_users';
            baseValue = 12000;
            growthRate = 1.08;
          } else if (metricType === 'revenue') {
            metricName = 'monthly_revenue';
            baseValue = 100000;
            growthRate = 1.1;
          } else if (metricType === 'engagement') {
            metricName = 'user_engagement_score';
            baseValue = 85;
            growthRate = 1.02;
          }
          
          // Используем оператор ** вместо Math.pow
          const adjustedValue = baseValue * (growthRate ** (months - i)) * (0.9 + Math.random() * 0.2);
          
          await sql`
            INSERT INTO startup_metrics_history (
              startup_id, 
              metric_type, 
              metric_name, 
              metric_value, 
              record_date
            )
            VALUES (
              ${startup.id}, 
              ${metricType}, 
              ${metricName}, 
              ${adjustedValue}, 
              ${date.toISOString().split('T')[0]}
            )
          `;
          
          metricsHistoryCount++;
        }
      }
    }
    
    console.log(`Inserted ${metricsHistoryCount} metrics history records`);
    
    // Add Coinbase data for cryptocurrency startups
    let coinbaseDataCount = 0;
    
    for (const startup of startups) {
      if (startup.name === "CryptoFrontier") {
        await sql`
          INSERT INTO startup_coinbase_data (
            startup_id, 
            token_symbol, 
            token_name, 
            market_cap, 
            circulating_supply, 
            total_supply, 
            current_price, 
            all_time_high, 
            all_time_high_date, 
            listed_date, 
            trading_volume_24h, 
            price_change_24h, 
            price_change_7d, 
            price_change_30d, 
            last_updated
          )
          VALUES (
            ${startup.id}, 
            'CFT', 
            'CryptoFrontier Token', 
            ${385000000}, 
            ${100000000}, 
            ${250000000}, 
            ${3.85}, 
            ${8.76}, 
            ${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()}, 
            ${new Date(Date.now() - 270 * 24 * 60 * 60 * 1000).toISOString()}, 
            ${12500000}, 
            ${5.2}, 
            ${-3.8}, 
            ${15.7}, 
            ${new Date().toISOString()}
          )
        `;
        
        coinbaseDataCount++;
      }
    }
    
    console.log(`Inserted ${coinbaseDataCount} Coinbase data records`);
    
    return {
      socialMetrics: socialMetricsCount + founderSocialMetricsCount,
      assessments: 0,
      financialMetrics: financialMetricsCount,
      metricsHistory: metricsHistoryCount,
      coinbaseData: coinbaseDataCount
    };
  } catch (error) {
    console.error("Error seeding extended metrics:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      socialMetrics: 0,
      assessments: 0,
      financialMetrics: 0,
      metricsHistory: 0,
      coinbaseData: 0
    };
  }
}

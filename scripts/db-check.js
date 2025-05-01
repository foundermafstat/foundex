// Script for checking database connection and setting up test data
const { execSync, exec } = require('child_process');
const { writeFileSync, unlinkSync, existsSync } = require('fs');
const path = require('path');

// Safely get database URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://neondb_owner:npg_ney4MJFAvQ8E@ep-polished-sun-ab3knaw6-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

console.log('Creating temporary file for database connection check...');
const tempFilePath = path.join(__dirname, 'temp-env.js');

// Create temporary script file
writeFileSync(tempFilePath, `
// Temporary script for database connection check
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function main() {
  try {
    console.log('Connecting to database...');
    const sql = neon(process.env.DATABASE_URL);
    
    if (!sql) {
      throw new Error('Failed to initialize SQL client');
    }
    
    // Check if tables exist
    console.log('Checking database structure...');
    try {
      const tablesResult = await sql\`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      \`;
      
      if (tablesResult && tablesResult.length > 0) {
        console.log('Existing tables:', tablesResult.map(t => t.table_name));
      } else {
        console.log('No tables in database. Initializing DB structure...');
        // Create main tables
        await sql\`
          CREATE TABLE IF NOT EXISTS startups (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            website TEXT,
            founding_date DATE,
            industry TEXT,
            funding_stage TEXT,
            total_funding BIGINT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            coinbase_listed BOOLEAN DEFAULT FALSE,
            coinbase_url TEXT,
            github_url TEXT,
            twitter_url TEXT,
            linkedin_url TEXT,
            instagram_url TEXT,
            facebook_url TEXT
          )
        \`;
        
        await sql\`
          CREATE TABLE IF NOT EXISTS founders (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            linkedin_url TEXT,
            twitter_url TEXT,
            instagram_url TEXT,
            github_url TEXT,
            facebook_url TEXT,
            bio TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        \`;
        
        await sql\`
          CREATE TABLE IF NOT EXISTS founder_startup (
            id SERIAL PRIMARY KEY,
            founder_id INTEGER REFERENCES founders(id) ON DELETE CASCADE,
            startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
            role TEXT,
            joined_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(founder_id, startup_id)
          )
        \`;
        
        await sql\`
          CREATE TABLE IF NOT EXISTS assessment_results (
            id SERIAL PRIMARY KEY,
            startup_id INTEGER REFERENCES startups(id),
            success_score INTEGER NOT NULL,
            strengths TEXT,
            weaknesses TEXT,
            opportunities TEXT,
            threats TEXT,
            recommendations TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        \`;
        
        // Новые таблицы для социальных показателей и метрик
        
        await sql\`
          CREATE TABLE IF NOT EXISTS founder_social_metrics (
            id SERIAL PRIMARY KEY,
            founder_id INTEGER REFERENCES founders(id),
            platform VARCHAR(50) NOT NULL, -- 'twitter', 'linkedin', 'github', 'instagram', etc.
            followers_count INTEGER,
            posts_count INTEGER,
            engagement_rate DECIMAL(5,2),
            influence_score INTEGER,
            last_activity_date TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        \`;
        
        await sql\`
          CREATE TABLE IF NOT EXISTS startup_social_metrics (
            id SERIAL PRIMARY KEY,
            startup_id INTEGER REFERENCES startups(id),
            platform VARCHAR(50) NOT NULL, -- 'twitter', 'linkedin', 'github', etc.
            followers_count INTEGER,
            posts_count INTEGER,
            engagement_rate DECIMAL(5,2),
            mentions_count INTEGER,
            sentiment_score DECIMAL(5,2), -- от -1.0 до 1.0
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        \`;
        
        await sql\`
          CREATE TABLE IF NOT EXISTS startup_financial_metrics (
            id SERIAL PRIMARY KEY,
            startup_id INTEGER REFERENCES startups(id),
            metric_date DATE NOT NULL,
            revenue BIGINT,
            burn_rate BIGINT,
            runway_months INTEGER,
            active_users INTEGER,
            conversion_rate DECIMAL(5,2),
            customer_acquisition_cost DECIMAL(10,2),
            lifetime_value DECIMAL(10,2),
            monthly_recurring_revenue BIGINT,
            year_over_year_growth DECIMAL(5,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        \`;
        
        await sql\`
          CREATE TABLE IF NOT EXISTS startup_metrics_history (
            id SERIAL PRIMARY KEY,
            startup_id INTEGER REFERENCES startups(id),
            metric_type VARCHAR(50) NOT NULL, -- 'social', 'financial', 'market', etc.
            metric_name VARCHAR(50) NOT NULL,
            metric_value DECIMAL(15,2),
            record_date TIMESTAMP NOT NULL, -- дата записи
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        \`;
        
        await sql\`
          CREATE TABLE IF NOT EXISTS startup_coinbase_data (
            id SERIAL PRIMARY KEY,
            startup_id INTEGER REFERENCES startups(id),
            token_symbol VARCHAR(10),
            token_name VARCHAR(50),
            market_cap BIGINT,
            circulating_supply BIGINT,
            total_supply BIGINT,
            current_price DECIMAL(20,10),
            all_time_high DECIMAL(20,10),
            all_time_high_date TIMESTAMP,
            listed_date TIMESTAMP,
            trading_volume_24h BIGINT,
            price_change_24h DECIMAL(5,2),
            price_change_7d DECIMAL(5,2),
            price_change_30d DECIMAL(5,2),
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        \`;
        
        console.log('Database structure initialized');
      }
      
      // Check for data in startups table
      const startupsCount = await sql\`SELECT COUNT(*) as count FROM startups\`;
      const count = parseInt(startupsCount[0]?.count || '0', 10);
      console.log('Number of startups in database:', count);
      
      if (count === 0) {
        console.log('Adding test data for startups...');
        // Add test data
        const startupResults = await sql\`
          INSERT INTO startups (name, description, website, founding_date, industry, funding_stage, total_funding, github_url, twitter_url, linkedin_url, instagram_url, facebook_url, coinbase_listed, coinbase_url)
          VALUES 
            ('TechNova', 'AI-powered productivity platform for remote teams', 'https://technova.io', '2020-03-15', 'SaaS', 'Series A', 5000000, 'https://github.com/technova', 'https://twitter.com/technova', 'https://linkedin.com/company/technova', 'https://instagram.com/technova', 'https://facebook.com/technova', false, null),
            ('GreenEco', 'Sustainable packaging solutions for e-commerce', 'https://greeneco.com', '2019-07-22', 'CleanTech', 'Seed', 750000, 'https://github.com/greeneco', 'https://twitter.com/greeneco', 'https://linkedin.com/company/greeneco', 'https://instagram.com/greeneco', 'https://facebook.com/greeneco', false, null),
            ('FinEdge', 'Decentralized finance platform for cross-border payments', 'https://finedge.io', '2021-01-10', 'FinTech', 'Pre-seed', 300000, 'https://github.com/finedge', 'https://twitter.com/finedge', 'https://linkedin.com/company/finedge', 'https://instagram.com/finedge', 'https://facebook.com/finedge', true, 'https://coinbase.com/price/finedge'),
            ('HealthPulse', 'AI-powered health monitoring and diagnostics platform', 'https://healthpulse.io', '2020-06-18', 'HealthTech', 'Series B', 18000000, 'https://github.com/healthpulse', 'https://twitter.com/healthpulse', 'https://linkedin.com/company/healthpulse', 'https://instagram.com/healthpulse', 'https://facebook.com/healthpulse', false, null),
            ('QuantumCode', 'Quantum computing solutions for enterprise cryptography', 'https://quantumcode.tech', '2019-11-05', 'DeepTech', 'Series A', 7500000, 'https://github.com/quantumcode', 'https://twitter.com/quantumcode', 'https://linkedin.com/company/quantumcode', 'https://instagram.com/quantumcode', 'https://facebook.com/quantumcode', true, 'https://coinbase.com/price/quantumcode'),
            ('UrbanMobility', 'Smart city transportation infrastructure and analytics', 'https://urbanmobility.city', '2018-05-12', 'SmartCity', 'Series C', 45000000, 'https://github.com/urbanmobility', 'https://twitter.com/urbanmobility', 'https://linkedin.com/company/urbanmobility', 'https://instagram.com/urbanmobility', 'https://facebook.com/urbanmobility', false, null)
          RETURNING id, name
        \`;
        console.log('Test startups added:', startupResults);
      } else {
        // Display existing startups
        const startups = await sql\`SELECT id, name FROM startups\`;
        console.log('Existing startups:', startups);
      }
      
      // Check for data in founders table
      const foundersCount = await sql\`SELECT COUNT(*) as count FROM founders\`;
      const foundersTotal = parseInt(foundersCount[0]?.count || '0', 10);
      console.log('Number of founders in database:', foundersTotal);
      
      if (foundersTotal === 0) {
        console.log('Adding test data for founders...');
        // Add test data
        const founderResults = await sql\`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, github_url, instagram_url, facebook_url, bio)
          VALUES 
            ('Sarah Chen', 'sarah@technova.io', 'https://linkedin.com/in/sarahchen', 'https://twitter.com/sarahchen', 'https://github.com/sarahchen', 'https://instagram.com/sarahchen', 'https://facebook.com/sarahchen', 'Former Google engineer with 10+ years experience in AI and machine learning.'),
            ('Michael Rodriguez', 'michael@technova.io', 'https://linkedin.com/in/michaelrodriguez', 'https://twitter.com/michaelrodriguez', 'https://github.com/mrodriguez', 'https://instagram.com/michaelrodriguez', 'https://facebook.com/michaelrodriguez', 'Serial entrepreneur with successful exits in SaaS and fintech.'),
            ('Emily Green', 'emily@greeneco.com', 'https://linkedin.com/in/emilygreen', 'https://twitter.com/emilygreen', 'https://github.com/emilygreen', 'https://instagram.com/emilygreen', 'https://facebook.com/emilygreen', 'Environmental scientist turned entrepreneur, passionate about sustainable solutions.'),
            ('David Kim', 'david@finedge.io', 'https://linkedin.com/in/davidkim', 'https://twitter.com/davidkim', 'https://github.com/davidkim', 'https://instagram.com/davidkim', 'https://facebook.com/davidkim', 'FinTech expert with background in blockchain and traditional finance.'),
            ('Jennifer Zhang', 'jennifer@healthpulse.io', 'https://linkedin.com/in/jenniferzhang', 'https://twitter.com/jenniferzhang', 'https://github.com/jenniferzhang', 'https://instagram.com/jenniferzhang', 'https://facebook.com/jenniferzhang', 'Medical doctor with specialty in digital health solutions. Former CTO at MedTech Inc.'),
            ('Robert Thompson', 'robert@quantumcode.tech', 'https://linkedin.com/in/robertthompson', 'https://twitter.com/robertthompson', 'https://github.com/robertthompson', 'https://instagram.com/robertthompson', 'https://facebook.com/robertthompson', 'PhD in quantum physics from MIT with 15 years of research experience.'),
            ('Sophia Patel', 'sophia@urbanmobility.city', 'https://linkedin.com/in/sophiapatel', 'https://twitter.com/sophiapatel', 'https://github.com/sophiapatel', 'https://instagram.com/sophiapatel', 'https://facebook.com/sophiapatel', 'Urban planner and transportation expert with focus on sustainable city infrastructure.'),
            ('Marcus Johnson', 'marcus@urbanmobility.city', 'https://linkedin.com/in/marcusjohnson', 'https://twitter.com/marcusjohnson', 'https://github.com/marcusjohnson', 'https://instagram.com/marcusjohnson', 'https://facebook.com/marcusjohnson', 'Data scientist specializing in traffic pattern analysis and optimization algorithms.'),
            ('Alex Rivera', 'alex@consultant.com', 'https://linkedin.com/in/alexrivera', 'https://twitter.com/alexrivera', 'https://github.com/alexrivera', 'https://instagram.com/alexrivera', 'https://facebook.com/alexrivera', 'Startup advisor and angel investor with experience across multiple technology sectors.')
          RETURNING id, name
        \`;
        console.log('Test founders added:', founderResults);
        
        // Create test founder-startup relationships
        console.log('Adding test founder-startup relationships...');
        await sql\`
          INSERT INTO founder_startup (founder_id, startup_id, role, joined_date)
          VALUES 
            (1, 1, 'Co-Founder & CEO', '2020-03-15'),
            (2, 1, 'Co-Founder & CTO', '2020-03-15'),
            (3, 2, 'Founder & CEO', '2019-07-22'),
            (4, 3, 'Founder & CEO', '2021-01-10'),
            (5, 4, 'Founder & CEO', '2020-06-18'),
            (6, 5, 'Founder & CEO', '2019-11-05'),
            (7, 6, 'Co-Founder & CEO', '2018-05-12'),
            (8, 6, 'Co-Founder & CTO', '2018-05-12'),
            (2, 3, 'Advisor', '2021-03-20'),
            (9, 1, 'Advisor', '2020-08-15'),
            (9, 4, 'Board Member', '2021-01-10'),
            (9, 5, 'Investor', '2020-02-28'),
            (1, 5, 'Technical Advisor', '2021-06-15')
        \`;
        console.log('Test founder-startup relationships added');
        
        // Create test assessments
        console.log('Adding test assessments for startups...');
        await sql\`
          INSERT INTO assessment_results (startup_id, success_score, strengths, weaknesses, opportunities, threats, recommendations)
          VALUES 
            (1, 82, 'Strong technical team, Innovative AI approach', 'Limited marketing resources', 'Growing remote work market', 'Competition from established players', 'Focus on partnership with enterprise clients'),
            (2, 76, 'Sustainable product market fit, Strong environmental credentials', 'Manufacturing scalability challenges', 'Increased focus on sustainability', 'Raw material price fluctuations', 'Develop direct-to-consumer offering'),
            (3, 65, 'Novel blockchain implementation, Low transaction fees', 'Early-stage product', 'Cross-border payment growth', 'Regulatory uncertainties', 'Secure strategic partnerships with banks')
        \`;
        console.log('Test assessments added');
        
        // Добавление тестовых финансовых показателей для стартапов
        console.log('Adding test financial metrics for startups...');
        await sql\`
          INSERT INTO startup_financial_metrics (
            startup_id, metric_date, revenue, burn_rate, runway_months, 
            active_users, conversion_rate, customer_acquisition_cost, 
            lifetime_value, monthly_recurring_revenue, year_over_year_growth
          )
          VALUES 
            (1, '2025-04-01', 250000, 70000, 18, 5000, 3.5, 150.00, 2200.00, 180000, 32.5),
            (1, '2025-03-01', 230000, 65000, 19, 4500, 3.2, 160.00, 2100.00, 165000, 30.2),
            (1, '2025-02-01', 210000, 62000, 18, 4200, 3.0, 170.00, 2000.00, 150000, 28.5),
            (1, '2025-01-01', 195000, 60000, 17, 3800, 2.8, 175.00, 1950.00, 140000, 26.0),
            (1, '2024-12-01', 185000, 58000, 16, 3500, 2.7, 180.00, 1900.00, 130000, 24.5),
            (1, '2024-11-01', 170000, 55000, 15, 3200, 2.5, 190.00, 1850.00, 120000, 22.0),

            (2, '2025-04-01', 120000, 45000, 12, 2500, 2.8, 130.00, 1800.00, 90000, 25.5),
            (2, '2025-03-01', 110000, 43000, 13, 2300, 2.6, 135.00, 1750.00, 85000, 24.0),
            (2, '2025-02-01', 100000, 42000, 12, 2100, 2.5, 140.00, 1700.00, 80000, 22.5),
            (2, '2025-01-01', 95000, 40000, 12, 1900, 2.4, 145.00, 1650.00, 75000, 21.0),
            (2, '2024-12-01', 85000, 38000, 11, 1700, 2.2, 150.00, 1600.00, 70000, 19.5),
            (2, '2024-11-01', 80000, 35000, 11, 1500, 2.0, 155.00, 1550.00, 65000, 18.0),

            (3, '2025-04-01', 80000, 60000, 8, 15000, 1.8, 90.00, 1200.00, 60000, 45.5),
            (3, '2025-03-01', 70000, 55000, 8, 12000, 1.6, 95.00, 1150.00, 55000, 42.0),
            (3, '2025-02-01', 60000, 50000, 7, 10000, 1.5, 100.00, 1100.00, 50000, 38.5),
            (3, '2025-01-01', 50000, 45000, 7, 8000, 1.4, 105.00, 1050.00, 45000, 35.0),
            (3, '2024-12-01', 40000, 40000, 6, 6000, 1.2, 110.00, 1000.00, 40000, 30.5),
            (3, '2024-11-01', 30000, 35000, 5, 4000, 1.0, 115.00, 950.00, 35000, 25.0)
        \`;
        console.log('Test startup financial metrics added');
        
        // Добавление тестовых данных о соцсетях стартапов
        console.log('Adding test social metrics for startups...');
        await sql\`
          INSERT INTO startup_social_metrics (
            startup_id, platform, followers_count, posts_count, 
            engagement_rate, mentions_count, sentiment_score
          )
          VALUES 
            (1, 'twitter', 24500, 850, 4.1, 1200, 0.75),
            (1, 'linkedin', 18300, 320, 5.3, 450, 0.82),
            (1, 'instagram', 15000, 215, 6.2, 550, 0.79),
            
            (2, 'twitter', 12800, 620, 3.8, 750, 0.68),
            (2, 'linkedin', 9500, 180, 4.5, 280, 0.73),
            (2, 'instagram', 21000, 430, 7.1, 680, 0.85),
            
            (3, 'twitter', 18500, 780, 5.2, 950, 0.62),
            (3, 'linkedin', 7200, 150, 3.9, 320, 0.71),
            (3, 'instagram', 5600, 90, 2.8, 180, 0.59)
        \`;
        console.log('Test startup social metrics added');
        
        // Добавление данных о Coinbase для криптовалютных стартапов
        console.log('Adding test Coinbase data for crypto startups...');
        await sql\`
          INSERT INTO startup_coinbase_data (
            startup_id, token_symbol, token_name, market_cap, 
            circulating_supply, total_supply, current_price, 
            all_time_high, all_time_high_date, listed_date,
            trading_volume_24h, price_change_24h, price_change_7d, price_change_30d
          )
          VALUES 
            (3, 'FET', 'FinEdge Token', 85000000, 75000000, 100000000, 1.13, 
             3.75, '2024-07-15', '2023-05-12', 4500000, 2.35, -1.82, 8.45)
        \`;
        console.log('Test Coinbase data added');
        
        // Generate historical metrics for the last 12 months
        console.log('Adding historical metrics for startups...');
        const now = new Date();
        for (let i = 0; i < 12; i++) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          const formattedDate = date.toISOString().split('T')[0];
          
          // Add metrics for each startup
          for (let startupId = 1; startupId <= 6; startupId++) {
            // Generate slightly randomized growth metrics that trend upward over time
            const baselineFactor = 1 + (i * 0.05); // More recent months have higher values
            const randomFactor = 0.85 + (Math.random() * 0.3); // Add some randomness
            const growthFactor = baselineFactor * randomFactor;
            
            // Create base metrics that vary by startup size and stage
            let baseUsers, baseMRR, baseCAC, baseLTV, baseChurn;
            
            switch(startupId) {
              case 1: // TechNova - Series A
                baseUsers = 12000;
                baseMRR = 180000;
                baseCAC = 120;
                baseLTV = 2200;
                baseChurn = 3.5;
                break;
              case 2: // GreenEco - Seed
                baseUsers = 2500;
                baseMRR = 35000;
                baseCAC = 85;
                baseLTV = 950;
                baseChurn = 5.2;
                break;
              case 3: // FinEdge - Pre-seed
                baseUsers = 800;
                baseMRR = 12000;
                baseCAC = 110;
                baseLTV = 750;
                baseChurn = 8.5;
                break;
              case 4: // HealthPulse - Series B
                baseUsers = 45000;
                baseMRR = 650000;
                baseCAC = 140;
                baseLTV = 3600;
                baseChurn = 2.2;
                break;
              case 5: // QuantumCode - Series A
                baseUsers = 9500;
                baseMRR = 220000;
                baseCAC = 170;
                baseLTV = 2800;
                baseChurn = 3.0;
                break;
              case 6: // UrbanMobility - Series C
                baseUsers = 120000;
                baseMRR = 1450000;
                baseCAC = 95;
                baseLTV = 4500;
                baseChurn = 1.8;
                break;
            }
            
            // Scale metrics based on historical month and add some randomness
            const activeUsers = Math.round(baseUsers / growthFactor);
            const mrr = Math.round(baseMRR / growthFactor);
            const cac = Math.round(baseCAC * (0.95 + (i * 0.02))); // CAC generally increases over time (historical was lower)
            const ltv = Math.round(baseLTV / (1 + (i * 0.03))); // LTV generally decreases going back in time
            const conversionRate = 2.5 + (Math.random() * 1.5) - (i * 0.1); // Conversion improving over time
            const churnRate = baseChurn + (i * 0.15) + (Math.random() * 0.5); // Churn reducing over time
            
            // Insert historical metrics for this startup and month
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
              ) VALUES (
                ${startupId},
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
        console.log('Added historical metrics for all startups for the past 12 months');
        
        // Add social metrics history for startups
        console.log('Adding social metrics for startups...');
        
        for (let startupId = 1; startupId <= 6; startupId++) {
          // Base metrics that vary by startup
          let baseTwitter, baseLinkedIn, baseGithub;
          
          switch(startupId) {
            case 1: // TechNova
              baseTwitter = 8500;
              baseLinkedIn = 5200;
              baseGithub = 2800;
              break;
            case 2: // GreenEco
              baseTwitter = 3500;
              baseLinkedIn = 2100;
              baseGithub = 600;
              break;
            case 3: // FinEdge
              baseTwitter = 2200;
              baseLinkedIn = 1800;
              baseGithub = 450;
              break;
            case 4: // HealthPulse
              baseTwitter = 12500;
              baseLinkedIn = 9800;
              baseGithub = 1900;
              break;
            case 5: // QuantumCode
              baseTwitter = 6800;
              baseLinkedIn = 4900;
              baseGithub = 3600;
              break;
            case 6: // UrbanMobility
              baseTwitter = 15600;
              baseLinkedIn = 11200;
              baseGithub = 2200;
              break;
          }
          
          // Add Twitter followers
          await sql`
            INSERT INTO startup_social_metrics (
              startup_id,
              platform,
              metric_name,
              metric_value,
              collected_at
            ) VALUES (
              ${startupId},
              'Twitter',
              'Followers',
              ${baseTwitter},
              CURRENT_TIMESTAMP
            )
          `;
          
          // Add LinkedIn followers
          await sql`
            INSERT INTO startup_social_metrics (
              startup_id,
              platform,
              metric_name,
              metric_value,
              collected_at
            ) VALUES (
              ${startupId},
              'LinkedIn',
              'Followers',
              ${baseLinkedIn},
              CURRENT_TIMESTAMP
            )
          `;
          
          // Add GitHub stars
          await sql`
            INSERT INTO startup_social_metrics (
              startup_id,
              platform,
              metric_name,
              metric_value,
              collected_at
            ) VALUES (
              ${startupId},
              'GitHub',
              'Stars',
              ${baseGithub},
              CURRENT_TIMESTAMP
            )
          `;
        }
        console.log('Added social metrics for all startups');
        
        // Add founder social metrics
        console.log('Adding social metrics for founders...');
        
        for (let founderId = 1; founderId <= 9; founderId++) {
          // Base metrics that vary by founder
          let twitterFollowers, githubFollowers, linkedinConnections;
          
          // More prominent founders have higher social metrics
          switch(founderId) {
            case 1: // Sarah Chen
              twitterFollowers = 24500;
              githubFollowers = 3800;
              linkedinConnections = 9200;
              break;
            case 2: // Michael Rodriguez
              twitterFollowers = 18700;
              githubFollowers = 5600;
              linkedinConnections = 7800;
              break;
            case 3: // Emily Green
              twitterFollowers = 12300;
              githubFollowers = 1200;
              linkedinConnections = 6500;
              break;
            case 4: // David Kim
              twitterFollowers = 9800;
              githubFollowers = 2100;
              linkedinConnections = 5900;
              break;
            case 5: // Jennifer Zhang
              twitterFollowers = 16400;
              githubFollowers = 1500;
              linkedinConnections = 8300;
              break;
            case 6: // Robert Thompson
              twitterFollowers = 29800;
              githubFollowers = 4200;
              linkedinConnections = 11500;
              break;
            case 7: // Sophia Patel
              twitterFollowers = 14200;
              githubFollowers = 950;
              linkedinConnections = 7200;
              break;
            case 8: // Marcus Johnson
              twitterFollowers = 8500;
              githubFollowers = 3800;
              linkedinConnections = 6200;
              break;
            case 9: // Alex Rivera
              twitterFollowers = 32600;
              githubFollowers = 2900;
              linkedinConnections = 15800;
              break;
          }
          
          // Add Twitter followers
          await sql`
            INSERT INTO founder_social_metrics (
              founder_id,
              platform,
              metric_name,
              metric_value,
              collected_at
            ) VALUES (
              ${founderId},
              'Twitter',
              'Followers',
              ${twitterFollowers},
              CURRENT_TIMESTAMP
            )
          `;
          
          // Add GitHub followers
          await sql`
            INSERT INTO founder_social_metrics (
              founder_id,
              platform,
              metric_name,
              metric_value,
              collected_at
            ) VALUES (
              ${founderId},
              'GitHub',
              'Followers',
              ${githubFollowers},
              CURRENT_TIMESTAMP
            )
          `;
          
          // Add LinkedIn connections
          await sql`
            INSERT INTO founder_social_metrics (
              founder_id,
              platform,
              metric_name,
              metric_value,
              collected_at
            ) VALUES (
              ${founderId},
              'LinkedIn',
              'Connections',
              ${linkedinConnections},
              CURRENT_TIMESTAMP
            )
          `;
        }
        console.log('Added social metrics for all founders');
      }
      console.log('Database schema created and test data inserted successfully.');
    } catch (sqlError) {
      console.error('SQL Error:', sqlError);
    }
    
    console.log('Database check completed successfully!');
  } catch (error) {
    console.error('Error working with database:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Critical error:', err);
  process.exit(1);
});
`);

// Function to check if package is installed
function checkPackageInstalled(packageName) {
  try {
    // Check if module exists in node_modules
    require.resolve(packageName);
    console.log(`Package ${packageName} is already installed.`);
    return true;
  } catch (e) {
    console.log(`Package ${packageName} not found, installation required.`);
    return false;
  }
}

try {
  // Check for required packages
  const needDotenv = !checkPackageInstalled('dotenv');
  const needNeon = !checkPackageInstalled('@neondatabase/serverless');
  
  // Install only missing packages
  if (needDotenv || needNeon) {
    console.log('Installing missing dependencies using pnpm...');
    const packages = [];
    if (needDotenv) packages.push('dotenv');
    if (needNeon) packages.push('@neondatabase/serverless');
    
    // Use pnpm with correct flags
    execSync(`pnpm add ${packages.join(' ')}`, { 
      stdio: 'inherit',
      timeout: 60000 // 60 seconds timeout
    });
  }
  
  console.log('Running database check...');
  execSync(`node "${tempFilePath}"`, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL
    },
    timeout: 30000 // 30 seconds timeout
  });
  
  console.log('Database check completed!');
} catch (error) {
  console.error('Error executing script:', error);
  process.exit(1);
} finally {
  // Remove temporary file
  try {
    console.log('Removing temporary file...');
    unlinkSync(tempFilePath);
  } catch (err) {
    console.error('Failed to delete temporary file:', err);
  }
}

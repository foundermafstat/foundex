// Enhanced script for updating database schema and adding demo data
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function updateSchemaAndAddData() {
  try {
    console.log('Updating database schema and adding demo data...');
    
    // 1. Update the startups table with missing columns
    console.log('Updating startups table schema...');
    await sql`
      ALTER TABLE startups 
      ADD COLUMN IF NOT EXISTS github_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS coinbase_listed BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS coinbase_url VARCHAR(255)
    `;
    
    // 2. Create founder_startup table for many-to-many relationships
    console.log('Creating founder_startup table for many-to-many relationships...');
    await sql`
      CREATE TABLE IF NOT EXISTS founder_startup (
        id SERIAL PRIMARY KEY,
        founder_id INTEGER REFERENCES founders(id) ON DELETE CASCADE,
        startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
        role TEXT,
        joined_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(founder_id, startup_id)
      )
    `;
    
    // 3. Create startup_metrics_history table
    console.log('Creating startup_metrics_history table...');
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
    
    // 4. Create startup_social_metrics table
    console.log('Creating startup_social_metrics table...');
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
    
    // 5. Create founder_social_metrics table
    console.log('Creating founder_social_metrics table...');
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
    
    // 6. Create startup_financial_metrics table
    console.log('Creating startup_financial_metrics table...');
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
    
    // 7. Create startup_coinbase_data table
    console.log('Creating startup_coinbase_data table...');
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
    
    // 8. Create assessment_results table if not exists
    console.log('Creating assessment_results table if not exists...');
    await sql`
      CREATE TABLE IF NOT EXISTS assessment_results (
        id SERIAL PRIMARY KEY,
        startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
        overall_score INTEGER,
        team_score INTEGER,
        market_score INTEGER,
        product_score INTEGER,
        traction_score INTEGER,
        business_model_score INTEGER,
        competition_score INTEGER,
        funding_score INTEGER,
        comments TEXT,
        strengths TEXT[],
        weaknesses TEXT[],
        opportunities TEXT[],
        threats TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(startup_id, created_at)
      )
    `;
    
    // Now, let's update existing startups with social URLs and add new startups
    console.log('Updating existing startups and adding new ones...');
    
    // Update TechNova (1)
    await sql`
      UPDATE startups SET 
        github_url = 'https://github.com/technova',
        twitter_url = 'https://twitter.com/technova',
        linkedin_url = 'https://linkedin.com/company/technova',
        instagram_url = 'https://instagram.com/technova',
        facebook_url = 'https://facebook.com/technova',
        coinbase_listed = false,
        coinbase_url = null
      WHERE id = 1
    `;
    
    // Update GreenEco (2)
    await sql`
      UPDATE startups SET 
        github_url = 'https://github.com/greeneco',
        twitter_url = 'https://twitter.com/greeneco',
        linkedin_url = 'https://linkedin.com/company/greeneco',
        instagram_url = 'https://instagram.com/greeneco',
        facebook_url = 'https://facebook.com/greeneco',
        coinbase_listed = false,
        coinbase_url = null
      WHERE id = 2
    `;
    
    // Update FinEdge (3)
    await sql`
      UPDATE startups SET 
        github_url = 'https://github.com/finedge',
        twitter_url = 'https://twitter.com/finedge',
        linkedin_url = 'https://linkedin.com/company/finedge',
        instagram_url = 'https://instagram.com/finedge',
        facebook_url = 'https://facebook.com/finedge',
        coinbase_listed = true,
        coinbase_url = 'https://coinbase.com/price/finedge'
      WHERE id = 3
    `;
    
    // Add new startups
    console.log('Adding new startups...');
    await sql`
      INSERT INTO startups (name, description, website, founding_date, industry, funding_stage, total_funding, github_url, twitter_url, linkedin_url, instagram_url, facebook_url, coinbase_listed, coinbase_url)
      VALUES 
        ('HealthPulse', 'AI-powered health monitoring and diagnostics platform', 'https://healthpulse.io', '2020-06-18', 'HealthTech', 'Series B', 18000000, 'https://github.com/healthpulse', 'https://twitter.com/healthpulse', 'https://linkedin.com/company/healthpulse', 'https://instagram.com/healthpulse', 'https://facebook.com/healthpulse', false, null),
        ('QuantumCode', 'Quantum computing solutions for enterprise cryptography', 'https://quantumcode.tech', '2019-11-05', 'DeepTech', 'Series A', 7500000, 'https://github.com/quantumcode', 'https://twitter.com/quantumcode', 'https://linkedin.com/company/quantumcode', 'https://instagram.com/quantumcode', 'https://facebook.com/quantumcode', true, 'https://coinbase.com/price/quantumcode'),
        ('UrbanMobility', 'Smart city transportation infrastructure and analytics', 'https://urbanmobility.city', '2018-05-12', 'SmartCity', 'Series C', 45000000, 'https://github.com/urbanmobility', 'https://twitter.com/urbanmobility', 'https://linkedin.com/company/urbanmobility', 'https://instagram.com/urbanmobility', 'https://facebook.com/urbanmobility', false, null)
      ON CONFLICT (id) DO NOTHING
    `;
    
    // Add more founders
    console.log('Adding additional founders...');
    await sql`
      INSERT INTO founders (name, email, linkedin_url, twitter_url, github_url, instagram_url, facebook_url, bio)
      VALUES 
        ('Jennifer Zhang', 'jennifer@healthpulse.io', 'https://linkedin.com/in/jenniferzhang', 'https://twitter.com/jenniferzhang', 'https://github.com/jenniferzhang', 'https://instagram.com/jenniferzhang', 'https://facebook.com/jenniferzhang', 'Medical doctor with specialty in digital health solutions. Former CTO at MedTech Inc.'),
        ('Robert Thompson', 'robert@quantumcode.tech', 'https://linkedin.com/in/robertthompson', 'https://twitter.com/robertthompson', 'https://github.com/robertthompson', 'https://instagram.com/robertthompson', 'https://facebook.com/robertthompson', 'PhD in quantum physics from MIT with 15 years of research experience.'),
        ('Sophia Patel', 'sophia@urbanmobility.city', 'https://linkedin.com/in/sophiapatel', 'https://twitter.com/sophiapatel', 'https://github.com/sophiapatel', 'https://instagram.com/sophiapatel', 'https://facebook.com/sophiapatel', 'Urban planner and transportation expert with focus on sustainable city infrastructure.'),
        ('Marcus Johnson', 'marcus@urbanmobility.city', 'https://linkedin.com/in/marcusjohnson', 'https://twitter.com/marcusjohnson', 'https://github.com/marcusjohnson', 'https://instagram.com/marcusjohnson', 'https://facebook.com/marcusjohnson', 'Data scientist specializing in traffic pattern analysis and optimization algorithms.'),
        ('Alex Rivera', 'alex@consultant.com', 'https://linkedin.com/in/alexrivera', 'https://twitter.com/alexrivera', 'https://github.com/alexrivera', 'https://instagram.com/alexrivera', 'https://facebook.com/alexrivera', 'Startup advisor and angel investor with experience across multiple technology sectors.')
      ON CONFLICT DO NOTHING
    `;
    
    // Add founder-startup relationships (many-to-many)
    console.log('Creating founder-startup relationships...');
    await sql`
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
      ON CONFLICT DO NOTHING
    `;
    
    // Add assessments for all startups
    console.log('Adding assessments for all startups...');
    await sql`
      INSERT INTO assessment_results (startup_id, overall_score, team_score, market_score, product_score, traction_score, business_model_score, competition_score, funding_score, comments, strengths, weaknesses, opportunities, threats, created_at)
      VALUES 
        (1, 85, 92, 78, 88, 82, 76, 70, 80, 'Strong founding team with experience and technical expertise. Product has good traction and market fit. Competition is intensifying but the team has differentiated well.', 
        ARRAY['Experienced founding team', 'Strong product-market fit', 'Good user growth metrics', 'Scalable business model'], 
        ARRAY['High customer acquisition costs', 'Limited international presence'], 
        ARRAY['Expansion into enterprise market', 'Strategic partnerships with big tech companies', 'International growth'], 
        ARRAY['Increasing competition from well-funded startups', 'Regulatory challenges in certain markets'], 
        CURRENT_TIMESTAMP - INTERVAL '2 days'),
        
        (2, 72, 80, 85, 65, 60, 75, 65, 70, 'Novel solution in a growing market. Team has strong domain expertise but lacks scaling experience. Product is early but shows promise. Needs to improve traction metrics.', 
        ARRAY['Innovative eco-friendly technology', 'Strong market growth potential', 'Founder expertise in environmental science', 'Patent-pending technology'], 
        ARRAY['Early-stage product', 'Limited sales traction', 'Small team size'], 
        ARRAY['Corporate sustainability partnerships', 'Government grants and incentives', 'Growing consumer awareness of sustainability'], 
        ARRAY['Long sales cycles for B2B customers', 'Potential regulatory hurdles', 'Dependency on shipping industry changes'], 
        CURRENT_TIMESTAMP - INTERVAL '5 days'),
        
        (3, 68, 75, 80, 65, 50, 70, 60, 65, 'Interesting blockchain-based payment solution with potential for disruption. Team is small but technically strong. Early traction is promising but needs to demonstrate more user growth.', 
        ARRAY['Strong technical innovation', 'Lower transaction costs than competitors', 'First-mover advantage in specific markets'], 
        ARRAY['Very early stage', 'Limited user base', 'High regulatory uncertainty'], 
        ARRAY['Expansion into remittance corridors', 'Integration with existing financial platforms', 'Strategic fintech partnerships'], 
        ARRAY['Cryptocurrency market volatility', 'Increasing regulatory scrutiny', 'Competition from established payment providers'], 
        CURRENT_TIMESTAMP - INTERVAL '7 days'),
        
        (4, 89, 94, 90, 88, 85, 82, 75, 92, 'Exceptional healthcare technology with strong validation from medical institutions. Outstanding team with domain expertise. Strong traction and clear path to scale.', 
        ARRAY['Leading team in healthcare AI', 'Clinical validation from top institutions', 'Strong IP portfolio', 'Clear regulatory strategy'], 
        ARRAY['Long sales cycles in healthcare', 'High compliance costs', 'Custom integration requirements'], 
        ARRAY['Expansion into global markets', 'Telehealth revolution', 'Integration with electronic health records', 'Preventive health partnerships'], 
        ARRAY['Regulatory changes', 'Data privacy concerns', 'Healthcare system complexity'], 
        CURRENT_TIMESTAMP - INTERVAL '3 days'),
        
        (5, 83, 95, 80, 85, 70, 80, 75, 87, 'Cutting-edge quantum technology with strong potential in cryptography and security markets. World-class technical team. Early commercial traction showing promise.', 
        ARRAY['World-leading quantum computing expertise', 'Revolutionary technology', 'Strong IP position', 'Significant government interest'], 
        ARRAY['Complex technology with long development cycles', 'High R&D costs', 'Specialized talent requirements'], 
        ARRAY['Defense and intelligence contracts', 'Financial sector applications', 'Strategic partnerships with tech giants'], 
        ARRAY['Technology evolution risks', 'Competing quantum approaches', 'Talent retention challenges'], 
        CURRENT_TIMESTAMP - INTERVAL '6 days'),
        
        (6, 91, 88, 92, 90, 94, 89, 85, 90, 'Established urban mobility platform with impressive growth and market penetration. Strong unit economics and clear path to profitability. Well-positioned against competitors.', 
        ARRAY['Proven scalable business model', 'Strong city partnerships', 'Excellent user retention', 'Diversified revenue streams'], 
        ARRAY['High infrastructure costs', 'Regulatory complexity across markets', 'Weather dependency in some regions'], 
        ARRAY['Autonomous vehicle integration', 'Smart city initiatives', 'Mobility-as-a-service expansion', 'Corporate commute programs'], 
        ARRAY['Ride-sharing giants entering market', 'Regulatory changes in urban transportation', 'Public transit improvements reducing demand'], 
        CURRENT_TIMESTAMP - INTERVAL '4 days')
      ON CONFLICT DO NOTHING
    `;
    
    // Add financial metrics for all startups
    console.log('Adding financial metrics for all startups...');
    await sql`
      INSERT INTO startup_financial_metrics (startup_id, mrr, arr, cac, ltv, runway_months, burn_rate, growth_rate, churn_rate, created_at)
      VALUES 
        (1, 180000, 2160000, 120, 2200, 18, 280000, 15.5, 3.5, CURRENT_TIMESTAMP),
        (2, 35000, 420000, 85, 950, 11, 65000, 12.8, 5.2, CURRENT_TIMESTAMP),
        (3, 12000, 144000, 110, 750, 6, 45000, 9.2, 8.5, CURRENT_TIMESTAMP),
        (4, 650000, 7800000, 140, 3600, 24, 520000, 18.3, 2.2, CURRENT_TIMESTAMP),
        (5, 220000, 2640000, 170, 2800, 15, 350000, 14.0, 3.0, CURRENT_TIMESTAMP),
        (6, 1450000, 17400000, 95, 4500, 36, 850000, 22.5, 1.8, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING
    `;
    
    // Add Coinbase data for crypto startups
    console.log('Adding Coinbase data for applicable startups...');
    await sql`
      INSERT INTO startup_coinbase_data (startup_id, token_name, token_symbol, current_price, market_cap, volume_24h, price_change_24h, price_change_7d, created_at)
      VALUES 
        (3, 'FinEdge Token', 'FET', 1.24, 62000000, 3800000, 2.5, -3.8, CURRENT_TIMESTAMP),
        (5, 'Quantum Token', 'QTM', 8.65, 432500000, 25600000, -1.2, 6.5, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING
    `;
    
    // Add historical metrics for startups
    console.log('Adding historical metrics data...');
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
        const cac = Math.round(baseCAC * (0.95 + (i * 0.02))); // CAC generally increases over time
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
          ON CONFLICT (startup_id, date) DO NOTHING
        `;
      }
    }
    
    // Add social metrics for startups
    console.log('Adding social metrics for all startups...');
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
      
      // Add social metrics for this startup
      await sql`
        INSERT INTO startup_social_metrics (
          startup_id,
          platform,
          metric_name,
          metric_value,
          collected_at
        ) VALUES 
          (${startupId}, 'Twitter', 'Followers', ${baseTwitter}, CURRENT_TIMESTAMP),
          (${startupId}, 'LinkedIn', 'Followers', ${baseLinkedIn}, CURRENT_TIMESTAMP),
          (${startupId}, 'GitHub', 'Stars', ${baseGithub}, CURRENT_TIMESTAMP)
        ON CONFLICT DO NOTHING
      `;
    }
    
    // Add founder social metrics
    console.log('Adding social metrics for all founders...');
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
      
      // Add social metrics for this founder
      await sql`
        INSERT INTO founder_social_metrics (
          founder_id,
          platform,
          metric_name,
          metric_value,
          collected_at
        ) VALUES 
          (${founderId}, 'Twitter', 'Followers', ${twitterFollowers}, CURRENT_TIMESTAMP),
          (${founderId}, 'GitHub', 'Followers', ${githubFollowers}, CURRENT_TIMESTAMP),
          (${founderId}, 'LinkedIn', 'Connections', ${linkedinConnections}, CURRENT_TIMESTAMP)
        ON CONFLICT DO NOTHING
      `;
    }
    
    console.log('All database schema updates and demo data added successfully!');
  } catch (error) {
    console.error('Error updating schema or adding demo data:', error);
  }
}

// Run the function to update schema and add demo data
updateSchemaAndAddData();

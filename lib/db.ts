import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// Flag to track if we've already logged the missing DATABASE_URL warning
let hasLoggedMissingDbWarning = false

// Create a reusable SQL client with error handling
const createSqlClient = (): NeonQueryFunction<any, any> | null => {
  try {
    if (!process.env.DATABASE_URL) {
      if (!hasLoggedMissingDbWarning) {
        console.error("DATABASE_URL environment variable is not set")
        hasLoggedMissingDbWarning = true
      }
      return null
    }
    return neon(process.env.DATABASE_URL)
  } catch (error) {
    console.error("Error creating database connection:", error)
    return null
  }
}

// Initialize SQL client
const sql = createSqlClient()

export type Startup = {
  id: number
  name: string
  description: string | null
  website: string | null
  founding_date: string | null
  industry: string | null
  funding_stage: string | null
  total_funding: number | null
  created_at: string
  updated_at: string
  github_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  coinbase_listed: boolean | null
  coinbase_url: string | null
  assessment?: AssessmentResult | null
}

export type Founder = {
  id: number
  name: string
  email: string | null
  linkedin_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  github_url: string | null
  facebook_url: string | null
  bio: string | null
  startup_id: number
  created_at: string
  updated_at: string
}

export type SocialMetric = {
  id: number
  startup_id: number | null
  founder_id: number | null
  platform: string
  followers_count: number | null
  engagement_rate: number | null
  post_frequency: number | null
  sentiment_score: number | null
  collected_at: string
}

export type AssessmentResult = {
  id: number
  startup_id: number
  success_score: number
  overall_score?: number
  strengths: string | null
  weaknesses: string | null
  opportunities: string | null
  threats: string | null
  recommendations: string | null
  created_at: string
}

export type FounderSocialMetric = {
  id: number
  founder_id: number
  platform: string
  followers_count: number | null
  posts_count: number | null
  engagement_rate: number | null
  influence_score: number | null
  last_activity_date: string | null
  created_at: string
  updated_at: string
}

export type StartupSocialMetric = {
  id: number
  startup_id: number
  platform: string
  followers_count: number | null
  posts_count: number | null
  engagement_rate: number | null
  mentions_count: number | null
  sentiment_score: number | null
  created_at: string
  updated_at: string
}

export type StartupFinancialMetric = {
  id: number
  startup_id: number
  metric_date: string
  revenue: number | null
  burn_rate: number | null
  runway_months: number | null
  active_users: number | null
  conversion_rate: number | null
  customer_acquisition_cost: number | null
  lifetime_value: number | null
  monthly_recurring_revenue: number | null
  year_over_year_growth: number | null
  created_at: string
  updated_at: string
}

export type StartupMetricsHistory = {
  id: number
  startup_id: number
  metric_type: string
  metric_name: string
  metric_value: number | null
  record_date: string
  created_at: string
}

export type StartupCoinbaseData = {
  id: number
  startup_id: number
  token_symbol: string | null
  token_name: string | null
  market_cap: number | null
  circulating_supply: number | null
  total_supply: number | null
  current_price: number | null
  all_time_high: number | null
  all_time_high_date: string | null
  listed_date: string | null
  trading_volume_24h: number | null
  price_change_24h: number | null
  price_change_7d: number | null
  price_change_30d: number | null
  last_updated: string
}

// Check if database connection is available
export function isDatabaseConnected(): boolean {
  return sql !== null
}

// Get the reason why the database is not connected
export function getDatabaseConnectionError(): string | null {
  if (!process.env.DATABASE_URL) {
    return "DATABASE_URL environment variable is not set"
  }

  if (!sql) {
    return "Failed to establish database connection"
  }

  return null
}

// Mock data for when database is not available
export const mockStartups: Startup[] = [
  {
    id: 1,
    name: "TechNova (Mock)",
    description: "AI-powered productivity platform for remote teams",
    website: "https://technova.io",
    founding_date: "2020-03-15",
    industry: "SaaS",
    funding_stage: "Series A",
    total_funding: 5000000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    github_url: "https://github.com/technova",
    twitter_url: "https://twitter.com/technova",
    linkedin_url: "https://linkedin.com/company/technova",
    instagram_url: "https://instagram.com/technova",
    facebook_url: "https://facebook.com/technova",
    coinbase_listed: true,
    coinbase_url: "https://coinbase.com/technova",
  },
  {
    id: 2,
    name: "GreenEco (Mock)",
    description: "Sustainable packaging solutions for e-commerce",
    website: "https://greeneco.com",
    founding_date: "2019-07-22",
    industry: "CleanTech",
    funding_stage: "Seed",
    total_funding: 750000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    github_url: "https://github.com/greeneco",
    twitter_url: "https://twitter.com/greeneco",
    linkedin_url: "https://linkedin.com/company/greeneco",
    instagram_url: "https://instagram.com/greeneco",
    facebook_url: "https://facebook.com/greeneco",
    coinbase_listed: false,
    coinbase_url: null,
  },
  {
    id: 3,
    name: "FinEdge (Mock)",
    description: "Decentralized finance platform for cross-border payments",
    website: "https://finedge.io",
    founding_date: "2021-01-10",
    industry: "FinTech",
    funding_stage: "Pre-seed",
    total_funding: 300000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    github_url: "https://github.com/finedge",
    twitter_url: "https://twitter.com/finedge",
    linkedin_url: "https://linkedin.com/company/finedge",
    instagram_url: "https://instagram.com/finedge",
    facebook_url: "https://facebook.com/finedge",
    coinbase_listed: true,
    coinbase_url: "https://coinbase.com/finedge",
  },
]

export const mockFounders: Founder[] = [
  {
    id: 1,
    name: "Sarah Chen (Mock)",
    email: "sarah@technova.io",
    linkedin_url: "https://linkedin.com/in/sarahchen",
    twitter_url: "https://twitter.com/sarahchen",
    instagram_url: "https://instagram.com/sarahchen",
    github_url: "https://github.com/sarahchen",
    facebook_url: "https://facebook.com/sarahchen",
    bio: "Former Google engineer with 10+ years experience in AI and machine learning. PhD in Computer Science from Stanford.",
    startup_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Michael Rodriguez (Mock)",
    email: "michael@technova.io",
    linkedin_url: "https://linkedin.com/in/michaelrodriguez",
    twitter_url: "https://twitter.com/mrodriguez",
    instagram_url: null,
    github_url: "https://github.com/michaelrodriguez",
    facebook_url: "https://facebook.com/michaelrodriguez",
    bio: "Serial entrepreneur with two successful exits in the SaaS space. Previously CTO at EnterpriseCloud.",
    startup_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Aisha Patel (Mock)",
    email: "aisha@greeneco.com",
    linkedin_url: "https://linkedin.com/in/aishapatel",
    twitter_url: "https://twitter.com/aishapatel",
    instagram_url: "https://instagram.com/aishapatel",
    github_url: "https://github.com/aishapatel",
    facebook_url: "https://facebook.com/aishapatel",
    bio: "Environmental scientist turned entrepreneur, passionate about sustainable solutions. Masters in Environmental Engineering from MIT.",
    startup_id: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Check if a specific table exists
async function tableExists(tableName: string): Promise<boolean> {
  try {
    if (!sql) return false

    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      )
    `
    return result[0]?.exists || false
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error)
    return false
  }
}

// Initialize database schema
export async function initializeDatabase() {
  try {
    if (!sql) {
      console.error("Cannot initialize database: Database connection not available")
      return false
    }

    // Check and create startups table
    const startupsExists = await tableExists("startups")
    if (!startupsExists) {
      await sql`
        CREATE TABLE IF NOT EXISTS startups (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          website VARCHAR(255),
          founding_date DATE,
          industry VARCHAR(100),
          funding_stage VARCHAR(100),
          total_funding NUMERIC,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          github_url VARCHAR(255),
          twitter_url VARCHAR(255),
          linkedin_url VARCHAR(255),
          instagram_url VARCHAR(255),
          facebook_url VARCHAR(255),
          coinbase_listed BOOLEAN,
          coinbase_url VARCHAR(255)
        )
      `
      console.log("Created startups table")
    }

    // Check and create founders table
    const foundersExists = await tableExists("founders")
    if (!foundersExists) {
      await sql`
        CREATE TABLE IF NOT EXISTS founders (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          linkedin_url VARCHAR(255),
          twitter_url VARCHAR(255),
          instagram_url VARCHAR(255),
          github_url VARCHAR(255),
          facebook_url VARCHAR(255),
          bio TEXT,
          startup_id INTEGER REFERENCES startups(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Created founders table")
    }

    // Check and create social_metrics table
    const socialMetricsExists = await tableExists("social_metrics")
    if (!socialMetricsExists) {
      await sql`
        CREATE TABLE IF NOT EXISTS social_metrics (
          id SERIAL PRIMARY KEY,
          startup_id INTEGER REFERENCES startups(id),
          founder_id INTEGER REFERENCES founders(id),
          platform VARCHAR(100) NOT NULL,
          followers_count INTEGER,
          engagement_rate NUMERIC,
          post_frequency NUMERIC,
          sentiment_score NUMERIC,
          collected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Created social_metrics table")
    }

    // Check and create assessment_results table
    const assessmentResultsExists = await tableExists("assessment_results")
    if (!assessmentResultsExists) {
      await sql`
        CREATE TABLE IF NOT EXISTS assessment_results (
          id SERIAL PRIMARY KEY,
          startup_id INTEGER REFERENCES startups(id) NOT NULL,
          success_score NUMERIC NOT NULL,
          overall_score NUMERIC,
          strengths TEXT,
          weaknesses TEXT,
          opportunities TEXT,
          threats TEXT,
          recommendations TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Created assessment_results table")
    }

    // Check and create chat_history table
    const chatHistoryExists = await tableExists("chat_history")
    if (!chatHistoryExists) {
      await sql`
        CREATE TABLE IF NOT EXISTS chat_history (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          user_message TEXT NOT NULL,
          ai_response TEXT NOT NULL,
          startup_id INTEGER REFERENCES startups(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Created chat_history table")
    }

    // Check and create founder_social_metrics table
    const founderSocialMetricsExists = await tableExists("founder_social_metrics")
    if (!founderSocialMetricsExists) {
      await sql`
        CREATE TABLE IF NOT EXISTS founder_social_metrics (
          id SERIAL PRIMARY KEY,
          founder_id INTEGER REFERENCES founders(id) NOT NULL,
          platform VARCHAR(100) NOT NULL,
          followers_count INTEGER,
          posts_count INTEGER,
          engagement_rate NUMERIC,
          influence_score NUMERIC,
          last_activity_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Created founder_social_metrics table")
    }

    // Check and create startup_social_metrics table
    const startupSocialMetricsExists = await tableExists("startup_social_metrics")
    if (!startupSocialMetricsExists) {
      await sql`
        CREATE TABLE IF NOT EXISTS startup_social_metrics (
          id SERIAL PRIMARY KEY,
          startup_id INTEGER REFERENCES startups(id) NOT NULL,
          platform VARCHAR(100) NOT NULL,
          followers_count INTEGER,
          posts_count INTEGER,
          engagement_rate NUMERIC,
          mentions_count INTEGER,
          sentiment_score NUMERIC,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Created startup_social_metrics table")
    }

    // Check and create startup_financial_metrics table
    const startupFinancialMetricsExists = await tableExists("startup_financial_metrics")
    if (!startupFinancialMetricsExists) {
      await sql`
        CREATE TABLE IF NOT EXISTS startup_financial_metrics (
          id SERIAL PRIMARY KEY,
          startup_id INTEGER REFERENCES startups(id) NOT NULL,
          metric_date DATE NOT NULL,
          revenue NUMERIC,
          burn_rate NUMERIC,
          runway_months INTEGER,
          active_users INTEGER,
          conversion_rate NUMERIC,
          customer_acquisition_cost NUMERIC,
          lifetime_value NUMERIC,
          monthly_recurring_revenue NUMERIC,
          year_over_year_growth NUMERIC,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Created startup_financial_metrics table")
    }

    // Check and create startup_metrics_history table
    const startupMetricsHistoryExists = await tableExists("startup_metrics_history")
    if (!startupMetricsHistoryExists) {
      await sql`
        CREATE TABLE IF NOT EXISTS startup_metrics_history (
          id SERIAL PRIMARY KEY,
          startup_id INTEGER REFERENCES startups(id) NOT NULL,
          metric_type VARCHAR(100) NOT NULL,
          metric_name VARCHAR(255) NOT NULL,
          metric_value NUMERIC,
          record_date DATE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Created startup_metrics_history table")
    }

    // Check and create startup_coinbase_data table
    const startupCoinbaseDataExists = await tableExists("startup_coinbase_data")
    if (!startupCoinbaseDataExists) {
      await sql`
        CREATE TABLE IF NOT EXISTS startup_coinbase_data (
          id SERIAL PRIMARY KEY,
          startup_id INTEGER REFERENCES startups(id) NOT NULL,
          token_symbol VARCHAR(100),
          token_name VARCHAR(255),
          market_cap NUMERIC,
          circulating_supply NUMERIC,
          total_supply NUMERIC,
          current_price NUMERIC,
          all_time_high NUMERIC,
          all_time_high_date DATE,
          listed_date DATE,
          trading_volume_24h NUMERIC,
          price_change_24h NUMERIC,
          price_change_7d NUMERIC,
          price_change_30d NUMERIC,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Created startup_coinbase_data table")
    }

    console.log("Database schema initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing database schema:", error)
    return false
  }
}

// Check if all required tables exist
export async function tablesExist() {
  try {
    if (!sql) return false

    const startupsExists = await tableExists("startups")
    const foundersExists = await tableExists("founders")
    const socialMetricsExists = await tableExists("social_metrics")
    const assessmentResultsExists = await tableExists("assessment_results")
    const chatHistoryExists = await tableExists("chat_history")
    const founderSocialMetricsExists = await tableExists("founder_social_metrics")
    const startupSocialMetricsExists = await tableExists("startup_social_metrics")
    const startupFinancialMetricsExists = await tableExists("startup_financial_metrics")
    const startupMetricsHistoryExists = await tableExists("startup_metrics_history")
    const startupCoinbaseDataExists = await tableExists("startup_coinbase_data")

    return (
      startupsExists &&
      foundersExists &&
      socialMetricsExists &&
      assessmentResultsExists &&
      chatHistoryExists &&
      founderSocialMetricsExists &&
      startupSocialMetricsExists &&
      startupFinancialMetricsExists &&
      startupMetricsHistoryExists &&
      startupCoinbaseDataExists
    )
  } catch (error) {
    console.error("Error checking if tables exist:", error)
    return false
  }
}

// Wrap database operations in try/catch blocks
export async function getStartups(): Promise<Startup[]> {
  try {
    if (!sql) return mockStartups

    // Check if tables exist, if not initialize them
    const exists = await tableExists("startups")
    if (!exists) {
      await initializeDatabase()
      return mockStartups
    }

    return await sql`SELECT * FROM startups ORDER BY name`
  } catch (error) {
    console.error("Error fetching startups:", error)
    return mockStartups
  }
}

export async function getStartupById(id: number): Promise<Startup | null> {
  try {
    if (!sql) return mockStartups.find((s) => s.id === id) || null

    // Check if tables exist, if not initialize them
    const exists = await tableExists("startups")
    if (!exists) {
      await initializeDatabase()
      return mockStartups.find((s) => s.id === id) || null
    }

    const startups = await sql<Startup[]>`SELECT * FROM startups WHERE id = ${id}`
    return startups.length > 0 ? startups[0] : null
  } catch (error) {
    console.error(`Error fetching startup with id ${id}:`, error)
    return mockStartups.find((s) => s.id === id) || null
  }
}

export async function getFounders(): Promise<Founder[]> {
  try {
    if (!sql) return mockFounders

    // Check if tables exist, if not initialize them
    const exists = await tableExists("founders")
    if (!exists) {
      await initializeDatabase()
      return mockFounders
    }

    return await sql`SELECT * FROM founders ORDER BY name`
  } catch (error) {
    console.error("Error fetching founders:", error)
    return mockFounders
  }
}

export async function getFounderById(id: number): Promise<Founder | null> {
  try {
    if (!sql) return mockFounders.find((f) => f.id === id) || null

    // Check if tables exist, if not initialize them
    const exists = await tableExists("founders")
    if (!exists) {
      await initializeDatabase()
      return mockFounders.find((f) => f.id === id) || null
    }

    const founders = await sql<Founder[]>`SELECT * FROM founders WHERE id = ${id}`
    return founders.length > 0 ? founders[0] : null
  } catch (error) {
    console.error(`Error fetching founder with id ${id}:`, error)
    return mockFounders.find((f) => f.id === id) || null
  }
}

export async function getFoundersByStartupId(startupId: number): Promise<Founder[]> {
  try {
    if (!sql) return mockFounders.filter((f) => f.startup_id === startupId)

    // Check if tables exist, if not initialize them
    const exists = await tableExists("founders")
    if (!exists) {
      await initializeDatabase()
      return mockFounders.filter((f) => f.startup_id === startupId)
    }

    return await sql`SELECT * FROM founders WHERE startup_id = ${startupId} ORDER BY name`
  } catch (error) {
    console.error(`Error fetching founders for startup id ${startupId}:`, error)
    return mockFounders.filter((f) => f.startup_id === startupId)
  }
}

export async function getSocialMetricsByStartupId(startupId: number): Promise<SocialMetric[]> {
  try {
    if (!sql) return []

    // Check if tables exist, if not initialize them
    const exists = await tableExists("social_metrics")
    if (!exists) {
      await initializeDatabase()
      return []
    }

    return await sql`SELECT * FROM social_metrics WHERE startup_id = ${startupId} ORDER BY platform, collected_at DESC`
  } catch (error) {
    console.error(`Error fetching social metrics for startup id ${startupId}:`, error)
    return []
  }
}

export async function getSocialMetricsByFounderId(founderId: number): Promise<SocialMetric[]> {
  try {
    if (!sql) return []

    // Check if tables exist, if not initialize them
    const exists = await tableExists("social_metrics")
    if (!exists) {
      await initializeDatabase()
      return []
    }

    return await sql`SELECT * FROM social_metrics WHERE founder_id = ${founderId} ORDER BY platform, collected_at DESC`
  } catch (error) {
    console.error(`Error fetching social metrics for founder id ${founderId}:`, error)
    return []
  }
}

export async function getAssessmentByStartupId(startupId: number): Promise<AssessmentResult | null> {
  try {
    if (!sql) return null

    // Check if tables exist, if not initialize them
    const exists = await tableExists("assessment_results")
    if (!exists) {
      await initializeDatabase()
      return null
    }

    const results = await sql<AssessmentResult[]>`
      SELECT * FROM assessment_results 
      WHERE startup_id = ${startupId} 
      ORDER BY created_at DESC 
      LIMIT 1
    `
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error(`Error fetching assessment for startup id ${startupId}:`, error)
    return null
  }
}

export async function getStartupSocialMetricsById(startupId: number): Promise<StartupSocialMetric[]> {
  try {
    if (!sql) return []

    // Check if tables exist, if not initialize them
    const exists = await tableExists("startup_social_metrics")
    if (!exists) {
      await initializeDatabase()
      return []
    }

    return await sql`SELECT * FROM startup_social_metrics WHERE startup_id = ${startupId} ORDER BY platform, created_at DESC`
  } catch (error) {
    console.error(`Error fetching startup social metrics for id ${startupId}:`, error)
    return []
  }
}

export async function getFounderSocialMetricsById(founderId: number): Promise<FounderSocialMetric[]> {
  try {
    if (!sql) return []

    // Check if tables exist, if not initialize them
    const exists = await tableExists("founder_social_metrics")
    if (!exists) {
      await initializeDatabase()
      return []
    }

    return await sql`SELECT * FROM founder_social_metrics WHERE founder_id = ${founderId} ORDER BY platform, created_at DESC`
  } catch (error) {
    console.error(`Error fetching founder social metrics for id ${founderId}:`, error)
    return []
  }
}

export async function getStartupFinancialMetricsById(startupId: number): Promise<StartupFinancialMetric[]> {
  try {
    if (!sql) return []

    // Check if tables exist, if not initialize them
    const exists = await tableExists("startup_financial_metrics")
    if (!exists) {
      await initializeDatabase()
      return []
    }

    return await sql`SELECT * FROM startup_financial_metrics WHERE startup_id = ${startupId} ORDER BY metric_date DESC`
  } catch (error) {
    console.error(`Error fetching financial metrics for startup id ${startupId}:`, error)
    return []
  }
}

export async function getStartupMetricsHistoryById(startupId: number): Promise<StartupMetricsHistory[]> {
  try {
    if (!sql) return []

    // Check if tables exist, if not initialize them
    const exists = await tableExists("startup_metrics_history")
    if (!exists) {
      await initializeDatabase()
      return []
    }

    return await sql`SELECT * FROM startup_metrics_history WHERE startup_id = ${startupId} ORDER BY record_date DESC`
  } catch (error) {
    console.error(`Error fetching metrics history for startup id ${startupId}:`, error)
    return []
  }
}

export async function getStartupCoinbaseDataById(startupId: number): Promise<StartupCoinbaseData | null> {
  try {
    if (!sql) return null

    // Check if tables exist, if not initialize them
    const exists = await tableExists("startup_coinbase_data")
    if (!exists) {
      await initializeDatabase()
      return null
    }

    const results = await sql<StartupCoinbaseData[]>`
      SELECT * FROM startup_coinbase_data 
      WHERE startup_id = ${startupId} 
      ORDER BY last_updated DESC 
      LIMIT 1
    `
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error(`Error fetching Coinbase data for startup id ${startupId}:`, error)
    return null
  }
}

export async function saveChatMessage(sessionId: string, userMessage: string, aiResponse: string, startupId?: number) {
  try {
    if (!sql) {
      console.error("Cannot save chat message: Database connection not available")
      return null
    }

    // Check if tables exist, if not initialize them
    const exists = await tableExists("chat_history")
    if (!exists) {
      await initializeDatabase()
    }

    return await sql`
      INSERT INTO chat_history (session_id, user_message, ai_response, startup_id)
      VALUES (${sessionId}, ${userMessage}, ${aiResponse}, ${startupId || null})
    `
  } catch (error) {
    console.error("Error saving chat message:", error)
    return null
  }
}

export async function getStartupByName(name: string): Promise<Startup | null> {
  try {
    if (!sql) {
      // Возвращаем мок данные, если нет подключения к БД
      const mockResult = mockStartups.find(
        (startup) => startup.name.toLowerCase().includes(name.toLowerCase())
      );
      return mockResult || null;
    }

    // Check if tables exist, if not initialize them
    const exists = await tableExists("startups");
    if (!exists) {
      await initializeDatabase();
      return null;
    }

    // Используем ILIKE для регистронезависимого поиска в PostgreSQL
    const results = await sql<Startup[]>`
      SELECT * FROM startups 
      WHERE name ILIKE ${'%' + name + '%'} 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    if (results.length === 0) {
      return null;
    }

    // Получаем оценку для стартапа, если она есть
    const assessment = await getAssessmentByStartupId(results[0].id);
    
    return {
      ...results[0],
      assessment
    };
  } catch (error) {
    console.error(`Error fetching startup by name "${name}":`, error);
    return null;
  }
}

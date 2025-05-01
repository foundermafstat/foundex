export interface Startup {
  id: string;
  name: string;
  description?: string;
  founding_date?: string;
  funding_stage?: string;
  total_funding?: number;
  employees?: number;
  website?: string;
  location?: string;
  industry?: string;
  tech_stack?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    crunchbase?: string;
  };
  founders?: Array<{
    id: string;
    name: string;
    role?: string;
    bio?: string;
    avatar?: string;
    social_links?: {
      twitter?: string;
      linkedin?: string;
    };
  }>;
  financial_metrics?: {
    cac?: number;
    ltv?: number;
    mrr?: number;
    conversion_rate?: number;
    churn_rate?: number;
  };
}

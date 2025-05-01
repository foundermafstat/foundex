import { NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConnected } from "@/lib/db";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    // Check if database is connected
    if (!isDatabaseConnected()) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection not available",
          message: "Please check your DATABASE_URL environment variable and database configuration.",
        },
        { status: 200 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL environment variable is not set",
        },
        { status: 200 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    // Insert new startups with detailed data
    console.log("Inserting new startups with detailed data...");

    // 1. First startup: AI Research Company
    const aiResearch = await sql`
      INSERT INTO startups (
        name, 
        description, 
        website, 
        founding_date, 
        industry, 
        funding_stage, 
        total_funding,
        github_url,
        twitter_url,
        linkedin_url,
        instagram_url,
        facebook_url,
        coinbase_listed,
        coinbase_url
      )
      VALUES (
        'Quantum Mind AI', 
        'Advanced neural network research and quantum computing applications for enterprise', 
        'https://quantummindai.tech', 
        '2022-03-15', 
        'Artificial Intelligence', 
        'Series A', 
        18500000,
        'https://github.com/quantummindai',
        'https://twitter.com/quantummindai',
        'https://linkedin.com/company/quantummindai',
        'https://instagram.com/quantummindai',
        'https://facebook.com/quantummindai',
        false,
        null
      )
      RETURNING id, name
    `;

    const aiResearchId = aiResearch[0].id;

    // Add founders for AI Research
    await sql`
      INSERT INTO founders (
        name, 
        email, 
        linkedin_url, 
        twitter_url, 
        github_url, 
        bio, 
        startup_id
      )
      VALUES (
        'Dr. Elena Vasquez', 
        'elena@quantummindai.tech', 
        'https://linkedin.com/in/elenavasquez', 
        'https://twitter.com/elenavasquez', 
        'https://github.com/elena-vasquez', 
        'PhD in Machine Learning from MIT, former research scientist at DeepMind with over 15 published papers on neural networks', 
        ${aiResearchId}
      )
    `;

    await sql`
      INSERT INTO founders (
        name, 
        email, 
        linkedin_url, 
        twitter_url, 
        github_url, 
        bio, 
        startup_id
      )
      VALUES (
        'Marcus Chen', 
        'marcus@quantummindai.tech', 
        'https://linkedin.com/in/marcuschen', 
        'https://twitter.com/marcuschen', 
        'https://github.com/marcus-chen', 
        'Former VP of Engineering at Google AI. MS in Computer Science from Stanford. Led teams developing large language models.', 
        ${aiResearchId}
      )
    `;

    // Add metrics for AI Research
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
        ${aiResearchId}, 
        'Twitter', 
        45200, 
        876, 
        4.7, 
        1245, 
        4.2
      )
    `;

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
        ${aiResearchId}, 
        ${new Date().toISOString().split('T')[0]}, 
        780000, 
        120000, 
        18, 
        32500, 
        8.3, 
        95, 
        1200, 
        350000, 
        78.5
      )
    `;

    // Add assessment for AI Research
    await sql`
      INSERT INTO assessment_results (
        startup_id, 
        success_score, 
        strengths, 
        weaknesses, 
        opportunities, 
        threats, 
        recommendations
      )
      VALUES (
        ${aiResearchId}, 
        9.1, 
        'World-class research team; Strong IP portfolio; Significant funding; Enterprise partnerships; Advanced technology stack', 
        'Limited commercial products; High operational costs; Narrow market focus; Research-heavy culture', 
        'Growing enterprise AI adoption; Government contracts; Strategic partnerships; Licensing opportunities', 
        'Intense competition from tech giants; Changing AI regulations; Talent acquisition challenges', 
        'Develop commercial application team; Create product roadmap; Secure additional patents; Build strategic partnerships'
      )
    `;

    // 2. Second startup: Sustainable Energy
    const cleanEnergy = await sql`
      INSERT INTO startups (
        name, 
        description, 
        website, 
        founding_date, 
        industry, 
        funding_stage, 
        total_funding,
        github_url,
        twitter_url,
        linkedin_url,
        instagram_url,
        facebook_url,
        coinbase_listed,
        coinbase_url
      )
      VALUES (
        'SolarFlow Energy', 
        'Revolutionary solar energy storage technology for residential and commercial applications', 
        'https://solarflowenergy.com', 
        '2021-05-22', 
        'CleanTech', 
        'Series B', 
        42700000,
        'https://github.com/solarflowenergy',
        'https://twitter.com/solarflowenergy',
        'https://linkedin.com/company/solarflowenergy',
        'https://instagram.com/solarflowenergy',
        'https://facebook.com/solarflowenergy',
        false,
        null
      )
      RETURNING id, name
    `;

    const cleanEnergyId = cleanEnergy[0].id;

    // Add founders for Clean Energy
    await sql`
      INSERT INTO founders (
        name, 
        email, 
        linkedin_url, 
        twitter_url, 
        github_url, 
        bio, 
        startup_id
      )
      VALUES (
        'Akira Tanaka', 
        'akira@solarflowenergy.com', 
        'https://linkedin.com/in/akiratanaka', 
        'https://twitter.com/akiratanaka', 
        'https://github.com/akira-tanaka', 
        'PhD in Material Science from Tokyo University. Former researcher at Tesla Energy. Expert in energy storage solutions.', 
        ${cleanEnergyId}
      )
    `;

    await sql`
      INSERT INTO founders (
        name, 
        email, 
        linkedin_url, 
        twitter_url, 
        github_url, 
        bio, 
        startup_id
      )
      VALUES (
        'Jessica Martinez', 
        'jessica@solarflowenergy.com', 
        'https://linkedin.com/in/jessicamartinez', 
        'https://twitter.com/jessicamartinez', 
        'https://github.com/jessica-martinez', 
        'MBA from Harvard. Former VP of Operations at SunPower. Expert in scaling clean energy companies and securing funding.', 
        ${cleanEnergyId}
      )
    `;

    // Add metrics for Clean Energy
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
        ${cleanEnergyId}, 
        'Twitter', 
        68500, 
        1245, 
        5.2, 
        2780, 
        4.5
      )
    `;

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
        ${cleanEnergyId}, 
        ${new Date().toISOString().split('T')[0]}, 
        1250000, 
        180000, 
        22, 
        4850, 
        12.7, 
        350, 
        15000, 
        420000, 
        115.2
      )
    `;

    // Add assessment for Clean Energy
    await sql`
      INSERT INTO assessment_results (
        startup_id, 
        success_score, 
        strengths, 
        weaknesses, 
        opportunities, 
        threats, 
        recommendations
      )
      VALUES (
        ${cleanEnergyId}, 
        8.7, 
        'Patented storage technology; Strong industry partnerships; Solid unit economics; Experienced leadership team; Proven environmental impact', 
        'Manufacturing capacity limitations; Supply chain vulnerabilities; Long sales cycles; High customer acquisition costs', 
        'Clean energy incentives; Growing residential solar market; Corporate sustainability goals; International expansion', 
        'Regulatory changes; Established competitors; Raw material price fluctuations; Technology obsolescence risk', 
        'Secure strategic manufacturing partners; Diversify supply chain; Develop direct-to-consumer sales channel; Focus on customer ROI metrics'
      )
    `;

    // 3. Third startup: Health Tech
    const healthTech = await sql`
      INSERT INTO startups (
        name, 
        description, 
        website, 
        founding_date, 
        industry, 
        funding_stage, 
        total_funding,
        github_url,
        twitter_url,
        linkedin_url,
        instagram_url,
        facebook_url,
        coinbase_listed,
        coinbase_url
      )
      VALUES (
        'MedGenomics', 
        'AI-powered genomic analysis platform for personalized medicine and clinical diagnostics', 
        'https://medgenomics.health', 
        '2020-11-03', 
        'HealthTech', 
        'Series A', 
        23800000,
        'https://github.com/medgenomics',
        'https://twitter.com/medgenomics',
        'https://linkedin.com/company/medgenomics',
        'https://instagram.com/medgenomics',
        'https://facebook.com/medgenomics',
        false,
        null
      )
      RETURNING id, name
    `;

    const healthTechId = healthTech[0].id;

    // Add founders for Health Tech
    await sql`
      INSERT INTO founders (
        name, 
        email, 
        linkedin_url, 
        twitter_url, 
        github_url, 
        bio, 
        startup_id
      )
      VALUES (
        'Dr. Aisha Johnson', 
        'aisha@medgenomics.health', 
        'https://linkedin.com/in/aishajohnson', 
        'https://twitter.com/aishajohnson', 
        'https://github.com/aisha-johnson', 
        'MD-PhD in Genomic Medicine from Johns Hopkins. Former research director at the Human Genome Project. Published author on clinical genomics.', 
        ${healthTechId}
      )
    `;

    await sql`
      INSERT INTO founders (
        name, 
        email, 
        linkedin_url, 
        twitter_url, 
        github_url, 
        bio, 
        startup_id
      )
      VALUES (
        'Dr. Raj Patel', 
        'raj@medgenomics.health', 
        'https://linkedin.com/in/rajpatel', 
        'https://twitter.com/rajpatel', 
        'https://github.com/raj-patel', 
        'PhD in Bioinformatics from Stanford. Former lead developer at 23andMe. Expert in machine learning applications for genomic data analysis.', 
        ${healthTechId}
      )
    `;

    // Add metrics for Health Tech
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
        ${healthTechId}, 
        'Twitter', 
        32400, 
        543, 
        3.8, 
        980, 
        4.7
      )
    `;

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
        ${healthTechId}, 
        ${new Date().toISOString().split('T')[0]}, 
        950000, 
        220000, 
        16, 
        78, 
        24.5, 
        12500, 
        180000, 
        580000, 
        92.4
      )
    `;

    // Add assessment for Health Tech
    await sql`
      INSERT INTO assessment_results (
        startup_id, 
        success_score, 
        strengths, 
        weaknesses, 
        opportunities, 
        threats, 
        recommendations
      )
      VALUES (
        ${healthTechId}, 
        8.9, 
        'Cutting-edge AI genomics platform; Strong clinical validation; Elite scientific team; Healthcare partnerships; Regulatory compliance', 
        'Long sales cycles with healthcare institutions; High development costs; Complex implementation; Limited geographic reach', 
        'Precision medicine growth; Hospital digitization trends; International expansion; Research partnerships; Telehealth integration', 
        'Healthcare data regulations; Enterprise solution competition; Healthcare budget constraints; Privacy concerns', 
        'Develop modular implementation approach; Create clear ROI metrics for healthcare providers; Expand remote deployment capabilities; Pursue strategic research partnerships'
      )
    `;

    return NextResponse.json({
      success: true,
      message: "Added three startups with detailed information and metrics",
      data: {
        startups: 3,
        founders: 6,
        metrics: 6,
        assessments: 3
      }
    });
  } catch (error) {
    console.error("Error adding startups:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add startups",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }
    );
  }
}

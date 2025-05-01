import { neon } from "@neondatabase/serverless"

export async function seedDatabase() {
  console.log("Starting database seeding...")

  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set")
      return {
        error: "DATABASE_URL environment variable is not set",
        startups: 0,
        founders: 0,
        socialMetrics: 0,
        assessments: 0,
      }
    }

    const sql = neon(process.env.DATABASE_URL)

    // Clear existing data to avoid duplicates
    await sql`TRUNCATE TABLE assessment_results CASCADE`
    await sql`TRUNCATE TABLE social_metrics CASCADE`
    await sql`TRUNCATE TABLE founders CASCADE`
    await sql`TRUNCATE TABLE startups CASCADE`

    console.log("Existing data cleared. Inserting new data...")

    // Insert startups
    const startups = await sql`
      INSERT INTO startups (name, description, website, founding_date, industry, funding_stage, total_funding)
      VALUES 
        ('TechNova', 'AI-powered productivity platform for remote teams', 'https://technova.io', '2020-03-15', 'SaaS', 'Series A', 5000000),
        ('GreenEco', 'Sustainable packaging solutions for e-commerce', 'https://greeneco.com', '2019-07-22', 'CleanTech', 'Seed', 750000),
        ('FinEdge', 'Decentralized finance platform for cross-border payments', 'https://finedge.io', '2021-01-10', 'FinTech', 'Pre-seed', 300000),
        ('MediSync', 'Healthcare coordination platform for hospitals and clinics', 'https://medisync.health', '2018-05-03', 'HealthTech', 'Series B', 12500000),
        ('EdTechPro', 'AI-driven personalized learning platform for K-12 education', 'https://edtechpro.edu', '2019-11-15', 'EdTech', 'Series A', 7800000),
        ('UrbanFarm', 'Vertical farming technology for urban environments', 'https://urbanfarm.co', '2020-06-30', 'AgTech', 'Seed', 1250000),
        ('LogiChain', 'Blockchain-based supply chain management solution', 'https://logichain.io', '2021-02-18', 'Logistics', 'Seed', 980000),
        ('CyberShield', 'Zero-trust cybersecurity platform for enterprises', 'https://cybershield.sec', '2017-09-12', 'Cybersecurity', 'Series C', 32000000),
        ('VRLearn', 'Virtual reality educational content for higher education', 'https://vrlearn.edu', '2019-03-25', 'EdTech', 'Series A', 6500000),
        ('EcoEnergy', 'Renewable energy solutions for residential buildings', 'https://ecoenergy.green', '2018-08-10', 'CleanTech', 'Series B', 15000000),
        ('RetailAI', 'AI-powered inventory management for retail', 'https://retailai.com', '2020-01-15', 'Retail', 'Series A', 8300000),
        ('CloudNative', 'Serverless deployment platform for developers', 'https://cloudnative.dev', '2021-04-03', 'DevTools', 'Seed', 2100000)
      RETURNING id, name;
    `

    console.log(`Inserted ${startups.length} startups`)

    // Insert founders with varied backgrounds and social profiles
    const founders = []
    for (const startup of startups) {
      let founderInserts
      if (startup.name === "TechNova") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Sarah Chen', 'sarah@technova.io', 'https://linkedin.com/in/sarahchen', 'https://twitter.com/sarahchen', 'https://instagram.com/sarahchen', 'Former Google engineer with 10+ years experience in AI and machine learning. PhD in Computer Science from Stanford.', ${startup.id}),
            ('Michael Rodriguez', 'michael@technova.io', 'https://linkedin.com/in/michaelrodriguez', 'https://twitter.com/mrodriguez', null, 'Serial entrepreneur with two successful exits in the SaaS space. Previously CTO at EnterpriseCloud.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "GreenEco") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Aisha Patel', 'aisha@greeneco.com', 'https://linkedin.com/in/aishapatel', 'https://twitter.com/aishapatel', 'https://instagram.com/aishapatel', 'Environmental scientist turned entrepreneur, passionate about sustainable solutions. Masters in Environmental Engineering from MIT.', ${startup.id}),
            ('David Kim', 'david@greeneco.com', 'https://linkedin.com/in/davidkim', 'https://twitter.com/davidkim', 'https://instagram.com/davidkim', 'Former operations manager at Tesla. Expert in supply chain management and sustainable manufacturing.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "FinEdge") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('James Wilson', 'james@finedge.io', 'https://linkedin.com/in/jameswilson', 'https://twitter.com/jwilson', 'https://instagram.com/jameswilson', 'Former investment banker with expertise in blockchain technology. MBA from Wharton.', ${startup.id}),
            ('Elena Kowalski', 'elena@finedge.io', 'https://linkedin.com/in/elenakowalski', 'https://twitter.com/ekowalski', null, 'Blockchain developer with 5+ years experience in smart contract development. Core contributor to Ethereum.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "MediSync") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Dr. Robert Chen', 'robert@medisync.health', 'https://linkedin.com/in/robertchen', 'https://twitter.com/drchen', null, 'Former Chief Medical Officer at Kaiser Permanente. MD from Johns Hopkins and MBA from Harvard.', ${startup.id}),
            ('Sophia Martinez', 'sophia@medisync.health', 'https://linkedin.com/in/sophiamartinez', 'https://twitter.com/smartinez', 'https://instagram.com/sophiamartinez', 'Healthcare IT specialist with 12 years experience implementing EHR systems.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "EdTechPro") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Marcus Johnson', 'marcus@edtechpro.edu', 'https://linkedin.com/in/marcusjohnson', 'https://twitter.com/marcusj', 'https://instagram.com/marcusjohnson', 'Former high school principal and education policy advisor. EdD from Harvard Graduate School of Education.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "UrbanFarm") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Nina Patel', 'nina@urbanfarm.co', 'https://linkedin.com/in/ninapatel', 'https://twitter.com/ninapatel', 'https://instagram.com/ninapatel', 'Agricultural scientist specializing in hydroponics. PhD in Plant Science from Cornell.', ${startup.id}),
            ('Thomas Wong', 'thomas@urbanfarm.co', 'https://linkedin.com/in/thomaswong', 'https://twitter.com/thomaswong', null, 'Mechanical engineer with expertise in automation. Previously at Boston Dynamics working on agricultural robotics.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "LogiChain") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Raj Patel', 'raj@logichain.io', 'https://linkedin.com/in/rajpatel', 'https://twitter.com/rajpatel', null, 'Supply chain management expert with experience at Amazon and UPS. MBA from INSEAD.', ${startup.id}),
            ('Lisa Chang', 'lisa@logichain.io', 'https://linkedin.com/in/lisachang', 'https://twitter.com/lisachang', 'https://instagram.com/lisachang', 'Blockchain developer and logistics consultant. Previously CTO at FreightTech.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "CyberShield") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Alex Morgan', 'alex@cybershield.sec', 'https://linkedin.com/in/alexmorgan', 'https://twitter.com/alexmorgan', null, 'Former NSA cybersecurity analyst. PhD in Computer Security from Carnegie Mellon.', ${startup.id}),
            ('Olivia Parker', 'olivia@cybershield.sec', 'https://linkedin.com/in/oliviaparker', 'https://twitter.com/oliviaparker', 'https://instagram.com/oliviaparker', 'Enterprise security architect with experience at Microsoft and Google. CISSP certified.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "VRLearn") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Daniel Kim', 'daniel@vrlearn.edu', 'https://linkedin.com/in/danielkim', 'https://twitter.com/danielkim', 'https://instagram.com/danielkim', 'Virtual reality developer with background in educational game design. Masters in Interactive Technology from USC.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "EcoEnergy") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Maria Santos', 'maria@ecoenergy.green', 'https://linkedin.com/in/mariasantos', 'https://twitter.com/mariasantos', 'https://instagram.com/mariasantos', 'Renewable energy engineer with 15 years experience in solar and wind technologies. Previously at Tesla Energy.', ${startup.id}),
            ('John Evergreen', 'john@ecoenergy.green', 'https://linkedin.com/in/johnevergreen', 'https://twitter.com/johnevergreen', null, 'Climate policy expert and former energy consultant. MBA from London Business School with focus on sustainable business.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "RetailAI") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Rebecca Taylor', 'rebecca@retailai.com', 'https://linkedin.com/in/rebeccataylor', 'https://twitter.com/rebeccataylor', 'https://instagram.com/rebeccataylor', 'Former Director of Analytics at Walmart. PhD in Operations Research from Georgia Tech.', ${startup.id}),
            ('Kevin Zhang', 'kevin@retailai.com', 'https://linkedin.com/in/kevinzhang', 'https://twitter.com/kevinzhang', null, 'Machine learning engineer specializing in computer vision. Previously at Amazon working on Amazon Go technology.', ${startup.id})
          RETURNING id, name, startup_id
        `
      } else if (startup.name === "CloudNative") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, bio, startup_id)
          VALUES 
            ('Emma Lewis', 'emma@cloudnative.dev', 'https://linkedin.com/in/emmalewis', 'https://twitter.com/emmalewis', 'https://instagram.com/emmalewis', 'Cloud architecture specialist with experience at AWS and Google Cloud. Core contributor to Kubernetes.', ${startup.id})
          RETURNING id, name, startup_id
        `
      }

      founders.push(...founderInserts)
    }

    console.log(`Inserted ${founders.length} founders`)

    // Insert social metrics for startups with varied platforms and engagement rates
    let socialMetricsCount = 0
    for (const startup of startups) {
      // Twitter metrics for all startups
      await sql`
        INSERT INTO social_metrics (startup_id, platform, followers_count, engagement_rate, post_frequency, sentiment_score, collected_at)
        VALUES 
          (${startup.id}, 'Twitter', ${Math.floor(Math.random() * 50000) + 1000}, ${(Math.random() * 5 + 1).toFixed(1)}, ${(Math.random() * 7 + 1).toFixed(1)}, ${(Math.random() * 3 + 6).toFixed(1)}, NOW() - INTERVAL '1 day'),
          (${startup.id}, 'Twitter', ${Math.floor(Math.random() * 45000) + 1000}, ${(Math.random() * 5 + 1).toFixed(1)}, ${(Math.random() * 7 + 1).toFixed(1)}, ${(Math.random() * 3 + 6).toFixed(1)}, NOW() - INTERVAL '30 days')
      `
      socialMetricsCount += 2

      // LinkedIn metrics for most startups
      if (Math.random() > 0.2) {
        await sql`
          INSERT INTO social_metrics (startup_id, platform, followers_count, engagement_rate, post_frequency, sentiment_score, collected_at)
          VALUES 
            (${startup.id}, 'LinkedIn', ${Math.floor(Math.random() * 20000) + 500}, ${(Math.random() * 7 + 2).toFixed(1)}, ${(Math.random() * 5 + 0.5).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '1 day'),
            (${startup.id}, 'LinkedIn', ${Math.floor(Math.random() * 18000) + 500}, ${(Math.random() * 7 + 2).toFixed(1)}, ${(Math.random() * 5 + 0.5).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '30 days')
        `
        socialMetricsCount += 2
      }

      // Instagram metrics for some startups
      if (Math.random() > 0.4) {
        await sql`
          INSERT INTO social_metrics (startup_id, platform, followers_count, engagement_rate, post_frequency, sentiment_score, collected_at)
          VALUES 
            (${startup.id}, 'Instagram', ${Math.floor(Math.random() * 100000) + 2000}, ${(Math.random() * 8 + 3).toFixed(1)}, ${(Math.random() * 10 + 2).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '1 day'),
            (${startup.id}, 'Instagram', ${Math.floor(Math.random() * 90000) + 2000}, ${(Math.random() * 8 + 3).toFixed(1)}, ${(Math.random() * 10 + 2).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '30 days')
        `
        socialMetricsCount += 2
      }

      // TikTok metrics for some startups (especially those targeting younger audiences)
      if (
        startup.name === "VRLearn" ||
        startup.name === "EdTechPro" ||
        startup.name === "GreenEco" ||
        Math.random() > 0.7
      ) {
        await sql`
          INSERT INTO social_metrics (startup_id, platform, followers_count, engagement_rate, post_frequency, sentiment_score, collected_at)
          VALUES 
            (${startup.id}, 'TikTok', ${Math.floor(Math.random() * 500000) + 5000}, ${(Math.random() * 12 + 5).toFixed(1)}, ${(Math.random() * 14 + 3).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '1 day'),
            (${startup.id}, 'TikTok', ${Math.floor(Math.random() * 450000) + 5000}, ${(Math.random() * 12 + 5).toFixed(1)}, ${(Math.random() * 14 + 3).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '30 days')
        `
        socialMetricsCount += 2
      }

      // GitHub metrics for tech-focused startups
      if (
        startup.name === "CloudNative" ||
        startup.name === "CyberShield" ||
        startup.name === "TechNova" ||
        startup.name === "FinEdge"
      ) {
        await sql`
          INSERT INTO social_metrics (startup_id, platform, followers_count, engagement_rate, post_frequency, sentiment_score, collected_at)
          VALUES 
            (${startup.id}, 'GitHub', ${Math.floor(Math.random() * 5000) + 100}, ${(Math.random() * 4 + 1).toFixed(1)}, ${(Math.random() * 5 + 0.2).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '1 day'),
            (${startup.id}, 'GitHub', ${Math.floor(Math.random() * 4500) + 100}, ${(Math.random() * 4 + 1).toFixed(1)}, ${(Math.random() * 5 + 0.2).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '30 days')
        `
        socialMetricsCount += 2
      }
    }

    console.log(`Inserted ${socialMetricsCount} social metrics for startups`)

    // Insert social metrics for founders with varied platforms and engagement
    socialMetricsCount = 0
    for (const founder of founders) {
      // Twitter metrics for most founders
      if (Math.random() > 0.2) {
        await sql`
          INSERT INTO social_metrics (founder_id, platform, followers_count, engagement_rate, post_frequency, sentiment_score, collected_at)
          VALUES 
            (${founder.id}, 'Twitter', ${Math.floor(Math.random() * 30000) + 500}, ${(Math.random() * 6 + 1).toFixed(1)}, ${(Math.random() * 7 + 0.5).toFixed(1)}, ${(Math.random() * 3 + 6).toFixed(1)}, NOW() - INTERVAL '1 day'),
            (${founder.id}, 'Twitter', ${Math.floor(Math.random() * 28000) + 500}, ${(Math.random() * 6 + 1).toFixed(1)}, ${(Math.random() * 7 + 0.5).toFixed(1)}, ${(Math.random() * 3 + 6).toFixed(1)}, NOW() - INTERVAL '30 days')
        `
        socialMetricsCount += 2
      }

      // LinkedIn metrics for all founders (professional network)
      await sql`
        INSERT INTO social_metrics (founder_id, platform, followers_count, engagement_rate, post_frequency, sentiment_score, collected_at)
        VALUES 
          (${founder.id}, 'LinkedIn', ${Math.floor(Math.random() * 15000) + 300}, ${(Math.random() * 8 + 2).toFixed(1)}, ${(Math.random() * 4 + 0.2).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '1 day'),
          (${founder.id}, 'LinkedIn', ${Math.floor(Math.random() * 14000) + 300}, ${(Math.random() * 8 + 2).toFixed(1)}, ${(Math.random() * 4 + 0.2).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '30 days')
      `
      socialMetricsCount += 2

      // Instagram for some founders
      if (Math.random() > 0.6) {
        await sql`
          INSERT INTO social_metrics (founder_id, platform, followers_count, engagement_rate, post_frequency, sentiment_score, collected_at)
          VALUES 
            (${founder.id}, 'Instagram', ${Math.floor(Math.random() * 50000) + 1000}, ${(Math.random() * 9 + 3).toFixed(1)}, ${(Math.random() * 7 + 1).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '1 day'),
            (${founder.id}, 'Instagram', ${Math.floor(Math.random() * 48000) + 1000}, ${(Math.random() * 9 + 3).toFixed(1)}, ${(Math.random() * 7 + 1).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '30 days')
        `
        socialMetricsCount += 2
      }

      // GitHub for technical founders
      const technicalFounders = [
        "Sarah Chen",
        "Elena Kowalski",
        "Thomas Wong",
        "Kevin Zhang",
        "Emma Lewis",
        "Lisa Chang",
      ]
      if (technicalFounders.includes(founder.name)) {
        await sql`
          INSERT INTO social_metrics (founder_id, platform, followers_count, engagement_rate, post_frequency, sentiment_score, collected_at)
          VALUES 
            (${founder.id}, 'GitHub', ${Math.floor(Math.random() * 3000) + 50}, ${(Math.random() * 5 + 1).toFixed(1)}, ${(Math.random() * 4 + 0.1).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '1 day'),
            (${founder.id}, 'GitHub', ${Math.floor(Math.random() * 2800) + 50}, ${(Math.random() * 5 + 1).toFixed(1)}, ${(Math.random() * 4 + 0.1).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '30 days')
        `
        socialMetricsCount += 2
      }

      // Medium for thought leaders
      const thoughtLeaders = [
        "Marcus Johnson",
        "John Evergreen",
        "Maria Santos",
        "Dr. Robert Chen",
        "Alex Morgan",
        "James Wilson",
      ]
      if (thoughtLeaders.includes(founder.name)) {
        await sql`
          INSERT INTO social_metrics (founder_id, platform, followers_count, engagement_rate, post_frequency, sentiment_score, collected_at)
          VALUES 
            (${founder.id}, 'Medium', ${Math.floor(Math.random() * 10000) + 200}, ${(Math.random() * 7 + 2).toFixed(1)}, ${(Math.random() * 2 + 0.1).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '1 day'),
            (${founder.id}, 'Medium', ${Math.floor(Math.random() * 9500) + 200}, ${(Math.random() * 7 + 2).toFixed(1)}, ${(Math.random() * 2 + 0.1).toFixed(1)}, ${(Math.random() * 2 + 7).toFixed(1)}, NOW() - INTERVAL '30 days')
        `
        socialMetricsCount += 2
      }
    }

    console.log(`Inserted ${socialMetricsCount} social metrics for founders`)

    // Insert assessment results with varied success scores and detailed analysis
    let assessmentCount = 0
    for (const startup of startups) {
      let successScore
      let strengths
      let weaknesses
      let opportunities
      let threats
      let recommendations

      if (startup.name === "TechNova") {
        successScore = 8.2
        strengths =
          "Strong founding team with technical expertise; Good product-market fit; Positive social sentiment; High engagement on social platforms"
        weaknesses = "High burn rate; Limited international presence; Increasing customer acquisition costs"
        opportunities =
          "Expansion into enterprise market; Strategic partnerships with larger tech companies; Emerging markets in Asia"
        threats = "Increasing competition in the productivity space; Potential economic downturn affecting SaaS spending; Rapid changes in AI regulation"
        recommendations =
          "Focus on enterprise features to capture larger clients; Explore international markets in Europe and Asia; Develop strategic partnerships with complementary tech companies; Improve unit economics"
      } else if (startup.name === "GreenEco") {
        successScore = 7.5
        strengths =
          "Innovative sustainable product; Strong brand identity; High social media engagement; Well-timed market entry"
        weaknesses = "Limited production capacity; Higher costs than traditional alternatives; Early revenue traction below projections"
        opportunities = "Growing consumer demand for sustainable products; Potential for corporate partnerships; ESG investment trends"
        threats = "Supply chain vulnerabilities; Regulatory changes in packaging industry; Larger competitors entering the market"
        recommendations =
          "Secure additional funding to scale production; Develop B2B offering for corporate clients; Invest in R&D to reduce production costs; Focus marketing on environmental impact"
      } else if (startup.name === "FinEdge") {
        successScore = 6.8
        strengths =
          "Technical expertise in blockchain; First-mover advantage in specific use case; Strong network of advisors"
        weaknesses = "Limited funding; Regulatory uncertainty; Low brand awareness; High technical complexity for average users"
        opportunities = "Growing interest in DeFi solutions; Cross-border payment inefficiencies in current market; Banking partnerships"
        threats = "Regulatory crackdowns; Competition from established financial institutions; Blockchain scaling challenges"
        recommendations =
          "Secure additional funding; Focus on regulatory compliance; Develop strategic partnerships with financial institutions; Simplify user experience"
      } else if (startup.name === "MediSync") {
        successScore = 8.7
        strengths =
          "Strong domain expertise; Critical solution for industry pain point; Established customer base; Regulatory compliance"
        weaknesses = "Long sales cycles; High customer support requirements; Complex implementation process"
        opportunities = "Healthcare digital transformation acceleration; Telehealth integration; International market expansion"
        threats = "Healthcare budget constraints; Data privacy concerns; Established EHR vendor competition"
        recommendations =
          "Streamline implementation process; Develop self-service components; Expand integration capabilities with major EHR systems; Explore telehealth partnerships"
      } else if (startup.name === "EdTechPro") {
        successScore = 7.9
        strengths =
          "Proven learning outcomes; Strong founder education background; Positive teacher testimonials; Engaging product design"
        weaknesses = "School budget dependencies; Seasonal revenue fluctuations; Limited product differentiation"
        opportunities = "Remote learning demand; International curriculum adaptation; Adult learning market expansion"
        threats = "Public education budget cuts; Free educational content alternatives; Big Tech entering education market"
        recommendations =
          "Develop subscription model for parents; Create year-round revenue streams; Emphasize ROI metrics for school districts; Explore corporate training adaptations"
      } else if (startup.name === "UrbanFarm") {
        successScore = 7.1
        strengths =
          "Innovative technology; Strong sustainability metrics; Passionate founding team; Initial B2B traction"
        weaknesses = "High capital requirements; Long grow cycles; Limited consumer brand awareness"
        opportunities = "Food security concerns; Farm-to-table movement; Corporate sustainability initiatives"
        threats = "Traditional farming subsidies; Alternative farming technologies; Weather and climate uncertainties"
        recommendations =
          "Focus on high-margin specialty crops; Develop direct-to-consumer brand; Secure strategic investment from food industry; Emphasize water conservation metrics"
      } else if (startup.name === "LogiChain") {
        successScore = 6.5
        strengths = "Blockchain expertise; Supply chain industry connections; Clear ROI for customers; Strong tech team"
        weaknesses = "Complex implementation; Limited case studies; Early adoption challenges"
        opportunities = "Supply chain transparency demand; International shipping inefficiencies; Sustainability tracking requirements"
        threats = "Enterprise blockchain competitors; Legacy system integration challenges; Standards fragmentation"
        recommendations =
          "Develop proof-of-concept with major logistics player; Create simplified onboarding process; Focus on specific industry vertical first; Build more case studies"
      } else if (startup.name === "CyberShield") {
        successScore = 9.1
        strengths =
          "Cutting-edge technology; Growing cybersecurity market; Strong team credentials; Clear product differentiation"
        weaknesses =
          "High customer acquisition costs; Long enterprise sales cycles; Technical talent recruitment challenges"
        opportunities = "Increasing cyber threats; Remote work security needs; Regulatory compliance requirements"
        threats = "Rapidly evolving threat landscape; Big tech security offerings; Commoditization of basic security features"
        recommendations =
          "Develop MSP partnership program; Create compliance-focused solution packages; Invest in threat intelligence capabilities; Consider acquisition of complementary security startups"
      } else if (startup.name === "VRLearn") {
        successScore = 6.3
        strengths = "Immersive learning experience; Engaging content library; Technical innovation"
        weaknesses = "Hardware dependencies; Limited content library; High production costs"
        opportunities = "Distance learning growth; Corporate training applications; Decreasing VR hardware costs"
        threats = "AR alternatives; Limited school technology budgets; Screen time concerns from parents and educators"
        recommendations =
          "Develop hardware-agnostic solutions; Create curriculum alignment documentation; Partner with educational content providers; Explore healthcare and corporate training markets"
      } else if (startup.name === "EcoEnergy") {
        successScore = 8.4
        strengths =
          "Proven technology; Strong environmental impact metrics; Experienced leadership team; Clear ROI for customers"
        weaknesses =
          "High initial installation costs; Competitive market landscape; Geographic limitations for some solutions"
        opportunities = "Green energy incentives; Corporate sustainability goals; Rising energy costs"
        threats = "Changing subsidy landscape; Traditional energy lobbying; Supply chain constraints for components"
        recommendations =
          "Develop financing options for homeowners; Create energy-as-a-service model; Focus on markets with strong incentives; Diversify component suppliers"
      } else if (startup.name === "RetailAI") {
        successScore = 7.8
        strengths =
          "AI technology advantage; Clear cost savings for retailers; Strong analytics capabilities; Industry experience"
        weaknesses =
          "Integration challenges with legacy systems; Data privacy concerns; Requires large data sets for effectiveness"
        opportunities = "Retail digital transformation; Omnichannel optimization; Predictive inventory management need"
        threats = "Retail industry volatility; Big tech retail solutions; Data access limitations"
        recommendations =
          "Develop quick-start implementation package; Create case studies with ROI metrics; Explore partnership with POS vendors; Emphasize privacy by design"
      } else if (startup.name === "CloudNative") {
        successScore = 7.2
        strengths =
          "Developer-focused product; Open source contribution strategy; Technical expertise; Community engagement"
        weaknesses = "Early revenue generation; Enterprise feature gaps; Marketing reach"
        opportunities = "Microservices architecture adoption; DevOps transformation; Multi-cloud strategies"
        threats = "Cloud provider native offerings; Rapid technology changes; Open source alternatives"
        recommendations =
          "Develop enterprise-grade features; Create certification program; Emphasize multi-cloud differentiator; Consider strategic alliance with major cloud provider"
      } else {
        // For any other startups
        successScore = (Math.random() * 3 + 6).toFixed(1)
        strengths = "Product innovation; Founding team expertise; Market timing; Initial customer traction"
        weaknesses = "Funding limitations; Competitive landscape; Scaling challenges; Limited brand recognition"
        opportunities = "Market growth trends; Strategic partnerships; International expansion; Product line extensions"
        threats = "Established competitors; Changing regulations; Economic uncertainties; Technology shifts"
        recommendations =
          "Secure additional funding; Focus on core differentiators; Develop strategic partnerships; Improve unit economics"
      }

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
          ${startup.id}, 
          ${successScore}, 
          ${strengths}, 
          ${weaknesses}, 
          ${opportunities}, 
          ${threats}, 
          ${recommendations}
        )
      `
      assessmentCount++
    }

    console.log(`Inserted ${assessmentCount} assessment results`)

    return {
      startups: startups.length,
      founders: founders.length,
      socialMetrics: socialMetricsCount,
      assessments: assessmentCount,
    }
  } catch (error) {
    console.error("Error seeding database:", error)
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      startups: 0,
      founders: 0,
      socialMetrics: 0,
      assessments: 0,
    }
  }
}

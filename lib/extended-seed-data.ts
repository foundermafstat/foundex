import { neon } from "@neondatabase/serverless";

export async function seedExtendedData() {
  console.log("Starting extended database seeding...");

  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set");
      return {
        error: "DATABASE_URL environment variable is not set",
        startups: 0,
        founders: 0,
        socialMetrics: 0,
        assessments: 0,
        financialMetrics: 0,
        metricsHistory: 0,
        coinbaseData: 0
      };
    }

    const sql = neon(process.env.DATABASE_URL);

    // Insert extended startups
    const startups = await sql`
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
      VALUES 
        (
          'Quantum Leap AI', 
          'Revolutionary quantum computing platform for enterprise AI applications', 
          'https://quantumleapai.tech', 
          '2021-05-18', 
          'Quantum Computing', 
          'Series A', 
          12500000,
          'https://github.com/quantumleapai',
          'https://twitter.com/quantumleapai',
          'https://linkedin.com/company/quantumleapai',
          'https://instagram.com/quantumleapai',
          'https://facebook.com/quantumleapai',
          false,
          null
        ),
        (
          'BlueOcean Analytics', 
          'AI-powered ocean data platform for climate research and maritime operations', 
          'https://blueoceananalytics.io', 
          '2020-09-14', 
          'CleanTech', 
          'Series B', 
          28700000,
          'https://github.com/blueoceananalytics',
          'https://twitter.com/blueoceandata',
          'https://linkedin.com/company/blueoceananalytics',
          'https://instagram.com/blueoceananalytics',
          'https://facebook.com/blueoceananalytics',
          false,
          null
        ),
        (
          'NeuraTech', 
          'Neural interface technology for human-computer interaction', 
          'https://neuratech.co', 
          '2019-03-22', 
          'BioTech', 
          'Series C', 
          87500000,
          'https://github.com/neuratech',
          'https://twitter.com/neuratech',
          'https://linkedin.com/company/neuratech',
          'https://instagram.com/neuratech',
          'https://facebook.com/neuratech',
          false,
          null
        ),
        (
          'CryptoFrontier', 
          'Next-generation blockchain infrastructure for decentralized applications', 
          'https://cryptofrontier.network', 
          '2021-11-05', 
          'Blockchain', 
          'Seed', 
          5800000,
          'https://github.com/cryptofrontier',
          'https://twitter.com/cryptofrontier',
          'https://linkedin.com/company/cryptofrontier',
          'https://instagram.com/cryptofrontier',
          'https://facebook.com/cryptofrontier',
          true,
          'https://coinbase.com/price/cryptofrontier'
        ),
        (
          'SustainAgri', 
          'Precision agriculture platform using IoT sensors and AI for sustainable farming', 
          'https://sustainagri.farm', 
          '2020-02-10', 
          'AgTech', 
          'Series A', 
          14300000,
          'https://github.com/sustainagri',
          'https://twitter.com/sustainagri',
          'https://linkedin.com/company/sustainagri',
          'https://instagram.com/sustainagri',
          'https://facebook.com/sustainagri',
          false,
          null
        )
      RETURNING id, name;
    `;

    console.log(`Inserted ${startups.length} extended startups`);

    // Insert founders with varied backgrounds and social profiles
    let founders = [];
    for (const startup of startups) {
      let founderInserts;
      
      if (startup.name === "Quantum Leap AI") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, github_url, bio, startup_id)
          VALUES 
            ('Dr. Alexandra Yang', 'alexandra@quantumleapai.tech', 'https://linkedin.com/in/dryang', 'https://twitter.com/dryang', 'https://instagram.com/dryang', 'https://github.com/alexandra-yang', 'PhD in Quantum Physics from MIT. Former lead researcher at Google Quantum AI.', ${startup.id}),
            ('Kevin Zhao', 'kevin@quantumleapai.tech', 'https://linkedin.com/in/kevinzhao', 'https://twitter.com/kevinzhao', 'https://instagram.com/kevinzhao', 'https://github.com/kevinzhao', 'MS in Computer Science from Stanford. Former engineering manager at NVIDIA.', ${startup.id})
          RETURNING id, name, startup_id
        `;
      } else if (startup.name === "BlueOcean Analytics") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, github_url, bio, startup_id)
          VALUES 
            ('Maya Patel', 'maya@blueoceananalytics.io', 'https://linkedin.com/in/mayapatel', 'https://twitter.com/mayapatel', 'https://instagram.com/mayapatel', 'https://github.com/maya-patel', 'PhD in Oceanography from Scripps Institution. Former climate scientist at NOAA.', ${startup.id}),
            ('James Wilson', 'james@blueoceananalytics.io', 'https://linkedin.com/in/jameswilson', 'https://twitter.com/jameswilson', 'https://instagram.com/jameswilson', 'https://github.com/james-wilson', 'MS in Data Science from UC Berkeley. Former lead data scientist at NASA JPL.', ${startup.id})
          RETURNING id, name, startup_id
        `;
      } else if (startup.name === "NeuraTech") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, github_url, bio, startup_id)
          VALUES 
            ('Dr. Thomas Kim', 'thomas@neuratech.co', 'https://linkedin.com/in/drthomaskim', 'https://twitter.com/drthomaskim', 'https://instagram.com/drthomaskim', 'https://github.com/thomas-kim', 'MD-PhD in Neuroscience from Johns Hopkins. Former researcher at Brain-Machine Interface Lab.', ${startup.id}),
            ('Eliza Johnson', 'eliza@neuratech.co', 'https://linkedin.com/in/elizajohnson', 'https://twitter.com/elizajohnson', 'https://instagram.com/elizajohnson', 'https://github.com/eliza-johnson', 'PhD in Biomedical Engineering from Caltech. Experience in medical device development at Medtronic.', ${startup.id})
          RETURNING id, name, startup_id
        `;
      } else if (startup.name === "CryptoFrontier") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, github_url, bio, startup_id)
          VALUES 
            ('Raj Patel', 'raj@cryptofrontier.network', 'https://linkedin.com/in/rajpatel', 'https://twitter.com/rajpatel', 'https://instagram.com/rajpatel', 'https://github.com/raj-patel', 'MS in Computer Science from ETH Zurich. Former blockchain developer at Ethereum Foundation.', ${startup.id}),
            ('Sophie Chen', 'sophie@cryptofrontier.network', 'https://linkedin.com/in/sophiechen', 'https://twitter.com/sophiechen', 'https://instagram.com/sophiechen', 'https://github.com/sophie-chen', 'MBA from Wharton. Former VP of Product at Coinbase.', ${startup.id})
          RETURNING id, name, startup_id
        `;
      } else if (startup.name === "SustainAgri") {
        founderInserts = await sql`
          INSERT INTO founders (name, email, linkedin_url, twitter_url, instagram_url, github_url, bio, startup_id)
          VALUES 
            ('Carlos Rodriguez', 'carlos@sustainagri.farm', 'https://linkedin.com/in/carlosrodriguez', 'https://twitter.com/carlosrodriguez', 'https://instagram.com/carlosrodriguez', 'https://github.com/carlos-rodriguez', 'PhD in Agricultural Engineering from UC Davis. Fifth-generation farmer with 15 years experience in precision agriculture.', ${startup.id}),
            ('Emma Schmidt', 'emma@sustainagri.farm', 'https://linkedin.com/in/emmaschmidt', 'https://twitter.com/emmaschmidt', 'https://instagram.com/emmaschmidt', 'https://github.com/emma-schmidt', 'MS in Environmental Science from Cornell. Former sustainability consultant for agricultural companies.', ${startup.id})
          RETURNING id, name, startup_id
        `;
      }
      
      if (founderInserts) {
        founders = [...founders, ...founderInserts];
      }
    }

    console.log(`Inserted ${founders.length} founders for extended startups`);

    // Add the remaining code in separate files
    return {
      startups: startups.length,
      founders: founders.length,
      socialMetrics: 0,
      assessments: 0,
      financialMetrics: 0,
      metricsHistory: 0,
      coinbaseData: 0
    };
  } catch (error) {
    console.error("Error seeding extended database:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      startups: 0,
      founders: 0,
      socialMetrics: 0,
      assessments: 0,
      financialMetrics: 0,
      metricsHistory: 0,
      coinbaseData: 0
    };
  }
}

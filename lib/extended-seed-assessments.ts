import { neon } from "@neondatabase/serverless";

export async function seedExtendedAssessments() {
  console.log("Starting extended assessments seeding...");

  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set");
      return {
        error: "DATABASE_URL environment variable is not set",
        assessments: 0
      };
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Get startups to add assessments
    const startups = await sql`SELECT id, name FROM startups ORDER BY id DESC LIMIT 5`;
    
    // Add detailed assessments
    let assessmentCount = 0;
    
    for (const startup of startups) {
      let successScore = 0;
      let strengths = "";
      let weaknesses = "";
      let opportunities = "";
      let threats = "";
      let recommendations = "";
      
      if (startup.name === "Quantum Leap AI") {
        successScore = 9.2;
        strengths = 
          "Leading quantum computing technology; World-class research team; Strong IP portfolio; High-profile partnerships with major technology companies; Substantial Series A funding";
        weaknesses = 
          "High operational costs; Technology still in early commercialization phase; Limited market awareness outside technical circles; Recruitment challenges for specialized talent";
        opportunities = 
          "Growing enterprise interest in quantum computing; Government funding for quantum research; Potential for breakthrough applications in finance and healthcare; Strategic acquisition potential";
        threats = 
          "Competition from tech giants' quantum initiatives; Rapid advances in alternative quantum technologies; Regulatory uncertainties around quantum computing applications; Potential talent poaching";
        recommendations = 
          "Focus on 1-2 high-value commercial applications; Build strategic partnerships with industry leaders; Develop talent pipeline with university research programs; Secure additional funding before market downturn; Create educational content to increase market awareness";
      } else if (startup.name === "BlueOcean Analytics") {
        successScore = 8.7;
        strengths = 
          "Unique ocean data platform; Strong environmental impact metrics; Experienced oceanography and data science team; Series B funding security; Government and research partnerships";
        weaknesses = 
          "Hardware deployment and maintenance challenges; Data licensing complexities; Long sales cycles with government clients; Limited marketing reach";
        opportunities = 
          "Climate change mitigation initiatives; Maritime industry digitalization; ESG reporting requirements; International expansion; Defense applications";
        threats = 
          "Weather and environmental risks to ocean sensors; Budget cuts to government environmental programs; Competing satellite-based solutions; Data privacy regulations";
        recommendations = 
          "Develop service model to complement hardware sales; Expand commercial applications beyond research; Create tiered product offerings for different customer segments; Focus on strategic partnerships in shipping and offshore industries; Strengthen data validation methodologies";
      } else if (startup.name === "NeuraTech") {
        successScore = 9.5;
        strengths = 
          "Revolutionary neural interface technology; Strong clinical validation data; Top-tier medical and engineering talent; Extensive patent portfolio; Series C funding providing extended runway";
        weaknesses = 
          "High regulatory barriers; Long development and approval timelines; Manufacturing complexity; Consumer adoption uncertainties; High product cost";
        opportunities = 
          "Growing acceptance of neural interfaces; Medical applications for neurological conditions; Gaming and VR industry partnerships; Military and defense contracts; Potential for paradigm-shifting computing interface";
        threats = 
          "Ethical and privacy concerns; Regulatory hurdles; Major tech companies entering the space; Public perception issues; Security vulnerabilities";
        recommendations = 
          "Prioritize medical applications for initial commercialization; Develop clear ethical guidelines and security protocols; Create more affordable version for research market; Engage with regulators early and proactively; Invest in public education about the technology";
      } else if (startup.name === "CryptoFrontier") {
        successScore = 7.8;
        strengths = 
          "Innovative blockchain infrastructure; High transaction throughput; Energy-efficient consensus mechanism; Strong developer community; Coinbase listing credibility";
        weaknesses = 
          "Regulatory compliance challenges; Relatively new to market; Network effect limitations; Token price volatility; Technical complexity for average users";
        opportunities = 
          "DeFi market growth; Enterprise blockchain adoption; Web3 development acceleration; Cross-chain integration potential; International markets with progressive regulations";
        threats = 
          "Regulatory crackdowns; Competition from established blockchains; Security vulnerabilities; Market sentiment shifts; Layer-2 solutions reducing unique value proposition";
        recommendations = 
          "Focus on regulatory compliance and transparency; Simplify developer onboarding; Build strategic enterprise partnerships; Develop key DeFi applications in-house; Improve documentation and user experience";
      } else if (startup.name === "SustainAgri") {
        successScore = 8.3;
        strengths = 
          "Practical agricultural expertise combined with technology; Proven crop yield improvements; Strong customer retention; Founder with farming background; Positive environmental impact metrics";
        weaknesses = 
          "Seasonal revenue patterns; Hardware deployment in rural areas; Internet connectivity challenges; Long sales cycles; Educational requirements for customer adoption";
        opportunities = 
          "Sustainable farming incentives; Food security initiatives; Carbon credit markets; International expansion to developing agricultural markets; Data monetization potential";
        threats = 
          "Weather and climate unpredictability; Economic pressures on farming sector; Agricultural technology competition; Data ownership concerns; Rural connectivity limitations";
        recommendations = 
          "Develop subscription model to smooth revenue; Create offline functionality for low-connectivity areas; Partner with agricultural cooperatives and distributors; Build carbon credit measurement capabilities; Simplify technology adoption with turnkey solutions";
      }
      
      await sql`
        INSERT INTO assessment_results (
          startup_id, 
          success_score, 
          overall_score,
          strengths, 
          weaknesses, 
          opportunities, 
          threats, 
          recommendations
        )
        VALUES (
          ${startup.id}, 
          ${successScore}, 
          ${successScore},
          ${strengths}, 
          ${weaknesses}, 
          ${opportunities}, 
          ${threats}, 
          ${recommendations}
        )
      `;
      
      assessmentCount++;
    }
    
    console.log(`Inserted ${assessmentCount} detailed assessments`);
    
    return {
      assessments: assessmentCount
    };
  } catch (error) {
    console.error("Error seeding extended assessments:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      assessments: 0
    };
  }
}

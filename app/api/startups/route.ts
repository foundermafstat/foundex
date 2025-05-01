import { NextResponse } from "next/server";
import { getStartups, getAssessmentByStartupId } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Get query parameters if any
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    
    // Get data from database
    const startups = await getStartups();
    
    // Load assessments for each startup and merge data
    const startupsWithAssessments = await Promise.all(
      startups.map(async (startup) => {
        const assessment = await getAssessmentByStartupId(startup.id);
        
        // If assessment exists but overall_score is missing, 
        // use success_score as overall_score
        if (assessment && assessment.success_score && !assessment.overall_score) {
          assessment.overall_score = assessment.success_score;
        }
        
        return {
          ...startup,
          assessment
        };
      })
    );
    
    // Add test scores for startups without them
    // (only if these are mock data)
    const finalStartups = startupsWithAssessments.map(startup => {
      if (!startup.assessment && startup.name.includes('(Mock)')) {
        // Generate random score for mock data from 65 to 95
        const mockScore = Math.floor(65 + Math.random() * 30);
        return {
          ...startup,
          assessment: {
            id: startup.id,
            startup_id: startup.id,
            success_score: mockScore,
            overall_score: mockScore,
            strengths: "Strong team, good market",
            weaknesses: "Limited funding",
            opportunities: "Growing market, new technologies",
            threats: "High competition",
            recommendations: "Focus on finding investments",
            created_at: new Date().toISOString()
          }
        };
      }
      return startup;
    });
    
    // If there's a search query, filter results
    if (query) {
      const filteredStartups = finalStartups.filter(
        (startup) =>
          startup.name.toLowerCase().includes(query.toLowerCase()) ||
          startup.description?.toLowerCase().includes(query.toLowerCase()) ||
          startup.industry?.toLowerCase().includes(query.toLowerCase())
      );
      return NextResponse.json(filteredStartups);
    }
    
    return NextResponse.json(finalStartups);
  } catch (error) {
    console.error("Error in startups API route:", error);
    return NextResponse.json(
      { error: "Error retrieving startup data" },
      { status: 500 }
    );
  }
}

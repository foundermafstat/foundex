import { NextResponse } from "next/server";
import { seedExtendedData } from "@/lib/extended-seed-data";
import { seedExtendedMetrics } from "@/lib/extended-seed-metrics";
import { seedExtendedAssessments } from "@/lib/extended-seed-assessments";
import { isDatabaseConnected } from "@/lib/db";

export async function GET() {
  try {
    // Check if database is connected
    if (!isDatabaseConnected()) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection not available",
          message: "Please check your DATABASE_URL environment variable and database configuration.",
          mockData: true,
        },
        { status: 200 } // Return 200 instead of 500 to show a more user-friendly message
      );
    }

    // Seed extended startups and founders
    const dataResult = await seedExtendedData();
    if (dataResult.error) {
      return NextResponse.json(
        {
          success: false,
          error: dataResult.error,
          message: "Failed to seed extended startup data.",
          mockData: true,
        },
        { status: 200 }
      );
    }

    // Seed extended metrics
    const metricsResult = await seedExtendedMetrics();
    if (metricsResult.error) {
      return NextResponse.json(
        {
          success: false,
          error: metricsResult.error,
          message: "Failed to seed extended metrics data.",
          mockData: true,
        },
        { status: 200 }
      );
    }

    // Seed extended assessments
    const assessmentsResult = await seedExtendedAssessments();
    if (assessmentsResult.error) {
      return NextResponse.json(
        {
          success: false,
          error: assessmentsResult.error,
          message: "Failed to seed extended assessment data.",
          mockData: true,
        },
        { status: 200 }
      );
    }

    // Combine all results
    const combinedResults = {
      startups: dataResult.startups || 0,
      founders: dataResult.founders || 0,
      socialMetrics: metricsResult.socialMetrics || 0,
      financialMetrics: metricsResult.financialMetrics || 0,
      metricsHistory: metricsResult.metricsHistory || 0,
      coinbaseData: metricsResult.coinbaseData || 0,
      assessments: assessmentsResult.assessments || 0
    };

    return NextResponse.json({
      success: true,
      message: `Extended database seeded successfully with ${combinedResults.startups} startups, ${combinedResults.founders} founders, ${combinedResults.socialMetrics} social metrics, ${combinedResults.financialMetrics} financial metrics, ${combinedResults.metricsHistory} metrics history records, ${combinedResults.coinbaseData} coinbase data records, and ${combinedResults.assessments} assessment results.`,
      data: combinedResults,
    });
  } catch (error) {
    console.error("Error seeding extended database:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed extended database",
        message: error instanceof Error ? error.message : "Unknown error",
        mockData: true,
      },
      { status: 200 } // Return 200 instead of 500 to show a more user-friendly message
    );
  }
}

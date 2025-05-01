import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-data"
import { initializeDatabase, tablesExist, isDatabaseConnected } from "@/lib/db"

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
        { status: 200 }, // Return 200 instead of 500 to show a more user-friendly message
      )
    }

    // First check if all tables exist
    const allTablesExist = await tablesExist()

    // If not all tables exist, initialize the database schema
    if (!allTablesExist) {
      await initializeDatabase()
    }

    // Then seed the database with data
    const result = await seedDatabase()

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: "Failed to seed database. Please check your database configuration.",
          mockData: true,
        },
        { status: 200 }, // Return 200 instead of 500 to show a more user-friendly message
      )
    }

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully with ${result.startups} startups, ${result.founders} founders, ${result.socialMetrics} social metrics records, and ${result.assessments} assessment results.`,
      data: result,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed database",
        message: error instanceof Error ? error.message : "Unknown error",
        mockData: true,
      },
      { status: 200 }, // Return 200 instead of 500 to show a more user-friendly message
    )
  }
}

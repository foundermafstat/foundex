import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DatabaseError() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle>Database Connection Notice</CardTitle>
        </div>
        <CardDescription>Running in demo mode with mock data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <Info className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Demo Mode Active</p>
            <p className="text-sm text-amber-700">
              The application is currently running with mock data because a database connection could not be
              established.
            </p>
          </div>
        </div>

        <p className="text-sm mb-4">The database connection issue could be due to:</p>
        <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
          <li>The DATABASE_URL environment variable is not set</li>
          <li>The database server is not accessible</li>
          <li>The database credentials are incorrect</li>
        </ul>

        <p className="text-sm mb-4">
          You can continue to explore the application with limited functionality using the mock data.
        </p>

        <p className="text-sm font-medium">To fix this issue:</p>
        <ol className="list-decimal pl-5 text-sm space-y-1 mt-2">
          <li>Make sure the DATABASE_URL environment variable is set in your .env file or deployment settings</li>
          <li>Verify that the database server is running and accessible</li>
          <li>Check that the database credentials are correct</li>
        </ol>
      </CardContent>
      <CardFooter>
        <Link href="/" className="w-full">
          <Button className="w-full">Return to Home</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function MissingEnvGuide() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle>Missing Environment Variable</CardTitle>
        </div>
        <CardDescription>Required environment variable is not set.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          The <code>DATABASE_URL</code> environment variable is not set. This variable is required to connect to the
          database.
        </p>
        <p className="text-sm mt-4">
          Please set the <code>DATABASE_URL</code> environment variable in your <code>.env</code> file or in your
          deployment environment.
        </p>
        <p className="text-sm mt-4">
          Example: <code>DATABASE_URL="postgresql://user:password@host:port/database"</code>
        </p>
      </CardContent>
    </Card>
  )
}

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function EmptyState({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children || (
          <p className="text-sm">
            It looks like your database hasn't been seeded with data yet. You need to seed the database to see startup
            and founder information.
          </p>
        )}
      </CardContent>
      {!children && (
        <CardFooter>
          <Link href="/api/seed" prefetch={false}>
            <Button>Seed Database</Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}

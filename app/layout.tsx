import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, PT_Sans_Narrow } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ChatProvider } from "@/contexts/chat-context"
import { SiteHeader } from "@/components/site-header"

const inter = Inter({ subsets: ["latin"] })
const ptSansNarrow = PT_Sans_Narrow({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-pt-sans-narrow',
})

export const metadata: Metadata = {
  title: "Foundex",
  description: "Assess startup success potential using AI and social indicators",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${ptSansNarrow.variable} overflow-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ChatProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateAIResponse(message: string, context?: { startupId?: number; founderId?: number }) {
  // Check if OpenAI API key exists
  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key is missing")
    return "Sorry, the AI service is not properly configured. Please contact the administrator."
  }

  const systemPrompt = `You are an AI assistant specialized in analyzing startups and their potential for success.
Your goal is to provide insightful analysis based on social indicators and other metrics.
${context?.startupId ? "You are currently analyzing a specific startup." : ""}
${context?.founderId ? "You are currently analyzing a specific founder." : ""}

When asked about a startup or founder, provide concise analysis focusing on:
1. Social media presence and engagement
2. Market positioning
3. Team composition and experience
4. Growth potential
5. Risk factors

You can also respond to commands like:
- "Show me all startups" - Display a list of all startups
- "Show me all founders" - Display a list of all founders
- "Analyze [startup name]" - Provide detailed analysis of a specific startup
- "Assess [founder name]" - Provide detailed analysis of a specific founder

Keep your responses concise, informative, and actionable.`

  try {
    // The AI SDK expects the environment variable to be named OPENAI_API_KEY
    // We'll use the environment variable directly
    const { text } = await generateText({
      model: openai("gpt-4o", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      system: systemPrompt,
      prompt: message,
      maxTokens: 1000, // Limit token usage for safety
    })

    return text
  } catch (error) {
    console.error("Error generating AI response:", error)

    // Return a fallback response that doesn't depend on OpenAI
    if (message.toLowerCase() === "show me all startups") {
      return "I'll show you all startups. Navigating to the startups page..."
    } else if (message.toLowerCase() === "show me all founders") {
      return "I'll show you all founders. Navigating to the founders page..."
    } else if (message.toLowerCase().startsWith("analyze ")) {
      const startupName = message.substring(8).trim()
      return `I'll analyze ${startupName} for you. Navigating to search results...`
    } else if (message.toLowerCase().startsWith("assess ")) {
      const founderName = message.substring(7).trim()
      return `I'll assess ${founderName} for you. Navigating to search results...`
    }

    return "Sorry, I encountered an error while processing your request. Please try again later."
  }
}

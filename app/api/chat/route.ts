import { type NextRequest, NextResponse } from "next/server"
import { generateAIResponse } from "@/lib/ai"
import { saveChatMessage } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing")
      return NextResponse.json(
        {
          response:
            "Извините, сервис ИИ не настроен корректно. Убедитесь, что переменная окружения OPENAI_API_KEY установлена.",
          error: "OpenAI API key is missing",
        },
        { status: 500 },
      )
    }

    const { message, sessionId, startupId } = await request.json()

    // Generate AI response
    const response = await generateAIResponse(message, {
      startupId: startupId ? Number.parseInt(startupId) : undefined,
    })

    // Try to save to database, but don't fail if it doesn't work
    try {
      await saveChatMessage(sessionId, message, response, startupId)
    } catch (dbError) {
      // Log the error but continue - this makes chat work even if DB fails
      console.error("Error saving chat message to database:", dbError)
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        response: "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

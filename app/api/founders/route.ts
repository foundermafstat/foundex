import { NextResponse } from "next/server";
import { getFounders } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Получаем параметры запроса, если есть
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    
    // Получаем данные из базы
    const founders = await getFounders();
    
    // Если есть поисковый запрос, фильтруем результаты
    if (query) {
      const filteredFounders = founders.filter(
        (founder) =>
          founder.name.toLowerCase().includes(query.toLowerCase()) ||
          founder.bio?.toLowerCase().includes(query.toLowerCase()) ||
          founder.email?.toLowerCase().includes(query.toLowerCase())
      );
      return NextResponse.json(filteredFounders);
    }
    
    return NextResponse.json(founders);
  } catch (error) {
    console.error("Error in founders API route:", error);
    return NextResponse.json(
      { error: "Ошибка при получении данных об основателях" },
      { status: 500 }
    );
  }
}

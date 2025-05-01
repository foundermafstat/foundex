import { NextResponse } from "next/server";
import { getStartups, getFounders } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "startup";
    
    // Если тип поиска - стартапы
    if (type === "startup") {
      const startups = await getStartups();
      
      if (query) {
        const filteredStartups = startups.filter(
          (startup) =>
            startup.name.toLowerCase().includes(query.toLowerCase()) ||
            startup.description?.toLowerCase().includes(query.toLowerCase()) ||
            startup.industry?.toLowerCase().includes(query.toLowerCase())
        );
        return NextResponse.json({ results: filteredStartups, type: "startup" });
      }
      
      return NextResponse.json({ results: startups, type: "startup" });
    }
    
    // Если тип поиска - основатели
    if (type === "founder") {
      const founders = await getFounders();
      
      if (query) {
        const filteredFounders = founders.filter(
          (founder) =>
            founder.name.toLowerCase().includes(query.toLowerCase()) ||
            founder.bio?.toLowerCase().includes(query.toLowerCase()) ||
            founder.email?.toLowerCase().includes(query.toLowerCase())
        );
        return NextResponse.json({ results: filteredFounders, type: "founder" });
      }
      
      return NextResponse.json({ results: founders, type: "founder" });
    }
    
    // Если тип поиска неизвестен
    return NextResponse.json(
      { error: "Неизвестный тип поиска" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in search API route:", error);
    return NextResponse.json(
      { error: "Ошибка при поиске" },
      { status: 500 }
    );
  }
}

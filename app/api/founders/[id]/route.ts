import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getFounderById, getStartupById, getSocialMetricsByFounderId } from "@/lib/db";
import { mockFounders, mockStartups } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id, 10);
    
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Недопустимый ID основателя" },
        { status: 400 }
      );
    }
    
    // Получаем данные об основателе
    const founder = await getFounderById(id);
    
    // Если основатель не найден в базе данных, используем моковые данные
    if (!founder) {
      // Находим основателя в моковых данных
      const mockFounder = mockFounders.find(f => f.id === id);
      
      if (!mockFounder) {
        return NextResponse.json(
          { error: "Основатель не найден" },
          { status: 404 }
        );
      }
      
      // Находим моковый стартап для основателя
      const mockStartup = mockFounder.startup_id 
        ? mockStartups.find(s => s.id === mockFounder.startup_id) 
        : null;
      
      return NextResponse.json({
        founder: mockFounder,
        startup: mockStartup,
        socialMetrics: []
      });
    }
    
    // Если основатель существует, получаем связанные данные
    const [startup, socialMetrics] = await Promise.all([
      founder.startup_id ? getStartupById(founder.startup_id) : null,
      getSocialMetricsByFounderId(id)
    ]);
    
    return NextResponse.json({
      founder,
      startup,
      socialMetrics
    });
  } catch (error) {
    console.error("Ошибка в API-маршруте основателя:", error);
    return NextResponse.json(
      { error: "Ошибка при получении данных об основателе" },
      { status: 500 }
    );
  }
}

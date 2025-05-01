import { NextResponse } from "next/server";

/**
 * Обработчик команд чат-бота
 * Перенаправляет на нужную страницу в зависимости от параметров
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры для различных команд
    const type = searchParams.get("type") || "";
    
    // Обработка команды сравнения стартапов
    if (type === "compare_startups") {
      const name1 = searchParams.get("name1") || "";
      const name2 = searchParams.get("name2") || "";
      
      if (name1 && name2) {
        // Перенаправляем на страницу сравнения
        return NextResponse.redirect(
          new URL(`/compare?name1=${encodeURIComponent(name1)}&name2=${encodeURIComponent(name2)}&type=startups&byName=true`, request.url)
        );
      }
    }
    
    // Обработка других команд
    if (type === "list_startups") {
      return NextResponse.redirect(new URL("/startups", request.url));
    }
    
    if (type === "list_founders") {
      return NextResponse.redirect(new URL("/founders", request.url));
    }
    
    // Если команда не распознана
    return NextResponse.json({ 
      error: "Unsupported command type", 
      status: 400 
    }, { status: 400 });
    
  } catch (error) {
    console.error("Error processing command:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      status: 500 
    }, { status: 500 });
  }
}

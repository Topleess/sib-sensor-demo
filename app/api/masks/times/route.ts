import { NextResponse } from 'next/server';

/**
 * Обработчик GET запроса для получения всех времен масок
 */
export async function GET() {
  try {
    // Используем те же времена, что и для термограмм
    // В реальном приложении здесь будет запрос к вашему API
    const now = Date.now();
    
    const mockMaskTimes = [
      new Date(now - 3600000 * 24 * 5).toISOString(), // 5 дней назад
      new Date(now - 3600000 * 24 * 3).toISOString(), // 3 дня назад
      new Date(now - 3600000 * 24).toISOString(),     // 1 день назад
      new Date(now - 3600000 * 6).toISOString(),      // 6 часов назад
      new Date(now - 3600000).toISOString(),          // 1 час назад
      new Date().toISOString()                        // текущее время
    ];
    
    return NextResponse.json(mockMaskTimes);
  } catch (error) {
    console.error('Ошибка при получении времен масок:', error);
    return NextResponse.json(
      { error: 'Не удалось получить времена масок' },
      { status: 500 }
    );
  }
} 
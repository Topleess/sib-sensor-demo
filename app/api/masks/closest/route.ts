import { NextResponse } from 'next/server';

/**
 * Обработчик GET запроса для получения ближайшей маски к указанному времени
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetTimeParam = searchParams.get('target_time');
    
    if (!targetTimeParam) {
      return NextResponse.json(
        { error: 'Требуется параметр target_time' },
        { status: 400 }
      );
    }
    
    // Возвращаем пустую маску, чтобы не было ошибок
    // В реальном приложении здесь будет запрос к вашему API
    return NextResponse.json({
      id: "mask-mock",
      timestamp: targetTimeParam,
      // Можем вернуть null для data или пустой объект - фронтенд должен это обрабатывать
      data: null
    });
  } catch (error) {
    console.error('Ошибка при получении ближайшей маски:', error);
    return NextResponse.json(
      { error: 'Не удалось получить ближайшую маску' },
      { status: 500 }
    );
  }
} 
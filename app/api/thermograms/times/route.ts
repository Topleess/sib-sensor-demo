import { NextResponse } from 'next/server';

// Временные данные для демонстрации (в реальном приложении замените на запрос к вашему бэкенду)
const mockThermogramTimes = [
  new Date(Date.now() - 3600000 * 24 * 5).toISOString(), // 5 дней назад
  new Date(Date.now() - 3600000 * 24 * 4).toISOString(), // 4 дня назад
  new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 дня назад
  new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 дня назад
  new Date(Date.now() - 3600000 * 24).toISOString(),     // 1 день назад
  new Date(Date.now() - 3600000 * 12).toISOString(),     // 12 часов назад
  new Date(Date.now() - 3600000 * 6).toISOString(),      // 6 часов назад
  new Date(Date.now() - 3600000 * 2).toISOString(),      // 2 часа назад
  new Date(Date.now() - 3600000).toISOString(),          // 1 час назад
  new Date().toISOString()                               // текущее время
];

/**
 * Обработчик GET запроса для получения всех времен термограмм
 */
export async function GET() {
  try {
    // В реальном приложении здесь будет запрос к вашему API
    // const response = await fetch('https://your-backend.api/thermograms/times');
    // const data = await response.json();
    // return NextResponse.json(data);
    
    // Возвращаем моковые данные для демонстрации
    return NextResponse.json(mockThermogramTimes);
  } catch (error) {
    console.error('Ошибка при получении времен термограмм:', error);
    return NextResponse.json(
      { error: 'Не удалось получить времена термограмм' },
      { status: 500 }
    );
  }
} 
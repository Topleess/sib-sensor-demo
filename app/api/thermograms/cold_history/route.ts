import { NextResponse } from 'next/server';

// Моковые данные температуры холодной воды за последние 7 дней
function generateColdTemperatureData(days: number = 7) {
  const data = [];
  const now = Date.now();
  
  // Базовая температура холодной воды
  const baseTemp = 9;
  
  // Генерация данных с 3-часовым интервалом
  for (let i = days * 24 * 3600 * 1000; i >= 0; i -= 3 * 3600 * 1000) {
    const timestamp = new Date(now - i).toISOString();
    
    // Небольшая случайная вариация температуры (±2 градуса)
    const variation = Math.random() * 4 - 2;
    const value = baseTemp + variation;
    
    data.push({
      timestamp,
      value: parseFloat(value.toFixed(1))
    });
  }
  
  return data;
}

/**
 * Обработчик GET запроса для получения истории температуры холодной воды
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get('days');
    
    // Количество дней по умолчанию - 7
    const days = daysParam ? parseInt(daysParam, 10) : 7;
    
    // В реальном приложении здесь будет запрос к вашему API
    // const response = await fetch(`https://your-backend.api/thermograms/cold_history?days=${days}`);
    // const data = await response.json();
    // return NextResponse.json(data);
    
    // Генерируем и возвращаем моковые данные
    const mockData = generateColdTemperatureData(days);
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Ошибка при получении истории температуры холодной воды:', error);
    return NextResponse.json(
      { error: 'Не удалось получить историю температуры холодной воды' },
      { status: 500 }
    );
  }
} 
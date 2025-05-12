import { NextResponse } from 'next/server';

// Моковые данные текущих температур
const mockCurrentTemperatures = {
  hot: 65.2,   // Горячая вода (подающий трубопровод)
  cold: 9.8,   // Холодная вода (обратный трубопровод)
  lep: 42.5    // ЛЭП
};

/**
 * Обработчик GET запроса для получения текущих температур
 */
export async function GET() {
  try {
    // В реальном приложении здесь будет запрос к вашему API
    // const response = await fetch('https://your-backend.api/thermograms/current_temperatures');
    // const data = await response.json();
    // return NextResponse.json(data);
    
    // Добавляем небольшую случайную вариацию для реалистичности
    const currentTemps = {
      hot: parseFloat((mockCurrentTemperatures.hot + (Math.random() * 0.6 - 0.3)).toFixed(1)),
      cold: parseFloat((mockCurrentTemperatures.cold + (Math.random() * 0.4 - 0.2)).toFixed(1)),
      lep: parseFloat((mockCurrentTemperatures.lep + (Math.random() * 0.8 - 0.4)).toFixed(1))
    };
    
    return NextResponse.json(currentTemps);
  } catch (error) {
    console.error('Ошибка при получении текущих температур:', error);
    return NextResponse.json(
      { error: 'Не удалось получить текущие температуры' },
      { status: 500 }
    );
  }
} 
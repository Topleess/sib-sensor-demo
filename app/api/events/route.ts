import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Получаем текущую дату и время
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const targetTime = encodeURIComponent(formattedDate);

    // Делаем запрос к API для получения данных о масках
    const response = await fetch(
      `http://127.0.0.1:8000/masks/closest?target_time=${targetTime}`,
      {
        headers: {
          accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Ошибка получения данных о событиях');
    }

    const data = await response.json();

    // Преобразуем данные о масках в события
    const events = transformMasksToEvents(data);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json(
      { error: 'Ошибка получения данных о событиях' },
      { status: 500 }
    );
  }
}

// Функция для преобразования данных о масках в события
function transformMasksToEvents(masksData: any) {
  const events = [];
  const { hot_leak, cold_leak, length, date_time } = masksData;

  // Проверяем события горячей утечки
  for (let i = 0; i < hot_leak.length; i++) {
    if (hot_leak[i] === 2) {
      events.push({
        id: `hot-${i}-${Date.now()}`,
        title: 'Началась утечка горячей воды',
        location: getLocationByIndex(i),
        status: 'active',
        type: 'alert',
        timestamp: date_time,
        length: length[i],
      });
    } else if (hot_leak[i] === 1) {
      events.push({
        id: `hot-end-${i}-${Date.now()}`,
        title: 'Завершилась утечка горячей воды',
        location: getLocationByIndex(i),
        status: 'warning',
        type: 'info',
        timestamp: date_time,
        length: length[i],
      });
    }
  }

  // Проверяем события холодной утечки
  for (let i = 0; i < cold_leak.length; i++) {
    if (cold_leak[i] === 2) {
      events.push({
        id: `cold-${i}-${Date.now()}`,
        title: 'Началась утечка холодной воды',
        location: getLocationByIndex(i),
        status: 'active',
        type: 'alert',
        timestamp: date_time,
        length: length[i],
      });
    } else if (cold_leak[i] === 1) {
      events.push({
        id: `cold-end-${i}-${Date.now()}`,
        title: 'Завершилась утечка холодной воды',
        location: getLocationByIndex(i),
        status: 'warning',
        type: 'info',
        timestamp: date_time,
        length: length[i],
      });
    }
  }

  return events;
}

// Функция для получения названия локации по индексу
function getLocationByIndex(index: number) {
  const locations = ['Конференц-зал', 'Офис разработки', 'Кухня'];
  return locations[index] || 'Другое помещение';
} 
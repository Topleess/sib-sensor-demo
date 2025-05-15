import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Получаем текущую дату и время
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const targetTime = encodeURIComponent(formattedDate);

    // Делаем запрос к API для получения данных о событиях
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
  const { 
    hot_leak, cold_leak, length, date_time, 
    power_line_heat, radiator_switch, conditioner_switch, 
    light_switch, window, rack_temperature, 
    climatic_chamber_temperature, office_fire, parking_fire 
  } = masksData;

  // Проверяем события горячей утечки
  if (hot_leak) {
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
  }

  // Проверяем события холодной утечки
  if (cold_leak) {
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
  }

  // Проверяем события нагрева линии электропередачи
  if (power_line_heat) {
    for (let i = 0; i < power_line_heat.length; i++) {
      if (power_line_heat[i] === 2) {
        events.push({
          id: `power-heat-${i}-${Date.now()}`,
          title: 'Обнаружен перегрев линии электропередачи',
          location: getLocationByIndex(i),
          status: 'active',
          type: 'alert',
          timestamp: date_time,
          length: length[i],
        });
      } else if (power_line_heat[i] === 1) {
        events.push({
          id: `power-heat-end-${i}-${Date.now()}`,
          title: 'Перегрев линии электропередачи устранен',
          location: getLocationByIndex(i),
          status: 'warning',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      }
    }
  }

  // Проверяем события включения/выключения радиатора
  if (radiator_switch) {
    for (let i = 0; i < radiator_switch.length; i++) {
      if (radiator_switch[i] === 2) {
        events.push({
          id: `radiator-on-${i}-${Date.now()}`,
          title: 'Радиатор включен',
          location: getLocationByIndex(i),
          status: 'active',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      } else if (radiator_switch[i] === 1) {
        events.push({
          id: `radiator-off-${i}-${Date.now()}`,
          title: 'Радиатор выключен',
          location: getLocationByIndex(i),
          status: 'inactive',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      }
    }
  }

  // Проверяем события включения/выключения кондиционера
  if (conditioner_switch) {
    for (let i = 0; i < conditioner_switch.length; i++) {
      if (conditioner_switch[i] === 2) {
        events.push({
          id: `conditioner-on-${i}-${Date.now()}`,
          title: 'Кондиционер включен',
          location: getLocationByIndex(i),
          status: 'active',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      } else if (conditioner_switch[i] === 1) {
        events.push({
          id: `conditioner-off-${i}-${Date.now()}`,
          title: 'Кондиционер выключен',
          location: getLocationByIndex(i),
          status: 'inactive',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      }
    }
  }

  // Проверяем события включения/выключения света
  if (light_switch) {
    for (let i = 0; i < light_switch.length; i++) {
      if (light_switch[i] === 2) {
        events.push({
          id: `light-on-${i}-${Date.now()}`,
          title: 'Свет включен',
          location: getLocationByIndex(i),
          status: 'active',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      } else if (light_switch[i] === 1) {
        events.push({
          id: `light-off-${i}-${Date.now()}`,
          title: 'Свет выключен',
          location: getLocationByIndex(i),
          status: 'inactive',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      }
    }
  }

  // Проверяем события открытия/закрытия окна
  if (window) {
    for (let i = 0; i < window.length; i++) {
      if (window[i] === 2) {
        events.push({
          id: `window-open-${i}-${Date.now()}`,
          title: 'Окно открыто',
          location: getLocationByIndex(i),
          status: 'active',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      } else if (window[i] === 1) {
        events.push({
          id: `window-close-${i}-${Date.now()}`,
          title: 'Окно закрыто',
          location: getLocationByIndex(i),
          status: 'inactive',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      }
    }
  }

  // Проверяем события превышения температуры серверной стойки
  if (rack_temperature) {
    for (let i = 0; i < rack_temperature.length; i++) {
      if (rack_temperature[i] === 2) {
        events.push({
          id: `rack-temp-high-${i}-${Date.now()}`,
          title: 'Превышение температуры серверной стойки',
          location: getLocationByIndex(i),
          status: 'active',
          type: 'alert',
          timestamp: date_time,
          length: length[i],
        });
      } else if (rack_temperature[i] === 1) {
        events.push({
          id: `rack-temp-normal-${i}-${Date.now()}`,
          title: 'Нормализация температуры серверной стойки',
          location: getLocationByIndex(i),
          status: 'inactive',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      }
    }
  }

  // Проверяем события температуры климатической камеры
  if (climatic_chamber_temperature) {
    for (let i = 0; i < climatic_chamber_temperature.length; i++) {
      if (climatic_chamber_temperature[i] === 2) {
        events.push({
          id: `climate-temp-high-${i}-${Date.now()}`,
          title: 'Превышение температуры климатической камеры',
          location: getLocationByIndex(i),
          status: 'active',
          type: 'alert',
          timestamp: date_time,
          length: length[i],
        });
      } else if (climatic_chamber_temperature[i] === 1) {
        events.push({
          id: `climate-temp-normal-${i}-${Date.now()}`,
          title: 'Нормализация температуры климатической камеры',
          location: getLocationByIndex(i),
          status: 'inactive',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      }
    }
  }

  // Проверяем события пожара в офисе
  if (office_fire) {
    for (let i = 0; i < office_fire.length; i++) {
      if (office_fire[i] === 2) {
        events.push({
          id: `office-fire-${i}-${Date.now()}`,
          title: 'Пожар в офисе',
          location: getLocationByIndex(i),
          status: 'active',
          type: 'critical',
          timestamp: date_time,
          length: length[i],
        });
      } else if (office_fire[i] === 1) {
        events.push({
          id: `office-fire-end-${i}-${Date.now()}`,
          title: 'Пожар в офисе потушен',
          location: getLocationByIndex(i),
          status: 'inactive',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      }
    }
  }

  // Проверяем события пожара на парковке
  if (parking_fire) {
    for (let i = 0; i < parking_fire.length; i++) {
      if (parking_fire[i] === 2) {
        events.push({
          id: `parking-fire-${i}-${Date.now()}`,
          title: 'Пожар на парковке',
          location: getLocationByIndex(i),
          status: 'active',
          type: 'critical',
          timestamp: date_time,
          length: length[i],
        });
      } else if (parking_fire[i] === 1) {
        events.push({
          id: `parking-fire-end-${i}-${Date.now()}`,
          title: 'Пожар на парковке потушен',
          location: getLocationByIndex(i),
          status: 'inactive',
          type: 'info',
          timestamp: date_time,
          length: length[i],
        });
      }
    }
  }

  return events;
}

// Функция для получения названия локации по индексу
function getLocationByIndex(index: number) {
  const locations = ['Конференц-зал', 'Офис разработки', 'Кухня'];
  return locations[index] || 'Другое помещение';
} 
// Интерфейсы для работы с API термограмм
export interface ThermogramData {
  id: string;
  timestamp: string;
  data: any; // Структура данных может быть уточнена
}

export interface ValueUpdate {
  value: number;
}

export interface TemperatureData {
  timestamp: string;
  value: number;
}

export interface EventsData {
  hot_leak: number[];
  cold_leak: number[];
  length: number[];
  date_time: string;
}

const API_BASE_URL = "/api";

/**
 * Получить все времена доступных термограмм
 */
export async function getAllThermogramTimes(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/thermograms/times`);
  if (!response.ok) {
    throw new Error('Не удалось получить времена термограмм');
  }
  return response.json();
}

/**
 * Получить термограмму, ближайшую к указанному времени
 */
export async function getClosestThermogram(targetTime: string): Promise<ThermogramData> {
  const encodedTime = encodeURIComponent(targetTime);
  const response = await fetch(`${API_BASE_URL}/thermograms/closest?target_time=${encodedTime}`);
  
  if (!response.ok) {
    throw new Error('Не удалось получить термограмму');
  }
  
  return response.json();
}

/**
 * Обновить пороговое значение для "горячего"
 */
export async function updateHotThreshold(value: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/thermograms/hot_th`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });
  
  if (!response.ok) {
    throw new Error('Не удалось обновить порог горячего');
  }
}

/**
 * Обновить пороговое значение для "холодного"
 */
export async function updateColdThreshold(value: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/thermograms/cold_th`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });
  
  if (!response.ok) {
    throw new Error('Не удалось обновить порог холодного');
  }
}

/**
 * Получить все времена доступных масок
 */
export async function getAllMaskTimes(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/masks/times`);
  if (!response.ok) {
    throw new Error('Не удалось получить времена масок');
  }
  return response.json();
}

/**
 * Получить маску, ближайшую к указанному времени
 */
export async function getClosestMask(targetTime: string): Promise<any> {
  try {
    const encodedTime = encodeURIComponent(targetTime);
    const response = await fetch(`${API_BASE_URL}/masks/closest?target_time=${encodedTime}`);
    
    if (!response.ok) {
      console.warn('Не удалось получить маску, но это не критичная ошибка');
      return null; // Возвращаем null вместо выбрасывания исключения
    }
    
    return response.json();
  } catch (error) {
    console.warn('Ошибка при получении маски, но продолжаем работу:', error);
    return null; // Возвращаем null вместо пробрасывания ошибки дальше
  }
}

/**
 * Получить исторические данные температуры горячей воды
 * @param days количество дней для выборки
 */
export async function getHotTemperatureHistory(days: number = 7): Promise<TemperatureData[]> {
  try {
    console.log(`Запрос истории горячей воды за ${days} дней`);
    const response = await fetch(`${API_BASE_URL}/thermograms/hot_history?days=${days}`);
    
    if (!response.ok) {
      console.error(`Ошибка API истории ГВС: ${response.status} ${response.statusText}`);
      throw new Error('Не удалось получить историю температуры горячей воды');
    }
    
    const data = await response.json();
    console.log(`Получены данные истории ГВС: ${data.length} записей`);
    return data;
  } catch (error) {
    console.error('Ошибка при получении истории температуры горячей воды:', error);
    // Возвращаем тестовые данные вместо ошибки
    return generateMockTemperatureData(65, 7);
  }
}

/**
 * Получить исторические данные температуры холодной воды
 * @param days количество дней для выборки
 */
export async function getColdTemperatureHistory(days: number = 7): Promise<TemperatureData[]> {
  try {
    console.log(`Запрос истории холодной воды за ${days} дней`);
    const response = await fetch(`${API_BASE_URL}/thermograms/cold_history?days=${days}`);
    
    if (!response.ok) {
      console.error(`Ошибка API истории ХВС: ${response.status} ${response.statusText}`);
      throw new Error('Не удалось получить историю температуры холодной воды');
    }
    
    const data = await response.json();
    console.log(`Получены данные истории ХВС: ${data.length} записей`);
    return data;
  } catch (error) {
    console.error('Ошибка при получении истории температуры холодной воды:', error);
    // Возвращаем тестовые данные вместо ошибки
    return generateMockTemperatureData(10, 7);
  }
}

/**
 * Получить события, ближайшие к указанному времени
 */
export async function getEventsData(targetTime: string): Promise<EventsData> {
  try {
    const encodedTime = encodeURIComponent(targetTime);
    console.log(`Отправка запроса к API событий: http://127.0.0.1:8000/masks/closest?target_time=${encodedTime}`);
    
    const response = await fetch(`http://127.0.0.1:8000/masks/closest?target_time=${encodedTime}`);
    
    if (!response.ok) {
      console.error(`Ошибка API событий: ${response.status} ${response.statusText}`);
      throw new Error(`Не удалось получить данные о событиях: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Получены данные о событиях:", data);
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных о событиях:', error);
    // Возвращаем пустые данные вместо ошибки, чтобы интерфейс не ломался
    return {
      hot_leak: [0],
      cold_leak: [0],
      length: [0],
      date_time: new Date().toISOString()
    };
  }
}

/**
 * Получить текущие значения температуры
 */
export async function getCurrentTemperatures(): Promise<{hot: number, cold: number, lep: number}> {
  try {
    const response = await fetch(`${API_BASE_URL}/thermograms/current_temperatures`);
    if (!response.ok) {
      throw new Error('Не удалось получить текущие значения температуры');
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при получении текущих значений температуры:', error);
    throw error;
  }
}

/**
 * Генерирует тестовые данные температуры для случаев, когда API недоступно
 */
function generateMockTemperatureData(baseTemperature: number, days: number): TemperatureData[] {
  const result: TemperatureData[] = [];
  const now = new Date();
  
  // Генерируем данные за указанное количество дней
  for (let d = 0; d < days; d++) {
    // 4 измерения в день
    for (let h = 0; h < 4; h++) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      date.setHours(h * 6);
      
      // Добавляем случайное отклонение ±3 градуса
      const temp = baseTemperature + (Math.random() * 6 - 3);
      
      result.push({
        timestamp: date.toISOString(),
        value: parseFloat(temp.toFixed(1))
      });
    }
  }
  
  return result;
} 
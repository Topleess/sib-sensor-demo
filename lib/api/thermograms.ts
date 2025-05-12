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
  const encodedTime = encodeURIComponent(targetTime);
  const response = await fetch(`${API_BASE_URL}/masks/closest?target_time=${encodedTime}`);
  
  if (!response.ok) {
    throw new Error('Не удалось получить маску');
  }
  
  return response.json();
}

/**
 * Получить исторические данные температуры горячей воды
 * @param days количество дней для выборки
 */
export async function getHotTemperatureHistory(days: number = 7): Promise<TemperatureData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/thermograms/hot_history?days=${days}`);
    if (!response.ok) {
      throw new Error('Не удалось получить историю температуры горячей воды');
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при получении истории температуры горячей воды:', error);
    throw error;
  }
}

/**
 * Получить исторические данные температуры холодной воды
 * @param days количество дней для выборки
 */
export async function getColdTemperatureHistory(days: number = 7): Promise<TemperatureData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/thermograms/cold_history?days=${days}`);
    if (!response.ok) {
      throw new Error('Не удалось получить историю температуры холодной воды');
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при получении истории температуры холодной воды:', error);
    throw error;
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
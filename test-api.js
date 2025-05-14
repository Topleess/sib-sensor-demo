// Простой скрипт для тестирования API термограмм
const fetch = require('node-fetch');

// Базовый URL - по умолчанию локальный
const baseUrl = 'http://localhost:3000/api';
// Альтернативный URL - внешний API
const externalUrl = 'http://195.26.225.52/api';

// Выбираем URL для использования
const API_BASE_URL = process.argv[2] === 'external' ? externalUrl : baseUrl;

console.log(`Используется API: ${API_BASE_URL}`);

// Функция для выполнения GET запроса
async function fetchData(endpoint) {
  try {
    console.log(`Запрос: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      console.error(`Ошибка ${response.status}: ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Ошибка запроса: ${error.message}`);
    return null;
  }
}

// Функция для тестирования всех эндпоинтов
async function testAllEndpoints() {
  console.log('1. Получение списка времен термограмм');
  const times = await fetchData('/thermograms/times');
  console.log('Результат:', times);
  console.log('-------------------------------------------');
  
  if (times && times.length > 0) {
    const latestTime = times[times.length - 1];
    
    console.log(`2. Получение термограммы для времени: ${latestTime}`);
    const thermogram = await fetchData(`/thermograms/closest?target_time=${encodeURIComponent(latestTime)}`);
    console.log('Результат (структура):', thermogram ? {
      id: thermogram.id,
      timestamp: thermogram.timestamp,
      dataFormat: thermogram.data ? typeof thermogram.data : 'null',
      hasValues: thermogram.data && thermogram.data.values ? 'yes' : 'no',
      valuesDimensions: thermogram.data && thermogram.data.values ? 
        `${thermogram.data.values.length}x${thermogram.data.values[0].length}` : 'N/A'
    } : 'null');
    console.log('-------------------------------------------');
    
    console.log(`3. Получение маски для времени: ${latestTime}`);
    const mask = await fetchData(`/masks/closest?target_time=${encodeURIComponent(latestTime)}`);
    console.log('Результат (структура):', mask ? {
      id: mask.id,
      timestamp: mask.timestamp,
      dataFormat: mask.data ? `base64 image (${mask.data.length} chars)` : 'null'
    } : 'null');
    console.log('-------------------------------------------');
  }
  
  console.log('4. Получение текущих температур');
  const temps = await fetchData('/thermograms/current_temperatures');
  console.log('Результат:', temps);
  console.log('-------------------------------------------');
  
  console.log('5. Получение истории температуры горячей воды');
  const hotHistory = await fetchData('/thermograms/hot_history');
  console.log('Результат (первые 3 записи):', 
    hotHistory ? hotHistory.slice(0, 3) : 'null');
  console.log('-------------------------------------------');
  
  console.log('6. Получение истории температуры холодной воды');
  const coldHistory = await fetchData('/thermograms/cold_history');
  console.log('Результат (первые 3 записи):', 
    coldHistory ? coldHistory.slice(0, 3) : 'null');
  console.log('-------------------------------------------');
}

// Запуск тестов
testAllEndpoints(); 
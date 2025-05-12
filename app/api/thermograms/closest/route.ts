import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Пример данных для термограммы, которые имитируют вид как на скриншоте
// В реальном приложении здесь будут реальные данные из датчиков или файлов
const mockThermogramData = {
  // Координаты X (расстояние в метрах)
  xAxis: Array.from({ length: 350 }, (_, i) => i),
  
  // Координаты Y (номер термограммы)
  yAxis: Array.from({ length: 600 }, (_, i) => i),
  
  // Матрица значений температуры
  values: generateMockThermalMatrix(350, 600)
};

// Функция для генерации имитации данных термограммы
function generateMockThermalMatrix(width, height) {
  const matrix = [];
  
  // Создаем базовую матрицу с низкими значениями (синий цвет)
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      // Базовое низкое значение для фона (0-10)
      row.push(Math.random() * 10);
    }
    matrix.push(row);
  }
  
  // Добавляем горячую линию для подающего трубопровода (левый край)
  for (let y = 0; y < height; y++) {
    for (let x = 30; x < 60; x++) {
      if (x === 45) {
        matrix[y][x] = 60 + Math.random() * 5; // Пик температуры
      } else if (x > 40 && x < 50) {
        matrix[y][x] = 40 + Math.random() * 20; // Высокая температура
      } else if (x > 35 && x < 55) {
        matrix[y][x] = 20 + Math.random() * 20; // Средняя температура
      }
    }
  }
  
  // Добавляем утечку теплоносителя на расстоянии ~160-170м
  for (let y = 200; y < 350; y++) {
    for (let x = 160; x < 175; x++) {
      const distFromCenter = Math.sqrt(Math.pow(x - 167, 2) + Math.pow(y - 275, 2));
      if (distFromCenter < 20) {
        matrix[y][x] = Math.max(matrix[y][x], 30 - distFromCenter);
      }
    }
  }
  
  // Добавляем утечку холодной воды на расстоянии ~250м
  for (let y = 80; y < 120; y++) {
    for (let x = 245; x < 270; x++) {
      const distFromCenter = Math.sqrt(Math.pow(x - 255, 2) + Math.pow(y - 100, 2));
      if (distFromCenter < 15) {
        matrix[y][x] = Math.max(matrix[y][x], 20 - distFromCenter/2);
      }
    }
  }
  
  // Добавляем область силового кабеля
  for (let y = 0; y < height; y++) {
    for (let x = 300; x < 320; x++) {
      if (x === 310) {
        matrix[y][x] = 25 + Math.random() * 5; // Температура кабеля
      } else if (x > 305 && x < 315) {
        matrix[y][x] = 15 + Math.random() * 10;
      }
    }
  }
  
  return matrix;
}

// Моковые данные термограмм для демонстрации
const mockThermograms = [
  {
    id: "thermo-1",
    timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    data: mockThermogramData
  },
  {
    id: "thermo-2",
    timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    data: mockThermogramData
  },
  {
    id: "thermo-3",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    data: mockThermogramData
  },
  {
    id: "thermo-4",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    data: mockThermogramData
  },
  {
    id: "thermo-5",
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    data: mockThermogramData
  },
  {
    id: "thermo-6",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    data: mockThermogramData
  },
  {
    id: "thermo-7",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    data: mockThermogramData
  },
  {
    id: "thermo-8",
    timestamp: new Date().toISOString(),
    data: mockThermogramData
  }
];

/**
 * Обработчик GET запроса для получения ближайшей термограммы к указанному времени
 */
export async function GET(request: Request) {
  try {
    // Получение параметра target_time из URL
    const { searchParams } = new URL(request.url);
    const targetTimeParam = searchParams.get('target_time');
    
    if (!targetTimeParam) {
      return NextResponse.json(
        { error: 'Требуется параметр target_time' },
        { status: 400 }
      );
    }
    
    const targetTime = new Date(targetTimeParam).getTime();
    
    // В реальном приложении здесь будет запрос к вашему API
    // const response = await fetch(`https://your-backend.api/thermograms/closest?target_time=${targetTimeParam}`);
    // const data = await response.json();
    // return NextResponse.json(data);
    
    // Находим ближайшую термограмму к указанному времени
    let closestThermogram = mockThermograms[0];
    let minTimeDiff = Math.abs(new Date(closestThermogram.timestamp).getTime() - targetTime);
    
    for (let i = 1; i < mockThermograms.length; i++) {
      const thermogram = mockThermograms[i];
      const timeDiff = Math.abs(new Date(thermogram.timestamp).getTime() - targetTime);
      
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        closestThermogram = thermogram;
      }
    }
    
    return NextResponse.json(closestThermogram);
  } catch (error) {
    console.error('Ошибка при получении ближайшей термограммы:', error);
    return NextResponse.json(
      { error: 'Не удалось получить ближайшую термограмму' },
      { status: 500 }
    );
  }
}
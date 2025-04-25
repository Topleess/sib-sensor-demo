import { format } from 'date-fns';

// Базовый URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Типы данных
export interface ValueUpdate {
  value: number;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// Интерфейсы ответов API
export interface ThermogramResponse {
  // Тут будет структура ответа с термограммой
  // Ее нужно определить на основе реальных данных от API
  url?: string;
  timestamp?: string;
  data?: any;
}

export interface MaskResponse {
  // Тут будет структура ответа с маской
  // Ее нужно определить на основе реальных данных от API
  url?: string;
  timestamp?: string;
  data?: any;
}

// Функции для работы с API термограмм
export async function getClosestThermogram(targetTime: Date): Promise<ThermogramResponse> {
  const formattedTime = targetTime.toISOString();
  const url = `${API_BASE_URL}/thermograms/closest?target_time=${encodeURIComponent(formattedTime)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 422) {
      const errorData: HTTPValidationError = await response.json();
      throw new Error(`Ошибка валидации: ${JSON.stringify(errorData.detail)}`);
    }
    throw new Error(`Ошибка при получении термограммы: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getAllThermogramTimes(): Promise<string[]> {
  const url = `${API_BASE_URL}/thermograms/times`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Ошибка при получении времен термограмм: ${response.statusText}`);
  }
  
  return response.json();
}

export async function updateHotThreshold(value: number): Promise<void> {
  const url = `${API_BASE_URL}/thermograms/hot_th`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });
  
  if (!response.ok) {
    if (response.status === 422) {
      const errorData: HTTPValidationError = await response.json();
      throw new Error(`Ошибка валидации: ${JSON.stringify(errorData.detail)}`);
    }
    throw new Error(`Ошибка при обновлении горячего порога: ${response.statusText}`);
  }
}

export async function updateColdThreshold(value: number): Promise<void> {
  const url = `${API_BASE_URL}/thermograms/cold_th`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });
  
  if (!response.ok) {
    if (response.status === 422) {
      const errorData: HTTPValidationError = await response.json();
      throw new Error(`Ошибка валидации: ${JSON.stringify(errorData.detail)}`);
    }
    throw new Error(`Ошибка при обновлении холодного порога: ${response.statusText}`);
  }
}

// Функции для работы с масками
export async function getClosestMask(targetTime: Date): Promise<MaskResponse> {
  const formattedTime = targetTime.toISOString();
  const url = `${API_BASE_URL}/masks/closest?target_time=${encodeURIComponent(formattedTime)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 422) {
      const errorData: HTTPValidationError = await response.json();
      throw new Error(`Ошибка валидации: ${JSON.stringify(errorData.detail)}`);
    }
    throw new Error(`Ошибка при получении маски: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getAllMaskTimes(): Promise<string[]> {
  const url = `${API_BASE_URL}/masks/times`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Ошибка при получении времен масок: ${response.statusText}`);
  }
  
  return response.json();
} 
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplet, AlertTriangle, Bell } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { SecuritySensorOverlay } from "@/components/security-sensor-overlay"
import { useEffect, useState, useRef } from "react"
import { 
  ThermogramData, ValueUpdate, TemperatureData, EventsData,
  getAllThermogramTimes, getClosestThermogram,
  updateHotThreshold, updateColdThreshold,
  getAllMaskTimes, getClosestMask, getEventsData,
  getHotTemperatureHistory, getColdTemperatureHistory,
  getCurrentTemperatures
} from "@/lib/api/thermograms"

// Определяем интерфейс для точек графика
interface ChartPoint {
  time?: string;
  day?: string;
  гвс: number | null;
  хвс: number | null;
  лэп: number | null;
  timestamp?: string;
}

// Моковые данные для графиков
const weekData: ChartPoint[] = [
  { day: "Пн", гвс: 65, хвс: 10, лэп: 43 },
  { day: "Вт", гвс: 67, хвс: 9, лэп: 44 },
  { day: "Ср", гвс: 66, хвс: 8, лэп: 42 },
  { day: "Чт", гвс: 65, хвс: 7, лэп: 41 },
  { day: "Пт", гвс: 68, хвс: 9, лэп: 43 },
  { day: "Сб", гвс: 65, хвс: 10, лэп: 42 },
  { day: "Вс", гвс: 64, хвс: 10, лэп: 42 },
];

// Данные для термограммы
const thermalData = [
  { value: 0, color: "#eef2ff" },   // холодно
  { value: 50, color: "#fef9c3" },  // тепло
  { value: 100, color: "#e11d48" }, // горячо
  { value: 150, color: "#9f1239" }, // очень горячо
  { value: 200, color: "#4c1d95" }, // критически горячо
];

// Определяем интерфейс для событий
interface Event {
  id: number | string;
  title: string;
  location: string;
  status: string;
  date: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "Утечка теплоносителя",
    location: "235 м от начала",
    status: "Активно",
    date: "24.04.2024, 10:15"
  },
  {
    id: 2,
    title: "Утечка холодной воды",
    location: "83 м от начала",
    status: "Активно", 
    date: "23.04.2024, 15:30"
  },
  {
    id: 3,
    title: "Повышение температуры ЛЭП 10кВ",
    location: "на расстоянии 230 м",
    status: "Активно",
    date: "22.04.2024, 08:45"
  }
];

// Данные датчиков на трубопроводе
const pipelineSensors = [
  {
    id: "T-101",
    type: "temperature" as const,
    value: "65,2°C",
    status: "normal" as const,
    positionX: 25,
    positionY: 25,
    description: "Датчик ГВС"
  },
  {
    id: "T-102",
    type: "temperature" as const,
    value: "9,8°C",
    status: "normal" as const,
    positionX: 40,
    positionY: 50,
    description: "Датчик ХВС"
  },
  {
    id: "T-103",
    type: "alert" as const,
    value: "Утечка!",
    status: "alert" as const,
    positionX: 75,
    positionY: 25,
    description: "Датчик утечки ГВС"
  },
  {
    id: "T-104",
    type: "alert" as const,
    value: "Утечка!",
    status: "alert" as const,
    positionX: 18,
    positionY: 50,
    description: "Датчик утечки ХВС"
  },
  {
    id: "T-105",
    type: "energy" as const,
    value: "42,5°C",
    status: "warning" as const,
    positionX: 70,
    positionY: 75,
    description: "Датчик ЛЭП (перегрев)"
  },
];

export default function TechDashboardPage() {
  // Состояния для хранения данных из API
  const [thermogramTimes, setThermogramTimes] = useState<string[]>([]);
  const [currentThermogram, setCurrentThermogram] = useState<ThermogramData | null>(null);
  const [maskTimes, setMaskTimes] = useState<string[]>([]);
  const [currentMask, setCurrentMask] = useState<any>(null);
  const [hotThreshold, setHotThreshold] = useState<number>(100);
  const [coldThreshold, setColdThreshold] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("Загрузка...");
  const [currentTemps, setCurrentTemps] = useState<{hot: number, cold: number, lep: number}>({ hot: 65.2, cold: 9.8, lep: 42.5 });
  const [hotHistoryData, setHotHistoryData] = useState<TemperatureData[]>([]);
  const [coldHistoryData, setColdHistoryData] = useState<TemperatureData[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>(weekData);
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [realEvents, setRealEvents] = useState<Event[]>(events);
  const [debugMode, setDebugMode] = useState<boolean>(true); // Режим отладки
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Начало загрузки данных");
        setLoading(true);
        
        // Получаем список времен термограмм
        let thermogramTimesData: string[] = [];
        try {
          thermogramTimesData = await getAllThermogramTimes();
          console.log(`Получено ${thermogramTimesData.length} времен термограмм`);
          setThermogramTimes(thermogramTimesData);
        } catch (thermErr) {
          console.error("Ошибка при загрузке времен термограмм:", thermErr);
          // Используем тестовые времена
          const now = new Date();
          thermogramTimesData = [
            new Date(now.getTime() - 3600000 * 24).toISOString(),
            new Date(now.getTime() - 3600000 * 12).toISOString(),
            new Date(now.getTime() - 3600000 * 6).toISOString(),
            new Date(now.getTime() - 3600000 * 3).toISOString(),
            new Date().toISOString(),
          ];
          setThermogramTimes(thermogramTimesData);
        }
        
        // Если есть хотя бы одно время, загружаем самую последнюю термограмму
        if (thermogramTimesData.length > 0) {
          const latestTime = thermogramTimesData[thermogramTimesData.length - 1];
          console.log(`Загружаем термограмму для времени: ${latestTime}`);
          await fetchThermogramAndMask(latestTime);
        }

        // Загружаем текущие температуры
        try {
          const temps = await getCurrentTemperatures();
          console.log("Получены текущие температуры:", temps);
          setCurrentTemps(temps);
        } catch (tempErr) {
          console.error("Ошибка при загрузке текущих температур:", tempErr);
          // Оставляем дефолтные значения
        }
        
        // Загружаем исторические данные температуры
        let hotHistory: TemperatureData[] = [];
        let coldHistory: TemperatureData[] = [];
        
        try {
          hotHistory = await getHotTemperatureHistory();
          setHotHistoryData(hotHistory);
        } catch (hotErr) {
          console.error("Ошибка при загрузке истории температуры ГВС:", hotErr);
          // Устанавливаем пустой массив, функция prepareChartData сама обработает это
        }
        
        try {
          coldHistory = await getColdTemperatureHistory();
          setColdHistoryData(coldHistory);
        } catch (coldErr) {
          console.error("Ошибка при загрузке истории температуры ХВС:", coldErr);
          // Устанавливаем пустой массив, функция prepareChartData сама обработает это
        }
        
        // Подготавливаем данные для графиков
        console.log("Подготовка данных для графиков");
        prepareChartData(hotHistory, coldHistory);
        
        console.log("Загрузка данных завершена");
      } catch (err) {
        console.error('Общая ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные термограмм');
      } finally {
        setLoading(false);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    };

    fetchData();
    
    // Обновляем данные каждые 5 минут
    const intervalId = setInterval(async () => {
      try {
        console.log("Автоматическое обновление данных");
        const temps = await getCurrentTemperatures();
        setCurrentTemps(temps);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Ошибка при обновлении текущих температур:', err);
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Загрузка термограммы и соответствующей маски
  const fetchThermogramAndMask = async (targetTime: string) => {
    try {
      setLoading(true);
      
      // Загружаем термограмму
      const thermogramData = await getClosestThermogram(targetTime);
      setCurrentThermogram(thermogramData);
      
      // Загружаем также маску для этого времени - нам не критично, если не получится
      try {
        const maskData = await getClosestMask(targetTime);
        if (maskData) {
          setCurrentMask(maskData);
        } else {
          console.log('Маска не получена, но это нормально');
        }
      } catch (maskErr) {
        console.warn('Ошибка при загрузке маски, но продолжаем работу:', maskErr);
        // Ошибка при загрузке маски не критична для отображения термограммы
      }
      
      // Загружаем данные о событиях
      try {
        const events = await getEventsData(targetTime);
        setEventsData(events);
        updateEventsFromData(events);
      } catch (eventsErr) {
        console.warn('Ошибка при загрузке событий:', eventsErr);
      }
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Ошибка при загрузке термограммы:', err);
      setError('Не удалось загрузить термограмму');
    } finally {
      setLoading(false);
    }
  };

  // Функция преобразования данных API в события для отображения
  const updateEventsFromData = (data: EventsData) => {
    console.log("Обработка данных о событиях:", data);
    const newEvents: Event[] = [];
    
    // Проходим по массивам утечек и создаем события
    for (let i = 0; i < data.hot_leak.length; i++) {
      const hotLeakStatus = data.hot_leak[i];
      const coldLeakStatus = data.cold_leak[i];
      const length = data.length[i];
      
      console.log(`Точка ${i}: горячая=${hotLeakStatus}, холодная=${coldLeakStatus}, длина=${length}`);
      
      // Добавляем событие горячей утечки, если она началась
      if (hotLeakStatus === 2) {
        newEvents.push({
          id: `hot-${i}`,
          title: "Утечка теплоносителя",
          location: `${(length * 1000).toFixed(0)} м от начала`,
          status: "Активно",
          date: new Date(data.date_time).toLocaleString()
        });
      }
      
      // Добавляем событие холодной утечки, если она началась
      if (coldLeakStatus === 2) {
        newEvents.push({
          id: `cold-${i}`,
          title: "Утечка холодной воды",
          location: `${(length * 1000).toFixed(0)} м от начала`,
          status: "Активно",
          date: new Date(data.date_time).toLocaleString()
        });
      }
    }
    
    console.log("Сформированные события:", newEvents);
    
    // Если нет событий из API, используем тестовое событие ЛЭП
    if (newEvents.length > 0) {
      setRealEvents(newEvents);
    } else {
      // Добавляем одно событие для ЛЭП, так как оно не отслеживается в API
      const lepEvent: Event = {
        id: 3,
        title: "Повышение температуры ЛЭП 10кВ",
        location: "на расстоянии 230 м",
        status: "Активно",
        date: new Date().toLocaleString()
      };
      setRealEvents([lepEvent]);
    }
  };

  // Обработчик для обновления пороговых значений
  const handleThresholdChange = async (type: 'hot' | 'cold', value: number) => {
    try {
      if (type === 'hot') {
        await updateHotThreshold(value);
        setHotThreshold(value);
      } else {
        await updateColdThreshold(value);
        setColdThreshold(value);
      }
      
      // После обновления порога обновляем текущую термограмму
      if (thermogramTimes.length > 0) {
        const latestTime = thermogramTimes[thermogramTimes.length - 1];
        await fetchThermogramAndMask(latestTime);
      }
    } catch (err) {
      console.error(`Ошибка при обновлении порога ${type}:`, err);
      setError(`Не удалось обновить порог ${type === 'hot' ? 'горячего' : 'холодного'}`);
    }
  };

  // Подготовка данных для графиков из исторических данных
  const prepareChartData = (hotHistory: TemperatureData[], coldHistory: TemperatureData[]) => {
    console.log("Подготовка данных для графиков");
    console.log("Исходные данные ГВС:", hotHistory);
    console.log("Исходные данные ХВС:", coldHistory);
    
    // Если нет данных, возвращаем тестовые
    if (hotHistory.length === 0 && coldHistory.length === 0) {
      console.log("Нет данных из API, используем тестовые данные");
      setChartData(weekData);
      return;
    }
    
    // Создаем объединенный массив точек данных
    const allDataPoints: ChartPoint[] = [];
    
    // Создаем Map для быстрого поиска и обновления существующих точек
    const pointsMap = new Map<string, ChartPoint>();
    
    // Преобразуем данные горячей воды
    hotHistory.forEach(item => {
      const date = new Date(item.timestamp);
      // Формат времени: "ДД.ММ ЧЧ:ММ"
      const timeStr = `${date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
      
      // Используем Map для поиска и обновления точек
      if (!pointsMap.has(item.timestamp)) {
        // Создаем точку с null значениями для неизвестных параметров
        const point: ChartPoint = { 
          timestamp: item.timestamp, 
          time: timeStr,
          гвс: item.value,
          хвс: null as unknown as number, // Будет заполнено позже, если данные есть
          лэп: null as unknown as number  // Будет заполнено позже
        };
        pointsMap.set(item.timestamp, point);
        allDataPoints.push(point);
      } else {
        // Обновляем существующую точку
        const point = pointsMap.get(item.timestamp)!;
        point.гвс = item.value;
      }
    });
    
    // Преобразуем данные холодной воды
    coldHistory.forEach(item => {
      const date = new Date(item.timestamp);
      const timeStr = `${date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
      
      // Используем Map для поиска и обновления точек
      if (!pointsMap.has(item.timestamp)) {
        // Создаем точку с null значениями для неизвестных параметров
        const point: ChartPoint = { 
          timestamp: item.timestamp, 
          time: timeStr,
          гвс: null as unknown as number, // Будет заполнено позже, если данные есть
          хвс: item.value,
          лэп: null as unknown as number  // Будет заполнено позже
        };
        pointsMap.set(item.timestamp, point);
        allDataPoints.push(point);
      } else {
        // Обновляем существующую точку
        const point = pointsMap.get(item.timestamp)!;
        point.хвс = item.value;
      }
    });
    
    // Сортируем точки по времени
    allDataPoints.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    
    // Заполняем пропущенные значения и добавляем ЛЭП
    allDataPoints.forEach(point => {
      // Используем последнее известное значение, если у точки отсутствует ГВС
      if (point.гвс === null) {
        // Ищем ближайшую точку с ГВС
        const lastHotPoint = allDataPoints.find(p => p !== point && p.гвс !== null);
        point.гвс = lastHotPoint ? lastHotPoint.гвс : 65; // Дефолтное значение, если нет данных
      }
      
      // Используем последнее известное значение, если у точки отсутствует ХВС
      if (point.хвс === null) {
        // Ищем ближайшую точку с ХВС
        const lastColdPoint = allDataPoints.find(p => p !== point && p.хвс !== null);
        point.хвс = lastColdPoint ? lastColdPoint.хвс : 10; // Дефолтное значение, если нет данных
      }
      
      // Генерируем значение ЛЭП
      point.лэп = Math.max(35, Math.min(50, (point.гвс || 65) - 20 + (Math.random() * 5 - 2.5)));
    });
    
    console.log(`Подготовлено ${allDataPoints.length} точек данных для графика`);
    
    // Если точек слишком много, выбираем подмножество для лучшей производительности
    let finalDataPoints = allDataPoints;
    
    if (allDataPoints.length > 30) {
      console.log("Слишком много точек, выбираем подмножество для лучшей производительности");
      
      // Вычисляем шаг выборки, чтобы получить примерно 25-30 точек
      const step = Math.max(1, Math.floor(allDataPoints.length / 25));
      
      // Выбираем точки с шагом для ровного распределения
      finalDataPoints = allDataPoints.filter((_, index) => index % step === 0);
      
      // Всегда добавляем последнюю точку для актуальности
      if (allDataPoints.length > 0 && finalDataPoints[finalDataPoints.length - 1] !== allDataPoints[allDataPoints.length - 1]) {
        finalDataPoints.push(allDataPoints[allDataPoints.length - 1]);
      }
      
      console.log(`Отфильтровано до ${finalDataPoints.length} точек с шагом ${step}`);
    }
    
    console.log("Итоговые данные для графиков:", finalDataPoints);
    
    setChartData(finalDataPoints.length > 0 ? finalDataPoints : weekData);
  };

  // Функция для отображения термограммы на основе данных
  const renderThermogram = () => {
    return null; // Просто возвращаем null, так как отрисовка будет происходить через canvas
  };

  // Эффект для отрисовки термограммы на canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (!currentThermogram) {
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#888';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(loading ? "Загрузка термограммы..." : "Термограмма не доступна", canvas.width / 2, canvas.height / 2);
      return;
    }
    
    const thermogramData = currentThermogram.data;
    if (!thermogramData) {
      console.error('Данные термограммы отсутствуют');
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#888';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText("Данные термограммы отсутствуют", canvas.width / 2, canvas.height / 2);
      return;
    }
    
    if (!thermogramData.values || !Array.isArray(thermogramData.values)) {
      console.error('Некорректный формат данных термограммы');
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#888';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText("Некорректный формат данных термограммы", canvas.width / 2, canvas.height / 2);
      return;
    }
    
    // Размеры холста
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Очищаем холст
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Если данные представлены в виде матрицы
    if (Array.isArray(thermogramData.values) && Array.isArray(thermogramData.values[0])) {
      const height = thermogramData.values.length;
      const width = thermogramData.values[0].length;
      
      // Вычисляем размер пикселя
      const pixelWidth = canvasWidth / width;
      const pixelHeight = canvasHeight / height;
      
      // Определяем максимальное и минимальное значения для масштабирования цветов
      let minVal = 0;
      let maxVal = 60; // Максимальная температура на шкале
      
      // Рисуем термограмму
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const value = thermogramData.values[y][x];
          const normalizedValue = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)));
          
          // Определяем цвет в зависимости от значения
          const color = getTemperatureColor(normalizedValue);
          
          ctx.fillStyle = color;
          ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight);
        }
      }
    } else {
      // Для поддержки другого формата данных
      console.error('Неподдерживаемый формат данных термограммы');
    }
  }, [currentThermogram, loading]);
  
  // Функция для получения цвета по значению температуры (0-1)
  const getTemperatureColor = (value: number): string => {
    // Шкала от темно-синего (холодно) через зеленый, желтый, оранжевый к красному (горячо)
    if (value < 0.2) {
      // Синий до голубого
      const blue = Math.floor(255 * (0.2 + value * 4));
      return `rgb(0, 0, ${blue})`;
    } else if (value < 0.4) {
      // Голубой до зеленого
      const scaledValue = (value - 0.2) * 5;
      const green = Math.floor(255 * scaledValue);
      const blue = Math.floor(255 * (1 - scaledValue));
      return `rgb(0, ${green}, ${blue})`;
    } else if (value < 0.6) {
      // Зеленый до желтого
      const scaledValue = (value - 0.4) * 5;
      const red = Math.floor(255 * scaledValue);
      return `rgb(${red}, 255, 0)`;
    } else if (value < 0.8) {
      // Желтый до оранжевого
      const scaledValue = (value - 0.6) * 5;
      const green = Math.floor(255 * (1 - scaledValue));
      return `rgb(255, ${green}, 0)`;
    } else {
      // Оранжевый до красного
      const scaledValue = (value - 0.8) * 5;
      const green = Math.floor(70 * (1 - scaledValue));
      return `rgb(255, ${green}, 0)`;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Коллекторы (технологическая линия)</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">Обновлено {lastUpdated}</p>
          <button 
            onClick={() => setDebugMode(!debugMode)}
            className="px-2 py-1 bg-gray-100 text-xs rounded-md hover:bg-gray-200"
          >
            {debugMode ? "Скрыть отладку" : "Показать отладку"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700">×</button>
        </div>
      )}
      
      {/* Отладочная панель */}
      {debugMode && (
        <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg mb-6 overflow-auto max-h-96 text-xs">
          <h3 className="font-bold mb-2">Состояние данных (режим отладки)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Термограмма:</p>
              <p>Загружено {thermogramTimes.length} времен</p>
              <p>Текущее время: {currentThermogram?.timestamp || "не выбрано"}</p>
              <p>Маска: {currentMask ? "загружена" : "отсутствует"}</p>
            </div>
            <div>
              <p className="font-medium">События:</p>
              <p>Данные API: {eventsData ? "загружены" : "отсутствуют"}</p>
              <p>Активные события: {realEvents.length}</p>
              {eventsData && (
                <div>
                  <p>Точек данных: {eventsData.hot_leak.length}</p>
                  <p>Время данных: {new Date(eventsData.date_time).toLocaleString()}</p>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">Исторические данные:</p>
              <p>ГВС записей: {hotHistoryData.length}</p>
              <p>ХВС записей: {coldHistoryData.length}</p>
              <p>Точек на графике: {chartData.length}</p>
            </div>
            <div>
              <p className="font-medium">Текущие значения:</p>
              <p>ГВС: {currentTemps.hot.toFixed(1)}°C</p>
              <p>ХВС: {currentTemps.cold.toFixed(1)}°C</p>
              <p>ЛЭП: {currentTemps.lep.toFixed(1)}°C</p>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => console.log({
                thermogramTimes,
                currentThermogram,
                eventsData,
                realEvents,
                hotHistoryData,
                coldHistoryData,
                chartData
              })}
              className="px-2 py-1 bg-blue-100 rounded text-blue-700 hover:bg-blue-200"
            >
              Показать данные в консоли
            </button>
          </div>
        </div>
      )}

      {/* Основная секция с картой, температурами и событиями */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Левая колонка: карта и термограмма */}
        <div className="lg:col-span-2 space-y-6">
          {/* Карта с возможным отображением маски */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image 
              src="/images/tech/doc_2025-04-25_04-02-10.png"
              alt="Карта трубопровода"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            
            {/* Отображение маски, если она доступна */}
            {currentMask && currentMask.data && (
              <div className="absolute inset-0 z-10">
                <img 
                  src={`data:image/png;base64,${currentMask.data}`} 
                  alt="Маска"
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            )}
            
            {/* Индикаторы датчиков */}
            <SecuritySensorOverlay sensors={pipelineSensors} />
          </div>
          
          {/* Выбор времени термограммы */}
          <Card className="h-auto flex flex-col mb-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Выбор времени термограммы</span>
                {loading && <span className="text-sm text-gray-400">Загрузка...</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 pt-2">
              <div className="flex gap-2 flex-wrap">
                {thermogramTimes.length > 0 ? (
                  thermogramTimes.slice(-5).map((time, index) => (
                    <button
                      key={index}
                      onClick={() => fetchThermogramAndMask(time)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                    >
                      {new Date(time).toLocaleString()}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Нет доступных времен термограмм</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Термограмма под картой */}
          <Card className="h-auto flex flex-col mb-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Термограмма</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleThresholdChange('cold', coldThreshold - 5)}
                    className="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded-md text-xs"
                  >
                    Холодный порог: {coldThreshold}°C
                  </button>
                  <button 
                    onClick={() => handleThresholdChange('hot', hotThreshold + 5)}
                    className="px-2 py-1 bg-red-100 hover:bg-red-200 rounded-md text-xs"
                  >
                    Горячий порог: {hotThreshold}°C
                  </button>
                </div>
              </CardTitle>
              <CardDescription>
                {currentThermogram 
                  ? `Результаты измерений с ${new Date(currentThermogram.timestamp).toLocaleString()}` 
                  : "Визуализация тепловых характеристик"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4 pt-2 flex-1">
              <div className="h-80 w-full relative">
                <canvas 
                  ref={canvasRef} 
                  width={800} 
                  height={600} 
                  className="w-full h-full"
                ></canvas>
                {renderThermogram()}
                
                {/* Шкала температур */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs px-2 py-1 bg-white/80">
                  <div className="flex items-center space-x-2">
                    <div style={{ width: "10px", height: "10px", backgroundColor: "#0000ff" }}></div>
                    <span>0°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div style={{ width: "10px", height: "10px", backgroundColor: "#00ffff" }}></div>
                    <span>10°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div style={{ width: "10px", height: "10px", backgroundColor: "#00ff00" }}></div>
                    <span>20°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div style={{ width: "10px", height: "10px", backgroundColor: "#ffff00" }}></div>
                    <span>30°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div style={{ width: "10px", height: "10px", backgroundColor: "#ff7f00" }}></div>
                    <span>40°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div style={{ width: "10px", height: "10px", backgroundColor: "#ff0000" }}></div>
                    <span>50°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div style={{ width: "10px", height: "10px", backgroundColor: "#7f0000" }}></div>
                    <span>60°C</span>
                  </div>
                </div>
                
                {/* Ось X - расстояние */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-between text-xs px-4">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                  <span>150</span>
                  <span>200</span>
                  <span>250</span>
                  <span>300</span>
                  <span>350</span>
                </div>
                <div className="absolute bottom-6 left-0 right-0 text-center text-xs">
                  <span>Расстояние, м</span>
                </div>
                
                {/* Аннотации */}
                <div className="absolute top-10 left-10 text-xs bg-white/80 px-1 py-0.5 rounded pointer-events-none">
                  Подающий<br/>трубопровод
                </div>
                <div className="absolute top-1/3 left-10 text-xs bg-white/80 px-1 py-0.5 rounded pointer-events-none">
                  Обратный<br/>трубопровод
                </div>
                <div className="absolute top-1/4 left-1/2 text-xs bg-white/80 px-1 py-0.5 rounded pointer-events-none">
                  Утечка<br/>теплоносителя
                </div>
                <div className="absolute top-3/4 right-1/4 text-xs bg-white/80 px-1 py-0.5 rounded pointer-events-none">
                  Утечка<br/>холодной воды
                </div>
                <div className="absolute top-10 right-10 text-xs bg-white/80 px-1 py-0.5 rounded pointer-events-none">
                  Силовой<br/>кабель
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Правая колонка: события и температуры */}
        <div className="lg:col-span-1 space-y-6">
          {/* События */}
          <Card className="h-auto">
            <CardHeader>
              <CardTitle>События</CardTitle>
              <CardDescription>Текущие активные события</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realEvents.map((event) => (
                  <div key={event.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{event.title}</h3>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {event.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Место:</span> {event.location}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <button className="text-xs text-blue-600 hover:underline">
                        Квитировать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/tech/events" className="text-sm text-blue-600 hover:underline flex justify-between items-center">
                  <span>Смотреть все события</span>
                  <span>→</span>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Актуальные показатели температуры - вертикально */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Температура подающего трубопровода</p>
                  <p className="text-4xl font-bold text-red-500">{currentTemps.hot.toFixed(1)}°C</p>
                  <p className="text-xs text-green-500 mt-1">
                    +2°C за 1ч
                  </p>
                </div>
                <Thermometer className="h-14 w-14 text-red-500" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Температура обратного трубопровода</p>
                  <p className="text-4xl font-bold text-blue-500">{currentTemps.cold.toFixed(1)}°C</p>
                  <p className="text-xs text-gray-500 mt-1">
                    +0°C за 1ч
                  </p>
                </div>
                <Thermometer className="h-14 w-14 text-blue-500" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Температура ЛЭП 10кВ</p>
                  <p className="text-4xl font-bold text-amber-500">{currentTemps.lep.toFixed(1)}°C</p>
                  <p className="text-xs text-amber-500 mt-1">
                    -1°C за 1ч
                  </p>
                </div>
                <Thermometer className="h-14 w-14 text-orange-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Графики температур - увеличенные */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Температура подающего трубопровода</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={chartData[0]?.time ? "time" : "day"} 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                  tick={{fontSize: 10}}
                />
                <YAxis domain={[50, 80]} />
                <Tooltip 
                  formatter={(value: any) => [`${value} °C`, 'Температура ГВС']} 
                  labelFormatter={(label) => `Время: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="гвс" 
                  name="Температура подающего трубопровода" 
                  stroke="#ef4444" 
                  strokeWidth={1.5}
                  connectNulls={true}
                  dot={chartData.length > 20 ? false : { r: 2 }} 
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Температура обратного трубопровода</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={chartData[0]?.time ? "time" : "day"} 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                  tick={{fontSize: 10}}
                />
                <YAxis domain={[4, 12]} />
                <Tooltip 
                  formatter={(value: any) => [`${value} °C`, 'Температура ХВС']} 
                  labelFormatter={(label) => `Время: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="хвс" 
                  name="Температура обратного трубопровода" 
                  stroke="#3b82f6" 
                  strokeWidth={1.5}
                  connectNulls={true}
                  dot={chartData.length > 20 ? false : { r: 2 }} 
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Температура ЛЭП 10кВ</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={chartData[0]?.time ? "time" : "day"} 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                  tick={{fontSize: 10}}
                />
                <YAxis domain={[35, 50]} />
                <Tooltip 
                  formatter={(value: any) => [`${value} °C`, 'Температура ЛЭП']} 
                  labelFormatter={(label) => `Время: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="лэп" 
                  name="Температура ЛЭП 10кВ" 
                  stroke="#f59e0b" 
                  strokeWidth={1.5}
                  connectNulls={true}
                  dot={chartData.length > 20 ? false : { r: 2 }} 
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import Image from 'next/image';
import { 
  useClosestThermogram, 
  useThermogramTimes, 
  useThresholdUpdate 
} from '@/hooks/useThermogram';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ThermogramViewer() {
  // Состояния для выбора даты/времени и пороговых значений
  const [selectedTimeStr, setSelectedTimeStr] = useState<string | null>(null);
  const [hotThreshold, setHotThreshold] = useState<number>(25);
  const [coldThreshold, setColdThreshold] = useState<number>(15);

  // Получаем доступные времена термограмм
  const { times, loading: loadingTimes, error: timesError } = useThermogramTimes();

  // Получаем термограмму ближайшую к выбранному времени
  const { 
    thermogram, 
    loading: loadingThermogram, 
    error: thermogramError 
  } = useClosestThermogram(selectedTimeStr ? parseISO(selectedTimeStr) : null);

  // Хук для обновления пороговых значений
  const { 
    updateHot, 
    updateCold, 
    updating: updatingThreshold, 
    error: thresholdError 
  } = useThresholdUpdate();

  // Обработчики событий
  const handleTimeChange = (value: string) => {
    setSelectedTimeStr(value);
  };

  const handleHotThresholdChange = async () => {
    const success = await updateHot(hotThreshold);
    if (success) {
      toast.success('Горячий порог успешно обновлен');
    } else {
      toast.error(`Ошибка при обновлении горячего порога: ${thresholdError?.message}`);
    }
  };

  const handleColdThresholdChange = async () => {
    const success = await updateCold(coldThreshold);
    if (success) {
      toast.success('Холодный порог успешно обновлен');
    } else {
      toast.error(`Ошибка при обновлении холодного порога: ${thresholdError?.message}`);
    }
  };

  // Форматирование даты/времени для отображения
  const formatDateTime = (isoString: string) => {
    return format(parseISO(isoString), 'dd MMM yyyy HH:mm:ss', { locale: ru });
  };

  // Если есть ошибки, показываем их
  if (timesError) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h3 className="font-medium">Ошибка при загрузке данных:</h3>
        <p>{timesError.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Просмотр термограмм</h2>
        <p className="text-gray-500">Выберите время и настройте параметры отображения</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Панель выбора времени и настроек */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="time-select">Выберите время термограммы</Label>
            {loadingTimes ? (
              <Skeleton className="h-10" />
            ) : (
              <Select onValueChange={handleTimeChange} value={selectedTimeStr || undefined}>
                <SelectTrigger id="time-select">
                  <SelectValue placeholder="Выберите время" />
                </SelectTrigger>
                <SelectContent>
                  {times.map((time) => (
                    <SelectItem key={time} value={time}>
                      {formatDateTime(time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="font-medium">Настройка пороговых значений</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hot-threshold">Горячий порог: {hotThreshold}°C</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    id="hot-threshold"
                    min={0} 
                    max={50} 
                    step={0.5} 
                    value={[hotThreshold]} 
                    onValueChange={(values) => setHotThreshold(values[0])}
                    disabled={updatingThreshold}
                  />
                  <Button 
                    size="sm" 
                    onClick={handleHotThresholdChange}
                    disabled={updatingThreshold}
                  >
                    Применить
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cold-threshold">Холодный порог: {coldThreshold}°C</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    id="cold-threshold" 
                    min={0} 
                    max={50} 
                    step={0.5} 
                    value={[coldThreshold]} 
                    onValueChange={(values) => setColdThreshold(values[0])}
                    disabled={updatingThreshold}
                  />
                  <Button 
                    size="sm" 
                    onClick={handleColdThresholdChange}
                    disabled={updatingThreshold}
                  >
                    Применить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Область отображения термограммы */}
        <div className="border rounded-lg overflow-hidden">
          {!selectedTimeStr ? (
            <div className="h-full flex items-center justify-center p-6 text-gray-500">
              Выберите время термограммы для просмотра
            </div>
          ) : loadingThermogram ? (
            <div className="h-full flex items-center justify-center">
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : thermogramError ? (
            <div className="p-4 bg-red-50 text-red-800 h-full flex items-center justify-center">
              <div>
                <h3 className="font-medium">Ошибка при загрузке термограммы:</h3>
                <p>{thermogramError.message}</p>
              </div>
            </div>
          ) : thermogram ? (
            <div className="relative w-full h-[300px] md:h-[400px]">
              {/* Предполагаем, что термограмма имеет URL-изображение */}
              {thermogram.url ? (
                <Image 
                  src={thermogram.url} 
                  alt={`Термограмма от ${thermogram.timestamp}`}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p>Данные термограммы получены, но изображение недоступно</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 
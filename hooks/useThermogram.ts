import { useState, useEffect } from 'react';
import { 
  getClosestThermogram, 
  getAllThermogramTimes, 
  updateHotThreshold, 
  updateColdThreshold,
  getClosestMask,
  getAllMaskTimes,
  ThermogramResponse,
  MaskResponse
} from '@/lib/api/thermogram';

export function useThermogramTimes() {
  const [times, setTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        setLoading(true);
        const data = await getAllThermogramTimes();
        setTimes(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Неизвестная ошибка при загрузке времен термограмм'));
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, []);

  return { times, loading, error };
}

export function useClosestThermogram(targetTime: Date | null) {
  const [thermogram, setThermogram] = useState<ThermogramResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!targetTime) return;

    const fetchThermogram = async () => {
      try {
        setLoading(true);
        const data = await getClosestThermogram(targetTime);
        setThermogram(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Неизвестная ошибка при загрузке термограммы'));
      } finally {
        setLoading(false);
      }
    };

    fetchThermogram();
  }, [targetTime]);

  return { thermogram, loading, error };
}

export function useMaskTimes() {
  const [times, setTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        setLoading(true);
        const data = await getAllMaskTimes();
        setTimes(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Неизвестная ошибка при загрузке времен масок'));
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, []);

  return { times, loading, error };
}

export function useClosestMask(targetTime: Date | null) {
  const [mask, setMask] = useState<MaskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!targetTime) return;

    const fetchMask = async () => {
      try {
        setLoading(true);
        const data = await getClosestMask(targetTime);
        setMask(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Неизвестная ошибка при загрузке маски'));
      } finally {
        setLoading(false);
      }
    };

    fetchMask();
  }, [targetTime]);

  return { mask, loading, error };
}

export function useThresholdUpdate() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateHot = async (value: number) => {
    try {
      setUpdating(true);
      await updateHotThreshold(value);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Неизвестная ошибка при обновлении горячего порога'));
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const updateCold = async (value: number) => {
    try {
      setUpdating(true);
      await updateColdThreshold(value);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Неизвестная ошибка при обновлении холодного порога'));
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { updateHot, updateCold, updating, error };
} 
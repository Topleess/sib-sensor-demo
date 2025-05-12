import { NextResponse } from 'next/server';

// Имитация хранения порогового значения (в реальном приложении будет храниться в базе данных)
let coldThreshold = 50;

/**
 * Обработчик PUT запроса для обновления порогового значения холодного
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Проверка наличия необходимого поля
    if (typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Требуется числовое значение value' },
        { status: 400 }
      );
    }
    
    // В реальном приложении здесь будет запрос к вашему API
    // const response = await fetch('https://your-backend.api/thermograms/cold_th', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ value: body.value }),
    // });
    // if (!response.ok) throw new Error('Failed to update cold threshold');
    // return NextResponse.json(await response.json());
    
    // Обновляем пороговое значение
    coldThreshold = body.value;
    
    console.log(`Обновлено пороговое значение "холодного": ${coldThreshold}`);
    
    return NextResponse.json({ success: true, value: coldThreshold });
  } catch (error) {
    console.error('Ошибка при обновлении порогового значения холодного:', error);
    return NextResponse.json(
      { error: 'Не удалось обновить пороговое значение холодного' },
      { status: 500 }
    );
  }
} 
import { AnalysisResult } from '../types';

export const analyzeImageWithGemini = async (base64Data: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Important to send the HttpOnly cookie
      body: JSON.stringify({
        base64Data,
        mimeType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    return result as AnalysisResult;
  } catch (error: any) {
    if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor backend. Asegúrate de que SATI Backend esté corriendo en el puerto 3001.');
    }
    console.error('Service API Error:', error);
    throw new Error(error.message || 'Error desconocido al analizar la imagen.');
  }
};

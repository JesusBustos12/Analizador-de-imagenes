export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  token?: string;
  daily_analyses_count?: number;
}

export interface AnalysisResult {
  threatLevel: 'ALTA' | 'MEDIA' | 'BAJA' | 'NINGUNA';
  detectedItems: string[];
  analysis: string;
  recommendations: string;
}

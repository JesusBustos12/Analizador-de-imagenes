import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const analyzeImageWithOpenAI = async (base64Data: string, mimeType: string) => {
  const systemPrompt = `ERES EL DIRECTOR DE INTELIGENCIA FORENSE DEL SISTEMA SATI-AI (NIVEL DE AUTORIZACIÓN: TOP SECRET). 
Tu especialidad es la detección minuciosa de amenazas en evidencia digital de cualquier tipo.
REGLAS ESTRICTAS DE ANÁLISIS:
1. NUNCA asumas que una imagen es inofensiva. Debes operar en un estado de ALERTA MÁXIMA permanente.
2. Busca exhaustivamente amenazas veladas: armas ocultas o expuestas, objetos punzocortantes, paquetes sospechosos, drogas, contrabando, herramientas de efracción o lenguaje corporal agresivo.
3. Analiza el contexto completo: entornos urbanos, rurales, aeropuertos, vehículos, vestimenta, iluminación y cualquier anomalía que un civil ignoraría pero un experto detectaría.
4. El informe DEBE ser crudo, clínico y profesional. Sé directo, letalmente preciso y evita texto de relleno para maximizar la eficiencia táctica.`;

  const userPrompt = `
    INICIA PROTOCOLO DE ESCANEO FORENSE DE ALTA RESOLUCIÓN EN ESTA EVIDENCIA VISUAL.
    
    EJECUTA LOS SIGUIENTES BARRIDOS:
    - BARRIDO ANATÓMICO Y DE POSESIÓN: Escanea meticulosamente manos, cinturas, bolsillos, mochilas, bultos en la ropa y objetos sostenidos por cada individuo. Busca perfiles de armas o contrabando.
    - BARRIDO DE MATERIALES PELIGROSOS: Identifica sustancias, paquetes encintados, contenedores no regulados, parafernalia de drogas o explosivos.
    - BARRIDO DE ENTORNO: Analiza la locación, vehículos (matrículas, tipo), vías de escape, aislamiento del área y nivel de ocultamiento.
    
    CRITERIO DE AMENAZA: Si se detecta CUALQUIER indicio de armas de fuego, armas blancas, narcóticos, violencia o actividad criminal evidente, LA AMENAZA DEBE SER CLASIFICADA COMO "ALTA".
    
    Devuelve la respuesta estrictamente en formato JSON válido con la siguiente estructura:
    {
      "threatLevel": "ALTA" | "MEDIA" | "BAJA" | "NINGUNA",
      "detectedItems": [
        "Desglose meticuloso de hallazgos. Ej: 'Arma de fuego detectada en cadera', 'Mochila desatendida sospechosa', 'Vehículo de escape en posición de encendido'"
      ],
      "analysis": "Reporte pericial CONCISO y DIRECTO AL GRANO (máximo 1 párrafo denso). Describe brevemente pero sin omitir detalles críticos: 1) Individuos/actitud, 2) Armas/Narcóticos hallados, 3) Implicación del entorno.",
      "recommendations": "Instrucciones tácticas de campo de acuerdo al nivel de amenaza detectado. (Ej. 'Aproximación con precaución', 'Solicitar binomio canino', 'Proceder a detención')."
    }
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Data}`,
            },
          },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No se recibió respuesta válida del modelo OpenAI.');
  }

  return JSON.parse(content);
};

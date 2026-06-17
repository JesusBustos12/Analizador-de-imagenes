import React, { useState, useRef } from 'react';
import { Shield, Crosshair, FileText, ShieldAlert, AlertTriangle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import DOMPurify from 'dompurify';
import { AnalysisResult } from '../../types';

const sanitizeConfig = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'span'],
  ALLOWED_ATTR: [],
  FORBID_TAGS: ['style', 'script', 'img', 'svg', 'iframe', 'video', 'audio', 'object', 'embed'],
  FORBID_ATTR: ['style', 'on*']
};

interface AnalysisReportProps {
  selectedImage: string | null;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
}

export const AnalysisReport = React.memo(({ selectedImage, isAnalyzing, result }: AnalysisReportProps) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      setIsExporting(true);
      
      // Allow UI to update to loading state
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = reportRef.current;
      
      const imgData = await toPng(element, {
        quality: 1,
        backgroundColor: '#f8fafc', // slate-50 to match bg
        pixelRatio: 2,
        style: {
          transform: 'none'
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 15, pdfWidth, pdfHeight);

      // --- Security Overlay & Forensic Watermarks ---
      
      // 1. Diagonal Watermark
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(60);
      pdf.text('CONFIDENCIAL', pdfWidth / 2, pdfHeight / 2 + 15, { angle: 45, align: 'center', opacity: 0.1 } as any);

      // 2. Top Classification Banner
      pdf.setFillColor(220, 38, 38); // Red background
      pdf.rect(0, 0, pdfWidth, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DOCUMENTO CLASIFICADO - USO EXCLUSIVO SATI', pdfWidth / 2, 6, { align: 'center' });

      // 3. Footer Metadata & Tracking Hash
      const timestamp = new Date().toISOString();
      const trackingHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Fecha de Emisión: ${timestamp}`, 10, 285);
      pdf.text(`Firma Digital (Hash): ${trackingHash}`, 10, 290);
      pdf.text(`Página 1 de 1`, pdfWidth - 30, 290);

      pdf.save(`Reporte_Forense_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert("Hubo un error al generar el PDF. Asegúrate de que no haya restricciones de renderizado.");
    } finally {
      setIsExporting(false);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'ALTA': return 'bg-red-100 text-red-800 border-red-300';
      case 'MEDIA': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'BAJA': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'NINGUNA': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'ALTA': return <ShieldAlert className="w-6 h-6 text-red-600" />;
      case 'MEDIA': return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'BAJA': return <Info className="w-6 h-6 text-blue-600" />;
      case 'NINGUNA': return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      default: return <Shield className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
        <h3 className="font-medium text-slate-800 flex items-center">
          <FileText className="w-4 h-4 mr-2 text-slate-500" />
          Reporte de Inteligencia
        </h3>
        {result && (
          <span className="text-xs font-mono text-slate-500">
            ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </span>
        )}
      </div>

      <div className="p-0 flex-1 bg-slate-50/50 overflow-y-auto">
        {!selectedImage && !result && !isAnalyzing && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 min-h-[400px]">
            <Shield className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-sm text-center max-w-sm">
              El panel de resultados se activará una vez que se cargue y analice una imagen.
            </p>
          </div>
        )}

        {isAnalyzing && (
          <div className="h-full flex flex-col items-center justify-center text-blue-600 p-8 min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Crosshair className="w-12 h-12 mb-4 opacity-80" />
            </motion.div>
            <p className="text-sm font-medium animate-pulse">Escaneando base de datos de amenazas...</p>
          </div>
        )}

        <AnimatePresence>
          {result && !isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 space-y-6"
            >
              {/* Contenedor del Reporte para el PDF */}
              <div ref={reportRef} className="space-y-6 bg-slate-50/50 p-2 rounded-lg">
              {/* Threat Level Indicator */}
              <div className={`p-4 rounded-lg border flex items-center justify-between ${getThreatColor(result.threatLevel)}`}>
                <div className="flex items-center space-x-3">
                  {getThreatIcon(result.threatLevel)}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">Nivel de Amenaza</p>
                    <p className="text-lg font-bold">{result.threatLevel}</p>
                  </div>
                </div>
              </div>

              {/* Detected Items */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">
                  Objetos Detectados
                </h4>
                {result.detectedItems.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.detectedItems.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm bg-white p-2 rounded border border-slate-200 shadow-sm">
                        <Crosshair className="w-4 h-4 mr-2 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic bg-white p-3 rounded border border-slate-200">
                    No se detectaron objetos de interés en la imagen.
                  </p>
                )}
              </div>

              {/* Analysis Text */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">
                  Análisis Detallado
                </h4>
                <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                  <div 
                    className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.analysis, sanitizeConfig) }}
                  />
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">
                  Recomendaciones Tácticas
                </h4>
                <div className="bg-slate-800 p-4 rounded border border-slate-700 shadow-sm text-slate-200">
                  <div 
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.recommendations, sanitizeConfig) }}
                  />
                </div>
              </div>
              </div> {/* Fin del contenedor del reporte */}
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  {isExporting ? (
                    <span key="exporting" className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generando PDF...
                    </span>
                  ) : (
                    <span key="idle" className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Exportar Reporte PDF
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

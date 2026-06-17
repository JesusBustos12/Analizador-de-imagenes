import React, { RefObject, ChangeEvent, DragEvent } from 'react';
import { FileImage, X, UploadCloud, Search, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../../types';

interface ImageUploaderProps {
  user: User;
  selectedImage: string | null;
  isAnalyzing: boolean;
  error: string | null;
  isDragging: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onClearSelection: () => void;
  onAnalyzeImage: () => void;
}

export const ImageUploader = React.memo(({
  user,
  selectedImage,
  isAnalyzing,
  error,
  isDragging,
  fileInputRef,
  onImageSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  onClearSelection,
  onAnalyzeImage
}: ImageUploaderProps) => {
  const usageCount = user?.daily_analyses_count || 0;
  const isLimitReached = usageCount >= 5;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h3 className="font-medium text-slate-800 flex items-center">
          <FileImage className="w-4 h-4 mr-2 text-slate-500" />
          Entrada de Imagen
        </h3>
        {selectedImage && (
          <button 
            onClick={onClearSelection}
            className="text-xs text-slate-500 hover:text-red-600 flex items-center transition-colors"
          >
            <X className="w-3 h-3 mr-1" /> Limpiar
          </button>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col overflow-y-auto">
        {!selectedImage ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors flex-1 flex flex-col items-center justify-center min-h-[300px] ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef as any}
              onChange={onImageSelect}
              accept="image/*"
              className="hidden" 
            />
            <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-slate-100">
              <UploadCloud className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">Arrastre y suelte una imagen aquí</p>
            <p className="text-xs text-slate-500 mb-4">PNG, JPG, WEBP hasta 10MB</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
            >
              Seleccionar Archivo
            </button>
          </div>
        ) : (
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center flex-1 min-h-[200px]">
              <img 
                src={selectedImage} 
                alt="Evidencia seleccionada" 
                className="max-w-full max-h-full object-contain z-10 relative"
                referrerPolicy="no-referrer"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)]"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  />
                  <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                </div>
              )}
            </div>
            
            <button
              onClick={onAnalyzeImage}
              disabled={isAnalyzing || isLimitReached}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <span key="analyzing" className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando Análisis...
                </span>
              ) : (
                <span key="idle" className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Iniciar Análisis Táctico
                </span>
              )}
            </button>

            {/* Visual limit element */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Consultas restantes por hoy</span>
                <span className="font-medium text-slate-700">{5 - usageCount} / 5 restantes</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 flex justify-end ${isLimitReached ? 'bg-red-500' : usageCount >= 3 ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.max(((5 - usageCount) / 5) * 100, 0)}%` }}
                ></div>
              </div>
              {isLimitReached && (
                <p className="text-xs text-red-600 mt-2 font-medium flex items-center justify-center">
                  <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
                  Has agotado tus 5 consultas diarias.
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start text-sm text-red-700">
            <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
});

import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { FallbackProps } from 'react-error-boundary';

export const ErrorBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="min-h-[400px] h-full w-full flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-red-100">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-200"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Crítico Detectado</h2>
        <p className="text-slate-600 mb-6 text-sm">
          El módulo de análisis táctico ha encontrado una anomalía inesperada. Por favor, reinicie el componente.
        </p>

        <div className="bg-slate-100 p-4 rounded-lg mb-6 text-left overflow-x-auto">
          <p className="text-xs font-mono text-red-600 whitespace-pre-wrap break-words">
            {error.message}
          </p>
        </div>

        <button
          onClick={resetErrorBoundary}
          className="w-full flex items-center justify-center py-3 px-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reiniciar Componente
        </button>
      </motion.div>
    </div>
  );
};

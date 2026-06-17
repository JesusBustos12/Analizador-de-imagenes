import { useState, FormEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User } from '../../types';
import { Shield, Lock, Mail, Loader2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
}

export const EditProfileModal = ({ user, isOpen, onClose, onUpdate }: EditProfileModalProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Nombre e Identificación son requeridos.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    await new Promise(r => setTimeout(r, 600));

    const result = await onUpdate(user.id, name, email, password || undefined);
    
    if (!result.success) {
      setError(result.error || 'Ocurrió un error al actualizar el perfil.');
    } else {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
    
    setIsLoading(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark Overlay with Blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
      />
      
      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="bg-slate-900 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-700 w-full max-w-md overflow-hidden relative z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 py-5 border-b border-slate-800 bg-slate-800/50 flex items-center">
          <div className="bg-blue-600/20 p-2 rounded-lg mr-3 border border-blue-500/30">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Actualizar Expediente</h3>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mt-0.5">Nivel de Acceso: Oficial</p>
          </div>
        </div>

        <div className="p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-md"
                >
                  <div className="flex text-sm text-red-400">
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-r-md text-sm text-emerald-400 font-medium"
                >
                  Cambios guardados exitosamente. Sincronizando...
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nombre y Rango del Oficial</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Identificación Oficial (Email)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 block w-full py-2.5 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 mt-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Seguridad de Acceso</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 block w-full py-2.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                  placeholder="Nueva contraseña (opcional)"
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-500">Deje en blanco si desea mantener la contraseña actual.</p>
            </div>

            <div className="pt-4 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading || success}
                className="flex-1 py-3 px-4 rounded-md text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || success}
                className="flex-1 flex justify-center py-3 px-4 rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Confirmar Cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
;

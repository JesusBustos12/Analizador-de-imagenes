import { useState } from 'react';
import { Shield, Lock, Mail, Loader2, AlertTriangle, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  onLogin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  onSwitchToRegister: () => void;
}

export const Login = ({ onLogin, onSwitchToRegister }: LoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);
    
    // Tiny artificial delay for better UX flow feel
    await new Promise(r => setTimeout(r, 600));

    const result = await onLogin(data.email, data.password);
    if (!result.success) {
      setAuthError(result.error || 'Autenticación fallida');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.9)), url("/security-bg.png")',
        }}
      />
      
      {/* Tactical Grid and Vignette Overlay */}
      <div 
        className="absolute inset-0 z-0 mix-blend-overlay pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, transparent 0%, #020617 100%), linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)', 
          backgroundSize: '100% 100%, 40px 40px, 40px 40px' 
        }} 
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg ring-4 ring-blue-600/30">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Acceso al Sistema
        </h2>
        <p className="mt-2 text-center text-sm text-slate-300 uppercase tracking-widest font-semibold">
          Departamento de Seguridad Pública
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-slate-200"
        >
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            <AnimatePresence>
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{authError}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-slate-700">Identificación Oficial (Email)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="pl-10 block w-full py-2.5 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="oficial@dsp.gov"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Contraseña Táctica</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className="pl-10 block w-full py-2.5 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Ingresar al SATI'
                )}
              </button>
            </div>
            
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6">
              <span className="text-sm text-slate-500">¿Nuevo oficial en la dependencia?</span>
              <button 
                type="button" 
                onClick={onSwitchToRegister}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center transition-colors"
              >
                Solicitar Registro <UserPlus className="ml-1 w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      
      {/* Disclaimer tag */}
      <div className="absolute bottom-4 w-full text-center z-10">
         <p className="text-xs text-slate-400/80">Sistema de Acceso Restringido. Todo acceso no autorizado será documentado.</p>
      </div>
    </div>
  );
};

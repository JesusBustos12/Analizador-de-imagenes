import { useState, useEffect } from 'react';
import { Shield, Lock, Mail, Loader2, AlertTriangle, ArrowLeft, BadgeInfo, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterProps {
  onRegister: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  onSwitchToLogin: () => void;
}

export const Register = ({ onRegister, onSwitchToLogin }: RegisterProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setAuthError(null);
    
    // Tiny artificial delay
    await new Promise(r => setTimeout(r, 600));

    const result = await onRegister(data.name, data.email, data.password);
    if (!result.success) {
      setAuthError(result.error || 'Ocurrió un error al intentar crear el registro.');
    } else {
      setIsSuccess(true);
      // Redirigir automáticamente después de 3 segundos
      setTimeout(() => {
        onSwitchToLogin();
      }, 3000);
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
          <div className="bg-slate-700 p-3 rounded-2xl shadow-lg border-2 border-slate-600">
            {isSuccess ? (
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            ) : (
              <BadgeInfo className="w-12 h-12 text-slate-300" />
            )}
          </div>
        </motion.div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          {isSuccess ? 'Expediente Creado' : 'Registro de Oficial'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-300 uppercase tracking-widest font-semibold">
          {isSuccess ? 'Aprobación exitosa' : 'Alta en Sistema de Análisis Táctico'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-slate-200 overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-6"
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">¡Registro completado!</h3>
                <p className="text-slate-600 mb-8">
                  Tu expediente ha sido dado de alta exitosamente en la plataforma SATI.
                  Serás redirigido para acreditar tus credenciales en un momento...
                </p>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all"
                >
                  Ir al Login ahora
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5" 
                onSubmit={handleSubmit(onSubmit)}
              >
                
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
                  <label className="block text-sm font-medium text-slate-700">Nombre Completo y Rango</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      {...register('name')}
                      className="block w-full py-2.5 px-3 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ej. Agte. Especial Juan Pérez"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

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
                      placeholder="juan.perez@dsp.gov"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Crear Contraseña Táctica</label>
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
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Crear Expediente'
                    )}
                  </button>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6">
                  <button 
                    type="button" 
                    onClick={onSwitchToLogin}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center transition-colors w-full justify-center"
                  >
                    <ArrowLeft className="mr-1 w-4 h-4" /> Volver a Identificación Segura
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

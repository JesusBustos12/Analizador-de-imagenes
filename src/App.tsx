import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { Header } from './components/layout/Header';
import { ImageUploader } from './components/analyzer/ImageUploader';
import { AnalysisReport } from './components/analyzer/AnalysisReport';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { EditProfileModal } from './components/auth/EditProfileModal';
import { ErrorBoundaryFallback } from './components/layout/ErrorBoundaryFallback';
import { useImageAnalyzer } from './hooks/useImageAnalyzer';
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) {
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  const { currentUser, isInitializing, login, register, updateProfile, logout, refreshUser } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const navigate = useNavigate();

  const {
    selectedImage,
    isAnalyzing,
    result,
    error,
    isDragging,
    fileInputRef,
    handleImageSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearSelection,
    analyzeImage
  } = useImageAnalyzer({ onSuccess: refreshUser });

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isAuthenticated = !!currentUser;

  const handleLogin = async (e: string, p?: string) => {
    const res = await login(e, p);
    if (res.success) navigate('/');
    return res;
  };

  const handleRegister = async (n: string, e: string, p?: string) => {
    const res = await register(n, e, p);
    // Removemos la redirección automática aquí para permitir que Register.tsx muestre el popup de éxito
    return res;
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={() => window.location.href = '/'}>
      <Helmet>
        <html lang="es" />
        <title>SATI | Sistema Avanzado Táctico de Inteligencia</title>
        <meta name="description" content="Plataforma de análisis forense y detección de amenazas en evidencia digital mediante IA (gpt-5-mini). Uso exclusivo gubernamental." />
        <meta name="keywords" content="SATI, Seguridad, Inteligencia, IA, Evidencia Digital, Forense, Análisis de Imágenes" />
        <meta property="og:title" content="SATI Secure Platform" />
        <meta property="og:description" content="Análisis forense de evidencia digital asistido por Inteligencia Artificial." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SATI Secure Platform" />
        <meta name="twitter:description" content="Sistema Avanzado Táctico de Inteligencia para seguridad." />
      </Helmet>

      <Routes>
        <Route path="/login" element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Login onLogin={handleLogin} onSwitchToRegister={() => navigate('/register')} />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Register onRegister={handleRegister} onSwitchToLogin={() => navigate('/login')} />
          </PublicRoute>
        } />
        
        <Route path="/" element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <div className="h-screen overflow-hidden font-sans text-slate-100 flex flex-col relative bg-slate-950">
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.95)), url("/security-bg.png")',
                }}
              />
              
              <div 
                className="absolute inset-0 z-0 mix-blend-overlay pointer-events-none" 
                style={{ 
                  backgroundImage: 'radial-gradient(circle at center, transparent 0%, #020617 100%), linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)', 
                  backgroundSize: '100% 100%, 40px 40px, 40px 40px' 
                }} 
              />

              <div className="relative z-10 flex flex-col h-full overflow-hidden">
                <Header 
                  user={currentUser!} 
                  onLogout={logout} 
                  onEditProfile={() => setIsEditProfileOpen(true)}
                />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-0">
                  <div className="mb-6 flex-shrink-0 pt-4 px-2">
                    <h2 className="text-2xl font-semibold text-white tracking-wide">Panel de Análisis de Evidencia Digital</h2>
                    <p className="text-slate-300 mt-1 text-sm font-medium">Cargue imágenes para detección automatizada de amenazas, armas y sustancias controladas usando gpt-5-mini.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                    <div className="lg:col-span-5 flex flex-col min-h-0">
                      <ImageUploader 
                        user={currentUser!}
                        selectedImage={selectedImage}
                        isAnalyzing={isAnalyzing}
                        error={error}
                        isDragging={isDragging}
                        fileInputRef={fileInputRef}
                        onImageSelect={handleImageSelect}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClearSelection={clearSelection}
                        onAnalyzeImage={analyzeImage}
                      />
                    </div>

                    <div className="lg:col-span-7 flex flex-col min-h-0">
                      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                        <AnalysisReport 
                          selectedImage={selectedImage}
                          isAnalyzing={isAnalyzing}
                          result={result}
                        />
                      </ErrorBoundary>
                    </div>
                  </div>
                </main>
              </div>

              <EditProfileModal 
                user={currentUser!}
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                onUpdate={updateProfile}
              />
            </div>
          </PrivateRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

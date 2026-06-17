import { Shield, Activity, LogOut } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onEditProfile: () => void;
}

export const Header = ({ user, onLogout, onEditProfile }: HeaderProps) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md text-white shadow-xl border-b border-slate-700/50 p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="hidden sm:block text-lg font-bold tracking-wide uppercase">Sistema de Análisis Táctico</h1>
            <h1 className="sm:hidden text-lg font-bold tracking-wide uppercase">SATI</h1>
            <p className="hidden sm:block text-xs text-slate-400 uppercase tracking-wider">Departamento de Seguridad Pública</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-medium text-slate-200">{user.name}</span>
            <span className="text-xs text-slate-400">{user.email}</span>
          </div>
          <button 
            onClick={onEditProfile}
            title="Editar Perfil"
            className="h-8 w-8 rounded-full bg-blue-700 border border-blue-500 flex items-center justify-center font-bold text-xs shadow-inner hover:bg-blue-600 hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer z-50"
          >
            {user.name ? user.name.substring(0, 2).toUpperCase() : '??'}
          </button>
          
          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          
          <button 
            onClick={onLogout}
            className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors bg-slate-800 hover:bg-slate-800/80 px-3 py-1.5 rounded-md focus:outline-none cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};

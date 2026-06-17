import { useState, useEffect } from 'react';
import { User } from '../types';

const API_URL = 'http://localhost:3001/api/auth';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_URL}/check`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error('Failed to parse current user session', e);
      setCurrentUser(null);
    } finally {
      setIsInitializing(false);
    }
  };

  // Check for an active session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Autenticación fallida' };
      }

      setCurrentUser(data.user);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Ocurrió un error de red al iniciar sesión.' };
    }
  };

  const register = async (name: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
         return { success: false, error: data.error || 'Error al registrar' };
      }

      // No seteamos el currentUser aquí porque queremos que inicie sesión manualmente
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Ocurrió un error de red al registrar el usuario.' };
    }
  };

  const updateProfile = async (id: string, name: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Error actualizando perfil' };
      }

      // Auto update current session
      if (currentUser?.id === id) {
        setCurrentUser(data.user);
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Ocurrió un error de red al actualizar el expediente.' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error(e);
    } finally {
      setCurrentUser(null);
    }
  };

  return {
    currentUser,
    isInitializing,
    login,
    register,
    updateProfile,
    logout,
    refreshUser: checkSession
  };
};


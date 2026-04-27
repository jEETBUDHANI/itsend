import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/services/api';

const isTokenExpired = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    if (!payload?.exp) {
      return false;
    }

    return payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
};

interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
  education_module?: string | null;
  academic_stage?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, fullName: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        if (isTokenExpired(storedToken)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsLoading(false);
          return;
        }

        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Verify token is still valid
          await authApi.verify();
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const response = await authApi.login({ email: normalizedEmail, password });
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setToken(response.access_token);
    setUser(response.user);
    return response.user;
  };

  const clearModuleStorage = () => {
    const keysToRemove = [
      'class12_results_snapshot',
      'class12_journey',
      'class12_selected_career',
      'class10_results_snapshot',
      'class10_journey',
      'class10_selected_career',
      'college_results_snapshot',
      'college_journey',
      'college_selected_career',
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      console.log('[AuthContext] Making signup request for:', normalizedEmail);
      const response = await authApi.signup({ email: normalizedEmail, password, full_name: fullName });
      console.log('[AuthContext] Signup response:', response);
      
      clearModuleStorage(); // Fix: Clear previous account's cached assessments
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setToken(response.access_token);
      setUser(response.user);
      console.log('[AuthContext] User authenticated:', response.user);
      return response.user;
    } catch (error: any) {
      console.error('[AuthContext] Signup error:', error?.response?.data || error?.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearModuleStorage(); // Fix: Clear cached assessments on logout
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

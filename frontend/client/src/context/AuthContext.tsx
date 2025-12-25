import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  isStaff: boolean; // <-- هل هو مشرف؟
  login: (token: string, isStaff: boolean) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isStaff, setIsStaff] = useState<boolean>(localStorage.getItem('isStaff') === 'true');

  const login = (newToken: string, newIsStaff: boolean) => {
    setToken(newToken);
    setIsStaff(newIsStaff);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('isStaff', String(newIsStaff));
  };

  const logout = () => {
    setToken(null);
    setIsStaff(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('isStaff');
  };

  const isLoggedIn = !!token;

  const value = {
    token,
    isLoggedIn,
    isStaff,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
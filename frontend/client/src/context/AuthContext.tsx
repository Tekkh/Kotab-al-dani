// 1. استيراد "React" بالكامل، بالإضافة إلى الـ hooks
import React, { createContext, useContext, useState } from 'react';

// 2. تعريف شكل "بيانات المصادقة"
interface AuthContextType {
  token: string | null; // التوكن
  isLoggedIn: boolean; // هل هو مسجل دخوله؟
  login: (token: string) => void; // دالة لتسجيل الدخول
  logout: () => void; // دالة لتسجيل الخروج
}

// 3. إنشاء السياق (المكتب)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. إنشاء "المزوّد" (Provider)
// 5. [التصحيح] نستخدم "React.ReactNode" بدلاً من "ReactNode"
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  // دالة تسجيل الدخول
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
  };

  // دالة تسجيل الخروج
  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const isLoggedIn = !!token;

  // توفير القيم (البيانات والدوال) لجميع "الأبناء" (التطبيق)
  const value = {
    token,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 6. إنشاء "خطاف" (Hook) مخصص لسهولة الاستخدام
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
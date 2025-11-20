import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  Shield, 
  LogOut, 
  Menu,
  Home
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { logout, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // تعريف روابط القائمة (ديناميكية حسب الدور)
  const navItems = [
    { name: 'الرئيسية', path: '/', icon: Home, show: true }, // رابط للصفحة العامة
    { name: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard, show: true },
    { name: 'المكتبة', path: '/library', icon: BookOpen, show: true },
    { name: 'إنجازاتي', path: '/badges', icon: Award, show: !isStaff }, // إخفاء للمشرف
    { name: 'إشراف', path: '/supervisor', icon: Shield, show: isStaff }, // إظهار للمشرف فقط
  ];

  // دالة مساعدة لمعرفة الرابط النشط
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col" dir="rtl">
      
      {/* --- 1. الشريط العلوي (Header) - يظهر دائماً --- */}
      <header className="bg-white shadow-sm sticky top-0 z-20 h-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              ح
            </div>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">كُتّاب أبي عمرو الداني</h1>
            <h1 className="text-lg font-bold text-gray-800 sm:hidden">{title}</h1>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full flex items-start gap-6 p-4 pb-24 md:pb-8">
        
        {/* --- 2. الشريط الجانبي (Sidebar) - للشاشات المتوسطة والكبيرة فقط (md+) --- */}
        <aside className="hidden md:block w-64 sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
          <nav className="p-3 space-y-1">
            {navItems.filter(i => i.show).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.path) 
                    ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* --- 3. المحتوى الرئيسي --- */}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>

      {/* --- 4. الشريط السفلي (Bottom Navigation) - للموبايل فقط (sm-) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 z-30 pb-safe">
        <nav className="flex justify-around items-center">
          {navItems.filter(i => i.show).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'text-emerald-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={isActive(item.path) ? 24 : 22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

    </div>
  );
}
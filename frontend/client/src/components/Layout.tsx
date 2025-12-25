import { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, LayoutDashboard, BookOpen, 
  Award, User, LogOut, Shield, Settings, Megaphone,
  Mic
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { logout, isStaff } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<string | null>(null);

  // جلب الإعدادات (للإعلان)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/site-settings/');
        if (res.data.is_announcement_active && res.data.announcement_text) {
          setAnnouncement(res.data.announcement_text);
        } else {
          setAnnouncement(null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, [location.pathname]);

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: Home, show: true },
    { name: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard, show: true },
    { name: 'المكتبة', path: '/library', icon: BookOpen, show: true },
    { name: 'تلاواتي', path: '/recitations', icon: Mic, show: !isStaff },
    // عناصر الطالب
    { name: 'إنجازاتي', path: '/badges', icon: Award, show: !isStaff },
    { name: 'حسابي', path: '/profile', icon: User, show: !isStaff },
    // عناصر المشرف
    { name: 'إشراف', path: '/supervisor', icon: Shield, show: isStaff },
    { name: 'الإعدادات', path: '/settings', icon: Settings, show: isStaff },
  ];

  const activeItems = navItems.filter(item => item.show);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-cairo" dir="rtl">
      
      {/* 1. Sidebar (للشاشات الكبيرة فقط - Desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-100 shrink-0">
          <h1 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
            <BookOpen className="text-emerald-600" />
            كُتّاب الداني
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {activeItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-64 mb-16 lg:mb-0">
        
        {/* شريط الإعلانات (يظهر للكل) */}
        {announcement && (
          <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm font-bold shadow-sm relative z-40">
            <div className="flex items-center justify-center gap-2">
              <Megaphone size={16} className="animate-pulse" />
              <span>{announcement}</span>
            </div>
          </div>
        )}

        {/* Top Header (للموبايل والديسك توب) */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
          
          {/* يمين: اللوجو (يظهر فقط في الموبايل لأن الديسك توب لديه السايدبار) */}
          <div className="lg:hidden flex items-center gap-2">
            <BookOpen className="text-emerald-600" size={24} />
            <span className="font-bold text-gray-800 text-lg">كُتّاب الداني</span>
          </div>

          {/* عنوان الصفحة (للديسك توب) */}
          <h2 className="hidden lg:block text-lg font-bold text-gray-800">
            {title || 'الرئيسية'}
          </h2>

          {/* يسار: زر الخروج (موحد للجميع هنا لسهولة الوصول) */}
          <div className="flex items-center">
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              title="تسجيل الخروج"
            >
              {/* النص: يظهر فقط في الشاشات الكبيرة */}
              <span className="hidden lg:block font-bold text-sm">تسجيل الخروج</span>
              
              {/* الأيقونة: ظاهرة دائماً، وتتحرك قليلاً عند التحويم */}
              <LogOut size={22} className="transform transition-transform group-hover:-translate-x-1" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* 3. Bottom Navigation Bar (للموبايل فقط - Mobile First PWA) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 z-50 flex justify-around items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {activeItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {/* تعديل صغير: إذا كان الرابط هو التلاوات، نعرض "تلاواتي" بدلاً من الاسم الطويل */}
              <span className="text-[10px] font-medium">
                {item.path === '/recitations' ? 'تلاواتي' : item.name}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 1. تأكد من استيراد Link
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import LogWirdModal from '../components/LogWirdModal';
import MusafView from '../components/MusafView';
import { BookOpen, LogOut } from 'lucide-react'; // استيراد أيقونات
import { Shield } from 'lucide-react';

interface ProgressLog {
  id: number;
  log_type: string;
  date: string;
  quantity_description: string;
  self_notes: string | null;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = () => {
    apiClient.get('/progress-logs/')
      .then(response => {
        setLogs(response.data);
      })
      .catch(err => {
        console.error(err);
        setError("فشل جلب البيانات.");
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDeleteLog = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا السجل؟")) return;
    try {
      await apiClient.delete(`/progress-logs/${id}/`);
      setLogs(logs.filter(log => log.id !== id));
    } catch (err) {
      console.error(err);
      alert("فشل حذف السجل");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <LogWirdModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onLogCreated={fetchLogs} 
      />

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* 2. إصلاح: جعل الشعار رابطاً للصفحة الرئيسية */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              ح
            </div>
            <h1 className="text-xl font-bold text-gray-800">حفظ القرآن</h1>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 3. إصلاح التخطيط: استخدام lg بدلاً من md لضمان المساحة الكافية */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* بطاقة المكتبة (تم نقلها للأعلى لأهميتها) */}
            <Link to="/library" className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">المكتبة العلمية</h3>
                  <p className="text-xs text-gray-500">تفسير، متون، تجويد</p>
                </div>
              </div>
            </Link>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500 mb-4 text-sm">سجل إنجازك اليومي</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                + تسجيل وِرد
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">آخر الأوراد</h3>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {logs.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">لا توجد سجلات بعد</p>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="group relative text-sm border-r-2 border-emerald-200 pr-3 hover:bg-gray-50 p-2 rounded transition-colors">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="absolute left-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="حذف السجل"
                      >
                        🗑️
                      </button>

                      <div className="flex justify-between text-gray-500 text-xs mb-1">
                        <span>{log.date}</span>
                        <span className={log.log_type === 'memorization' ? 'text-emerald-600' : 'text-blue-600'}>
                          {log.log_type === 'memorization' ? 'حفظ' : 'مراجعة'}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800">{log.quantity_description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
  <Link to="/supervisor" className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all group mt-4">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
      <Shield className="w-5 h-5 text-purple-600" />
    </div>
    <div>
      <h3 className="font-bold text-gray-800">لوحة المشرف</h3>
      <p className="text-xs text-gray-500">متابعة الطلاب</p>
    </div>
  </div>
</Link>
          {/* Main Content */}
          <div className="lg:col-span-3">
            <MusafView />
          </div>

        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import LogWirdModal from '../components/LogWirdModal';
import MusafView from '../components/MusafView';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* 1. النافذة المنبثقة (مخفية افتراضياً) */}
      <LogWirdModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onLogCreated={fetchLogs} 
      />

      {/* 2. رأس الصفحة (Header) */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             {/* أيقونة بسيطة (مربع أخضر) وشعار */}
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              ح
            </div>
            <h1 className="text-xl font-bold text-gray-800">حفظ القرآن</h1>
          </div>
          
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* 3. محتوى الصفحة (شبكة من عمودين) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* --- العمود الجانبي (Sidebar) --- */}
          <div className="md:col-span-1 space-y-4">
            {/* بطاقة الإجراءات */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500 mb-4 text-sm">سجل إنجازك اليومي</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                + تسجيل وِرد
              </button>
            </div>

            {/* بطاقة ملخص سريع (سجل الأوراد) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">آخر الأوراد</h3>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">لا توجد سجلات بعد</p>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="text-sm border-r-2 border-emerald-200 pr-3">
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

          {/* --- العمود الرئيسي (Main Content) --- */}
          <div className="md:col-span-3">
            {/* مكان المصحف التفاعلي */}
            <MusafView />
          </div>

        </div>
      </div>
    </div>
  );
}
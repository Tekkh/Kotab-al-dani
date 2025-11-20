import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import LogWirdModal from '../components/LogWirdModal';
import MusafView from '../components/MusafView';
import Layout from '../components/Layout'; // استيراد التخطيط

interface ProgressLog {
  id: number;
  log_type: string;
  date: string;
  quantity_description: string;
  self_notes: string | null;
}

export default function DashboardPage() {
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

  return (
    // نغلف الصفحة بـ Layout ونعطيها عنواناً
    <Layout title="لوحة التحكم">
      <LogWirdModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onLogCreated={fetchLogs} 
      />

      {/* محتوى لوحة التحكم فقط */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* العمود الأيمن: الإجراءات والسجل */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-4 text-sm">سجل إنجازك اليومي</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              + تسجيل وِرد
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 px-2">آخر الأوراد</h3>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar px-1">
              {logs.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">لا توجد سجلات بعد</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="group relative bg-gray-50 hover:bg-emerald-50 p-3 rounded-xl transition-colors border border-transparent hover:border-emerald-100">
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="absolute left-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="حذف السجل"
                    >
                      🗑️
                    </button>

                    <div className="flex justify-between text-gray-500 text-xs mb-1 font-medium">
                      <span>{log.date}</span>
                      <span className={log.log_type === 'memorization' ? 'text-emerald-600' : 'text-blue-600'}>
                        {log.log_type === 'memorization' ? 'حفظ' : 'مراجعة'}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm">{log.quantity_description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* العمود الأيسر: المصحف (يأخذ مساحة أكبر) */}
        <div className="lg:col-span-2">
          <MusafView />
        </div>

      </div>
    </Layout>
  );
}
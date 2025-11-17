import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

import LogWirdModal from '../components/LogWirdModal';
// 1. [جديد] استيراد عارض المصحف
import MusafView from '../components/MusafView';

// (واجهة ProgressLog كما هي)
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
        console.error("فشل جلب السجلات المحمية:", err);
        setError("فشل جلب البيانات المحمية.");
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
    <div>
      <LogWirdModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onLogCreated={fetchLogs} 
      />

      <h1>أهلاً بك في لوحة التحكم (محمية)</h1>
      <button onClick={handleLogout}>تسجيل الخروج</button>
      <button onClick={() => setIsModalOpen(true)}>
        + تسجيل وِرد جديد
      </button>

      <hr />

      {/* 2. [جديد] إضافة مكون المصحف التفاعلي */}
      <MusafView />

      <hr />

      <h2>سجل أورادك (بيانات محمية)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {logs.length === 0 && !error && <p>لا توجد سجلات أوراد حتى الآن.</p>}

      <ul>
        {logs.map(log => (
          <li key={log.id}>
            <strong>{log.date} ({log.log_type}):</strong> {log.quantity_description}
            {log.self_notes && <p><em>ملاحظة: {log.self_notes}</em></p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Users, Award, Clock } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout'; // استيراد

interface Student {
  id: number;
  username: string;
  email: string;
  total_memorized: number;
  last_activity: string | null;
}

export default function SupervisorPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/auth/students-progress/')
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 403) {
          setError("عذراً، ليس لديك صلاحية للوصول لهذه الصفحة.");
        } else {
          setError("فشل جلب بيانات الطلاب.");
        }
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <Layout title="إشراف">
      <div className="text-center py-10">جاري التحميل...</div>
    </Layout>
  );

  if (error) return (
    <Layout title="إشراف">
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <div className="text-red-600 text-xl font-bold mb-4">⛔ {error}</div>
      </div>
    </Layout>
  );

  return (
    <Layout title="لوحة المشرف">
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
            <Users className="text-emerald-600" />
            متابعة الطلاب
          </h1>
          <p className="text-gray-500 text-sm">إحصائيات وتقدم الطلاب المسجلين</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-gray-600 font-bold text-sm">الطالب</th>
                  <th className="px-6 py-4 text-gray-600 font-bold text-sm">البريد</th>
                  <th className="px-6 py-4 text-gray-600 font-bold text-sm">المحفوظ (أثمان)</th>
                  <th className="px-6 py-4 text-gray-600 font-bold text-sm">آخر نشاط</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      لا يوجد طلاب مسجلين حتى الآن.
                    </td>
                  </tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{student.username}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{student.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                          <Award size={12} />
                          {student.total_memorized}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {student.last_activity || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
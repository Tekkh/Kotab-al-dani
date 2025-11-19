import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, Clock } from 'lucide-react';
import apiClient from '../api/apiClient';

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
    // محاولة جلب بيانات الطلاب
    apiClient.get('/auth/students-progress/')
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        // إذا كان الخطأ 403 فهذا يعني أن المستخدم ليس مشرفاً
        if (err.response && err.response.status === 403) {
          setError("عذراً، ليس لديك صلاحية للوصول لهذه الصفحة (للمشرفين فقط).");
        } else {
          setError("فشل جلب بيانات الطلاب.");
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center" dir="rtl">
      <div className="text-red-600 text-xl font-bold mb-4">⛔ {error}</div>
      <Link to="/dashboard" className="text-emerald-600 hover:underline">العودة للوحة التحكم</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Users className="text-emerald-600" />
              لوحة إشراف الطلاب
            </h1>
            <p className="text-gray-500">متابعة تقدم الطلاب المسجلين</p>
          </div>
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600">
            <ArrowRight size={20} />
            العودة
          </Link>
        </div>

        {/* جدول الطلاب */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-gray-600 font-bold">اسم الطالب</th>
                <th className="px-6 py-4 text-gray-600 font-bold">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-gray-600 font-bold">إجمالي المحفوظ (آية)</th>
                <th className="px-6 py-4 text-gray-600 font-bold">آخر نشاط</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    لا يوجد طلاب مسجلين حتى الآن (غير المشرفين).
                  </td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{student.username}</td>
                    <td className="px-6 py-4 text-gray-500">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                        <Award size={14} />
                        {student.total_memorized}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {student.last_activity || 'لا يوجد نشاط'}
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
  );
}
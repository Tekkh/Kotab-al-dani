import { useEffect, useState } from 'react';
import { Star, Award, Trophy, Medal } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout'; // استيراد Layout

interface UserBadge {
  id: number;
  earned_at: string;
  badge: {
    name: string;
    description: string;
    icon_name: string;
  };
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/my-badges/')
      .then(res => {
        setBadges(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star': return <Star size={32} className="text-yellow-500 fill-yellow-500" />;
      case 'trophy': return <Trophy size={32} className="text-yellow-600" />;
      case 'medal': return <Medal size={32} className="text-emerald-600" />;
      default: return <Award size={32} className="text-blue-500" />;
    }
  };

  return (
    <Layout title="إنجازاتي">
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-yellow-500" />
            لوحة الإنجازات
          </h2>
          <p className="text-gray-500 text-sm">الأوسمة التي حصلت عليها في رحلتك</p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">جاري تحميل الأوسمة...</div>
        ) : badges.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لم تحصل على أوسمة بعد</h3>
            <p className="text-gray-500">واصل حفظ الأثمان لتملأ هذه اللوحة!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(item.badge.icon_name)}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{item.badge.name}</h3>
                <p className="text-xs text-gray-500 mb-4 h-8 overflow-hidden">{item.badge.description}</p>
                <span className="inline-block px-3 py-1 bg-gray-50 text-gray-400 text-[10px] rounded-full">
                  {new Date(item.earned_at).toLocaleDateString('ar-EG')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
import { useEffect, useState } from 'react';
import { Star, Award, Trophy, Medal, Lock, CheckCircle2, Target } from 'lucide-react';
import apiClient from '../api/apiClient';
import Layout from '../components/Layout';
import { getLevelData, getNextLevelData } from '../utils/levels';

// واجهات البيانات
interface Badge {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  condition_type: string;
}

interface UserBadge {
  id: number;
  earned_at: string;
  badge: Badge;
}

interface UserProfile {
  username: string;
  total_xp: number;
  level: number;
}

export default function BadgesPage() {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [myBadges, setMyBadges] = useState<UserBadge[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب البيانات الثلاثة بالتوازي
        const [badgesRes, myBadgesRes, profileRes] = await Promise.all([
          apiClient.get('/all-badges/'),
          apiClient.get('/my-badges/'),
          apiClient.get('/my-profile/')
        ]);

        setAllBadges(badgesRes.data);
        setMyBadges(myBadgesRes.data);
        setProfile(profileRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // دالة للتحقق هل الطالب يملك هذا الوسام؟
  const getEarnedBadge = (badgeId: number) => {
    return myBadges.find(ub => ub.badge.id === badgeId);
  };

  // منطق حساب النسبة للمستوى
  const currentLevelData = profile ? getLevelData(profile.level) : getLevelData(1);
  const nextLevelData = profile ? getNextLevelData(profile.level) : null;
  
  const calculateProgress = () => {
    if (!profile || !nextLevelData) return 100;
    const currentPoints = profile.total_xp;
    const startPoints = currentLevelData.minPoints;
    const endPoints = nextLevelData.minPoints;
    const progress = ((currentPoints - startPoints) / (endPoints - startPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getIcon = (iconName: string, isLocked: boolean) => {
    const className = isLocked ? "text-gray-300" : "text-yellow-500 drop-shadow-sm";
    switch (iconName) {
      case 'star': return <Star size={40} className={isLocked ? "text-gray-300" : "text-yellow-400 fill-yellow-400"} />;
      case 'trophy': return <Trophy size={40} className={isLocked ? "text-gray-300" : "text-yellow-600"} />;
      case 'medal': return <Medal size={40} className={isLocked ? "text-gray-300" : "text-emerald-500"} />;
      default: return <Award size={40} className={isLocked ? "text-gray-300" : "text-blue-500"} />;
    }
  };

  if (loading) return <Layout title="إنجازاتي"><div className="text-center py-10">جاري تحميل الإنجازات...</div></Layout>;

  return (
    <Layout title="إنجازاتي">
      <div className="space-y-8 max-w-5xl mx-auto">
        
        {/* 1. قسم المستوى (Hero) */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 p-4 opacity-10 transform -translate-y-1/2 translate-x-1/4">
            <Trophy size={300} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-right">
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm border border-white/10">
                  المستوى {profile?.level}
                </span>
                <span className="text-emerald-200 text-sm">
                  {nextLevelData ? 'واصل التقدم!' : 'قمة الإتقان'}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">{currentLevelData.name}</h2>
              <p className="text-emerald-100 opacity-90 text-lg">
                مجموع النقاط: <span className="font-mono font-bold text-yellow-300">{profile?.total_xp}</span> نقطة
              </p>
            </div>

            <div className="w-full md:w-1/2 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="flex justify-between text-sm mb-2 font-bold">
                <span>التقدم للمستوى التالي</span>
                <span>{Math.round(calculateProgress())}%</span>
              </div>
              <div className="h-4 bg-black/20 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 relative"
                  style={{ width: `${calculateProgress()}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-emerald-200">
                <span>{currentLevelData.minPoints} نقطة</span>
                <span>{nextLevelData ? `${nextLevelData.minPoints} نقطة` : 'الختم'}</span>
              </div>
              {nextLevelData && (
                <p className="text-center mt-4 text-sm font-medium text-white">
                  <Target className="inline w-4 h-4 ml-1 mb-1" />
                  تحتاج إلى <span className="text-yellow-300 font-bold">{nextLevelData.minPoints - (profile?.total_xp || 0)}</span> نقطة للوصول إلى رتبة <span className="font-bold">"{nextLevelData.name}"</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2. قسم الأوسمة (Badges Grid) */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award className="text-emerald-600" />
            خارطة الأوسمة
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allBadges.map((badge) => {
              const earnedData = getEarnedBadge(badge.id);
              const isUnlocked = !!earnedData;

              return (
                <div 
                  key={badge.id} 
                  className={`relative p-6 rounded-2xl border transition-all duration-300 group ${
                    isUnlocked 
                      ? 'bg-white border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300' 
                      : 'bg-gray-50 border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${isUnlocked ? 'bg-yellow-50' : 'bg-gray-200 grayscale'}`}>
                      {getIcon(badge.icon_name, !isUnlocked)}
                    </div>
                    {isUnlocked ? (
                      <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> مكتسب
                      </span>
                    ) : (
                      <Lock size={18} className="text-gray-400" />
                    )}
                  </div>
                  
                  <h4 className={`text-lg font-bold mb-2 ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {badge.name}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed h-10">
                    {badge.description}
                  </p>
                  
                  {isUnlocked && (
                    <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-emerald-600 font-medium">
                      تاريخ الحصول: {new Date(earnedData.earned_at).toLocaleDateString('ar-MA', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        numberingSystem: 'latn' 
                                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </Layout>
  );
}
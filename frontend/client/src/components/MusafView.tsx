import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

interface Ayah {
  id: number;
  surah_name: string;
  ayah_id: number;
  ayah_text: string;
}

interface UserProgress {
  id: number;
  ayah: number;
  status: 'memorized' | 'reviewing' | 'not_memorized';
}

export default function MusafView() {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, UserProgress>>({});
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fetchData = () => {
    const fetchStructure = apiClient.get('/quran-structure/');
    const fetchProgress = apiClient.get('/user-progress/');

    Promise.all([fetchStructure, fetchProgress])
      .then(([structureRes, progressRes]) => {
        setAyahs(structureRes.data);
        const map: Record<number, UserProgress> = {};
        progressRes.data.forEach((item: UserProgress) => {
          map[item.ayah] = item;
        });
        setProgressMap(map);
      })
      .catch(err => {
        console.error(err);
        setError("فشل تحميل البيانات.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAyahClick = async (ayahDbId: number) => {
    setLoadingId(ayahDbId);
    const currentProgress = progressMap[ayahDbId];

    try {
      if (!currentProgress) {
        await apiClient.post('/user-progress/', { ayah: ayahDbId, status: 'memorized' });
      } else if (currentProgress.status === 'memorized') {
        await apiClient.patch(`/user-progress/${currentProgress.id}/`, { status: 'reviewing' });
      } else {
        await apiClient.delete(`/user-progress/${currentProgress.id}/`);
      }
      fetchData();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ");
    } finally {
      setLoadingId(null);
    }
  };

  // دالة لتحديد فئات الألوان بدلاً من الألوان الثابتة
  const getStatusClasses = (ayahId: number) => {
    const progress = progressMap[ayahId];
    if (!progress) return 'bg-white hover:bg-gray-50 border-gray-100'; // غير محفوظ
    if (progress.status === 'memorized') return 'bg-emerald-100 border-emerald-200 text-emerald-900'; // محفوظ
    if (progress.status === 'reviewing') return 'bg-yellow-50 border-yellow-200 text-yellow-900'; // مراجعة
    return 'bg-white';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* رأس المكون */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📖</span> المصحف التفاعلي
        </h3>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
          اضغط على الآية لتغيير حالتها
        </span>
      </div>

      {error && <div className="p-4 text-red-600 bg-red-50 text-center">{error}</div>}
      
      {/* منطقة عرض الآيات */}
      <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar space-y-3">
        {ayahs.length === 0 ? (
          <div className="text-center py-10 text-gray-400">جاري تحميل المصحف...</div>
        ) : (
          ayahs.map(ayah => (
            <div 
              key={ayah.id} 
              onClick={() => handleAyahClick(ayah.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${getStatusClasses(ayah.id)}
                ${loadingId === ayah.id ? 'opacity-50 cursor-wait' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/5 text-black/60">
                  {ayah.surah_name} : {ayah.ayah_id}
                </span>
                
                {/* أيقونة الحالة */}
                {progressMap[ayah.id]?.status === 'memorized' && (
                  <span className="text-emerald-600 text-lg">✅</span>
                )}
                {progressMap[ayah.id]?.status === 'reviewing' && (
                  <span className="text-yellow-600 text-lg">🔄</span>
                )}
              </div>

              <p className="text-xl font-amiri leading-loose text-right" style={{ fontFamily: 'Amiri, serif' }}>
                {ayah.ayah_text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

interface Ayah {
  id: number; // ID في جدول QuranStructure
  surah_name: string;
  ayah_id: number;
  ayah_text: string;
}

// [تحديث] نحتاج تخزين ID السجل الخاص بالتقدم لنتمكن من تعديله
interface UserProgress {
  id: number; // ID في جدول UserProgress (للتحديث/الحذف)
  ayah: number; // ID الآية المرتبطة
  status: 'memorized' | 'reviewing' | 'not_memorized';
}

export default function MusafView() {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  // [تحديث] الخريطة الآن تخزن الكائن كاملاً وليس الحالة فقط
  const [progressMap, setProgressMap] = useState<Record<number, UserProgress>>({});
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null); // لإظهار حالة التحميل لآية محددة

  // دالة جلب البيانات (كما هي)
  const fetchData = () => {
    const fetchStructure = apiClient.get('/quran-structure/');
    const fetchProgress = apiClient.get('/user-progress/');

    Promise.all([fetchStructure, fetchProgress])
      .then(([structureRes, progressRes]) => {
        setAyahs(structureRes.data);

        // بناء الخريطة: ayah_id -> ProgressObject
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

  // --- [المنطق الجديد] دالة التعامل مع النقر ---
  const handleAyahClick = async (ayahDbId: number) => {
    setLoadingId(ayahDbId); // تفعيل التحميل لهذه الآية

    const currentProgress = progressMap[ayahDbId];

    try {
      if (!currentProgress) {
        // 1. الحالة: غير محفوظ -> إنشاء سجل جديد (POST)
        // الحالة الافتراضية ستكون 'memorized'
        await apiClient.post('/user-progress/', {
          ayah: ayahDbId,
          status: 'memorized'
        });
      } else if (currentProgress.status === 'memorized') {
        // 2. الحالة: محفوظ -> تحديث إلى مراجعة (PATCH)
        await apiClient.patch(`/user-progress/${currentProgress.id}/`, {
          status: 'reviewing'
        });
      } else {
        // 3. الحالة: مراجعة -> حذف السجل للعودة لغير محفوظ (DELETE)
        await apiClient.delete(`/user-progress/${currentProgress.id}/`);
      }

      // تحديث البيانات بعد العملية لإظهار اللون الجديد
      fetchData(); 

    } catch (err) {
      console.error("فشل تحديث الحالة", err);
      alert("حدث خطأ أثناء تحديث الحالة");
    } finally {
      setLoadingId(null); // إيقاف التحميل
    }
  };

  const getBackgroundColor = (ayahId: number) => {
    const progress = progressMap[ayahId];
    if (!progress) return 'transparent';
    if (progress.status === 'memorized') return '#dcfce7'; // أخضر
    if (progress.status === 'reviewing') return '#fef9c3'; // أصفر
    return 'transparent';
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>المصحف التفاعلي (اضغط على الآية لتغيير حالتها)</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {ayahs.map(ayah => (
          <div 
            key={ayah.id} 
            onClick={() => handleAyahClick(ayah.id)} // ربط النقر
            style={{ 
              backgroundColor: getBackgroundColor(ayah.id),
              opacity: loadingId === ayah.id ? 0.5 : 1, // تأثير بصري أثناء التحميل
              padding: '8px',
              marginBottom: '4px',
              borderRadius: '4px',
              cursor: 'pointer',
              userSelect: 'none', // منع تحديد النص عند النقر السريع
              transition: 'all 0.2s'
            }}
          >
            <strong>{ayah.surah_name} ({ayah.ayah_id}):</strong> {ayah.ayah_text}

            {/* نص توضيحي للحالة */}
            {progressMap[ayah.id] && (
              <span style={{ fontSize: '0.8em', color: '#666', marginRight: '10px' }}>
                 - ({progressMap[ayah.id].status === 'memorized' ? 'تم الحفظ' : 'مراجعة'})
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
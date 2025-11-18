import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

interface Ayah {
  id: number;
  surah_name: string;
  ayah_id: number;
  ayah_text: string;
}

// 1. [جديد] تعريف شكل بيانات التقدم
interface UserProgress {
  id: number;
  ayah: number; // ID الآية في قاعدة البيانات
  status: 'memorized' | 'reviewing' | 'not_memorized';
}

export default function MusafView() {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  // 2. [جديد] حالة لتخزين تقدم المستخدم
  const [progressMap, setProgressMap] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // دالة لجلب الهيكل
    const fetchStructure = apiClient.get('/quran-structure/');
    // دالة لجلب التقدم
    const fetchProgress = apiClient.get('/user-progress/');

    // 3. [تحديث] تنفيذ الطلبين معاً (Parallel)
    Promise.all([fetchStructure, fetchProgress])
      .then(([structureRes, progressRes]) => {
        setAyahs(structureRes.data);

        // 4. [جديد] تحويل قائمة التقدم إلى "خريطة" لسهولة البحث
        // النتيجة ستكون مثل: { 1: 'memorized', 2: 'reviewing' }
        const map: Record<number, string> = {};
        progressRes.data.forEach((item: UserProgress) => {
          map[item.ayah] = item.status;
        });
        setProgressMap(map);
      })
      .catch(err => {
        console.error("فشل جلب البيانات:", err);
        setError("فشل تحميل المصحف أو التقدم.");
      });
  }, []);

  // 5. [جديد] دالة مساعدة لتحديد لون الخلفية
  const getBackgroundColor = (ayahId: number) => {
    const status = progressMap[ayahId];
    if (status === 'memorized') return '#dcfce7'; // أخضر فاتح
    if (status === 'reviewing') return '#fef9c3'; // أصفر فاتح
    return 'transparent'; // شفاف (غير محفوظ)
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>المصحف التفاعلي (تجريبي)</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {ayahs.map(ayah => (
          <div 
            key={ayah.id} 
            style={{ 
              // 6. [تحديث] تطبيق اللون ديناميكياً
              backgroundColor: getBackgroundColor(ayah.id),
              padding: '8px',
              marginBottom: '4px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <strong>{ayah.surah_name} ({ayah.ayah_id}):</strong> {ayah.ayah_text}

            {/* عرض نص الحالة للتوضيح أثناء التطوير */}
            {progressMap[ayah.id] && (
              <span style={{ fontSize: '0.8em', color: '#666', marginRight: '10px' }}>
                 - ({progressMap[ayah.id] === 'memorized' ? 'تم الحفظ' : 'مراجعة'})
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
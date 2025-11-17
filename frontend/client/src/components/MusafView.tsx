import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

// 1. تعريف "نوع" بيانات الآية (مطابق للموديل)
interface Ayah {
  id: number;
  surah_name: string;
  ayah_id: number;
  ayah_text: string;
  page: number;
}

export default function MusafView() {
  // 2. "حالة" (State) لتخزين الآيات
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 3. جلب البيانات المحمية عند تحميل المكون
  useEffect(() => {
    apiClient.get('/quran-structure/')
      .then(response => {
        setAyahs(response.data);
      })
      .catch(err => {
        console.error("فشل جلب هيكل القرآن:", err);
        setError("فشل جلب بيانات المصحف.");
      });
  }, []); // [] = نفذ مرة واحدة

  return (
    <div style={{ border: '1px solid green', padding: '10px', marginTop: '20px' }}>
      <h2>المصحف التفاعلي (تجريبي)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>تم تحميل {ayahs.length} آيات بنجاح.</p>

      {/* 4. (اختياري) عرض الآيات المجلوبة كاختبار */}
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {ayahs.map(ayah => (
          <p key={ayah.id}>
            {ayah.surah_name} ({ayah.ayah_id}): {ayah.ayah_text}
          </p>
        ))}
      </div>
    </div>
  );
}
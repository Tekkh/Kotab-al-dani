import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // (الملف الافتراضي للتنسيق)

// 1. تعريف "نوع" البيانات التي نتوقعها (مطابقة للموديل)
interface Lesson {
  id: number;
  day_of_week: string;
  time_description: string;
  lesson_title: string;
}

function App() {
  // 2. إنشاء "حالة" (state) لتخزين قائمة الدروس
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 3. استخدام useEffect لجلب البيانات "مرة واحدة" عند تحميل المكون
  useEffect(() => {
    // تحديد الرابط (URL) للـ API الذي قمنا ببنائه
    const API_URL = 'http://127.0.0.1:8000/api/lessons/';

    // 4. استخدام axios لإرسال طلب GET
    axios.get(API_URL)
      .then(response => {
        // 5. إذا نجح الطلب، قم بتحديث "الحالة" بالبيانات
        setLessons(response.data);
      })
      .catch(err => {
        // 6. إذا فشل، قم بتسجيل الخطأ
        console.error("خطأ أثناء جلب البيانات:", err);
        setError("فشل الاتصال بالخادم. (انظر في الكונסול)");
      });
  }, []); // المصفوفة الفارغة [] تعني "نفذ هذا مرة واحدة فقط"

  return (
    <>
      <h1>برنامج الدروس الأسبوعي</h1>

      {/* 7. عرض رسالة خطأ إذا حدث */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 8. عرض قائمة الدروس */}
      <ul>
        {lessons.map(lesson => (
          <li key={lesson.id}>
            <strong>{lesson.day_of_week} ({lesson.time_description}):</strong> {lesson.lesson_title}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
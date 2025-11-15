import { useState, useEffect } from 'react';
import axios from 'axios';

interface Lesson {
  id: number;
  day_of_week: string;
  time_description: string;
  lesson_title: string;
}

export default function HomePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = 'http://127.0.0.1:8000/api/lessons/';
    axios.get(API_URL)
      .then(response => {
        setLessons(response.data);
      })
      .catch(err => {
        console.error("خطأ أثناء جلب البيانات:", err);
        setError("فشل الاتصال بالخادم. (انظر في الكונסול)");
      });
  }, []);

  return (
    <>
      <h1>برنامج الدروس الأسبوعي (من صفحة الهوم)</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
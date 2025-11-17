import axios from 'axios';

// 1. إنشاء "نسخة" (instance) من axios بالإعدادات الافتراضية
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // الرابط الأساسي للـ API
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. [هام جداً] إعداد "المعترض" (Interceptor)
// هذا الكود يعمل "قبل" إرسال أي طلب
apiClient.interceptors.request.use(
  (config) => {
    // 3. احصل على التوكن من الخزنة المحلية
    const token = localStorage.getItem('authToken');

    // 4. إذا كان التوكن موجوداً، أضفه إلى رأس (Header) الطلب
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
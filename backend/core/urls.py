from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# --- 1. استيراد الـ Views ---
from lessons.views import WeeklyLessonViewSet
# --- [تعديل] ---
from progress.views import ProgressLogViewSet, UserProgressViewSet, QuranStructureViewSet
# --- [نهاية التعديل] ---

# --- 2. إنشاء الموجّه المركزي ---
router = DefaultRouter()

# --- 3. تسجيل الـ Views ---
router.register(r'lessons', WeeklyLessonViewSet, basename='lesson')
router.register(r'progress-logs', ProgressLogViewSet, basename='progresslog')
router.register(r'user-progress', UserProgressViewSet, basename='userprogress')
# --- [الإضافة الجديدة] ---
router.register(r'quran-structure', QuranStructureViewSet, basename='quranstructure')
# --- [نهاية الإضافة] ---

# --- 4. الأنماط الرئيسية للـ URL ---
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include(router.urls)), # الموجّه المركزي
]
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# --- 1. استيراد الـ Views من تطبيقاتنا ---
from lessons.views import WeeklyLessonViewSet
# --- [الإضافة الجديدة] ---
from progress.views import ProgressLogViewSet, UserProgressViewSet
# --- [نهاية الإضافة] ---


# --- 2. إنشاء الموجّه المركزي ---
router = DefaultRouter()

# --- 3. تسجيل الـ Views مع الموجّه ---
router.register(r'lessons', WeeklyLessonViewSet, basename='lesson')
# --- [الإضافة الجديدة] ---
router.register(r'progress-logs', ProgressLogViewSet, basename='progresslog')
router.register(r'user-progress', UserProgressViewSet, basename='userprogress')
# --- [نهاية الإضافة] ---


# --- 4. الأنماط الرئيسية للـ URL ---
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include(router.urls)), # الموجّه المركزي
]
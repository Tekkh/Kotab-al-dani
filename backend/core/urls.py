from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

# Imports
from lessons.views import WeeklyLessonViewSet
from progress.views import ProgressLogViewSet, ThumnProgressViewSet, QuranStructureViewSet
# [جديد] استيراد مكتبة
from library.views import MatnViewSet, TajweedLessonViewSet, TafsirViewSet

# Router
router = DefaultRouter()
router.register(r'lessons', WeeklyLessonViewSet, basename='lesson')
router.register(r'progress-logs', ProgressLogViewSet, basename='progresslog')
router.register(r'thumn-progress', ThumnProgressViewSet, basename='thumnprogress')
router.register(r'quran-structure', QuranStructureViewSet, basename='quranstructure')

# [جديد] تسجيل المكتبة
router.register(r'library/matoon', MatnViewSet, basename='matn')
router.register(r'library/tajweed', TajweedLessonViewSet, basename='tajweed')
router.register(r'library/tafsir', TafsirViewSet, basename='tafsir')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
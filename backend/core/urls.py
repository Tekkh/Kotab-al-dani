from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static



# Imports
from lessons.views import WeeklyLessonViewSet
from progress.views import ProgressLogViewSet, ThumnProgressViewSet, QuranStructureViewSet
from library.views import MatnViewSet, TajweedLessonViewSet, TafsirViewSet, quran_page_proxy
from gamification.views import UserBadgeViewSet, MyProfileView, SetPreviousProgressView

# Router
router = DefaultRouter()
router.register(r'lessons', WeeklyLessonViewSet, basename='lesson')
router.register(r'progress-logs', ProgressLogViewSet, basename='progresslog')
router.register(r'thumn-progress', ThumnProgressViewSet, basename='thumnprogress')
router.register(r'quran-structure', QuranStructureViewSet, basename='quranstructure')
router.register(r'my-badges', UserBadgeViewSet, basename='my-badges')

# [جديد] تسجيل المكتبة
router.register(r'library/matoon', MatnViewSet, basename='matn')
router.register(r'library/tajweed', TajweedLessonViewSet, basename='tajweed')
router.register(r'library/tafsir', TafsirViewSet, basename='tafsir')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include(router.urls)),
    path('api/proxy/quran/pages/<int:page_number>/', quran_page_proxy, name='quran-proxy'),
    path('api/my-profile/', MyProfileView.as_view(), name='my-profile'),
    path('api/set-previous-progress/', SetPreviousProgressView.as_view(), name='set-previous'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
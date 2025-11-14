from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WeeklyLessonViewSet

# إنشاء راوتر افتراضي
router = DefaultRouter()
# تسجيل الـ ViewSet الخاص بنا مع الراوتر
router.register(r'lessons', WeeklyLessonViewSet, basename='lesson')

# تحديد الـ URL patterns
urlpatterns = [
    path('', include(router.urls)),
]
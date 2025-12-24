from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import SiteSettingView, WeeklyLessonViewSet

router = DefaultRouter()
router.register(r'lessons', WeeklyLessonViewSet, basename='weekly-lesson')

urlpatterns = [

    path('site-settings/', SiteSettingView.as_view(), name='site-settings'),
    path('', include(router.urls)),
]
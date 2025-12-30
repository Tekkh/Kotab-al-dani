from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    ProgressLogViewSet, 
    QuranStructureViewSet, 
    SupervisorDashboardView, 
    ThumnProgressViewSet
)

router = DefaultRouter()
router.register(r'progress-logs', ProgressLogViewSet, basename='progress-log')
router.register(r'thumns', ThumnProgressViewSet, basename='thumn-progress')
router.register(r'quran-structure', QuranStructureViewSet, basename='quran-structure')

urlpatterns = [
    # رابط لوحة المشرف (مخصص)
    path('supervisor-dashboard/', SupervisorDashboardView.as_view(), name='supervisor-dashboard'),
    
    # باقي الروابط من الراوتر
    path('', include(router.urls)),
]
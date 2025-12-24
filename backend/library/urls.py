from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    MatnViewSet, 
    TafsirViewSet, 
    TajweedLessonViewSet, 
    quran_page_proxy, 
    tafsir_proxy_view
)

router = DefaultRouter()
router.register(r'matoon', MatnViewSet, basename='matn')
router.register(r'tajweed', TajweedLessonViewSet, basename='tajweed')
router.register(r'tafsir-local', TafsirViewSet, basename='tafsir-local')

urlpatterns = [
    # نقاط النهاية (Proxies)
    path('quran-page/<int:page_number>/', quran_page_proxy, name='quran-page-proxy'),
    path('tafsir/<int:surah_id>/<int:ayah_number>/', tafsir_proxy_view, name='tafsir-proxy'),
    
    # باقي الروابط من الراوتر
    path('', include(router.urls)),
]
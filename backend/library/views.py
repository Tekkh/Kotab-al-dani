from rest_framework import viewsets, permissions
from .models import Matn, TajweedLesson, Tafsir
from .serializers import MatnSerializer, TajweedLessonSerializer, TafsirSerializer
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class MatnViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Matn.objects.all()
    serializer_class = MatnSerializer
    permission_classes = [permissions.AllowAny]

class TajweedLessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TajweedLesson.objects.all().order_by('order')
    serializer_class = TajweedLessonSerializer
    permission_classes = [permissions.AllowAny]

class TafsirViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tafsir.objects.all().order_by('surah_id')
    serializer_class = TafsirSerializer
    permission_classes = [permissions.AllowAny]
    # سنحتاج للبحث برقم السورة لاحقاً، الـ DefaultRouter يدعم الفلترة الأساسية
    filterset_fields = ['surah_id']
    
@api_view(['GET'])
@permission_classes([AllowAny])
def quran_page_proxy(request, page_number):
    try:
        # [تحديث] استخدام ID = 1 للتجربة
        external_url = f"https://api.quranpedia.net/v1/mushafs/1/pages/{page_number}"
        
        # طباعة للتحقق في التيرمينال
        print(f"Connecting to: {external_url}")

        response = requests.get(external_url)
        
        # طباعة حالة الرد
        if response.status_code != 200:
             print(f"Error from external API: {response.status_code}")
             return Response({"error": "Failed to fetch from source"}, status=response.status_code)

        return Response(response.json())
    except Exception as e:
        print(f"Proxy Error: {str(e)}")
        return Response({"error": str(e)}, status=500)
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
        external_url = f"https://api.quranpedia.net/v1/mushafs/4/pages/{page_number}"
        
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

@api_view(['GET'])
@permission_classes([AllowAny])
def tafsir_proxy_view(request, surah_id, ayah_number):
    """
    جلب التفسير + نص الآية ودمجهما في رد واحد
    """
    try:
        # 1. رابط التفسير (الميسر ID=1)
        tafsir_url = f"http://api.quran-tafseer.com/tafsir/1/{surah_id}/{ayah_number}"
        
        # 2. رابط نص الآية (من نفس المصدر لضمان التوافق)
        quran_url = f"http://api.quran-tafseer.com/quran/{surah_id}/{ayah_number}"
        
        # تنفيذ الطلبين
        tafsir_response = requests.get(tafsir_url)
        quran_response = requests.get(quran_url)
        
        if tafsir_response.status_code == 200 and quran_response.status_code == 200:
            # دمج البيانات
            data = tafsir_response.json() # يحتوي على التفسير ورقم الآية
            quran_data = quran_response.json() # يحتوي على نص الآية
            
            # إضافة نص الآية للرد النهائي
            # الحقل القادم من المصدر اسمه 'text'، سنسميه 'ayah_text' لعدم الخلط مع نص التفسير
            data['ayah_text'] = quran_data.get('text', '')
            
            return Response(data)
        else:
            return Response(
                {"error": "فشل جلب البيانات من المصدر الخارجي"}, 
                status=404
            )
            
    except Exception as e:
        return Response({"error": str(e)}, status=500)
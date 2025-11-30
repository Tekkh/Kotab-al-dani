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
    try:
        # 1. جلب التفسير (كما هو)
        tafsir_url = f"http://api.quran-tafseer.com/tafseer/1/{surah_id}/{ayah_number}"
        
        # 2. جلب نص الآية (من مصدر أفضل: api.quran.com)
        # نستخدم 'uthmani_simple' لأنه واضح ومقروء
        # المفتاح هنا هو verse_key (رقم السورة:رقم الآية)
        quran_url = f"https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number={surah_id}&verse_key={surah_id}:{ayah_number}"
        
        tafsir_response = requests.get(tafsir_url)
        quran_response = requests.get(quran_url)
        
        if tafsir_response.status_code == 200:
            data = tafsir_response.json()
            
            # محاولة استخراج النص العثماني من المصدر الثاني
            ayah_text = ""
            if quran_response.status_code == 200:
                q_data = quran_response.json()
                # هيكل الرد في quran.com: { "verses": [ { "id": 1, "text_uthmani": "..." } ] }
                if 'verses' in q_data and len(q_data['verses']) > 0:
                    ayah_text = q_data['verses'][0]['text_uthmani']
            
            # إذا فشل المصدر الثاني، نستخدم النص من المصدر الأول كاحتياط (أو نتركه فارغاً)
            if not ayah_text:
                # ملاحظة: المصدر الأول قد لا يعطي نص الآية في نقطة النهاية هذه، لذا الاعتماد على المصدر الثاني ضروري
                ayah_text = "(نص الآية غير متوفر حالياً)"

            data['ayah_text'] = ayah_text
            return Response(data)
            
        else:
            return Response({"error": "فشل جلب التفسير"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
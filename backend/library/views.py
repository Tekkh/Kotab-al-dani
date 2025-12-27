import requests
from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Matn, Tafsir, TajweedLesson
from .serializers import MatnSerializer, TafsirSerializer, TajweedLessonSerializer


class MatnViewSet(viewsets.ReadOnlyModelViewSet):
    """
    عرض المتون العلمية (قراءة فقط).
    """
    queryset = Matn.objects.all()
    serializer_class = MatnSerializer
    permission_classes = [permissions.AllowAny]


class TajweedLessonViewSet(viewsets.ReadOnlyModelViewSet):
    """
    عرض دروس التجويد (قراءة فقط).
    """
    queryset = TajweedLesson.objects.all().order_by('order')
    serializer_class = TajweedLessonSerializer
    permission_classes = [permissions.AllowAny]


class TafsirViewSet(viewsets.ReadOnlyModelViewSet):
    """
    عرض التفاسير المخزنة محلياً.
    """
    queryset = Tafsir.objects.all().order_by('surah_id')
    serializer_class = TafsirSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['surah_id']


@api_view(['GET'])
@permission_classes([AllowAny])
def quran_page_proxy(request, page_number):
    """
    Proxy لجلب صورة صفحة المصحف (طبعة المدينة) من API خارجي.
    المصدر: quranpedia.net
    """
    try:
        external_url = f"https://api.quranpedia.net/v1/mushafs/4/pages/{page_number}"
        response = requests.get(external_url)
        
        if response.status_code != 200:
            return Response(
                {"error": "فشل الاتصال بالمصدر الخارجي"}, 
                status=response.status_code
            )

        return Response(response.json())
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def tafsir_proxy_view(request, surah_id, ayah_number):
    """
    Proxy ذكي يجمع بين:
    1. نص التفسير (من quran-tafseer.com)
    2. نص الآية العثماني (من api.quran.com)
    """
    try:
        
        tafsir_url = f"http://api.quran-tafseer.com/tafseer/1/{surah_id}/{ayah_number}"
        
        quran_url = f"https://api.quran.com/api/v4/quran/verses/uthmani"
        params = {
            'chapter_number': surah_id,
            'verse_key': f"{surah_id}:{ayah_number}"
        }
        
        tafsir_response = requests.get(tafsir_url)
        quran_response = requests.get(quran_url, params=params)
        
        if tafsir_response.status_code == 200:
            data = tafsir_response.json()
            
            # محاولة دمج نص الآية
            ayah_text = ""
            if quran_response.status_code == 200:
                q_data = quran_response.json()
                if 'verses' in q_data and len(q_data['verses']) > 0:
                    ayah_text = q_data['verses'][0]['text_uthmani']
            
            # في حال فشل المصدر الثاني
            if not ayah_text:
                ayah_text = "(نص الآية غير متوفر حالياً)"

            data['ayah_text'] = ayah_text
            return Response(data)
            
        else:
            return Response({"error": "فشل جلب التفسير"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
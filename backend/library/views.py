from rest_framework import viewsets, permissions
from .models import Matn, TajweedLesson, Tafsir
from .serializers import MatnSerializer, TajweedLessonSerializer, TafsirSerializer

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
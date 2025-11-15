from rest_framework import viewsets, permissions 
from .models import WeeklyLesson
from .serializers import WeeklyLessonSerializer

class WeeklyLessonViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows active weekly lessons to be viewed.
    """
    queryset = WeeklyLesson.objects.filter(is_active=True)
    serializer_class = WeeklyLessonSerializer
    # السماح لأي شخص (حتى الزوار) برؤية هذه البيانات
    permission_classes = [permissions.AllowAny]
    # --- نهاية الإضافة ---
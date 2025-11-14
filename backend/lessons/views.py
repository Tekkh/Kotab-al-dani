from django.shortcuts import render
from rest_framework import viewsets
from .models import WeeklyLesson
from .serializers import WeeklyLessonSerializer

class WeeklyLessonViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows active weekly lessons to be viewed.
    """
    # جلب جميع الدروس التي تم تحديدها كـ "نشطة" فقط
    queryset = WeeklyLesson.objects.filter(is_active=True)

    # استخدام الـ "المترجم" الذي أنشأناه
    serializer_class = WeeklyLessonSerializer

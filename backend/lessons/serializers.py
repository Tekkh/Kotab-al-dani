from rest_framework import serializers
from .models import WeeklyLesson

class WeeklyLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLesson
        # 'fields = "__all__"' يعني: قم بتضمين كل الحقول من الموديل
        fields = "__all__"
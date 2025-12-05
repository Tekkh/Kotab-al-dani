from rest_framework import serializers
from .models import WeeklyLesson, SiteSetting

class WeeklyLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLesson
        fields = '__all__'

class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ['announcement_text', 'is_announcement_active']
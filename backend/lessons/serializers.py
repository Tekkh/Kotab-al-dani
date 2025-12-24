from rest_framework import serializers
from .models import SiteSetting, WeeklyLesson

class WeeklyLessonSerializer(serializers.ModelSerializer):
    """
    محول بيانات الدروس الأسبوعية.
    """
    class Meta:
        model = WeeklyLesson
        fields = '__all__'

class SiteSettingSerializer(serializers.ModelSerializer):
    """
    محول إعدادات الموقع (شريط الإعلانات).
    """
    class Meta:
        model = SiteSetting
        fields = ['announcement_text', 'is_announcement_active']
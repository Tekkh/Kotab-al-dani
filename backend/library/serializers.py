from rest_framework import serializers
from .models import Matn, Tafsir, TajweedLesson

class MatnSerializer(serializers.ModelSerializer):
    """
    محول بيانات المتون العلمية.
    """
    class Meta:
        model = Matn
        fields = '__all__'

class TajweedLessonSerializer(serializers.ModelSerializer):
    """
    محول دروس التجويد.
    """
    class Meta:
        model = TajweedLesson
        fields = '__all__'

class TafsirSerializer(serializers.ModelSerializer):
    """
    محول التفسير.
    """
    class Meta:
        model = Tafsir
        fields = '__all__'
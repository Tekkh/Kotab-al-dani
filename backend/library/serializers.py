from rest_framework import serializers
from .models import Matn, TajweedLesson, Tafsir

class MatnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matn
        fields = '__all__'

class TajweedLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = TajweedLesson
        fields = '__all__'

class TafsirSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tafsir
        fields = '__all__'
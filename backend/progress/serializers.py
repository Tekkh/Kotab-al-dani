from rest_framework import serializers
from .models import ProgressLog, QuranStructure, ThumnProgress

class ProgressLogSerializer(serializers.ModelSerializer):
    """
    محول سجلات التقدم (Log).
    """
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = ProgressLog
        fields = ['id', 'user', 'log_type', 'date', 'quantity_description', 'self_notes']

class ThumnProgressSerializer(serializers.ModelSerializer):
    """
    محول تقدم الأثمان (حفظ/مراجعة كل ثمن).
    """
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = ThumnProgress
        fields = ['id', 'user', 'juz', 'hizb', 'thumn', 'status', 'updated_at']

class QuranStructureSerializer(serializers.ModelSerializer):
    """
    محول هيكلية القرآن (للبيانات الثابتة).
    """
    class Meta:
        model = QuranStructure
        fields = "__all__"
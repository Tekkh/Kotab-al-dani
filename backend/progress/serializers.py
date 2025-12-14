from rest_framework import serializers
from .models import ProgressLog, ThumnProgress, QuranStructure

class ProgressLogSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = ProgressLog
        fields = ['id', 'user', 'log_type', 'date', 'quantity_description', 'self_notes']

class ThumnProgressSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = ThumnProgress
        fields = ['id', 'user', 'juz', 'hizb', 'thumn', 'status', 'updated_at']

class QuranStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuranStructure
        fields = "__all__"
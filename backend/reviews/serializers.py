from django.utils import timezone
from rest_framework import serializers
from .models import RecitationSubmission

class RecitationSubmissionSerializer(serializers.ModelSerializer):
    """
    محول بيانات التلاوة (للعرض والرفع).
    يعرض اسم الطالب الكامل للمشرف.
    """
    student_name = serializers.SerializerMethodField()
    
    class Meta:
        model = RecitationSubmission
        fields = [
            'id', 'student_name', 'audio_file', 
            'surah_name', 'from_ayah', 'to_ayah', 
            'status', 
            'instructor_rating', 'instructor_notes', 'instructor_audio',
            'created_at', 'reviewed_at'
        ]
        read_only_fields = [
            'status', 'instructor_rating', 'instructor_notes', 
            'instructor_audio', 'created_at', 'reviewed_at'
        ]

    def get_student_name(self, obj):
        """إرجاع الاسم الكامل للطالب (الاسم + النسب)"""
        full_name = f"{obj.student.first_name} {obj.student.last_name}".strip()
        return full_name if full_name else obj.student.username


class FeedbackSerializer(serializers.ModelSerializer):
    """
    محول خاص بالمشرف لإرسال التقييم والملاحظات فقط.
    """
    class Meta:
        model = RecitationSubmission
        fields = ['status', 'instructor_rating', 'instructor_notes', 'instructor_audio']

    def update(self, instance, validated_data):
        # تحديث وقت المراجعة تلقائياً عند الحفظ
        instance.reviewed_at = timezone.now()
        return super().update(instance, validated_data)
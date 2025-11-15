from rest_framework import serializers
from .models import ProgressLog, UserProgress, QuranStructure

# 1. مترجم لسجل الوِرد (لإنشاء وقراءة الملاحظات)
class ProgressLogSerializer(serializers.ModelSerializer):
    # نجعل المستخدم "للقراءة فقط". سيتم تعيينه تلقائيًا من الخادم
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = ProgressLog
        fields = ['id', 'user', 'log_type', 'date', 'quantity_description', 'self_notes']

# 2. مترجم لتقدم المستخدم (لتحديث حالة الآية)
class UserProgressSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    # سنقوم بتضمين بعض معلومات الآية لسهولة العرض
    ayah_details = serializers.ReadOnlyField(source='ayah.__str__') 

    class Meta:
        model = UserProgress
        fields = ['id', 'user', 'ayah', 'ayah_details', 'status', 'last_review_date']
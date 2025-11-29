from rest_framework import serializers
from .models import UserBadge, Badge, GamificationProfile

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class UserBadgeSerializer(serializers.ModelSerializer):
    # لعرض تفاصيل الوسام (الاسم، الأيقونة) بدلاً من مجرد الـ ID
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'earned_at']

class GamificationProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    date_joined = serializers.ReadOnlyField(source='user.date_joined')
    
    # استقبال الحقول مباشرة
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = GamificationProfile
        fields = [
            'username', 'email', 'first_name', 'last_name', 'date_joined',
            'total_xp', 'level'
        ]
        read_only_fields = ['total_xp', 'level']

    def to_representation(self, instance):
        """
        هذه الدالة تضمن أننا نرسل البيانات الصحيحة للواجهة عند القراءة (GET)
        """
        ret = super().to_representation(instance)
        ret['first_name'] = instance.user.first_name
        ret['last_name'] = instance.user.last_name
        return ret

    def update(self, instance, validated_data):
        """
        هذه الدالة تضمن تحديث المستخدم عند الكتابة (PATCH)
        """
        user = instance.user
        
        # نتحقق هل تم إرسال الاسم؟
        if 'first_name' in validated_data:
            user.first_name = validated_data.pop('first_name')
        
        if 'last_name' in validated_data:
            user.last_name = validated_data.pop('last_name')
            
        user.save()
        
        return super().update(instance, validated_data)
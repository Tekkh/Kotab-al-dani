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
    # حقول للقراءة فقط (من موديل User)
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    date_joined = serializers.ReadOnlyField(source='user.date_joined')
    
    # حقول قابلة للتعديل (من موديل User)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    
    class Meta:
        model = GamificationProfile
        fields = [
            'username', 'email', 'first_name', 'last_name', 'date_joined',
            'total_xp', 'level', 'initial_memorization_thumns', 'current_streak',
            'profile_picture' # <--- الحقل الجديد
        ]
        read_only_fields = ['total_xp', 'level', 'current_streak', 'initial_memorization_thumns']

    # دالة لتحديث بيانات المستخدم المتداخلة (User + Profile)
    def update(self, instance, validated_data):
        # استخراج بيانات المستخدم (الاسم والنسب)
        user_data = validated_data.pop('user', {})
        first_name = user_data.get('first_name')
        last_name = user_data.get('last_name')

        # تحديث موديل User
        user = instance.user
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        user.save()

        # تحديث موديل Profile (الصورة وغيرها)
        return super().update(instance, validated_data)
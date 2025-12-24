from rest_framework import serializers
from .models import Badge, GamificationProfile, UserBadge

class BadgeSerializer(serializers.ModelSerializer):
    """
    محول بيانات الأوسمة (عرض عام).
    """
    class Meta:
        model = Badge
        fields = '__all__'

class UserBadgeSerializer(serializers.ModelSerializer):
    """
    محول أوسمة المستخدم (يعرض تفاصيل الوسام بداخله).
    """
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'earned_at']

class GamificationProfileSerializer(serializers.ModelSerializer):
    """
    محول الملف الشخصي (XP, Level, Streak) + بيانات المستخدم الأساسية.
    """
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    date_joined = serializers.ReadOnlyField(source='user.date_joined')
    
    # حقول للكتابة فقط (لتحديث الاسم)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = GamificationProfile
        fields = [
            'username', 'email', 'first_name', 'last_name', 'date_joined',
            'total_xp', 'level', 'initial_memorization_thumns', 'current_streak',
            'daily_goal'
        ]
        read_only_fields = ['total_xp', 'level']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['first_name'] = instance.user.first_name
        ret['last_name'] = instance.user.last_name
        return ret

    def update(self, instance, validated_data):
        user = instance.user
        if 'first_name' in validated_data:
            user.first_name = validated_data.pop('first_name')
        if 'last_name' in validated_data:
            user.last_name = validated_data.pop('last_name')
        user.save()
        return super().update(instance, validated_data)
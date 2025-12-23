from rest_framework import serializers
from django.contrib.auth.models import User
import re


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'confirm_password')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate_username(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("اسم المستخدم يجب أن يكون 4 أحرف على الأقل.")
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("اسم المستخدم يجب أن يحتوي على أحرف لاتينية وأرقام فقط.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "كلمتا المرور غير متطابقتين."})

        password = data['password']
        if len(password) < 8:
            raise serializers.ValidationError({"password": "كلمة المرور يجب أن تكون 8 خانات على الأقل."})
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError({"password": "يجب أن تحتوي على رقم واحد على الأقل."})
        if not any(char in "!@#$%^&*()_+-=[]{}|;:,.<>?" for char in password):
            raise serializers.ValidationError({"password": "يجب أن تحتوي على رمز خاص (!@#$%)."})

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class StudentSummarySerializer(serializers.ModelSerializer):
    total_memorized = serializers.SerializerMethodField()
    last_activity = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'total_memorized', 'last_activity']

    def get_total_memorized(self, obj):

        if hasattr(obj, 'thumn_progress'):
            return obj.thumn_progress.filter(status='memorized').count()
        return 0

    def get_last_activity(self, obj):

        if hasattr(obj, 'logs'):
            last_log = obj.logs.order_by('-date').first()
            return last_log.date if last_log else None
        return None

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("كلمة المرور الجديدة قصيرة جداً.")
        return value

class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
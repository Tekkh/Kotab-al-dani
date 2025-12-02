from django.contrib.auth.models import User
from rest_framework import serializers

from django.contrib.auth.models import User
from rest_framework import serializers
import re # لاستخدام التعابير النمطية (Regex)

class UserSerializer(serializers.ModelSerializer):
    # حقل تأكيد كلمة المرور (كتابة فقط)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'confirm_password')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    # 1. التحقق من اسم المستخدم (لاتيني فقط + الطول)
    def validate_username(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("اسم المستخدم يجب أن يكون 4 أحرف على الأقل.")
        
        # السماح فقط بالحروف الإنجليزية والأرقام و _
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("اسم المستخدم يجب أن يحتوي على أحرف لاتينية وأرقام فقط (بدون مسافات).")
        
        return value

    # 2. التحقق من كلمة المرور (التطابق + التعقيد)
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "كلمتا المرور غير متطابقتين."})

        # شروط التعقيد
        password = data['password']
        if len(password) < 8:
            raise serializers.ValidationError({"password": "كلمة المرور يجب أن تكون 8 خانات على الأقل."})
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError({"password": "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل."})
        if not any(char in "!@#$%^&*()_+-=[]{}|;:,.<>?" for char in password):
            raise serializers.ValidationError({"password": "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%)."})

        return data

    def create(self, validated_data):
        # نحذف confirm_password قبل الإنشاء لأن الموديل لا يحتاجه
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
        # [تحديث] نحسب عدد "الأثمان" المحفوظة بدلاً من الآيات
        # نستخدم related_name='thumn_progress' الذي عرفناه في الموديل الجديد
        return obj.thumn_progress.filter(status='memorized').count()

    def get_last_activity(self, obj):
        last_log = obj.logs.order_by('-date').first()
        return last_log.date if last_log else None
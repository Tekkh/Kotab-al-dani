from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # الحقول التي نريد طلبها من المستخدم
        fields = ('id', 'username', 'email', 'password')
        # إعدادات خاصة: كلمة المرور يجب أن تكون "للكتابة فقط" (لا تظهر عند قراءة البيانات)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # هذه الدالة هي المسؤولة عن إنشاء المستخدم
        # نستخدم .create_user() لضمان تشفير كلمة المرور (hashing)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
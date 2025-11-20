from rest_framework import generics, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser # استيراد هام
from .serializers import StudentSummarySerializer # استيراد السيريالايزر الجديد

# --- 1. واجهة التسجيل (كما كانت) ---
class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny] # السماح للجميع بالتسجيل

# --- 2. الإضافة الجديدة: واجهة تسجيل الدخول ---
class LoginView(ObtainAuthToken):
    # السماح لأي شخص بالوصول (لأنه يحتاج لتسجيل الدخول)
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        # نستخدم الدالة الأصلية (ObtainAuthToken) للتحقق من المستخدم
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # الحصول على التوكن أو إنشاؤه
        token, created = Token.objects.get_or_create(user=user)

        # إرجاع التوكن ومعلومات المستخدم (مثل الإيميل والاسم)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'is_staff': user.is_staff  # <--- هذه هي الإضافة المهمة
        })
class StudentListView(generics.ListAPIView):
    queryset = User.objects.filter(is_staff=False) # نجلب الطلاب فقط (ليس المشرفين)
    serializer_class = StudentSummarySerializer
    permission_classes = [IsAdminUser] # حماية صارمة: المشرفون فقط
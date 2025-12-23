from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

from .serializers import (
    UserSerializer, 
    StudentSummarySerializer, 
    ChangePasswordSerializer, 
    ResetPasswordRequestSerializer
)

# --- 1. واجهة تسجيل مستخدم جديد ---
class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]

# --- 2. واجهة تسجيل الدخول ---
class LoginView(ObtainAuthToken):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'is_staff': user.is_staff
        })

# --- 3. قائمة الطلاب (للمشرفين) ---
class StudentListView(generics.ListAPIView):
    queryset = User.objects.filter(is_staff=False)
    serializer_class = StudentSummarySerializer
    permission_classes = [IsAdminUser]

# --- 4. تغيير كلمة المرور (من داخل الحساب) ---
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
        
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["كلمة المرور الحالية غير صحيحة."]}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"message": "تم تغيير كلمة المرور بنجاح."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data['email']
            try:
                user = User.objects.get(email=email)
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # رابط الفرونت إند المحلي
                reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"
                
                send_mail(
                    subject="استعادة كلمة المرور - كُتّاب الداني",
                    message=f"مرحباً {user.username}،\n\nاضغط هنا لتعيين كلمة مرور جديدة:\n{reset_link}",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=False,
                )
            except User.DoesNotExist:
                pass # لا نكشف حالة الإيميل لأسباب أمنية
            
            return Response({"message": "تم إرسال الرابط إذا كان البريد مسجلاً."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- 6. تأكيد وتعيين كلمة المرور الجديدة ---
class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not uid or not token or not new_password:
            return Response({"error": "بيانات غير مكتملة"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid_decoded)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "رابط غير صالح"}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"message": "تم تعيين كلمة المرور بنجاح."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "الرابط منتهي الصلاحية"}, status=status.HTTP_400_BAD_REQUEST)
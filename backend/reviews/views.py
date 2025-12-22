from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from .models import RecitationSubmission
from .serializers import RecitationSubmissionSerializer, FeedbackSerializer

# 1. (للطالب) رفع تلاوة جديدة
class SubmitRecitationView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser] # ضروري جداً لرفع الملفات
    serializer_class = RecitationSubmissionSerializer

    def get_queryset(self):
        return RecitationSubmission.objects.none() # لا نحتاج عرض شيء هنا، فقط الرفع

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class PendingReviewsView(ListAPIView):
    permission_classes = [IsAdminUser] # للمشرفين فقط
    serializer_class = RecitationSubmissionSerializer

    def get_queryset(self):
        # نجلب الطلبات المعلقة أو التي قيد الاستماع
        return RecitationSubmission.objects.filter(
            status__in=[RecitationSubmission.Status.PENDING, RecitationSubmission.Status.IN_PROGRESS]
        ).order_by('created_at') # الأقدم أولاً ليتم تصحيحه أولاً

# 3. (للمشرف) إرسال التصحيح
class SubmitFeedbackView(RetrieveUpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = RecitationSubmission.objects.all()
    lookup_field = 'id'

    def get_serializer_class(self):
        # في حالة العرض (GET)، نستخدم المحول الكامل لنرى بيانات الطالب وملف الصوت
        if self.request.method == 'GET':
            return RecitationSubmissionSerializer
        # في حالة التعديل (PUT/PATCH)، نستخدم محول الملاحظات فقط
        return FeedbackSerializer

class StudentSubmissionsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecitationSubmissionSerializer

    def get_queryset(self):
        return RecitationSubmission.objects.filter(student=self.request.user).order_by('-created_at')
class DeleteSubmissionView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = RecitationSubmission.objects.all()
    lookup_field = 'id'

    def get_queryset(self):
        return RecitationSubmission.objects.filter(student=self.request.user)
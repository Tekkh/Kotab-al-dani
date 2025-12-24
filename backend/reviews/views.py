from datetime import timedelta
from django.utils import timezone
from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser

from .models import RecitationSubmission
from .serializers import RecitationSubmissionSerializer, FeedbackSerializer

class SubmitRecitationView(ListCreateAPIView):
    """
    واجهة للطالب لرفع تلاوة جديدة.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = RecitationSubmissionSerializer

    def get_queryset(self):
        return RecitationSubmission.objects.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class StudentSubmissionsView(ListAPIView):
    """
    واجهة لعرض تلاوات الطالب الخاصة به (الأحدث أولاً).
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RecitationSubmissionSerializer

    def get_queryset(self):
        return RecitationSubmission.objects.filter(student=self.request.user).order_by('-created_at')


class DeleteSubmissionView(DestroyAPIView):
    """
    واجهة لحذف تلاوة (مسموح للطالب حذف تلاواته فقط).
    """
    permission_classes = [IsAuthenticated]
    queryset = RecitationSubmission.objects.all()
    lookup_field = 'id'

    def get_queryset(self):
        return RecitationSubmission.objects.filter(student=self.request.user)


class PendingReviewsView(ListAPIView):
    """
    واجهة للمشرف: عرض التلاوات المعلقة أو قيد المراجعة.
    """
    permission_classes = [IsAdminUser]
    serializer_class = RecitationSubmissionSerializer

    def get_queryset(self):
        return RecitationSubmission.objects.filter(
            status__in=[RecitationSubmission.Status.PENDING, RecitationSubmission.Status.IN_PROGRESS]
        ).order_by('created_at')


class SubmitFeedbackView(RetrieveUpdateAPIView):
    """
    واجهة للمشرف: إرسال التصحيح والملاحظات لتلاوة محددة.
    """
    permission_classes = [IsAdminUser]
    queryset = RecitationSubmission.objects.all()
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RecitationSubmissionSerializer
        return FeedbackSerializer


class SupervisorArchiveView(ListAPIView):
    """
    أرشيف المشرف: عرض التلاوات المكتملة لآخر 7 أيام.
    """
    permission_classes = [IsAdminUser]
    serializer_class = RecitationSubmissionSerializer

    def get_queryset(self):
        seven_days_ago = timezone.now() - timedelta(days=7)
        return RecitationSubmission.objects.filter(
            status__in=[RecitationSubmission.Status.COMPLETED, RecitationSubmission.Status.REJECTED],
            updated_at__gte=seven_days_ago
        ).order_by('-updated_at')
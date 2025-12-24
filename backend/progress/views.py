from datetime import timedelta
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from gamification.models import UserBadge
from .models import ProgressLog, QuranStructure, ThumnProgress
from .serializers import ProgressLogSerializer, QuranStructureSerializer, ThumnProgressSerializer

class ProgressLogViewSet(viewsets.ModelViewSet):
    """
    إدارة سجلات التقدم (للطالب نفسه).
    """
    serializer_class = ProgressLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProgressLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ThumnProgressViewSet(viewsets.ModelViewSet):
    """
    إدارة تقدم الأثمان.
    يحتوي على منطق إضافي لاكتشاف الأوسمة الجديدة وإرسالها مع الرد.
    """
    serializer_class = ThumnProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ThumnProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # 1. تسجيل الأوسمة الحالية
        existing_badge_ids = list(
            UserBadge.objects.filter(user=request.user).values_list('id', flat=True)
        )

        # 2. الحفظ (تنطلق الـ Signals هنا)
        response = super().create(request, *args, **kwargs)

        # 3. البحث عن الأوسمة الجديدة
        new_badges_qs = UserBadge.objects.filter(
            user=request.user
        ).exclude(id__in=existing_badge_ids)

        # 4. حقن الأوسمة الجديدة في الرد
        if new_badges_qs.exists():
            new_badges_data = []
            for ub in new_badges_qs:
                new_badges_data.append({
                    'name': ub.badge.name,
                    'icon_name': ub.badge.icon_name,
                    'description': ub.badge.description
                })
            response.data['new_earned_badges'] = new_badges_data

        return response


class QuranStructureViewSet(viewsets.ReadOnlyModelViewSet):
    """
    عرض هيكلية القرآن (قراءة فقط).
    """
    queryset = QuranStructure.objects.all()
    serializer_class = QuranStructureSerializer
    permission_classes = [permissions.IsAuthenticated]


class SupervisorDashboardView(APIView):
    """
    لوحة تحكم المشرف (إحصائيات + نشاطات الطلاب).
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        # 1. الإحصائيات العامة
        total_students = User.objects.filter(is_staff=False, is_superuser=False).count()
        
        today = timezone.now().date()
        active_in_logs = ProgressLog.objects.filter(date=today).values('user').distinct().count()
        
        last_24h = timezone.now() - timedelta(hours=24)
        active_in_badges = UserBadge.objects.filter(earned_at__gte=last_24h).values('user').distinct().count()
        active_students_count = max(active_in_logs, active_in_badges)

        total_thumns = ThumnProgress.objects.filter(status=ThumnProgress.Status.MEMORIZED).count()
        total_ahzab = round(total_thumns / 8, 2)

        # 2. سجل النشاطات (Feed)
        activities = []

        # أ) من سجلات التقدم
        recent_logs = ProgressLog.objects.all().select_related('user').order_by('-date', '-id')[:10]
        for log in recent_logs:
            action_text = "حفظ جديد" if log.log_type == ProgressLog.LogType.MEMORIZATION else "مراجعة"
            icon_type = 'progress' if log.log_type == ProgressLog.LogType.MEMORIZATION else 'review'
            
            student_name = f"{log.user.first_name} {log.user.last_name}".strip() or log.user.username

            activities.append({
                'type': icon_type,
                'student_name': student_name,
                'description': f"قام بـ{action_text}: {log.quantity_description}", 
                'timestamp': log.date.isoformat() 
            })

        # ب) من الأوسمة المكتسبة حديثاً
        recent_badges = UserBadge.objects.all().select_related('user', 'badge').order_by('-earned_at')[:5]
        for b in recent_badges:
            student_name = f"{b.user.first_name} {b.user.last_name}".strip() or b.user.username

            activities.append({
                'type': 'badge',
                'student_name': student_name,
                'description': f"نال وسام: {b.badge.name} 🥇",
                'timestamp': b.earned_at
            })

        # ترتيب النشاطات زمنياً (الأحدث أولاً)
        activities.sort(key=lambda x: str(x['timestamp']), reverse=True)
        
        return Response({
            "stats": {
                "total_students": total_students,
                "active_today": active_students_count,
                "total_ahzab": total_ahzab
            },
            "feed": activities[:15]
        })
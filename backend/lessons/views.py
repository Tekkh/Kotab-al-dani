from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from .models import WeeklyLesson, SiteSetting
from .serializers import WeeklyLessonSerializer, SiteSettingSerializer

# 1. إدارة الدروس (قراءة للكل، تعديل للمشرف)
class WeeklyLessonViewSet(viewsets.ModelViewSet):
    queryset = WeeklyLesson.objects.filter(is_active=True).order_by('order')
    serializer_class = WeeklyLessonSerializer

    def get_queryset(self):
        # المشرف يرى كل الدروس (حتى المعطلة)، الطالب يرى النشطة فقط
        if self.request.user.is_staff:
            return WeeklyLesson.objects.all().order_by('order')
        return WeeklyLesson.objects.filter(is_active=True).order_by('order')

    def get_permissions(self):
        # السماح بالقراءة للجميع (حتى الزوار)، والتعديل للمشرف فقط
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


# 2. إدارة إعدادات الموقع (للمشرف فقط)
class SiteSettingView(generics.RetrieveUpdateAPIView):
    serializer_class = SiteSettingSerializer
    permission_classes = [permissions.AllowAny] # القراءة للكل (سنفصلها في الدالة)

    def get_object(self):
        # جلب الإعدادات أو إنشاؤها إن لم توجد
        obj, created = SiteSetting.objects.get_or_create(id=1)
        return obj

    def get_permissions(self):
        # GET مسموح للكل (لعرض الإعلان)، PATCH/PUT للمشرف فقط
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
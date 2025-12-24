from rest_framework import generics, permissions, viewsets
from .models import SiteSetting, WeeklyLesson
from .serializers import SiteSettingSerializer, WeeklyLessonSerializer

class WeeklyLessonViewSet(viewsets.ModelViewSet):
    """
    واجهة إدارة الدروس الأسبوعية.
    - عرض القائمة (GET): متاح للجميع.
    - التعديل والإضافة والحذف: للمشرفين فقط.
    """
    serializer_class = WeeklyLessonSerializer

    def get_queryset(self):
        # المشرف يرى كل الدروس لترتيبها، الطالب يرى النشطة فقط
        if self.request.user.is_staff:
            return WeeklyLesson.objects.all().order_by('order')
        return WeeklyLesson.objects.filter(is_active=True).order_by('order')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class SiteSettingView(generics.RetrieveUpdateAPIView):
    """
    واجهة إعدادات الموقع (الإعلانات).
    - قراءة (GET): متاح للجميع لعرض الإعلان.
    - تعديل (PATCH): للمشرفين فقط.
    """
    serializer_class = SiteSettingSerializer

    def get_object(self):
        # ضمان وجود كائن واحد دائماً للإعدادات
        obj, created = SiteSetting.objects.get_or_create(id=1)
        return obj

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
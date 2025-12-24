from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # لوحة تحكم الأدمن
    path('admin/', admin.site.urls),

    # 1. المصادقة والمستخدمين
    path('api/auth/', include('users.urls')),

    # 2. التلاوات والمراجعات
    path('api/reviews/', include('reviews.urls')),

    # 3. المكتبة (المتون، التجويد، التفسير، والبروكسي)
    # ملاحظة: ستصبح الروابط تبدأ بـ /api/library/
    # مثال: /api/library/matoon/
    path('api/library/', include('library.urls')),

    # 4. التطبيقات الأساسية
    # تم وضعها تحت api/ مباشرة للحفاظ على توافق الروابط مع الفرونت إند الحالي
    # (مثل: /api/my-profile/, /api/site-settings/, /api/lessons/)
    path('api/', include('lessons.urls')),
    path('api/', include('gamification.urls')),
    path('api/', include('progress.urls')),
]

# إعدادات الميديا (للصور والملفات الصوتية) في وضع التطوير
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
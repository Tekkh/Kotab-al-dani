from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # الرابط الافتراضي للوحة تحكم المشرف
    path('admin/', admin.site.urls),
    # أي طلب يذهب إلى /api/ سيتم تحويله إلى ملف urls.py الخاص بـ lessons
    path('api/', include('lessons.urls')),
    path('api/auth/', include('users.urls')),
]
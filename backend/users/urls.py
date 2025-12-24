from django.urls import path
from .views import (
    ChangePasswordView,
    CreateUserView,
    LoginView,
    RequestPasswordResetView,
    ResetPasswordConfirmView,
    StudentListView,
)

urlpatterns = [
    # المصادقة والتسجيل
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),

    # إدارة كلمات المرور
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', RequestPasswordResetView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/', ResetPasswordConfirmView.as_view(), name='password-reset-confirm'),

    # عمليات المشرف
    path('students/', StudentListView.as_view(), name='student-list'),
]
from django.urls import path
from .views import (
    CreateUserView, 
    LoginView, 
    StudentListView, 
    ChangePasswordView, 
    RequestPasswordResetView, 
    ResetPasswordConfirmView
)

urlpatterns = [
    # التسجيل والدخول
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('students/', StudentListView.as_view(), name='student-list'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', RequestPasswordResetView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/', ResetPasswordConfirmView.as_view(), name='password-reset-confirm'),
]
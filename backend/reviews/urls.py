from django.urls import path
from .views import (
    SubmitRecitationView, 
    PendingReviewsView, 
    SubmitFeedbackView, 
    StudentSubmissionsView,
    DeleteSubmissionView,
    SupervisorArchiveView
)

urlpatterns = [
    # عمليات الطالب
    path('submit-recitation/', SubmitRecitationView.as_view(), name='submit-recitation'),
    path('my-submissions/', StudentSubmissionsView.as_view(), name='my-submissions'),
    path('delete-submission/<int:id>/', DeleteSubmissionView.as_view(), name='delete-submission'),

    # عمليات المشرف
    path('pending-reviews/', PendingReviewsView.as_view(), name='pending-reviews'),
    path('submit-feedback/<int:id>/', SubmitFeedbackView.as_view(), name='submit-feedback'),
    path('supervisor-archive/', SupervisorArchiveView.as_view(), name='supervisor-archive'),
]
from .models import Badge, UserBadge
from progress.models import ThumnProgress

def check_and_award_badges(user):
    memorized_count = ThumnProgress.objects.filter(user=user, status='memorized').count()
    print(f"📊 عدد الأثمان المحفوظة لهذا الطالب: {memorized_count}") # <-- جاسوس 3

    if memorized_count >= 1:
        print("🎯 الطالب يستحق وسام 'أول ثمن'") 
        assign_badge(user, 'first_thumn')

def assign_badge(user, condition_type):
    try:
        badge = Badge.objects.get(condition_type=condition_type)
        obj, created = UserBadge.objects.get_or_create(user=user, badge=badge)
        if created:
            print(f"🎉 مبروك! تم منح الوسام: {badge.name}") # <-- جاسوس 4
        else:
            print(f"ℹ️ الطالب لديه الوسام بالفعل: {badge.name}")
            
    except Badge.DoesNotExist:
        print(f"⚠️ تنبيه: لم يتم العثور على وسام بالشرط: {condition_type} في قاعدة البيانات") # <-- جاسوس 5
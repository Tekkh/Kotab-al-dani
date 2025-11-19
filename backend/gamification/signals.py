from django.db.models.signals import post_save
from django.dispatch import receiver
from progress.models import ThumnProgress
from .services import check_and_award_badges

@receiver(post_save, sender=ThumnProgress)
def trigger_gamification(sender, instance, created, **kwargs):
    print(f"🔔 إشارة التحفيز انطلقت! الحالة: {instance.status}") # <-- جاسوس 1
    
    if instance.status == 'memorized':
        print("✅ الحالة 'محفوظ'، جاري فحص الأوسمة...") # <-- جاسوس 2
        check_and_award_badges(instance.user)
    else:
        print("❌ الحالة ليست 'محفوظ' (ربما مراجعة؟)")
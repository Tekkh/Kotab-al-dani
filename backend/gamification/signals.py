from django.db.models.signals import post_save
from django.dispatch import receiver
from progress.models import ThumnProgress
from .services import check_and_award_badges, add_xp, update_streak

@receiver(post_save, sender=ThumnProgress)
def trigger_gamification(sender, instance, created, **kwargs):
    if instance.status == 'memorized':
        print(f"🔔 تم حفظ ثمن جديد للطالب {instance.user.username}")
        
        # 1. منح 10 نقاط (XP) لكل ثمن
        add_xp(instance.user, amount=10)
        update_streak(instance.user)
        # 2. فحص الأوسمة
        check_and_award_badges(instance.user)
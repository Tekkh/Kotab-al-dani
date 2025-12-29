from django.db.models.signals import post_save
from django.dispatch import receiver
from progress.models import ThumnProgress
from .services import add_xp, check_and_award_badges, update_streak

@receiver(post_save, sender=ThumnProgress)
def trigger_gamification(sender, instance, created, **kwargs):
    if instance.status == 'memorized':
        add_xp(instance.user, amount=10)
        update_streak(instance.user)
        check_and_award_badges(instance.user)
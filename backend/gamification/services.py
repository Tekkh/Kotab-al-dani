from datetime import timedelta
from django.utils import timezone
from .models import Badge, GamificationProfile, UserBadge

# مستويات النظام (XP Thresholds)
LEVEL_THRESHOLDS = {
    1: 0, 2: 80, 3: 400, 4: 800, 5: 1200, 
    6: 1600, 7: 2400, 8: 3200, 9: 4000, 10: 4800,
}

def calculate_level(total_xp):
    current_level = 1
    for level, threshold in LEVEL_THRESHOLDS.items():
        if total_xp >= threshold:
            current_level = level
    return current_level

def assign_badge(user, condition_type):
    try:
        badge = Badge.objects.get(condition_type=condition_type)
        UserBadge.objects.get_or_create(user=user, badge=badge)
    except Badge.DoesNotExist:
        pass

def update_streak(user):
    profile, _ = GamificationProfile.objects.get_or_create(user=user)
    today = timezone.now().date()
    last_date = profile.last_activity_date

    if last_date is None:
        profile.current_streak = 1
        profile.last_activity_date = today
    elif last_date == today:
        pass 
    elif last_date == today - timedelta(days=1):
        profile.current_streak += 1
        profile.last_activity_date = today
    else:
        profile.current_streak = 1
        profile.last_activity_date = today

    profile.save()
    
    # أوسمة المداومة
    streak = profile.current_streak
    if streak >= 7: assign_badge(user, 'streak_7')
    if streak >= 30: assign_badge(user, 'streak_30')
    if streak >= 100: assign_badge(user, 'streak_100')

def add_xp(user, amount=10):
    profile, _ = GamificationProfile.objects.get_or_create(user=user)
    profile.total_xp += amount
    
    new_level = calculate_level(profile.total_xp)
    if new_level > profile.level:
        profile.level = new_level
    profile.save()

def check_range(user_thumns_set, start_hizb, end_hizb):
    for h in range(start_hizb, end_hizb + 1):
        for t in range(1, 9): 
            if f"{h}-{t}" not in user_thumns_set:
                return False
    return True

def check_and_award_badges(user):
    from progress.models import ThumnProgress  # استيراد محلي لتجنب Circular Import

    memorized_thumns_qs = ThumnProgress.objects.filter(user=user, status='memorized')
    memorized_count = memorized_thumns_qs.count()
    
    profile, _ = GamificationProfile.objects.get_or_create(user=user)
    total_thumns = memorized_count + profile.initial_memorization_thumns
    completed_hizbs = total_thumns // 8 

    # 1. أوسمة الكمية
    if total_thumns >= 1: assign_badge(user, 'first_thumn')
    if completed_hizbs >= 1: assign_badge(user, 'first_hizb')
    if completed_hizbs >= 3: assign_badge(user, 'hizb_3')
    if completed_hizbs >= 5: assign_badge(user, 'hizb_5')
    if completed_hizbs >= 10: assign_badge(user, 'hizb_10')
    if completed_hizbs >= 30: assign_badge(user, 'hizb_30')
    if completed_hizbs >= 60: assign_badge(user, 'hizb_60')

    # 2. أوسمة نوعية (أجزاء وسور محددة) - تعتمد على الحفظ الفعلي حالياً
    user_thumns_set = set(f"{t.hizb}-{t.thumn}" for t in memorized_thumns_qs)
    
    if check_range(user_thumns_set, 59, 60): assign_badge(user, 'juz_amma')
    if check_range(user_thumns_set, 57, 58): assign_badge(user, 'juz_tabarak')
    if check_range(user_thumns_set, 1, 5): assign_badge(user, 'surah_baqarah')
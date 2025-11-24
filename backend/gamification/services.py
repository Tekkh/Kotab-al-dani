from .models import Badge, UserBadge, GamificationProfile
from progress.models import ThumnProgress

# تعريف المستويات (الحد الأدنى من النقاط لكل مستوى)
LEVEL_THRESHOLDS = {
    1: 0,      # مبتدئ
    2: 80,     # سالك (8 أحزاب)
    3: 400,    # مجتهد (5 أحزاب)
    4: 800,    # مرتق (10 أحزاب)
    5: 1200,   # ناشط (15 حزباً)
    6: 1600,   # مثابر (20 حزباً)
    7: 2400,   # حافظ (30 حزباً - نصف القرآن)
    8: 3200,   # متبحر (40 حزباً)
    9: 4000,   # متقن (50 حزباً)
    10: 4800,  # خاتم (60 حزباً)
}

def calculate_level(total_xp):
    """
    دالة لحساب المستوى الحالي بناءً على مجموع النقاط
    تعيد أعلى مستوى وصل إليه الطالب بناءً على نقاطه
    """
    current_level = 1
    for level, threshold in LEVEL_THRESHOLDS.items():
        if total_xp >= threshold:
            current_level = level
    return current_level

def add_xp(user, amount=10):
    """
    إضافة نقاط وتحديث المستوى
    """
    profile, _ = GamificationProfile.objects.get_or_create(user=user)
    
    # إضافة النقاط
    profile.total_xp += amount
    
    # حساب المستوى الجديد
    new_level = calculate_level(profile.total_xp)
    
    if new_level > profile.level:
        print(f"🚀 ترقية! {user.username} وصل للمستوى {new_level}")
        profile.level = new_level
        
    profile.save()

def check_and_award_badges(user):
    """
    فحص استحقاق الأوسمة
    """
    # 1. الحفظ الجديد المسجل في التطبيق
    memorized_count = ThumnProgress.objects.filter(user=user, status='memorized').count()
    
    # 2. الرصيد السابق (المسجل يدوياً)
    profile, _ = GamificationProfile.objects.get_or_create(user=user)
    initial_count = profile.initial_memorization_thumns
    
    # المجموع الكلي للأثمان المحفوظة
    total_thumns = memorized_count + initial_count
    
    print(f"📊 إجمالي الأثمان للطالب {user.username}: {total_thumns}")

    # --- الشروط ---
    if total_thumns >= 1:
        assign_badge(user, 'first_thumn')

    if total_thumns >= 5 * 8: # (5 أحزاب * 8 أثمان = 40 ثمناً) - مثال للشرط
        assign_badge(user, 'count_5_thumns')
        
    # يمكن إضافة بقية الشروط هنا (الحزب الأول، إلخ)

def assign_badge(user, condition_type):
    try:
        badge = Badge.objects.get(condition_type=condition_type)
        obj, created = UserBadge.objects.get_or_create(user=user, badge=badge)
        if created:
            print(f"🎉 مبروك! تم منح الوسام: {badge.name}")
    except Badge.DoesNotExist:
        pass
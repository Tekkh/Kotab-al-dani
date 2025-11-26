from .models import Badge, UserBadge, GamificationProfile
from progress.models import ThumnProgress

# --- ثوابت المستويات (كما هي) ---
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

def add_xp(user, amount=10):
    profile, _ = GamificationProfile.objects.get_or_create(user=user)
    profile.total_xp += amount
    new_level = calculate_level(profile.total_xp)
    if new_level > profile.level:
        profile.level = new_level
    profile.save()

def check_and_award_badges(user):
    """
    الدالة الرئيسية لفحص واستحقاق الأوسمة
    """
    # 1. البيانات: نحتاج معرفة كل ما حفظه الطالب (أثمان فردية + رصيد سابق)
    memorized_thumns_qs = ThumnProgress.objects.filter(user=user, status='memorized')
    memorized_count = memorized_thumns_qs.count()
    
    profile, _ = GamificationProfile.objects.get_or_create(user=user)
    total_thumns = memorized_count + profile.initial_memorization_thumns
    
    # تحويل الأثمان إلى أحزاب (كل 8 أثمان = 1 حزب)
    completed_hizbs = total_thumns // 8 

    print(f"📊 المستخدم: {user.username} | إجمالي الأثمان: {total_thumns} | الأحزاب المكتملة: {completed_hizbs}")

    # ---------------------------------------------------------
    # أولاً: الأوسمة الكمية (بناءً على العدد الإجمالي)
    # ---------------------------------------------------------
    if total_thumns >= 1: assign_badge(user, 'first_thumn')
    
    if completed_hizbs >= 1: assign_badge(user, 'first_hizb')   # رائحة الفجر
    if completed_hizbs >= 3: assign_badge(user, 'hizb_3')       # خطوة السائر
    if completed_hizbs >= 5: assign_badge(user, 'hizb_5')       # همة عالية
    if completed_hizbs >= 7: assign_badge(user, 'hizb_7')       # زاد المسافر
    if completed_hizbs >= 10: assign_badge(user, 'hizb_10')     # نفس المجتهد
    if completed_hizbs >= 15: assign_badge(user, 'hizb_15')     # ربع القرآن
    if completed_hizbs >= 20: assign_badge(user, 'hizb_20')     # عزيمة لا تلين
    if completed_hizbs >= 30: assign_badge(user, 'hizb_30')     # نصف القرآن
    if completed_hizbs >= 60: assign_badge(user, 'hizb_60')     # تاج الحافظ

    # ---------------------------------------------------------
    # ثانياً: أوسمة السور والأجزاء (النوعية)
    # يتم فحصها فقط من خلال "السجلات الفعلية" (ThumnProgress)
    # (سنضيف لاحقاً منطقاً لمنحها عبر الرصيد السابق اليدوي)
    # ---------------------------------------------------------
    
    # ننشئ مجموعة (Set) سريعة للبحث تحتوي على "رقم الحزب-رقم الثمن"
    user_thumns_set = set(f"{t.hizb}-{t.thumn}" for t in memorized_thumns_qs)

    # 1. جزء عم (الحزبان 59 و 60)
    if check_range(user_thumns_set, 59, 60): assign_badge(user, 'juz_amma')

    # 2. جزء تبارك (الحزبان 57 و 58)
    if check_range(user_thumns_set, 57, 58): assign_badge(user, 'juz_tabarak')

    # 3. سورة البقرة (الأحزاب 1 إلى 5)
    if check_range(user_thumns_set, 1, 5): assign_badge(user, 'surah_baqarah')
    
    # 4. سورة يس (تقع غالباً في الحزب 45)
    # (للتبسيط سنفترض أن من حفظ الحزب 45 كاملاً فقد حفظ يس)
    if check_range(user_thumns_set, 45, 45): assign_badge(user, 'surah_yasin')

    # 5. سورة الملك (أول سورة في جزء تبارك - الحزب 57)
    # (سنفترض حفظ الحزب 57 كاملاً أو النصف الأول منه)
    if check_range(user_thumns_set, 57, 57): assign_badge(user, 'surah_mulk')


def check_range(user_thumns_set, start_hizb, end_hizb):
    """
    دالة مساعدة للتأكد من أن الطالب سجل جميع أثمان الأحزاب المحددة
    """
    for h in range(start_hizb, end_hizb + 1):
        for t in range(1, 9): # 8 أثمان في كل حزب
            if f"{h}-{t}" not in user_thumns_set:
                return False
    return True

def assign_badge(user, condition_type):
    try:
        badge = Badge.objects.get(condition_type=condition_type)
        obj, created = UserBadge.objects.get_or_create(user=user, badge=badge)
        if created:
            print(f"🎉 مبروك! تم منح الوسام: {badge.name}")
    except Badge.DoesNotExist:
        pass
export interface LevelData {
  level: number;
  name: string;
  minPoints: number;
}

// هذا الجدول يجب أن يطابق ما في backend/gamification/services.py
export const LEVEL_SYSTEM: LevelData[] = [
  { level: 1, name: 'مُبْتَدِئ', minPoints: 0 },
  { level: 2, name: 'سَالِك', minPoints: 80 },
  { level: 3, name: 'مُجْتَهِد', minPoints: 400 },
  { level: 4, name: 'مُرْتَقٍ', minPoints: 800 },
  { level: 5, name: 'نَاشِط', minPoints: 1200 },
  { level: 6, name: 'مُثَابِر', minPoints: 1600 },
  { level: 7, name: 'حَافِظ', minPoints: 2400 },
  { level: 8, name: 'مُتَبَحِّر', minPoints: 3200 },
  { level: 9, name: 'مُتْقِن', minPoints: 4000 },
  { level: 10, name: 'خَاتِم', minPoints: 4800 },
];

export const getLevelData = (level: number) => {
  return LEVEL_SYSTEM.find(l => l.level === level) || LEVEL_SYSTEM[0];
};

export const getNextLevelData = (level: number) => {
  // إذا وصل للمستوى  نعيد نفس المستوى
  return LEVEL_SYSTEM.find(l => l.level === level + 1) || null;
};
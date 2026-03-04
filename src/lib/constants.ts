export const DISCIPLINE_COLORS: Record<string, string> = {
  '건축': '#3B82F6',
  '구조': '#EF4444',
  '공조설비': '#10B981',
  '배관설비': '#F59E0B',
  '설비': '#8B5CF6',
  '소방': '#EC4899',
  '조경': '#22C55E',
};

export const DISCIPLINE_BG_COLORS: Record<string, string> = {
  '건축': '#EFF6FF',
  '구조': '#FEF2F2',
  '공조설비': '#ECFDF5',
  '배관설비': '#FFFBEB',
  '설비': '#F5F3FF',
  '소방': '#FDF2F8',
  '조경': '#F0FDF4',
};

export const VIEWER_DEFAULTS = {
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5,
  ZOOM_STEP: 0.15,
  INITIAL_ZOOM: 1,
} as const;

export const DRAWING_API_BASE = '/api/drawings';

export function getDrawingUrl(filename: string): string {
  return `${DRAWING_API_BASE}/${encodeURIComponent(filename)}`;
}

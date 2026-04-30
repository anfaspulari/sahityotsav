// ─── Event dates ──────────────────────────────────────────────────────────────
export const EVENT_DATES = ['2026-06-28', '2026-06-29']
export const DATE_DISPLAY = 'June 28 & 29, 2026'
export const EVENT_YEAR = '2026'

// ─── Sectors (9 sectors, 61 units) ────────────────────────────────────────────
export const SECTORS = [
  'Feroke',
  'Calicut',
  'Kuttiyadi',
  'Perambra',
  'Vatakara',
  'Malappuram',
  'Tirur',
  'Kuttippuram',
  'Ponnani',
]

// ─── Categories ───────────────────────────────────────────────────────────────
export const CATEGORIES = ['LP', 'UP', 'HS', 'HSS', 'Junior', 'Senior', 'General', 'Girls']

export const CATEGORY_LABELS = {
  LP: 'Lower Primary',
  UP: 'Upper Primary',
  HS: 'High School',
  HSS: 'Higher Secondary',
  Junior: 'Junior',
  Senior: 'Senior',
  General: 'General',
  Girls: 'Girls',
}

export const CATEGORY_COLORS = {
  LP: 'bg-sky-100 text-sky-700',
  UP: 'bg-indigo-100 text-indigo-700',
  HS: 'bg-violet-100 text-violet-700',
  HSS: 'bg-purple-100 text-purple-700',
  Junior: 'bg-pink-100 text-pink-700',
  Senior: 'bg-rose-100 text-rose-700',
  General: 'bg-gray-100 text-gray-600',
  Girls: 'bg-fuchsia-100 text-fuchsia-700',
}

// ─── Stage structure ──────────────────────────────────────────────────────────
export const ON_STAGES = ['Stage 1', 'Stage 2', 'Stage 3']
export const OFF_STAGES = ['Stage 4', 'Stage 5', 'Stage 6', 'Stage 7', 'Stage 8']
export const STAGES = [...ON_STAGES, ...OFF_STAGES]

export const STAGE_TYPE = {
  'Stage 1': 'on-stage',
  'Stage 2': 'on-stage',
  'Stage 3': 'on-stage',
  'Stage 4': 'off-stage',
  'Stage 5': 'off-stage',
  'Stage 6': 'off-stage',
  'Stage 7': 'off-stage',
  'Stage 8': 'off-stage',
}

export const STAGE_LABELS = {
  'Stage 1': 'Stage 1 · On-Stage (Performance)',
  'Stage 2': 'Stage 2 · On-Stage (Music)',
  'Stage 3': 'Stage 3 · On-Stage (Speech & Drama)',
  'Stage 4': 'Stage 4 · Off-Stage (Writing)',
  'Stage 5': 'Stage 5 · Off-Stage (Visual Arts)',
  'Stage 6': 'Stage 6 · Off-Stage (Debate & Elocution)',
  'Stage 7': 'Stage 7 · Off-Stage (Digital & Quiz)',
  'Stage 8': 'Stage 8 · Off-Stage (Special / Girls)',
}

// ─── Event status ─────────────────────────────────────────────────────────────
export const EVENT_STATUS = {
  upcoming: { label: 'Upcoming', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', icon: '🔵' },
  ongoing: { label: 'Ongoing', color: 'bg-green-100 text-green-700', dot: 'bg-green-500 animate-pulse', icon: '🟢' },
  delayed: { label: 'Delayed', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', icon: '⚠️' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400', icon: '✅' },
}

// ─── Scoring ──────────────────────────────────────────────────────────────────
export const RANK_POINTS = { 1: 5, 2: 3, 3: 1 }
export const TOTAL_UNITS = 61

import { Link } from 'react-router-dom'
import { useEvents, useResults } from '../hooks/useFirestore'
import { computeLeaderboard } from '../firebase/results'
import { SECTORS } from '../constants'

const HIGHLIGHTS = [
  { icon: '🎒', title: 'Lower & Upper Primary', desc: 'Speech, Storytelling, Drawing, Quiz, Reading & more', color: 'bg-sky-50 border-sky-100' },
  { icon: '🏫', title: 'High School & Higher Secondary', desc: 'Essay, Poem, Calligraphy, Debate, Digital Painting & more', color: 'bg-violet-50 border-violet-100' },
  { icon: '📚', title: 'Junior & Senior', desc: 'Arabic Translation, Hadith, Podcast, Magazine, Reel Making & more', color: 'bg-pink-50 border-pink-100' },
  { icon: '🎓', title: 'General, Campus & Girls', desc: 'Daff, Arabana, Qawwali, AI Prompting, Ideathon & more', color: 'bg-amber-50 border-amber-100' },
]

const STAGE_OVERVIEW = [
  { type: 'On-Stage', count: 3, icon: '🎭', desc: 'Performance events' },
  { type: 'Off-Stage', count: 5, icon: '✍️', desc: 'Writing, Art, Digital & Quiz' },
]

export default function Home() {
  const { events } = useEvents()
  const { results } = useResults()

  const ongoing = events.filter((e) => e.status === 'ongoing').length
  const completed = events.filter((e) => e.status === 'completed').length
  const publishedResults = results.filter((r) => r.published !== false)
  const leaderboard = computeLeaderboard(publishedResults)
  const topSector = leaderboard[0]

  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          {ongoing > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {ongoing} event{ongoing > 1 ? 's' : ''} live right now
            </span>
          )}

          <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            Feroke Division · Kerala · 2026
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Feroke Division
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #fde68a, #fb923c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Sahityotsav 2026
            </span>
          </h1>

          <p className="text-white/70 text-lg max-w-xl mx-auto mb-3">
            The Division Level Literary &amp; Arts Festival — 9 sectors, 10 categories, 180+ events
          </p>
          <p className="text-white/40 text-sm mb-10">June 28 &amp; 29, 2026 · 9 Sectors · 61 Units · 8 Stages</p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/schedule" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
              View Schedule
            </Link>
            <Link to="/results" className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Live Results
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Stats bar ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-extrabold text-primary-700">180+</p>
              <p className="text-xs text-gray-500 mt-0.5">Events</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-primary-700">{SECTORS.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Sectors</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-green-600">{ongoing > 0 ? ongoing : completed}</p>
              <p className="text-xs text-gray-500 mt-0.5">{ongoing > 0 ? 'Live Now' : 'Completed'}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-primary-700">{publishedResults.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Results Published</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top sector callout ─────────────────────────────────────────────── */}
      {topSector && (
        <section className="max-w-6xl mx-auto px-4 pt-8">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5 flex items-center gap-4">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Current Leader</p>
              <p className="text-xl font-extrabold text-gray-900">{topSector.sector}</p>
              <p className="text-sm text-gray-500">{topSector.points} points</p>
            </div>
            <Link to="/results" className="ml-auto text-sm font-semibold text-primary-600 hover:underline shrink-0">
              Full Leaderboard →
            </Link>
          </div>
        </section>
      )}

      {/* ── Stage structure ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Stage Structure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {STAGE_OVERVIEW.map(({ type, count, icon, desc }) => (
            <div key={type} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="font-bold text-gray-900">{count} {type} Stages</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-5">Event Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map(({ icon, title, desc, color }) => (
            <div key={title} className={`rounded-2xl border p-5 ${color}`}>
              <span className="text-3xl">{icon}</span>
              <h3 className="font-bold text-gray-900 mt-3 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Competing sectors ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Competing Sectors</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {SECTORS.map((s, i) => (
            <div key={s} className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold text-xs mx-auto mb-1.5">
                {i + 1}
              </div>
              <p className="text-xs font-medium text-gray-700 leading-tight">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Follow live results</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Track event statuses, sector scores, and winner announcements in real-time.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/schedule" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">
              Full Schedule →
            </Link>
            <Link to="/results" className="bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors">
              Live Leaderboard →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

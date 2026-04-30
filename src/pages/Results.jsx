import { useMemo, useState } from 'react'
import { useResults } from '../hooks/useFirestore'
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS } from '../constants'
import WinnerCard from '../components/WinnerCard'
import SectorLeaderboard from '../components/SectorLeaderboard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const TABS = ['Event Results', 'Sector Leaderboard', 'Individual Board']

export default function Results() {
  const { results, loading, error } = useResults()

  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')

  const publishedResults = useMemo(() => results.filter((r) => r.published !== false), [results])

  // ── Smart search: event title, participant name, category, sector ──────────
  const searched = useMemo(() => {
    const q = search.toLowerCase()
    return publishedResults.filter((r) => {
      const matchCat = filterCat === 'All' || r.category === filterCat
      if (!matchCat) return false
      if (!q) return true
      return (
        r.eventTitle?.toLowerCase().includes(q) ||
        r.participantName?.toLowerCase().includes(q) ||
        r.sector?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.school?.toLowerCase().includes(q)
      )
    })
  }, [publishedResults, search, filterCat])

  // Group by event+category
  const grouped = useMemo(() => {
    const map = {}
    for (const r of searched) {
      const key = `${r.eventTitle}__${r.category}`
      if (!map[key]) map[key] = { eventTitle: r.eventTitle, category: r.category, items: [] }
      map[key].items.push(r)
    }
    for (const g of Object.values(map)) {
      g.items.sort((a, b) => a.rank - b.rank)
    }
    return Object.values(map).sort((a, b) => a.eventTitle.localeCompare(b.eventTitle))
  }, [searched])

  // ── Individual leaderboard (top performers by total marks) ─────────────────
  const individual = useMemo(() => {
    const map = {}
    for (const r of publishedResults) {
      if (!r.participantName || r.rank > 3) continue
      const key = `${r.participantName}__${r.sector}`
      if (!map[key]) map[key] = { name: r.participantName, sector: r.sector, school: r.school, golds: 0, silvers: 0, bronzes: 0, totalPts: 0 }
      if (r.rank === 1) { map[key].golds++; map[key].totalPts += 5 }
      if (r.rank === 2) { map[key].silvers++; map[key].totalPts += 3 }
      if (r.rank === 3) { map[key].bronzes++; map[key].totalPts += 1 }
    }
    return Object.values(map).sort((a, b) => b.totalPts - a.totalPts).slice(0, 20)
  }, [publishedResults])

  const totalEvents = useMemo(() => new Set(publishedResults.map((r) => r.eventTitle + r.category)).size, [publishedResults])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Results</h1>
        <p className="text-gray-500 mt-1">
          Sahityotsav 2026 ·{' '}
          <span className="font-medium text-primary-600">{publishedResults.length} results</span> across{' '}
          <span className="font-medium text-primary-600">{totalEvents} events</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 rounded-xl p-1 flex gap-1 mb-8 w-full sm:w-fit overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              tab === i ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading results..." />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : tab === 0 ? (
        // ── Event Results ──────────────────────────────────────────────────
        <div>
          {/* Search + category filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by event, participant, sector..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            <button
              onClick={() => setFilterCat('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterCat === 'All' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterCat === c ? 'bg-primary-600 text-white' : CATEGORY_COLORS[c] + ' hover:opacity-80'
                }`}
              >
                {CATEGORY_LABELS[c] || c}
              </button>
            ))}
          </div>

          {grouped.length === 0 ? (
            <EmptyState
              icon="🏆"
              title={publishedResults.length === 0 ? 'No results published yet' : 'No results match'}
              description={publishedResults.length === 0
                ? 'Results will appear here once published by the admin.'
                : 'Try a different search or category.'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {grouped.map(({ eventTitle, category, items }) => {
                const catColor = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-600'
                const catLabel = CATEGORY_LABELS[category] || category
                return (
                  <div key={`${eventTitle}__${category}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">{eventTitle}</h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${catColor}`}>
                        {catLabel}
                      </span>
                    </div>
                    <div className="p-3 space-y-2">
                      {items.map((r) => <WinnerCard key={r.id} result={r} />)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : tab === 1 ? (
        // ── Sector Leaderboard ────────────────────────────────────────────
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-600">Live leaderboard · updates automatically</span>
          </div>
          <SectorLeaderboard results={publishedResults} />
        </div>
      ) : (
        // ── Individual Leaderboard ─────────────────────────────────────────
        <div className="max-w-2xl">
          <p className="text-sm text-gray-500 mb-6">Top performers ranked by accumulated points.</p>
          {individual.length === 0 ? (
            <EmptyState icon="🏅" title="Not available yet" description="Published after all events conclude." />
          ) : (
            <div className="space-y-2">
              {individual.map((p, i) => (
                <div key={`${p.name}__${p.sector}`} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    i === 0 ? 'bg-yellow-100 text-yellow-700' :
                    i === 1 ? 'bg-gray-100 text-gray-600' :
                    i === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 truncate">{p.school} · {p.sector}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-sm">
                    {p.golds > 0 && <span title="Gold medals">🥇 {p.golds}</span>}
                    {p.silvers > 0 && <span title="Silver medals">🥈 {p.silvers}</span>}
                    {p.bronzes > 0 && <span title="Bronze medals">🥉 {p.bronzes}</span>}
                    <span className="font-extrabold text-primary-700 text-base">{p.totalPts} pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

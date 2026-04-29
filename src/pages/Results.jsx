import { useState, useEffect, useMemo } from 'react'
import { getResults } from '../firebase/results'
import ResultCard from '../components/ResultCard'
import SectorLeaderboard from '../components/SectorLeaderboard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const TABS = ['Event Results', 'Sector Leaderboard']

export default function Results() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getResults()
      .then(setResults)
      .finally(() => setLoading(false))
  }, [])

  const grouped = useMemo(() => {
    const map = {}
    for (const r of results) {
      const key = r.eventTitle || 'Unknown Event'
      if (!map[key]) map[key] = []
      map[key].push(r)
    }
    // Sort each group by rank
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.rank - b.rank)
    }
    return map
  }, [results])

  const filteredEvents = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return Object.entries(grouped)
    return Object.entries(grouped).filter(
      ([title]) => title.toLowerCase().includes(q)
    )
  }, [grouped, search])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Results</h1>
        <p className="text-gray-500 mt-1">Sahityotsav 2026 · Event winners & sector rankings</p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 rounded-xl p-1 flex gap-1 mb-8 w-fit">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === i ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading results..." />
      ) : tab === 0 ? (
        <>
          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          {filteredEvents.length === 0 ? (
            <EmptyState icon="🏆" title="No results yet" description="Results will appear here once published by the admin." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map(([title, items]) => (
                <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">{title}</h3>
                  <div className="space-y-2">
                    {items.map((r) => (
                      <ResultCard key={r.id} result={r} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-600">Points: 1st = 5pts · 2nd = 3pts · 3rd = 1pt</span>
          </div>
          <SectorLeaderboard results={results} />
        </div>
      )}
    </div>
  )
}

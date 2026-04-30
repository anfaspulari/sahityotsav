import { useMemo, useState } from 'react'
import { useEvents } from '../hooks/useFirestore'
import { updateEventStatus } from '../firebase/events'
import { STAGES, STAGE_LABELS, STAGE_TYPE, CATEGORIES, CATEGORY_COLORS, EVENT_STATUS } from '../constants'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const ALL = 'All'
const VIEWS = ['Stage View', 'Full Schedule']

const DAY_LABELS = {
  '2026-06-28': 'Day 1 – Sunday, 28 June 2026',
  '2026-06-29': 'Day 2 – Monday, 29 June 2026',
}

export default function Schedule() {
  const { events, loading, error } = useEvents()

  const [view, setView] = useState(0)          // 0=Stage View, 1=Full Schedule
  const [filterDay, setFilterDay] = useState(ALL)
  const [filterStage, setFilterStage] = useState(ALL)
  const [filterCat, setFilterCat] = useState(ALL)
  const [filterStatus, setFilterStatus] = useState(ALL)
  const [isAdmin, setIsAdmin] = useState(false)

  // Live counts
  const ongoing = events.filter((e) => e.status === 'ongoing').length
  const completed = events.filter((e) => e.status === 'completed').length

  const days = useMemo(() => [...new Set(events.map((e) => e.date))].sort(), [events])

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (filterDay !== ALL && e.date !== filterDay) return false
      if (filterStage !== ALL && e.stage !== filterStage) return false
      if (filterCat !== ALL && e.category !== filterCat) return false
      if (filterStatus !== ALL && (e.status || 'upcoming') !== filterStatus) return false
      return true
    })
  }, [events, filterDay, filterStage, filterCat, filterStatus])

  const handleStatusChange = async (id, newStatus) => {
    await updateEventStatus(id, newStatus)
    // onSnapshot auto-updates
  }

  const clearFilters = () => {
    setFilterDay(ALL); setFilterStage(ALL); setFilterCat(ALL); setFilterStatus(ALL)
  }
  const hasFilters = filterDay !== ALL || filterStage !== ALL || filterCat !== ALL || filterStatus !== ALL

  // ── Stage View grouping ────────────────────────────────────────────────────
  const byStage = useMemo(() => {
    const map = {}
    for (const ev of filtered) {
      if (!map[ev.stage]) map[ev.stage] = []
      map[ev.stage].push(ev)
    }
    return map
  }, [filtered])

  // ── Full Schedule grouping: by day, then stage ─────────────────────────────
  const byDay = useMemo(() => {
    const map = {}
    for (const ev of filtered) {
      const day = ev.date || 'TBD'
      if (!map[day]) map[day] = {}
      if (!map[day][ev.stage]) map[day][ev.stage] = []
      map[day][ev.stage].push(ev)
    }
    return map
  }, [filtered])

  const Chip = ({ label, active, onClick, colorClass }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
        active ? 'bg-primary-600 text-white' : colorClass || 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Schedule</h1>
          <p className="text-gray-500 mt-1">June 28–29, 2026 · 9 Sectors · 8 Stages</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {ongoing > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {ongoing} Live Now
            </span>
          )}
          <span className="text-xs text-gray-400">{completed}/{events.length} completed</span>
          <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="rounded"
            />
            Stage-Incharge View
          </label>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
          {VIEWS.map((v, i) => (
            <button
              key={v}
              onClick={() => setView(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === i ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Filter Events</p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">
              Clear all
            </button>
          )}
        </div>

        {/* Day */}
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1.5">Day</p>
          <div className="flex flex-wrap gap-1.5">
            <Chip label="All Days" active={filterDay === ALL} onClick={() => setFilterDay(ALL)} />
            {days.map((d) => (
              <Chip
                key={d}
                label={d === '2026-06-28' ? 'Day 1 (Jun 28)' : 'Day 2 (Jun 29)'}
                active={filterDay === d}
                onClick={() => setFilterDay(d)}
              />
            ))}
          </div>
        </div>

        {/* Stage */}
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1.5">Stage</p>
          <div className="flex flex-wrap gap-1.5">
            <Chip label="All Stages" active={filterStage === ALL} onClick={() => setFilterStage(ALL)} />
            {STAGES.map((s) => (
              <Chip key={s} label={s} active={filterStage === s} onClick={() => setFilterStage(s)}
                colorClass={STAGE_TYPE[s] === 'on-stage' ? 'bg-pink-50 text-pink-700 hover:bg-pink-100' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}
              />
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1.5">Category</p>
          <div className="flex flex-wrap gap-1.5">
            <Chip label="All" active={filterCat === ALL} onClick={() => setFilterCat(ALL)} />
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} active={filterCat === c} onClick={() => setFilterCat(c)}
                colorClass={CATEGORY_COLORS[c] + ' hover:opacity-80'}
              />
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1.5">Status</p>
          <div className="flex flex-wrap gap-1.5">
            <Chip label="All" active={filterStatus === ALL} onClick={() => setFilterStatus(ALL)} />
            {Object.entries(EVENT_STATUS).map(([key, val]) => (
              <Chip key={key} label={val.label} active={filterStatus === key} onClick={() => setFilterStatus(key)}
                colorClass={val.color + ' hover:opacity-80'}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 pt-1">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of {events.length} events
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading schedule..." />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={events.length === 0 ? '📋' : '🔍'}
          title={events.length === 0 ? 'Schedule not published yet' : 'No events match'}
          description={events.length === 0 ? 'Seed demo data from the Admin panel.' : 'Try clearing some filters.'}
        />
      ) : view === 0 ? (
        // ── Stage View ──────────────────────────────────────────────────────
        <div className="space-y-10">
          {STAGES.filter((s) => byStage[s]?.length).map((stageName) => {
            const stageEvs = byStage[stageName]
            const ongoingCount = stageEvs.filter((e) => e.status === 'ongoing').length
            const completedCount = stageEvs.filter((e) => e.status === 'completed').length
            const typeTag = STAGE_TYPE[stageName] === 'on-stage'
              ? <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">On-Stage</span>
              : <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Off-Stage</span>

            return (
              <div key={stageName}>
                {/* Stage header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-gray-900">{STAGE_LABELS[stageName]}</h2>
                      {typeTag}
                      {ongoingCount > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium animate-pulse">
                          🟢 {ongoingCount} Live
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {completedCount}/{stageEvs.length} completed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {stageEvs.map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      onStatusChange={isAdmin ? handleStatusChange : null}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // ── Full Schedule View ───────────────────────────────────────────────
        <div className="space-y-12">
          {Object.entries(byDay)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([day, stageMap]) => (
              <div key={day}>
                <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full shrink-0" />
                  {DAY_LABELS[day] || day}
                </h2>
                <div className="space-y-8">
                  {STAGES.filter((s) => stageMap[s]?.length).map((stageName) => (
                    <div key={stageName}>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        {STAGE_LABELS[stageName]}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {stageMap[stageName].map((ev) => (
                          <EventCard
                            key={ev.id}
                            event={ev}
                            onStatusChange={isAdmin ? handleStatusChange : null}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

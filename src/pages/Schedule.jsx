import { useState, useEffect, useMemo } from 'react'
import { getEvents } from '../firebase/events'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const SECTORS = ['All', 'Feroke', 'Calicut', 'Kozhikode', 'Malappuram', 'Tirur']
const CATEGORIES = ['All', 'Literature', 'Performing Arts', 'Music', 'Visual Arts']

export default function Schedule() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [sector, setSector] = useState('All')
  const [category, setCategory] = useState('All')
  const [date, setDate] = useState('')

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .finally(() => setLoading(false))
  }, [])

  const dates = useMemo(() => {
    const all = [...new Set(events.map((e) => e.date))].sort()
    return all
  }, [events])

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (sector !== 'All' && e.sector !== sector) return false
      if (category !== 'All' && e.category !== category) return false
      if (date && e.date !== date) return false
      return true
    })
  }, [events, sector, category, date])

  const grouped = useMemo(() => {
    return filtered.reduce((acc, ev) => {
      const key = ev.date || 'TBD'
      if (!acc[key]) acc[key] = []
      acc[key].push(ev)
      return acc
    }, {})
  }, [filtered])

  const formatDate = (d) =>
    d === 'TBD'
      ? 'TBD'
      : new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Schedule</h1>
        <p className="text-gray-500 mt-1">March 15–17, 2026 · Feroke Division</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 space-y-4">
        <p className="text-sm font-semibold text-gray-700">Filters</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Sector filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Sector</label>
            <div className="flex flex-wrap gap-1.5">
              {SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sector === s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === c
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Date filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Date</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setDate('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  date === '' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {dates.map((d) => (
                <button
                  key={d}
                  onClick={() => setDate(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    date === d ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {events.length} events
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading schedule..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No events match" description="Try adjusting the filters above." />
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([d, evs]) => (
            <div key={d} className="mb-10">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full" />
                {formatDate(d)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {evs.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  )
}

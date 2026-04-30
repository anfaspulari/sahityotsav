import { useState, useEffect, useMemo } from 'react'
import { getEvents } from '../firebase/events'
import { SECTORS, CATEGORIES, STAGES } from '../constants'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const ALL_SECTORS = ['All', ...SECTORS]
const ALL_CATEGORIES = ['All', ...CATEGORIES]
const ALL_STAGES = ['All', ...STAGES]

export default function Schedule() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sector, setSector] = useState('All')
  const [category, setCategory] = useState('All')
  const [stage, setStage] = useState('All')
  const [date, setDate] = useState('')

  useEffect(() => {
    setError(null)
    getEvents()
      .then(setEvents)
      .catch((err) => {
        console.error('Failed to load events:', err)
        setError('Could not load events. Check your Firebase configuration.')
      })
      .finally(() => setLoading(false))
  }, [])

  const dates = useMemo(() => [...new Set(events.map((e) => e.date))].sort(), [events])

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (sector !== 'All' && e.sector !== sector) return false
      if (category !== 'All' && e.category !== category) return false
      if (stage !== 'All' && e.stage !== stage) return false
      if (date && e.date !== date) return false
      return true
    })
  }, [events, sector, category, stage, date])

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
      ? 'Date TBD'
      : new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

  const FilterChips = ({ label, options, active, onChange }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              active === opt
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Schedule</h1>
        <p className="text-gray-500 mt-1">2 Days · 9 Sectors · 8 Stages · Feroke Division</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 space-y-4">
        <p className="text-sm font-semibold text-gray-700">Filter Events</p>

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Day</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setDate('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  date === '' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Days
              </button>
              {dates.map((d) => (
                <button
                  key={d}
                  onClick={() => setDate(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    date === d ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </button>
              ))}
            </div>
          </div>

          {/* Stage */}
          <FilterChips label="Stage" options={ALL_STAGES} active={stage} onChange={setStage} />

          {/* Category */}
          <FilterChips label="Category" options={ALL_CATEGORIES} active={category} onChange={setCategory} />
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of {events.length} events
          </p>
          {(sector !== 'All' || category !== 'All' || stage !== 'All' || date !== '') && (
            <button
              onClick={() => { setSector('All'); setCategory('All'); setStage('All'); setDate('') }}
              className="text-xs text-primary-600 hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading schedule..." />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-red-400 text-sm mt-1">Check the browser console for details.</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={events.length === 0 ? '📋' : '🔍'}
          title={events.length === 0 ? 'Schedule not published yet' : 'No events match'}
          description={
            events.length === 0
              ? 'Visit the Admin panel to add events or seed demo data.'
              : 'Try clearing some filters.'
          }
        />
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([d, evs]) => (
            <div key={d} className="mb-12">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3">
                <span className="w-1 h-6 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full shrink-0" />
                {formatDate(d)}
                <span className="text-xs font-normal text-gray-400 ml-1">{evs.length} events</span>
              </h2>

              {/* Group by stage within each day */}
              {Object.entries(
                evs.reduce((acc, ev) => {
                  const s = ev.stage || 'Other'
                  if (!acc[s]) acc[s] = []
                  acc[s].push(ev)
                  return acc
                }, {})
              )
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([stageName, stageEvs]) => (
                  <div key={stageName} className="mb-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                      {stageName}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stageEvs.map((ev) => (
                        <EventCard key={ev.id} event={ev} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))
      )}
    </div>
  )
}

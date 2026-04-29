import { useState, useEffect } from 'react'
import { getEvents, addEvent, updateEvent, deleteEvent } from '../firebase/events'
import { getResults, addResult, updateResult, deleteResult } from '../firebase/results'
import { seedDemoData } from '../firebase/seed'
import LoadingSpinner from '../components/LoadingSpinner'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026'

const SECTORS = ['Feroke', 'Calicut', 'Kozhikode', 'Malappuram', 'Tirur']
const CATEGORIES = ['Literature', 'Performing Arts', 'Music', 'Visual Arts']
const TABS = ['Events', 'Results']

const BLANK_EVENT = { title: '', category: 'Literature', sector: 'Feroke', date: '', time: '', venue: '' }
const BLANK_RESULT = { eventTitle: '', rank: 1, participantName: '', sector: 'Feroke', school: '' }

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <p className="text-gray-900 font-semibold mb-4">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function EventForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 mb-4">{initial.id ? 'Edit Event' : 'Add Event'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Event Title *</label>
          <input
            value={form.title}
            onChange={set('title')}
            placeholder="e.g. Kavitha Recitation"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Category *</label>
          <select
            value={form.category}
            onChange={set('category')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Sector *</label>
          <select
            value={form.sector}
            onChange={set('sector')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            {SECTORS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={set('date')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
          <input
            type="time"
            value={form.time}
            onChange={set('time')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Venue</label>
          <input
            value={form.venue}
            onChange={set('venue')}
            placeholder="e.g. Main Stage"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.title}
          className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </div>
  )
}

function ResultForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 mb-4">{initial.id ? 'Edit Result' : 'Add Result'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Event Title *</label>
          <input
            value={form.eventTitle}
            onChange={set('eventTitle')}
            placeholder="e.g. Kavitha Recitation"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Rank *</label>
          <select
            value={form.rank}
            onChange={(e) => setForm((f) => ({ ...f, rank: Number(e.target.value) }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value={1}>1st Place</option>
            <option value={2}>2nd Place</option>
            <option value={3}>3rd Place</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Sector *</label>
          <select
            value={form.sector}
            onChange={set('sector')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            {SECTORS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Participant / Team *</label>
          <input
            value={form.participantName}
            onChange={set('participantName')}
            placeholder="Name or team"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">School / Institution</label>
          <input
            value={form.school}
            onChange={set('school')}
            placeholder="e.g. GHSS Feroke"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.eventTitle || !form.participantName}
          className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Result'}
        </button>
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [tab, setTab] = useState(0)
  const [events, setEvents] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    Promise.all([getEvents(), getResults()])
      .then(([evs, res]) => { setEvents(evs); setResults(res) })
      .finally(() => setLoading(false))
  }, [authed])

  const handleLogin = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  const handleSaveEvent = async (form) => {
    setSaving(true)
    try {
      const { id, ...data } = form
      if (id) {
        await updateEvent(id, data)
        setEvents((ev) => ev.map((e) => (e.id === id ? { id, ...data } : e)))
        showToast('Event updated!')
      } else {
        const ref = await addEvent(data)
        setEvents((ev) => [...ev, { id: ref.id, ...data }])
        showToast('Event added!')
      }
      setShowForm(false)
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEvent = async (id) => {
    await deleteEvent(id)
    setEvents((ev) => ev.filter((e) => e.id !== id))
    setDeleteTarget(null)
    showToast('Event deleted.')
  }

  const handleSaveResult = async (form) => {
    setSaving(true)
    try {
      const { id, ...data } = form
      if (id) {
        await updateResult(id, data)
        setResults((rs) => rs.map((r) => (r.id === id ? { id, ...data } : r)))
        showToast('Result updated!')
      } else {
        const ref = await addResult(data)
        setResults((rs) => [...rs, { id: ref.id, ...data }])
        showToast('Result added!')
      }
      setShowForm(false)
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteResult = async (id) => {
    await deleteResult(id)
    setResults((rs) => rs.filter((r) => r.id !== id))
    setDeleteTarget(null)
    showToast('Result deleted.')
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      await seedDemoData()
      const [evs, res] = await Promise.all([getEvents(), getResults()])
      setEvents(evs)
      setResults(res)
      showToast('Demo data seeded!')
    } finally {
      setSeeding(false)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
              🔐
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">Sahityotsav 2026</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Enter admin password"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                  pwError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {pwError && <p className="text-xs text-red-500 mt-1">Incorrect password.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Login
            </button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-4">
            Default password: <code className="bg-gray-100 px-1 rounded">admin2026</code>
            <br />Set <code className="bg-gray-100 px-1 rounded">VITE_ADMIN_PASSWORD</code> to change.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.label}"? This cannot be undone.`}
          onConfirm={() =>
            deleteTarget.type === 'event'
              ? handleDeleteEvent(deleteTarget.id)
              : handleDeleteResult(deleteTarget.id)
          }
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Manage events and results</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {seeding ? 'Seeding...' : 'Seed Demo Data'}
          </button>
          <button
            onClick={() => setAuthed(false)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 rounded-xl p-1 flex gap-1 mb-6 w-fit">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => { setTab(i); setShowForm(false); setEditing(null) }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === i ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t} <span className="ml-1 text-xs text-gray-400">({i === 0 ? events.length : results.length})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tab === 0 ? (
        <div className="space-y-4">
          {(showForm && !editing) && (
            <EventForm
              initial={BLANK_EVENT}
              onSave={handleSaveEvent}
              onCancel={() => setShowForm(false)}
              saving={saving}
            />
          )}
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditing(null) }}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Event
            </button>
          )}
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No events yet. Add one above or seed demo data.</div>
          ) : (
            <div className="space-y-2">
              {events.map((ev) => (
                editing?.id === ev.id ? (
                  <EventForm
                    key={ev.id}
                    initial={editing}
                    onSave={handleSaveEvent}
                    onCancel={() => setEditing(null)}
                    saving={saving}
                  />
                ) : (
                  <div key={ev.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{ev.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ev.category} · {ev.sector} · {ev.date} {ev.time} · {ev.venue}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => { setEditing(ev); setShowForm(false) }}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: ev.id, type: 'event', label: ev.title })}
                        className="px-3 py-1.5 border border-red-100 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {(showForm && !editing) && (
            <ResultForm
              initial={BLANK_RESULT}
              onSave={handleSaveResult}
              onCancel={() => setShowForm(false)}
              saving={saving}
            />
          )}
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditing(null) }}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Result
            </button>
          )}
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No results yet. Add one above or seed demo data.</div>
          ) : (
            <div className="space-y-2">
              {results.map((r) => (
                editing?.id === r.id ? (
                  <ResultForm
                    key={r.id}
                    initial={editing}
                    onSave={handleSaveResult}
                    onCancel={() => setEditing(null)}
                    saving={saving}
                  />
                ) : (
                  <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <div className="text-xl">{r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : '🥉'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{r.eventTitle}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {r.participantName} · {r.sector} · {r.school}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => { setEditing(r); setShowForm(false) }}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: r.id, type: 'result', label: `${r.eventTitle} - ${r.participantName}` })}
                        className="px-3 py-1.5 border border-red-100 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

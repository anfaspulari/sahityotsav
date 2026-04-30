import { useState, useMemo } from 'react'
import { addEvent, updateEvent, deleteEvent, updateEventStatus } from '../firebase/events'
import { addResult, updateResult, deleteResult } from '../firebase/results'
import { seedDemoData } from '../firebase/seed'
import { useEvents, useResults } from '../hooks/useFirestore'
import { SECTORS, CATEGORIES, STAGES, STAGE_LABELS, CATEGORY_LABELS, CATEGORY_COLORS, EVENT_STATUS } from '../constants'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026'

const TABS = ['Events', 'Mark Entry', 'Results', 'Settings']

const BLANK_EVENT = {
  title: '', category: 'HS', stage: 'Stage 1', date: '2026-06-28',
  time: '', status: 'upcoming', stageInCharge: '', description: '',
}
const BLANK_RESULT = {
  eventTitle: '', category: 'HS', rank: 1, participantName: '',
  sector: SECTORS[0], school: '', marks: '', published: true,
}

// ── Shared input style ─────────────────────────────────────────────────────
const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300'
const sel = inp

// ── Confirm modal ──────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <p className="text-gray-900 font-semibold mb-4">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ── Event form ─────────────────────────────────────────────────────────────
function EventForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...BLANK_EVENT, ...initial })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 mb-4">{initial?.id ? 'Edit Event' : 'Add Event'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Event Title *</label>
          <input value={form.title} onChange={set('title')} placeholder="e.g. Oppana" className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
          <select value={form.category} onChange={set('category')} className={sel}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Stage</label>
          <select value={form.stage} onChange={set('stage')} className={sel}>
            {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
          <select value={form.date} onChange={set('date')} className={sel}>
            <option value="2026-06-28">Day 1 – June 28, 2026</option>
            <option value="2026-06-29">Day 2 – June 29, 2026</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
          <input type="time" value={form.time} onChange={set('time')} className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select value={form.status} onChange={set('status')} className={sel}>
            {Object.entries(EVENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Stage In-Charge</label>
          <input value={form.stageInCharge} onChange={set('stageInCharge')} placeholder="Name" className={inp} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <input value={form.description} onChange={set('description')} placeholder="Short description" className={inp} />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
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

// ── Mark Entry: enter winners for an event in one form ─────────────────────
function MarkEntryForm({ events, onSave, saving }) {
  const [eventId, setEventId] = useState('')
  const [winners, setWinners] = useState([
    { rank: 1, participantName: '', sector: SECTORS[0], school: '', marks: '' },
    { rank: 2, participantName: '', sector: SECTORS[0], school: '', marks: '' },
    { rank: 3, participantName: '', sector: SECTORS[0], school: '', marks: '' },
  ])

  const selectedEvent = events.find((e) => e.id === eventId)

  const setWinner = (i, field, val) => {
    setWinners((w) => w.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }

  const handleSubmit = () => {
    if (!eventId || !selectedEvent) return
    const results = winners
      .filter((w) => w.participantName.trim())
      .map((w) => ({
        eventTitle: selectedEvent.title,
        category: selectedEvent.category,
        rank: w.rank,
        participantName: w.participantName.trim(),
        sector: w.sector,
        school: w.school.trim(),
        marks: w.marks !== '' ? Number(w.marks) : null,
        published: true,
      }))
    if (!results.length) return
    onSave(results)
    setEventId('')
    setWinners([
      { rank: 1, participantName: '', sector: SECTORS[0], school: '', marks: '' },
      { rank: 2, participantName: '', sector: SECTORS[0], school: '', marks: '' },
      { rank: 3, participantName: '', sector: SECTORS[0], school: '', marks: '' },
    ])
  }

  const MEDALS = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place']

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-2xl">
      <h3 className="font-bold text-gray-900 mb-4">Enter Results</h3>

      {/* Event selector */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-500 mb-1">Select Event *</label>
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={sel}>
          <option value="">-- Choose an event --</option>
          {[...events]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({CATEGORY_LABELS[ev.category] || ev.category}) · {ev.stage}
              </option>
            ))}
        </select>
      </div>

      {/* Winner rows */}
      <div className="space-y-4">
        {winners.map((w, i) => (
          <div key={i} className={`rounded-xl p-4 border ${i === 0 ? 'border-yellow-200 bg-yellow-50' : i === 1 ? 'border-gray-200 bg-gray-50' : 'border-orange-200 bg-orange-50'}`}>
            <p className="text-sm font-bold mb-3">{MEDALS[i]}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Participant / Team</label>
                <input
                  value={w.participantName}
                  onChange={(e) => setWinner(i, 'participantName', e.target.value)}
                  placeholder="Name or team name"
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Sector</label>
                <select value={w.sector} onChange={(e) => setWinner(i, 'sector', e.target.value)} className={sel}>
                  {SECTORS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">School / Institution</label>
                <input
                  value={w.school}
                  onChange={(e) => setWinner(i, 'school', e.target.value)}
                  placeholder="School name"
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Marks (optional)</label>
                <input
                  type="number"
                  value={w.marks}
                  onChange={(e) => setWinner(i, 'marks', e.target.value)}
                  placeholder="e.g. 92"
                  min={0} max={100}
                  className={inp}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving || !eventId || !winners.some((w) => w.participantName.trim())}
        className="mt-5 w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {saving ? 'Publishing...' : 'Publish Results'}
      </button>
    </div>
  )
}

// ── Main Admin component ───────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [tab, setTab] = useState(0)
  const { events, loading: evLoading } = useEvents()
  const { results, loading: resLoading } = useResults()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState('')
  const [evSearch, setEvSearch] = useState('')
  const [resSearch, setResSearch] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false) }
    else setPwError(true)
  }

  // ── Event handlers ──────────────────────────────────────────────────────
  const handleSaveEvent = async (form) => {
    setSaving(true)
    try {
      const { id, createdAt, ...data } = form
      if (id) { await updateEvent(id, data); showToast('Event updated!') }
      else { await addEvent(data); showToast('Event added!') }
      setShowForm(false); setEditing(null)
    } finally { setSaving(false) }
  }

  const handleDeleteEvent = async (id) => {
    await deleteEvent(id)
    setDeleteTarget(null)
    showToast('Event deleted.')
  }

  const handleStatusChange = async (id, status) => {
    await updateEventStatus(id, status)
    showToast(`Status → ${status}`)
  }

  // ── Result handlers ─────────────────────────────────────────────────────
  const handleMarkEntry = async (resultArr) => {
    setSaving(true)
    try {
      for (const r of resultArr) await addResult(r)
      showToast(`${resultArr.length} result(s) published!`)
    } finally { setSaving(false) }
  }

  const handleSaveResult = async (form) => {
    setSaving(true)
    try {
      const { id, createdAt, ...data } = form
      data.marks = data.marks !== '' ? Number(data.marks) : null
      if (id) { await updateResult(id, data); showToast('Result updated!') }
      else { await addResult(data); showToast('Result added!') }
      setShowForm(false); setEditing(null)
    } finally { setSaving(false) }
  }

  const handleDeleteResult = async (id) => {
    await deleteResult(id)
    setDeleteTarget(null)
    showToast('Result deleted.')
  }

  const handleSeed = async () => {
    setSeeding(true)
    try { await seedDemoData(); showToast('Demo data seeded!') }
    finally { setSeeding(false) }
  }

  const filteredEvents = useMemo(() => {
    const q = evSearch.toLowerCase()
    return q ? events.filter((e) => e.title?.toLowerCase().includes(q) || e.stage?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q)) : events
  }, [events, evSearch])

  const filteredResults = useMemo(() => {
    const q = resSearch.toLowerCase()
    return q ? results.filter((r) => r.eventTitle?.toLowerCase().includes(q) || r.participantName?.toLowerCase().includes(q) || r.sector?.toLowerCase().includes(q)) : results
  }, [results, resSearch])

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">🔐</div>
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
                className={`${inp} ${pwError ? 'border-red-300 bg-red-50' : ''}`}
              />
              {pwError && <p className="text-xs text-red-500 mt-1">Incorrect password.</p>}
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
              Login
            </button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-4">
            Default: <code className="bg-gray-100 px-1 rounded">admin2026</code> · Set <code className="bg-gray-100 px-1 rounded">VITE_ADMIN_PASSWORD</code> to change.
          </p>
        </div>
      </div>
    )
  }

  const loading = evLoading || resLoading

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.label}"?`}
          onConfirm={() => deleteTarget.type === 'event' ? handleDeleteEvent(deleteTarget.id) : handleDeleteResult(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">{events.length} events · {results.length} results published</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {seeding ? 'Seeding...' : '🌱 Seed Demo Data'}
          </button>
          <button onClick={() => setAuthed(false)} className="px-4 py-2 border border-red-100 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50">
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 rounded-xl p-1 flex gap-1 mb-8 w-fit flex-wrap">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => { setTab(i); setShowForm(false); setEditing(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === i ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : tab === 0 ? (
        // ── Events Tab ───────────────────────────────────────────────────
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            {!showForm && !editing && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Event
              </button>
            )}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search events..."
                value={evSearch}
                onChange={(e) => setEvSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 w-56"
              />
            </div>
            <span className="text-xs text-gray-400">{filteredEvents.length} events</span>
          </div>

          {(showForm && !editing) && (
            <EventForm initial={BLANK_EVENT} onSave={handleSaveEvent} onCancel={() => setShowForm(false)} saving={saving} />
          )}

          <div className="space-y-2">
            {filteredEvents.map((ev) =>
              editing?.id === ev.id ? (
                <EventForm key={ev.id} initial={editing} onSave={handleSaveEvent} onCancel={() => setEditing(null)} saving={saving} />
              ) : (
                <div key={ev.id} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap items-center gap-3 hover:shadow-sm transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900 truncate">{ev.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[ev.category] || 'bg-gray-100 text-gray-600'}`}>
                        {CATEGORY_LABELS[ev.category] || ev.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {ev.stage} · {ev.date} {ev.time && `· ${ev.time}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={ev.status || 'upcoming'}
                      onChange={(e) => handleStatusChange(ev.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-300 cursor-pointer"
                    >
                      {Object.entries(EVENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button onClick={() => { setEditing(ev); setShowForm(false) }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">Edit</button>
                    <button onClick={() => setDeleteTarget({ id: ev.id, type: 'event', label: ev.title })} className="px-3 py-1.5 border border-red-100 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50">Delete</button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : tab === 1 ? (
        // ── Mark Entry Tab ───────────────────────────────────────────────
        <div className="space-y-6">
          <MarkEntryForm events={events} onSave={handleMarkEntry} saving={saving} />
        </div>
      ) : tab === 2 ? (
        // ── Results Tab ──────────────────────────────────────────────────
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            {!showForm && !editing && (
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Single Result
              </button>
            )}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search results..."
                value={resSearch}
                onChange={(e) => setResSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 w-56"
              />
            </div>
          </div>

          {(showForm && !editing) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-lg">
              <h3 className="font-bold text-gray-900 mb-4">Add Single Result</h3>
              <SingleResultForm initial={BLANK_RESULT} onSave={handleSaveResult} onCancel={() => setShowForm(false)} saving={saving} />
            </div>
          )}

          <div className="space-y-2">
            {filteredResults.map((r) =>
              editing?.id === r.id ? (
                <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 max-w-lg">
                  <SingleResultForm initial={editing} onSave={handleSaveResult} onCancel={() => setEditing(null)} saving={saving} />
                </div>
              ) : (
                <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap items-center gap-3 hover:shadow-sm transition-shadow">
                  <div className="text-xl">{r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : '🥉'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900 truncate">{r.eventTitle}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[r.category] || 'bg-gray-100 text-gray-600'}`}>
                        {CATEGORY_LABELS[r.category] || r.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{r.participantName} · {r.sector} · {r.school}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {r.marks != null && <span className="text-xs text-gray-400">{r.marks} marks</span>}
                    <button onClick={() => { setEditing(r); setShowForm(false) }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">Edit</button>
                    <button onClick={() => setDeleteTarget({ id: r.id, type: 'result', label: `${r.eventTitle} – ${r.participantName}` })} className="px-3 py-1.5 border border-red-100 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50">Delete</button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        // ── Settings Tab ─────────────────────────────────────────────────
        <div className="max-w-md space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h3 className="font-bold text-gray-900">Data Management</h3>
            <p className="text-sm text-gray-500">Seed pre-built demo data with 120+ events and sample results. <strong>This will clear all existing data.</strong></p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50"
            >
              {seeding ? 'Seeding...' : '🌱 Seed Demo Data (clears existing)'}
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
            <h3 className="font-bold text-gray-900">Environment</h3>
            <p className="text-xs text-gray-400">Set <code className="bg-gray-100 px-1 rounded">VITE_ADMIN_PASSWORD</code> in your <code className="bg-gray-100 px-1 rounded">.env</code> file to change the admin password.</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Single result form (used in Results tab) ────────────────────────────────
function SingleResultForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...BLANK_RESULT, ...initial })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-500 mb-1">Event Title *</label>
        <input value={form.eventTitle} onChange={set('eventTitle')} placeholder="e.g. Oppana" className={inp} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
        <select value={form.category} onChange={set('category')} className={sel}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Rank</label>
        <select value={form.rank} onChange={(e) => setForm((f) => ({ ...f, rank: Number(e.target.value) }))} className={sel}>
          <option value={1}>🥇 1st Place</option>
          <option value={2}>🥈 2nd Place</option>
          <option value={3}>🥉 3rd Place</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Participant / Team *</label>
        <input value={form.participantName} onChange={set('participantName')} placeholder="Name" className={inp} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Sector</label>
        <select value={form.sector} onChange={set('sector')} className={sel}>
          {SECTORS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">School</label>
        <input value={form.school} onChange={set('school')} placeholder="School name" className={inp} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Marks</label>
        <input type="number" value={form.marks} onChange={set('marks')} placeholder="Optional" min={0} max={100} className={inp} />
      </div>
      <div className="sm:col-span-2 flex gap-3 mt-1">
        <button onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
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

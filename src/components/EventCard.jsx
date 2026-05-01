import StatusBadge from './StatusBadge'
import { CATEGORY_COLORS, STAGE_LABELS } from '../constants'

export default function EventCard({ event, onStatusChange }) {
  const { title, category, stage, date, time, status, description, stageInCharge, isGirls, duration } = event
  const catColor = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-600'
  const stageLabel = STAGE_LABELS[stage] || stage

  const formattedTime = time
    ? new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : ''

  const isActive = status === 'ongoing'

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border p-4 flex flex-col gap-3 transition-shadow hover:shadow-md ${
        isActive ? 'border-green-200 ring-1 ring-green-200' : 'border-gray-100'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 leading-snug text-sm">{title}</h3>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColor}`}>
            {category}
          </span>
          {isGirls && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-700">
              Girls
            </span>
          )}
        </div>
      </div>

      {(description || duration) && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 -mt-1">
          {duration && <span className="font-medium text-gray-500">{duration}</span>}
          {duration && description ? ' · ' : ''}
          {description}
        </p>
      )}

      {/* Meta */}
      <div className="space-y-1 text-xs text-gray-500">
        {formattedTime && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formattedTime}
          </div>
        )}
        {stage && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="truncate">{stage}</span>
          </div>
        )}
        {stageInCharge && (
          <div className="flex items-center gap-1.5 text-gray-400">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {stageInCharge}
          </div>
        )}
      </div>

      {/* Status + optional admin toggle */}
      <div className="flex items-center justify-between mt-auto pt-1 border-t border-gray-50">
        <StatusBadge status={status || 'upcoming'} size="xs" />
        {onStatusChange && (
          <select
            value={status || 'upcoming'}
            onChange={(e) => { e.stopPropagation(); onStatusChange(event.id, e.target.value) }}
            onClick={(e) => e.stopPropagation()}
            className="text-xs border border-gray-200 rounded-lg px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-300 cursor-pointer"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="delayed">Delayed</option>
            <option value="completed">Completed</option>
          </select>
        )}
      </div>
    </div>
  )
}

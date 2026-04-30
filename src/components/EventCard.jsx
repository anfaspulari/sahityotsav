const CATEGORY_COLORS = {
  Literature: 'bg-blue-100 text-blue-700',
  'Performing Arts': 'bg-pink-100 text-pink-700',
  Music: 'bg-green-100 text-green-700',
  'Visual Arts': 'bg-amber-100 text-amber-700',
  General: 'bg-gray-100 text-gray-600',
}

export default function EventCard({ event }) {
  const { title, category, stage, sector, date, time, description } = event
  const color = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-600'
  const formatted = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : ''

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{title}</h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${color}`}>
          {category}
        </span>
      </div>

      {description && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{description}</p>
      )}

      <div className="space-y-1.5 text-sm text-gray-500 mt-auto">
        {(date || time) && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatted}{time ? ` · ${time}` : ''}</span>
          </div>
        )}
        {stage && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{stage}</span>
          </div>
        )}
        {sector && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{sector}</span>
          </div>
        )}
      </div>
    </div>
  )
}

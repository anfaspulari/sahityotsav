import { EVENT_STATUS } from '../constants'

export default function StatusBadge({ status = 'upcoming', size = 'sm' }) {
  const s = EVENT_STATUS[status] || EVENT_STATUS.upcoming
  const text = size === 'xs' ? 'text-xs' : 'text-xs'
  const pad = size === 'xs' ? 'px-2 py-0.5' : 'px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${text} ${pad} ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

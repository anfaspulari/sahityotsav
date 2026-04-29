const RANK_STYLES = {
  1: { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', medal: '🥇', label: '1st' },
  2: { badge: 'bg-gray-100 text-gray-600 border-gray-200', medal: '🥈', label: '2nd' },
  3: { badge: 'bg-orange-100 text-orange-700 border-orange-200', medal: '🥉', label: '3rd' },
}

export default function ResultCard({ result }) {
  const { eventTitle, rank, participantName, sector, school } = result
  const style = RANK_STYLES[rank] || { badge: 'bg-gray-50 text-gray-500 border-gray-100', medal: '', label: `${rank}th` }

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border ${style.badge} transition-shadow hover:shadow-sm`}>
      <div className="text-2xl">{style.medal}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{participantName}</p>
        <p className="text-xs text-gray-500 truncate">{school} · {sector}</p>
      </div>
      <span className="text-xs font-bold uppercase tracking-wide shrink-0">{style.label}</span>
    </div>
  )
}

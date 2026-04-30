import { computeLeaderboard } from '../firebase/results'

const RANK_GRADIENTS = [
  'from-yellow-400 to-amber-500',
  'from-gray-300 to-gray-400',
  'from-orange-400 to-orange-500',
]
const RANK_RINGS = ['ring-yellow-300', 'ring-gray-300', 'ring-orange-300']

export default function SectorLeaderboard({ results }) {
  const board = computeLeaderboard(results)
  const max = board[0]?.points || 1

  if (!board.length) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        Leaderboard will appear as results are published.
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {board.map(({ sector, points }, i) => (
        <div
          key={sector}
          className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Rank badge */}
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${RANK_GRADIENTS[i] || 'from-primary-400 to-primary-500'} flex items-center justify-center text-white font-extrabold text-sm shrink-0 ${i < 3 ? `ring-2 ${RANK_RINGS[i]}` : ''}`}
          >
            {i + 1}
          </div>

          {/* Name + bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-gray-900 truncate">{sector}</p>
              <span className="font-extrabold text-primary-700 text-lg ml-3 shrink-0">{points}</span>
            </div>
            <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-700"
                style={{ width: `${(points / max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}

      <p className="text-xs text-center text-gray-400 pt-2">
        Points: 1st place = 5 · 2nd = 3 · 3rd = 1
      </p>
    </div>
  )
}

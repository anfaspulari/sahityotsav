import { computeLeaderboard } from '../firebase/results'

const RANK_COLORS = ['from-yellow-400 to-yellow-500', 'from-gray-300 to-gray-400', 'from-orange-400 to-orange-500']

export default function SectorLeaderboard({ results }) {
  const leaderboard = computeLeaderboard(results)

  if (!leaderboard.length) {
    return <p className="text-center text-gray-400 py-8 text-sm">No results published yet.</p>
  }

  return (
    <div className="space-y-3">
      {leaderboard.map(({ sector, points }, i) => (
        <div key={sector} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${RANK_COLORS[i] || 'from-primary-400 to-primary-500'} flex items-center justify-center text-white font-bold text-sm shrink-0`}
          >
            {i + 1}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{sector}</p>
            <div className="mt-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (points / (leaderboard[0]?.points || 1)) * 100)}%` }}
              />
            </div>
          </div>
          <span className="font-bold text-primary-700 text-lg shrink-0">{points}</span>
        </div>
      ))}
    </div>
  )
}

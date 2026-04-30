import { useState } from 'react'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../constants'

const MEDALS = {
  1: { emoji: '🥇', label: '1st Place', gradient: 'from-yellow-400 to-amber-500', text: 'text-yellow-900', bg: 'bg-yellow-50' },
  2: { emoji: '🥈', label: '2nd Place', gradient: 'from-gray-300 to-gray-400', text: 'text-gray-700', bg: 'bg-gray-50' },
  3: { emoji: '🥉', label: '3rd Place', gradient: 'from-orange-400 to-orange-500', text: 'text-orange-900', bg: 'bg-orange-50' },
}

function PosterModal({ result, onClose }) {
  const medal = MEDALS[result.rank] || MEDALS[3]
  const catColor = CATEGORY_COLORS[result.category] || 'bg-gray-100 text-gray-600'
  const catLabel = CATEGORY_LABELS[result.category] || result.category

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Poster card */}
        <div
          id="winner-poster"
          className="bg-gradient-to-br from-primary-800 via-primary-900 to-gray-900 rounded-3xl p-6 text-white shadow-2xl border border-white/10"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <p className="text-white/50 text-xs font-medium tracking-widest uppercase mb-1">
              Feroke Division Sahityotsav 2026
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
          </div>

          {/* Medal */}
          <div className="text-center mb-4">
            <div className="text-6xl mb-2">{medal.emoji}</div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${medal.gradient} text-white`}>
              {medal.label}
            </span>
          </div>

          {/* Participant */}
          <div className="text-center mb-5">
            <h2 className="text-2xl font-extrabold tracking-tight">{result.participantName}</h2>
            <p className="text-white/60 text-sm mt-1">{result.school}</p>
            <p className="text-white/80 text-sm font-medium mt-0.5">{result.sector} Sector</p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10 mb-4" />

          {/* Event info */}
          <div className="text-center">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Event</p>
            <p className="text-white font-semibold">{result.eventTitle}</p>
            <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${catColor}`}>
              {catLabel}
            </span>
          </div>

          {result.marks != null && (
            <div className="mt-4 text-center">
              <span className="text-white/40 text-xs">Marks: </span>
              <span className="text-white font-bold">{result.marks}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${result.eventTitle} – ${medal.label}`,
                  text: `🎉 ${result.participantName} from ${result.sector} won ${medal.label} in ${result.eventTitle} (${catLabel}) at Feroke Division Sahityotsav 2026!`,
                })
              } else {
                const text = `🎉 ${result.participantName} from ${result.sector} won ${medal.label} in ${result.eventTitle} (${catLabel}) at Feroke Division Sahityotsav 2026!`
                navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'))
              }
            }}
            className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Share 📤
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WinnerCard({ result }) {
  const [showPoster, setShowPoster] = useState(false)
  const medal = MEDALS[result.rank] || MEDALS[3]

  return (
    <>
      <div
        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${medal.bg} border-opacity-50`}
        style={{ borderColor: 'rgba(0,0,0,0.08)' }}
        onClick={() => setShowPoster(true)}
        title="Click to view winner poster"
      >
        <div className="text-2xl">{medal.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{result.participantName}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {result.school} · <span className="font-medium text-gray-700">{result.sector}</span>
          </p>
          {result.marks != null && (
            <p className="text-xs text-primary-600 font-medium mt-0.5">Marks: {result.marks}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-bold uppercase tracking-wide ${medal.text}`}>{medal.label}</span>
          <span className="text-xs text-gray-400">📤</span>
        </div>
      </div>

      {showPoster && <PosterModal result={result} onClose={() => setShowPoster(false)} />}
    </>
  )
}

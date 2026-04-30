import { Link } from 'react-router-dom'

const STATS = [
  { label: 'Events', value: '50+' },
  { label: 'Sectors', value: '9' },
  { label: 'Units', value: '61' },
  { label: 'Stages', value: '8' },
]

const HIGHLIGHTS = [
  { icon: '📖', title: 'Literature', desc: 'Kavitha, Story Writing, Debate & more' },
  { icon: '🎭', title: 'Performing Arts', desc: 'Oppana, Margamkali, Duff Muttu & more' },
  { icon: '🎵', title: 'Music', desc: 'Mappilappattu, Qaseedah, Vandanam & more' },
  { icon: '🎨', title: 'Visual Arts', desc: 'Calligraphy, Painting, Collage & more' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            Feroke Division · Kerala
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Feroke Division
            <br />
            <span className="text-gradient bg-gradient-to-r from-yellow-300 to-orange-400 [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">
              Sahityotsav 2026
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Celebrating Literature, Arts & Culture across Feroke Division
          </p>
          <p className="text-white/50 text-sm mb-10">March 15–16, 2026 · 9 Sectors · 61 Units</p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/schedule"
              className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
            >
              View Schedule
            </Link>
            <Link
              to="/results"
              className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              See Results
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold text-primary-700">{value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Categories</h2>
        <p className="text-gray-500 mb-8">Four categories spanning the rich cultural heritage of Kerala</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-3xl">{icon}</span>
              <h3 className="font-bold text-gray-900 mt-3 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to explore?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Browse the full event schedule, check live results, and follow the sector leaderboard.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/schedule"
              className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
            >
              Full Schedule →
            </Link>
            <Link
              to="/results"
              className="bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
            >
              Leaderboard →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

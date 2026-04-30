import { useState } from 'react'

const SECTIONS = ['All', 'Stage Highlights', 'Ceremonies', 'Candid']

const PLACEHOLDER_ITEMS = [
  { type: 'news', title: 'Sahityotsav 2026 Inaugurated', body: 'The Division Level Sahityotsav 2026 was inaugurated this morning at the Main Stage with an electrifying opening ceremony.', date: 'June 28, 2026' },
  { type: 'news', title: 'Feroke Takes Early Lead', body: 'After Day 1 results, Feroke sector leads the sector leaderboard with strong performances in Oppana and Mappilappattu.', date: 'June 28, 2026' },
  { type: 'news', title: 'Day 2 Schedule on Track', body: 'All 8 stages are running on schedule for Day 2. Off-stage events begin at 9 AM.', date: 'June 29, 2026' },
]

export default function Media() {
  const [filter, setFilter] = useState('All')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Media & Coverage</h1>
        <p className="text-gray-500 mt-1">Photos, videos, and news from Sahityotsav 2026</p>
      </div>

      {/* News highlights */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📰 News & Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLACEHOLDER_ITEMS.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <p className="text-xs font-medium text-primary-600 mb-2">{item.date}</p>
              <h3 className="font-bold text-gray-900 mb-2 leading-snug">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Photo gallery placeholder */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">📸 Photo Gallery</h2>
          <div className="flex gap-1.5 flex-wrap">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50 border border-gray-100 flex items-center justify-center text-gray-300 hover:shadow-md transition-shadow cursor-pointer"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">Photos will appear here during and after the event.</p>
          <p className="text-xs text-gray-300 mt-1">Upload via Firebase Storage integration.</p>
        </div>
      </section>

      {/* Video clips */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">🎥 Video Clips & Reels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          Video clips and reels will be posted after each stage.
        </p>
      </section>
    </div>
  )
}

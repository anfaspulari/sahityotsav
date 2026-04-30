import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'
import { RANK_POINTS } from '../constants'

const COL = 'results'

export async function addResult(data) {
  return addDoc(collection(db, COL), {
    ...data,
    published: true,
    createdAt: serverTimestamp(),
  })
}

export async function updateResult(id, data) {
  return updateDoc(doc(db, COL, id), data)
}

export async function deleteResult(id) {
  return deleteDoc(doc(db, COL, id))
}

// ─── Leaderboard computation ──────────────────────────────────────────────────
export function computeLeaderboard(results) {
  const scores = {}
  for (const r of results) {
    if (!r.sector || !r.published) continue
    const pts = RANK_POINTS[r.rank] || 0
    scores[r.sector] = (scores[r.sector] || 0) + pts
  }
  return Object.entries(scores)
    .map(([sector, points]) => ({ sector, points }))
    .sort((a, b) => b.points - a.points)
}

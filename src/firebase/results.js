import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const COLLECTION = 'results'

export async function getResults() {
  const q = query(collection(db, COLLECTION), orderBy('eventTitle', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addResult(data) {
  return addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() })
}

export async function updateResult(id, data) {
  return updateDoc(doc(db, COLLECTION, id), data)
}

export async function deleteResult(id) {
  return deleteDoc(doc(db, COLLECTION, id))
}

// Compute sector scores: 1st=5pts, 2nd=3pts, 3rd=1pt
export function computeLeaderboard(results) {
  const scores = {}
  for (const r of results) {
    if (!r.sector) continue
    if (!scores[r.sector]) scores[r.sector] = 0
    if (r.rank === 1) scores[r.sector] += 5
    else if (r.rank === 2) scores[r.sector] += 3
    else if (r.rank === 3) scores[r.sector] += 1
  }
  return Object.entries(scores)
    .map(([sector, points]) => ({ sector, points }))
    .sort((a, b) => b.points - a.points)
}

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

const COLLECTION = 'events'

export async function getEvents() {
  // Single-field orderBy avoids requiring a Firestore composite index.
  // Secondary sort (time) is done client-side.
  const q = query(collection(db, COLLECTION), orderBy('date', 'asc'))
  const snap = await getDocs(q)
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  // Sort by time within each date client-side
  return docs.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return (a.time || '').localeCompare(b.time || '')
  })
}

export async function addEvent(data) {
  return addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() })
}

export async function updateEvent(id, data) {
  return updateDoc(doc(db, COLLECTION, id), data)
}

export async function deleteEvent(id) {
  return deleteDoc(doc(db, COLLECTION, id))
}

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
  const q = query(collection(db, COLLECTION), orderBy('date', 'asc'), orderBy('time', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
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

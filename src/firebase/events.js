import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const COL = 'events'

export async function addEvent(data) {
  return addDoc(collection(db, COL), {
    ...data,
    status: data.status || 'upcoming',
    createdAt: serverTimestamp(),
  })
}

export async function updateEvent(id, data) {
  return updateDoc(doc(db, COL, id), data)
}

export async function updateEventStatus(id, status) {
  return updateDoc(doc(db, COL, id), { status })
}

export async function deleteEvent(id) {
  return deleteDoc(doc(db, COL, id))
}

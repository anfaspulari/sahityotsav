// Run this once to seed demo data into Firestore
// Usage: import and call seedDemoData() from Admin panel or browser console

import { db } from './config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const SECTORS = ['Feroke', 'Calicut', 'Kozhikode', 'Malappuram', 'Tirur']

const EVENTS = [
  { title: 'Kerala Padanam', category: 'Literature', sector: 'Feroke', date: '2026-03-15', time: '09:00', venue: 'Main Stage' },
  { title: 'Kavitha Recitation', category: 'Literature', sector: 'Calicut', date: '2026-03-15', time: '10:00', venue: 'Hall A' },
  { title: 'Story Writing', category: 'Literature', sector: 'Kozhikode', date: '2026-03-15', time: '11:00', venue: 'Hall B' },
  { title: 'Oppana', category: 'Performing Arts', sector: 'Malappuram', date: '2026-03-16', time: '09:00', venue: 'Main Stage' },
  { title: 'Margamkali', category: 'Performing Arts', sector: 'Tirur', date: '2026-03-16', time: '10:30', venue: 'Hall A' },
  { title: 'Duff Muttu', category: 'Music', sector: 'Feroke', date: '2026-03-16', time: '14:00', venue: 'Open Air' },
  { title: 'Arabic Calligraphy', category: 'Visual Arts', sector: 'Calicut', date: '2026-03-17', time: '09:00', venue: 'Gallery' },
  { title: 'Mappilappattu', category: 'Music', sector: 'Kozhikode', date: '2026-03-17', time: '11:00', venue: 'Main Stage' },
  { title: 'Debate', category: 'Literature', sector: 'Malappuram', date: '2026-03-17', time: '14:00', venue: 'Hall B' },
  { title: 'Painting', category: 'Visual Arts', sector: 'Tirur', date: '2026-03-17', time: '10:00', venue: 'Gallery' },
]

const RESULTS = [
  { eventTitle: 'Kerala Padanam', rank: 1, participantName: 'Amina Beevi', sector: 'Feroke', school: 'GHSS Feroke' },
  { eventTitle: 'Kerala Padanam', rank: 2, participantName: 'Rahmath', sector: 'Calicut', school: 'MES School' },
  { eventTitle: 'Kerala Padanam', rank: 3, participantName: 'Suhana K', sector: 'Tirur', school: 'GHSS Tirur' },
  { eventTitle: 'Kavitha Recitation', rank: 1, participantName: 'Fathima Nasrin', sector: 'Kozhikode', school: 'KMHSS' },
  { eventTitle: 'Kavitha Recitation', rank: 2, participantName: 'Shiyas M', sector: 'Malappuram', school: 'GHSS Malappuram' },
  { eventTitle: 'Oppana', rank: 1, participantName: 'Team Feroke', sector: 'Feroke', school: 'GHSS Feroke' },
  { eventTitle: 'Oppana', rank: 2, participantName: 'Team Calicut', sector: 'Calicut', school: 'MES School' },
  { eventTitle: 'Duff Muttu', rank: 1, participantName: 'Team Kozhikode', sector: 'Kozhikode', school: 'KMHSS' },
]

export async function seedDemoData() {
  console.log('Seeding events...')
  for (const ev of EVENTS) {
    await addDoc(collection(db, 'events'), { ...ev, createdAt: serverTimestamp() })
  }
  console.log('Seeding results...')
  for (const r of RESULTS) {
    await addDoc(collection(db, 'results'), { ...r, createdAt: serverTimestamp() })
  }
  console.log('Seeding complete!')
}

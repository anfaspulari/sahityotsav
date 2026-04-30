import { db } from './config'
import { collection, addDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { SECTORS, STAGES } from '../constants'

// 2-day, 9-sector, 8-stage schedule
// Day 1: 2026-03-15 | Day 2: 2026-03-16

const EVENTS = [
  // ── DAY 1 ─────────────────────────────────────────────────────────────────

  // Main Stage
  { title: 'Oppana', category: 'Performing Arts', date: '2026-03-15', time: '09:00', stage: 'Main Stage', description: 'Group folk dance of the Mappilas of Kerala' },
  { title: 'Margamkali', category: 'Performing Arts', date: '2026-03-15', time: '11:00', stage: 'Main Stage', description: 'Traditional Christian folk art form' },
  { title: 'Duff Muttu', category: 'Music', date: '2026-03-15', time: '14:00', stage: 'Main Stage', description: 'Traditional drum performance' },
  { title: 'Thiruvathirakali', category: 'Performing Arts', date: '2026-03-15', time: '16:00', stage: 'Main Stage', description: 'Classical group dance' },

  // Stage 2
  { title: 'Mappilappattu', category: 'Music', date: '2026-03-15', time: '09:00', stage: 'Stage 2', description: 'Mappila folk songs' },
  { title: 'Qaseedah', category: 'Music', date: '2026-03-15', time: '11:00', stage: 'Stage 2', description: 'Islamic devotional poetry recitation' },
  { title: 'Vandanam Pattu', category: 'Music', date: '2026-03-15', time: '14:00', stage: 'Stage 2', description: 'Devotional songs' },
  { title: 'Gaanamelavela', category: 'Music', date: '2026-03-15', time: '16:00', stage: 'Stage 2', description: 'Souvenir song performance' },

  // Stage 3
  { title: 'Kerala Padanam', category: 'Literature', date: '2026-03-15', time: '09:00', stage: 'Stage 3', description: 'Reading and presentation of Kerala texts' },
  { title: 'Kavitha Recitation', category: 'Literature', date: '2026-03-15', time: '11:00', stage: 'Stage 3', description: 'Poetry recitation' },
  { title: 'Prasanga Prasamgam', category: 'Literature', date: '2026-03-15', time: '14:00', stage: 'Stage 3', description: 'Speech competition' },
  { title: 'Debate', category: 'Literature', date: '2026-03-15', time: '16:00', stage: 'Stage 3', description: 'Competitive debate' },

  // Stage 4
  { title: 'Arabic Calligraphy', category: 'Visual Arts', date: '2026-03-15', time: '09:00', stage: 'Stage 4', description: 'Islamic calligraphy art' },
  { title: 'Collage', category: 'Visual Arts', date: '2026-03-15', time: '11:00', stage: 'Stage 4', description: 'Collage making competition' },
  { title: 'Pencil Drawing', category: 'Visual Arts', date: '2026-03-15', time: '14:00', stage: 'Stage 4', description: 'Freehand pencil drawing' },

  // Stage 5
  { title: 'Story Writing', category: 'Literature', date: '2026-03-15', time: '09:00', stage: 'Stage 5', description: 'Short story writing' },
  { title: 'Essay Writing', category: 'Literature', date: '2026-03-15', time: '11:00', stage: 'Stage 5', description: 'Essay competition' },
  { title: 'Letter Writing', category: 'Literature', date: '2026-03-15', time: '14:00', stage: 'Stage 5', description: 'Formal and informal letter writing' },

  // Stage 6
  { title: 'Mono Act', category: 'Performing Arts', date: '2026-03-15', time: '09:00', stage: 'Stage 6', description: 'Solo theatrical performance' },
  { title: 'Mime', category: 'Performing Arts', date: '2026-03-15', time: '11:30', stage: 'Stage 6', description: 'Silent storytelling performance' },
  { title: 'Skit', category: 'Performing Arts', date: '2026-03-15', time: '14:00', stage: 'Stage 6', description: 'Short group drama' },

  // Stage 7
  { title: 'Quiz', category: 'General', date: '2026-03-15', time: '09:00', stage: 'Stage 7', description: 'General knowledge quiz' },
  { title: 'Elocution', category: 'Literature', date: '2026-03-15', time: '11:00', stage: 'Stage 7', description: 'Public speaking competition' },
  { title: 'Extempore Speech', category: 'Literature', date: '2026-03-15', time: '14:00', stage: 'Stage 7', description: 'Impromptu speech competition' },

  // Stage 8
  { title: 'Poster Making', category: 'Visual Arts', date: '2026-03-15', time: '09:00', stage: 'Stage 8', description: 'Creative poster design' },
  { title: 'Painting', category: 'Visual Arts', date: '2026-03-15', time: '11:30', stage: 'Stage 8', description: 'Watercolor/acrylic painting' },
  { title: 'Cartoon', category: 'Visual Arts', date: '2026-03-15', time: '14:00', stage: 'Stage 8', description: 'Editorial cartoon drawing' },

  // ── DAY 2 ─────────────────────────────────────────────────────────────────

  // Main Stage
  { title: 'Nadodippattu', category: 'Music', date: '2026-03-16', time: '09:00', stage: 'Main Stage', description: 'Folk song performance' },
  { title: 'Group Dance', category: 'Performing Arts', date: '2026-03-16', time: '11:00', stage: 'Main Stage', description: 'Choreographed group dance' },
  { title: 'One Act Play', category: 'Performing Arts', date: '2026-03-16', time: '14:00', stage: 'Main Stage', description: 'Short theatrical play' },
  { title: 'Prize Distribution & Valedictory', category: 'General', date: '2026-03-16', time: '16:30', stage: 'Main Stage', description: 'Closing ceremony and prize distribution' },

  // Stage 2
  { title: 'Solo Song (Malayalam)', category: 'Music', date: '2026-03-16', time: '09:00', stage: 'Stage 2', description: 'Malayalam solo singing' },
  { title: 'Solo Song (Arabic)', category: 'Music', date: '2026-03-16', time: '11:00', stage: 'Stage 2', description: 'Arabic solo singing' },
  { title: 'Hamd & Naat', category: 'Music', date: '2026-03-16', time: '14:00', stage: 'Stage 2', description: 'Islamic devotional singing' },

  // Stage 3
  { title: 'Padyam Chollal', category: 'Literature', date: '2026-03-16', time: '09:00', stage: 'Stage 3', description: 'Sanskrit/Malayalam verse recitation' },
  { title: 'Kathaprasangam', category: 'Literature', date: '2026-03-16', time: '11:00', stage: 'Stage 3', description: 'Storytelling with narration' },
  { title: 'Mimicry', category: 'Performing Arts', date: '2026-03-16', time: '14:00', stage: 'Stage 3', description: 'Voice mimicry competition' },

  // Stage 4
  { title: 'Islamic Quiz', category: 'General', date: '2026-03-16', time: '09:00', stage: 'Stage 4', description: 'Islamic knowledge quiz' },
  { title: 'Science Quiz', category: 'General', date: '2026-03-16', time: '11:00', stage: 'Stage 4', description: 'Science and general knowledge quiz' },

  // Stage 5
  { title: 'Poem Writing', category: 'Literature', date: '2026-03-16', time: '09:00', stage: 'Stage 5', description: 'Original poem composition' },
  { title: 'Report Writing', category: 'Literature', date: '2026-03-16', time: '11:00', stage: 'Stage 5', description: 'Journalistic report writing' },

  // Stage 6
  { title: 'Fancy Dress', category: 'Performing Arts', date: '2026-03-16', time: '09:00', stage: 'Stage 6', description: 'Costume and character presentation' },
  { title: 'Tableau', category: 'Performing Arts', date: '2026-03-16', time: '11:00', stage: 'Stage 6', description: 'Living picture / still-life drama' },

  // Stage 7
  { title: 'IT Quiz', category: 'General', date: '2026-03-16', time: '09:00', stage: 'Stage 7', description: 'Information technology quiz' },
  { title: 'Multimedia Presentation', category: 'General', date: '2026-03-16', time: '11:00', stage: 'Stage 7', description: 'Slide or video presentation' },

  // Stage 8
  { title: 'Photography Exhibition', category: 'Visual Arts', date: '2026-03-16', time: '09:00', stage: 'Stage 8', description: 'Photo display and judging' },
  { title: 'Calligraphy (Malayalam)', category: 'Visual Arts', date: '2026-03-16', time: '11:00', stage: 'Stage 8', description: 'Malayalam handwriting art' },
]

const SAMPLE_RESULTS = [
  { eventTitle: 'Oppana', rank: 1, participantName: 'Team Feroke A', sector: 'Feroke', school: 'GHSS Feroke' },
  { eventTitle: 'Oppana', rank: 2, participantName: 'Team Calicut', sector: 'Calicut', school: 'MES School Calicut' },
  { eventTitle: 'Oppana', rank: 3, participantName: 'Team Malappuram', sector: 'Malappuram', school: 'GHSS Malappuram' },
  { eventTitle: 'Mappilappattu', rank: 1, participantName: 'Fathima Nasrin', sector: 'Kuttiyadi', school: 'GHSS Kuttiyadi' },
  { eventTitle: 'Mappilappattu', rank: 2, participantName: 'Amina Beevi', sector: 'Feroke', school: 'GHSS Feroke' },
  { eventTitle: 'Mappilappattu', rank: 3, participantName: 'Rahmath P', sector: 'Tirur', school: 'GHSS Tirur' },
  { eventTitle: 'Kerala Padanam', rank: 1, participantName: 'Shiyas M', sector: 'Vatakara', school: 'GHSS Vatakara' },
  { eventTitle: 'Kerala Padanam', rank: 2, participantName: 'Suhana K', sector: 'Ponnani', school: 'Ponnani HSS' },
  { eventTitle: 'Arabic Calligraphy', rank: 1, participantName: 'Muhammed Faiz', sector: 'Perambra', school: 'GHSS Perambra' },
  { eventTitle: 'Arabic Calligraphy', rank: 2, participantName: 'Zainab A', sector: 'Kuttippuram', school: 'GHSS Kuttippuram' },
  { eventTitle: 'Debate', rank: 1, participantName: 'Arshad K', sector: 'Calicut', school: 'MES School Calicut' },
  { eventTitle: 'Debate', rank: 2, participantName: 'Nishad V', sector: 'Feroke', school: 'GHSS Feroke' },
  { eventTitle: 'Duff Muttu', rank: 1, participantName: 'Team Kuttiyadi', sector: 'Kuttiyadi', school: 'GHSS Kuttiyadi' },
  { eventTitle: 'Duff Muttu', rank: 2, participantName: 'Team Perambra', sector: 'Perambra', school: 'GHSS Perambra' },
]

async function clearCollection(name) {
  const snap = await getDocs(collection(db, name))
  const deletes = snap.docs.map((d) => deleteDoc(d.ref))
  await Promise.all(deletes)
}

export async function seedDemoData() {
  console.log('Clearing existing data...')
  await Promise.all([clearCollection('events'), clearCollection('results')])

  console.log('Seeding events...')
  for (const ev of EVENTS) {
    await addDoc(collection(db, 'events'), { ...ev, createdAt: serverTimestamp() })
  }

  console.log('Seeding results...')
  for (const r of SAMPLE_RESULTS) {
    await addDoc(collection(db, 'results'), { ...r, createdAt: serverTimestamp() })
  }

  console.log('Seeding complete!')
}

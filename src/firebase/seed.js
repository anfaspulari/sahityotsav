import { db } from './config'
import { collection, addDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore'

// ─── Event templates ──────────────────────────────────────────────────────────
// Each entry expands into one event per category listed
const TEMPLATES = [
  // Stage 1 – On-Stage (Performance)
  { title: 'Oppana', stage: 'Stage 1', categories: ['HS', 'HSS', 'Girls'], day: 1, time: '09:00' },
  { title: 'Margamkali', stage: 'Stage 1', categories: ['UP', 'HS'], day: 1, time: '10:30' },
  { title: 'Duff Muttu', stage: 'Stage 1', categories: ['HS', 'HSS'], day: 1, time: '12:00' },
  { title: 'Thiruvathirakali', stage: 'Stage 1', categories: ['UP', 'HS', 'Girls'], day: 1, time: '14:00' },
  { title: 'Group Dance', stage: 'Stage 1', categories: ['LP', 'UP', 'HS'], day: 1, time: '15:30' },
  { title: 'Nadodippattu', stage: 'Stage 1', categories: ['LP', 'UP'], day: 2, time: '09:00' },
  { title: 'One Act Play', stage: 'Stage 1', categories: ['HS', 'HSS'], day: 2, time: '10:30' },
  { title: 'Fancy Dress', stage: 'Stage 1', categories: ['LP', 'UP'], day: 2, time: '14:00' },
  { title: 'Tableau', stage: 'Stage 1', categories: ['HS', 'HSS'], day: 2, time: '15:30' },

  // Stage 2 – On-Stage (Music)
  { title: 'Mappilappattu', stage: 'Stage 2', categories: ['LP', 'UP', 'HS', 'HSS'], day: 1, time: '09:00' },
  { title: 'Solo Song (Malayalam)', stage: 'Stage 2', categories: ['LP', 'UP', 'HS', 'HSS'], day: 1, time: '11:00' },
  { title: 'Qaseedah', stage: 'Stage 2', categories: ['Junior', 'Senior'], day: 1, time: '13:00' },
  { title: 'Vandanam Pattu', stage: 'Stage 2', categories: ['LP', 'UP'], day: 1, time: '14:30' },
  { title: 'Hamd & Naat', stage: 'Stage 2', categories: ['Junior', 'Senior', 'Girls'], day: 2, time: '09:00' },
  { title: 'Solo Song (Arabic)', stage: 'Stage 2', categories: ['HS', 'HSS'], day: 2, time: '10:30' },
  { title: 'Gaanamelavela', stage: 'Stage 2', categories: ['General'], day: 2, time: '14:00' },
  { title: 'Girls Group Song', stage: 'Stage 2', categories: ['Girls'], day: 2, time: '15:30' },

  // Stage 3 – On-Stage (Speech & Drama)
  { title: 'Mono Act', stage: 'Stage 3', categories: ['HS', 'HSS'], day: 1, time: '09:00' },
  { title: 'Mime', stage: 'Stage 3', categories: ['HS', 'HSS'], day: 1, time: '10:30' },
  { title: 'Skit', stage: 'Stage 3', categories: ['UP', 'HS'], day: 1, time: '12:00' },
  { title: 'Kathaprasangam', stage: 'Stage 3', categories: ['HS', 'HSS'], day: 1, time: '14:00' },
  { title: 'Kavitha Recitation', stage: 'Stage 3', categories: ['LP', 'UP', 'HS', 'HSS'], day: 1, time: '15:30' },
  { title: 'Kerala Padanam', stage: 'Stage 3', categories: ['UP', 'HS', 'HSS'], day: 2, time: '09:00' },
  { title: 'Mimicry', stage: 'Stage 3', categories: ['HS', 'HSS'], day: 2, time: '11:00' },
  { title: 'Padyam Chollal', stage: 'Stage 3', categories: ['UP', 'HS'], day: 2, time: '14:00' },

  // Stage 4 – Off-Stage (Writing)
  { title: 'Essay Writing', stage: 'Stage 4', categories: ['LP', 'UP', 'HS', 'HSS'], day: 1, time: '09:00' },
  { title: 'Story Writing', stage: 'Stage 4', categories: ['LP', 'UP', 'HS'], day: 1, time: '11:00' },
  { title: 'Poem Writing', stage: 'Stage 4', categories: ['UP', 'HS', 'HSS'], day: 1, time: '13:00' },
  { title: 'Letter Writing', stage: 'Stage 4', categories: ['LP', 'UP'], day: 1, time: '15:00' },
  { title: 'Report Writing', stage: 'Stage 4', categories: ['HS', 'HSS'], day: 2, time: '09:00' },
  { title: 'Extempore Writing', stage: 'Stage 4', categories: ['HSS'], day: 2, time: '11:00' },
  { title: 'Novel Excerpt Writing', stage: 'Stage 4', categories: ['HS', 'HSS'], day: 2, time: '14:00' },

  // Stage 5 – Off-Stage (Visual Arts)
  { title: 'Arabic Calligraphy', stage: 'Stage 5', categories: ['UP', 'HS', 'HSS', 'General'], day: 1, time: '09:00' },
  { title: 'Malayalam Calligraphy', stage: 'Stage 5', categories: ['LP', 'UP', 'HS'], day: 1, time: '10:30' },
  { title: 'Painting', stage: 'Stage 5', categories: ['LP', 'UP', 'HS'], day: 1, time: '13:00' },
  { title: 'Pencil Drawing', stage: 'Stage 5', categories: ['UP', 'HS'], day: 1, time: '15:00' },
  { title: 'Poster Making', stage: 'Stage 5', categories: ['HS', 'HSS'], day: 2, time: '09:00' },
  { title: 'Collage', stage: 'Stage 5', categories: ['LP', 'UP'], day: 2, time: '11:00' },
  { title: 'Cartoon', stage: 'Stage 5', categories: ['HS', 'HSS'], day: 2, time: '13:00' },
  { title: 'Girls Painting', stage: 'Stage 5', categories: ['Girls'], day: 2, time: '15:00' },

  // Stage 6 – Off-Stage (Debate & Elocution)
  { title: 'Debate', stage: 'Stage 6', categories: ['HS', 'HSS'], day: 1, time: '09:00' },
  { title: 'Elocution', stage: 'Stage 6', categories: ['LP', 'UP', 'HS'], day: 1, time: '11:00' },
  { title: 'Extempore Speech', stage: 'Stage 6', categories: ['HSS', 'Senior'], day: 1, time: '13:00' },
  { title: 'Prasanga Prasamgam', stage: 'Stage 6', categories: ['HS', 'HSS'], day: 1, time: '15:00' },
  { title: 'Islamic Oration', stage: 'Stage 6', categories: ['Junior', 'Senior'], day: 2, time: '09:00' },
  { title: 'Impromptu Speech', stage: 'Stage 6', categories: ['HS', 'HSS'], day: 2, time: '11:00' },
  { title: 'Girls Debate', stage: 'Stage 6', categories: ['Girls'], day: 2, time: '14:00' },

  // Stage 7 – Off-Stage (Digital & Quiz)
  { title: 'General Quiz', stage: 'Stage 7', categories: ['HS', 'HSS', 'General'], day: 1, time: '09:00' },
  { title: 'Islamic Quiz', stage: 'Stage 7', categories: ['Junior', 'Senior', 'General'], day: 1, time: '11:00' },
  { title: 'Science Quiz', stage: 'Stage 7', categories: ['HS', 'HSS'], day: 1, time: '13:00' },
  { title: 'IT Quiz', stage: 'Stage 7', categories: ['HS', 'HSS'], day: 2, time: '09:00' },
  { title: 'Multimedia Presentation', stage: 'Stage 7', categories: ['HSS'], day: 2, time: '11:00' },
  { title: 'Photography Contest', stage: 'Stage 7', categories: ['General', 'HSS'], day: 2, time: '14:00' },

  // Stage 8 – Off-Stage (Special / Girls)
  { title: 'Mehndi Design', stage: 'Stage 8', categories: ['Girls', 'HSS'], day: 1, time: '09:00' },
  { title: 'Dress Designing', stage: 'Stage 8', categories: ['Girls'], day: 1, time: '11:00' },
  { title: 'Flower Arrangement', stage: 'Stage 8', categories: ['Girls', 'UP'], day: 1, time: '13:00' },
  { title: 'Face Painting', stage: 'Stage 8', categories: ['Girls', 'LP'], day: 1, time: '15:00' },
  { title: 'Cooking (No Fire)', stage: 'Stage 8', categories: ['Girls', 'HS'], day: 2, time: '09:00' },
  { title: 'Islamic Arts & Craft', stage: 'Stage 8', categories: ['Junior', 'Senior'], day: 2, time: '11:00' },
  { title: 'Recitation (Girls)', stage: 'Stage 8', categories: ['Girls'], day: 2, time: '14:00' },
]

const DATES = ['2026-06-28', '2026-06-29']

function buildEvents() {
  const events = []
  for (const t of TEMPLATES) {
    for (const cat of t.categories) {
      events.push({
        title: t.title,
        category: cat,
        stage: t.stage,
        stageType: t.stage <= 'Stage 3' ? 'on-stage' : 'off-stage',
        date: DATES[t.day - 1],
        time: t.time,
        status: 'upcoming',
        stageInCharge: '',
        description: '',
      })
    }
  }
  return events
}

const SAMPLE_RESULTS = [
  { eventTitle: 'Oppana', category: 'HS', rank: 1, participantName: 'Team Feroke', sector: 'Feroke', school: 'GHSS Feroke', marks: 92, published: true },
  { eventTitle: 'Oppana', category: 'HS', rank: 2, participantName: 'Team Calicut', sector: 'Calicut', school: 'MES School', marks: 88, published: true },
  { eventTitle: 'Oppana', category: 'HS', rank: 3, participantName: 'Team Malappuram', sector: 'Malappuram', school: 'GHSS Malappuram', marks: 84, published: true },
  { eventTitle: 'Mappilappattu', category: 'HS', rank: 1, participantName: 'Fathima Nasrin', sector: 'Kuttiyadi', school: 'GHSS Kuttiyadi', marks: 95, published: true },
  { eventTitle: 'Mappilappattu', category: 'HS', rank: 2, participantName: 'Amina Beevi', sector: 'Feroke', school: 'GHSS Feroke', marks: 91, published: true },
  { eventTitle: 'Mappilappattu', category: 'HS', rank: 3, participantName: 'Rahmath P', sector: 'Tirur', school: 'GHSS Tirur', marks: 87, published: true },
  { eventTitle: 'Arabic Calligraphy', category: 'HS', rank: 1, participantName: 'Muhammed Faiz', sector: 'Perambra', school: 'GHSS Perambra', marks: 97, published: true },
  { eventTitle: 'Arabic Calligraphy', category: 'HS', rank: 2, participantName: 'Zainab A', sector: 'Kuttippuram', school: 'GHSS Kuttippuram', marks: 93, published: true },
  { eventTitle: 'Debate', category: 'HS', rank: 1, participantName: 'Arshad K', sector: 'Calicut', school: 'MES School', marks: 89, published: true },
  { eventTitle: 'Debate', category: 'HS', rank: 2, participantName: 'Nishad V', sector: 'Feroke', school: 'GHSS Feroke', marks: 85, published: true },
  { eventTitle: 'Duff Muttu', category: 'HS', rank: 1, participantName: 'Team Kuttiyadi', sector: 'Kuttiyadi', school: 'GHSS Kuttiyadi', marks: 90, published: true },
  { eventTitle: 'Essay Writing', category: 'HS', rank: 1, participantName: 'Suhana Firdous', sector: 'Vatakara', school: 'GHSS Vatakara', marks: 94, published: true },
  { eventTitle: 'Essay Writing', category: 'HS', rank: 2, participantName: 'Shiyas M', sector: 'Ponnani', school: 'Ponnani HSS', marks: 90, published: true },
  { eventTitle: 'Kavitha Recitation', category: 'UP', rank: 1, participantName: 'Aisha Binth', sector: 'Feroke', school: 'GHUPS Feroke', marks: 93, published: true },
  { eventTitle: 'Kavitha Recitation', category: 'UP', rank: 2, participantName: 'Minhaj K', sector: 'Malappuram', school: 'GHUPS Malappuram', marks: 89, published: true },
]

async function clearCollection(name) {
  const snap = await getDocs(collection(db, name))
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
}

export async function seedDemoData() {
  console.log('Clearing existing data...')
  await Promise.all([clearCollection('events'), clearCollection('results')])

  const events = buildEvents()
  console.log(`Seeding ${events.length} events...`)
  for (const ev of events) {
    await addDoc(collection(db, 'events'), { ...ev, createdAt: serverTimestamp() })
  }

  console.log(`Seeding ${SAMPLE_RESULTS.length} results...`)
  for (const r of SAMPLE_RESULTS) {
    await addDoc(collection(db, 'results'), { ...r, createdAt: serverTimestamp() })
  }

  console.log('Seeding complete!')
}

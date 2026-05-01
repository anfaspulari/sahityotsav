import { db } from './config'
import { collection, addDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore'

// Stage assignment guide:
//   Stage 1 – On-Stage  : Music & group performances
//   Stage 2 – On-Stage  : Speeches, recitations, storytelling, debate, readings
//   Stage 3 – On-Stage  : Quiz, book test, language/math games, interactive
//   Stage 4 – Off-Stage : All writing (essay, story, poem, translation…)
//   Stage 5 – Off-Stage : Art (pencil drawing, painting, calligraphy, craft)
//   Stage 6 – Off-Stage : Digital & media (e-poster, reel, podcast, digital paint…)
//   Stage 7 – Off-Stage : Group/team events, projects, specials
//   Stage 8 – Off-Stage : Girls-specific events (LP/UP/HS/HSS Girls)

// Day 1 (June 28): LP, UP, HS, General categories
// Day 2 (June 29): HSS, Junior, Senior, Campus, Campus Girls, Parallel Campus Girls

const D1 = '2026-06-28'
const D2 = '2026-06-29'

// ─── Helper: build an event object ───────────────────────────────────────────
const ev = (cat, title, stage, day, time, duration = '', opts = {}) => ({
  category: cat,
  title,
  stage,
  date: day === 1 ? D1 : D2,
  time,
  duration,
  status: 'upcoming',
  stageInCharge: '',
  description: duration ? `Duration: ${duration}` : '',
  isGirls: false,
  ...opts,
})

const girl = (cat, title, stage, day, time, duration = '', opts = {}) =>
  ev(cat, title, stage, day, time, duration, { ...opts, isGirls: true })

// ─── Full event list ──────────────────────────────────────────────────────────
const EVENTS = [

  // ══════════════════════════════════════════════════════════════════════════
  //  1. LOWER PRIMARY (LP) – Day 1
  // ══════════════════════════════════════════════════════════════════════════
  ev('LP', 'Madh Ganam',              'Stage 1', 1, '09:00', '5m'),
  ev('LP', 'Speech',                  'Stage 2', 1, '09:00', '5m'),
  ev('LP', 'Quiz',                    'Stage 3', 1, '09:30'),
  ev('LP', 'Storytelling',            'Stage 2', 1, '10:00', '5m'),
  ev('LP', 'Pencil Drawing',          'Stage 5', 1, '09:00', '1hr'),
  ev('LP', 'Water Coloring',          'Stage 5', 1, '10:30', '1hr'),
  ev('LP', 'Language Game',           'Stage 3', 1, '10:30'),
  ev('LP', 'Malayalam Reading',       'Stage 3', 1, '11:00', '3m'),
  ev('LP', 'Arabic-Malayalam Reading','Stage 3', 1, '11:30', '3m'),
  ev('LP', 'Book Test',               'Stage 3', 1, '12:00', '15m'),
  // LP Girls (Stage 8)
  girl('LP', 'Pencil Drawing',         'Stage 8', 1, '09:00', '1hr',  { description: 'Girls · Up to District' }),
  girl('LP', 'Water Color Painting',   'Stage 8', 1, '10:30', '1hr',  { description: 'Girls · Up to District' }),
  girl('LP', 'Malayalam Handwriting',  'Stage 8', 1, '12:00',        { description: 'Girls · Up to Sector' }),
  girl('LP', 'Journal Art',            'Stage 8', 1, '13:00',        { description: 'Girls · Up to Division' }),

  // ══════════════════════════════════════════════════════════════════════════
  //  2. UPPER PRIMARY (UP) – Day 1
  // ══════════════════════════════════════════════════════════════════════════
  ev('UP', 'Mappila Paattu',      'Stage 1', 1, '09:00', '5m'),
  ev('UP', 'Storytelling',        'Stage 2', 1, '09:00', '5m'),
  ev('UP', 'Speech',              'Stage 2', 1, '10:00', '5m'),
  ev('UP', 'Math Game',           'Stage 3', 1, '09:00'),
  ev('UP', 'Quiz',                'Stage 3', 1, '10:00'),
  ev('UP', 'Pencil Drawing',      'Stage 5', 1, '09:00', '1hr'),
  ev('UP', 'Water Color Painting','Stage 5', 1, '10:30', '1hr'),
  ev('UP', 'Story Writing',       'Stage 4', 1, '09:00', '40m'),
  ev('UP', 'Book Test',           'Stage 3', 1, '11:00', '15m'),
  ev('UP', 'Spelling Bee',        'Stage 3', 1, '11:30'),
  ev('UP', 'Sudoku',              'Stage 3', 1, '12:00'),
  // UP Girls (Stage 8)
  girl('UP', 'Pencil Drawing',     'Stage 8', 1, '09:00', '1hr'),
  girl('UP', 'Water Coloring',     'Stage 8', 1, '10:30', '1hr'),
  girl('UP', 'Book Test',          'Stage 8', 1, '12:00', '15m'),
  girl('UP', 'Story Writing',      'Stage 8', 1, '13:00', '40m'),
  girl('UP', 'Origami',            'Stage 8', 1, '14:00',        { description: 'Girls · Up to Division' }),

  // ══════════════════════════════════════════════════════════════════════════
  //  3. HIGH SCHOOL (HS) – Day 1
  // ══════════════════════════════════════════════════════════════════════════
  ev('HS', 'Malayalam Speech',         'Stage 2', 1, '09:00', '5m'),
  ev('HS', 'English Speech',           'Stage 2', 1, '09:30', '5m'),
  ev('HS', 'Mappila Paattu',           'Stage 1', 1, '09:00', '5m'),
  ev('HS', 'Madh Ganam',               'Stage 1', 1, '10:00', '5m'),
  ev('HS', 'Arabic Poem Recitation',   'Stage 2', 1, '10:00', '5m'),
  ev('HS', 'Malayalam Poem Recitation','Stage 2', 1, '10:30', '5m'),
  ev('HS', 'Urdu Poem Recitation',     'Stage 2', 1, '11:00', '5m'),
  ev('HS', 'Quiz',                     'Stage 3', 1, '09:00'),
  ev('HS', 'Story Writing',            'Stage 4', 1, '09:00', '40m'),
  ev('HS', 'Poem Writing',             'Stage 4', 1, '10:00', '40m'),
  ev('HS', 'Pencil Drawing',           'Stage 5', 1, '09:00', '1hr'),
  ev('HS', 'Water Coloring',           'Stage 5', 1, '10:30', '1hr'),
  ev('HS', 'Book Test',                'Stage 3', 1, '11:00', '15m'),
  ev('HS', 'Malayalam Essay',          'Stage 4', 1, '11:00', '30m'),
  ev('HS', 'News Reading',             'Stage 2', 1, '12:00', '5m'),
  ev('HS', 'Caption Writing',          'Stage 4', 1, '12:00', '15m'),
  ev('HS', 'English Language Game',    'Stage 3', 1, '13:00'),
  // HS Girls (Stage 8)
  girl('HS', 'Embroidery',      'Stage 8', 1, '09:00'),
  girl('HS', 'Book Test',       'Stage 8', 1, '10:30', '15m'),
  girl('HS', 'Pencil Drawing',  'Stage 8', 1, '11:00', '1hr'),
  girl('HS', 'Water Coloring',  'Stage 8', 1, '12:30', '1hr'),
  girl('HS', 'Story Writing',   'Stage 8', 1, '14:00', '40m'),
  girl('HS', 'Poem Writing',    'Stage 8', 1, '15:00', '40m'),

  // ══════════════════════════════════════════════════════════════════════════
  //  7. GENERAL – Day 1
  // ══════════════════════════════════════════════════════════════════════════
  ev('General', 'Spot Magazine',       'Stage 7', 1, '09:00', '1hr',  { description: '5 members' }),
  ev('General', 'Daff',                'Stage 1', 1, '09:00', '10m',  { description: '10 members' }),
  ev('General', 'Arabana',             'Stage 1', 1, '10:00', '10m',  { description: '10 members' }),
  ev('General', 'Group Song A',        'Stage 1', 1, '11:00', '5m',   { description: '4 members' }),
  ev('General', 'Group Song B',        'Stage 1', 1, '11:30', '5m',   { description: '4 members' }),
  ev('General', 'Moulid Recitation',   'Stage 1', 1, '12:00', '5m',   { description: '4 members' }),
  ev('General', 'Qaseeda Recitation',  'Stage 1', 1, '12:30', '5m',   { description: '4 members' }),
  ev('General', 'Viplava Ganam',       'Stage 1', 1, '13:00', '5m',   { description: '3 members' }),
  ev('General', 'Wall Writing/Painting','Stage 5', 1, '09:00', '1hr',  { description: '2 members' }),
  ev('General', 'Malappattu',          'Stage 1', 1, '14:00', '5m',   { description: '3 members' }),
  ev('General', 'Risala Quiz',         'Stage 3', 1, '09:00',         { description: '2 members' }),
  ev('General', 'Qawwali',             'Stage 1', 1, '14:30', '10m',  { description: '5 members' }),
  ev('General', 'Viplava Gana Writing','Stage 4', 1, '09:00', '40m'),
  ev('General', 'Mappila Paattu Writing','Stage 4',1, '10:00', '40m'),
  ev('General', 'Social Story',        'Stage 2', 1, '13:00', '7m',   { description: 'District onwards' }),
  ev('General', 'Project',             'Stage 7', 1, '10:00'),
  ev('General', 'Collage',             'Stage 5', 1, '09:00', '1hr',  { description: '3 members' }),
  ev('General', 'Nashida',             'Stage 1', 1, '15:30', '7m',   { description: '4 members' }),
  ev('General', 'Family Magazine',     'Stage 7', 1, '11:00',         { description: 'Up to Sector' }),

  // ══════════════════════════════════════════════════════════════════════════
  //  4. HIGHER SECONDARY (HSS) – Day 2
  // ══════════════════════════════════════════════════════════════════════════
  ev('HSS', 'Urdu Poem Recitation','Stage 2', 2, '09:00', '5m'),
  ev('HSS', 'Mappila Paattu',      'Stage 1', 2, '09:00', '5m'),
  ev('HSS', 'Devotional Song',     'Stage 1', 2, '10:00', '5m'),
  ev('HSS', 'Speech',              'Stage 2', 2, '09:30', '5m'),
  ev('HSS', 'Digital Painting',    'Stage 6', 2, '09:00', '1hr'),
  ev('HSS', 'Story Writing',       'Stage 4', 2, '09:00', '40m'),
  ev('HSS', 'Poem Writing',        'Stage 4', 2, '10:00', '40m'),
  ev('HSS', 'Malayalam Essay',     'Stage 4', 2, '11:00', '30m'),
  ev('HSS', 'English Essay',       'Stage 4', 2, '12:00', '30m'),
  ev('HSS', 'Quiz',                'Stage 3', 2, '09:00'),
  ev('HSS', 'Pencil Drawing',      'Stage 5', 2, '09:00', '1hr'),
  ev('HSS', 'Water Coloring',      'Stage 5', 2, '10:30', '1hr'),
  ev('HSS', 'Book Test',           'Stage 3', 2, '10:00', '15m'),
  ev('HSS', 'News Writing',        'Stage 4', 2, '13:00', '20m'),
  ev('HSS', 'Arabic Calligraphy',  'Stage 5', 2, '12:00', '1hr'),
  ev('HSS', 'Reel Making',         'Stage 6', 2, '10:00',        { description: 'Up to District' }),
  // HSS Girls (Stage 8)
  girl('HSS', 'Arabic Calligraphy','Stage 8', 2, '09:00', '1hr'),
  girl('HSS', 'Book Test',         'Stage 8', 2, '10:30', '15m'),
  girl('HSS', 'Story Writing',     'Stage 8', 2, '11:00', '40m'),
  girl('HSS', 'Poem Writing',      'Stage 8', 2, '12:00', '40m'),

  // ══════════════════════════════════════════════════════════════════════════
  //  5. JUNIOR – Day 2
  // ══════════════════════════════════════════════════════════════════════════
  ev('Junior', 'Literary Discussion',  'Stage 2', 2, '09:00'),
  ev('Junior', 'Mappila Paattu',       'Stage 1', 2, '09:00', '5m'),
  ev('Junior', 'Malayalam Speech',     'Stage 2', 2, '09:30', '5m'),
  ev('Junior', 'Arabic Speech',        'Stage 2', 2, '10:00', '5m'),
  ev('Junior', 'English Speech',       'Stage 2', 2, '10:30', '5m'),
  ev('Junior', 'Poem Writing',         'Stage 4', 2, '09:00', '10m'),
  ev('Junior', 'Story Writing',        'Stage 4', 2, '09:30', '40m'),
  ev('Junior', 'Book Test',            'Stage 3', 2, '09:00', '15m'),
  ev('Junior', 'Malayalam Essay',      'Stage 4', 2, '10:30', '30m'),
  ev('Junior', 'Arabic Essay',         'Stage 4', 2, '11:00', '30m'),
  ev('Junior', 'Slogan Writing',       'Stage 4', 2, '11:30', '40m'),
  ev('Junior', 'Madh Song Writing',    'Stage 4', 2, '12:30', '40m'),
  ev('Junior', 'Quiz',                 'Stage 3', 2, '10:00'),
  ev('Junior', 'Arabic Translation',   'Stage 4', 2, '13:30', '40m'),
  ev('Junior', 'Arabic Calligraphy',   'Stage 5', 2, '09:00', '1hr'),
  ev('Junior', 'Social Test',          'Stage 3', 2, '11:00', '30m'),
  ev('Junior', 'Hadith Musabaqa',      'Stage 2', 2, '11:00'),
  ev('Junior', 'AI Poem Composition',  'Stage 6', 2, '09:00', '30m'),
  ev('Junior', 'Reel Making',          'Stage 6', 2, '10:00',        { description: 'State Level' }),
  ev('Junior', 'Podcast',              'Stage 6', 2, '11:00'),
  ev('Junior', 'Socio Synapse',        'Stage 7', 2, '09:00'),

  // ══════════════════════════════════════════════════════════════════════════
  //  6. SENIOR – Day 2
  // ══════════════════════════════════════════════════════════════════════════
  ev('Senior', 'Political Debate',          'Stage 2', 2, '09:00'),
  ev('Senior', 'Mappila Paattu',            'Stage 1', 2, '09:00', '5m'),
  ev('Senior', 'Hamd Urdu',                 'Stage 1', 2, '10:00', '5m'),
  ev('Senior', 'English Poem Recitation',   'Stage 2', 2, '09:30', '5m'),
  ev('Senior', 'Malayalam Speech',          'Stage 2', 2, '10:00', '5m'),
  ev('Senior', 'English Speech',            'Stage 2', 2, '10:30', '5m'),
  ev('Senior', 'Urdu Speech',               'Stage 2', 2, '11:00', '5m', { description: 'From Division' }),
  ev('Senior', 'Mushahra Alfiya',           'Stage 2', 2, '11:30'),
  ev('Senior', 'Poem Writing',              'Stage 4', 2, '09:00', '40m'),
  ev('Senior', 'English Poem Writing',      'Stage 4', 2, '10:00', '40m'),
  ev('Senior', 'Story Writing',             'Stage 4', 2, '11:00', '40m'),
  ev('Senior', 'Book Test',                 'Stage 3', 2, '09:00', '15m'),
  ev('Senior', 'Malayalam Essay',           'Stage 4', 2, '12:00', '30m'),
  ev('Senior', 'English Essay',             'Stage 4', 2, '13:00', '30m'),
  ev('Senior', 'Urdu Essay',                'Stage 4', 2, '14:00', '30m'),
  ev('Senior', 'English Translation',       'Stage 4', 2, '15:00', '40m'),
  ev('Senior', 'Madh Song Writing',         'Stage 4', 2, '09:00', '40m'),
  ev('Senior', 'Slogan Writing',            'Stage 4', 2, '10:00', '40m'),
  ev('Senior', 'Quiz',                      'Stage 3', 2, '10:00'),
  ev('Senior', 'Feature Writing',           'Stage 4', 2, '11:00', '1hr'),
  ev('Senior', 'Social Test',               'Stage 3', 2, '11:00', '30m'),
  ev('Senior', 'Poster Designing',          'Stage 5', 2, '09:00', '1hr'),
  ev('Senior', 'E-Poster',                  'Stage 6', 2, '09:00', '1hr'),
  ev('Senior', 'Digital Illustration',      'Stage 6', 2, '10:00', '1hr'),
  ev('Senior', 'Magazine Layout',           'Stage 6', 2, '11:00', '2hr', { description: 'District Onwards' }),
  ev('Senior', 'Digital Painting',          'Stage 6', 2, '13:00', '1hr'),
  ev('Senior', 'Podcast',                   'Stage 6', 2, '14:00',        { description: 'District Onwards' }),

  // ══════════════════════════════════════════════════════════════════════════
  //  8. CAMPUS – Day 2
  // ══════════════════════════════════════════════════════════════════════════
  ev('Campus', 'Mappila Paattu',       'Stage 1', 2, '09:00', '5m'),
  ev('Campus', 'Madh Ganam',           'Stage 1', 2, '10:00', '5m'),
  ev('Campus', 'Malayalam Speech',     'Stage 2', 2, '09:00', '5m'),
  ev('Campus', 'English Speech',       'Stage 2', 2, '09:30', '5m'),
  ev('Campus', 'Malayalam Essay',      'Stage 4', 2, '09:00', '30m'),
  ev('Campus', 'English Essay',        'Stage 4', 2, '10:00', '30m'),
  ev('Campus', 'Malayalam Story Writing','Stage 4', 2, '11:00', '40m'),
  ev('Campus', 'Malayalam Poem Writing','Stage 4', 2, '12:00', '40m'),
  ev('Campus', 'English Poem Writing', 'Stage 4', 2, '13:00', '40m'),
  ev('Campus', 'Pencil Drawing',       'Stage 5', 2, '09:00', '1hr'),
  ev('Campus', 'Water Coloring',       'Stage 5', 2, '10:30', '1hr'),
  ev('Campus', 'Quiz',                 'Stage 3', 2, '09:00',        { description: '2 members' }),
  ev('Campus', 'Book Test',            'Stage 3', 2, '10:00', '15m'),
  ev('Campus', 'E-Poster',             'Stage 6', 2, '09:00', '1hr'),
  ev('Campus', 'Vlog',                 'Stage 6', 2, '10:00', '7m'),
  ev('Campus', 'Top Comment',          'Stage 7', 2, '09:00',        { description: 'Unit Level only' }),
  ev('Campus', 'Political Debate',     'Stage 2', 2, '11:00'),
  ev('Campus', 'Campus Magazine',      'Stage 7', 2, '10:00'),
  ev('Campus', 'DPR Presentation',     'Stage 7', 2, '11:00', '20m', { description: 'District onwards' }),
  ev('Campus', 'Capture the Flag',     'Stage 7', 2, '12:00',        { description: 'District Level' }),
  ev('Campus', 'Language Pro',         'Stage 3', 2, '11:00',        { description: 'District Level' }),
  ev('Campus', 'Online Quiz',          'Stage 3', 2, '12:00',        { description: 'Unit Level' }),
  ev('Campus', 'AI Prompting',         'Stage 6', 2, '11:00', '30m'),
  ev('Campus', 'Ideathon',             'Stage 7', 2, '13:00'),
  ev('Campus', 'Market Masters',       'Stage 7', 2, '14:00'),
  ev('Campus', 'Book Tale',            'Stage 7', 2, '15:00'),

  // ══════════════════════════════════════════════════════════════════════════
  //  9. CAMPUS GIRLS – Day 2
  // ══════════════════════════════════════════════════════════════════════════
  ev('Campus Girls', 'Malayalam Essay',   'Stage 8', 2, '09:00', '30m'),
  ev('Campus Girls', 'English Essay',     'Stage 8', 2, '10:00', '30m'),
  ev('Campus Girls', 'Malayalam Story Writing','Stage 8', 2, '11:00', '40m'),
  ev('Campus Girls', 'English Story Writing',  'Stage 8', 2, '12:00', '40m'),
  ev('Campus Girls', 'Malayalam Poem Writing', 'Stage 8', 2, '13:00', '40m'),
  ev('Campus Girls', 'English Poem Writing',   'Stage 8', 2, '14:00', '40m'),
  ev('Campus Girls', 'Pencil Drawing',    'Stage 8', 2, '09:00', '1hr'),
  ev('Campus Girls', 'Water Coloring',    'Stage 8', 2, '10:30', '1hr'),
  ev('Campus Girls', 'Arabic Calligraphy','Stage 8', 2, '12:00', '1hr'),
  ev('Campus Girls', 'Book Test Online',  'Stage 8', 2, '14:00',        { description: 'State Level' }),
  ev('Campus Girls', 'Quiz Online',       'Stage 8', 2, '15:00',        { description: 'State Level' }),

  // ══════════════════════════════════════════════════════════════════════════
  //  10. PARALLEL CAMPUS GIRLS – Day 2
  // ══════════════════════════════════════════════════════════════════════════
  ev('Parallel Campus Girls', 'Malayalam Essay',        'Stage 8', 2, '09:00', '30m'),
  ev('Parallel Campus Girls', 'English Essay',          'Stage 8', 2, '10:00', '30m'),
  ev('Parallel Campus Girls', 'Malayalam Story Writing','Stage 8', 2, '11:00', '40m'),
  ev('Parallel Campus Girls', 'English Story Writing',  'Stage 8', 2, '12:00', '40m'),
  ev('Parallel Campus Girls', 'Malayalam Poem Writing', 'Stage 8', 2, '13:00', '40m'),
  ev('Parallel Campus Girls', 'English Poem Writing',   'Stage 8', 2, '14:00', '40m'),
  ev('Parallel Campus Girls', 'Pencil Drawing',         'Stage 8', 2, '09:00', '1hr'),
  ev('Parallel Campus Girls', 'Water Coloring',         'Stage 8', 2, '10:30', '1hr'),
  ev('Parallel Campus Girls', 'Arabic Calligraphy',     'Stage 8', 2, '12:00', '1hr'),
  ev('Parallel Campus Girls', 'Book Test Online',       'Stage 8', 2, '14:00',        { description: 'State Level' }),
  ev('Parallel Campus Girls', 'Quiz Online',            'Stage 8', 2, '15:00',        { description: 'State Level' }),
]

// ─── Sample results ───────────────────────────────────────────────────────────
const SAMPLE_RESULTS = [
  { eventTitle: 'Mappila Paattu', category: 'HS', rank: 1, participantName: 'Fathima Nasrin', sector: 'Feroke',     school: 'GHSS Feroke',          marks: 95, published: true },
  { eventTitle: 'Mappila Paattu', category: 'HS', rank: 2, participantName: 'Amina Beevi',   sector: 'Olavanna',    school: 'GHSS Olavanna',        marks: 91, published: true },
  { eventTitle: 'Mappila Paattu', category: 'HS', rank: 3, participantName: 'Rahmath P',     sector: 'Kadalundi',   school: 'GHSS Kadalundi',       marks: 87, published: true },
  { eventTitle: 'Malayalam Speech', category: 'HS', rank: 1, participantName: 'Arshad K',   sector: 'Nallalam',    school: 'GHSS Nallalam',        marks: 89, published: true },
  { eventTitle: 'Malayalam Speech', category: 'HS', rank: 2, participantName: 'Nishad V',   sector: 'Feroke',      school: 'GHSS Feroke',          marks: 85, published: true },
  { eventTitle: 'Arabic Calligraphy', category: 'HS', rank: 1, participantName: 'Muhammed Faiz', sector: 'Chaliyam',  school: 'GHSS Chaliyam',   marks: 97, published: true },
  { eventTitle: 'Arabic Calligraphy', category: 'HS', rank: 2, participantName: 'Zainab A',      sector: 'Cheruvannur',school: 'GHSS Cheruvannur',marks: 93, published: true },
  { eventTitle: 'Story Writing', category: 'HS', rank: 1, participantName: 'Suhana Firdous', sector: 'Karuvanthiruthi', school: 'GHSS Karuvanthiruthi', marks: 94, published: true },
  { eventTitle: 'Story Writing', category: 'HS', rank: 2, participantName: 'Shiyas M',       sector: 'Ramanattukara',  school: 'GHSS Ramanattukara',   marks: 90, published: true },
  { eventTitle: 'Daff', category: 'General', rank: 1, participantName: 'Team Feroke',         sector: 'Feroke',          school: 'Feroke Unit',           marks: 92, published: true },
  { eventTitle: 'Daff', category: 'General', rank: 2, participantName: 'Team Pantheerankavu', sector: 'Pantheerankavu',  school: 'Pantheerankavu Unit',   marks: 88, published: true },
  { eventTitle: 'Daff', category: 'General', rank: 3, participantName: 'Team Olavanna',       sector: 'Olavanna',        school: 'Olavanna Unit',         marks: 84, published: true },
]

// ─── Clear + seed ─────────────────────────────────────────────────────────────
async function clearCollection(name) {
  const snap = await getDocs(collection(db, name))
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
}

export async function seedDemoData() {
  console.log('Clearing existing data...')
  await Promise.all([clearCollection('events'), clearCollection('results')])

  console.log(`Seeding ${EVENTS.length} events...`)
  for (const e of EVENTS) {
    await addDoc(collection(db, 'events'), { ...e, createdAt: serverTimestamp() })
  }

  console.log(`Seeding ${SAMPLE_RESULTS.length} sample results...`)
  for (const r of SAMPLE_RESULTS) {
    await addDoc(collection(db, 'results'), { ...r, createdAt: serverTimestamp() })
  }

  console.log('Done!')
}

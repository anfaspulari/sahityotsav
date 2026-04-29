# Feroke Division Sahityotsav 2026

A modern web app for **Feroke Division Sahityotsav 2026** — celebrating Literature, Arts & Culture across Feroke Division, Kerala.

## Tech Stack

- **React** + **Vite**
- **Tailwind CSS v3**
- **Firebase Firestore**
- **React Router v6**

## Features

- **Homepage** — Hero banner, event stats, category highlights
- **Event Schedule** — Filter by sector, category, and date; grouped card layout
- **Results** — Event-wise winners with rank cards + sector leaderboard (tabbed)
- **Admin Panel** — Password-protected CRUD for events and results; seed demo data

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a Firebase project, enable **Firestore**, and copy your config:
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase credentials in `.env`.

3. Set your admin password (default: `admin2026`):
   ```env
   VITE_ADMIN_PASSWORD=your_password
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Visit `/admin`, log in, and click **Seed Demo Data** to populate sample events and results.

## Project Structure

```
src/
├── firebase/        # Firestore helpers (events, results, seed)
├── components/      # Navbar, EventCard, ResultCard, SectorLeaderboard, ...
├── pages/           # Home, Schedule, Results, Admin
├── App.jsx          # Router and layout
└── main.jsx         # Entry point
```

## Scoring

| Rank | Points |
|------|--------|
| 1st  | 5 pts  |
| 2nd  | 3 pts  |
| 3rd  | 1 pt   |

Sector leaderboard is computed in real-time from published results.

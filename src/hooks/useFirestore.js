import { useEffect, useState, useRef } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

function useCollection(col, ...constraints) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const unsubRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      const q = query(collection(db, col), ...constraints)
      unsubRef.current = onSnapshot(
        q,
        (snap) => {
          setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
          setLoading(false)
        },
        (err) => {
          console.error(`useCollection(${col}):`, err)
          setError(err.message)
          setLoading(false)
        }
      )
    } catch (err) {
      console.error(`useCollection(${col}) setup:`, err)
      setError(err.message)
      setLoading(false)
    }

    return () => unsubRef.current?.()
  }, [col]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error }
}

export function useEvents() {
  const { data, loading, error } = useCollection('events', orderBy('date', 'asc'))
  // Secondary sort by time client-side to avoid composite index
  const sorted = [...data].sort((a, b) => {
    if (a.date !== b.date) return a.date?.localeCompare(b.date)
    return (a.time || '').localeCompare(b.time || '')
  })
  return { events: sorted, loading, error }
}

export function useResults() {
  const { data, loading, error } = useCollection('results', orderBy('eventTitle', 'asc'))
  return { results: data, loading, error }
}

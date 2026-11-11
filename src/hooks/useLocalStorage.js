import { useEffect, useState } from 'react'

// Step 1: a custom hook. Same shape as useState, but the value survives a page refresh.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (!key) return initialValue // no key? just use the initial value
    try {
        const saved = localStorage.getItem(key)
        return saved !== null ? JSON.parse(saved) : initialValue
    } catch (err) {
        console.error(`Error reading localStorage key "${key}":`, err)
        return initialValue
    }
  })

  //save to localStorage when value or key changes
  useEffect(() => {
    if (!key) return // no key? do nothing
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
        console.error(`Error setting localStorage key "${key}":`, err)
    }
  }, [key, value])
  return [value, setValue]
}
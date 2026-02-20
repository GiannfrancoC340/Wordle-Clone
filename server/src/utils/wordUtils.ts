import { words } from '../data/words'

// imports the words list
// creates logic to get which word for each day
export const getDailyWord = (): string => {
  const start = new Date('2025-01-01')
  const today = new Date()
  const dayIndex = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return words[dayIndex % words.length] ?? 'crane'
}
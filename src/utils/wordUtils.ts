import type { Tile, TileState } from '../types'

// connect to backend
const API_URL = 'http://localhost:3001/api/daily-word'

// makes the API call to your Express server and 
// returns the word in uppercase so all your game logic can work in uppercase consistently.
export const fetchDailyWord = async (): Promise<string> => {
  const response = await fetch(API_URL)
  const data = await response.json() as { word: string }
  return data.word.toUpperCase()
}

// the most important function. It uses a two pass approach to handle duplicate letters correctly. 
// The first pass marks all correct (green) tiles and "crosses out" those letters from both the guess and solution so they can't be matched again. 
// The second pass then looks for present (yellow) tiles from what's remaining.
export const evaluateGuess = (guess: string, solution: string): Tile[] => {
  const result: Tile[] = Array.from({ length: 5 }, (_, i) => ({
    letter: guess[i] ?? '',
    state: 'absent' as TileState
  }))

  const solutionLetters = solution.split('')
  const guessLetters = guess.split('')

  // First pass: mark correct letters (green)
  guessLetters.forEach((letter, i) => {
    if (letter === solutionLetters[i]) {
      result[i]!.state = 'correct'
      solutionLetters[i] = '#'
      guessLetters[i] = '*'
    }
  })

  // Second pass: mark present letters (yellow)
  guessLetters.forEach((letter, i) => {
    if (letter === '*') return
    const foundIndex = solutionLetters.indexOf(letter)
    if (foundIndex !== -1) {
      result[i]!.state = 'present'
      solutionLetters[foundIndex] = '#'
    }
  })

  return result
}

// checks if the guessed word exists in your valid words list before accepting the submission.
export const isValidWord = (word: string, validWords: string[]): boolean => {
  return validWords.includes(word.toLowerCase())
}
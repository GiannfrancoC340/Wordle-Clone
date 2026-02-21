import { useState, useEffect } from 'react'
import type { GameState, GuessRow, Tile } from '../types'
import { fetchDailyWord, evaluateGuess, isValidWord } from '../utils/wordUtils'

const WORD_LENGTH = 5
const MAX_GUESSES = 6

// builds the board
const createEmptyRow = (): GuessRow => ({
  tiles: Array.from({ length: WORD_LENGTH }, () => ({
    letter: '',
    state: 'empty'
  })),
  isSubmitted: false
})

// creates an empty board
const createInitialState = (solution: string): GameState => ({
  board: Array.from({ length: MAX_GUESSES }, createEmptyRow),
  currentRow: 0,
  currentCol: 0,
  gameStatus: 'playing',
  solution
})

// main function that holds the game logic
export const useWordle = (validWords: string[]) => {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // runs once when the hook mounts, fetches today's word from your server, and initializes the game state. 
  // It also handles loading and error states during the fetch.
  useEffect(() => {
    const initGame = async () => {
      try {
        const word = await fetchDailyWord()
        setGameState(createInitialState(word)) // sets the game to a fresh blank board with the fetched solution. This happens once on mount via useEffect.
      } catch (err) {
        setError('Failed to fetch daily word. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    initGame()
  }, [])

  // places a letter on the current tile and advances the column. 
  // It guards against adding letters when the row is full or the game is over.
  const addLetter = (letter: string) => {
    if (!gameState || gameState.gameStatus !== 'playing') return
    if (gameState.currentCol >= WORD_LENGTH) return

    // used to update the existing state incrementally.
    setGameState(prev => {
      if (!prev) return prev
      const newBoard = prev.board.map(row => ({ ...row, tiles: [...row.tiles.map(tile => ({ ...tile }))] }))
      newBoard[prev.currentRow]!.tiles[prev.currentCol]!.letter = letter
      newBoard[prev.currentRow]!.tiles[prev.currentCol]!.state = 'filled'
      return { ...prev, board: newBoard, currentCol: prev.currentCol + 1 }
    })
  }

  // is the backspace handler — clears the last letter and moves the column back.
  const removeLetter = () => {
    if (!gameState || gameState.gameStatus !== 'playing') return
    if (gameState.currentCol <= 0) return

    setGameState(prev => {
      if (!prev) return prev
      const newBoard = prev.board.map(row => ({ ...row, tiles: [...row.tiles.map(tile => ({ ...tile }))] }))
      newBoard[prev.currentRow]!.tiles[prev.currentCol - 1]!.letter = ''
      return { ...prev, board: newBoard, currentCol: prev.currentCol - 1 }
    })
  }

  // It builds the current guess string, validates it against the word list, evaluates it against the solution, 
  // updates the board with the evaluated tiles, and determines if the game is now won or lost.
  const submitGuess = () => {
    if (!gameState || gameState.gameStatus !== 'playing') return
    if (gameState.currentCol < WORD_LENGTH) return

    const currentGuess = gameState.board[gameState.currentRow]!.tiles
      .map(tile => tile.letter)
      .join('')

    if (!isValidWord(currentGuess, validWords)) {
      setError('Not a valid word!')
      setTimeout(() => setError(null), 2000)
      return
    }

    const evaluatedTiles: Tile[] = evaluateGuess(currentGuess, gameState.solution)
    const isWon = evaluatedTiles.every(tile => tile.state === 'correct')
    const isLastRow = gameState.currentRow === MAX_GUESSES - 1

    setGameState(prev => {
      if (!prev) return prev
      const newBoard = prev.board.map(row => ({ ...row, tiles: [...row.tiles.map(tile => ({ ...tile }))] }))
      newBoard[prev.currentRow]!.tiles = evaluatedTiles
      newBoard[prev.currentRow]!.isSubmitted = true
      return {
        ...prev,
        board: newBoard,
        currentRow: prev.currentRow + 1,
        currentCol: 0,
        gameStatus: isWon ? 'won' : isLastRow ? 'lost' : 'playing'
      }
    })
  }

  return { gameState, error, isLoading, addLetter, removeLetter, submitGuess }
}
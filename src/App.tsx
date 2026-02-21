import { useEffect, useCallback } from 'react'
import { useWordle } from './hooks/useWordle'
import Board from './components/Board/Board'
import Keyboard from './components/Keyboard/Keyboard'
import Modal from './components/Modal/Modal'
import './App.css'

const VALID_WORDS = ['crane', 'apple', 'flint', 'globe', 'haunt', 'brave', 'chess', 'dwarf', 'elder', 'frost']

function App() {
  const { gameState, error, isLoading, addLetter, removeLetter, submitGuess } = useWordle(VALID_WORDS)

  // function listens for keyboard input and maps it to the right game action.
  // useCallback wraps handleKeyDown to prevent it from being recreated on every render. 
  // This is important because it's used as a dependency in the useEffect below it — without useCallback the effect would re-run constantly.
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!gameState || gameState.gameStatus !== 'playing') return

    if (e.key === 'Enter') {
      submitGuess()
    } else if (e.key === 'Backspace') {
      removeLetter()
    } else if (/^[a-zA-Z]$/.test(e.key)) { // ensures only single letter keys trigger addLetter, filtering out things like arrow keys or shift.
      addLetter(e.key.toUpperCase())
    }
  }, [gameState, addLetter, removeLetter, submitGuess])

  // useEffect adds a keydown listener to the window so the physical keyboard works. 
  // it lets you run code that interacts with something outside of React — in this case the browser's window object.
  // The return () => window.removeEventListener(...) is a cleanup function that removes the listener when the component unmounts, preventing memory leaks.
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  if (!gameState) {
    return <div className="error">Failed to load game. Please refresh.</div>
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Wordle Clone</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <main className="main">
        <Board board={gameState.board} />
        <Keyboard
          board={gameState.board}
          onLetter={addLetter}
          onEnter={submitGuess}
          onDelete={removeLetter}
        />
      </main>

      <Modal
        gameStatus={gameState.gameStatus}
        solution={gameState.solution}
        onClose={() => window.location.reload()} // simple way to reset the game for now — a full page reload fetches a fresh daily word and resets all state.
      />
    </div>
  )
}

export default App
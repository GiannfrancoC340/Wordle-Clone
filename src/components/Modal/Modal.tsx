import type { GameStatus } from '../../types'
import styles from './Modal.module.css'

interface ModalProps {
  gameStatus: GameStatus
  solution: string
  onClose: () => void
}

// function to create the modal popup
function Modal({ gameStatus, solution, onClose }: ModalProps) { // onClose passed from App.tsx
  if (gameStatus === 'playing') return null // modal simply renders nothing while the game is in progress and only appears when the game ends.

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}> 
        {gameStatus === 'won' ? (
          <>
            <h2 className={styles.title}>You Won! 🎉</h2>
            <p className={styles.message}>Great job, you guessed the word!</p>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Game Over</h2>
            <p className={styles.message}>
              The word was <span className={styles.solution}>{solution}</span>
            </p>
          </>
        )}
        <button className={styles.closeButton} onClick={onClose}>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default Modal
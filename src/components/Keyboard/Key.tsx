import type { TileState } from '../../types'
import styles from './Keyboard.module.css'

interface KeyProps {
  label: string
  state: TileState
  onClick: () => void
  isWide?: boolean
}

function Key({ label, state, onClick, isWide }: KeyProps) {
  return (
    <button
      className={`${styles.key} ${styles[state]} ${isWide ? styles.wide : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Key
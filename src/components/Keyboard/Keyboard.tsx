import type { GuessRow as GuessRowType, TileState } from '../../types'
import Key from './Key'
import styles from './Keyboard.module.css'

interface KeyboardProps {
  board: GuessRowType[]
  onLetter: (letter: string) => void
  onEnter: () => void
  onDelete: () => void
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
]

// It looks through all submitted rows and finds the best state for each letter. 
// The priority is correct > present > absent > empty — so if you guessed a letter and got green somewhere, 
// the key stays green even if you also guessed it elsewhere and got gray.
const getKeyState = (letter: string, board: GuessRowType[]): TileState => {
    const statePriority: Record<TileState, number> = {
      correct: 3,
      present: 2,
      absent: 1,
      filled: 0,
      empty: 0
    }
  
    let best: TileState = 'empty'
  
    for (const row of board) {
      if (!row.isSubmitted) continue
      for (const tile of row.tiles) {
        if (tile.letter !== letter) continue
        if (statePriority[tile.state] > statePriority[best]) {
          best = tile.state
        }
      }
    }
  
    return best
  }

function Keyboard({ board, onLetter, onEnter, onDelete }: KeyboardProps) {
  return (
    <div className={styles.keyboard}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.keyRow}>
          {row.map(key => (
            <Key
              key={key}
              label={key}
              state={getKeyState(key, board)} // receives the full board rather than a pre-computed map, keeping the component's interface simple — it figures out what it needs internally.
              isWide={key === 'ENTER' || key === '⌫'} // an optional boolean prop (notice the ? in isWide?: boolean) that gives ENTER and ⌫ a wider button since they're special keys.
              onClick={() => {
                if (key === 'ENTER') onEnter()
                else if (key === '⌫') onDelete()
                else onLetter(key)
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Keyboard
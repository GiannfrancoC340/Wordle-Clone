import type { GuessRow as GuessRowType } from '../../types'
import Tile from '../Tile/Tile'
import styles from './Board.module.css'

interface BoardProps {
  board: GuessRowType[]
}

// structure of the board
function Board({ board }: BoardProps) {
  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) => ( // iterates over each row
        <div key={rowIndex} className={styles.row}>
          {row.tiles.map((tile, tileIndex) => ( // iterates over each tile in that row — so it's a nested map producing a 6×5 grid.
            <Tile key={tileIndex} tile={tile} /> // helps React efficiently track which items changed.
          ))}
        </div>
      ))}
    </div>
  )
}

export default Board
import type { Tile as TileType } from '../../types'
import styles from './Tile.module.css'

interface TileProps { // defining shape of the props it expects to receive
  tile: TileType
}

function Tile({ tile }: TileProps) { // JS destructuring and type annotation
  return (
    <div className={`${styles.tile} ${styles[tile.state]}`}>
      {tile.letter}
    </div>
  )
}

export default Tile
import type { Tile as TileType } from '../../types'
import styles from './Tile.module.css'

interface TileProps { // defining shape of the props it expects to receive
  tile: TileType
  tileIndex: number
}

function Tile({ tile, tileIndex }: TileProps) { // JS destructuring and type annotation
  const animationDelay = tile.state !== 'empty' && tile.state !== 'filled'
    ? `${tileIndex * 300}ms`
    : '0ms'

  return (
    <div
      className={`${styles.tile} ${styles[tile.state]}`}
      style={{ animationDelay }}
    >
      {tile.letter}
    </div>
  )
}

export default Tile
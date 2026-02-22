import { useState, useEffect } from 'react'
import type { Tile as TileType } from '../../types'
import styles from './Tile.module.css'

interface TileProps { // defining shape of the props it expects to receive
  tile: TileType
  tileIndex: number
}

function Tile({ tile, tileIndex }: TileProps) { // JS destructuring and type annotation
  const [revealedState, setRevealedState] = useState(tile.state)
  const isSubmitted = tile.state !== 'empty' && tile.state !== 'filled'
  const delay = tileIndex * 400

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setRevealedState(tile.state)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      setRevealedState(tile.state)
    }
  }, [tile.state, isSubmitted, delay])

  return (
    <div
      className={`${styles.tile} ${styles[revealedState]} ${isSubmitted ? styles.flip : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {tile.letter}
    </div>
  )
}

export default Tile
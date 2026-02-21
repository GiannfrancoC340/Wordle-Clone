// the four possible states a tile can be in at any point
export type TileState = 'correct' | 'present' | 'absent' | 'empty' | 'filled'

// whether the game is in progress, won, or lost
export type GameStatus = 'playing' | 'won' | 'lost'

// a single tile with a letter and its current state
export interface Tile {
  letter: string
  state: TileState
}

// a row of 6 tiles with a flag for whether it's been submitted
export interface GuessRow {
  tiles: Tile[]
  isSubmitted: boolean
}

// the entire game state in one place, everything the game needs to know at any moment
export interface GameState {
  board: GuessRow[]
  currentRow: number
  currentCol: number
  gameStatus: GameStatus
  solution: string
}
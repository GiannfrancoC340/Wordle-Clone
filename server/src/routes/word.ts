import { Router } from 'express'
import { getDailyWord } from '../utils/wordUtils'

const router = Router()

// gets daily word from wordUtils.ts
// sends result back to whoever called the endpoint
router.get('/daily-word', (req, res) => {
  const word = getDailyWord()
  res.json({ word })
})

export default router
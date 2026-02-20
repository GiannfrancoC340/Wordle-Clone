import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import wordRouter from './routes/word'

dotenv.config() // loads the .env file early so process.env.PORT is available

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors()) // allows the React frontend to make requests to this server without being blocked
app.use(express.json()) // lets Express parse incoming JSON request bodies

app.use('/api', wordRouter) // mounts your word route, so the full path becomes /api/daily-word

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
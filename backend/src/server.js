import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from "../routes/authRoutes.js"
import formsRouter from "../routes/formRouter.js"
import resumeRouter from "../routes/resumeRouter.js"
import groqRouter from "../routes/GroqRouter.js"

const app=express()

dotenv.config()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth',authRouter)
app.use('/api/dashboard', formsRouter)
app.use('/api/resume',resumeRouter)
app.use('/api/ai',groqRouter)
 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}).on('error', (err) => {
  console.error('Failed to start server:', err)
}) 
import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from "../routes/authRoutes.js"
import formsRouter from "../routes/formRouter.js"

const app=express()
const PORT=3000

app.use(cors())
app.use(express.json())

app.use('/api/auth',authRouter)
app.use('/api/dashboard', formsRouter)
 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('Failed to start server:', err)
}) 
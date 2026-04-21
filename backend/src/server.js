import express from "express"
import formsRouter from "../routes/formRouter.js"

const app=express()
const PORT=3000

app.use(express.json())

app.use('/api/dashboard', formsRouter)
 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('Failed to start server:', err)
}) 
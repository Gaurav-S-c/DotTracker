import express from "express"
import formsRouter from "./routes/formRouter"

const app=express()
const PORT=3000

app.use(express.static('public'))

app.use('/api/dashboard', formsRouter)
 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('Failed to start server:', err)
}) 
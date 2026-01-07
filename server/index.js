import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import visitorRoutes from './routes/visitorRoutes.js'
import siteRoutes from './routes/siteRoutes.js'
import authRoutes from './routes/auth.js'
import { corsOptions } from './config/corsOptions.js'
import connectDB from './config/dbConn.js'
import mongoose from 'mongoose'
const PORT = 3500

const app = express()

connectDB()

app.use(cors(corsOptions))

app.use(express.json())

app.get('/', (req, res) => res.json({success: 'Umefika kwa mabeast sasa, bro.'}))

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/visitors', visitorRoutes)
app.use('/sites', siteRoutes)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB.')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
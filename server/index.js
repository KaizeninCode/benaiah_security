import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import visitorRoutes from './routes/visitorRoutes.js'
import siteRoutes from './routes/siteRoutes.js'
import guardRoutes from './routes/guardRoutes.js'
import gateRoutes from './routes/gateRoutes.js'
import guardAssignmentRoutes from './routes/guardAssignmentRoutes.js'
import authRoutes from './routes/auth.js'
import { corsOptions } from './config/corsOptions.js'
import connectDB from './config/dbConn.js'
import mongoose from 'mongoose'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
        title: 'Benaiah Security API',
      version: '1.0.0',
      description: 'API documentation',
    },
  },
  apis: ['./routes/*.js'], // Path to your route files for JSDoc comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


const PORT = 3500
const app = express()

connectDB()

app.use(cors(corsOptions))

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.json({success: 'Umefika kwa mabeast sasa, bro.'}))

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/visitors', visitorRoutes)
app.use('/sites', siteRoutes)
app.use('/gates', gateRoutes)
app.use('/guards', guardRoutes)
app.use('/guardAssignments', guardAssignmentRoutes)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB.')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
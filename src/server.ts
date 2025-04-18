import dotenv from 'dotenv'
dotenv.config()

import app from './app/app'
import { connectDB } from '@config/db'

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
        console.log(`server running on http://localhost:${PORT}`)
        })
    } catch (err) {
        console.error('Failed to start server', err)
    }
    
}

startServer()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from '@modules/auth/auth.route' //importing '/register', '/login' routes

const app = express()

app.use(cors({
    origin: 'http://localhost:3000', //frontend origin
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend running!' });
})

app.use('/api/auth', authRoutes) //mounts routes to 'POST api/auth/register | login', frontend can call those routes now

export default app


import{ PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log('Database connected')
    }
    catch (err) {
        console.error('DB connection failed', err)
        process.exit(1)
    }
}

export default prisma
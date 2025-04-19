import bcrypt from 'bcryptjs'
import prisma from '@config/db'

import { SignUpInput } from './auth.validation'
import { generateTokens } from '@utils/token'

//User Registration
export const registerUser =  async (data : SignUpInput) => {
    const { name, email, password, role } = data   // processes SignUpInput to be used

    const existingUser = await prisma.user.findUnique({ where: { email: email } }); //if found,craeates existingUser object (user.id, user.email, user.isBanned and the rest of data in the corresponding row of user entry in the DB User table, existingUser = null otherwise)

    if (existingUser) throw new Error('Email already registered')


    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
    })

    const tokens = generateTokens(user)

    return { user, tokens }
}

//User Login
export const loginUser = async (email: string, password: string) => {

    const user = await prisma.user.findUnique({where: { email: email }}) //if found,craeates user object (user.id, user.email., user.isBanned and the rest of data in the corresponding row of user entry in the DB User table, user = null otherwise)


    if (!user || user.isBanned) 
        throw new Error(!user ? 'User not found' : 'Your account has been banned. Please contact support')  //'!user ?' is a ternary operator. ie, 'conditon ? valureIfTrue : valueIfFalse'

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Invalid password')

    const tokens = generateTokens(user) //generated tokens based on user.id and user.role

    return { user, tokens}


}
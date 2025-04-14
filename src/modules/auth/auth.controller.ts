//Handles User Creation and Login
 
import { Request, Response } from 'express';
import { registerUser, loginUser } from './auth.service'

//Registration Controller
export const register = async (req: Request, res: Response) => {
    try {
        const { user, tokens } = await registerUser(req.body) //tries to register the user using req.body: all form data from frontend. on success, user object and tokens are generatad as output of the registerUser function

        res
          .cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true, //js can't access the cookie
            sameSite: 'lax', //same-origin and simple cross-origin request
            secure: process.env.NODE_ENV === 'production',//cookies only sent over HTTPS in production environment
            maxAge: 7 * 24 * 60 * 60 * 1000 //7 days

          })

          .status(201) //Created
          .json({ user, accessToken: tokens.accessToken })
    } catch (err: any) {
        res.status(400).json({ message: err.message }) //Bad Request
    }
} 

//Login Controller
export const login = async (req: Request, res: Response) => {
    try {
        const { user, tokens } = await loginUser(req.body.email, req.body.password) //tries to login the user using email and password and creates user object and token

        res
           .cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
           })
           .status(200) //OK
           .json({ user, accessToken: tokens.accessToken })  
    } catch (err: any) {
        res.status(401).json({ message: err.message }) //Unauthorized
    }
}



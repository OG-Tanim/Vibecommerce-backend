import { z } from 'zod'

export const SignUPSchema = z.object({
    name     : z.string(),
    email    : z.string().email(),
    password : z.string().min(6),
    role     : z.enum([ 'ADMIN', 'BUYER', 'SELLER']),
})

export type SignUpInput = z.infer <typeof SignUPSchema> 
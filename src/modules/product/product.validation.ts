import { z } from 'zod'

export const CreateProductSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1),
    price: z.number().int().positive(),
    category: z.string().min(1), 
})
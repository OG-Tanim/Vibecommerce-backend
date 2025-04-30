import { z } from 'zod'

export const OrderSchema = z.object({
    shippingInfo : z.string().min(1),
    paymentMethod: z.enum(['CASH_ON_DELIVERY', 'BKASH']),
    items: z.array(z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
    })) 
})

const statuses = z.enum([
    'PENDING',
    'PROCESSING',
    'OUT_FOR_DELIVERY',
    'COMPLETED',
    'CANCELLED',
    'REJECTED',
])

export const UpdateStatusSchema = z.object({
    status: statuses,
})
import { AuthenticatedRequest } from "@middleware/auth"
import {
    createOrder,
    getOrder,
    updateStatus 
    } from './order.service' 
import { Response } from 'express'
import { OrderSchema } from "./order.validation"
import prisma from '@config/db'


export const createBuyerOrder  = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const validatedData = OrderSchema.parse(req.body) //validating the input data throgh Zod

        const buyerId = req.user!.id

        const { items, paymentMethod, shippingInfo } = validatedData

        if(!items || !paymentMethod || !shippingInfo) {
            res.status(400).json({ message: 'Missing required fields'})
            return
        }

        const order = await createOrder(buyerId, {
            items, 
            paymentMethod, 
            shippingInfo
        })

        res.status(201).json({ message: 'Order createad successfully', order})

    } catch (err: any) {

        console.error('Error creating order', err)
        
        res.status(500).json({ message: err.message || 'internal server error'})
    }
}

export const getBuyerOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const buyerId = req.user!.id

        const orders = await getOrder({ buyerId })

        res.status(200).json({messaeg: 'Orders fetched successfully', orders})


    } catch (err:any) {
        console.error('Error fetching buyer order', err)
        res.status(500).json({ message: err.message || 'Internal Server Error' })
    }
}

export const getSellerOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try{
        const sellerId = req.user!.id
        const orders = await getOrder({ sellerId })
        res.status(200).json ({ message: 'Orders fetched successfully', orders })

    }catch (err: any) {
        console.error('Error fetching data from server', err)
        res.status(500).json({ message: err.message || 'Internal Server Error'})
    }
}

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const sellerId = req.user!.id
        const orderId = req.params.id
        const { status } = req.body 


        // Note: The parameter order needs to match the function definition
        const order = await updateStatus(orderId, sellerId, status)
        res.status(200).json({ message: 'Status Updated', order})

    } catch (err: any) {
        console.error('Error updating order status', err)
        res.status(500).json({ message: err.message || 'Internal Server Error' })
    }
}
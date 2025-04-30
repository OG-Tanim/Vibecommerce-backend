import { AuthenticatedRequest } from "@middleware/auth"
import {
    createOrder,
    getOrder,
    updateStatus 
    } from './order.service' 
import { Request, Response } from 'express'
import { OrderSchema } from "./order.validation"
import prisma from '@config/db'
import { BkashService } from "services/bkash.service"; // Corrected import

export const createBuyerOrder  = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const validatedData = OrderSchema.parse(req.body); //validating the input data throgh Zod

        const buyerId = req.user!.id;

        const { items, paymentMethod, shippingInfo } = validatedData;

        if(!items || !paymentMethod || !shippingInfo) {
            res.status(400).json({ message: 'Missing required fields'});
            return;
        }

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create the order first (status will be PENDING by default)
        const order = await createOrder(buyerId, {
            items,
            paymentMethod,
            shippingInfo,
        });

        // Triggering Bkash Payment if method is BKASH
        if (paymentMethod === 'BKASH') {
            const callbackURL = `${req.protocol}://${req.get('host')}/api/orders/bkash/callback`; //the URL bkash will use to callback after pyment creation 
      
            const payment = await BkashService.createPayment(
              totalAmount,
              order.id,
              'sale',
              callbackURL
            );
      
            if (!payment || !payment.paymentID) {
              throw new Error('Bkash payment creation failed');
            }
      
            await prisma.order.update({
              where: { id: order.id },
              data: {
                paymentId: payment.paymentID,
                status: 'PENDING', // Optional: explicitly mark as pending
              },
            });

            // Return the bKash URL to the frontend for redirection
            res.status(201).json({
                message: 'Order created successfully. Redirect to bKash.',
                orderId: order.id, // Return order ID
                bkashURL: payment.bkashURL // Return the bKash redirect URL to be used by the frontend
            });

        } else {
            // For non-BKASH payments, return the created order directly
            res.status(201).json({ message: 'Order created successfully', order});
        }

    } catch (err: any) {
        console.error('Error creating order or initiating bKash payment', err); // More specific logging
        res.status(500).json({ message: err.message || 'Internal server error'});
    }
};

// Callback route will be called by bKash after the user completes the payment on their page
interface BkashCallbackQuery {
    paymentID?: string;
    status?: string;
}

export const handleBkashCallback = async (
    req: Request<any, any, any, BkashCallbackQuery>,
    res: Response
  ): Promise<void> => {
    try {
      const { paymentID, status } = req.query;
  
      console.log(`[Bkash Callback] paymentID: ${paymentID}, status: ${status}`);
  
      if (status === 'success' && paymentID) {
        const executionResult = await BkashService.executePayment(paymentID);
  
        if (executionResult.transactionStatus === 'Completed') {
          const order = await prisma.order.findUnique({ where: { paymentId: paymentID } });
  
          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: 'PROCESSING',
                paymentStatus: 'PAID',
                transactionId: executionResult.trxID,
                paymentExecutedAt: new Date(executionResult.paymentExecuteTime),
              },
            });
  
            res.redirect(`/order-success?orderId=${order.id}`);

          } else {

            console.warn(`[Bkash Callback] No order found for paymentID: ${paymentID}`);
            res.redirect(`/payment-failed?message=Order not found`);
          }

        } else {

          res.redirect(`/payment-failed?paymentId=${paymentID}&status=${executionResult.transactionStatus}`);
        }

      } else {

        res.redirect(`/payment-failed?paymentId=${paymentID}&status=${status}`);
      }
  
    } catch (err: any) {
      console.error('[Bkash Callback] Error executing or confirming payment:', err);
      res.redirect('/payment-failed?message=Internal server error');
    }
};

export const getBuyerOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const buyerId = req.user!.id;

        const orders = await getOrder({ buyerId });

        res.status(200).json({message: 'Orders fetched successfully', orders});


    } catch (err:any) {
        console.error('Error fetching buyer order', err);
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
};

export const getSellerOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try{
        const sellerId = req.user!.id;
        const orders = await getOrder({ sellerId });
        res.status(200).json ({ message: 'Orders fetched successfully', orders });

    }catch (err: any) {
        console.error('Error fetching data from server', err);
        res.status(500).json({ message: err.message || 'Internal Server Error'});
    }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const sellerId = req.user!.id;
        const orderId = req.params.id;
        const { status } = req.body;


        // Note: The parameter order needs to match the function definition
        const order = await updateStatus(orderId, sellerId, status);
        res.status(200).json({ message: 'Status Updated', order});

    } catch (err: any) {
        console.error('Error updating order status', err);
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
};

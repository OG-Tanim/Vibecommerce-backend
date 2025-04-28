import prisma from '@config/db';
import { OrderStatus, Prisma } from '@prisma/client'; // Merged Prisma import
import { allowedTransitions } from '@utils/orderStatusTransitions';
import { MailService } from '@utils/mail.service'; // Keep MailService import

interface OrderItemInput {
    productId: string,
    quantity: number,
    price: number,
}

interface OrderInput {
    items: OrderItemInput[];
    shippingInfo: string;
    paymentMethod: 'CASH_ON_DELIVERY' | 'BKASH',
}

export const createOrder = async (buyerId: string, data: OrderInput) => {

    if (!data.items.length) throw new Error('No items in order');

    const totalAmount = data.items.reduce((sum, item) => {
        return sum + item.price * item.quantity
    }, 0);

    // Create the order and include necessary details for email sending
    const createdOrder = await prisma.order.create({
        data: {
            buyerId,
            shippingInfo : data.shippingInfo,
            paymentMethod : data.paymentMethod,
            totalAmount,
            items: {
                create: data.items.map(item => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                })),
            },
        },
        include: { // Include details needed for email notifications
            items: {
                include: {
                    product: {
                        include: {
                            seller: true // Include seller details
                        }
                    }
                }
            },
            buyer: true // Include buyer details if needed later
        }
    });

    // --- Send email notifications after order creation ---
    try {
        const sellersToNotify: { [sellerId: string]: { email: string; name: string; products: string[] } } = {};

        // Group items by seller
        createdOrder.items.forEach(item => {
            // Ensure product and seller exist before accessing properties
            if (item.product && item.product.seller && item.product.seller.email) {
                const seller = item.product.seller;
                if (!sellersToNotify[seller.id]) {
                    sellersToNotify[seller.id] = { email: seller.email, name: seller.name || 'Seller', products: [] }; // Provide default name if null
                }
                sellersToNotify[seller.id].products.push(item.product.title || 'Unknown Product'); // Provide default title if null
            }
        });

        // Send one email per seller
        for (const sellerId in sellersToNotify) {
            const sellerInfo = sellersToNotify[sellerId];
            const productList = sellerInfo.products.join(', ');
            console.log(`Attempting to send email to seller: ${sellerInfo.email} for Order ID: ${createdOrder.id}`); // Added logging
            await MailService.sendMail({
                to: sellerInfo.email,
                subject: `New Order Received! (Order ID: ${createdOrder.id})`,
                html: `
                    <p>Hi ${sellerInfo.name},</p>
                    <p>You have received a new order containing the following product(s): <b>${productList}</b>.</p>
                    <p>Order ID: ${createdOrder.id}</p>
                    <p>Please check your seller dashboard for more details.</p>
                `,
            });
            console.log(`Email sent successfully to: ${sellerInfo.email} for Order ID: ${createdOrder.id}`); // Added logging
        }
    } catch (emailError) {
        console.error(`Failed to send order notification email for Order ID ${createdOrder.id}:`, emailError);
        // Do not throw error here, allow order creation to succeed even if email fails
    }
    // -----------------------------------------------------

    return createdOrder; // Return the created order object
};

export const getOrder = async (params: {
    buyerId?: string, 
    sellerId?: string
}) => {
    const { buyerId, sellerId } = params

    if (!buyerId && !sellerId) {
        throw new Error('Either buyer or seller id must be provided')
    }
    if (buyerId) {
        const orders = await prisma.order.findMany({
            where: { buyerId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })
    
        return orders
    } 

    //if sellerId is present

    return await prisma.order.findMany({
        where:{
            items:{
                some: { 
                    product: {
                        sellerId
                    }
                }
            }
        }, 
        
        //here 'some' is used to  only the seller's products will apear, even the order contains products form other sellers

        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    }) 
}


export const updateStatus = async (
    orderId: string,
    sellerId: string,
    status: 'PENDING' | 'PROCESSING' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'
) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: { product: true }
            } //fetching upto the product to get the sellerId of that product 
        }
    })

    if (!order) throw new Error('Order not found')

    const isSellerProduct = order.items.some(item => item.product.sellerId == sellerId)

    if (!isSellerProduct) throw new Error('Not Authorized to update this order')

    const currentStatus = order.status
    const validatedNextStatuses = allowedTransitions[currentStatus]

    if (!validatedNextStatuses?.includes(status)) {
        throw new Error(`Cannot change status form ${currentStatus} to ${status}`)
    }

    return await prisma.order.update({
        where: { id: orderId },
        data : { status }
    })
}

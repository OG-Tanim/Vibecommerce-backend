import prisma from '@config/db'

interface OrderItemInput {
    productId: string,
    quantity: number,
    price: number,
}

interface OrderInput {
    items: OrderItemInput[];
    shippingInfo: string;
    paymentMethod: 'CASH_ON_DELIVERY' | 'BKASH'
}

export const createOrder = async (buyerId: string, data: OrderInput) => {

    if (!data.items.length) throw new Error('No items in order')
    
    return await prisma.order.create({
        data: {
            buyerId,
            shippingInfo : data.shippingInfo,
            paymentMethod : data.paymentMethod,
            items: {
                create: data.items.map(item => ({ 
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                }) // nested create here creates Order Item table from order table wheren items: OrderItems[]
              ),
            }, 
        }, 

        include: { items: true}, // includes the OrderItem data too when fetching Order data 
    })
} 

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

    return await prisma.order.update({
        where: { id: orderId },
        data : { status }
    })
}


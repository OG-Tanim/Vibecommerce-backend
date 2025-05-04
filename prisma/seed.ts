import { PrismaClient, Role, OrderStatus, PaymentMethod } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Helper function to generate a random date in the past (for createdAt timestamps)
function getRandomPastDate(daysAgo = 365) {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * daysAgo));
  return pastDate;
}

// Helper function to generate a random future date (for discount expirations)
function getRandomFutureDate(daysAhead = 30) {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(
    today.getDate() + Math.floor(Math.random() * daysAhead) + 1
  );
  return futureDate;
}

// Helper function to create random discount price (70-90% of original price)
function getDiscountPrice(originalPrice: number): number {
  const discountFactor = faker.number.float({
    min: 0.7,
    max: 0.9,
  });
  return Number((originalPrice * discountFactor).toFixed(2));
}

async function main() {
  console.log("Seeding database...");

  // await prisma.review.deleteMany({});
  // await prisma.orderItem.deleteMany({});
  // await prisma.order.deleteMany({});
  // await prisma.product.deleteMany({});
  // await prisma.user.deleteMany({});

  // Create users with different roles
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.ADMIN,
      createdAt: getRandomPastDate(365),
      updatedAt: new Date(),
    },
  });
  console.log("Created admin user:", admin.email);

  // Create 5 sellers
  const sellers = [];
  for (let i = 0; i < 5; i++) {
    const sellerPassword = await bcrypt.hash("password", 10);
    const seller = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: sellerPassword,
        role: Role.SELLER,
        createdAt: getRandomPastDate(365),
        updatedAt: new Date(),
      },
    });
    sellers.push(seller);
    console.log("Created seller:", seller.email);
  }

  // Create 10 buyers
  const buyers = [];
  for (let i = 0; i < 10; i++) {
    const buyerPassword = await bcrypt.hash("password", 10);
    const buyer = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: buyerPassword,
        role: Role.BUYER,
        createdAt: getRandomPastDate(365),
        updatedAt: new Date(),
      },
    });
    buyers.push(buyer);
    console.log("Created buyer:", buyer.email);
  }

  // Product categories
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Beauty",
    "Sports",
    "Books",
    "Toys",
    "Furniture",
    "Jewelry",
  ];

  // Create 30 products distributed among sellers
  const products = [];
  for (let i = 0; i < 30; i++) {
    const seller = sellers[Math.floor(Math.random() * sellers.length)];
    const price = faker.number.float({ min: 10, max: 1000 });

    // Only 60% of products get a discount
    const hasDiscount = Math.random() > 0.4;
    const discountedPrice = hasDiscount ? getDiscountPrice(price) : null;
    const discountValidTill = hasDiscount ? getRandomFutureDate(30) : null;

    // Generate mock image URLs and IDs
    const imageCount = faker.number.int({ min: 1, max: 5 });
    const images = Array(imageCount)
      .fill(null)
      .map(() => `https://cloudinary.example.com/${faker.string.uuid()}.jpg`);
    const imageIds = Array(imageCount)
      .fill(null)
      .map(() => faker.string.uuid());

    // Only 30% of products have videos
    const hasVideo = Math.random() > 0.7;
    const video = hasVideo
      ? `https://cloudinary.example.com/${faker.string.uuid()}.mp4`
      : null;
    const videoId = hasVideo ? faker.string.uuid() : null;

    const product = await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: price,
        discountedPrice: discountedPrice,
        discountValidTill: discountValidTill,
        category: categories[Math.floor(Math.random() * categories.length)],
        images: images,
        imageIds: imageIds,
        video: video,
        videoId: videoId,
        sellerId: seller.id,
        createdAt: getRandomPastDate(180),
        updatedAt: new Date(),
      },
    });
    products.push(product);
    console.log(`Created product: ${product.title} (${product.id})`);
  }

  // Create 20 orders
  const orders = [];
  for (let i = 0; i < 20; i++) {
    const buyer = buyers[Math.floor(Math.random() * buyers.length)];

    // Create order
    const shippingInfo = JSON.stringify({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zipCode: faker.location.zipCode(),
      phoneNumber: faker.phone.number(),
    });

    const paymentMethod =
      Math.random() > 0.5
        ? PaymentMethod.CASH_ON_DELIVERY
        : PaymentMethod.BKASH;

    // Determine order status (weighting towards COMPLETED)
    let status;
    const statusRand = Math.random();
    if (statusRand < 0.5) {
      status = OrderStatus.COMPLETED;
    } else if (statusRand < 0.7) {
      status = OrderStatus.PENDING;
    } else if (statusRand < 0.8) {
      status = OrderStatus.PROCESSING;
    } else if (statusRand < 0.9) {
      status = OrderStatus.OUT_FOR_DELIVERY;
    } else {
      status =
        Math.random() > 0.5 ? OrderStatus.CANCELLED : OrderStatus.REJECTED;
    }

    const createdDate = getRandomPastDate(90);

    // BKASH specific fields
    const hasBkashPayment = paymentMethod === PaymentMethod.BKASH;
    const paymentId = hasBkashPayment ? faker.string.uuid() : null;
    const transactionId = hasBkashPayment
      ? `TRX${faker.string.alphanumeric(10).toUpperCase()}`
      : null;
    const paymentStatus = hasBkashPayment
      ? Math.random() > 0.9
        ? "FAILED"
        : "SUCCESS"
      : null;
    const paymentExecutedAt = hasBkashPayment
      ? new Date(createdDate.getTime() + 1000 * 60 * 5)
      : null; // 5 minutes after order creation

    // Create 1-4 order items per order
    const orderItemCount = faker.number.int({ min: 1, max: 4 });
    const orderItems = [];
    let totalAmount = 0;

    // Create a set to ensure we don't add duplicate products to the same order
    const selectedProductIds = new Set();

    for (let j = 0; j < orderItemCount; j++) {
      // Select a random product that hasn't been added to this order yet
      let product;
      do {
        product = products[Math.floor(Math.random() * products.length)];
      } while (selectedProductIds.has(product.id));

      selectedProductIds.add(product.id);

      const quantity = faker.number.int({ min: 1, max: 5 });
      // Use discounted price if available, otherwise use regular price
      const price = product.discountedPrice || product.price;

      orderItems.push({
        productId: product.id,
        quantity: quantity,
        price: price,
      });

      totalAmount += price * quantity;
    }

    const order = await prisma.order.create({
      data: {
        buyerId: buyer.id,
        status: status,
        paymentMethod: paymentMethod,
        shippingInfo: shippingInfo,
        totalAmount: totalAmount,
        createdAt: createdDate, // Corrected typo here
        updatedAt: new Date(),
        paymentId: paymentId,
        transactionId: transactionId,
        paymentStatus: paymentStatus,
        paymentExecutedAt: paymentExecutedAt,
        items: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    orders.push(order);
    console.log(
      `Created order: ${order.id} with ${
        orderItems.length
      } items, total: $${totalAmount.toFixed(2)}`
    );
  }

  // Create reviews for completed orders (60% chance for each completed order)
  for (const order of orders) {
    if (order.status === OrderStatus.COMPLETED && Math.random() < 0.6) {
      // Get order items to know which products to review
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: order.id },
      });

      for (const item of orderItems) {
        // 70% chance for each item to get a review
        if (Math.random() < 0.7) {
          const rating = faker.number.int({ min: 3, max: 5 }); // Skew towards positive ratings
          const comment = faker.helpers.arrayElement([
            `Great product! Exactly as described.`,
            `Very satisfied with this purchase.`,
            `Good quality for the price.`,
            `Arrived quickly and in perfect condition.`,
            `Would definitely buy again!`,
            `Excellent value for money.`,
            `The quality exceeded my expectations.`,
            `Highly recommend this product.`,
            `Exactly what I needed.`,
            `Very happy with this item.`,
          ]);

          const review = await prisma.review.create({
            data: {
              rating: rating,
              comment: comment,
              productId: item.productId,
              buyerId: order.buyerId,
              createdAt: new Date(
                order.createdAt.getTime() + 1000 * 60 * 60 * 24 * 3 // Corrected typo here
              ), // 3 days after order created
            },
          });

          console.log(
            `Created review for product ${item.productId}: ${rating} stars`
          );
        }
      }
    }
  }

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

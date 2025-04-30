# Vibecommerce-backend

Modular, service-based backend for the Vibecommerce e-commerce platform, providing APIs for user authentication, product management, order processing, and reviews.

## Features

### Admin Features
- Admin only login
- Role-based access control
- View all users (buyers and sellers)
- Ban/suspend user accounts
- Admin analytics dashboard (To be implemented)

### Seller Features
- Authentication & secure session
- Add/Edit/Delete Products: Title, description, category, price
- Multiple image uploads
- One preview video per product
- Order Management:
    - View own orders
    - Approve or reject orders
    - Mark as: “Processing”, “Out for Delivery”, “Completed”
- Email notification for new orders placed for the seller's product (To be implemented)
- Dashboard (Optional Bonus): View order stats, product performance (To be implemented)

### Buyer Features
- Authentication & secure session
- Browse/search products by: Category, name, price
- Product Detail View: Images, video, description, seller info & Discounted price with real-time countdown (Countdown to be implemented)
- Add to Cart and Checkout with option to pay Cash on Delivery or Bkash sandbox payment (Bkash sandbox payment to be implemented)
- Order Tracking:
    - View current status and history
    - Statuses: 'Pending', 'Processing', 'Out for Delivery', 'Completed'
- Email notifications for order for each status update of an order (To be implemented)
- Leave reviews/ratings for a product


## Technical Foundation and Architectural Approach

- Code quality: Clean architecture, modularization, proper use of Typescript
- Feature completion: Full CRUD, order lifecycle, auth and role logic
- State management: Effective usage of RTK Query and frontend state (Frontend concern)
- Database Design: Prisma models for PostgreSQL

## Getting Started

- Standard run of the mill Node.js project run
- env.example porvided for reference 

## Tech Stack

- Express.js + TypeScript
- PostgreSQL + Prisma
- JWT Auth (access + refresh tokens)
- Zod for validation
- Cloudinary for image uploads
- Cookie-based auth (secure sessions)

## 📁 Folder Structure

```bash
src/
├── app/              # Express app instance
├── config/           # DB and environment configs
├── middlewares/      # Auth, error handlers
├── modules/          # Feature-wise separation
├── utils/            # Helpers and shared logic
└── server.ts         # Entry point

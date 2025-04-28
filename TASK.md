# Vibecommerce Backend Tasks

This document lists the development tasks for the Vibecommerce backend, categorized by feature area.

**Date Created:** 2025-04-28

---

## Admin Features

-   [x] **Implement Admin Login**: Create a separate login mechanism or restrict the existing login for users with the 'ADMIN' role. *(Completed: 2025-04-28)*
    -   [x] Define route (`/api/admin/login`?)
    -   [x] Create controller function
    -   [x] Create service function (potentially reuse/adapt `auth.service.loginUser` with role check)
-   [x] **Implement Admin Analytics Dashboard API**: *(Completed: 2025-04-28)*
    -   [x] Define necessary analytics (e.g., total users, total products, total orders, sales trends).
    -   [x] Create route (`/api/admin/dashboard`?)
    -   [x] Create controller function
    -   [x] Create service function to query and aggregate data.
-   [ ] **Verify Admin Role Enforcement**: Double-check all admin routes (`/api/user/users`, `/api/user/ban/:id`) have correct `requireRole('ADMIN')` middleware. (Existing routes seem correct).

## Seller Features

-   [ ] **Implement Email Notification for New Orders**:
    -   [ ] Choose an email service provider (e.g., SendGrid, Nodemailer with SMTP).
    -   [ ] Configure email service credentials securely.
    -   [ ] Create an email utility function (`src/utils/email.ts`?).
    -   [ ] Modify `order.service.createOrder` to trigger an email notification to the relevant seller(s) upon successful order creation.
-   [ ] **Implement Seller Dashboard API (Optional Bonus)**:
    -   [ ] Define necessary stats (e.g., total orders, revenue, top products).
    -   [ ] Create route (`/api/seller/dashboard`?)
    -   [ ] Create controller function.
    -   [ ] Create service function to query and aggregate seller-specific data.
-   [ ] **Verify Seller Role Enforcement**: Double-check all seller routes (`/api/orders/seller-orders`, `/api/orders/:id/status`, product creation/update/delete) have correct `requireRole('SELLER')` or appropriate logic within services. (Existing routes seem correct, product service checks `sellerId`).

## Buyer Features

-   [ ] **Implement Discount Price Countdown Logic**:
    -   [ ] The backend currently stores `discountValidTill`. The frontend will likely handle the countdown display.
    -   [ ] Ensure the `product.service.searchProducts` and potentially `product.service.getById` correctly return the active price (discounted or regular) based on `discountValidTill`. (Search logic seems to handle this, verify `getById`).
-   [ ] **Implement Bkash Sandbox Payment**:
    -   [ ] Research Bkash payment gateway integration API.
    -   [ ] Add necessary configuration (API keys, etc.).
    -   [ ] Create Bkash utility/service (`src/utils/bkash.ts`?).
    -   [ ] Modify the checkout process (`order.controller.createBuyerOrder` or a new dedicated route) to handle Bkash payment initiation and verification.
    -   [ ] Update `prisma.schema` if payment transaction details need to be stored.
-   [ ] **Implement Email Notifications for Order Status Updates**:
    -   [ ] Use the email utility created for seller notifications.
    -   [ ] Modify `order.service.updateStatus` to trigger an email notification to the buyer when the status changes.
-   [ ] **Verify Buyer Role Enforcement**: Double-check all buyer routes (`/api/orders/`, `/api/orders/buyer-orders`, `/api/reviews/`) have correct `requireRole('BUYER')` middleware. (Existing routes seem correct).

## General / Refactoring / Setup

-   [ ] **Add "Getting Started" Instructions to README.md**: Include steps for cloning, installing dependencies (`npm install`), setting up `.env` file (provide a `.env.example`), running migrations (`npx prisma migrate dev`), and starting the server (`npm run dev`).
-   [ ] **Implement Centralized Error Handling Middleware**: Create middleware in `src/middleware/` to catch errors consistently, format error responses, and log errors. Refactor controllers to remove repetitive try-catch blocks.
-   [ ] **Add Input Validation for Review**: Create `src/modules/review/review.validation.ts` with a Zod schema for adding reviews (rating, comment). Apply validation in `review.controller.addReview`.
-   [ ] **Add Input Validation for Order Status Update**: Add Zod validation for the `status` field in the request body for `order.controller.updateOrderStatus`.
-   [ ] **Implement Unit/Integration Testing**:
    -   [ ] Set up a testing framework (e.g., Jest, Vitest).
    -   [ ] Write tests for core services (auth, user, product, order, review).
    -   [ ] Write integration tests for API endpoints.
-   [ ] **API Documentation**: Set up Swagger/OpenAPI documentation automatically from code comments or definitions.
-   [ ] **Database Seeding**: Create seed data (`prisma/seed.ts`) for development/testing (e.g., admin user, sample products).

---

## Discovered During Work

*(Add any new tasks or sub-tasks identified during development here)*

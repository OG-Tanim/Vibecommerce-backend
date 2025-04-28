# Vibecommerce Backend Planning

This document outlines the planning details for the Vibecommerce backend project, including architecture, goals, style, and constraints.

## 1. Project Goal

To build a robust, scalable, and maintainable backend API for the Vibecommerce e-commerce platform, supporting features for administrators, sellers, and buyers.

## 2. Architecture

- **Pattern**: Modular, Service-based architecture. Each feature (Auth, User, Product, Order, Review) resides in its own module under `src/modules/`.
- **Module Structure**: Within each module, a structure resembling Model-View-Controller (MVC) is used, typically consisting of:
    - `*.route.ts`: Defines API endpoints using Express Router.
    - `*.controller.ts`: Handles incoming requests, performs basic validation (sometimes), calls service functions, and formats responses.
    - `*.service.ts`: Contains the core business logic, interacts with the database (via Prisma), and calls utility functions.
    - `*.validation.ts`: Defines input validation schemas using Zod (used by controllers or potentially middleware).
- **Database Interaction**: Prisma is used as the ORM for interacting with the PostgreSQL database. The schema is defined in `prisma/schema.prisma`.
- **Configuration**: Environment variables (`.env`) are used for configuration (database connection, JWT secrets, Cloudinary keys).
- **Middleware**: Centralized middleware in `src/middleware/` handles authentication (`auth.ts`) and role-based access control (`role.ts`).

## 3. Key Technologies

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT) - Access & Refresh Tokens
- **Validation**: Zod
- **File Uploads**: Cloudinary (using `multer` and `multer-storage-cloudinary`)
- **Password Hashing**: bcryptjs

## 4. Coding Style & Conventions

- **Language Features**: Utilize modern TypeScript features (async/await, interfaces, types, modules).
- **Naming**:
    - Files: `kebab-case.ts` (e.g., `auth.service.ts`)
    - Variables/Functions: `camelCase`
    - Classes/Interfaces/Types: `PascalCase`
    - Constants: `UPPER_SNAKE_CASE` (e.g., `JWT_SECRET`)
- **Imports**: Use path aliases (`@config`, `@middleware`, `@modules`, `@utils`) where configured. Prefer relative imports within the same module.
- **Validation**: Use Zod schemas defined in `*.validation.ts` files. Validation should ideally happen early, potentially in middleware or at the start of controller functions.
- **Error Handling**: Currently uses try-catch blocks in controllers. Consider implementing a centralized error handling middleware for consistency.
- **API Design**: RESTful principles. Use appropriate HTTP verbs (GET, POST, PATCH, DELETE) and status codes. Return JSON responses.
- **Modularity**: Keep modules self-contained where possible. Use utility functions in `src/utils/` for shared logic.

## 5. Constraints & Considerations

- **Role-Based Access Control (RBAC)**: Strictly enforce access control using the `authenticate` and `requireRole` middleware. Ensure correct roles are applied to routes.
- **Order Status Transitions**: Adhere strictly to the defined state transitions in `src/utils/orderStatusTransitions.ts`. The `order.service.ts` already implements this check.
- **Security**:
    - Store refresh tokens securely (currently using httpOnly cookies).
    - Validate all user input thoroughly using Zod.
    - Protect against common web vulnerabilities (Prisma helps with SQL injection, but consider others like XSS if serving HTML, CSRF if using session-based auth alongside tokens).
- **Scalability**: While the current structure is modular, consider potential bottlenecks and database query optimization as the application grows.
- **Testing**: Implement unit and integration tests (e.g., using Jest or Vitest with Supertest) to ensure reliability. (Currently no tests exist).
- **Documentation**: Maintain `README.md` and add API documentation (e.g., using Swagger/OpenAPI). Add comments for complex logic.
- **Missing Features**: Prioritize implementation of features marked as "(To be implemented)" in `README.md`.

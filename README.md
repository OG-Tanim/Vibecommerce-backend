# Vibecommerce-backend

Moduler, servie-based backend for a full-stack MERN e-commerce platform.

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

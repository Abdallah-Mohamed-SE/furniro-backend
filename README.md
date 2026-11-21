Markdown
# Furniro E-Commerce API (`furniro-backend`)

A production-ready, bilingual (English / Arabic RTL) RESTful API for the **Furniro** furniture e-commerce store and Admin Dashboard, built with **NestJS**, **Prisma ORM**, and **PostgreSQL**.

**Author:** [Abdallah Mohamed](https://github.com/Abdallah-Mohamed-SE)

---

## Tech Stack
- **Framework:** NestJS (Node.js / TypeScript)
- **Database & ORM:** PostgreSQL 18 + Prisma ORM (`@prisma/adapter-pg`)
- **Authentication & Security:** JWT (`@nestjs/jwt`, `passport-jwt`), Role-Based Access Control (`CUSTOMER` / `ADMIN`), `bcrypt` password hashing
- **Validation & Docs:** `class-validator`, `class-transformer`, Swagger OpenAPI (`/api/docs`)

---

## Core Features
- **Authentication & Users:** Registration, login, profile retrieval, and JWT role guards (`JwtAuthGuard`, `RolesGuard`).
- **Products & Categories:** Full CRUD for admins, public filtering by category, price range, search (EN/AR), sorting, and pagination.
- **Transactional Orders:** Guest and authenticated checkout with automatic stock validation and deduction inside `prisma.$transaction`, unique order numbers (`FRN-2026-XXXX`), and order status lifecycle management.
- **Admin Dashboard Analytics:** Real-time store revenue, order counts, low-stock alerts, customer count, and unread contact message metrics.
- **Blog & Contact:** Bilingual blog articles and customer contact inbox management.

---

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
Configure environment variables:
Copy .env.example to .env and update your PostgreSQL credentials:

Bash
cp .env.example .env
Run database migrations and seed initial data:

Bash
npm run db:migrate
npm run db:seed
Start the development server:

Bash
npm run start:dev
API Base URL: http://localhost:8000/api

Swagger Documentation: http://localhost:8000/api/docs

License
MIT License — Copyright (c) 2026 Abdallah Mohamed

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS Logo" /></a>
</p>

<h1 align="center">🛋️ Furniro E-Commerce API (<code>furniro-backend</code>)</h1>

<p align="center">
  A production-ready, bilingual (English / Arabic RTL) RESTful API for the <strong>Furniro</strong> furniture e-commerce store and Admin Dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/License-MIT-B88E2F?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  👨‍💻 <strong>Author:</strong> <a href="https://github.com/Abdallah-Mohamed-SE">Abdallah Mohamed</a>
</p>

---

## 🛠️ Tech Stack
* ⚙️ **Framework:** NestJS (Node.js / TypeScript)
* 🗄️ **Database & ORM:** PostgreSQL 18 + Prisma ORM (`@prisma/adapter-pg`)
* 🔐 **Authentication & Security:** JWT (`@nestjs/jwt`, `passport-jwt`), Role-Based Access Control (`CUSTOMER` / `ADMIN`), `bcrypt` password hashing
* 📖 **Validation & Docs:** `class-validator`, `class-transformer`, Swagger OpenAPI (`/api/docs`)

---

## ✨ Core Features
* 🔑 **Authentication & Users:** Registration, login, profile retrieval, and JWT role guards (`JwtAuthGuard`, `RolesGuard`).
* 📦 **Products & Categories:** Full CRUD for admins, public filtering by category, price range, search (EN/AR), sorting, and pagination.
* 🛒 **Transactional Orders:** Guest and authenticated checkout with automatic stock validation and deduction inside `prisma.$transaction`, unique order numbers (`FRN-2026-XXXX`), and order status lifecycle management.
* 📊 **Admin Dashboard Analytics:** Real-time store revenue, order counts, low-stock alerts, customer count, and unread contact message metrics.
* 📝 **Blog & Contact:** Bilingual blog articles and customer contact inbox management.

---

## 🚀 Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and update your PostgreSQL credentials:
   ```bash
   cp .env.example .env
   ```

3. **Run database migrations and seed initial data:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run start:dev
   ```
   * 🌐 **API Base URL:** `http://localhost:8000/api`
   * 📚 **Swagger Documentation:** `http://localhost:8000/api/docs`

---

## 📄 License
MIT License — Copyright (c) 2026 **Abdallah Mohamed**

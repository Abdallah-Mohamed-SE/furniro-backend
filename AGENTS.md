# AGENTS.md — Furniro E-Commerce Backend

## 1. Project Identity & Stack
- **Project:** Furniro Furniture Store API (`furniro-backend`) — bilingual (EN / AR-RTL) e-commerce backend paired with a Next.js App Router frontend (`http://localhost:3000`).
- **Runtime & Environment:** Windows, Node.js v24+, CommonJS (`"type": "commonjs"`).
- **Framework:** NestJS (latest, loaded via `require(esm)` on Node 24). Official skills are installed in `.agents/skills` — consult them when implementing NestJS modules, guards, validation, or Swagger.
- **ORM & Database:** **Prisma v8** + **PostgreSQL 18** (`furniro_db`).
- **Server Port:** `8000` (configured via `PORT` in `.env`). Global prefix: `/api`, Swagger docs: `/api/docs`.

---

## 2. Critical Execution Rules (Anti-Waste & Speed)
- **No Redundant Discovery:** Do NOT run exploratory commands to check Node/Prisma versions, list `.agents/skills` recursively, or read full 700-line skill files unless resolving a specific error. Go straight to implementation and verification.
- **Prisma v8 Strict Rules:**
  - `datasource db` in `prisma/schema.prisma` MUST NOT contain `url = env(...)`. Connection URL lives exclusively in `prisma.config.ts`.
  - Runtime `PrismaClient` MUST use the PostgreSQL driver adapter (`@prisma/adapter-pg` + `pg` `Pool`), both in `src/prisma/prisma.service.ts` and `prisma/seed.ts`.
  - Seed command is configured in `prisma.config.ts` under `migrations.seed` (`npx tsx prisma/seed.ts`).
- **Frontend Data Contract Integrity:** Keep bilingual fields (`name` / `nameAr`, `subtitle` / `subtitleAr`, `description` / `descriptionAr`, `title` / `titleAr`) and exact JSON response shapes consistent so the Next.js frontend consumes them without mapping friction.

---

## 3. Architecture & Conventions
- **Entry Point (`src/main.ts`):**
  - Enable CORS for `http://localhost:3000` with `credentials: true`.
  - Apply global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.
  - Configure `@nestjs/swagger` at `/api/docs` with Bearer Auth support.
  - Listen on `process.env.PORT ?? 8000`.
- **Module Structure (`src/`):**
  - `src/prisma/` — `@Global()` `PrismaModule` & `PrismaService` (`OnModuleInit`, `OnModuleDestroy`).
  - `src/auth/` — JWT registration/login, `JwtAuthGuard`, `RolesGuard`, `@Roles()` & `@CurrentUser()` decorators.
  - `src/categories/` — Public read + Admin CRUD.
  - `src/products/` — Public filtering/pagination/search/slug lookup + Admin CRUD.
  - `src/orders/` — Guest & authenticated checkout (transactional stock deduction), user order history, Admin status management.
  - `src/blog/` — Public blog posts & categories + Admin CRUD.
  - `src/contact/` — Public message submission + Admin inbox management.
- **Validation:** Use `class-validator` + `class-transformer` DTOs with `@nestjs/swagger` `@ApiProperty()` decorators on all request bodies and query params.
- **Security:** Hash passwords with `bcrypt` (10 salt rounds). Never return `password` fields in API responses.

---

## 4. Verification Standard
- After database changes: run `npx prisma migrate dev` and `npx prisma db seed`.
- After feature implementation: run `npm run build` to guarantee zero TypeScript compilation errors before finishing a task.
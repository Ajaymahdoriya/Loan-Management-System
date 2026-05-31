# SafeFund — Loan Management System

SafeFund is a simple loan management system consisting of a TypeScript Node.js backend and a Next.js TypeScript frontend. This repository contains two folders: `lms-backend` and `lms-frontend`.

## Table of Contents
- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [Environment variables](#environment-variables)
- [Local development](#local-development)
- [Seeding & uploads](#seeding--uploads)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## About

SafeFund is a small loan management application used to track borrowers, loans, disbursements, payments/collections and sanctions. It is split into a backend API and a frontend Next.js application.

## Gdrive Video Link -> https://drive.google.com/file/d/1S1X5hUFwcHwmaZHvp0dUzZ-p8RxhXdw7/view?usp=sharing

## Features

- Borrower & loan management
- Disbursements and collections
- Payment tracking
- Authentication (JWT)
- File uploads (for receipts/attachments)

## Tech stack

- Backend: Node.js, TypeScript, Express (folder: lms-backend)
- Frontend: Next.js, TypeScript (folder: lms-frontend)
- Database: configure via environment variable in `lms-backend`

## Repository structure

- `lms-backend/` — API server, controllers, models, scripts
- `lms-frontend/` — Next.js frontend application

Explore the backend entry at [lms-backend/src/app.ts](lms-backend/src/app.ts#L1) and frontend entry at [lms-frontend/src/app/page.tsx](lms-frontend/src/app/page.tsx#L1).

## Environment variables

Create `.env` or `.env.local` files for each app. The backend uses MongoDB (Mongoose) and expects `MONGO_URI`.

Backend (`lms-backend/.env`):

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/safefund
JWT_SECRET=your_jwt_secret_here
UPLOAD_DIR=uploads
```

Notes:
- `MONGO_URI` can point to a local MongoDB instance or a MongoDB Atlas connection string.
- `UPLOAD_DIR` is the relative folder where uploaded files are stored (ensure the directory exists).

Frontend (`lms-frontend/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Adjust ports and URLs to match your local configuration.


## Local development (detailed)

Prerequisites:

- Node.js (recommended >= 18)
- npm or yarn
- MongoDB running locally or a MongoDB Atlas cluster

Backend (lms-backend):

1. Open a terminal in `lms-backend`.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (see Environment variables above).
4. Ensure the `uploads/` directory exists at the backend root:

```bash
mkdir -p uploads
```

5. Start in development mode (uses `nodemon` and runs TypeScript directly):

```bash
npm run dev
```

6. Build for production and run the transpiled code:

```bash
npm run build
npm start
```

Backend npm scripts (from `lms-backend/package.json`):

- `dev` — `nodemon src/app.ts` (development)
- `build` — `tsc` (compile TypeScript to `dist`)
- `start` — `node dist/app.js` (run compiled app)
- `seed` — `ts-node src/scripts/seed.ts` (seed sample data)

Frontend (lms-frontend):

1. Open a terminal in `lms-frontend`.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file (see Environment variables above).
4. Start the Next.js dev server:

```bash
npm run dev
```

Frontend npm scripts (from `lms-frontend/package.json`):

- `dev` — `next dev` (development)
- `build` — `next build` (production build)
- `start` — `next start` (serve production build)
- `lint` — `eslint`

## Seeding & uploads

- Seed script: `lms-backend/scripts/seed.ts` inserts default users and requires `MONGO_URI` to be set. Run from the backend folder:

```bash
npm run seed
```

- Uploaded files are served statically from the `uploads/` directory. Ensure it exists and is writable by the backend process.

Example: create uploads folder and seed data:

```bash
cd lms-backend
mkdir -p uploads
npm install
npm run seed
npm run dev
```

## Deployment

- Frontend can be deployed to Vercel (see `lms-frontend/` and `vercel.json`).
- Backend can be deployed to any Node-compatible host or serverless platform; configure your environment variables and persistent storage appropriately.

## Contributing

- Open an issue describing the change or bug.
- Create a pull request with tests or clear reproduction steps where applicable.



# DevPulse – Internal Tech Issue & Feature Tracker

DevPulse is a high-performance backend API designed for software engineering teams to report bugs, suggest features, and coordinate resolutions. Built with **Feature-Based Modular Architecture** (Screaming Architecture), direct PostgreSQL execution, and strict TypeScript types.

---

## Deployment & Deliverables

- **Live API Endpoint:**
- **GitHub Repository:** [https://github.com/Shajidaa/DevPulse](https://github.com/Shajidaa/DevPulse)

---

## Technology Stack

- **Runtime:** Node.js (v24.x or higher)
- **Language:** TypeScript (Strict typing, no `any`)
- **Framework:** Express.js (Modular routing)
- **Database:** PostgreSQL (Native `pg` driver, zero ORMs/Query Builders, raw SQL only)
- **Security:** `bcrypt` (10 salt rounds) & Standard JSON Web Tokens (`jsonwebtoken`)

---

## 📁 Project Structure

```text
src/
├── config/
│   └── index.ts        # Database connection pool
├── middleware/
│   ├── auth.middleware.ts  # JWT verification & role validation
│   └── error.middleware.ts # Centralized async error handling
├── modules/
│   ├── auth/              # Signup & Login feature module
│   └── issues/            # Issue tracking feature module
├── utils/
│   ├── AppError.ts         # Custom error operational class
│   └── sendResponse.ts     # Global standard success response handler
├── app.ts                  # App configuration & route bindings
└── server.ts               # Server startup & lifecycle tracking
```

# Database Tables Schema

CREATE TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
role VARCHAR(50) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE issues (
id SERIAL PRIMARY KEY,
title VARCHAR(150) NOT NULL,
description TEXT NOT NULL,
type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature_request')),
status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
reporter_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# API Routes Summary

🔹 Authentication
POST /api/auth/signup - Register a new user account (Public)

POST /api/auth/login - Authenticate user & return signed JWT (Public)

🔹 Issues Management
POST /api/issues - Create a bug report or feature request (Protected)

GET /api/issues - View all issues with optional filtering & sorting (Public)

GET /api/issues/:id - Fetch details of a specific issue (Public)

PATCH /api/issues/:id - Update issue fields based on access rules (Protected)

DELETE /api/issues/:id - Permanently remove an issue from the system (Maintainer Only)

## Setup & Installation

# 1. Installation

Bash
git clone [https://github.com/yourusername/devpulse.git](https://github.com/yourusername/devpulse.git)
cd devpulse
npm install

# 2. Environment Configuration (.env)

Code snippet
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
JWT_SECRET=your_secure_jwt_secret_key

# 3. Execution Commands

Bash

# Run local development server (with ts-node-dev)

npm run dev

# Compile TypeScript to production JavaScript

npm run build

# Start the compiled production build

npm start

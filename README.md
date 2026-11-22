# FixLab – Smart Device & Home Appliance Repair Platform

**FixLab** is a full-stack, role-based repair service booking platform that connects customers with skilled technicians for smartphone, laptop, and home appliance repairs. Customers can browse services, request repairs, track job progress, and make secure online payments only after their repair is completed.

🌐 **Live Website:** https://fixlab-x.vercel.app

---

## Overview

Finding a reliable repair technician can be difficult. Customers often struggle with unclear pricing, unreliable service providers, and a lack of updates about their repair jobs.

FixLab solves these problems by providing a centralized platform where customers can find technicians, request repair services, track job progress, and pay securely after service completion.

The platform supports three user roles: Customer, Technician, and Admin. Each role has its own dashboard and dedicated functionalities.

## Key Features

### 1. Authentication & User Management
- Secure authentication using BetterAuth.
- Role-based registration for Customers and Technicians.
- Protected routes and role-based dashboard access.
- User profile management with profile image upload.
- JWT-based API authentication and authorization.
- Persistent login sessions.

### 2. Public Website
- Modern and responsive landing page.
- Browse available repair services.
- Dynamic featured services.
- Search services by title or category.
- Filter services by category and service mode.
- Sort services by price and newest listings.
- Detailed service information and technician profiles.
- Popular repair categories.
- How It Works section.

### 3. Customer Dashboard
- View dashboard statistics.
- Browse and request repair services.
- Track booking and repair progress.
- Cancel pending repair requests.
- View booking history.
- Pay for completed repair jobs.
- View payment history and transaction details.

### 4. Technician Dashboard
- Create new repair service listings.
- Upload service images using ImgBB.
- Edit and delete existing services.
- Manage service availability.
- Track service approval status.
- Accept or reject customer requests.
- Update job progress.
- Set the final repair amount upon completion.

### 5. Admin Dashboard
- View platform statistics.
- Manage registered users.
- Change user roles.
- Approve or reject technician service listings.
- Monitor all repair bookings.
- View all payment transactions.
- Track platform revenue.

### 6. Secure Payment System
- Integrated Stripe Checkout.
- Stripe Test Mode integration.
- Pay-after-service payment workflow.
- Server-side booking and payment validation.
- Payment records stored in MongoDB.
- Protection against duplicate payments.

### 7. Additional Features
- Server-side search, filtering, and sorting.
- Role-based Express middleware.
- Server-enforced job status transitions.
- Responsive dashboard layouts.
- Loading states and skeleton loaders.
- Custom 404 and error pages.
- Toast notifications.
- Confirmation dialogs.
- Friendly empty states.
- Demo and seed data.

---

## Demo Credentials

Use the following demo accounts to explore FixLab's different user roles and functionalities.

### Admin Account

| Field | Credentials |
|---|---|
| Email | admin@gmail.com |
| Password | `Unique@123` |
| Role | Admin |

### Technician Account

| Field | Credentials |
|---|---|
| Email | technician@gmail.com |
| Password | `Unique@123` |
| Role | Technician |

### Customer Account

| Field | Credentials |
|---|---|
| Email | customer@gmail.com |
| Password | `Unique@123` |
| Role | Customer |

> **Note:** These demo accounts are provided for testing purposes only. Please do not use them for personal or sensitive activities.

---

## User Roles & Permissions

| Feature | Customer | Technician | Admin |
|---|:---:|:---:|:---:|
| Browse Services | ✓ | ✓ | ✓ |
| Request Repairs | ✓ | — | — |
| Manage Bookings | Own | Assigned | All |
| Manage Services | — | Own | All |
| Approve Services | — | — | ✓ |
| Manage Users | — | — | ✓ |
| Update Job Status | — | ✓ | — |
| Make Payments | ✓ | — | — |
| View Transactions | Own | — | All |

---

## Repair Job Workflow

FixLab follows a controlled repair status pipeline:

1. **Requested** – Customer submits a repair request.
2. **Accepted** – Technician accepts the request.
3. **In Progress** – Technician starts working on the repair.
4. **Completed** – Technician finishes the job and sets the final amount.
5. **Paid** – Customer completes the payment through Stripe.

A technician can reject a requested job, while a customer can cancel a request before it is accepted.

Payment is available only for completed and unpaid bookings.

---

## Technology Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB

### Authentication & Security
- BetterAuth
- JWT
- Role-Based Access Control (RBAC)

### Payment & Image Upload
- Stripe Checkout
- ImgBB API

### Deployment
- Vercel (Frontend)
- Production Backend Deployment

---

## Database Architecture

FixLab uses four main application collections in MongoDB.

| Collection | Purpose |
|---|---|
| users | User accounts, roles, and profile information |
| services | Technician service listings |
| bookings | Customer repair requests and job statuses |
| payments | Verified payment and transaction records |

BetterAuth also maintains its required authentication-related collections.

---

## Installation & Setup

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Stripe account
- ImgBB API key

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd FixLab
```

### 2. Frontend Setup

```bash
npm install
```

Create a `.env.local` file in the frontend root directory.

```env
NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_BETTER_AUTH_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### 3. Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file in the server root directory.

```env
PORT=5000

MONGODB_URI=
DB_NAME=fixlab

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

JWT_SECRET=

IMGBB_API_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLIENT_URL=
```

**Note:** Configure the environment variable names according to the actual frontend and backend implementation. Never commit secret keys or `.env` files to GitHub.

### 4. Run the Application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
npm run dev
```

Open your browser:

```text
http://localhost:3000
```

---

## Environment Variables

The following credentials must be configured before running the application:

- MongoDB connection string.
- BetterAuth secret and URL.
- JWT secret.
- ImgBB API key.
- Stripe publishable and secret keys.
- Stripe webhook signing secret (if webhook verification is enabled).
- Frontend and backend production URLs.

---

## Future Improvements

- [ ] Dark / Light Mode Toggle.
- [ ] Additional user experience improvements.
- [ ] Further platform enhancements.

---

## Project Information

| Information | Details |
|---|---|
| Project Name | FixLab |
| Category | Smart Device & Home Appliance Repair Service Platform |
| Project Type | Full-Stack Web Application |
| Live Website | https://fixlab-x.vercel.app |
| Frontend | Next.js |
| Backend | Express.js |
| Database | MongoDB |

## Project Goal

The primary goal of FixLab is to connect customers with trusted technicians through a transparent, secure, and convenient repair booking experience.

---

**FixLab – Find the Right Technician. Get It Fixed. Pay After Service.**

# Online Delivery Application (Multi-Tenant) - IN PROGRESS

A full-stack, multi-tenant food delivery platform built for speed, scalability, and SEO. This project demonstrates a production-ready architecture using modern web technologies.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Tech Stack

*   **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Zustand (State Management).
*   **Backend**: Node.js, Express, TypeScript, Socket.IO (Real-time).
*   **Database**: PostgreSQL, Prisma ORM.
*   **Deployment**: Vercel (Frontend), Render/Railway (Backend & DB).

## ✨ Key Features

### 🏢 Multi-Tenancy Architecture
-   **Dynamic Storefronts**: Each store gets its own dedicated space (e.g., `store1.myapp.com`, `store2.myapp.com`).
-   **Data Isolation**: Backend middleware ensures requests are scoped to the correct tenant (store).

### 🛍️ Customer Experience
-   **Real-time Ordering**: Live order status updates via WebSockets.
-   **Responsive Design**: Mobile-first UI tailored for on-the-go ordering.
-   **Seamless Checkout**: Integrated cart and address management.

### 💼 Admin Dashboard
-   **Live Operations**: Real-time feed of incoming orders.
-   **Product Management**: Easy-to-use interface for adding/editing menu items.
-   **Analytics**: View sales reports and order volume.

## 🛠️ Project Structure

This is a monorepo setup containing both client and server:

```
├── client/           # Next.js Frontend Application
│   ├── app/          # App Router (Pages & Layouts)
│   ├── components/   # Reusable UI Components
│   └── store/        # Zustand State Stores
└── server/           # Express Backend API
    ├── src/
    │   ├── controllers/ # Request Handlers
    │   ├── models/      # Prisma Schema
    │   └── routes/      # API Routes
    └── prisma/       # Database Schema & Migrations
```

## 🚀 Deployment Guide

### Database (PostgreSQL)
1.  Create a free PostgreSQL database on **Neon.tech**, **Railway**, or **Supabase**.
2.  Copy the connection string (`DATABASE_URL`).

### Backend (Render / Railway)
1.  Push this repository to GitHub.
2.  Connect your repository to Render/Railway.
3.  **Root Directory**: `server`
4.  **Build Command**: `npm install && npx prisma generate && npm run build`
5.  **Start Command**: `npm start`
6.  **Environment Variables**:
    *   `DATABASE_URL`: (Your connection string)
    *   `JWT_SECRET`: (Generate a secure random string)
    *   `CORS_ORIGIN`: (Your frontend URL, e.g., `https://my-delivery-app.vercel.app`)

### Frontend (Vercel)
1.  Connect your repository to Vercel.
2.  **Root Directory**: `client`
3.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: (Your backend URL, e.g., `https://my-backend.onrender.com/api`)
    *   `NEXT_PUBLIC_SOCKET_URL`: (Your backend URL root, e.g., `https://my-backend.onrender.com`)
4.  Deploy!

## 💻 Local Development

To run this project locally:

1.  **Clone the repo**
2.  **Install dependencies**:
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```
3.  **Setup Database**:
    -   Ensure PostgreSQL is running.
    -   Update `server/.env` with your local `DATABASE_URL`.
    -   Run `cd server && npx prisma db push`.
4.  **Run Development Servers**:
    -   Backend: `cd server && npm run dev`
    -   Frontend: `cd client && npm run dev`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).


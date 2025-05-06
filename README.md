# 🛒 Superhero Comic E-Commerce Website

An immersive e-commerce web application for purchasing superhero-themed T-shirts, built using a modern tech stack and inspired by comic book aesthetics and the beauty of *Starry Night*.

---
## ✨ Features

- Stunning superhero & comic-themed UI  
- Product browsing, filtering, and search  
- Google-based user authentication  
- Cart, wishlist, and user profile  
- Admin dashboard for managing products, orders, and users  
- Secure checkout (Stripe, PayPal, Razorpay)  
- Fully responsive design  

---

## 🧪 Frontend Tech Stack

This project is built with:

- ⚡ **Vite** – Next Generation Frontend Tooling  
- ⚛️ **React** – Component-based UI library  
- 🧩 **shadcn/ui** – Radix UI + Tailwind-based components  
- 🎨 **Tailwind CSS** – Utility-first styling  
- 🔁 **React Router** – Page-based navigation  
- 🔄 **TanStack Query** – Data fetching and caching  

📁 **Location:** `E-com/frontend`

---

## 🛠 Backend Tech Stack

- 🌐 **Node.js** – JavaScript runtime  
- 🚀 **Express.js** – Server-side routing and middleware  
- 🗃️ **MongoDB Atlas** – Cloud-based NoSQL database  
- 🔐 **google-auth-library** – Google OAuth 2.0 integration  

📁 **Location:** `E-com/backend`

---

## 🚀 Getting Started

### 📦 1. Clone the Repository

```bash
git clone https://github.com/your-username/e-com.git
cd e-com
```
## Setup frontend
```bash
cd frontend
npm install
```

## To run the frontend in development mode

```bash
npm run dev
```

## Setup backend

## Create a .env file inside the backend/ directory with the following content

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_seceret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```
## Run the backend

```bash
cd backend
npm install
nodemon
```
## Project Structure

```bash
E-com/
├── frontend/   # Vite + React + Tailwind (UI)
└── backend/    # Express + MongoDB + Google Auth (API)
```






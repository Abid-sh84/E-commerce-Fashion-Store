# Fashion Store

A modern e-commerce web application for fashion products, built with a robust technology stack and contemporary design aesthetics.

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Frontend](https://img.shields.io/badge/frontend-Vite-blue?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/backend-Express.js-black?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/database-MongoDB-green?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Deployed with Vercel](https://img.shields.io/badge/Deployed%20with-Vercel-black?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fecommerce-fashion.vercel.app)](https://e-commerce-fashion-store-ykdu.vercel.app/)
[![Last Commit](https://img.shields.io/github/last-commit/Abid-sh84/E-commerce-Fashion-Store?color=brightgreen)](https://github.com/Abid-sh84/E-commerce-Fashion-Store/commits)
[![License](https://img.shields.io/github/license/Abid-sh84/E-commerce-Fashion-Store?color=yellow)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/Abid-sh84/E-commerce-Fashion-Store/releases)

---

## Features

- ⚡ Modern UI with responsive design
- 🔐 Google OAuth 2.0 authentication
- 🛒 Product listing, cart, and wishlist
- 📦 Admin dashboard to manage products & orders
- 💳 PayPal integration for secure checkout
- 🌐 Vercel deployment-ready

## Technology Stack

### Frontend

- **React** - UI library for building component-based interfaces
- **Vite** - Next generation frontend tooling and bundler
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing for single page applications
- **Context API** - State management for cart, wishlist, and authentication

### Backend

- **Node.js** - JavaScript runtime for server-side code
- **Express.js** - Web framework for building APIs
- **MongoDB Atlas** - Cloud-based NoSQL database
- **JWT** - Secure authentication with JSON Web Tokens
- **Google OAuth** - Third-party authentication
- **Node mailer** -

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/fashion-store.git
cd fashion-store
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
EMAIL_SERVICE=gmail
GOOGLE_REDIRECT_URI=your_url
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
FRONTEND_URL=your_localhost
```


4. Create a `.env` file in the frontend directory with the following variables:
```
VITE_API_URL=your_localhost
```

### Running the Application

#### Development Mode

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

## Project Structure

```
Fashion Store/
├── frontend/           # React application (Vite)
│   ├── public/         # Static assets
│   └── src/
│       ├── api/        # API client and endpoints
│       ├── components/ # Reusable UI components
│       ├── contexts/   # React Context providers
│       ├── pages/      # Page components
│       └── styles/     # Global styles
└── backend/            # Express API server
    ├── config/         # Configuration files
    ├── controllers/    # Route controllers
    ├── data/           # Seed data
    ├── middleware/     # Express middleware
    ├── models/         # Mongoose models
    ├── routes/         # API routes
    └── utils/          # Utility functions
```

## Future Enhancements

- Advanced product filtering and recommendation engine
- Email notifications for order status updates
- Performance optimizations with React Query
- More payment gateway integrations
- Adding Vendor pannel (under development)
- Vendor pannel deployement on vercel








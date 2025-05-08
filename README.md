# Fashion Store

A modern e-commerce web application for fashion products, built with a robust technology stack and contemporary design aesthetics.

## Features

- Elegant modern UI with dark theme and amber accents
- Advanced product browsing with filtering and search
- Google-based user authentication
- Cart and wishlist functionality
- User profiles with order history
- Admin dashboard for managing products, orders, and users
- Secure checkout with multiple payment options (PayPal)
- Fully responsive design for mobile and desktop

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

## License

MIT






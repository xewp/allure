# 🌟 Aura Select - Model Booking Platform

A full-stack model and talent booking platform with separate admin and client interfaces, featuring single-device session management, secure authentication, and comprehensive booking management.

---

## 📁 Project Structure

```
aura-select/
├── admin/          # Admin panel (Vite + React)
├── backend/        # Express.js REST API
├── client/         # Client application (Vite + React)
├── DEPLOYMENT.md   # Detailed deployment guide
└── README.md       # This file
```

### Branches

- **`main`** - Production-ready code
- **`redesign-client-ui`** - UI redesign branch for client interface

---

## 🚀 Features

### Client Features

- **User Authentication** - Secure registration and login with JWT
- **Single-Device Session Management** - Only one active session per user
- **Model Browsing** - Browse foreign and local models with filtering
- **Favorites System** - Save and manage favorite models
- **Booking System** - Book models with date selection and messaging
- **User Profile** - View and manage personal information
- **Protected Routes** - Secure access to authenticated pages
- **Responsive Design** - Mobile-friendly interface

### Admin Features

- **Admin Authentication** - Separate admin login system
- **Dashboard Analytics** - Overview of bookings, revenue, and statistics
- **Model Management** - Add, edit, and delete models with image galleries
- **Booking Management** - View, update status, and manage all bookings
- **User Management** - View, edit, and delete user accounts
- **Calendar View** - Visual booking calendar
- **Image Upload** - Cloudinary integration for image management
- **Single-Device Session** - Session validation for admin accounts

### Backend Features

- **RESTful API** - Express.js with organized routes
- **MongoDB Integration** - Mongoose ODM with structured schemas
- **JWT Authentication** - Secure token-based auth for users and admins
- **Session Management** - Token hashing and validation
- **Image Processing** - Cloudinary integration for uploads
- **Input Validation** - Express-validator for request validation
- **Security Headers** - Helmet.js for production security
- **CORS Configuration** - Secure cross-origin requests

---

## 🛠️ Tech Stack

### Frontend (Admin & Client)

- **Framework**: React 18+ with Vite
- **Routing**: React Router v6/v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Authentication**: JWT tokens with localStorage
- **Calendar**: React Big Calendar (admin)

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT + bcrypt
- **File Upload**: Cloudinary
- **Security**: Helmet.js, CORS
- **Validation**: Express-validator

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/your-org/aura-select.git
cd aura-select
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET
# - PORT (default: 5000)
# - NODE_ENV
# - FRONTEND_URL

# Seed initial admin user
npm run seed-admin

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Client Setup

```bash
cd client

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env.local

# Start development server
npm run dev
```

The client will run on `http://localhost:5173`

### 4. Admin Setup

```bash
cd admin

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env.local

# Start development server
npm run dev
```

The admin panel will run on `http://localhost:5174`

---

## 🔐 Environment Variables

### Backend (.env)

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (32+ characters)
JWT_SECRET=your_secure_random_string_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend - Client & Admin (.env.local)

```env
VITE_API_URL=http://localhost:5000
```

---

## 📝 Scripts

### Backend

```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm run seed-admin # Create initial admin user
```

### Client & Admin

```bash
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🗄️ Database Models

- **User** - Client user accounts with session tracking
- **AdminUser** - Admin accounts with session tracking
- **LocalModel** - Local talent profiles
- **ForeignModel** - International talent profiles
- **Booking** - Booking records with status tracking
- **Product** - Product listings (future feature)

---

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/validate-session` - Session validation
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/validate-session` - Admin session validation

### Models

- `GET /api/models` - Get all models
- `GET /api/models/:id` - Get model by ID
- `POST /api/models` - Create model (admin)
- `PUT /api/models/:id` - Update model (admin)
- `DELETE /api/models/:id` - Delete model (admin)
- `POST /api/models/:id/favorite` - Toggle favorite

### Bookings

- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/user` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Users

- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

---

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Render (free tier) with MongoDB Atlas and Cloudinary.

**Quick Summary:**

1. Setup MongoDB Atlas cluster
2. Deploy backend to Render Web Service
3. Deploy client to Render Static Site
4. Deploy admin to Render Static Site
5. Configure environment variables
6. Test the deployment

---

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token generation and validation
- **Session Tokens** - Hashed session tokens in database
- **Single-Device Sessions** - Automatic invalidation of old sessions
- **Protected Routes** - Frontend and backend route protection
- **Input Validation** - Request validation with express-validator
- **Security Headers** - Helmet.js for HTTP security
- **CORS Protection** - Configured allowed origins
- **Environment Variables** - Sensitive data in .env files

---

## 📱 Using the Redesigned UI

The `redesign-client-ui` branch contains an enhanced UI for the client application.

### Switching to Redesign Branch

```bash
cd client
git checkout redesign-client-ui
npm install
npm run dev
```

### Merging Redesign to Main

```bash
git checkout main
git merge redesign-client-ui
git push origin main
```

---

## 🐛 Troubleshooting

### Backend won't start

- Check MongoDB connection string
- Verify all environment variables are set
- Check if port 5000 is already in use

### Frontend can't connect to backend

- Verify `VITE_API_URL` is set correctly
- Check backend is running on correct port
- Check CORS configuration in backend

### Session issues

- Clear localStorage
- Check JWT_SECRET is same across restarts
- Verify session validation endpoints are working

### Image upload fails

- Verify Cloudinary credentials
- Check file size limits
- Ensure Cloudinary account is active

---

## 📄 License

© 2025 Aura Select. All rights reserved.

---

## 👥 Support

For issues or questions, please contact the development team or create an issue in the repository.

---

## 🎯 Future Enhancements

- Payment integration (Stripe/PayPal)
- Email notifications
- Chat messaging system
- Advanced analytics
- Multi-language support
- Mobile app (Flutter)
- Video portfolio support
- Review and rating system

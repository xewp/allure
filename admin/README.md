# Aura Select Admin Dashboard

Standalone admin application for managing Aura Select models, users, and bookings.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL

4. Start development server:

```bash
npm run dev
```

The admin app will run on **http://localhost:5174**

## Features

- 📊 **Dashboard**: Overview with statistics and activity feed
- 👥 **Users**: Manage users and view their favorites
- 👤 **Models**: Enhanced model management with availability tracking
- 📅 **Bookings**: Booking management system
- 📤 **Upload**: Upload new models to the database

## Tech Stack

- React 18
- Vite
- React Router
- TailwindCSS
- Axios

## Project Structure

```
admin/
├── src/
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   ├── config/          # Configuration files
│   ├── App.jsx          # Main app with routing
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies
```

## Development

- Client app runs on port **5173**
- Admin app runs on port **5174**
- Backend API runs on port **3000**

import express from "express";
import cors from "cors";
import helmetConfig from "./config/helmet.config.js";
import { checkMaintenanceMode } from "./middleware/checkMaintenanceMode.js";
import { log, debugLog } from "./utils/logger.js";
import { requestLogger, devLogger } from "./middleware/requestLogger.js";
import productRoutes from "./routes/productRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import superadminRoutes from './routes/superadminRoutes.js';
import otpAuthRoutes from './routes/otpAuthRoutes.js';
import userApprovalRoutes from './routes/userApprovalRoutes.js';

const app = express();

// Trust proxy - Required for Render deployment and rate limiting
// Render sits behind a proxy, so we need to trust the X-Forwarded-For header
app.set('trust proxy', 1);

// HTTP request logging middleware
app.use(requestLogger);
app.use(devLogger);

// Security headers via Helmet
app.use(helmetConfig);

// CORS configuration with specific origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Local development origins
    const localOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ];
    
    // Parse production frontend URLs from environment variable (comma-separated)
    const productionOrigins = process.env.FRONTEND_URLS 
      ? process.env.FRONTEND_URLS.split(',').map(url => url.trim()).filter(Boolean)
      : [];
    
    // Combine all allowed origins
    const allowedOrigins = [...localOrigins, ...productionOrigins];
    
    // Debug logging (only in debug mode)
    debugLog('CORS', 'Request from origin', { origin, allowedOrigins });
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      log.warn('CORS BLOCKED - Origin not allowed', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Admin routes (bypass maintenance mode)
app.use('/admin/auth', adminAuthRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/admin', userApprovalRoutes);

// Client routes (check maintenance mode first)
app.use("/products", checkMaintenanceMode, productRoutes);
app.use("/models", checkMaintenanceMode, modelRoutes);
app.use("/auth", checkMaintenanceMode, authRoutes);
app.use("/api/otp-auth", checkMaintenanceMode, otpAuthRoutes);
app.use('/api/users', checkMaintenanceMode, userRoutes);
app.use('/api/dashboard', checkMaintenanceMode, dashboardRoutes);
app.use('/api/bookings', checkMaintenanceMode, bookingRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Backend API running"
  });
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler - no stack traces in production
app.use((err, req, res, next) => {
  // Log error with stack trace
  log.error(err.message, { 
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method,
    stack: err.stack 
  });
  
  const statusCode = err.statusCode || 500;
  const response = {
    error: err.message || 'Internal server error',
  };
  
  // Only include stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
});

export default app;

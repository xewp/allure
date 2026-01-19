import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./src/config/db.js";
import app from "./src/app.js";
import { log } from "./src/utils/logger.js";

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  log.server(PORT);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log.warn('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  log.warn('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

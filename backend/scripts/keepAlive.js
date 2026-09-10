import dotenv from 'dotenv';
dotenv.config();

/**
 * Keep-Alive Pinger Script for Render & MongoDB Atlas
 * 
 * Render Free Tier web services automatically spin down (go to sleep) after 15 minutes of inactivity.
 * This script sends a GET request to your backend's /api/health endpoint every 14 minutes (840,000 ms).
 * This prevents both Render from sleeping and MongoDB Atlas connections from dropping.
 * 
 * Usage:
 *   node backend/scripts/keepAlive.js [optional_target_url]
 * 
 * Example:
 *   node backend/scripts/keepAlive.js https://auraselect-backend.onrender.com
 */

const TARGET_URL = process.argv[2] 
  || process.env.BACKEND_URL 
  || process.env.FRONTEND_URL 
  || 'http://localhost:5000';

const HEALTH_ENDPOINT = TARGET_URL.endsWith('/') 
  ? `${TARGET_URL}api/health` 
  : `${TARGET_URL}/api/health`;

// 14 minutes in milliseconds (Render sleeps after 15 minutes)
const PING_INTERVAL_MS = 14 * 60 * 1000;

console.log(`=================================================`);
console.log(`🚀 Starting Keep-Alive Pinger`);
console.log(`🎯 Target Endpoint: ${HEALTH_ENDPOINT}`);
console.log(`⏱️  Interval: Every 14 minutes`);
console.log(`=================================================\n`);

async function pingBackend() {
  const timestamp = new Date().toLocaleString();
  try {
    const response = await fetch(HEALTH_ENDPOINT);
    const data = await response.json().catch(() => ({}));
    
    if (response.ok) {
      console.log(`[${timestamp}] ✅ SUCCESS (${response.status}): Server & DB are awake! DB Status: ${data.database || 'active'}`);
    } else {
      console.warn(`[${timestamp}] ⚠️ WARNING (${response.status}): Server responded but returned error status:`, data);
    }
  } catch (error) {
    console.error(`[${timestamp}] ❌ ERROR: Failed to reach backend at ${HEALTH_ENDPOINT}. Details: ${error.message}`);
  }
}

// Initial ping on start
pingBackend();

// Repeat ping every 14 minutes
setInterval(pingBackend, PING_INTERVAL_MS);

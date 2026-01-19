import morgan from 'morgan';
import chalk from 'chalk';
import { log } from '../utils/logger.js';

// Custom morgan tokens
morgan.token('status-colored', (req, res) => {
  const status = res.statusCode;
  const color =
    status >= 500
      ? chalk.red
      : status >= 400
      ? chalk.yellow
      : status >= 300
      ? chalk.cyan
      : chalk.green;
  return color(status);
});

morgan.token('method-colored', (req) => {
  const method = req.method;
  const colors = {
    GET: chalk.blue,
    POST: chalk.green,
    PUT: chalk.yellow,
    DELETE: chalk.red,
    PATCH: chalk.cyan,
  };
  const colorFn = colors[method] || chalk.white;
  return colorFn(method);
});

// Custom format with colors
const morganFormat = ':method-colored :url :status-colored :response-time ms';

// Morgan middleware with conditional logging
export const requestLogger = morgan(morganFormat, {
  skip: (req) => {
    // Skip health checks and static assets in production
    if (process.env.NODE_ENV === 'production') {
      return req.url === '/health' || req.url.startsWith('/static');
    }
    return false;
  },
  stream: {
    write: (message) => {
      // Remove newline and log as HTTP level
      log.http(message.trim());
    },
  },
});

// Development-only detailed request logger
export const devLogger = (req, res, next) => {
  if (process.env.DEBUG === 'true') {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const details = {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
      };
      
      log.debug('Request completed', details);
    });
  }
  next();
};

export default requestLogger;

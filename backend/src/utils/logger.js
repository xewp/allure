import winston from 'winston';
import chalk from 'chalk';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Environment detection
const isDevelopment = process.env.NODE_ENV !== 'production';
const isDebug = process.env.DEBUG === 'true';

// Custom log levels with colors
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};

// Add colors to winston
winston.addColors(customLevels.colors);

// Custom format for console output with icons
const consoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  const icons = {
    error: '❌',
    warn: '⚠️ ',
    info: '✓',
    http: '→',
    debug: '🔍',
  };

  const icon = icons[level] || '•';
  const ts = chalk.gray(`[${new Date(timestamp).toLocaleTimeString()}]`);
  
  let log = `${ts} ${icon} ${level}: ${message}`;

  // Add stack trace for errors in development
  if (stack && isDevelopment) {
    log += `\n${chalk.red(stack)}`;
  }

  // Add metadata if present
  if (Object.keys(metadata).length > 0 && isDebug) {
    log += `\n${chalk.cyan(JSON.stringify(metadata, null, 2))}`;
  }

  return log;
});

// Create the logger
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: isDevelopment ? (isDebug ? 'debug' : 'http') : 'warn',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    isDevelopment ? colorize() : winston.format.uncolorize(),
    consoleFormat
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
  // Suppress winston's own error handling in production
  exitOnError: false,
});

// Helper methods with emoji prefixes
export const log = {
  error: (message, meta = {}) => logger.error(message, meta),
  warn: (message, meta = {}) => logger.warn(message, meta),
  info: (message, meta = {}) => logger.info(message, meta),
  http: (message, meta = {}) => logger.http(message, meta),
  debug: (message, meta = {}) => logger.debug(message, meta),
  
  // Special formatted logs
  server: (port) => {
    console.log('\n' + chalk.bold.cyan('═'.repeat(50)));
    console.log(chalk.bold.green(`  🚀 Server running on port ${port}`));
    console.log(chalk.gray(`  📍 Environment: ${process.env.NODE_ENV || 'development'}`));
    console.log(chalk.gray(`  🔧 Debug mode: ${isDebug ? 'ON' : 'OFF'}`));
    console.log(chalk.bold.cyan('═'.repeat(50)) + '\n');
  },

  database: (message) => {
    console.log(chalk.bold.green(`  🔥 ${message}`));
  },

  route: (method, path) => {
    const methodColors = {
      GET: chalk.blue,
      POST: chalk.green,
      PUT: chalk.yellow,
      DELETE: chalk.red,
      PATCH: chalk.cyan,
    };
    const coloredMethod = (methodColors[method] || chalk.white)(method.padEnd(6));
    logger.debug(`${coloredMethod} ${path}`);
  },
};

// Debug module for verbose logging
export const debugLog = (category, message, data = null) => {
  if (!isDebug) return;
  
  const categoryColors = {
    CORS: chalk.magenta,
    AUTH: chalk.cyan,
    DB: chalk.blue,
    EMAIL: chalk.yellow,
    VALIDATION: chalk.red,
  };

  const colorFn = categoryColors[category] || chalk.white;
  console.log(
    chalk.gray(`[${new Date().toLocaleTimeString()}]`),
    colorFn(`[${category}]`),
    message
  );
  
  if (data) {
    console.log(chalk.gray(JSON.stringify(data, null, 2)));
  }
};

export default logger;

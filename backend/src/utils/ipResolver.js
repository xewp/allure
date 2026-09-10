/**
 * IP Resolver Utility
 * Extracts the real client IP behind reverse proxies.
 * Supports Cloudflare, Nginx, Railway, Render, Vercel, and generic proxies.
 */

/**
 * Resolve the real client IP address from the request.
 * Priority order:
 *   1. CF-Connecting-IP (Cloudflare)
 *   2. X-Real-IP (Nginx)
 *   3. X-Forwarded-For (first IP in chain — general proxies)
 *   4. req.ip (Express trust proxy)
 *   5. req.socket.remoteAddress (direct connection)
 *
 * @param {import('express').Request} req
 * @returns {string} Resolved IP address
 */
export const resolveClientIP = (req) => {
  // Cloudflare
  const cfIP = req.headers['cf-connecting-ip'];
  if (cfIP) return normalizeIP(cfIP);

  // Nginx / generic
  const realIP = req.headers['x-real-ip'];
  if (realIP) return normalizeIP(realIP);

  // X-Forwarded-For — take the first (leftmost = original client)
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0].trim();
    if (first) return normalizeIP(first);
  }

  // Express trust proxy
  if (req.ip) return normalizeIP(req.ip);

  // Direct connection fallback
  return normalizeIP(req.socket?.remoteAddress || '0.0.0.0');
};

/**
 * Normalize IPv4-mapped IPv6 addresses to plain IPv4.
 * e.g. "::ffff:127.0.0.1" → "127.0.0.1"
 */
const normalizeIP = (ip) => {
  if (!ip) return '0.0.0.0';
  const trimmed = ip.trim();
  if (trimmed.startsWith('::ffff:')) {
    return trimmed.slice(7);
  }
  return trimmed;
};

export default resolveClientIP;

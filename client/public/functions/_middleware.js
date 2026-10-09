// This middleware handles SPA routing for Cloudflare Pages
export async function onRequest(context) {
  try {
    // First, try to fetch the requested asset
    const response = await context.next();
    
    // If the response is successful (e.g., static file found), return it
    if (response.status < 400) {
      return response;
    }
    
    // If not found (404) or other client error, serve index.html for SPA routing
    // This allows React Router to handle the routing
    if (response.status === 404 || (response.status >= 400 && response.status < 500)) {
      return context.env.ASSETS.fetch(new URL("/index.html", context.request.url));
    }
    
    // For any other status, return the original response
    return response;
  } catch {
    // If there's an error, try to serve index.html as a fallback
    return context.env.ASSETS.fetch(new URL("/index.html", context.request.url));
  }
}

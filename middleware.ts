import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // If this is a preflight request, respond immediately
  if (request.method === "OPTIONS") {
    const preflight = NextResponse.json({}, { status: 200 });
    preflight.headers.set("Access-Control-Allow-Origin", "*");
    preflight.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    preflight.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return preflight;
  }

  // For all other requests, continue and attach CORS headers
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}

// Apply middleware to ALL backend API routes
export const config = {
  matcher: "/api/:path*",
};

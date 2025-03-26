/** @format */

import { withAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";

const mockToken = {
  id: "user123",
  email: "test@example.com",
  name: "Test User",
  exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
};

// export default withAuth(
//   function middleware(request) {
//     const mockToken = {
//       id: "user123",
//       email: "test@example.com",
//       name: "Test User",
//       exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
//     };

//     const token = request.nextauth.token;
//     if (!token) {
//       return NextResponse.redirect(new URL("/auth/signin", request.url));
//     } else {
//       if (request.nextUrl.pathname === "/dashboard") {
//         return NextResponse.redirect(
//           new URL("/dashboard/repository/research-library", request.url)
//         );
//       }
//       return NextResponse.next();
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => {
//         return !!token;
//       },
//     },
//   }
// );

export function middleware(request: NextRequest) {
  if (mockToken) {
    if (request.nextUrl.pathname === "/dashboard") {
      return NextResponse.redirect(
        new URL("/dashboard/repository/research-library", request.url)
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

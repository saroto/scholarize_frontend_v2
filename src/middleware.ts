/** @format */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token;
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    } else {
      if (request.nextUrl.pathname === "/dashboard") {
        return NextResponse.redirect(
          new URL("/dashboard/repository/research-library", request.url)
        );
      }
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};

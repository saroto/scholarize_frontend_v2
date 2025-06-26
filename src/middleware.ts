import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";
export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const requestForNextAuth = {
      headers: {
        cookie: request.headers.get("cookie") ?? undefined,
      },
    };
    const session = await getSession({ req: requestForNextAuth });
    if (!session) {
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
      authorized: async ({ token, req }) => {
        const requestForNextAuth = {
          headers: {
            cookie: req.headers.get("cookie") ?? undefined,
          },
        };
        const session = await getSession({ req: requestForNextAuth });
        return !!session?.user;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};

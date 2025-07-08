import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

// export async function middleware(req: NextRequest, event: NextFetchEvent) {
//   const token = await getToken({ req });
//   const isAuthenticated = !!token;

//   console.log(`isAuthenticated: `, isAuthenticated);
//   console.log(`req.nextUrl.pathname: `, req.nextUrl.pathname);

//   if (req.nextUrl.pathname.startsWith("/auth") && isAuthenticated) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   // return NextResponse.redirect(new URL("/auth/signin", req.url));

//   // // @ts-expect-error
//   // return authMiddleware(req, event);
// }

export const config = {
  /*
   * Match all request paths (i.e. protect patch from unauthenticated users)
   * - protects /profile path
   * - protects all paths that start with /admin
   */
  matcher: [
    "/account/:path*",
    "/dashboard/:path*",
    "/my-bets/:path*",
    "/upcoming-events/:path*",
  ],
};

import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";

export default auth((req) => {
  const currentPath = req.nextUrl.pathname;
  if (!req.auth) {
    return NextResponse.redirect(
      new URL(`/login?next=${currentPath}`, req.url)
    );
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

export async function middleware(request: NextRequest) {
  const session = await auth();
  //console.log("getting session", session?.user);
  //const isAuthenticated = !!session?.user;
  const currentUser = session?.user
  //console.log("currentUser", currentUser);

  if (!currentUser && !request.nextUrl.pathname.startsWith('/login')) {
    if (!request.nextUrl.pathname.startsWith('/register'))
      return Response.redirect(new URL('/login', request.url))
  }

  if (currentUser && request.nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/', request.url))
  }

  if (currentUser && request.nextUrl.pathname.startsWith('/register')) {
    return Response.redirect(new URL('/', request.url))
  }
}
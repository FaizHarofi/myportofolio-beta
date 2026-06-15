import { NextResponse, type NextRequest } from "next/server";

const IMAGE_EXT = /\.(svg|png|jpe?g|gif|webp|avif|ico)$/i;

const FAVICON_PATH = "/jsm-logo.png";

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  "http://localhost:3000",
  "https://localhost:3000",
];

function isAllowedOrigin(referer: string | null): boolean {
  if (!referer) return false;
  return ALLOWED_ORIGINS.some((origin) => referer.startsWith(origin));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === FAVICON_PATH) return NextResponse.next();

  if (!IMAGE_EXT.test(pathname)) return NextResponse.next();

  const referer = request.headers.get("referer");

  if (isAllowedOrigin(referer)) return NextResponse.next();

  return new NextResponse("Forbidden", {
    status: 403,
    headers: { "Content-Type": "text/plain" },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

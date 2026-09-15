import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Lakukan penyegaran session di setiap route yang sesuai matcher
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Lindungi semua route kecuali aset statis dan API internal Next.js
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

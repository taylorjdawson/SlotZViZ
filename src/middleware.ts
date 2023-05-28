import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  //   const cookieStore = cookies()
  //   const jwt = cookieStore.get("jwt")
  //   console.log({ jwt })
  console.log("middleware", req.headers)
  const supabase = createMiddlewareClient({ req, res })
  const session = await supabase.auth.getSession()
  console.log("refreshing session", { session })
  return res
}

export const config = {
  matcher: ["/slot"],
}

import { TABLE } from "@/lib/constants"
import { supabaseAdmin } from "@/lib/db"
import { createMessageToSign, getNonce } from "@/lib/utils"
import { NextResponse } from "next/server"
import type { Address } from "viem"
import { isAddress } from "viem"

export async function POST(request: Request) {
  const { address } = ((await request.json()) as { address: Address }) ?? {}

  if (!isAddress(address)) {
    return new NextResponse("not today satan", {
      status: 403,
      statusText: "not today satan",
    })
  }

  const nonce = getNonce()

  const message = createMessageToSign({ nonce, address })

  await supabaseAdmin
    .from(TABLE.USERS)
    .update({
      auth: {
        nonce: getNonce(),
        message,
        lastAuth: new Date().toISOString(),
        lastAuthStatus: "pending",
      },
    })
    .eq("address", address)

  return NextResponse.json({ nonce, message })
}

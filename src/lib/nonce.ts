"use server"

import { TABLE } from "@/lib/constants"
import { supabaseAdmin } from "@/lib/db"
import { createMessageToSign, getNonce } from "@/lib/utils"
import type { Address } from "viem"

export async function genNonce(address: Address) {
  const nonce = getNonce()

  const message = createMessageToSign({ nonce, address })

  await supabaseAdmin
    .from(TABLE.USERS)
    .update({
      auth: {
        nonce,
        message,
        lastAuth: new Date().toISOString(),
        lastAuthStatus: "pending",
      },
    })
    .eq("address", address)

  return { nonce, message }
}

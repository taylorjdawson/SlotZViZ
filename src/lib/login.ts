"use server"

import { TABLE } from "@/lib/constants"
import { supabaseAdmin } from "@/lib/db"
import { getNonce } from "@/lib/utils"
import { cookies } from "next/headers"
import { Address, Hash } from "viem"
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET

import { createClient } from "@supabase/supabase-js"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

export async function login({
  signedMsg,
  address,
}: {
  signedMsg: Hash
  address: Address
}) {
  const { data } = await supabaseAdmin
    .from(TABLE.USERS)
    .select("auth,message")
    .eq("address", address)

  console.log("login", { data })
  let user
  if (!data) {
    // New user, so lets create one!
    const { data, error } =
      (await supabaseAdmin.auth.admin.createUser({
        email: `${address}@slotzviz.io`,
        email_confirm: true,
        user_metadata: { address },
      })) ?? {}
    ;({ user } = data)
    if (user) {
      const { status } = await supabaseAdmin.from(TABLE.USERS).insert({
        address,
        auth: {
          nonce: getNonce(), // update the nonce, so it can't be reused
          lastAuth: new Date().toISOString(),
          lastAuthStatus: "success",
        },
        user_id: user?.id, // same uuid as auth.users table
      })
    }
  } else {
  }

  const token = jwt.sign(
    {
      address: address, // this will be read by RLS policy
      sub: user?.id,
      aud: "authenticated",
    },
    JWT_SECRET ?? "",
    { expiresIn: 60 * 2 }
  )

  return token
}

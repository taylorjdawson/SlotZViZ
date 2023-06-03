"use server"

import { TABLE } from "@/lib/constants"
import { supabaseAdmin } from "@/lib/db"
import { getNonce, verifySignedMessage } from "@/lib/utils"
import { cookies } from "next/headers"
import { Address, Hash } from "viem"
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET

import { createClient } from "@supabase/supabase-js"
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs"
import { getVerifiedAddress } from "./web3"

export async function login({
  signedMsg,
  address,
  nonce,
}: {
  signedMsg: Hash
  address: Address
  nonce: string
}) {
  const { data } = await supabaseAdmin
    .from(TABLE.USERS)
    .select("*")
    .eq("address", address)

  let userId = data?.[0].user_id
  if (!userId) {
    // New user, so lets create one!
    const { data, error } =
      (await supabaseAdmin.auth.admin.createUser({
        email: `${address}@slotzviz.io`,
        email_confirm: true,
        user_metadata: { address },
      })) ?? {}

    if (data.user?.id) {
      const { status } = await supabaseAdmin.from(TABLE.USERS).insert({
        address,
        auth: {
          nonce: getNonce(), // update the nonce, so it can't be reused
          lastAuth: new Date().toISOString(),
          lastAuthStatus: "success",
        },
        user_id: data.user?.id, // same uuid as auth.users table
      })
    }
  } else {
    // User exists, verify the signed message and nonce
    const { nonce, message } = data?.[0].auth

    const verifiedAddress = getVerifiedAddress(address, message, signedMsg)
    if (!verifiedAddress) {
      throw new Error("Message verification failed")
    }

    // Update the nonce and last authentication time for the existing user
    const { error } = await supabaseAdmin
      .from(TABLE.USERS)
      .update({
        auth: {
          nonce: getNonce(),
          lastAuth: new Date().toISOString(),
          lastAuthStatus: "success",
        },
      })
      .eq("address", verifiedAddress)
    if (error) {
      throw new Error("Error updating user: " + error.message)
    }
  }

  const token = jwt.sign(
    {
      address, // this will be read by RLS policy
      sub: userId,
      aud: "authenticated",
    },
    JWT_SECRET ?? "",
    { expiresIn: 60 * 24 }
  )

  return token
}

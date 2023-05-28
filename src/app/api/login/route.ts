import { TABLE } from "@/lib/constants"
import { supabaseAdmin } from "@/lib/db"
import { getNonce } from "@/lib/utils"
import { getVerifiedAddress } from "@/lib/web3"
import { NextResponse } from "next/server"
import { Address, Hash } from "viem"
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request: Request) {
  const { signedMsg, address } =
    ((await request.json()) as {
      signedMsg: Hash
      address: Address
    }) ?? {}

  if (!signedMsg?.startsWith("0x")) {
    return new NextResponse("not today satan", {
      status: 403,
      statusText: "not today satan",
    })
  }

  const { data } = await supabaseAdmin
    .from(TABLE.USERS)
    .select("auth,message")
    .eq("address", address)

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
    if (!user) {
      console.error("Critical error, could not create user in auth.user table", error)
      return new NextResponse("uh oh spaghetti-O", {
        status: 500,
        statusText: "uh oh spaghetti-O",
      })
    }

    const { status } = await supabaseAdmin.from(TABLE.USERS).insert({
      address,
      auth: {
        nonce: getNonce(), // update the nonce, so it can't be reused
        lastAuth: new Date().toISOString(),
        lastAuthStatus: "success",
      },
      user_id: user?.id, // same uuid as auth.users table
    })

    if (status !== 201) {
      console.error("Critical error, could not create user in users table", error)
      return new NextResponse("uh oh spaghetti-O", {
        status: 500,
        statusText: "uh oh spaghetti-O",
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

  // 1. verify the signed message matches the requested address
  //   getVerifiedAddress(address, signedMsg, signedMsg);

  // 2. select * from public.user table where address matches
  // 3. verify the nonce included in the request matches what's  already in public.users table for that address
  // 4. if there's no public.users.id for that address, then you need to create a user in the auth.users table

  return NextResponse.json({ token })
}

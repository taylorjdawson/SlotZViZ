
const run = async () => {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log(process.env);
  const { createClient } = await import("@supabase/supabase-js")
  const { createPublicClient, createWalletClient, http } = await import("viem")
  const { privateKeyToAccount } = await import("viem/accounts")
  const { mainnet } = await import("viem/chains")

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  const account = privateKeyToAccount(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  )

  const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  })

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  })

  console.log("getting nonce & message...")

  const { nonce, message } =
    (await (
      await fetch("http://localhost:3000/api/nonce", {
        method: "POST",
        body: JSON.stringify({ address: account.address }),
      })
    ).json()) ?? {}
  console.log({ nonce, message })
  if (!nonce) {
    console.log("no nonce!?")
    process.exit(1)
  }

  const sig = await account.signMessage({ message })

  console.log("signed message", sig)

  const response = await (
    await fetch("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify({ address: account.address, signedMsg: sig, nonce }),
    })
  ).json()

  console.log("attempted log in", response)
}

run()

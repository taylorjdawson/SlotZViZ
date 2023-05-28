const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_ANON_KEY) throw new Error("Missing env.SUPABASE_ANON_KEY")
if (!SUPABASE_URL) throw new Error("Missing env.SUPABASE_URL")

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

export default supabase

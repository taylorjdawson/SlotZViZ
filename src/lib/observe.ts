import { getAddress } from "viem"
import supabase from "./supabaseClient"

async function toggleObserver(address: string, slot: string) {
  // First, check if the row exists
  let { data: existing, error } = await supabase
    .from("observers")
    .select("address, slot")
    .eq("address", address)
    .eq("slot", slot)

  // If there's an error in the select query, log it and return
  if (error) {
    console.error("Error checking if observer exists:", error)
    return
  }

  // If the row exists, delete it
  if (existing && existing.length > 0) {
    let { error } = await supabase
      .from("observers")
      .delete()
      .eq("address", address)
      .eq("slot", slot)

    if (error) {
      console.error("Error deleting observer:", error)
    } else {
      console.log("Observer deleted successfully")
    }
  }
  // If the row does not exist, insert it
  else {
    console.log("inserting...")
    let { error } = await supabase.from("observers").insert([{ address, slot }])

    if (error) {
      console.error("Error inserting observer:", error)
    } else {
      console.log("Observer inserted successfully")
    }
  }
}

// Replace 'your_address' and 'your_slot' with the actual address and slot.
export const observe = async (address: string, slot: string) => {
  const { getAddress } = await import("viem")
  await toggleObserver(getAddress(address), slot)

  // const { data, error } = await supabase.rpc("observe", {
  //   p_address: address,
  //   p_slot: parseInt(slot),
  // })

  // if (error) {
  //   console.log("Error: ", error)
  // } else {
  //   console.log("Operation successful")
  // }

  // const { getAddress } = await import("viem")

  // console.log({ address })
  //   const cookieStore = cookies()

  //   const { value: token } = cookieStore.get("jwt") ?? { value: "" }
  // const supabase = createServerActionClient({ cookies })

  // const session = await supabase.auth.getUser()
  //   cookies: () => ({
  //     get: (name) => ({ value: get(name) }),
  //     // Include the 'Authorization' header with the JWT token for all requests
  //     headers: () => ({ Authorization: `Bearer ${token}` }),
  //   }),
  // })

  //   const supabase = getSupbaseClient(token)

  // const res = await supabase.from("observers").upsert({
  //   address: getAddress(address),
  //   slot,
  // })
  // console.log(session, address, res)
}

export const getObservers = async (slots: string[]): Promise<number> => {
  console.log("trying to observe slot", slots[0])
  let { data, error } = await supabase
    .from("observers_per_slot")
    .select("*")
    .in("slot", slots)

  if (error) {
    console.error("Error: ", error)
  }
  return data && !error ? data[0]?.total_observers ?? 0 : 0
}

export const isObserver = async (address: string, slot: string) => {
  const { data, error } = await supabase
    .from("observers")
    .select("address,slot")
    .eq("address", getAddress(address))
    .eq("slot", slot)

  if (error) {
    console.error("Error checking if observer:", error)
    return null
  }

  return data.length > 0
}

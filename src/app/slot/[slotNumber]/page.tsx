import SearchBox from "@/components/SearchBox"
import Slots from "@/components/Slots"

import { getBlockBids } from "@/lib/utils"
import { getObservers } from "@/lib/observe"

export default async function Slot({
  params: { slotNumber },
  searchParams: { slots },
}: {
  params: { slotNumber: string }
  searchParams: { slots: string }
}) {
  const slotNumbers = [slotNumber, ...(slots ? slots?.split(",") : [])]
  let slotz = await Promise.all(
    slotNumbers.map(async (slot) => ({
      id: slot,
      bids: await getBlockBids(slot),
      observers: await getObservers([slot]),
    }))
  )
  console.log({ slotz })
  return (
    <>
      <div className=" flex h-full w-full">
        <Slots slots={slotz} />
      </div>
      <SearchBox />
    </>
  )
}

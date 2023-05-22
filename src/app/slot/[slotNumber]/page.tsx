import SearchBox from "@/components/SearchBox";
import Slots from "@/components/Slots";
import { Bids } from "@/lib/types";

import { getBlockBids } from "@/lib/utils";

export default async function Slot({
  params: { slotNumber },
  searchParams: { slots },
}: {
  params: { slotNumber: string };
  searchParams: { slots: string };
}) {
  const allSlots = [slotNumber, ...(slots ? slots?.split(",") : [])];
  
  const bids: Bids = await allSlots.reduce(async (promiseAcc, slot) => {
    const acc = await promiseAcc;
    const bids = await getBlockBids(slot);
    return { ...acc, [slot]: bids };
  }, Promise.resolve({}));

  return (
    <>
      <div className=" flex h-full w-full">
        <Slots slots={allSlots} bids={bids} />
      </div>
      <SearchBox />
    </>
  );
}

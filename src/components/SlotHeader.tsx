import Link from "next/link"

interface SlotHeaderProps {
  slot: number
  slots: string[]
  index: number
}

const SlotHeader = ({ slot, slots, index }: SlotHeaderProps) => {
  const prevSlot =
    index === 0 ? `/slot/${slot - 1}` : `/slot/${slots[0]}?slots=${slot - 1}`
  const nextSlot =
    index === 0 ? `/slot/${slot + 1}` : `/slot/${slots[0]}?slots=${slot + 1}`
  return (
    <>
      <div className="flex w-full items-center space-x-10 justify-center">
        <Link className="opacity-50" href={prevSlot}>
          {slot - 1}
        </Link>
        <div className="text-center font-bold">{slot}</div>
        <Link className="opacity-50" href={nextSlot}>
          {slot + 1}
        </Link>
      </div>
      {/* {index === 0 ? (
        <Link className="opacity-50" href={`/slot/${slot}?slots=${slot - 1}`}>
          Compare
        </Link>
      ) : (
        ""
      )} */}
    </>
  )
}

export default SlotHeader

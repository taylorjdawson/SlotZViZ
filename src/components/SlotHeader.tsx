"use client";

import Link from "next/link";

interface SlotHeaderProps {
  slot: number;
}

const SlotHeader = ({ slot }: SlotHeaderProps) => {
  return (
    <div className="flex w-full items-center space-x-10 justify-center">
      <Link className="opacity-50" href={`/slot/${slot - 1}`}>{slot - 1}</Link>
      <div className="text-center font-bold">{slot}</div>
      <Link className="opacity-50" href={`/slot/${slot + 1}`}>{slot + 1}</Link>
    </div>
  );
};

export default SlotHeader;

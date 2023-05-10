import React, { useState } from "react";

interface SlotComponentProps {
  slot: string;
}

const SlotComponent: React.FC<SlotComponentProps> = (props) => {
  const [slot, setSlot] = useState<number>(parseInt(props.slot));

  return (
    <div className="flex justify-center items-center space-x-4">
      <button className="opacity-60" onClick={() => setSlot(slot - 1)}>
        {slot - 1}
      </button>

      <div className="text-center font-bold">{slot}</div>

      <button className="opacity-60" onClick={() => setSlot(slot + 1)}>
        {slot + 1}
      </button>
    </div>
  );
};

export default SlotComponent;

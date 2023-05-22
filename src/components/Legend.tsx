interface LegendProps {
  slot: number;
  slots: string[];
  index: number;
}

const Legend = ({ slot, slots, index }: LegendProps) => {
  const prevSlot =
    index === 0 ? `/slot/${slot - 1}` : `/slot/${slots[0]}?slots=${slot - 1}`;
  const nextSlot =
    index === 0 ? `/slot/${slot + 1}` : `/slot/${slots[0]}?slots=${slot + 1}`;
  return <></>;
};

export default Legend;

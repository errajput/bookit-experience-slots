"use client";

interface Slot {
  _id: string;
  date: string;
  time: string;
  capacity: number;
  bookedCount: number;
}

interface SlotButtonProps {
  slot: Slot;
  selected: boolean;
  onClick: () => void;
}

export default function SlotButton({
  slot,
  selected,
  onClick,
}: SlotButtonProps) {
  const soldOut = slot.bookedCount >= slot.capacity;

  return (
    <button
      onClick={onClick}
      disabled={soldOut}
      className={`text-sm px-3 py-2 rounded-md border ${
        selected ? "bg-yellow-300" : "bg-white"
      } ${soldOut ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
    >
      {slot.date} {slot.time}
      <div className="text-xs text-gray-500">
        {slot.bookedCount}/{slot.capacity}
      </div>
    </button>
  );
}

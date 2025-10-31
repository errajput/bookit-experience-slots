"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getExperience } from "@/services/experience.service";
import { useParams, useRouter } from "next/navigation";
import { Experience } from "@/lib/types";
import { FaArrowLeft } from "react-icons/fa6";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";

export default function Details() {
  const { id } = useParams();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [experience, setExperience] = useState<Experience | null | undefined>(
    undefined
  );

  const handleCheckout = () => {
    const slotId = experience?.slots?.find(
      (s) => s.date === date && s.time === time
    )?._id;
    if (slotId && id) {
      const checkoutData = { quantity, subtotal, taxes, total };
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      router.push(`/checkout/?experience=${id}&slot=${slotId}`);
    }
  };

  useEffect(() => {
    if (typeof id === "string") {
      (async () => {
        try {
          const data = await getExperience(id);
          setExperience(data || null);
          if (data?.slots?.length) setDate(data.slots[0].date);
        } catch (err) {
          console.error(err);
          setExperience(null);
        }
      })();
    }
  }, [id]);

  if (experience === undefined)
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;

  if (experience === null)
    return (
      <p className="text-center text-red-500 mt-10">Experience not found</p>
    );

  const dates = Array.from(
    new Set(experience?.slots?.map((s) => s.date))
  ).sort();
  const selectedSlots = experience?.slots?.filter((s) => s.date === date);

  const price = experience.price || 0;
  const taxes = Math.round(price * 0.059);
  const subtotal = price * quantity;
  const total = subtotal - taxes;

  const handleIncrement = () => {
    if (quantity < 6) setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="max-w-6xl mx-auto p-3">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="p-3 flex items-center gap-2 text-black hover:text-black transition cursor-pointer"
      >
        <FaArrowLeft size={18} />
        <span className="text-sm font-medium">Details</span>
      </button>

      <div className="max-w-6xl mx-auto p-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2">
            <Image
              src={experience.image || ""}
              alt={experience.title || ""}
              width={765}
              height={381}
              className="w-[765px] rounded-xl h-[381px] md:h-80 object-cover"
            />

            <h2 className="text-[24px] font-inter font-medium mt-5">
              {experience.title}
            </h2>
            <p className="text-[#6C6C6C] text-sm mt-2">
              {experience.description}
            </p>

            {/* DATE SELECTION */}
            <div className="mt-8">
              <h4 className="text-[18px] font-medium mb-3">Choose date</h4>
              <div className="flex flex-wrap gap-3">
                {dates.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDate(d);
                      setTime("");
                    }}
                    className={`cursor-pointer px-5 py-2 rounded-md border text-[15px] font-medium transition-all ${
                      d === date
                        ? "bg-yellow-300 text-black border-yellow-400"
                        : "bg-white border-gray-300 text-[#838383]"
                    }`}
                  >
                    {formatDate(d)}
                  </button>
                ))}
              </div>
            </div>

            {/* TIME SELECTION */}
            <div className="mt-8">
              <h4 className="text-[18px] font-medium mb-3">Choose time</h4>
              <div className="flex flex-wrap gap-3">
                {selectedSlots?.map((slot) => {
                  const isSoldOut = slot.bookedCount >= slot.capacity;
                  const left = slot.capacity - slot.bookedCount;

                  return (
                    <button
                      key={slot._id}
                      disabled={isSoldOut}
                      onClick={() => setTime(slot.time)}
                      className={`cursor-pointer flex items-center gap-1 px-5 py-2 rounded-md border text-[15px] font-medium transition-all ${
                        isSoldOut
                          ? "bg-[#E5E5E5] text-[#6C6C6C] border-[#E5E5E5] cursor-not-allowed"
                          : slot.time === time
                          ? "bg-[#FFD93B] text-black border-[#FFD93B]"
                          : "bg-white border-[#D9D9D9] text-[#838383] hover:border-black/20"
                      }`}
                    >
                      <span>{formatTime(slot.time)}</span>
                      {!isSoldOut && (
                        <span className="text-[13px] text-[#FF3B30] ml-1">
                          {left} left
                        </span>
                      )}
                      {isSoldOut && (
                        <span className="text-[13px] text-[#6C6C6C] ml-1">
                          Sold out
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[13px] text-[#838383] mt-2">
                All times are in IST (GMT +5:30)
              </p>
            </div>

            {/* ABOUT SECTION */}
            <div className="mt-6">
              <h4 className="font-medium text-[18px] mb-2">About</h4>
              <p className="text-[12px] font-regular bg-[#EEEEEE] rounded p-2 text-[#838383]">
                Scenic routes, trained guides, and safety briefing. Minimum age
                10.
              </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="bg-[#EFEFEF] p-6 rounded-xl shadow-sm h-fit">
            <div className="space-y-3 text-[16px] text-[#656565]">
              {/* Price Info */}
              <div className="flex justify-between">
                <span>Starts at</span>
                <span className="font-medium text-[#161616]">₹{price}</span>
              </div>

              {/* Quantity Section */}
              <div className="flex justify-between items-center">
                <span>Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className={`px-2 border border-[#C9C9C9] text-[#161616] transition ${
                      quantity <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    -
                  </button>

                  {/* Quantity Display */}
                  <span className="text-[#161616] min-w-5 text-center">
                    {quantity}
                  </span>

                  {/* Increment Button */}
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= 6}
                    className={`px-2 border border-[#C9C9C9] text-[#161616] transition ${
                      quantity >= 6
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#161616]">₹{subtotal}</span>
              </div>

              {/* Taxes */}
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="text-[#161616]">₹{taxes}</span>
              </div>

              <hr className="text-[#D9D9D9]" />

              {/* Total */}
              <div className="flex justify-between font-medium text-[20px] text-[#161616]">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleCheckout}
                disabled={!time}
                className={` w-full mt-3 py-2 rounded-lg font-medium transition ${
                  time
                    ? "bg-yellow-400 hover:bg-yellow-500 text-[#161616] cursor-pointer"
                    : "bg-[#D7D7D7] text-[#7F7F7F] cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

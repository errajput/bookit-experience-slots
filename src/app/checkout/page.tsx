"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Experience, Slot, BookingPayload } from "@/lib/types";
import { FaArrowLeft } from "react-icons/fa6";
import { formatTime } from "@/utils/formatTime";
import {
  bookExperience,
  getExperience,
  validatePromo,
} from "@/services/experience.service";

export default function CheckoutPage() {
  const search = useSearchParams();
  const router = useRouter();

  const experienceId = search.get("experience") || "";
  const slotId = search.get("slot") || "";

  const [experience, setExperience] = useState<Experience | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(1);
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);

  const [promo, setPromo] = useState("");
  const [promoValid, setPromoValid] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutData");
    if (stored) {
      const data = JSON.parse(stored);
      setQty(data.quantity);
      setSubtotal(data.subtotal);
      setTaxes(data.taxes);
      setTotal(data.total);
    }
  }, []);

  // ==========================
  // LOAD EXPERIENCE & SLOT
  // ==========================
  useEffect(() => {
    async function load() {
      if (!experienceId) return;
      try {
        const data = await getExperience(experienceId);
        setExperience(data);

        if (slotId) {
          const s = data?.slots?.find((x: Slot) => x._id === slotId);
          setSlot(s || null);
        }
      } catch (err: unknown) {
        console.error("Error loading experience:", err);
      }
    }
    load();
  }, [experienceId, slotId]);

  // ==========================
  // APPLY PROMO
  // ==========================
  async function applyPromo() {
    if (!promo) return;

    try {
      const data = await validatePromo(promo);

      if (data.valid) {
        setPromoValid(data.discount ?? 0);
        setError(null);
      } else {
        setPromoValid(null);
        setError("Invalid promo code");
      }
    } catch {
      setError("Promo validation failed");
    }
  }

  //
  const finalTotal = total - (promoValid || 0);

  // ==========================
  // SUBMIT BOOKING
  // ==========================
  async function submitBooking() {
    if (!name || !email || !agree) {
      setError("Please fill all required fields and accept policy");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email");
      return;
    }

    const payload: BookingPayload = {
      experienceId,
      slotId,
      name,
      email,
      qty,
      promoCode: promo || null,
      totalPrice: finalTotal,
    };

    setLoading(true);
    try {
      const booking = await bookExperience(payload);
      router.push(`/confirmation?refId=${booking._id}`);
    } catch (error) {
      console.log("Error", error);
      setError("Booking failed");
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // JSX
  // ==========================
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-black hover:text-gray-700 transition mb-4"
      >
        <FaArrowLeft size={18} />
        <span className="text-sm sm:text-base font-medium">Checkout</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 bg-[#EFEFEF] p-5 sm:p-6 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="block text-sm text-[#5B5B5B]">Full name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full h-[42px] rounded-md p-3 text-sm bg-[#DDDDDD] text-[#727272] focus:outline-none"
              />
            </div>
            {/* EMAIL */}
            <div>
              <label className="block text-sm text-[#5B5B5B]">Email</label>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full h-[42px] rounded-md p-3 text-sm bg-[#DDDDDD] text-[#727272] focus:outline-none"
              />
            </div>
          </div>

          {/* PROMO CODE */}
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Promo code"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="flex-1 h-[42px] rounded-md p-3 text-sm bg-[#DDDDDD] text-[#727272] focus:outline-none"
              />
              <button
                onClick={applyPromo}
                className="w-full sm:w-[90px] bg-[#161616] text-white text-sm rounded-md py-2 hover:bg-gray-800 transition"
              >
                Apply
              </button>
            </div>

            {promoValid && (
              <p className="text-sm text-green-600 mt-2">
                Promo applied: ₹{promoValid} off
              </p>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>

          {/* TERMS */}
          <div className="mt-4 flex items-start sm:items-center gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="cursor-pointer mt-1 sm:mt-0"
            />
            <label className="text-xs sm:text-sm text-[#5B5B5B]">
              I agree to the terms and safety policy
            </label>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="bg-[#EFEFEF] p-5 sm:p-6 rounded-xl h-auto lg:h-[349px]">
          <div className="space-y-3 text-sm text-[#656565]">
            <div className="flex justify-between">
              <span>Experience</span>
              <span className="text-[#161616]">{experience?.title || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span className="text-[#161616]">{slot?.date || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Time</span>
              <span className="text-[#161616]">
                {formatTime(slot?.time || "—")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Qty</span>
              <span className="px-2 text-[#161616]">{qty}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#161616]">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="text-[#161616]">₹{taxes}</span>
            </div>

            {promoValid && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{promoValid}</span>
              </div>
            )}

            <hr className="border-[#ddd]" />

            <div className="flex justify-between font-medium text-base sm:text-lg text-[#161616]">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={submitBooking}
              disabled={loading}
              className={`cursor-pointer w-full mt-4 py-2 rounded-md font-medium transition text-black ${
                loading
                  ? "bg-yellow-300 opacity-70 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500"
              }`}
            >
              {loading ? "Processing..." : "Pay and Confirm"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

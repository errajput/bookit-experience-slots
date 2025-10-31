"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import { Experience, Slot, BookingPayload } from "@/lib/types";
import { AxiosError } from "axios";
import { FaArrowLeft } from "react-icons/fa6";
import { formatDate } from "@/utils/formatDate";

export default function CheckoutPage() {
  const search = useSearchParams();
  const router = useRouter();

  const experienceId = search.get("experience") || "";
  const slotId = search.get("slot") || "";

  const [experience, setExperience] = useState<Experience | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const qtyFromParams = Number(search.get("qty")) || 1;
  const [qty, setQty] = useState(qtyFromParams);
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
    const stored = localStorage.getItem("checkoutData");
    if (stored) {
      const data = JSON.parse(stored);
      setQty(data.qty);
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
        const res = await API.get<{ data: Experience }>(
          `/experiences/${experienceId}`
        );
        const data = res.data.data;
        setExperience(data);

        if (slotId) {
          const s = data?.slots?.find((x: Slot) => x._id === slotId);
          setSlot(s || null);
        }
      } catch (err: unknown) {
        const error = err as AxiosError;
        console.error("Error loading experience:", error);
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
      const res = await API.post<{ valid: boolean; discount: number }>(
        "/promo/validate",
        { code: promo }
      );

      if (res.data.valid) {
        setPromoValid(res.data.discount ?? 0);
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
      const res = await API.post<{ data: { _id: string } }>(
        "/bookings",
        payload
      );
      const booking = res.data.data;
      router.push(`/confirmation/${booking._id}`);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error?: string }>;
      setError(error.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // JSX
  // ==========================
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="p-3 flex items-center gap-2 text-black hover:text-black transition cursor-pointer"
      >
        <FaArrowLeft size={18} />
        <span className="text-sm font-medium">Checkout</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 h-[200px] bg-[#EFEFEF] p-5 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="block text-[14px] font-regular text-[#5B5B5B]">
                Full name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full h-[42px]  rounded-md p-3 text-[14px] bg-[#DDDDDD] text-[#727272] focus:outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[14px] font-regular text-[#5B5B5B]">
                Email
              </label>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full h-[42px] rounded-md p-3 text-[14px] bg-[#DDDDDD] text-[#727272] focus:outline-none"
              />
            </div>
          </div>

          {/* PROMO CODE */}
          <div className="mt-3">
            <div className="flex gap-3 mt-1">
              <input
                type="text"
                placeholder="Promo code"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="flex-1 h-[42px] rounded-md p-3 text-[14px] bg-[#DDDDDD] text-[#727272] focus:outline-none"
              />
              <button
                onClick={applyPromo}
                className="cursor-pointer w-[71px] bg-[#161616] text-white px-3 text-[14px] rounded-lg hover:bg-gray-800 transition"
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
          <div className="mt-3 flex items-center gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="cursor-pointer"
            />
            <label className="text-[12px] text-[#5B5B5B]">
              I agree to the terms and safety policy
            </label>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="bg-[#EFEFEF] p-6 rounded-xl h-[349px]">
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
                {formatDate(slot?.time || "—")}
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

            <div className="flex justify-between font-medium text-[18px] text-[#161616]">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={submitBooking}
              disabled={loading}
              className={` cursor-pointer w-full mt-4 py-2 rounded-md text-black font-medium transition ${
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

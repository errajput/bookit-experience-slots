"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "../../lib/api";
import { Experience, Slot, BookingPayload } from "../../lib/types";
import { AxiosError } from "axios";

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
  const [promo, setPromo] = useState("");
  const [promoValid, setPromoValid] = useState<number | null>(null); // discount
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        {
          code: promo,
        }
      );

      if (res.data.valid) {
        const discount = res.data.discount ?? 0;
        setPromoValid(discount);
        setError(null);
      } else {
        setPromoValid(null);
        setError("Invalid promo code");
      }
    } catch (err: unknown) {
      console.error("Promo validation failed:", err);
      setError("Promo validation failed");
    }
  }

  // ==========================
  // COMPUTE TOTAL
  // ==========================
  function computeTotal() {
    const base = (experience?.price || 0) * qty;
    if (promoValid) {
      return Math.max(0, base - promoValid); // assuming flat discount
    }
    return base;
  }

  // ==========================
  // SUBMIT BOOKING
  // ==========================
  async function submitBooking() {
    setError(null);

    if (!name || !email || !experienceId || !slotId) {
      setError("Please fill required fields and select slot");
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
      totalPrice: computeTotal(),
    };

    setLoading(true);
    try {
      const res = await API.post<{ data: { _id: string } }>("/bookings", {
        ...payload,
        phone: undefined,
      });

      const booking = res.data.data;
      router.push(`/confirmation/${booking._id}`);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error?: string }>;
      console.error(error);
      setError(error.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // JSX
  // ==========================
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <label className="block text-sm font-medium">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-2 rounded border"
            />

            <label className="block text-sm font-medium mt-4">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-2 rounded border"
            />

            <label className="block text-sm font-medium mt-4">Promo code</label>
            <div className="flex gap-2 mt-2">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="flex-1 p-2 rounded border"
              />
              <button
                onClick={applyPromo}
                className="bg-gray-800 text-white px-4 rounded hover:bg-gray-700 transition"
              >
                Apply
              </button>
            </div>

            {promoValid !== null && (
              <p className="text-sm text-green-600 mt-2">
                Applied: ₹{promoValid} off
              </p>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium">Order Summary</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Experience</span>
              <span>{experience?.title || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time</span>
              <span>{slot ? `${slot.date} • ${slot.time}` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Qty</span>
              <span>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-2 border rounded"
                >
                  -
                </button>
                <span className="px-2">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-2 border rounded"
                >
                  +
                </button>
              </span>
            </div>

            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{computeTotal()}</span>
            </div>

            <button
              disabled={loading}
              onClick={submitBooking}
              className={`w-full mt-4 bg-brand py-2 rounded text-white ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-brand-dark"
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

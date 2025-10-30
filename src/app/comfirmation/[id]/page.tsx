"use client";
import Link from "next/link";

export default function Confirmation() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mx-auto">
        ✓
      </div>
      <h2 className="text-2xl font-semibold mt-4">Booking Confirmed</h2>
      <p className="mt-2 text-sm text-gray-600">Ref ID: {""}</p>
      <div className="mt-6">
        <Link href="/" className="inline-block bg-gray-100 px-4 py-2 rounded">
          Go Home
        </Link>
        {/* <a href="/" className="inline-block bg-gray-100 px-4 py-2 rounded">Back to Home</a> */}
      </div>
    </div>
  );
}

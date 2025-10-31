"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Confirmation() {
  const search = useSearchParams();
  const refId = search.get("refId") || "Not Found";

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="inline-flex items-center justify-center ">
        <Image
          src="/ep_success-filled.png"
          alt="Confirmation"
          width={80}
          height={80}
          className="w-20 rounded-xl h-20"
        />
      </div>
      <h2 className="text-[32px] font-medium mt-4 text-[#161616]">
        Booking Confirmed
      </h2>
      <p className="mt-2 text-[20px] text-[#656565]">Ref ID: {refId}</p>
      <div className="  mt-6">
        <Link
          href="/"
          className="cursor-pointer inline-block bg-[#E3E3E3] text-[#656565] text-[16px] px-4 py-2 rounded hover:bg-gray-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

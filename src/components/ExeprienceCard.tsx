"use client";
import Image from "next/image";
import { Experience } from "../lib/types";

import Link from "next/link";

export default function ExperienceCard({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <div className="bg-[#F0F0F0] w-[270px] h-[312px] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      {/* Image Section */}
      <div className="relative w-full h-[180px]">
        {experience.image ? (
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-[180px] bg-gray-200" />
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <h3 className="font-inter font-medium text-gray-900 text-[16px] leading-tight">
            {experience.title}
          </h3>
          {experience.location && (
            <span className=" bg-[#D6D6D6] text-[#161616] font-inter font-medium text-[11px] px-2 py-0.5 rounded whitespace-nowrap ml-2">
              {experience.location}
            </span>
          )}
        </div>

        <p className="text-[12px] w-[248px] h-8 text-[#6C6C6C] mt-2 leading-relaxed object-cover">
          Curated small-group experience. Certified guide. Safety first with
          gear included.
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className=" flex items-center justify-between gap-2 text-[13px] text-black">
            From{" "}
            <span className=" text-black font-inter font-semibold text-[20px]">
              ₹{experience.price}
            </span>
          </div>

          <Link href={`/experiences/${experience._id}`}>
            <button className="cursor-pointer bg-[#FFD643] hover:bg-[#FFE273] text-gray-900 font-inter font-medium text-[14px] px-3 py-1.5 rounded transition-all duration-200">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

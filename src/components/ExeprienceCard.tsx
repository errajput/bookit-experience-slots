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
    <div className="bg-[#F0F0F0] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative w-full h-56">
        {experience.image ? (
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-56 bg-gray-200" />
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {experience.title}
          </h3>
          {experience.location && (
            <span className="text-sm bg-[#D6D6D6] text-gray-700 px-3 py-1 rounded-md whitespace-nowrap">
              {experience.location}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Curated small-group experience. Certified guide. Safety first with
          gear included.
        </p>

        <div className="flex items-center justify-between mt-5">
          <div className="text-sm text-gray-600">
            From{" "}
            <span className="font-bold text-black text-lg">
              ₹{experience.price}
            </span>
          </div>

          <Link href={`/experiences/${experience._id}`}>
            <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-medium px-5 py-2 rounded-md transition-colors duration-200 cursor-pointer">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

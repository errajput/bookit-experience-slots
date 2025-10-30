"use client";
import Link from "next/link";
import Image from "next/image";
import { Experience } from "@/lib/types";
import { useEffect, useState } from "react";
import { getExperience } from "@/services/experience.service";
import { useParams } from "next/navigation";

export default function Details() {
  const { id } = useParams();
  const [experience, setExperiences] = useState<Experience | null | undefined>(
    undefined
  );

  useEffect(() => {
    const loadExperience = async (id: string) => {
      try {
        const data = await getExperience(id);

        setExperiences(data || null);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    if (typeof id === "string") {
      loadExperience(id);
    }
  }, [id]);

  const dates = Array.from(
    new Set((experience?.slots || []).map((s) => s.date))
  ).sort();

  if (experience === undefined)
    return <p className="text-center">Loading...</p>;

  if (experience === null)
    return <p className="text-center text-red-500">Experience not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Image
            src={experience?.image || ""}
            alt={experience?.title || ""}
            width={300}
            height={100}
            // fill
            className="w-full rounded-lg h-64 object-cover"
          />
          <h2 className="text-2xl font-semibold mt-4">{experience?.title}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {experience?.description}
          </p>

          <div className="mt-6">
            <h4 className="font-medium">Choose date</h4>
            <div className="flex gap-2 mt-2 flex-wrap">
              {dates.map((d) => (
                <Link
                  key={d}
                  href={`/experiences/${id}?date=${d}`}
                  className="px-3 py-2 rounded border bg-gray-50 text-sm"
                >
                  {d}
                </Link>
              ))}
            </div>

            <h4 className="font-medium mt-4">Available times</h4>
            <div className="flex gap-2 mt-2 flex-wrap">
              {(experience?.slots || []).map((slot) => (
                <Link
                  key={slot._id}
                  href={`/checkout?experience=${id}&slot=${slot._id}`}
                  className={`px-3 py-2 rounded border text-sm ${
                    slot.bookedCount >= slot.capacity
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-gray-50"
                  }`}
                >
                  {slot.time}{" "}
                  {slot.bookedCount >= slot.capacity ? " (Sold)" : ""}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>From</span>
              <span className="font-bold">₹{experience?.price}</span>
            </div>
            <p className="text-xs text-gray-500">Includes gear and guide</p>
            <Link href={`/checkout?experience=${id}`} className="mt-4">
              <button className="w-full bg-brand px-4 py-2 rounded">
                Book Now
              </button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

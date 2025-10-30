import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// import API from "@/lib/api";
import { Experience, Slot } from "@/lib/types";
import Navbar from "@/components/Navbar";

// async function getExperience(id: string): Promise<Experience> {
//   try {
//     const res = await API.get(`/experiences/${id}`);
//     return res.data.data as Experience;
//   } catch (error) {
//     console.log("ERROR", error);

//     throw error;
//   }
// }

async function getExperience(id: string): Promise<Experience> {
  console.log("AAAA", id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/experiences/${id}`,
    {
      cache: "no-store",
    }
  );
  console.log("BBBB", res);

  if (!res.ok) throw new Error("Failed to fetch experiences");

  const data = await res.json();
  return data.data as Experience;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Details({ params }: Props) {
  const { id } = await params;
  const experience = await getExperience(id);
  if (!experience) return notFound();

  const dates = Array.from(
    new Set((experience.slots || []).map((s) => s.date))
  ).sort();

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Image
              src={experience.image}
              alt={experience.title}
              width={300}
              height={100}
              // fill
              className="w-full rounded-lg h-64 object-cover"
            />
            <h2 className="text-2xl font-semibold mt-4">{experience.title}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {experience.description}
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
                {(experience.slots || []).map((slot: Slot) => (
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
                <span className="font-bold">₹{experience.price}</span>
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
    </>
  );
}

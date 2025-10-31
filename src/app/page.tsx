"use client";
import ExperienceCard from "@/components/ExeprienceCard";
import { Experience } from "../lib/types";
import { useEffect, useState } from "react";
import { getExperiences } from "@/services/experience.service";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  useEffect(() => {
    const loadExperiences = async (q?: string | null) => {
      try {
        const data = await getExperiences(q);
        setExperiences(data || []);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    loadExperiences(q);
  }, [q]);

  return (
    <div className="max-w-6xl mx-auto pt-10 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {experiences?.map((exp) => (
          <ExperienceCard key={exp._id} experience={exp} />
        ))}
      </div>
    </div>
  );
}

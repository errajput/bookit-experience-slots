import { Experience } from "@/lib/types";

export const getExperiences = async (searchText?: string) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/experiences`;
  if (searchText) {
    url += `?q=${searchText}`;
  }
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch experiences");

  const data = await res.json();
  return data.data as Experience[];
};

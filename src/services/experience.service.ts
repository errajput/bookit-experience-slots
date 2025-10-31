import { Experience } from "@/lib/types";

export const getExperiences = async (searchText?: string | null) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/experiences`;
  if (searchText) {
    url += `?q=${searchText}`;
  }
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to fetch experiences");

  const data = await res.json();
  return data.data as Experience[];
};

export const getExperience = async (id: string): Promise<Experience> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/experiences/${id}`
  );
  if (!res.ok) throw new Error("Failed to fetch experiences");

  const data = await res.json();

  return data.data as Experience;
};

export const bookExperience = async (
  payload: unknown
): Promise<{ _id: string }> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.log("ERROR", res);
  }
  const data = await res.json();

  return data.data as { _id: string };
};

export const validatePromo = async (code: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promo/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    console.log("ERROR", res);
  }
  const data = await res.json();

  return data as { valid: boolean; discount: number };
};

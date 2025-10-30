const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// GET
export const getApi = async (path: string) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to get data.");

  return await res.json();
};

// POST
export const postApi = async (path: string, body: object) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);
  return data;
};

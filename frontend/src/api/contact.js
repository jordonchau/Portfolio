const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function sendMessage(data) {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Message failed to send. Please try again.");
  return res.json();
}
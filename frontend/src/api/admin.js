const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getMessages(token) {
  const res = await fetch(`${API_URL}/admin/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Failed to load messages");
  }
  return res.json();
}
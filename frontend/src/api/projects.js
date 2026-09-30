const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getProjects(featured = false) {
  const url = featured ? `${API_URL}/projects?featured=true` : `${API_URL}/projects`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}
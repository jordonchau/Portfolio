// function that calls the backend 

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getProjects() {
  const res = await fetch(`${API_URL}/projects`);
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}
import { useEffect, useState } from "react";
import { getProjects } from "../api/projects";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Loading projects...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <section>
      <h1 className="text-3xl font-bold text-white mb-8">Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}


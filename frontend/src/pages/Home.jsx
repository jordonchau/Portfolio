import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/projects";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects(true).then(setProjects).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col gap-6 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Hi, I'm Jordon.
        </h1>
        <p className="max-w-2xl text-lg text-gray-400">
          Data analyst and NJIT Business/Information Systems grad. I build end-to-end
          pipelines and dashboards that turn raw data into clear decisions.
        </p>
        <div className="flex gap-4">
          <Link
            to="/projects"
            className="rounded-lg bg-white px-5 py-2.5 font-medium text-gray-950 hover:bg-gray-200"
          >
            View Projects
          </Link>
          <Link
            to="/about"
            className="rounded-lg border border-gray-700 px-5 py-2.5 font-medium text-white hover:bg-gray-900"
          >
            About Me
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Featured Projects</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
export default function ProjectCard({ project }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-white">{project.title}</h2>
      <p className="text-gray-400">{project.summary}</p>

      {project.key_result && (
        <p className="text-emerald-400 font-medium">{project.key_result}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {project.stack.map((tool) => (
          <span key={tool} className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
            {tool} 
          </span>
        ))}
      </div>

      {project.github_url && (
        <a
          href={project.github_url}
          target="_blank"
          rel="noreferrer"
          className="mt-auto text-sm text-blue-400 hover:underline"
        >
          View on GitHub →
        </a>
      )}
    </div>
  );
}
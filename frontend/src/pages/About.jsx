const experience = [
  { role: "Data Analyst / Front-End Developer", company: "Tapyoca" },
  { role: "Data Analyst Intern", company: "Nissan Motor Corporation" },
  { role: "Business Analyst Intern", company: "GBCS Group" },
];

const skills = {
  Languages: ["SQL", "Python", "R"],
  "BI & Visualization": ["Power BI", "Tableau", "Looker", "Excel"],
  "Data Platforms": ["Snowflake", "Databricks"],
  "Web & Tools": ["React", "FastAPI", "PostgreSQL", "Git/GitHub"],
};

export default function About() {
  return (
    <div className="flex flex-col gap-12 max-w-3xl">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-white">About</h1>
        <p className="text-gray-400">
          B.S. in Business/Information Systems with an IT minor from NJIT (May 2026),
          based in Jersey City, NJ.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Experience</h2>
        <div className="flex flex-col gap-3">
          {experience.map((job) => (
            <div key={job.company} className="rounded-lg border border-gray-800 bg-gray-900 p-4">
              <p className="font-medium text-white">{job.role}</p>
              <p className="text-gray-400">{job.company}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
        <div className="flex flex-col gap-4">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group}>
              <p className="text-sm text-gray-500 mb-2">{group}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <span key={s} className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
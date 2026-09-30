import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-lg font-bold text-white">
          Jordon Chau
        </NavLink>
        <div className="flex gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                isActive ? "text-white font-medium" : "text-gray-400 hover:text-white"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
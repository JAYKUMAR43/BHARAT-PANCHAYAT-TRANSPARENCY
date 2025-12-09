import React from "react";

export default function ProjectList({ projects, onSelect }) {
  if (!projects || projects.length === 0) {
    return <p>No projects available.</p>;
  }

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-semibold mb-3">Projects</h2>

      <ul className="space-y-3">
        {projects.map((project) => (
          <li
            key={project.id}
            className="p-3 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(project.id)}
          >
            <p className="font-bold">{project.name}</p>
            <p className="text-sm text-gray-600">
              Status: {project.status || "N/A"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

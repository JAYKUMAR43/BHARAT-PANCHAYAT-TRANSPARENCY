import React, { useState, useEffect } from "react";
import LocationSelector from "./components/LocationSelector";
import ProjectList from "./components/ProjectList";
import ProjectDetail from "./components/ProjectDetail";
import Dashboard from "./components/Dashboard";
import OfficerPanel from "./components/OfficerPanel";
import PinVerification from "./components/PinVerification";
import { fetchProjectsByVillage } from "./api";

export default function App() {
  const [role, setRole] = useState(null);
  const [villageId, setVillageId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  async function handleVillageSelect(id) {
    setVillageId(id);
    setSelectedProjectId(null);
    const data = await fetchProjectsByVillage(id);
    setProjects(data || []);
  }

  useEffect(() => {
    if (selectedProjectId) {
      setTimeout(() => {
        document
          .getElementById("project-detail")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [selectedProjectId]);

  // Officer PIN Verification Screen
  if (role === "officer-auth") {
    return (
      <PinVerification
        onSuccess={() => setRole("officer")}
        onBack={() => setRole(null)}
      />
    );
  }

  // Officer Panel Screen
  if (role === "officer") return <OfficerPanel setRole={setRole} />;

  // Role Selection Screen
  if (!role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Select Your Role</h1>
        <div className="flex gap-6">
          <button
            onClick={() => setRole("citizen")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg"
          >
            Citizen
          </button>

          <button
            onClick={() => setRole("officer-auth")}
            className="px-6 py-3 bg-green-600 text-white rounded-xl text-lg"
          >
            Officer
          </button>
        </div>
      </div>
    );
  }

  // Citizen Dashboard
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => setRole(null)}
        className="mb-4 bg-gray-600 text-white px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">Citizen Dashboard</h1>

      <LocationSelector onVillageSelected={handleVillageSelect} />
      {villageId && <Dashboard villageId={villageId} />}

      {projects.length > 0 && (
        <ProjectList projects={projects} onSelect={setSelectedProjectId} />
      )}

      {selectedProjectId && (
        <div className="mt-8" id="project-detail">
          <ProjectDetail key={selectedProjectId} projectId={selectedProjectId} />
        </div>
      )}
    </div>
  );
}

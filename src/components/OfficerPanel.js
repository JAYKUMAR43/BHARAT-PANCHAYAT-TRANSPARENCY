/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import {
  fetchStates,
  fetchDistricts,
  fetchBlocks,
  fetchVillages,
  fetchProjectsByVillage,
  createProject,
  updateProject,
  deleteProject,
  fetchProblematicFeedbacks,
  fetchContractors
} from "../api";

import Sidebar from "./Sidebar";
import OfficerDashboard from "./OfficerDashboard";
import ContractorTab from "./ContractorTab";
import { motion, AnimatePresence } from "framer-motion";

export default function OfficerPanel({ setRole }) {

  const [tab, setTab] = useState("dashboard");

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);
  const [contractors, setContractors] = useState([]);

  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [blockId, setBlockId] = useState("");
  const [villageId, setVillageId] = useState("");

  const [projects, setProjects] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_year: "",
    duration_months: "",
    budget: "",
    spent: "",
    status: "ongoing",
    contractor_id: ""
  });

  // Load dropdown data once
  useEffect(() => {
    fetchStates().then((res) => setStates(res || []));
    fetchContractors().then((res) => setContractors(res || []));
  }, []);

  const resetLower = () => {
    setDistricts([]);
    setBlocks([]);
    setVillages([]);
    setDistrictId("");
    setBlockId("");
    setVillageId("");
  };

  useEffect(() => {
    if (!stateId) return resetLower();
    fetchDistricts(stateId).then((res) => setDistricts(res || []));
  }, [stateId]);

  useEffect(() => {
    if (!districtId) return;
    fetchBlocks(districtId).then((res) => setBlocks(res || []));
  }, [districtId]);

  useEffect(() => {
    if (!blockId) return;
    fetchVillages(blockId).then((res) => setVillages(res || []));
  }, [blockId]);

  useEffect(() => {
    if (!villageId) return setProjects([]);
    fetchProjectsByVillage(villageId).then((res) => setProjects(res || []));
  }, [villageId]);

  // Delete Project
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await deleteProject(id);
    fetchProjectsByVillage(villageId).then(setProjects);
  };

  // Submit form — Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      start_year: Number(form.start_year),
      duration_months: Number(form.duration_months),
      budget: Number(form.budget) || 0,
      spent: Number(form.spent) || 0,
      contractor_id: form.contractor_id ? Number(form.contractor_id) : null,
      village_id: Number(villageId)
    };

    editingProject
      ? await updateProject(editingProject.id, payload)
      : await createProject(payload);

    resetForm();
    fetchProjectsByVillage(villageId).then(setProjects);
  };

  const resetForm = () => {
    setEditingProject(null);
    setForm({
      name: "",
      description: "",
      start_year: "",
      duration_months: "",
      budget: "",
      spent: "",
      status: "ongoing",
      contractor_id: ""
    });
  };

  const handleEdit = (project) => {
    setTab("projects");
    setEditingProject(project);
    setForm({
      ...project,
      contractor_id: project.contractor_id || ""
    });
  };

  return (
    <div className="flex bg-[#F2F9F8] min-h-screen">

      <Sidebar current={tab} setCurrent={setTab} setRole={setRole} />

      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <motion.div key="dash">
              <OfficerDashboard projects={projects} />
            </motion.div>
          )}

          {/* PROJECTS TAB */}
          {tab === "projects" && (
            <motion.div key="projects">

              {/* Location Filters */}
              <div className="bg-white p-4 shadow rounded grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "State", value: stateId, setter: setStateId, items: states },
                  { label: "District", value: districtId, setter: setDistrictId, items: districts },
                  { label: "Block", value: blockId, setter: setBlockId, items: blocks },
                  { label: "Village", value: villageId, setter: setVillageId, items: villages }
                ].map((d, i) => (
                  <select
                    key={i}
                    className="p-2 border rounded"
                    disabled={i !== 0 && ![stateId, districtId, blockId][i - 1]}
                    value={d.value}
                    onChange={(e) => d.setter(e.target.value)}
                  >
                    <option value="">Select {d.label}</option>
                    {d.items.map((x) => (
                      <option key={x.id} value={x.id}>{x.name}</option>
                    ))}
                  </select>
                ))}
              </div>

              {/* ADD / EDIT Form */}
              {villageId && (
                <form className="bg-white p-4 rounded shadow space-y-3 mb-4" onSubmit={handleSubmit}>
                  
                  {["name", "description", "start_year", "duration_months", "budget", "spent"].map((x) => (
                    <input
                      key={x}
                      className="border p-2 rounded w-full"
                      placeholder={x.toUpperCase()}
                      value={form[x]}
                      onChange={(e) => setForm({ ...form, [x]: e.target.value })}
                    />
                  ))}

                  {/* Contractor Link √ */}
                  <select
                    className="border p-2 rounded w-full"
                    value={form.contractor_id}
                    onChange={(e) => setForm({ ...form, contractor_id: e.target.value })}
                  >
                    <option value="">Select Contractor</option>
                    {contractors.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <button className="bg-[#00796B] text-white px-4 py-2 rounded">
                    {editingProject ? "Update Project" : "Create Project"}
                  </button>
                </form>
              )}

              {/* PROJECT TABLE */}
              <table className="bg-white rounded shadow w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Contractor</th>
                    <th className="p-2">Budget</th>
                    <th className="p-2">Spent</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td className="border p-2">{p.name}</td>
                      <td className="border p-2">{p.status}</td>
                      <td className="border p-2">{p.contractor?.name || "N/A"}</td>
                      <td className="border p-2">₹{p.budget}</td>
                      <td className="border p-2">₹{p.spent}</td>
                      <td className="border p-2">
                        <button className="text-blue-600" onClick={() => handleEdit(p)}>Edit</button>{" "}
                        <button className="text-red-600" onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </motion.div>
          )}

          {/* CONTRACTOR TAB */}
          {tab === "contractors" && (
            <motion.div key="contr">
              <ContractorTab />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

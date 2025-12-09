import React, { useEffect, useState } from "react";
import { fetchContractors, addContractor, assignContractor } from "../api";

export default function ContractorTab({ projects, reload }) {
  const [contractors, setContractors] = useState([]);
  const [form, setForm] = useState({ name: "", company: "", phone: "" });

  async function load() {
    const data = await fetchContractors();
    setContractors(data || []);
  }

  useEffect(() => { load(); }, []);

  function handleChange(k, v) {
    setForm({ ...form, [k]: v });
  }

  async function create() {
    await addContractor(form);
    setForm({ name: "", company: "", phone: "" });
    load();
  }

  async function assign(pId, cId) {
    await assignContractor(pId, cId);
    reload();
    alert("Contractor Assigned!");
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold">👷 Contractor Management</h2>

      {/* Add Contractor */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {["name", "company", "phone"].map(x => (
          <input key={x} className="border p-2 rounded"
            placeholder={x.toUpperCase()}
            value={form[x]}
            onChange={(e) => handleChange(x, e.target.value)} />
        ))}
        <button className="bg-teal-700 text-white rounded p-2" onClick={create}>
          Add
        </button>
      </div>

      <hr className="my-4" />

      {/* Assign Contractors */}
      <h3 className="font-bold mb-2">Assign Contractor to Projects</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Project</th>
            <th className="p-2">Contractor</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id} className="border">
              <td className="p-2">{p.name}</td>
              <td className="p-2">
                <select className="border p-1"
                  value={p.contractor_id || ""}
                  onChange={(e) => assign(p.id, e.target.value)}>
                  <option value="">Select</option>
                  {contractors.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
